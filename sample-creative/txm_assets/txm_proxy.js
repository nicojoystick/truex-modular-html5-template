//TXM Proxy v1.2 | (c) 2016 Joystick Interactive | by Antonio M. Quitoriano"
console.log("TXM Proxy v1.2 | (c) 2016 Joystick Interactive | by the Janitor");
console.log("Txm Proxy mimics TrueX behaviors for local testing purposes only.");

polyfillCustomEvent();

TXM = {};

TXM.init = function(){
	
	document.addEventListener("INTERACTIVE_ASSET_READY", TXM.dispatcher.onAssetsReady);
	document.addEventListener("ENGAGEMENT_ASSET_LOADING_PROGRESS", TXM.dispatcher.onEngagementAssetLoadingProgress);
	
	TXM.dispatcher.addEventListenerOnce("ENGAGEMENT_STARTED", function(){
		TXM.api.getCurrentStep();
		TXM.api.track("initial", "timing");
		
		$(TXM.ui.adContainer).on("click", function(e){
			
			TXM.params.interactions++;
			$(TXM.ui.interactionContainer).get(0).innerHTML = "Interactions: "+TXM.params.interactions;
			
			setTimeout(function(){
				if(TXM.params.preventAdContainerClick)
					TXM.params.preventAdContainerClick = false;
				else
					TXM.api.track("click", "interaction" ,e.pageX+","+e.pageY); 
			}, 500);
		});
	});
	
	TXM.dispatcher.addEventListenerOnce("ENGAGEMENT_CREDITED", TXM.ui.completion);
	//TXM.params.timeout_id = setTimeout(TXM.ui.completion, TXM.params.current_time*1000);
	
	TXM.params.interval_id = setInterval(function(){
											TXM.params.current_time--;
											
											if(!TXM.params.current_time)
											{
												console.log("Time reached 0");
												clearInterval(TXM.params.interval_id);
												
												TXM.api.true_attention.time_up = true;
												
												if(!TXM.params.credited && TXM.params.interactions)
												{
													TXM.params.credited = true;
													TXM.api.true_attention.completed = true;
													TXM.dispatcher.dispatchEvent("ENGAGEMENT_CREDITED");
												}
											}
											
											$(TXM.ui.timeContainer).get(0).innerHTML = "Current Time: "+TXM.params.current_time;
											
										}, 1000);

}

TXM.params = {
	_savedData: "[ ]",
	current_step: 1,
	current_time: 15,
	interval_id: null,
	timeout_id: null,
	credited: false,
	interactions: 0,
	preventContainerClick: false
}

TXM.dispatcher = {
	
	"ENGAGEMENT_STARTED" : new CustomEvent("ENGAGEMENT_STARTED"),
	"ENGAGEMENT_ENDED" : new CustomEvent("ENGAGEMENT_ENDED"),
	"ENGAGEMENT_CREDITED" : new CustomEvent("ENGAGEMENT_CREDITED"),
	"INTERACTIVE_ASSET_READY" : new CustomEvent("INTERACTIVE_ASSET_READY"),
	"ENGAGEMENT_ASSET_LOADING_PROGRESS" : new CustomEvent("ENGAGEMENT_ASSET_LOADING_PROGRESS"),
	
	addEventListenerOnce: function(event,callback){
		var handler = function(e)
			{ 
				console.log(event);
				callback.call();
				document.removeEventListener(event, handler);
			}
		document.addEventListener(event,handler, false);
	},
	
	addEventListener: function(event, callback){
		document.addEventListener(event, callback);
	},
	
	dispatchEvent : function(event, data){
		
		var evt = TXM.dispatcher[event];
		
		if(data){
			evt = new CustomEvent(event, {detail: data})
		}
		
		document.dispatchEvent(evt);
	},
	
	onAssetsReady : function(event){
		console.log(event.type);
		TXM.dispatcher.dispatchEvent("ENGAGEMENT_STARTED");
	},
	
	onEngagementAssetLoadingProgress: function(event){
		console.log("loading "+Math.round(event.detail*100)+"%");
	}
	
}

TXM.api = {
	
	incrementCurrentStep : function(){
		TXM.api.track("navigation", "next", "step "+TXM.params.current_step++);
		
		TXM.api.getCurrentStep();
		console.log("CURRENT_STEP: "+TXM.params.current_step);
	},
	
	setCurrentStep : function(val){
		TXM.api.track("navigation", (val-TXM.params.current_step == 1)?"next":"goto", "step "+val);
		TXM.params.current_step = val;
		
		TXM.api.getCurrentStep();
		console.log("CURRENT_STEP: "+TXM.params.current_step);
	},
	
	getCurrentStep: function() {
		$(TXM.ui.stepContainer).get(0).innerHTML = "Current Step: "+TXM.params.current_step;
        return TXM.params.current_step;
    },
	
	track : function(type, label, value){
		TXM.tracker.trackInteraction(type, label, value);
	},
	
	endEngage : function(){
		$(TXM.ui.adContainer).empty();
		TXM.dispatcher.dispatchEvent("ENGAGEMENT_ENDED");
	},
	
	saveVoteData: function(category, label, vote){
		var data = "[{\"type\":\"vote\","+"\"vote\":"+vote+",\"label\":\""+label+"\",\"category\":\""+category+"\"}]";
		
		TXM.params._savedData = data;
		console.log(TXM.params._savedData);
	},
	
	getVoteSummary : function(){
		
		var ctr;
		var data = [];
		
		for(ctr=1; ctr <= 6; ctr++)
		{
			data.push({category:"1", vote:ctr, vote_count:Math.floor(Math.random() * 500) + 1});	
		}
		
		console.log(data);
		console.log("This creates dummy data for testing purposes. Modify it as you see fit.");
		
		return data;
	},
	
	saveCommentData : function(comment, label){
		
		console.log(comment+", "+label);
		
	},
	
	getRecentComments : function(){
		
		var ctr;
		var comments = [];
	
		for(ctr=1; ctr <= 5; ctr++)
		{
			data.push({body:"Lorem ipsum dolor sit amet...", ago:ctr+" minutes ago..."});	
		}
		
		console.log("This creates dummy comments for testing purposes. Modify it as you see fit.");
		
		return comments;
	},
	
	true_attention: {completed: false, one_interaction: false, time_up: false}
}

TXM.tracker = {
	trackInteraction : function(type, label, value){
		
		var markup = "<div class='txm_log'>";
		
		if(type != "initial")
		{
			if(!TXM.params.credited && !TXM.params.current_time)
			{
				TXM.params.credited = true;
				TXM.api.true_attention.completed = true;
				TXM.dispatcher.dispatchEvent("ENGAGEMENT_CREDITED");
			}
		}
		
		if(type != "initial")
			TXM.api.true_attention.one_interaction = true;
		
		if(type != "initial" && type != "click")
			TXM.params.preventAdContainerClick = true;
		
		console.log(type +", "+ label+((value)?", "+value:""));
		
		markup += "<span class='txm_interaction'>[Interaction]</span>";
		markup += "<span class='txm_step "+((type == "navigation")?"txm_navigation":"")+"'>["+TXM.params.current_step+"]</span>";
		markup += "<span class='txm_type'>"+type+"</span>";
		markup += "<span class='txm_label'>"+label+"</span>";
		
		if(value)
			markup += "<span class='txm_value'>"+value+"</span>";
		
		markup += "</div>";
		
		TXM.ui.log(markup);
		
	}
}

TXM.ui = {

	adContainer: "#txm_adContainer",
	interactionContainer: "#txm_current_interactions",
	stepContainer: "#txm_current_step",
	timeContainer: "#txm_current_time",
	logsContainer: "#txm_logs",
	
	show : function (val){
		$(TXM.ui.adContainer).append(val);
	},
	
	log: function(val){
		$(TXM.ui.logsContainer).append(val);
	},
	
	completion: function(){
		
		var markup = "<div class='txm_log'>";
		
		markup += "<span class='txm_completion'>[Completion]</span>";
		markup += "<span class='txm_tagdata'>"+TXM.params._savedData+"</span>";
		
		markup += "</div>";
		
		TXM.ui.log(markup);
	}
}

TXM.utils = {
	
	popupWebsite : function(val, end){
	
		var pattern = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;
		
		if(pattern.test(val))
			window.open(val, "_blank");
		
		TXM.api.track("external_page", "website", val);
		
		if(end)
			TXM.api.endEngage();
		
	},
	
	shareToFacebook :function(url, title, caption, description, imageUrl){
		TXM.api.track("share", "facebook");
		console.log(url+", "+title+", "+caption+", "+description+", "+imageUrl);
	},
	
	shareToTwitter :function(tweet, url){
		TXM.api.track("share", "twitter");
		console.log(tweet+", "+url);
	},
	
	shareToPinterest :function(url, description, imageUrl){
		TXM.api.track("share", "pinterest");
		console.log(url+", "+description+", "+imageUrl);
	},
	
	loadExternalTracking : function(url){
		var markup = "<div class='txm_log'>";
		
		markup += "<span class='txm_tag'>[Tag]</span>";
		markup += "<span class='txm_tagdata'>"+url+"</span>";
		
		markup += "</div>";
		
		TXM.ui.log(markup);
		console.log(url);
	},
	
	loadExternalScript : function(url){
		
		var markup = "<div class='txm_log'>";
		
		markup += "<span class='txm_tag'>[Tag]</span>";
		markup += "<span class='txm_tagdata'>"+url+"</span>";
		
		markup += "</div>";
		
		TXM.ui.log(markup);
		console.log(url);
	}
	
}

function polyfillCustomEvent(){
	
	if ( typeof window.CustomEvent === "function" ) return false;
	
	 CustomEvent.prototype = window.Event.prototype;
	
	 function CustomEvent ( event, params ) {
			
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	
	}
	
	 window.CustomEvent = CustomEvent;
}

TXM.init();