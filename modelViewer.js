
import * as THREE from './modules/three.module.js'
import { STLLoader } from './modules/STLLoader.js'
import { OrbitControls } from './modules/OrbitControls.js'
import { OutlineEffect } from './modules/OutlineEffect.js'

var container, clickable = [], clickable_opacity = 0.8, clickable_color = 0xf02011
var camera, cameraTarget, scene, renderer, mesh, mouse, raycaster, effect, highlighted = false
var mouse = new THREE.Vector2(), INTERSECTED

init()
getData()
animate()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set(-500, 300, 600)
  cameraTarget = new THREE.Vector3(0, 15, 0)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xebf8fc)

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('click', onDocumentMouseClick, false)
  raycaster = new THREE.Raycaster()

  // // Lights
  // scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
  addShadowedLight(100, 100, 100, 0xffffff, 1.35) //1.35
  addShadowedLight(-100, 100, -100, 0xffffff, 1.35) //1.35
  //addShadowedLight(0.5, 1, -1, 0xffffff, 1)

  var light = new THREE.AmbientLight( 0xffffff, .5 ); // soft white light
  scene.add( light );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true

  effect = new OutlineEffect(renderer)
  container.appendChild(renderer.domElement)
  renderer.sortObjects = false

  // controls
  var controls = new OrbitControls(camera, renderer.domElement)
  controls.maxPolarAngle = Math.PI * 0.5
  controls.minDistance = 50
  controls.maxDistance = 1000

  // object = new THREE.Mesh( new THREE.SphereBufferGeometry( 75, 20, 10 ), material );
  var geometry = new THREE.SphereGeometry(25, 25, 25)
  var material = new THREE.MeshLambertMaterial({/*color:0xf02011, */transparent: true, /*emissive: 0x000000,*/ flatShading: true})
  material.opacity = clickable_opacity
  var sphere = new THREE.Mesh(geometry, material)
  sphere.position.set(-15, 6, -10)
  sphere.scale.set(0.15,0.15,0.15)
  scene.add( sphere )
  clickable.push({ uuid : sphere.uuid, link : "volleyball.html" })

  //* ** for dev, remove
   geometry = new THREE.BoxGeometry(1, 1, 1)
   material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
   var cube = new THREE.Mesh(geometry, material)
   scene.add(cube)
  //* **

  // ground
  var texture = new THREE.TextureLoader().load('assets/images/overview.JPG')
  var material = new THREE.MeshLambertMaterial({ map: texture })
  var groundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 150), material)
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.rotation.z = -0.14
  groundMesh.position.y = -0.5
  scene.add(groundMesh)

  window.addEventListener('resize', onWindowResize, false)
}

function onDocumentMouseMove (event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function onDocumentMouseClick (event) {
  event.preventDefault()
  clickable.forEach(function(element) {
    //console.log(element.link)
    if (INTERSECTED && INTERSECTED.uuid == element.uuid) {
      window.location = element.link
    }
  })
}

function addShadowedLight (x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(x, y, z)
  scene.add(directionalLight)

  directionalLight.castShadow = true
  var d = 1
  directionalLight.shadow.camera.left = -d
  directionalLight.shadow.camera.right = d
  directionalLight.shadow.camera.top = d
  directionalLight.shadow.camera.bottom = -d
  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 4
  directionalLight.shadow.bias = -0.002
}

function getData () {
  fetch('/getdata', {
    method: 'GET'
  }).then(function (response) {
      console.log(response)
      return response.json()
    }).then(function (json) {
        // console.log(json)
        loadModels(json)
      })
  return false
}

function loadModels (json) {
  var loader = new STLLoader() // var name

  json.clickable.forEach(function (element) {
    loader.load(element.file_name, function (geometry) {
      var material = new THREE.MeshLambertMaterial({
        /*color: 0xfa8787, /*specular: 0x111111,
        /* emissive: 0xff0000, shininess: 10, */
        flatShading: true, transparent: true
      })
      material.opacity = clickable_opacity

      mesh = new THREE.Mesh(geometry, material) // declared globally
      mesh.position.set(-43, 3, 15)
      mesh.scale.set(0.019, 0.02, 0.02)
      mesh.castShadow = true
      mesh.receiveShadow = true

      var clickable_room = { file_name : element.file_name, uuid : mesh.uuid, link : element.link }
      //console.log(clickable_room)
      clickable.push(clickable_room)
      scene.add(mesh)
    })
  })
  json.not_clickable.forEach(function (element) {
    loader.load(element.file_name, function (geometry) {
      var material = new THREE.MeshLambertMaterial({
        color: 0x545252, /*specular: 0x111111,
        /*shininess: 30, /* emissive: 0xff0000,*/
        transparent: true, flatShading: true
      })

      material.polygonOffset = true
      material.polygonOffsetFactor = -2 // positive value pushes polygon further away
      material.polygonOffsetUnits = 1
      material.needsUpdate = true
      material.opacity = 0.6

      mesh = new THREE.Mesh(geometry, material) // declared globally
      mesh.position.set(-43, 3, 15)
      mesh.scale.set(0.019, 0.02, 0.02)
      mesh.castShadow = true
      mesh.receiveShadow = true
      // if (element.hasOwnProperty('clickable')) clickable.push(mesh.uuid);
      scene.add(mesh)
    })
  })
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  //var timer = Date.now() * 0.0005

  //var color = 0xfa8787
  // scene.rotation.y = timer

  camera.lookAt(cameraTarget)

  raycaster.setFromCamera(mouse, camera)
  var intersects = raycaster.intersectObjects(scene.children)

  for (var i = 0; i < intersects.length; i++) {
    clickable.forEach(function (element) {
      if (intersects[i].object.uuid === element.uuid) {
        highlighted = true
        if (INTERSECTED != intersects[i].object) {
          if (INTERSECTED) {
            //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
          }
          INTERSECTED = intersects[i].object
          //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
          //INTERSECTED.material.emissive.setHex(0xff0000)
          INTERSECTED.material.color.setHex(0xff0000)
        }
      } else {
        if (!highlighted) {
          if (INTERSECTED) {
            //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
            INTERSECTED.material.color.setHex(clickable_color)
          }
          INTERSECTED = null
        }
      }
    })
  }
  highlighted = false
  if (intersects.length == 0) {
    if (INTERSECTED) {
      //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      INTERSECTED.material.color.setHex(clickable_color)
    }
    INTERSECTED = null
  }
  // renderer.render(scene, camera)
  effect.render(scene, camera)
}
