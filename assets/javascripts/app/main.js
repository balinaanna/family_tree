(function (require) {
	/** load all libs */
	require.config({
		baseUrl : 'assets/javascripts',
		paths : {
			'Three'			: 'libs/Three'
		}
	});
	require(['Three']);
	
	/**load router*/
	require.config({baseUrl : 'assets/javascripts/app'});
	require(['router',
	'order!../libs/jquery-ui.min',
	'order!../libs/tinymce/jscripts/tiny_mce/tiny_mce',
	'order!../libs/jquery.simplemodal',
	'order!../libs/jquery.imgareaselect.pack',
	'order!../libs/upclick',
	'order!../libs/popups',
	'order!../libs/osx'
	], function (Router) {
		$(document).ready(function(){
			var router = new Router();
			Backbone.history.start();		
		})
	});
}(this.require));
