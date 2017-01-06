#Truex Modular HTML5 Template
A template to help simplify the process of creating Truex ads in HTML5.

##How To Use
1. Locate the **TXConfig** module **(line #26)** inside **edit/logic-modular.js** and start updating the following variables. Please note that the urls that you will be using must be from the Truex server via **Asset Uploader**. 

```Javascript
/**
 * Place all your image URLS here.
 */
var creativeImages = 
[
  'absolute-url-of-your-image.jpg',
  'absolute-url-of-your-image.jpg',
  'absolute-url-of-your-image.jpg'
];

/**
 * Place all your 3rd party JS scripts here.
 */
var creativeScripts = 
[
	'absolute-url-of-your-script.js',
];

/**
 * Place all your CSS stylesheets here.
 */
var creativeCSS = 
[
	'absolute-url-of-your-stylesheet.css',
];

/**
 * Place your HTML markup here.
 */
var creativeHTML = 'absolute-url-of-your-markup.html';
```	
2. Locate the **TXCreative** module **(line #537)** inside **edit/logic-modular.js** and start writing your whole creative's logic inside the **render()** function. You can also write your own creative initialization function (ie: init(), startAd(), etc) and call it inside the **render()** function.

```Javascript
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
```

##Template Features
* It abstracts Truex's boilerplate codes from the main ad's logic.
* Helps the developer to focus more on coding the creative.
* Creates a **centralize** location for custom codes.
* **Modular** approach for readability and extensibility.

##Template Modules
Currently, this template is divided into 4 modules:

####TXConfig Module
The TXConfig module is the configuration / settings of every TrueX HTML5 builds. This is where you will set all the stuff your creative will use like images, sounds, external js, and css.

####TXAd Module
The TXAd module is where the main initialization of the TrueX Ad takes place. These includes anything from the actual loading of assets (images, sounds, etc) to setting up the "Ad Lifecycle" of your creative.

####TXVideo Module
The TXVideo Module handles everything about **video loading** and **quartiles tracking**.

####TXCreative Module
The TXCreative Module is the **MEAT** of your creative. This is where all of your **CUSTOM** codes will go, meaning, all of your creative's "logic" will be run through here. This makes it much more easier to build an ad since you have a "central" location of all your custom codes.
