$(document).ready(function(){
	$("#createNewAccount").on('submit', function(e){
		e.preventDefault()
		var password = $("#password").val()
		if(!password){
			alert("Please provide a password!");
			return
		}
		$.ajax({
		    url: '/api/configureEthereum:account', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"password":password})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				$("#accountAddress").val(resp.accountAddress);
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
		window.location.href = 'http://www.google.com';
	});
});