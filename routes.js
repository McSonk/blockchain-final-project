'use strict';
var fs = require('fs');
const { exec } = require('child_process');

module.exports = {
	configureEthereum: function(req, resp){
		var type = req.params.type;
		if(type == ":account"){
			exec('mkdir /home/aneesh/testNodeChain', (err,stdout,stderr) => {
				if(err){
					resp.json({"status":"error","errorDetails":"You have already created an account!"});		
					return
				}
				fs.writeFile("/home/aneesh/testNodeChain/password.txt", req.body.password, function(err){
					if(err){
						resp.json({"status":"error","errorDetails":"Unable to create a new account right now!"});		
						return;
					}
					exec('geth account new --password /home/aneesh/testNodeChain/password.txt --datadir /home/aneesh/testNodeChain', (err,stdout,stderr) =>{
						if(err){
							resp.json({"status":"error","accountAddress":"Error Creating your Account right now"});
							return;
						}
						var accountAddress = stdout.split("{")[1];
						accountAddress = accountAddress.substr(0, accountAddress.length -1);
						resp.json({"status":"complete","accountAddress":accountAddress});

						exec('rm /home/aneesh/testNodeChain/password.txt', (err,stdout,stderr) =>{
							if(err){
								console.log("Error removing password file!");
							}
						});
					});
				});
			});
		}else if(type == ":genesis"){
			fs.writeFile("/home/aneesh/testNodeChain/customGenesis.json", req.body.genesisData, function(err){
				if(err){
					resp.json({"status":"error","errorDetails":"Unable to create the Genesis file."});		
					return;
				}
				resp.json({"status":"complete","message":"Created the Genesis File with the name customGenesis.json"});		
			});
		}else if(type == ":init"){
			exec('geth init /home/aneesh/testNodeChain/customGenesis.json --datadir /home/aneesh/testNodeChain', (err,stdout,stderr) =>{
				if(err){
					resp.json({"status":"error","errorDetails":"Unable to initialize Ethereum right now."});
					return;	
				}
				resp.json({"status":"complete","message":"Initialized Ethereum. You may start it now."});
				return;
			});
		}else if(type == ":start"){
			
		}

	}
}