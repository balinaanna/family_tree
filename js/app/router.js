//$(document).ready(function () {
define(['controllers/BaseController'],	function(BaseController){
    Router = Backbone.Router.extend({
		
		initialize : function (options) {
			
			console.log("initialize");
        },

        routes: {
            "": "WebApp"
	},

        WebApp : function () {
            
            this._currentController = new BaseController();
			this._currentController.start();
			console.log('offLineWebApplication router start');
        },
		
		sync : function () {
			console.log('this is just an example')
		}
    });
    return Router;
});    
    //var router = new Router();
   // Backbone.history.start()
//});
