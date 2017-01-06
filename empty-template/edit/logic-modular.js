/**
 * ---------------------------------------------------
 * TrueX HTML5 Modular Template V1.0
 * A modularized version of our current Truex HTML5
 * template created by Antonio M. Quitoriano.
 * ---------------------------------------------------
 */

/**
 * ###################################################
 * TXCONFIG MODULE
 * ###################################################
 * The TXConfig module is the configuration / settings
 * of every TrueX HTML5 builds. This is where you will
 * set all the stuff your creative will use like images,
 * sounds, external js, and css.
 *
 * Most of the time, the only thing you will update in
 * this module are the "resources" your creative will use.
 *
 * • creativeImages - All the absolute URL of your images.
 * • creativeScripts - All the absolute URL of your scripts.
 * • creativeCSS - All the absolute URL of your stylesheets.
 * • creativeHTML - The absolute URL of your HTML markup file.
 */
var TXConfig = (function () {

	/**
	 * ----------------------------------
	 * START ASSET PRELOADING
	 * ----------------------------------
	 */
	
	/**
	 * Place all your image URLS here.
	 */
	var creativeImages = 
	[
		
	];

	/**
	 * Place all your 3rd party JS scripts here.
	 */
	var creativeScripts = 
	[
		
	];

	/**
	 * Place all your CSS stylesheets here.
	 */
	var creativeCSS = 
	[
		
	];

	/**
	 * Place your HTML markup here.
	 */
	var creativeHTML = '';

	/**
	 * ----------------------------------
	 * END ASSET PRELOADING
	 * ----------------------------------
	 */


	/**
	 * Will hold our markup once it has been loaded via Ajax.
	 */
	var markupContainer;
	/**
	 * This is a counter that will increment everytime you
	 * load a resource inside the creative (images, sounds, etc)
	 */
	var loadedAssets = 0;
	/**
	 * Will hold the current number of loaded assets inside
	 * the creative. "1" pertains to the HTML markup file.
	 */
	var totalAssets = 1 + creativeImages.length + creativeScripts.length + creativeCSS.length;
	/**
	 * This is the flag that checks if ENGAGEMENT_STRTED
	 * has fired once before all the assets have been loaded.
	 */
	var engagementStartedFiredOnce = false;


	/**
	 * Expose TXConfig's API to outside modules.
	 */
	return {

		markupContainer            : markupContainer,
		loadedAssets               : loadedAssets,
		totalAssets                : totalAssets,
		engagementStartedFiredOnce : engagementStartedFiredOnce,
		creativeImages             : creativeImages,
		creativeScripts            : creativeScripts,
		creativeCSS                : creativeCSS,
		creativeHTML               : creativeHTML
	}

})();



/**
 * ###################################################
 * TXAD MODULE
 * ###################################################
 * The TXAd module is where the main initialization of
 * the TrueX Ad takes place. These includes anything from
 * the actual loading of assets (images, sounds, etc) to
 * setting up the "Ad Lifecycle" of your creative.
 *
 * Think of it as a place where you "setup" your actual creative.
 */
var TXAd = (function () {

	/**
	 * Initialize TrueX Ad Lifecycle.
	 * More info can be found at: https://github.com/socialvibe/truex-ads-api-js
	 */
	function init () {

		console.log( 'AD START' )

		TXM.dispatcher.addEventListenerOnce( 'ENGAGEMENT_STARTED', adStart);
		TXM.dispatcher.addEventListenerOnce( 'ENGAGEMENT_ENDED', adEnd );
		TXM.dispatcher.addEventListenerOnce( 'ENGAGEMENT_CREDITED', adEngagementCredited);

		loadImages ( TXConfig.creativeImages );
		loadScripts( TXConfig.creativeScripts );
		loadCSS    ( TXConfig.creativeCSS );
		loadHTML   ( TXConfig.creativeHTML );
	}

	/**
	 * This is where you will initialize your ad and is the
	 * main "entry point" of your creative.
	 */
	function adStart () {

		if ( TXConfig.loadedAssets == TXConfig.totalAssets && TXConfig.engagementStartedFiredOnce ) {

			TXM.ui.show( TXConfig.markupContainer );

			/**
			 * Show and render your creative.
			 */
			TXCreative.render();
		}

		TXConfig.engagementStartedFiredOnce = true;
	}

	/**
	 * Engagements end when users click "I'm Done" in the ad 
	 * container header. This is mostly the place where you will 
	 * remove or stop all the running processes in your creative.
	 */
	function adEnd () {


	}

	/**
	 * This is when you achive "true attention" in your ad.
	 */
	function adEngagementCredited () {

		console.log( "True Attention is: " + TXM.api.true_attention.completed );
	}

	/**
	 * ----------------------------------
	 * START ASSET LOADING
	 * ----------------------------------
	 */
	
	/**
	 * Function that will load all the
	 * images inside the creative.
	 */
	function loadImages ( urls ) {

		for ( var i = 0; i < urls.length; i++ ) {

			var url = urls[i];

			$( '<img />' ).attr( 'src', url ).load( function () {
				updateAssetsLoaded();
			});
		}
	}

	/**
	 * Function that will load all the
	 * 3rd party js libraries inside 
	 * the creative.
	 */
	function loadScripts ( urls ) {

		for ( var i = 0; i < urls.length; i++ ) {

			var url = urls[i];

			$.getScript( url, function () {
				updateAssetsLoaded();
			});
		}
	}

	/**
	 * Function that will load all the 
	 * CSS stylesheets inside the creative.
	 */
	function loadCSS ( urls ) {

		for ( var i = 0; i < urls.length; i++ ) {

			var url = urls[i];

			$.ajax({ 

				url      : url,
				dataType : 'text',
				success  : function ( data ) {
					$( '<style></style>' ).append( data ).appendTo( 'head' );
					updateAssetsLoaded();
				} 
			});
		}
	}

	/**
	 * Function that will load your 
	 * creatives external HTML markup.
	 */
	function loadHTML ( url ) {

		$.ajax({ 

				url      : url,
				dataType : 'text',
				success  : function ( data ) {
					TXConfig.markupContainer = data;
					updateAssetsLoaded();
				} 
			});
	}

	/**
	 * Function that will update the 
	 * current number of loaded assets
	 * inside the creative.
	 *
	 * If all the loaded assets is equal
	 * to the creatives total assets, 
	 * start the creative.
	 */
	function updateAssetsLoaded () {

		TXConfig.loadedAssets += 1;
		TXM.dispatcher.dispatchEvent( 'ENGAGEMENT_ASSET_LOADING_PROGRESS', TXConfig.loadedAssets / TXConfig.totalAssets );

		if ( TXConfig.loadedAssets == TXConfig.totalAssets ) {

			TXM.dispatcher.dispatchEvent( 'INTERACTIVE_ASSET_READY' );
			adStart();
		}
	}
	
	/**
	 * ----------------------------------
	 * END ASSET LOADING
	 * ----------------------------------
	 */
	
	return {

		init : init
	}

})();



/**
 * ###################################################
 * TXVIDEO MODULE
 * ###################################################
 * The TXVideo Module handles everything about video
 * loading and quartiles tracking.
 *
 * In case there's a custom behaviour needed for the
 * video player, you are free to change the core
 * behaviour of the video inside this module.
 */
var TXVideo = (function () {

	/**
	 * Variables for quartiles tracking.
	 */
	var videoStart         = false;
	var videoFirstQuartile = false;
	var videoMidpoint      = false;
	var videoThirdQuartile = false;

	/**
	 * Video player markup.
	 */
	var video;
	var videoOverlay;
	var videoPlayer;

	/**
	 * Initialize the video player.
	 * Pass the 'video id' as the
	 * function parameter.
	 */
	function init () {

		video        = $( '#video1' );
		videoOverlay = $( '#overlay' );
		videoPlayer  = $( '#videoPlayer' );

		/**
		 * Add video events.
		 */
		video.on( 'play', videoStarted );
		video.on( 'ended', videoEnded );
		video.on( 'timeupdate', videoProgress );

		if ( video.attr( 'autoplay' ) ) {

			videoPlayer.css( 'display', 'block' );
			videoOverlay.css( 'display', 'none' );
		}

		/**
		 * Video player interactivity.
		 *
		 * Replays the video when the overlay
		 * is clicked.
		 */
		videoOverlay.on( 'click', playVideo );
	}

	/**
	 * Destroys the video player and
	 * removes any event listened that
	 * are tied into it.
	 */
	function destroy () {

		/**
		 * Save a copy of the video player markup.
		 */
		var videoPlayerMarkup = videoPlayer.html();
		videoPlayer.removeAttr( 'autoplay' );

		/**
		 * Remove video events.
		 */
		video.off( 'play', videoStarted );
		video.off( 'ended', videoEnded );
		video.off( 'timeupdate', videoProgress );

		/**
		 * Remove video player markup from
		 * the DOM.
		 */
		videoPlayer.html('');

		/**
		 * Re-apply video player markup back
		 * to the DOM and re-initialize the
		 * video player.
		 */
		TweenMax.delayedCall( 0.05, function () {

			videoPlayer.html( videoPlayerMarkup );
			init();
		});
	}

	/**
	 * Play the video.
	 */
	function playVideo () {

		videoPlayer.css( 'display', 'block' );
		videoOverlay.css( 'display', 'none' );
		video.get(0).play();
	}

	/**
	 * -----------------------------------
	 * Video Player Events
	 * -----------------------------------
	 */
	
	/**
	 * Video Started
	 */
	function videoStarted () {

		if ( videoStart ) {

			return
		}

		videoStart = true;

		/**
		 * Sample video tracking.
		 */
		TXM.api.track( 'multimedia', 'video_started', '[Vid Start]' );
	}

	/**
	 * Video Ended
	 */
	function videoEnded () {

		video.get(0).currentTime = 0;
		videoPlayer.css( 'display', 'none' );
		videoOverlay.css( 'display', 'block' );


		/**
		 * Exit fullscreen.
		 */
		if( Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0 )
			AD.dom.video.get(0).webkitExitFullscreen();
		
		if ( document.fullscreenEnabled || document.webkitFullscreenEnabled ) {

			if ( document.exitFullscreen ) {

				document.exitFullscreen();
			} 

			else if ( document.webkitExitFullscreen ) {

				document.webkitExitFullscreen();
			}
		}

		/**
		 * Sample video tracking.
		 */
		TXM.api.track( 'multimedia', 'video_completed', '[Vid Complete]' );

		/**
		 * Sample step tracking.
		 */
		TXM.api.setCurrentStep(2);

		/**
		 * Reset video quartiles flag.
		 */
		videoStart         = false;
		videoFirstQuartile = false;
		videoMidpoint      = false;
		videoThirdQuartile = false;

		/**
		 * Destroy and reset the video player.
		 */
		destroy();
	}

	/**
	 * Video Progress
	 * This is where we track the video quartiles.
	 */
	function videoProgress (e) {

		var progress = e.currentTarget.currentTime / e.currentTarget.duration;

		if( !videoFirstQuartile && progress >= 0.25 ) {

			videoFirstQuartile = true;
			TXM.api.track( 'multimedia', 'video_first_quartile', '[Vid Q1]' );
		}

		else if ( !videoMidpoint && progress >= 0.50 ) {

			videoMidpoint = true;
			TXM.api.track('multimedia', 'video_second_quartile', '[Vid Q2]');
		}

		else if ( !videoThirdQuartile && progress >= 0.75 ) {

			videoThirdQuartile = true;
			TXM.api.track( 'multimedia', 'video_third_quartile', '[Vid Q3]' );
		}
	}

	/**
	 * Expose TXVideo's API to outside modules.
	 */
	return {

		init      : init,
		destroy   : destroy,
		playVideo : playVideo
	}

})();



/**
 * ###################################################
 * TXCREATIVE MODULE
 * ###################################################
 * The TXCreative Module is the MEAT of your creative.
 * This is where all of your CUSTOM codes will go -
 * meaning, all of your creative's "logic" will be
 * run through here.
 *
 * This makes it much more easier to build an ad since 
 * you have a "central" location of where your actual 
 * codes will go.
 */
var TXCreative = (function () {

	/**
	 * Begin coding your creative's logic here.
	 * Write everything inside the render function.
	 */
	function render () {

		
	}

	/**
	 * Expose TXCreative's API to outside modules.
	 */
	return {

		render : render
	}

})();

/**
 * RUN IT!
 */
TXAd.init();





































