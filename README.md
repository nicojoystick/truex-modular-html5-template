#Truex Modular HTML5 Template
A template to help simplify the process of creating Truex ads in HTML5.

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
