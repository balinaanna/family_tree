//(function () {
define([],function(){	
	BaseModel = Backbone.Model.extend({
				
		initialize: function(){
			var root  = this;
			var key   = 'App';
			var re;
			this.url = '/server/api/';
			//this.save().complete(function(rest){
				//console.log(rest);
			//	re=rest;
				//console.log(rest.responseText);
				//var result =  eval( '(' + rest.responseText + ')');
				//root.setLocal(key, rest.responseText);
				//this.set({"items": rest.responseText});
				//root.setLocal(key,JSON.parse(rest.responseText));
			//	});
			//this.set({"items": this.getLocal(key)});
			//console.log(this.toJSON());
			
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
	return BaseModel;
});	
//})();
