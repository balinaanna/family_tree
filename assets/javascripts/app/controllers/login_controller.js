define(['models/login_model'], function (LoginModel) {
	return Backbone.View.extend({
	
		events : {
			"click .tab" 				: "clickOnTab",
			"click #registrationbtn" 	: "registration",
			"click #loginbtn" 			: "login",
			"click .flipLink"			: "flipShow",
			"click #recoverbtn"			: "passwordRecover",
			"keypress #loginPass"		: "checkEnter",
			"keyup input[type='text'], input[type='password']"	: "checkInputText"
		},
		
		initialize : function (options) {
			this.el = options.el;
			this.model = new LoginModel();
			//this.model.checkLogin();
			this.getView(this.model.get("url"));
			$('#loginbtn').attr('disabled','disabled');
			$('#registrationbtn').attr('disabled','disabled');
			$("#birth_date").datepicker({ changeYear: true, yearRange: '1900:2050', createButton:false, clickInput:true });
			this.model.bind("change:login_error", $.proxy(this.showLoginError, this));
			this.model.bind("change:reg_error", $.proxy(this.showRegError, this));
			this.model.bind("change:recover_status", $.proxy(this.showRecoverError, this));
		},
		
		destroy : function () {
			this.el.empty();
			this.unbind();
		},
		
		getView : function (url) {
			$.ajaxSetup({cache : false});
			$.ajaxSetup({async : false});
			$.ajax({
				url : url,
				success : $.proxy(this.renderView, this)
			});
		},
		
		renderView : function (template) {
			this.el.append(template);
			this.delegateEvents();
		},
		
		clickOnTab : function (e) {
			var id = $(e.target).attr("id");
			if (id == 'registertab') {
				$('#recoverbox').hide();
				$("#logintab").removeClass("select");
				$("#registertab").addClass("select");
				$("#loginbox").hide();
				$("#signupbox").show();
				$('#infmessage').hide();
			} else {
				$('#recoverbox').hide();
				$("#registertab").removeClass("select");
				$("#logintab").addClass("select");
				$("#signupbox").hide();
				$("#loginbox").show();
				$('#infmessage').hide();
			}
		},
		
		registration : function () {
			var data = {
				email 	: $("#regEmail").val(),
				pass 	: $("#password").val(),
				f_name 	: $("#first_name").val(),
				l_name 	: $("#last_name").val(),
				b_date 	: $("#birth_date").val(),
				sex 	: $("input[@name='s']:checked").val()
			};
			this.model.registration(data);
		},
		
		login : function () {
			var data = {
				email 	: $("#loginEmail").val(),
				pass	: $("#loginPass").val()
			};
			this.model.login(data);
		}, 
		
		showLoginError : function () {
			$('#infmessage').html(this.model.get("login_error"));
			$('#infmessage').addClass("infmessage");
			$('#infmessage').addClass("errormsg");
			$('#infmessage').show();
		},
		
		showRegError : function () {
			$('#infmessage').html(this.model.get("reg_error"));
			$('#infmessage').addClass("infmessage");
			$('#infmessage').addClass("errormsg");
			$('#infmessage').show();
		},
		
		showRecoverError: function(){
			if(this.model.get("recover_status") == "1"){
				$('#infmessage').html("Password send to " + $("#recoverEmail").val());
				$('#infmessage').addClass("infmessage");
				$('#infmessage').addClass("successmsg");
			}
			if(this.model.get("recover_status") == "0"){
				$('#infmessage').html($("#recoverEmail").val() + " does not exists");
				$('#infmessage').addClass("infmessage");
				$('#infmessage').addClass("errormsg");
			}
			$('#infmessage').show();
		},
		
		flipShow: function(e){
			e.preventDefault();
			var id = $(e.target).attr("id");
			if(id == "flipToRecover"){
				$('#loginbox').hide();
				$('#recoverbox').show();
				$('#infmessage').hide();
			}
			if(id == "flipToLogin"){
				$('#recoverbox').hide();
				$('#loginbox').show();
				$('#infmessage').hide();
			}	
		},
		
		passwordRecover: function(){
			var data = {
				email 	: $("#recoverEmail").val()
			};
			this.model.passwordRecover(data);
		},
		
		checkInputText: function(e){
			if($('#loginEmail').val() != '' && $('#loginPass').val() != ''){
         		$('#loginbtn').removeAttr('disabled');    		
        	}else{
        		$('#loginbtn').attr('disabled','disabled');
        	}
        	if($('#regEmail').val() != '' && $('#password').val() != ''){
         		$('#registrationbtn').removeAttr('disabled');      		
        	}else{
				$('#registrationbtn').attr('disabled','disabled');
        	}
		},
		
		checkEnter : function(e) {
			if (e.keyCode == 13) {
        		this.login();
    		}
		}
	})
});