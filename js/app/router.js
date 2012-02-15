define(['controllers/TreeController', 'views/BaseView'],	function(TreeController, BaseView){
    return Backbone.Router.extend({
		
		initialize : function (options) {
			console.log("initialize");
        },

        routes: {
            "": "WebApp"
	},

        WebApp : function () {
        	$(document).ready(function(){
        	this.el = $('#home');
        	
            this._currentController = new BaseView({el: this.el});
          
           //this._currentController = new BaseController();
            //this._currentController = new TreeController({el: this.el});
            //this._currentController = new Controller();
			//this._currentController.start();
			this._currentController.animate();
			});
			console.log('offLineWebApplication router start');
        },
		
		sync : function () {
			console.log('this is just an example')
		}
    });
    
});