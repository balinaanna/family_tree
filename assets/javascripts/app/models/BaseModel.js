//(function () {
define([],function(){	
	return BaseModel = Backbone.Model.extend({
		
		initialize : function () {
			
		},
		
		defaults : {
			url : "/assets/javascripts/app/templates/tree.ejs",
			login_error : null,
			reg_error : null
		},
		
		getLocal: function(key){
			console.log('getlocal');
			//return JSON.parse(localStorage.getItem(key));
			return localStorage.getItem(key);
		},
		setLocal: function(key, value){
			localStorage.setItem(key, value);
			//localStorage.setItem(key, JSON.stringify(value));
		}
	});
});	
//})();
