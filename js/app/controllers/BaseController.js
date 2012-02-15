//(function () {
define(['views/BaseView','models/BaseModel'],function(BaseView, BaseModel){
    BaseController = Backbone.View.extend({
		
		initialize : function(){
			this.el = $('#home');
			//this._model   = new BaseModel();
			this._view    = new BaseView({el: this.el});
			//console.log(this._model);
		},
		start: function(){
			this._view.animate();
			//$('#home').append(this._model.get('items'));
		}
	});
	return BaseController;
});	
//})();
