(function () {

    BaseController = Backbone.Router.extend({
		
		initialize : function(){
			this.el = $('#home');
			this._model   = new BaseModel();
			this._view    = new BaseView({el: $('body')});
			//console.log(this._model);
		},
		start: function(){
			this._view.animate();
			//$('#home').append(this._model.get('items'));
		}
	});
})();
