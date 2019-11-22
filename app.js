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
  const filename = request.url.slice( 1 )
  if ( request.url === '/' ) {
    target = ""
    sendFile( response, dir +'index.html' )
  } 
  else if ( request.url == '/getdata' ) {
    getdata( response )
  }
  else if (request.url == '/getTarget') {
    response.writeHead( 200, "OK", {"Content-Type":"application/json"} )
    response.end( JSON.stringify( target ))
  }
  else if ( request.url.startsWith('/src/', 0) || request.url.startsWith('/assets/', 0)  ) {
    sendFile(response, filename)
  }
  else {
    var shortfile = filename.split('?')
    if (shortfile.length > 1) {
      var newTarget = shortfile[1].split('=')[1]
      fs.readFile('./rooms.json', 'utf8', function(err, contents) {
        appdata = JSON.parse ( contents ) 
        for ( var i = 0; i < appdata.rooms.length; i++) {
          if (appdata.rooms[i].id == newTarget) {
            target = appdata.rooms[i]
          }
        }
      })
    }
    sendFile( response, dir + shortfile[0] )
  }
}

const handlePost = function( request, response ) {
   if ( request.url == '/findTarget' ) {
    findTarget( request, response )
  }
  else {
    response.writeHeader( 404 )
    response.end( '404 Error: File Not Found' )
  }
}

const findTarget = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data 
  })

  request.on( 'end', function() {
    var appdata;
    fs.readFile('./rooms.json', 'utf8', function(err, contents) {
      appdata = JSON.parse ( contents )  
      var entry = JSON.parse(dataString)
      for ( var i = 0; i < appdata.rooms.length; i++) {
        if (appdata.rooms[i].page_title === entry.page_title) {
          target = appdata.rooms[i]
          response.writeHead( 200, "OK", {"Content-Type":"application/json"} )
          response.end( JSON.stringify( target.page_type ))
        }
      }
    })
  }) 
  // TO-DO: Error case
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
       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )
     }
     else {
       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}

server.listen( process.env.PORT || port )
