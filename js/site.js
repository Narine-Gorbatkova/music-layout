$(document).ready(function () {
	var scroll = $('.scroll-pane').jScrollPane();
	var api = scroll.data('jsp');
	
	$(document).on('DOMSubtreeModified', '.playlist_drop ul', function () {
		api.reinitialise();
		var $this = $(this);
		if (!$this.find('li').length) {
			$this.closest('.playlist_drop').removeClass('open');
		}
	});

	$(window).resize(function () {
		if (api) {
			api.reinitialise();
		}
	});

	$('.playlist_drop .scroll-pane').jScrollPane({
		verticalDragMinHeight: 30,
		contentWidth: '0px'
	});


	var myPlaylist = new jPlayerPlaylist({
		jPlayer: ".jp-jplayer",
		cssSelectorAncestor: "#jp_container_1"
	}, [
		
	], {
		ready: function () {
			setTimeout(function () {
				api.reinitialise();
			}, 500); 
		},
		playlistOptions: {
			enableRemoveControls: true
		},
		size: {
			width: "65px",
			height: "65px"
		},
		swfPath: "../dist/jplayer",
		supplied: "mp3, ogg",
		useStateClassSkin: true,
		keyEnabled: true,
		toggleDuration: true,
		volume: 0.05,
		loop: true
	});
	

	$(document).on('click', '.player .playlist', function () {
		var $playlistBlock = $(this).closest('.player').find('.playlist_drop');
		if (!$playlistBlock.find('ul li').length) {
			$playlistBlock.removeClass('open');
		} else {
			$playlistBlock.toggleClass('open');
		}
		
	});

	$(document).on('click', '.player .down', function () {
		$(this).closest('.player').toggleClass('fold');
	});

	$(document).on('click', '.player .volume_icon', function () {
		$(this).closest('.volume').find('.volume_block').toggleClass('show');
	});

	$(document).on('click', '.play_action', function () {
		$('.player').removeClass('fold');
		var songInfo = $(this).closest('[data-song-info]').data('songInfo');
		var orderOfSong = checkPlaylist(myPlaylist.playlist, songInfo);
  
		if (orderOfSong === false) {
			myPlaylist.add(songInfo, true);
		} else {
			myPlaylist.play(orderOfSong);
		}
	});

	$(document).on('click', '.playlist_action', function () {
		var songInfo = $(this).closest('[data-song-info]').data('songInfo');

		if (checkPlaylist(myPlaylist.playlist, songInfo) === false) {
			myPlaylist.add(songInfo);
		}
	});

	function checkPlaylist(playlist, songInfo) {
		var alreadyExists = false;

		for (var i = 0; i < playlist.length; i++) {
			if (playlist[i].title === songInfo.title) {
				alreadyExists = i;
				break;
			}
		}

		return alreadyExists;
	};

	$('.carousel').carousel({
		interval: 3000
	});

	if ($('.upload_block').length) {
		var myDropzone = new Dropzone('.upload_block', { 
			url: '/file/post',
			clickable: ['.upload_block .browse'],
			autoProcessQueue: false,
			previewTemplate: $('#dropzone_element').html(),
			previewsContainer: '.dropzone_table'
		});

		myDropzone.on('addedfile', function () {
			$('.start_upload').show();
			$('.dropzone_table_title').removeClass('hidden');
			// api.reinitialise();
		});

		myDropzone.on('removedfile', function () {
			if (myDropzone.getQueuedFiles().length === 0) {
				$('.start_upload').hide();
				$('.dropzone_table_title').addClass('hidden');
			}
			// api.reinitialise();
		});

		$(document).on('click', '.upload_block .start_upload', function () {
			myDropzone.processQueue();
		});
	}

	$(document).on('click', '.track_unit .statistics_details', function () {
		$(this).toggleClass('show_panel').closest('.track_statistics_block').find('.statistics_block').toggleClass('show_panel');
	});



});
