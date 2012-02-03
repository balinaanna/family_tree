(function () {

	var URL = 'js/app/templates/',
	EJS = '.ejs'
		

    BaseView = Backbone.View.extend({
		
		initialize: function(el){
			this.el = el;
		},
		render: function(temp){
			console.log(temp);
			this.el.html('<h1>Backbone append data:</h1>');
			//this.el.append(temp);
			var template = _.template(this.getTemplate(URL + 'test' + EJS));
			this.el.append(template({items: temp}));
		},
		getTemplate : function (url) {
			var ejs = '';
			$.ajaxSetup({
				async : false
			});
			$.ajax({
				url : url,
				success : function (result) {
					ejs = result;
				}
			});
			return ejs;
		}
	});
})();
