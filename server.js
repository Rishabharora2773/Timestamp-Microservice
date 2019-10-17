var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/hello', (req,res) => {
  res.send('Hi, Rishab!');
});

app.get('/api/timestamp/', (req,res) => {
  var currentDateUnix = Date.now();
  var currentDateUtc = new Date(Date.now()).toUTCString();
  res.json({
    unix: currentDateUnix,
    utc: currentDateUtc
  })
});

var date = Date.parse('2015-12-25');
//console.log(isNaN(date));
app.get('/api/timestamp/:date', (req, res) => {
  var date = Date.parse(req.params.date);        // return NaN if date is out of bound or not valid
  //console.log(isNaN(Number(req.params.date)));

  // Cases like: when date is not valid(2015-12-32) or if it is something like string 'foo'
  if(isNaN(date) && isNaN(Number(req.params.date))){
    return res.json({
      error:"Invalid Date"
    });
  }
  
  // handles type of date 2015-12-31
  if(isNaN(Number(req.params.date))){
    var unixTime = new Date(date).getTime();
    var utcTime = new Date(date).toUTCString();

    return res.json({
      unix:unixTime,
      utc:utcTime
    });
  }
  
  // handles type of unix date
  var unixTime = Number(req.params.date);
  return res.json({
    unix:unixTime,
    utc:new Date(unixTime).toUTCString()
  });
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});