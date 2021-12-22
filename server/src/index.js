var http = require( "http" );
var url = require( "url" );

var router = require( "./server/router.js" );

var port = 8080;

function HandleRequest( endpoint, request, response )
{
  router.route( endpoint, request, response );
}

http.createServer( function (request, response) {
  var query = url.parse( request.url, true );

  var pathname = query.pathname;

  console.log( "handling request for: " + pathname );

  HandleRequest( pathname, request, response )

} ).listen( port, function(){ 
		console.log("Server up and listening on: " + port) 
	} );
