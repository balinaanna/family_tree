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
			if (resp.status == "1") {
				localStorage.setItem("email", resp.email);
				localStorage.setItem("prof_id", resp.prof_id);
				localStorage.setItem("autologin", resp.autologin);
				//TODO: add info to attr
				Backbone.history.navigate('tree', true);
			} else {
				this.set({login_error : resp.message});
				this.trigger("change:login_error");
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
				this.set({reg_error : resp.message});
				this.trigger("change:reg_error");
			}
		},
		
		passwordRecover: function(data){
			$.ajax({
				url : "/server/api/pass_recover",
				type : "POST",
				data : data,
				success : $.proxy(this.successRecover, this)
			});
		},
		
		successRecover: function(resp){
			resp = JSON.parse(resp);
			this.set({recover_status : resp.status});
			this.trigger("change:recover_status");
		},
		
		checkLogin: function(){
			$.ajax({
				url : "/server/api/",
				type : "GET",
				success : $.proxy(this.successCheckLogin, this)
			});
		},
		
		successCheckLogin: function(resp){
			var answ = JSON.parse(resp);
			if(answ.status == "1") {
				Backbone.history.navigate('tree', true);	
			}
			if(answ.status == "0") {
				if(localStorage.getItem("autologin")){
					data = {
						"email" : localStorage.getItem("email"),
						"autologin" : localStorage.getItem("autologin")
					};
					this.login(data);
				}else{
					Backbone.history.navigate('', true);
				}	
			}
		},
		
		logout: function(){
			localStorage.clear();
			document.cookie = 'ci_session' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
			Backbone.history.navigate('', true);
		},
	});
});