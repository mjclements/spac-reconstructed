
import * as THREE from '../../src/three.module.js'
import { GUI } from '../../src/dat.gui.module.js';
import { STLLoader } from '../../src/STLLoader.js'
import { OrbitControls } from '../../src/OrbitControls.js'


var container, clickable = [], clickable_opacity = 0.8, clickable_color = 0xf02011
var camera, cameraTarget, scene, renderer, mesh, mouse, raycaster, effect, highlighted = false, directionalLight
var mouse = new THREE.Vector2(), INTERSECTED, emissiveDefault = 0x000000, gui, clicked, target
var x_pos, x_rot, y_pos, y_rot, z_pos, z_rot

var emissiveDefault = 0x000000,
    emissiveHighlight = 0xff0000

init()
getData()
animate()

function init () {
  container = document.createElement('div')
  document.getElementById("model").appendChild(container)

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set(-131, 137, 236)
  cameraTarget = new THREE.Vector3(100, 15, 0)

  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xebf8fc )

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('click', onDocumentMouseClick, false)
  raycaster = new THREE.Raycaster()

  // lights
  var light = new THREE.AmbientLight( 0x333333 , .5 ); // soft white light
  scene.add( light );

  directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
  directionalLight.position.set( 0, 0, 0.1 );
  scene.add( directionalLight );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight - document.getElementById("title-bar").clientHeight)
  renderer.setClearColor( 0x666666 );

  container.appendChild(renderer.domElement)

  //gui = new GUI();

  // controls
  var controls = new OrbitControls(camera, renderer.domElement)
  controls.maxPolarAngle = Math.PI * 0.5
  /*
  controls.scaleFactor = 0.04;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.2;
  controls.enablePan = false;
  */
 // need anohter line to work in render
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.008;
  /*
  controls.maxPolarAngle = 1.1;
  controls.minPolarAngle = 0.7;
  controls.enableKeys = false;
  controls.minDistance = 40;
  controls.maxDistance = 400;
  */

  window.addEventListener('resize', onWindowResize, false)
}

function onDocumentMouseMove (event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1.07
}

function onDocumentMouseClick (event) {
  event.preventDefault()
  clickable.forEach(function(element) {
    if (INTERSECTED && INTERSECTED.uuid == element.uuid) {

      target = element.target
      switch( element.target.page_type ) {
        case 'photo_360':
          window.location = 'photo_360.html?id=' + element.target.id
          break
        case 'two_photo':
          window.location = 'two_photo.html?id=' + element.target.id
          break
      }

      // x_pos = gui.add(INTERSECTED.position, 'x', -100, 100).name('x_pos').listen()
      // y_pos = gui.add(INTERSECTED.position, 'y', -100, 100).name('y_pos').listen()
      // z_pos = gui.add(INTERSECTED.position, 'z', -100, 100).name('z_pos').listen()
      // x_rot = gui.add(INTERSECTED.rotation, 'x', -100, 100).name('x_rot').listen()
      // y_rot = gui.add(INTERSECTED.rotation, 'y', -100, 100).name('y_rot').listen()
      // z_rot = gui.add(INTERSECTED.rotation, 'z', -100, 100).name('z_rot').listen()
      // cameraTarget = new THREE.Vector3(INTERSECTED.position.x,INTERSECTED.position.y,INTERSECTED.position.z)
    }
  })
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
  var loader = new STLLoader() 

  json.clickable.forEach(function (element) {
    loader.load(element.file_name, function (geometry) {
      var material = new THREE.MeshLambertMaterial({ color: 0xff5959, flatShading: true, transparent: true })
      material.opacity = clickable_opacity

      material.polygonOffset = true
      material.polygonOffsetFactor = -2 // positive value pushes polygon further away
      material.polygonOffsetUnits = 1
      material.needsUpdate = true

      mesh = new THREE.Mesh(geometry, material) 
      mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
      mesh.scale.set(element.scale, element.scale, element.scale)
      mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot),THREE.Math.degToRad(element.z_rot))

      mesh.castShadow = true
      mesh.receiveShadow = true

      var clickable_room = { file_name : element.file_name, uuid : mesh.uuid, target : element.target }
      clickable.push(clickable_room)
      scene.add(mesh)
    })
  })
  json.not_clickable.forEach(function (element) {
    loader.load(element.file_name, function (geometry) {
      var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, flatShading: true })
      material.opacity = 0.6

      material.polygonOffset = true
      material.polygonOffsetFactor = 1 // positive value pushes polygon further away 
      material.polygonOffsetUnits = 1
      material.needsUpdate = true

      mesh = new THREE.Mesh(geometry, material) 
      mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
      mesh.scale.set(element.scale, element.scale, element.scale)
      mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot),THREE.Math.degToRad(element.z_rot))

      mesh.castShadow = true
      mesh.receiveShadow = true

      scene.add(mesh)
    })
  })
  json.orbs.forEach(function (element) {
    var geometry = new THREE.SphereGeometry(25, 25, 25)
    var material = new THREE.MeshLambertMaterial({color: 0xff5959, transparent: true, flatShading: true})
    material.opacity = clickable_opacity

    material.polygonOffset = true;
    material.polygonOffsetFactor = -2; // positive value pushes polygon further away
    material.polygonOffsetUnits = 1;
    material.needsUpdate = true

    var sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(element.x_pos, element.y_pos, element.z_pos)
    sphere.scale.set(element.size,element.size,element.size)

    var clickable_orb = { uuid : sphere.uuid, target : element.target }
    clickable.push(clickable_orb)
    
    scene.add( sphere )
  })
  json.terrain.forEach(function (element) {
    loader.load(element.file_name, function (geometry) {
      var material = new THREE.MeshLambertMaterial({ color: parseInt(element.color) })

      material.polygonOffset = true
      material.polygonOffsetFactor = 1 // positive value pushes polygon further away 
      material.polygonOffsetUnits = 1
      material.needsUpdate = true

      mesh = new THREE.Mesh(geometry, material) 
      mesh.position.set(element.x_pos, element.y_pos, element.z_pos)
      mesh.scale.set(element.scale, element.scale, element.scale)
      mesh.rotation.set(THREE.Math.degToRad(element.x_rot), THREE.Math.degToRad(element.y_rot),THREE.Math.degToRad(element.z_rot))

      mesh.castShadow = true
      mesh.receiveShadow = true

      scene.add(mesh)
    })
  })
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight 
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - document.getElementById("title-bar").clientHeight)
}

function mark( object3D ) {
  object3D.material.emissive.setHex( emissiveHighlight )
  object3D.material.opacity = 1.0
  object3D.material.needsUpdate = true
}

function unmark( object3D  ) {
  object3D.material.emissive.setHex( emissiveDefault )
  object3D.material.opacity = clickable_opacity
  object3D.material.needsUpdate = true
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
          if (INTERSECTED) { unmark(INTERSECTED) } 
          INTERSECTED = intersects[i].object
          mark(INTERSECTED)
        }
      } else if (!highlighted) {
          if (INTERSECTED) { unmark(INTERSECTED) }
          INTERSECTED = null
      }
    })
  }
  highlighted = false
  if (intersects.length == 0) {
    if (INTERSECTED) { unmark(INTERSECTED) }
    INTERSECTED = null
  }

  directionalLight.position.copy( camera.position );
  renderer.render(scene, camera)
}

export function getTarget() { 
  console.log( "get target " + target )
  return target
}
