'use strict';
var fs = require('fs');
const { exec } = require('child_process');
const Web3 = require('web3');
var web3 = new Web3();
const web3Admin = require('web3admin');
const folderName = "/home/aneesh/testNodeChain";
var connected = false;

module.exports = {
	checkEthereum: function(req, resp){
		fs.readdir(folderName, function(err, list){
			if(err){
				resp.json({"status":"complete", "message":"Instance of Ethereum not found at that location."});
				return;
			}
			resp.json({"status":"error","errorDetails":"You have already configured Ethereum. Please choose options below."});
		});
	},
	deleteEverything: function(req,resp){
		exec('rm -rf ' + folderName, (err,stdout,stderr) =>{
			if(err){
				console.log(err)
				resp.json({"status":"error", "errorDetails":"Unable to delete everything right now."});
				return;
			}
			resp.json({"status":"complete", "message":"Deleted everything successfully."});
		});
	},
	configureEthereum: function(req, resp){
		var type = req.params.type;
		if(type == ":account"){
			exec('mkdir '+folderName, (err,stdout,stderr) => {
				if(err){
					resp.json({"status":"error","errorDetails":"You have already created an account!"});		
					return
				}
				fs.writeFile(folderName + "/password.txt", req.body.password, function(err){
					if(err){
						resp.json({"status":"error","errorDetails":"Unable to create a new account right now!"});		
						return;
					}
					exec('geth account new --password ' + folderName + '/password.txt --datadir '+ folderName , (err,stdout,stderr) =>{
						if(err){
							resp.json({"status":"error","accountAddress":"Error Creating your Account right now"});
							return;
						}
						var accountAddress = stdout.split("{")[1];
						accountAddress = accountAddress.substr(0, accountAddress.length -2);
						resp.json({"status":"complete","accountAddress":accountAddress});

						exec('rm '+ folderName +'/password.txt', (err,stdout,stderr) =>{
							if(err){
								console.log("Error removing password file!");
							}
						});
					});
				});
			});
		}else if(type == ":genesis"){
			fs.writeFile(folderName + "/customGenesis.json", req.body.genesisData, function(err){
				if(err){
					resp.json({"status":"error","errorDetails":"Unable to create the Genesis file."});		
					return;
				}
				resp.json({"status":"complete","message":"Created the Genesis File with the name customGenesis.json"});		
			});
		}else if(type == ":init"){
			exec('geth init '+ folderName + '/customGenesis.json --datadir '+folderName, (err,stdout,stderr) =>{
				if(err){
					resp.json({"status":"error","errorDetails":"Unable to initialize Ethereum. Invalid Genesis file found."});
					return;	
				}
				resp.json({"status":"complete","message":"Initialized Ethereum. You may start it now."});
				return;
			});
		}else if(type == ":start"){
			exec('geth --datadir '+ folderName + ' --maxpeers 95 --networkid 13 --nodiscover --rpc --rpccorsdomain "*" --port 30302 --rpcport 8545 --rpcapi="txpool,db,eth,net,web3,personal,admin"', (err, stdout, stderr) =>{
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
			setTimeout(function(){
				try{
					web3Admin.extend(web3);
				}catch(e){
					resp.json({"status":"error", "errorDetails":"Unable to connect with Ethereum node"});	
					return;
				}
				if(web3.isConnected())
					resp.json({"status":"complete", "message":"Connected with Ethereum node", "enode":web3.admin.nodeInfo.enode, "coinbase":web3.eth.coinbase});
				else
					resp.json({"status":"error", "errorDetails":"Unable to connect to Ethereum. Please go back and start it."});
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
	},
	ethereum: function(req,resp){
		var type = req.params.type;
		if(type == ":addPeer"){
			var enode = req.body.enode;
			var result;
			try{
				result = web3.admin.addPeer(enode);
			}catch(e){
				var index = e.toString().indexOf("invalid enode");
				if(index!=1){
					resp.json({"status":"complete", "addStatus":"Invalid enode provided. Please check enode and try again."});
					return;
				}
			}
			resp.json({"status":"complete", "addStatus":"Enode added. You can check the connectivity using peer count or peers."})
		}else if(type == ":peerCount"){
			var count = web3.net.peerCount;
			resp.json({"status":"complete", "count":count});
		}else if(type == ":peers"){
			var peers = web3.admin.peers;
			if(peers.length == 0){
				resp.json({"status":"complete", "peers":"No Connected Peers"});	
			}else{
				resp.json({"status":"complete", "peers":peers});	
			}
			
		}else if(type == ":unlockAccount"){
			var password = req.body.password;
			var result;
			try{
				result = web3.personal.unlockAccount(web3.eth.coinbase, password);
			}catch(e){
				resp.json({"status":"complete", "unlock":"Incorrect Password Entered"});
				return;
			}
			resp.json({"status":"complete", "unlock":"Account Unlocked"});
		}else if(type == ":balance"){
			var balance = web3.eth.getBalance(web3.eth.coinbase);
			resp.json({"status":"complete", "wei":balance, "ether":web3.fromWei(balance, "ether")});
		}else if(type == ":transaction"){
			var receiver = req.body.receiver;
			var amount = req.body.amount;
			var transactionObj = {from:web3.eth.coinbase, to:receiver, value:web3.toWei(amount, "ether")};
			var status;
			try{
				status = web3.eth.sendTransaction(transactionObj);
			}catch(e){
				var index = e.toString().indexOf("authentication needed");
				if(index != -1){
					resp.json({"status":"complete", "transactionStatus":"Your account is locked. Can not initiate transaction."});
					return;
				}
				index = e.toString().indexOf("insufficient funds");
				if(index != -1){
					resp.json({"status":"complete", "transactionStatus":"Your account has insufficient funds for gas * price + amount that you want to send."});
					return;
				}
				resp.json({"status":"complete", "transactionStatus":"An unknown error occured."});
				return;
			}
			resp.json({"status":"complete", "transactionStatus":"Transaction successfully submitted"});
		}else if(type == ":transactionStatus"){
			var status = web3.txpool.status;
			resp.json({"status":"complete", "pending":parseInt(status.pending,16), "queued":parseInt(status.queued,16)});
		}
	}
}