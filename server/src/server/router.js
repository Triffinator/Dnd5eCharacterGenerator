var http = require("http");
var fs = require("fs");
var path = require("path");

var endpointHandlers = require("./endpointHandlers.js");

function GetBody(filename, request, response)
{
  if(filename.includes("\."))
  {
    filetype = filename.split("\.")[1];

    filename = path.join(filetype, "/", filename);

    fs.readFile(filename, function(err, data) {
      if (err) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        return response.end("404 File Not Found: " + filename);
      }
      response.writeHead(200, {"Content-Type": "text/" + filetype});
      response.write(data);
      return response.end();
    });
  }
  else
  {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("404 Endpoint Not Found: " + filename);
  }
}

function route(endpoint, request, response)
{
  switch(endpoint)
  {
    case "/DisplayRaceStatistics":
      endpointHandlers.DisplayRaceStatistics(endpoint, request, response);
      break;
    case "/DisplayClassStatistics":
      endpointHandlers.DisplayClassStatistics(endpoint, request, response);
      break;
    case "/InsertCharacterInformation":
      endpointHandlers.InsertCharacterInformation(endpoint, request, response);
      break;
    default:
      GetBody(endpoint, request, response)
      break;
  }
}

exports.route = route;
