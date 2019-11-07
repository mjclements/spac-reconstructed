
import * as THREE from './build/three.module.js'

import { STLLoader } from './examples/jsm/loaders/STLLoader.js'

import { OrbitControls } from './examples/jsm/controls/OrbitControls.js'

var container; var clickable = []

var camera, cameraTarget, scene, renderer, mesh, mouse, raycaster

var mouse = new THREE.Vector2(); var INTERSECTED

init()
getData()
animate()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set(-500, 300, 600)

  cameraTarget = new THREE.Vector3(0, 0, 0)  //y = 25
  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xebf8fc );

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  raycaster = new THREE.Raycaster()

  // Lights
  scene.add(new THREE.HemisphereLight(0x443333, 0x111122))

  addShadowedLight(1, 1, 1, 0xffffff, 1.35)
<<<<<<< Updated upstream
  addShadowedLight(0.5, 1, -1, 0xffaa00, 1)
=======
  addShadowedLight(0.5, 1, -1, 0xffffff, 1)
>>>>>>> Stashed changes

  var light = new THREE.AmbientLight( 0xffffff, .5 ); // soft white light
  scene.add( light );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)


  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true

  container.appendChild(renderer.domElement)

  renderer.sortObjects = false;

  // controls
  var controls = new OrbitControls(camera, renderer.domElement)
  controls.maxPolarAngle = Math.PI * 0.5
  controls.minDistance = 100
  controls.maxDistance = 1000

  window.addEventListener('resize', onWindowResize, false)
}

function onDocumentMouseMove (event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
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
  })
    .then(function (response) {
      console.log(response)
      return response.json()
    })
    .then(function (json) {
      // console.log(json)
      loadModels(json)
    })
  return false
}

function loadModels (json) {
  var solids = []
  var name
  json.files.forEach(function (element) {
    if (element.hasOwnProperty('clickable')) name = element.clickable
    else name = element.not_clickable


<<<<<<< Updated upstream
    loader.load(name, function (geometry) {
      if (!element.hasOwnProperty('clickable')) {
        var material = new THREE.MeshPhongMaterial({ color: 0x5a5d5e, specular: 0x111111,  shininess: 200, 
           transparent: false,depthWrite: true/*, /*flatShading:true/*, side:THREE.DoubleSide*/})
          //material.side = THREE.DoubleSide;
          //material.emissive.setHex( emissiveDefault );
          material.polygonOffset = true;
          material.polygonOffsetFactor = -2; // positive value pushes polygon further away
          material.polygonOffsetUnits = 1;
          material.needsUpdate = true;
          material.opacity = 1
      } else {
        var material = new THREE.MeshPhongMaterial({ color: 0xababab, specular: 0x111111,  shininess: 200/*,flatShading:true*/})
=======

    console.log(name)
    var loader = new STLLoader();
    loader.load( name, function ( geometry ) {

      
       //var mesh = new THREE.Mesh( geometry, material );
      
       // For example:
      
        var materials = [];
        var nGeometryGroups = geometry.groups.length;
        console.log(nGeometryGroups)
      
        //var colorMap = ...; // Some logic to index colors.
        var colorMap = [0x66f542,0xecb888,0x4287f5, 0x66f542, 0x66f542, 0x66f542, 0x66f542, 0x66f542, 0x66f542]
      
        for (var i = 0; i < nGeometryGroups; i++) {
      
      		var material = new THREE.MeshPhongMaterial({
      			color: colorMap[i],
      			wireframe: false
      	});
>>>>>>> Stashed changes
      }
      
      materials.push(material);
      var mesh = new THREE.Mesh(geometry, materials);
      mesh.scale.set(0.019,0.02,0.02)

      scene.add( mesh )

       /*

      var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.set( 0, - 0.25, 0.6 );
      //mesh.rotation.set( 0, - Math.PI / 2, 0 );
      mesh.scale.set( 0.019, 0.02, 0.02 );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add( mesh );
      */
      
    } );
    

      // console.log(name + " has been loaded")
  })



//binary, previously working
// function loadModels (json) {
//   var loader = new STLLoader(); var name
//   json.files.forEach(function (element) {
//     if (element.hasOwnProperty('clickable')) name = element.clickable
//     else name = element.not_clickable

//     console.log(name)

//     loader.load(name, function (geometry) {
//       if (!element.hasOwnProperty('clickable')) {
//         var material = new THREE.MeshPhongMaterial({ color: 0x5a5d5e, specular: 0x111111,  shininess: 200, 
//            transparent: true,/* depthWrite: false /*, /*flatShading:true/*/})

//           material.polygonOffset = true;
//           material.polygonOffsetFactor = -2; // positive value pushes polygon further away
//           material.polygonOffsetUnits = 1;
//           material.needsUpdate = true;
//           material.opacity = 0.8
//       } else {
//         var material = new THREE.MeshPhongMaterial({ color: 0xababab, specular: 0x111111,  shininess: 200/*,flatShading:true*/})

//       }

//       mesh = new THREE.Mesh(geometry, material) // declared globally

//       mesh.position.set(-43, 0, 1) 
//       mesh.scale.set(0.019, 0.02, 0.02) 
//       mesh.castShadow = true
//       mesh.receiveShadow = true

//       if (element.hasOwnProperty('clickable')) clickable.push(mesh.uuid);

//       scene.add(mesh)

//       // console.log(name + " has been loaded")
//     })
//   })

  //* ** for dev, remove
  var geometry = new THREE.BoxGeometry(1, 1, 1)
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  var cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  //* **

  // ground
  var texture = new THREE.TextureLoader().load('assets/images/overview.JPG')
  var material = new THREE.MeshLambertMaterial( { map: texture } );
  var groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 150 ), material );
  groundMesh.rotation.x = - Math.PI / 2;
  groundMesh.rotation.z = -0.14
  groundMesh.position.y = - 0.5;

  scene.add( groundMesh );
  //mesh.receiveShadow = true;
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
  var timer = Date.now() * 0.0005
  var highlighted = false
  // scene.rotation.y = timer

  camera.lookAt(cameraTarget)

  raycaster.setFromCamera(mouse, camera)
  var intersects = raycaster.intersectObjects(scene.children)

  for (var i = 0; i < intersects.length; i++) {
    clickable.forEach(function (element) {
      if (intersects[i].object.uuid === element) {
        highlighted = true
        if (INTERSECTED != intersects[i].object) {
          if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          INTERSECTED = intersects[i].object
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.material.emissive.setHex(0xff0000)
        }
      } else {
        if (!highlighted) {
          if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          INTERSECTED = null
        }
      }
    })
  }
  highlighted = false
  if (intersects.length == 0) {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
    INTERSECTED = null
  }
  renderer.render(scene, camera)
}
