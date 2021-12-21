var http = require("http");
var fs = require("fs");
var path = require("path");
var mongo = require("mongodb");
var mongoClient = mongo.MongoClient;

const { v4: uuidv4 } = require('uuid');

var databaseUrl = "mongodb://localhost:4330/";

function Error405(endpoint, request, response, desiredRequestType)
{
  response.writeHead(405, {"Content-Type": "text/plain"});
  response.write("Error 405! " + request.method + " is not allowed for this query.");
  response.write("Please try using a POST query, instead.");
  return response.end();
}

function DisplayRaceStatistics(endpoint, request, response)
{
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Success!");
  return response.end();
}

function DisplayClassStatistics(endpoint, request, response)
{
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Success!");
  return response.end();
}

function GetFieldID(item, type, query, database, callback)
{
  var id = 0;

  database.collection(type).findOne(query, function(err, result){
    if(!result)
    {
      item._id = uuidv4();
      id = item._id;

      console.log(type + " not found in database.");
      database.collection(type).insertOne(item, function(err, res) {
        if (err) throw err;
        console.log("1 " + type + " inserted.");
      });
    }
    else
    {
      id = result._id;
    }

    callback(id);
  });
}

function GenerateCharacter(characterObj, database, callback)
{
  GetFieldID(characterObj.characterRace, "race", {raceName: characterObj.characterRace.raceName}, database, function(raceid)
  {
    var raceID = raceid;

    GetFieldID(characterObj.characterClass, "class", {className: characterObj.characterClass.className}, database, function(classid)
    {
      var classID = classid;

      GetFieldID(characterObj.characterBackground, "background", {backgroundName: characterObj.characterBackground.backgroundName}, database, function(backgroundid)
      {
        var backgroundID = backgroundid;

        var characterID = uuidv4();

        var characterEntry = {
          _id : characterID,
          race : {
            _id : raceID
          },
          subrace : characterObj.characterSubrace,
          class :
          {
            _id : classID
          },
          alignment : characterObj.characterAlignment,
          statistics : characterObj.characterStatistics,
          deity : characterObj.characterDeity,
          background : {
            _id : backgroundID
          },
          age : characterObj.characterAge,
          gender : characterObj.characterGender
        };

        callback(characterEntry);
      });
    });
  });
}

function InsertCharacterInformation(endpoint, request, response)
{
  switch(request.method)
  {
    case "POST":
      let body = '';

      request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });

      request.on('end', () => {
        var characterObj = JSON.parse(body);

        mongoClient.connect(databaseUrl, function(err, db) {
          if(err)
          {
              response.writeHead(204, {"Content-Type": "text/plain"});
              response.write("POST request received. Failed to contact Mongo DB.");
              response.end(err);
              throw(err);
          }

          database = db.db("characterGenerator");

          GenerateCharacter(characterObj, database, function(character)
          {
            var characterEntry = character;
            console.log(characterEntry);

            database.collection("characters").insertOne(characterEntry, function(err, res) {
              if (err) throw err;
              console.log("1 character inserted.");
            });

            db.close;
          });

          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write("POST request received.");
          response.end(body);
        });
      });
      break;
    default:
      return Error405(endpoint, request, response, "POST");
  }
}

exports.DisplayRaceStatistics = DisplayRaceStatistics;
exports.DisplayClassStatistics = DisplayClassStatistics;
exports.InsertCharacterInformation = InsertCharacterInformation;
