$(document).ready(function() {	
	/** mute audio button */
	$("#mute-audio").on("click", function() {
		if(mute_audio == false) {
			$("#mute-audio").css( "background-color", "red" );
			mute_audio = true;
			webrtc.mute();
			webrtc.sendToAll('chat', {message: 'mute'});
		} else {
			$("#mute-audio").css( "background-color", "green" );
			mute_audio = false;
			webrtc.unmute();
			webrtc.sendToAll('chat', {message: 'unmute'});			
		}
	});

	/** disable video button */
	$("#mute-video").on("click", function() {
		if(mute_video == false) {
			$("#mute-video").css( "background-color", "red" );
			mute_video = true;
			webrtc.pauseVideo();					
		} else {
			console.log("enable-video");
			$("#mute-video").css( "background-color", "green" );
			mute_video = false;
			webrtc.resumeVideo();
		}
	});
	
	/** send message function */
	$('#send').click(function(){
	  var msg = $('#text').val();
	  //webrtc.sendToAll('chat', {message: msg, nick: webrtc.config.nick});
	  console.log('chat sent',msg);
	  webrtc.sendToAll('chat', {message: msg});
	  $('#messages').append('<br>You:<br>' + msg);
	  //$('#text').val('');
	});	

	/** enable sortable remote videos via drag and drop */
	$("#sortable").sortable({revert: true});
	$("ul, li").disableSelection();
});		
