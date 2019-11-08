const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      port = 3000

const server = http.createServer( function( request,response ) {
  if ( request.method === 'GET' ) {
    handleGet( request, response )    
  }
  else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = /*dir +*/ request.url.slice( 1 ) 
  if ( request.url === '/' ) {
    sendFile( response, './index.html' )
  } 
  else if ( request.url == '/getdata' ){
    getdata( response )
  }
  else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if ( request.url === '/newEntry') {
    response.writeHeader( 404 )
    response.end( '404 Error: File Not Found' )

    //newEntry( request, response )
  } /*
  else if ( request.url === '/editEntry' ) {
    //editEntry( request, response )
  }
  else if ( request.url === '/deleteEntry' ) {
    deleteEntry( request, response )
  }
  */
  else {
    response.writeHeader( 404 )
    response.end( '404 Error: File Not Found' )
  }
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
