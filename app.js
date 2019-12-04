const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory 
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      port = 3000,
      dir = 'public/'
var target      

const server = http.createServer( function( request, response ) {
  if ( request.method === 'GET' ) {
    handleGet( request, response )    
  }
  else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  //console.log(request.url)
  const filename = request.url.slice( 1 )
  if ( request.url == '/' || request.url == '/index.html' ) {
    target = ""
    sendFile( response, 'index.html' )
  } 
  else if ( request.url == '/getdata' ) {
    response.writeHead( 200, "OK", {"Content-Type":"application/json"})
    fs.readFile('./json/stlfiles.json', 'utf8', function(err, contents) {
      response.end( contents );
    })
  }
  else if ( request.url.startsWith('/getTarget') ) {
	var arguments = request.url.split('?')[1]
    if ( arguments.length > 1 ) {
      var newTargetId = arguments[1].split('=')[1]
      fs.readFile( './json/rooms.json', 'utf8', function( err, contents ) {
        var pageData = JSON.parse ( contents )
        for ( var i = 0; i < pageData.rooms.length; i++ ) {
          if ( pageData.rooms[i].id == newTargetId ) {
            target = pageData.rooms[i]
          }
        }
      })
    }

    response.writeHead( 200, "OK", {"Content-Type":"application/json"} )
    response.end( JSON.stringify( target ))
  }
  else if (request.url.endsWith( '.png' ) || request.url.endsWith( '.jpg' )) {
    sendFile( response, './assets/images/' + filename )
  }
  else if (request.url.endsWith( '.stl')) {
    sendFile( response, './assets/stl/' + filename )
  }
  else if ( request.url.startsWith( '/src/', 0 )) {
    sendFile( response, filename )
  }
  else {
    var arguments = filename.split('?')
    if ( arguments.length > 1 ) {
      var newTargetId = arguments[1].split('=')[1]
      fs.readFile( './json/rooms.json', 'utf8', function( err, contents ) {
        var pageData = JSON.parse ( contents ) 
        for ( var i = 0; i < pageData.rooms.length; i++ ) {
          if ( pageData.rooms[i].id == newTargetId ) {
            target = pageData.rooms[i]
          }
        }
      })
    }
    sendFile( response, dir + arguments[0] )
  }
}

const handlePost = function( request, response ) {
  response.writeHeader( 404 )
  response.end( '404 Error: File Not Found' )
}

const getdata = function( response ) {
  response.writeHead( 200, "OK", {"Content-Type":"application/json"})
  fs.readFile('./stlfiles.json', 'utf8', function(err, contents) {
    response.end( contents );
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )
     }
     else {
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}

server.listen( process.env.PORT || port )
