'use strict';
var fs = require('fs');
const { exec } = require('child_process');
const Web3 = require('web3');
var web3 = new Web3();
const web3Admin = require('web3admin');
var connected = false;

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
					resp.json({"status":"error","errorDetails":"Unable to initialize Ethereum. Invalid Genesis file found."});
					return;	
				}
				resp.json({"status":"complete","message":"Initialized Ethereum. You may start it now."});
				return;
			});
		}else if(type == ":start"){
			exec('geth --datadir /home/aneesh/testNodeChain --maxpeers 95 --networkid 13 --nodiscover --rpc --rpccorsdomain "*" --port 30302 --rpcport 8545 --rpcapi="db,eth,net,web3,personal,admin"', (err, stdout, stderr) =>{
				console.log("ERR" + err);
				console.log("stdout" + stdout);
				console.log("stderr" + stderr);
				if(err){
					resp.json({"status":"error","errorDetails":"Unable to start Ethereum. An Instance of Ethereum is already running."});
					return;	
				}
			})
		}else if(type == ":stop"){
			exec('pkill geth', (err,stdout,stderr) => {
				if(err){
					resp.json({"status":"error", "errorDetails":"Unable to stop any Ethereum node."})
					return;
				}
				resp.json({"status":"complete", "message":"Stopped all instances of Ethereum."})
			});
		}

	},
	startWeb3: function(req, resp){
		if(connected == false){
			web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));
			//console.log(web3);
			setTimeout(function(){
				try{
					web3Admin.extend(web3);
				}catch(e){
					resp.json({"status":"error", "errorDetails":"Unable to connect with Ethereum node"});	
					return;
				}
								resp.json({"status":"complete", "message":"Connected with Ethereum node", "enode":web3.admin.nodeInfo.enode, "coinbase":web3.eth.coinbase});
			}, 1000);
			connected = true;
		}
		else{
			if(web3.isConnected()){
				resp.json({"status":"complete", "message":"Connected with Ethereum node", "enode":web3.admin.nodeInfo.enode, "coinbase":web3.eth.coinbase});
			}else{
				connected = false;
				resp.json({"status":"error", "errorDetails":"Unable to connect with Ethereum node. Please refresh this page and try again."});	
			}
		}	
	}
}