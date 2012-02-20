define(['views/BaseView1','models/BaseModel'], function(BaseView, BaseModel){
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
        	$.ajaxSetup({cache:false});
        	$.ajax({
					url: "/server/api/login",
					type: "POST",
					data: {
						email: "email@com.com",
						pass: "pass"
					},
					success : function(data) {
						console.log(data);
						}
				});
		this._currentController = new BaseView({el: this.el});
		this._currentController.animate();
	    });
	    console.log('offLineWebApplication router start');
        }
    });
    
});