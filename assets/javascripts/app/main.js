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
	require(['router'], function (Router) {
		$(document).ready(function(){
			var router = new Router();
			Backbone.history.start();		
		})
	});
}(this.require));
