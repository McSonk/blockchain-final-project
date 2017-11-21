$(document).ready(function(){

	//Getting Started with Ethereum Functions
	$("#createNewAccount").on('submit', function(e){
		e.preventDefault()
		var password = $("#passwordNode1").val()
		var password2 = $("#passwordNode2").val()
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
		$("#ethereumNodeStatus").val("Starting Ethereum...");
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

	$("#stopNode").on('click', function(e){
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

	$("#nextStep").on('click', function(e){
		window.location.href = './ethereum.html';
	});


	//Performing Ethereum Functions
	$("#connectToPeer").on('submit', function(e){
		e.preventDefault();		
		var enode = $("#destEnode").val();
		
		if(!enode){
			alert("Please enter the enode!");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:addPeer', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"enode":enode})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerStatus").val(resp.addStatus);
			}
		});
	});

	$("#checkPeer").on('submit', function(e){
		e.preventDefault();		
		$.ajax({
		    url: '/api/ethereum:peerCount', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerCount").val(resp.count);
			}
		});
	});

	$("#checkPeersForm").on('submit', function(e){
		e.preventDefault();		
		$.ajax({
		    url: '/api/ethereum:peers', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#peerDetails").val(resp.peers);
			}
		});
	});

	$("#unlockAccountForm").on('submit', function(e){
		e.preventDefault();		
		var password = $("#password").val();
		if(!password){
			alert("Please enter your password!");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:unlockAccount', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"password":password})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#unlockStatus").val(resp.unlock);
			}
		});
	});

	$("#checkBalanceForm").on('submit', function(e){
		e.preventDefault();		
		$.ajax({
		    url: '/api/ethereum:balance', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#balanceWei").val(resp.wei);
				$("#balanceEther").val(resp.ether);
			}
		});
	});

	$("#sendTransactionForm").on('submit', function(e){
		e.preventDefault();		
		var receiver = $("#destinationAddress").val();
		var amount = $("#sendAmount").val();
		if(!receiver || !amount){
			alert("Please enter both the receiver and the amount!");
			return;
		}
		$.ajax({
		    url: '/api/ethereum:transaction', 
		    type: 'POST', 
		    contentType: 'application/json',
		    data: JSON.stringify({"receiver":receiver, "amount":amount})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#transactionStatus").val(resp.transactionStatus);
			}
		});
	});

	$("#checkTransactionForm").on('submit', function(e){
		e.preventDefault();		
		$.ajax({
		    url: '/api/ethereum:transactionStatus', 
		    type: 'POST', 
		    contentType: 'application/json'}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#pendingTransactions").val(resp.pending);
				$("#queuedTransactions").val(resp.queued);
			}
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

});