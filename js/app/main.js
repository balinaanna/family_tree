require.config({
  paths: {
   // jQuery: '../libs/jquery-1.7.1',
  //  Underscore: '../libs/underscore',
  //  Backbone: '../libs/backbone'
  /*  Three: '../libs/Three',
    Stats: '../libs/js/Stats',
    Helvetiker_regular_typeface: '../libs/js/helvetiker_regular.typeface',
    ThreexDom: '../libs/threex.domevent',
    ThreexObj: '../libs/threex.domevent.object3d',
    jQueryUI: '../libs/jquery-ui-1.8.17.custom.min',
    Tiny_mce: '../libs/tinymce/jscripts/tiny_mce/tiny_mce'*/
  }

});

require([ 'router',
	//'order!../libs/jquery-1.7.1',
	//'order!../libs/underscore', 
	//'order!../libs/backbone',
	//'order!../libs/Three',
	'order!../libs/js/Stats',
	'order!../libs/js/helvetiker_regular.typeface',
	'order!../libs/threex.domevent',
	'order!../libs/threex.domevent.object3d',
	'order!../libs/jquery-ui-1.8.17.custom.min',
	'order!../libs/tinymce/jscripts/tiny_mce/tiny_mce',
	'order!js/libs/jquery.simplemodal.js',
	'order!js/libs/jquery.imgareaselect.pack.js',
	'order!js/libs/upclick.js',
	'order!js/libs/popups.js',
	'order!js/libs/osx.js'], function(Router){
	$(document).ready(function(){
		var router = new Router();
    	Backbone.history.start()
		
	})
});
