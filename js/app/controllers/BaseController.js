(function () {

    BaseController = Backbone.Collection.extend({
		
		initialize : function(){
			this.el = $('#home');
			this._model   = new BaseModel();
			this._view    = new BaseView(this.el);
			//console.log(this._model);
		},
		start: function(){
			//this._view.render(this._model.get('items'));
			$('#home').append(this._model.get('items'));
		}
	});
})();
