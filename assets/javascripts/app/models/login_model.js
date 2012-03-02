define(function () {
	return Backbone.Model.extend({
	
		initialize : function () {
			
		},
		
		defaults : {
			url : "/assets/javascripts/app/templates/login.ejs",
			login_error : null,
			reg_error : null,
			recover_status: null
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
				localStorage.setItem("email", resp.email);
				localStorage.setItem("prof_id", resp.prof_id);
				localStorage.setItem("autologin", resp.autologin);
				//TODO: add info to attr
				Backbone.history.navigate('tree', true);
			} else {
				this.set({login_error : resp.message})
			}
		},
		
		registration : function (data) {
			this.set({reg_data: data});
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
				this.login(this.get('reg_data'));
			}
			if (resp.status == "0") {
				this.unset('reg_data');
				this.set({reg_error : resp.message})
			}
		},
		
		passwordRecover: function(data){
			this.set({reg_data: data});
			console.log(data);
			$.ajax({
				url : "/server/api/pass_recover",
				type : "POST",
				data : data,
				success : $.proxy(this.successRecover, this)
			});
		},
		
		successRecover: function(resp){
			resp = JSON.parse(resp);
			var data = this.get('reg_data');
			console.log(data);
			if(resp.status == "1") {
				this.set({recover_status : "Password send to " + data.email});
			}
			if (resp.status == "0") {
				this.set({recover_status : data.email + " does not exists"});
			}
		}
	});
});