//TXM Template v1.1 | (c) 2016 Joystick Interactive | by Antonio M. Quitoriano"

var AD = {};
AD.dom = {}; //cache DOM elements here

AD.creative = {
    
	_engagement: '', 	//markup container
    
    _loadedAssets: 0,
    _totalAssets: 1, 	//starts with Markup;
	
	_engagementStartedFiredOnce: false, 	//checks if ENGAGEMENT_STARTED has fired once before all the assets have been loaded
	
	_images: [], 		//images array
	_scripts: [], 		//scripts array
	_css: [], 			//css array
	_html: '',			//markup
	
	_startPast: false, 			//flags if video start and quartiles have been reached
	_firstQuartilePast: false, 
	_midpointPast: false,
	_thirdQuartilePast: false,
	
    _init: function() {
        
		TXM.dispatcher.addEventListenerOnce('ENGAGEMENT_STARTED', AD.creative._onStart);
        TXM.dispatcher.addEventListenerOnce('ENGAGEMENT_ENDED', AD.creative._onEnd);
		
		//images to be preloaded
        AD.creative._images = ['https://media.truex.com/assets%2F2016-03-23%2F86cff8fe-7666-45b1-b1ab-c92c2de23da7%2Ftap.png',
                      'https://media.truex.com/assets%2F2016-03-23%2F86cff8fe-7666-45b1-b1ab-c92c2de23da7%2Fsample_bg.jpg',
					  'https://media.truex.com/assets%2F2016-05-12%2Fb1f92125-a4dc-44ff-81f4-09611d7f9f87%2Fposter.jpg',
                      'http://media.truex.com/image_assets/2016-12-08/3de3524c-e8b1-4a5b-b7f3-53956d61560f.png'];
		
		//scripts/modules to be preloaded
		AD.creative._scripts = ['https://s0.2mdn.net/ads/studio/cached_libs/tweenmax_1.18.0_499ba64a23378545748ff12d372e59e9_min.js'];
		
		//css to be preloaded
		//AD.creative._css = ['edit/styles.css'];/* when developing locally */
		AD.creative._css = ['http://media.truex.com/file_assets/2016-12-08/75aca910-27cd-4033-a447-5773fbb64a2e.css'];/**/
		
		//markup to be preloaded
		//AD.creative._html = 'edit/markup.html';/* when developing locally */
		AD.creative._html = 'http://media.truex.com/file_assets/2016-12-08/713adb14-2b21-474e-b0d5-57fb89e007db.html';/**/

        AD.creative._totalAssets += AD.creative._images.length + AD.creative._scripts.length + AD.creative._css.length; // _totalAssets starts off with 1 for markup
        
		//begin loading assets
		AD.creative._loadImages(AD.creative._images);
    	AD.creative._loadScripts(AD.creative._scripts);	
		AD.creative._loadCSS(AD.creative._css);
		AD.creative._loadHTML(AD.creative._html);
		
	},

	_updateAssetsLoaded: function(){
		AD.creative._loadedAssets += 1;
        TXM.dispatcher.dispatchEvent('ENGAGEMENT_ASSET_LOADING_PROGRESS', AD.creative._loadedAssets/AD.creative._totalAssets);
		
		if (AD.creative._loadedAssets == AD.creative._totalAssets) {
			TXM.dispatcher.dispatchEvent('INTERACTIVE_ASSET_READY');
			AD.creative._onStart();
		}
	},

	/*LOAD IMAGES + HANDLERS */
    _loadImages: function(urls) {
        for (var i=0; i<urls.length; i++) {
            var url = urls[i];
            $("<img />").attr("src", url).load(AD.creative._onImageLoaded);
        }
    },
	
	_onImageLoaded: function() {
		AD.creative._updateAssetsLoaded();
	},
	
	/*LOAD SCRIPTS + HANDLERS */
	_loadScripts: function(urls) {
        for (var i=0; i<urls.length; i++) {
            var url = urls[i];
            $.getScript(url, AD.creative._onScriptLoaded);
        }
    },
	
	_onScriptLoaded: function() {
		AD.creative._updateAssetsLoaded();
	},
	
	/*LOAD CSS + HANDLERS */
	_loadCSS: function(urls) {
        for (var i=0; i<urls.length; i++) {
            var url = urls[i];
            $.ajax({url : url, dataType: "text", success: AD.creative._onCSSLoaded});
        }
    },
	
	_onCSSLoaded: function(data) {
		$("<style></style").append(data).appendTo("head");
		AD.creative._updateAssetsLoaded();
	},
	
	/*LOAD MARKUP + HANDLER */
	_loadHTML: function(url) {
		$.ajax({url : url, dataType: "text", success: AD.creative._onHTMLLoaded});
	},
	
	_onHTMLLoaded: function(data) {
		AD.creative._engagement = data;
		AD.creative._updateAssetsLoaded();
	},
	
	
	/* DEFAULT _onStart EVENT HANDLER */
    _onStart: function() {							
		if(AD.creative._loadedAssets == AD.creative._totalAssets && AD.creative._engagementStartedFiredOnce)						
		{
			TXM.ui.show(AD.creative._engagement);	
			AD.creative._startAdProper(); 
		}
		AD.creative._engagementStartedFiredOnce = true;
	},
	
	/* INITIALIZE/CACHE DOM & START THE AD */
	_startAdProper: function() {							
		
		//initialize ad variables here
		AD.dom.videoPlayer = $("div#container #videoPlayer");
		AD.dom.overlay = $("div#container #overlay");
        AD.dom.logo = $("#logo");
        AD.dom.soundButton = $("#sound");
        
        AD.dom.audio1 = $("#audio1");
        AD.dom.audio2 = $("#audio2");
		
		AD.creative._videoSetup(); //setup video
		AD.creative._addListeners(); //initialize listeners for the ad
		
		AD.creative._scene1(); //begin ad
		
		TXM.dispatcher.addEventListenerOnce('ENGAGEMENT_CREDITED', AD.creative._onEngagementCredited);
	
	},
	
	/* CUSTOM CODES & LISTENERS*/
	_addListeners: function(e) {
		
		//the truex platform already has jQuery preloaded into it, use it to your advantage! :)
		//initialize listeners here
		
		$("div#container #cta").on("click", AD.creative._ctaClick);
		$("div#container #overlay").on("click", AD.creative._playVideo);
        
        
        AD.dom.logo.on("click", function(){
        
            if(AD.dom.logo.hasClass('ready'))
            {
            
                
                TXM.api.track("other", "Logo Play SFX");
                
                AD.dom.audio1.get(0).play();
                TweenMax.delayedCall(1, AD.creative._playAudio); //<- will only work on mobile IF the sounds have already been triggered beforehand
                                                                 // in this case the Audio files have been "preloaded" when the sound button is pressed to enabled sound
        
            }
            
        });
		
        AD.dom.soundButton.on("click", AD.creative._enableSound);
        
	},
    
    _preloadAudio: function(){
        
        AD.dom.logo.addClass("ready");
        
        AD.dom.audio2.get(0).play();
        AD.dom.audio1.get(0).play();
        
        AD.dom.audio2.get(0).pause();
        AD.dom.audio1.get(0).pause();
    
    },
    
    _playAudio: function(e){
        
        AD.dom.audio2.currentTime = 0;
        AD.dom.audio2.get(0).play();
    
    },
    
    _enableSound: function(){
            
        var isMuted = AD.dom.soundButton.hasClass('mute');
            
        if(isMuted)
        {
            TXM.api.track("other", "Sound On");
            AD.dom.soundButton.removeClass('mute');
        }
        else
        {
            TXM.api.track("other", "Sound Off");
            AD.dom.soundButton.addClass('mute');
        }
        AD.dom.video.get(0).muted = (isMuted)?false:true;
        AD.dom.video.get(0).volume = (isMuted)?1:0;
        
        
        if(!AD.dom.logo.hasClass("ready"))
        {
             AD.creative._preloadAudio();
        }
        
    },
	
	_onEngagementCredited: function(e){
		
		console.log("True Attention is: "+TXM.api.true_attention.completed);
		
	},
	
	_videoSetup: function(){
		
		AD.dom.video = $("div#container #video1");
		AD.dom.video.on("play", AD.creative._videoStarted);
		AD.dom.video.on("ended", AD.creative._videoEnded);
		AD.dom.video.on("timeupdate", AD.creative._videoProgress);
        
        if(AD.dom.video.attr("autoplay"))
        {   
            TweenMax.set(AD.dom.overlay, {display:'none'});
            TweenMax.set(AD.dom.videoPlayer, {display:'block'});
        }
	},
	
	_videoClear: function(e){
		
		var cache = AD.dom.videoPlayer.html(); //cache videoPlayer markup
        
        cache = $(cache).removeAttr('autoplay');
        
        //console.log(cache);
		
		//remove video listeners
		AD.dom.video.off("play", AD.creative._videoStarted);
		AD.dom.video.off("ended", AD.creative._videoEnded);
		AD.dom.video.off("timeupdate", AD.creative._videoProgress);
		
		AD.dom.videoPlayer.html(""); //clear videoPlayer markup/destroy video
		
		TweenMax.delayedCall(0.05, function(){
			
			AD.dom.videoPlayer.html(cache); //re-apply videoPlayer markup
			AD.creative._videoSetup();
		
		});
		
	},
	
	_scene1: function(e) {
		
		//place scene1 codes here 
	
	},
	
	_ctaClick: function(e){
		
		//sample cta code
		TXM.api.track("other", "[CTA]");
		TXM.utils.popupWebsite("[CTA]", TXM.api.true_attention.completed); 	//setting popupWebsite's second parameter to true will end the engagement
																	  		//TXM.api.true_attention.completed returns true if True Attention has been met
																			//replace [CTA] with exit label from TX tag manager
																	  
		//TXM.api.endEngage(); Use this if you want to manually end the engagement without exits or waiting for True Attention			
		
	},
	
	
	
	_videoStarted: function(e) {
		
		if(AD.creative._startPast)
			return;
			
		AD.creative._startPast = true;
		
		TXM.api.track('multimedia', 'video_started', '[Vid Start]'); //sample video tracking
		
	},
	
	_videoEnded: function(e) {
		
		AD.dom.video.get(0).currentTime = 0;
		AD.dom.videoPlayer.css("display", "none");
		AD.dom.overlay.css("visibility", "visible");
		
		//exit fullscreen
		if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
			AD.dom.video.get(0).webkitExitFullscreen();
		
		if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
		}
		
		AD.creative._startPast 			=
		AD.creative._firstQuartilePast 	=
		AD.creative._midpointPast 		= 
		AD.creative._thirdQuartilePast 	= false;
		
		TXM.api.track('multimedia', 'video_completed', '[Vid Complete]'); //sample video tracking
		
		//TXM.api.incrementCurrentStep(); //sample increment step
		TXM.api.setCurrentStep(2); //sample goto step
		
		//destroy and reset video
		AD.creative._videoClear();
        
        AD.creative._playAudio();
		
	},
	
	_videoProgress: function(e) {
		
		var progress = e.currentTarget.currentTime / e.currentTarget.duration;
		
		if (!AD.creative._firstQuartilePast && progress >= 0.25) {
		  AD.creative._firstQuartilePast = true;
		  TXM.api.track('multimedia', 'video_first_quartile', '[Vid Q1]');
            
            AD.creative._playAudio();
            
		  // console.log('1: '+ src);
		} else if (!AD.creative._midpointPast && progress >= 0.50) {
		  AD.creative._midpointPast = true;
		  TXM.api.track('multimedia', 'video_second_quartile', '[Vid Q2]');
            
            AD.creative._playAudio();
            
		  // console.log('2: '+ src);
		} else if (!AD.creative._thirdQuartilePast && progress >= 0.75) {
		  AD.creative._thirdQuartilePast = true;
		  TXM.api.track('multimedia', 'video_third_quartile', '[Vid Q3]');
            
            AD.creative._playAudio();
            
		  // console.log('3: '+ src);
		}
		
	},
	
    _onEnd: function() {
        //place onEnd codes here	
    }
};

(function() {
	
	var creative = {
		_init: AD.creative._init,
		_onStart: AD.creative._onStart,
		_onEnd: AD.creative._onEnd 
	};

	creative._init();
	
}());