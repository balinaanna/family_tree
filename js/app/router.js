define(['views/BaseView', 'models/BaseModel'], function(BaseView, BaseModel) {
	return Backbone.Router.extend({

		initialize : function(options) {
			console.log("initialize");
		},
		routes : {
			"" : "WebApp"
		},

		WebApp : function() {
			// $(document).ready(function(){
			$('#home').hide();
			$('#loginform').hide();
			//this.el = $('#home');
			//$.ajaxSetup({cache:false});
			$('#register').on("click", function() {
				$.ajax({
					url : "/server/api/reg",
					type : "POST",
					data : {
						"email" : $("#email").val(),
						"pass" : $("#pass").val(),
					},
					success : function(data) {
						console.log(data);
						var resp = JSON.parse(data);
						if(resp.status == "1") {
							console.log(data);
						}
						if(resp.status == "0") {
							console.log(data);
						}
					}
				});
			});
			$('#login').on("click", $.proxy(this.login,this));
				
			$.ajax({
				url : "/server/api/",
				type : "GET",
				success : $.proxy(function(data) {
					var answ = JSON.parse(data);
					console.log(answ.status);
					if(answ.status == "1") {
						$('#home').show();
						console.log(this);
						this.canvasLoad();
					}
					if(answ.status == "0") {
						$('#loginform').show();
					}
				}, this)
			});
			console.log('offLineWebApplication router start');
		},
		login : function() {
			$.ajax({
				url : "/server/api/login",
				type : "POST",
				data : {
					"email" : $("#email").val(),
					"pass" : $("#pass").val(),
				},
				success : $.proxy(function(data) {
					var resp = JSON.parse(data);
					if(resp.status == "1") {
						$('#loginform').hide();
						$('#home').show();
						this.canvasLoad();
					}
					if(resp.status == "0") {
						console.log(data);
						$('#infmessage').html(resp.message);
					}
				}, this)
			});
		},
		canvasLoad : function() {
			this.el = $('#home');
			this._currentController = new BaseView({
				el : this.el
			});
			this._currentController.animate();
		}
	});

});
