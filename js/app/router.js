define(['views/BaseView','models/BaseModel'], function(BaseView, BaseModel){
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
		this._currentController.animate();
	    });
	    console.log('offLineWebApplication router start');
        }
    });
    
});