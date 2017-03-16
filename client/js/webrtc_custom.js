// vars for audio
var mute_audio = false;
var mute_video = false;
var remote_videos = 0;


// grab the room from the URL
var room = location.search && location.search.split('?')[1];


// create our webrtc connection
var webrtc = new SimpleWebRTC({
	// the id/element dom element that will hold "our" video
	localVideoEl: 'localVideo',
	// the id/element dom element that will hold remote videos
	remotevideosEl: '',
	// immediately ask for camera access
	autoRequestMedia: true,
	debug: false,
	detectSpeakingEvents: true,
	autoAdjustMic: false,
});

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
	// you can name it anything
	if (room) webrtc.joinRoom(room);
});

function showVolume(el, volume) {
	if (!el) return;
	if (volume < -45) volume = -45; // -45 to -20 is
	if (volume > -20) volume = -20; // a good range
	el.value = volume;
}

// we got access to the camera
webrtc.on('localStream', function (stream) {
	var button = document.querySelector('form>button');
	if (button) button.removeAttribute('disabled');
	$('#localVolume').show();
});
// we did not get access to the camera
webrtc.on('localMediaError', function (err) {
});

/** local video */
// local screen obtained
webrtc.on('localScreenAdded', function (video) {
	video.onclick = function () {
		video.style.width = video.videoWidth + 'px';
		video.style.height = video.videoHeight + 'px';
	};
	document.getElementById('localScreenContainer').appendChild(video);
	$('#localScreenContainer').show();
});

// local screen removed
webrtc.on('localScreenRemoved', function (video) {
	document.getElementById('localScreenContainer').removeChild(video);
	$('#localScreenContainer').hide();
});

/** remote videos not local video */
webrtc.on('videoAdded', function (video, peer) {
	//console.log('video added', peer);
	//console.log("Number of videos " +  remote_videos);
	//window.alert("video added");
	var remotes = document.getElementById('sortable');
	if (remotes) {
		remote_videos++;
		console.log("Number of videos", remote_videos);
		var container = document.createElement('li');
		container.className = 'videoContainer col-lg-3 centered ui-state-default';
		container.setAttribute("draggable", "true");
		container.id = 'remote_video_' + webrtc.getDomId(peer);
		container.appendChild(video);
		$('#'+container.id).draggable();
		
		// suppress contextmenu
		video.oncontextmenu = function () { return false; };

		// resize the video on click
		//container.ondblclick = function () {
		//	var remote_html = $('#'+container.id).html();
		//	var new_remote_html = remote_html.replace('<video ', '<video id="localVideo" ');
		//	var local_html = $('#backgroundVideo').html();
		//	var new_local_html = local_html.replace('id="localVideo"', '');
		//	$('#backgroundVideo').html(new_remote_html);
		//	$('#'+container.id).html(new_local_html);
		//};

		// show the remote volume
		//var vol = document.createElement('meter');
		//vol.id = 'volume_' + peer.id;
		//vol.className = 'volume';
		//vol.min = -45;
		//vol.max = -20;
		//vol.low = -40;
		//vol.high = -25;
		//draggable.appendChild(vol);
		
		// show the ice connection state
		//if (peer && peer.pc) {
		//    var connstate = document.createElement('div');
		//    connstate.className = 'connectionstate';
		//    container.appendChild(connstate);
		//    peer.pc.on('iceConnectionStateChange', function (event) {
		//        switch (peer.pc.iceConnectionState) {
		//        case 'checking': 
		//            connstate.innerText = 'Connecting to peer...';
		//            break;
		//        case 'connected':
		//        case 'completed': // on caller side
		//            $(vol).show();
		//            connstate.innerText = 'Connection established.';
		//            break;
		//        case 'disconnected':
		//            connstate.innerText = 'Disconnected.';
		//            break;
		//        case 'failed':
		//            connstate.innerText = 'Connection failed.';
		//            break;
		//        case 'closed':
		//            connstate.innerText = 'Connection closed.';
		//            break;
		//        }
		//    });
		//}
		remotes.appendChild(container);
	}
});

// a peer was removed
webrtc.on('videoRemoved', function (video, peer) {
	//console.log('video removed ', peer);
	remote_videos--;
	var remotes = document.getElementById('sortable');
	var el = document.getElementById(peer ? 'remote_video_' + webrtc.getDomId(peer) : 'localScreenContainer');
	if (remotes && el) {
		remotes.removeChild(el);
	}
});

// local volume has changed
webrtc.on('volumeChange', function (volume, treshold) {
	if(mute_audio == false) {
		showVolume(document.getElementById('localVolume'), volume);
	}
});
// remote volume has changed
webrtc.on('remoteVolumeChange', function (peer, volume) {
	//showVolume(document.getElementById('volume_' + peer.id), volume);
});

// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
	var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
	console.log('local fail', connstate);
	if (connstate) {
		connstate.innerText = 'Connection failed.';
		fileinput.disabled = 'disabled';
	}
});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
	var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
	console.log('remote fail', connstate);
	if (connstate) {
		connstate.innerText = 'Connection failed.';
		fileinput.disabled = 'disabled';
	}
});

// Since we use this twice we put it here
function setRoom(name) {
	document.querySelector('form').remove();
	//document.getElementById('room-title').innerText = 'Room: ' + name;
	$('#room-title').text('');
	$('#subTitle').text('Link to join: ' + location.href);
	$('body').addClass('active');
}

if (room) {
	setRoom(room);
} else {
	$('form').submit(function () {
		//generates a random string
		var val = Math.random().toString(36).slice(2);
		//$('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
		
		webrtc.createRoom(val, function (err, name) {
			console.log(' created Room');
			console.log(' create room cb', arguments);
		
			var newUrl = location.pathname + '?' + name;
			if (!err) {
				history.replaceState({foo: 'bar'}, null, newUrl);
				setRoom(name);
			} else {
				console.log(err);
			}
		});
		return false;          
	});
}

//var button = document.getElementById('screenShareButton'),
	//setButton = function (bool) {
	//	button.innerText = bool ? 'share screen' : 'stop sharing';
	//};
//if (!webrtc.capabilities.screenSharing) {
	//button.disabled = 'disabled';
//}
//webrtc.on('localScreenRemoved', function () {
	//setButton(true);
//});

//setButton(true);

//button.click(function () {
//	if (webrtc.getLocalScreen()) {
//		webrtc.stopScreenShare();
//		setButton(true);
//	} else {
//		webrtc.shareScreen(function (err) {
//			if (err) {
//				setButton(true);
//			} else {
//				setButton(false);
//			}
//		});
//		
//	}
////});

webrtc.on('joinedRoom', function () {
	webrtc.sendDirectlyToAll("text chat", "chat", "");
});

webrtc.on('message', function(data){
	console.log("received message", data);
	if(data.type === 'chat'){
		console.log('chat received',data);
		$('#messages').append('<br>' + data.payload.nick + ':<br>' + data.payload.message);
	}
});

