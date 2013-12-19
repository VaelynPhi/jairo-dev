/*
	TODO:
		Add firewall rule to block jainode service through wan port (unless enabled)
		Restrict origins if possible
*/


//INCLUDE BUILT IN MODULES:
var fs 		= require('fs');
var util 	= require('util');
var io 		= require('socket.io').listen(31400, {
		"log level": 1,
		"origins": "*:80"
});

// FTR, HERE'S HOW TO INCLUDE MY OWN MODULE
// var Do_sed = require('./sed.js');
// TO USE IT
// Do-sed.function()



//USE THIS LATER TO CHECK FOR ERRORS
//(including socket allows us to use socket.emit, etc.)
function error(socket, msg) {
	if(socket) {
		socket.emit('sdata', {
			smsg: 'Error: '+ msg +'.'
		});
	}else {
		console.log(msg);
	}
}



//USE THIS LATER TO READ ETC FILE
function loadConfig(){
	var etc = false;
	//attempt to parse etc.js into an editable object
	try {
			etc = JSON.parse(fs.readFileSync("../apps/basicNetwork/etc.js"))
	}
	//if no luck, tell me why it can't be parsed
	catch(e) {
			console.log(util.inspect(e, {depth:null}))
			/*
				To throw or not to throw?
				Throwing this crashes our node.js instance.
			*/
			//throw(e);
	}
	return etc;
}



//USE THIS LATER TO UPDATE CONFIG FILE
function save(socket, cdata) {
	var stuffIsaved = [];
	var msgContent 	= JSON.parse(cdata.cmsg);

	for (var i in msgContent) {
		//Turn section_prop => section.prop so we can drill into etc.js json object
		stuffIsaved.push( i.replace("_",".") )
	}

	//if the client hasn't sent anything
	if (stuffIsaved.length < 1) {
		socket.emit('sdata', {
			smsg: 'Nothing to save.'
		});
		return;
	}

	//(loadConfig returns etc as status report)
	var etc = loadConfig();
	// if the server can't read the config file
	if (etc==false) {
		error(socket, "Config file failed to load.")
		return;
	}

// Set config object values (this should call a predefined function: setEtc() { for each item in stuffIsaved, etc.[i]=i.val()})
// Save config to file (this should call a predefined function: writeEtc() {fs.writefileSync}
// Call/queue config section callbacks (this updates config files)


// let client know we're done
	socket.emit('sdata', {
		smsg: 'Saved configuration messages for "'+ stuffIsaved.join(',') +'".'
	});

}


io.sockets.on('connection', function(socket){
// send message to client signaling connection established
//	socket.emit('sdata', { smsg: 'Connected.' }); 

	// handler for receiving client messages
	socket.on('cdata', function(cdata){		

		// When a message from the client arrives, send a receipt message; this is really for debugging - uses noty!
//		socket.emit('sdata', { smsg: 'I received your message: "'+ cdata.cmsg +'".'});
		

		console.log(JSON.stringify(cdata, null, 2));

		// This switch figures out what section has been modified, then modifies appropriate files
		switch (cdata.cmsgType) {
			case 'save':
				{ 
					save(socket, cdata); 
					break; 
				}

			case 'staticips':
		  	//this is how you get information from interface
				console.log((cdata.cmsg)[0].mac);

				var content;
				//read the existing file
				fs.readFile('etc.js', function read(err, data) {
				    //tell me if there's a problem
				    if (err) {throw err;}
				    content = data;  
				    //do this function defined below
				    processFile();          
				});

				function processFile() {
						//make sure I got the goods
				    console.log(JSON.parse(content).lan.ip)
				    //parse the goods so I can edit as object
				    parsed_content = JSON.parse(content);
				    //update the changed object properties - this is just an example
				    var lan_ip = "JEN WAS HERE";
				    parsed_content.lan.ip = lan_ip;

				    //write new file using updated content - 2 means pretty print 
				    fs.writeFile('etccopy.js', JSON.stringify(parsed_content, null, 2), function (error, stdout, stderr){
							//define result as object
							var result = {};
							//if you get an error
						  if (error !== null){
						  	//set a made up sabai property to false
						  	result.sabai = false;
						  	result.error = error;
						  	result.stderr = stderr;
						  	result.cmd = cmd;
						  //if you don' get an error
						  }else{
						  	result.sabai = true;
						  }
							socket.emit('sdata', { smsg: 'What happen: "'+ (result.sabai?'Good':'Bad') +'".'});
						});
				}

		    break;

		  case 'lan':
		  //need to account for the off mode - these will be undefined and cause troublez
				var lowerregex	=/.*dhcpLower=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
				var upperregex	=/.*dhcpUpper=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
				var lanipregex	=/.*lanip=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
				var lanmaskregex =/.*lanmaskValue=([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
				var leaseregex =/.*dhcpLease=([0-9]*)/
				var ip = lowerregex.exec(cdata.cmsg)[1];
				var ipu = upperregex.exec(cdata.cmsg)[1];
				var ipl = lanipregex.exec(cdata.cmsg)[1];
				var ipm = lanmaskregex.exec(cdata.cmsg)[1];
				var lease = leaseregex.exec(cdata.cmsg)[1];
				var ipaddress	= ip.replace(".", "\.", "gi");
				var ipupper = ipu.replace(".", "\.", "gi");
				var lanip = ipl.replace(".", "\.", "gi");
				var lanmask = ipm.replace(".", "\.", "gi");
				var ipregex		="[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}";

				confContent ='subnet '+ lanip + ' netmask ' +lanmask + ' {\n range ' + ipaddress + ' '+ ipupper + ';\n option routers 192.168.11.1;\n option  domain-name-servers 4.2.2.2, 8.8.8.8, 208.67.222.222;\n option domain-name "sabai";\n default-lease-time 86400;\n max-lease-time ' + lease + ';\n}';
				console.log(confContent)
				console.log('writing now!')
				
				// Do_sed.sed("./testetc.conf", ["-r ","s/range.*" + ipregex + "/'range '" + ipaddress + "/g"], true, false, function(result){STUFF});

				//UPDAING CONFIG FILE
				fs.writeFile('writetest.conf', confContent, function (error, stdout, stderr){
					//define result as object
					var result = {};
					//if you get an error
				  if (error !== null){
				  	//set a made up sabai property to false
				  	result.sabai = false;
				  	result.error = error;
				  	result.stderr = stderr;
				  	result.cmd = cmd;
				  //if you don' get an error
				  }else{
				  	result.sabai = true;
				  }
					socket.emit('sdata', { smsg: 'Updated config file: "'+ (result.sabai?'Yes':'No') +'".'});
				});

				//UPDATED ETC FILE
				var content;
				//read the existing file
				fs.readFile('etc.js', function read(err, data) {
				    //tell me if there's a problem
				    if (err) {throw err;}
				    content = data;  
				    //do this function defined below
				    processFile();          
				});

				function processFile() {
						//make sure I got the goods
				    console.log(JSON.parse(content).lan.ip)
				    //parse the goods so I can edit as object
				    parsed_content = JSON.parse(content);
				    //update the changed object properties - this is just an example
				    parsed_content.lan.ip = lanip;
				    parsed_content.lan.mask = lanmask;

				    //write new file using updated content - 2 means pretty print 
				    fs.writeFile('etccopy.js', JSON.stringify(parsed_content, null, 2), function (error, stdout, stderr){
							//define result as object
							var result = {};
							//if you get an error
						  if (error !== null){
						  	//set a made up sabai property to false
						  	result.sabai = false;
						  	result.error = error;
						  	result.stderr = stderr;
						  	result.cmd = cmd;
						  //if you don' get an error
						  }else{
						  	result.sabai = true;
						  }
							socket.emit('sdata', { smsg: 'Updated etc.js: "'+ (result.sabai?'Yes':'No') +'".'});
						});
				}
		    break;
		  default:
				break;
		}




	});
});

