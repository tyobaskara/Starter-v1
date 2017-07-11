

var defer = {
	css: [
		'/assets/css/vendor.min.css',
		'/assets/css/plugins.min.css',
		'/assets/css/main.css',
	],

	js: [
		'/assets/js/plugins.min.js',
		'/assets/js/app.min.js',
	]
}


// Add a script element as a child of the body
 function downloadJSAtOnload() {

 	if(
 		typeof(defer)!=='undefined' &&
 		typeof(defer)!=='null' &&
 		typeof(defer.js)!=='undefined' && 
 		typeof(defer.js!=='null')
 	) {
 		var len = defer.js.length;
 		for(var idx=0;idx<len;idx++){
			var element = document.createElement("script");
            element.async = "async";
			element.src = defer.js[idx];
			document.head.appendChild(element);
 		}
 	}

 }

 var cb = function () {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    var m = document.createElement('link'); m.rel = 'stylesheet';
    var n = document.createElement('link'); n.rel = 'stylesheet';

    var a = document.createElement('link'); a.rel = 'stylesheet';
    var b = document.createElement('link'); b.rel = 'stylesheet';

    l.href = '/Assets/Css/indosat-additional.css';
    m.href = '/Assets/Css/im3-ooredoo-main.css';
    n.href = '/Assets/Css/plugins.min.css';
    a.href = '/Assets/Css/vendor.min.css';

    document.getElementsByTagName("head")[0].appendChild(a);

    document.getElementsByTagName("head")[0].appendChild(l);
    document.getElementsByTagName("head")[0].appendChild(n);
    document.getElementsByTagName("head")[0].appendChild(m);
};


/*
// Check for browser support
var raf = requestAnimationFrame || mozRequestAnimationFrame ||
webkitRequestAnimationFrame || msRequestAnimationFrame;
if (raf) raf(cb);
else window.addEventListener('load', cb);
 */

 // Check for browser support of event handling capability
 if (window.addEventListener)
 window.addEventListener("load", downloadJSAtOnload, false);
 else if (window.attachEvent)
 window.attachEvent("onload", downloadJSAtOnload);
 else window.onload = downloadJSAtOnload;