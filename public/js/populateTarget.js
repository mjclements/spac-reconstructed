//import { getTarget } from './modelViewer.js';

/*
function collectTargetData( title ) {

  var json = { "title": title },
      body = JSON.stringify( json )

  fetch('/findTarget', {
    method: 'GET',
    body
  }).then(function (response) {
      console.log(response)
      return response.json()
    }).then(function (json) {
        console.log(json)
        populate( json )
      })
}
*/

function populate ( json ) {
  console.log("hi")
  console.log( json )
}

window.onload = function() {
  console.log("heyyyyyyyyy")

  //var target = getTarget()
  //console.log( "hi im the target" + target )
  console.log(window.location.pathname)

  fetch('getTarget', {
    method:'GET'
  }).then(function (response) {
    console.log( response ) 
    return response.json()
  }).then(function(json) {
    console.log( json )
    populate( json )
  })

  //populate( target )
}