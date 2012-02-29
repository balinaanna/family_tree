define(['collections/TreeCollection','models/TreeNodeModel'],function(Collection, Model){
    BaseController = Backbone.Router.extend({
		
		initialize : function(){
			//this.el = $('#home');
			this._model = new Model();
			this._collection = new Collection();
			this._model.set({id: "a", lastName: '1st'}); 
			this._collection.add(this._model);
			var m1 = new Model({id:"6", lastName: '2nd'});
			this._collection.add(m1);
			this._collection.add({id:"8j", lastName: '3nd'})
		},
		start: function(){
			//this._view.animate();
			//$('#home').append(this._model.get('items'));
			console.log(this._collection.get("8j"));
			console.log(this._collection.toJSON());
		}
	});
	return BaseController;
});