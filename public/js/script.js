$(document).ready(function(){

	//Getting Started with Ethereum Functions
	$("#createNewAccount").on('submit', function(e){
		e.preventDefault();
		disableButton($("#createNewAccount button"),$("#accountAddressNode1"), "Account creation in progress...");
		var password = $("#passwordNode1").val();
		var password2 = $("#passwordNode2").val();
		if(!password || !password2){
			alert("Please provide both the passwords!");
			return
		}
		$.ajax({
		    url: '/api/configureEthereum:account', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"password1":password,"password2":password2})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#accountAddressNode1").val(resp.accountAddress1);
				$("#accountAddressNode2").val(resp.accountAddress2);
			}
		});
	});

	$("#customGenesis").on('submit', function(e){
		e.preventDefault();
		disableButton($("#customGenesis button"),$("#genesisFileStatus"), "Creating Genesis File...");
		var genesisData = $("#genesisContent").val()
		if(!genesisData){
			alert("Please enter the data of the Genesis file.");
			return
		}
		$.ajax({
		    url: '/api/configureEthereum:genesis', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"genesisData":genesisData})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#genesisFileStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#genesisFileStatus").val(resp.message);
			}
		});
	});

	$("#initializeEthereum").on('submit', function(e){
		e.preventDefault();
		disableButton($("#initializeEthereum button"),$("#ethereumInitStatus"), "Initializing Genesis Blocks...");
		$.ajax({
		    url: '/api/configureEthereum:init', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#ethereumInitStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#ethereumInitStatus").val(resp.message);
			}
		});
	});

	$("#startNode").on('submit', function(e){
		e.preventDefault();
		disableButton($("#startNode button"),$("#ethereumNodeStatus"), "Starting Ethereum...");
		var timeout = setTimeout(function(){
					$("#ethereumNodeStatus").val("Ethereum started successfully. Move to Step 2 now.");
					$("#nextStep").prop("disabled", false);
					$("#nextStep").removeClass("btn-dark");
					$("#nextStep").addClass("btn-primary");
				},5000);	
		$.ajax({
		    url: '/api/configureEthereum:start', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#ethereumNodeStatus").val(resp.errorDetails);
				clearInterval(timeout)
			}else if(resp.status == "complete"){
				setTimeout(function(){
					$("#ethereumNodeStatus").val(resp.message);
				},4000);				
			}
		});
	});

	$("#nextStep").on('click', function(e){
		window.location.href = './ethereum.html';
	});


	//Performing Ethereum Functions
	$("#connectToPeer").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#connectToPeer button"),$("#peerStatus"), "Connecting to peer...");
		$.ajax({
		    url: '/api/ethereum:addPeer', 
		    type: 'POST', 
		    contentType: 'application/json'
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerStatus").val(resp.addStatus);
			}
			enableButton($("#connectToPeer button"));
		});
	});

	$("#checkPeer").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkPeer button"),$("#peerCount"), "Fetching peer count...");
		$.ajax({
		    url: '/api/ethereum:peerCount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerCount").val(resp.count);
			}
			enableButton($("#checkPeer button"));
		});
	});

	$("#checkPeer2").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkPeer2 button"),$("#peerCount2"), "Fetching peer count...");
		$.ajax({
		    url: '/api/ethereum:peerCount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerCount2").val(resp.count);
			}
			enableButton($("#checkPeer2 button"));
		});
	});

	$("#checkPeersForm").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkPeersForm button"),$("#peerDetails"), "Fetching peer information...");
		$.ajax({
		    url: '/api/ethereum:peers', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerDetails").val(resp.peers);
			}
			enableButton($("#checkPeersForm button"));
		});
	});

	$("#checkPeersForm2").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkPeersForm2 button"),$("#peerDetails2"), "Fetching peer information...");
		$.ajax({
		    url: '/api/ethereum:peers', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerDetails2").val(resp.peers);
			}
			enableButton($("#checkPeersForm2 button"));
		});
	});

	$("#accountForm").on('submit', function(e){
		e.preventDefault();
		disableButton($("#accountForm button"),$("#createAccountStatus"), "Account creation in progress...");
		var password = $("#accountPassword").val();
		if(!password){
			alert("Please enter a password!");
			return;
		}
		$.ajax({
			url: '/api/ethereum:newAccounts', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1,"password":password})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#createAccountStatus").val(resp.message);
			}
			enableButton($("#accountForm button"));
		});
	});
	$("#accountForm2").on('submit', function(e){
		e.preventDefault();
		disableButton($("#accountForm2 button"),$("#createAccountStatus2"), "Account creation in progress...");
		var password = $("#accountPassword2").val();
		if(!password){
			alert("Please enter a password!");
			return;
		}
		$.ajax({
			url: '/api/ethereum:newAccounts', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2,"password":password})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#createAccountStatus2").val(resp.message);
			}
			enableButton($("#accountForm2 button"));
		});
	});

	$("#checkBalanceForm").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkBalanceForm button"),$("#balanceStatus"), "Fetching accounts and balances...");
		$.ajax({
		    url: '/api/ethereum:balance', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#balanceStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				addListAndBalance($("#accountList"),resp);
				$("#balanceStatus").val("Account and balances fetched.");
			}
			enableButton($("#checkBalanceForm button"));
		});
	});

	$("#checkBalanceForm2").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkBalanceForm2 button"),$("#balanceStatus2"), "Fetching accounts and balances...");
		$.ajax({
		    url: '/api/ethereum:balance', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#balanceStatus2").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				addListAndBalance($("#accountList2"),resp);
				$("#balanceStatus2").val("Account and balances fetched.");
			}
			enableButton($("#checkBalanceForm2 button"));
		});
	});

	$("#unlockAccountForm").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#unlockAccountForm button"),$("#unlockStatus"), "Unlocking Account...");
		var account = $("#unlockAccountID").val();
		var password = $("#password").val();
		if(!password || !account){
			alert("Please enter your account address and password!");
			$("#unlockStatus").val("Please enter both the account address and password");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:unlockAccount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"account":account, "password":password, "node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#unlockStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#unlockStatus").val(resp.unlock);
			}
			enableButton($("#unlockAccountForm button"));
		});
	});

	$("#unlockAccountForm2").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#unlockAccountForm2 button"),$("#unlockStatus2"), "Unlocking account...");
		var account = $("#unlockAccountID2").val();
		var password = $("#password2").val();
		if(!password || !account){
			alert("Please enter your account address and password!");
			$("#unlockStatus2").val("Please enter both the account address and password");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:unlockAccount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"account":account, "password":password, "node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#unlockStatus2").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#unlockStatus2").val(resp.unlock);
			}
			enableButton($("#unlockAccountForm2 button"));
		});
	});

	$("#startMiner").on('click', function(e){
		e.preventDefault();		
		disableButton($("#startMiner button"),$("#minerStatus"), "Miner starting...");
		$.ajax({
		    url: '/api/ethereum:minerStart', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#minerStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#minerStatus").val(resp.message);
			}
		});
	});

	$("#stopMiner").on('click', function(e){
		e.preventDefault();		
		disableButton($("#stopMiner button"),$("#minerStatus"), "Miner Stopping...");
		$.ajax({
		    url: '/api/ethereum:minerStop', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":1})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#minerStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#minerStatus").val(resp.message);
			}
			enableButton($("#startMiner button"));
			enableButton($("#stopMiner button"));
		});
	});

	$("#startMiner2").on('click', function(e){
		e.preventDefault();	
		disableButton($("#startMiner2 button"),$("#minerStatus2"), "Miner Starting...");	
		$.ajax({
		    url: '/api/ethereum:minerStart', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#minerStatus2").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#minerStatus2").val(resp.message);
			}
		});
	});

	$("#stopMiner2").on('click', function(e){
		e.preventDefault();		
		disableButton($("#stopMiner2 button"),$("#minerStatus2"), "Miner stopping...");
		$.ajax({
		    url: '/api/ethereum:minerStop', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data:JSON.stringify({"node":2})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#minerStatus2").val(resp.message);
			}
			enableButton($("#startMiner2 button"));
			enableButton($("#stopMiner2 button"));

		});
	});

	$("#sendTransactionForm").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#sendTransactionForm button"),$("#transactionStatus"), "Sending Transaction...");
		var sender = $("#senderAddress").val();
		var receiver = $("#destinationAddress").val();
		var amount = $("#sendAmount").val();
		if(!receiver || !amount || !sender){
			alert("Please enter all the details!");
			$("#transactionStatus").val("Please enter all the details.");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:transaction', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"node":1,"sender":sender,"receiver":receiver, "amount":amount})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#transactionStatus").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#transactionStatus").val(resp.transactionStatus);
			}
			enableButton($("#sendTransactionForm button"));
		});
	});

	$("#sendTransactionForm2").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#sendTransactionForm2 button"),$("#transactionStatus2"), "Sending Transaction...");
		var sender = $("#senderAddress2").val();
		var receiver = $("#destinationAddress2").val();
		var amount = $("#sendAmount2").val();
		if(!receiver || !amount || !sender){
			alert("Please enter all the details!");
			$("#transactionStatus2").val("Please enter all the details").
			return;
		}
		$.ajax({
		    url: '/api/ethereum:transaction', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"node":2,"sender":sender,"receiver":receiver, "amount":amount})
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#transactionStatus2").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#transactionStatus2").val(resp.transactionStatus);
			}
			enableButton($("#sendTransactionForm2 button"));
		});
	});

	$("#checkTransactionForm").on('submit', function(e){
		e.preventDefault();		
		disableButton($("#checkTransactionForm button"),$("#pendingTransactions"), "Fetching transaction status...");
		$.ajax({
		    url: '/api/ethereum:transactionStatus', 
		    type: 'POST', 
		    contentType: 'application/json'
		}).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				$("#pendingTransactions").val(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#pendingTransactions").val(resp.pending);
				$("#queuedTransactions").val(resp.queued);
			}
			enableButton($("#checkTransactionForm button"));
		});
	});


	$("#startEthereumMove").on('click', function(e){
		e.preventDefault();
		$("#loader").fadeIn("fast");
		var timeout = setTimeout(function(){
				window.location.href = './ethereum.html';
			},5000);	
		$.ajax({
		    url: '/api/configureEthereum:start', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
				clearInterval(timeout);
				$("#loader").fadeOut("slow");
			}
		});
	});

	$("#stopAllEthereum").on('click', function(e){
		e.preventDefault();
		$.ajax({
		    url: '/api/configureEthereum:stop', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				alert(resp.message);
			}
		});

	});

	$("#moveToStep2").on('click', function(e){
		e.preventDefault();
		window.location.href = './ethereum.html';
	});
	
	$("#deleteEverything").on('click', function(e){
		e.preventDefault();
		if(confirm("Are you sure you want to delete everything?")){
			$.ajax({
				url: '/api/deleteEverything', 
			    type: 'POST', 
			    contentType: 'application/json'
			}).done(function(resp){
				if(resp.status == "error"){
					alert(resp.errorDetails);
				}else if(resp.status == "complete"){
					alert(resp.message);
					window.location.href ='./index.html';
				}
			});			
		}else{
			return;
		}

	});

	$("#submitProject").on('click', function(e){
		e.preventDefault();
		$.ajax({
			url: '/api/submitScore', 
		    type: 'GET', 
		    contentType: 'application/json'
		}).done(function(resp){
			$("#submitScore").val(resp.hash);
		});
	});

});

function addListAndBalance(element, resp){
	element.empty();
	for(var i = 0; i <resp.account.length; i++){
		var temp = '<div class="col-6"><input type="text" class="form-control" id="accountAddress" placeholder="Account Address" readonly value='+ resp.account[i] +'></div><div class="col-3"><input type="text" class="form-control" id="balanceWei" placeholder="Balance (in Weis)" readonly value='+ resp.wei[i] +'></div><div class="col-3"><input type="text" class="form-control" id="balanceEther" placeholder="Balance (in Ether)" readonly value='+ resp.ether[i] +'></div>';
		element.append(temp);
	}
	
}

function disableButton(element, messageElement, message){
	element.prop("disabled", true);
	element.removeClass("btn-dark");
	element.removeClass("btn-primary");
	messageElement.val(message);
}

function enableButton(element){
	element.prop("disabled", false);
	element.removeClass("btn-dark");
	element.addClass("btn-primary");
}