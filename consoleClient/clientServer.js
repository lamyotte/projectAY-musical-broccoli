var express = require('express')
var app = express()
var router = express.Router();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.listen(8000, '0.0.0.0', function() {
    console.log('App listening on port 8000!');
});