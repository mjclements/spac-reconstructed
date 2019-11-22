
function populate ( json ) {

  document.getElementsByClassName("title")[0].innerHTML = json.title
  document.getElementsByClassName("story-title")[0].innerHTML = json.story_title
  document.getElementsByClassName("scrollable-story")[0].append(json.story)
  document.getElementsByClassName("second-row")[0].src = json.image

}

window.onload = function() {

  fetch('getTarget', {
    method:'GET'
  }).then(function (response) {
    console.log( response ) 
    return response.json()
  }).then(function(json) {
    //console.log( json )
    populate( json )
  })
}