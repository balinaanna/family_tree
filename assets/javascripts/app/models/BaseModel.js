//(function () {
define([],function(){	
	return BaseModel = Backbone.Model.extend({
		
		initialize : function () {
			
		},
		
		defaults : {
			url : "/assets/javascripts/app/templates/tree.ejs",
			send_status: null
		},
		
		sendData: function(opt){
			$.ajax({
    				url : opt.url,
    				type : "POST",
    				dataType : 'json',
    				data : opt.data,
    				success : $.proxy(this.sendDataSuccess, this),
    				error : function(error) {
    					console.log(error.responseText);
    				}
    			});
		},
		
		sendDataSuccess: function(){		
			this.trigger("change:send_status");
		}
	});
});	
//})();
