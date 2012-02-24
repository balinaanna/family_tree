define(['views/BaseView', 'models/BaseModel'], function(BaseView, BaseModel) {
	return Backbone.Router.extend({

		initialize : function(options) {
			console.log("initialize");
		},
		routes : {
			"" : "WebApp"
		},

		WebApp : function() {
			//$.ajaxSetup({cache:false});
			$('#home').hide();
			$('#formContainer').hide();
			$(".tab").click(function() {
				var X = $(this).attr('id');

				if(X == 'registertab') {
					$("#logintab").removeClass('select');
					$("#registertab").addClass('select');
					$("#loginbox").hide();
					$("#signupbox").show();
				} else {
					$("#registertab").removeClass('select');
					$("#logintab").addClass('select');
					$("#signupbox").hide();
					$("#loginbox").show();
				}

			});
			$('#registrationbtn').on("click", function() {
				event.preventDefault();
				$.ajax({
					url : "/server/api/reg",
					type : "POST",
					data : {
						"email" : $("#regEmail").val(),
						"pass" : $("#password").val(),
						"f_name" : $("#first_name").val(),
						"l_name" : $("#last_name").val(),
						"b_date" : $("#birth_date").val(),
						"sex" : $("input[@name='s']:checked").val()
					},
					success : function(data) {
						console.log(data);
						var resp = JSON.parse(data);
						if(resp.status == "1") {
							$('#reg_result').html(resp.message);
						}
						if(resp.status == "0") {
							$('#reg_result').html(resp.message);
						}
					}
				});
			});
			$('#loginbtn').on("click", $.proxy(this.login, this));

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
						$('#formContainer').show();
						this.autologin(this);
					}
				}, this)
			});
			console.log('offLineWebApplication router start');
		},
		login : function(event) {
			event.preventDefault();
			$.ajax({
				url : "/server/api/login",
				type : "POST",
				data : {
					"email" : $("#loginEmail").val(),
					"pass" : $("#loginPass").val(),
				},
				success : $.proxy(function(data) {
					var resp = JSON.parse(data);
					if(resp.status == "1") {
						$('#formContainer').hide();
						localStorage.setItem("email", resp.email);
						localStorage.setItem("autologin", resp.autologin);
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
		autologin : function(event) {
			$.ajax({
				url : "/server/api/login",
				type : "POST",
				data : {
					"email" : localStorage.getItem("email"),
					"autologin" : localStorage.getItem("autologin"),
				},
				success : $.proxy(function(data) {
					var resp = JSON.parse(data);
					if(resp.status == "1") {
						$('#formContainer').hide();
						$('#home').show();
						this.canvasLoad();
					}
					if(resp.status == "0") {
						
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
