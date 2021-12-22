$nodeArgs = '-NoExit -Command "node .\server\src\index.js"'
$mongoArgs = '-NoExit -Command "mongod --port 27017 --dbpath .\database\data\db"'

$nodeInstance = Start-Process Powershell -ArgumentList $nodeArgs
$mongoInstance = Start-Process Powershell -ArgumentList $mongoArgs