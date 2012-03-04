define(['views/BaseView','models/BaseModel'], function(BaseView, BaseModel){
    return Backbone.View.extend({
		
		initialize : function(options) {
		
			console.log("base controller view loaded")
			
			this.el = options.el;
			this.model = new BaseModel();
			this.getView(this.model.get("url"));
			$("#birth_date").datepicker({ changeYear: true, yearRange: '1900:2050', createButton:false, clickInput:true });
			//this._model   = new BaseModel();
			this._view    = new BaseView({el : this.el, model : this.model});
			this.start();
			//console.log(this._model);
		},
		destroy : function () {
			this.el.empty();
			this.unbind();
		},
		
		getView : function (url) {
			$.ajaxSetup({async : false});
			$.ajax({
				url : url,
				success : $.proxy(this.renderView, this)
			});
		},
		
		renderView : function (template) {
			this.el.append(template);
			//this.delegateEvents();
		},
		
		start: function(){
			this._view.animate();
		}
	});
});
