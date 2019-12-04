
function populate ( json ) {

  switch( json.page_type ) {
    case 'photo_360':
      document.getElementsByClassName("title")[0].innerHTML = json.page_title
      document.getElementsByClassName("story-title")[0].innerHTML = json.story_title
      document.getElementsByClassName("scrollable-story")[0].innerHTML += json.story_content
      console.log(json.hotspots)
      pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": json.image_1,
        "autoLoad": true,
        "hotSpotDebug": json.find_hotspots,
        "hotSpots": json.hotspots
      })
      break
    case 'two_photo':
      console.log("hi")
      document.getElementsByClassName("title")[0].innerHTML = json.page_title
      document.getElementsByClassName("story-title")[0].innerHTML = json.story_title
      document.getElementsByClassName("scrollable-story")[0].innerHTML += json.story_content
      document.getElementById("image_1").src = json.image_1 //this needs to change
      document.getElementById("image_2").src = json.image_2 // this too, add the "/assets/images/"
      break
  }
}

window.onload = function() {
  fetch('getTarget' + '?' + document.location.toString().split('?')[1], {
    method:'GET'
  }).then(function (response) {
    console.log( response ) 
    return response.json()
  }).then(function(json) {
    console.log( json )
    populate( json )
  })
}
