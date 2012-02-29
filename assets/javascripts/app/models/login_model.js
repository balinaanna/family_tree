define(function () {
	return Backbone.Model.extend({
	
		initialize : function () {
			
		},
		
		defaults : {
			url : "/assets/javascripts/app/templates/login.ejs",
			login_error : null,
			reg_error : null
		},
		
		login : function (data) {
			$.ajax({
				url : "/server/api/login",
				type : "POST",
				data : data,
				success : $.proxy(this.successLogin, this)
			});
		},
		
		successLogin : function (resp) {
			resp = JSON.parse(resp);
			if (resp.status == "1") {debugger
				//localStorage.setItem("email", resp.email);
				//localStorage.setItem("prof_id", resp.prof_id);
				//localStorage.setItem("autologin", resp.autologin);
				//TODO: add info to attr
				window.location.href = "#tree";
			} else {
				this.set({login_error : resp.message})
			}
		},
		
		registration : function (data) {
			$.ajax({
				url : "/server/api/reg",
				type : "POST",
				data : data,
				success : $.proxy(this.successRegistration, this)
			});
		},
		
		successRegistration : function (resp) {
			resp = JSON.parse(resp);
			if(resp.status == "1") {

			}
			if (resp.status == "0") {

			}
		}
	});
});