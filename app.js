var http = require('http'),
    connect = require('connect'),
	harmon=require('harmon'),
    httpProxy = require('http-proxy');


var selects = [];
var simpleselect = {};

simpleselect.query = '#content';
simpleselect.func = function (node) {
	var text='<div class="ujian-hook"></div>';
		text+='<script type="text/javascript">var ujian_config = {num:12,picSize:84,textHeight:45};<\/script>';
		text+='<script type="text/javascript" src="http://v1.ujian.cc/code/ujian.js?uid=1581234"><\/script>';

	var stm = node.createStream({ "outer" : true });
	//variable to hold all the info from the data events
    var tag = '';

    //collect all the data in the stream
    stm.on('data', function(data) {
       tag += data;
    });

    //When the read side of the stream has ended..

    stm.on('end', function() {

      //Print out the tag you can also parse it or regex if you want
      process.stdout.write('tag:   ' + tag + '\n');
      process.stdout.write('end:   ' + node.name + '\n');
      
      //Now on the write side of the stream write some data using .end()
      //N.B. if end isn't called it will just hang.  
      
      stm.end(text);      
    
    }); 


	
    //node.createWriteStream().end('<div>+ Trumpet</div>');
}

selects.push(simpleselect);

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
   target: 'http://goldzhan.com',
   headers:{ host: 'goldzhan.com' }
})


app.use(harmon([], selects, true));

app.use(
  function (req, res) {
    proxy.web(req, res);
  }
);

http.createServer(app).listen(8080);
