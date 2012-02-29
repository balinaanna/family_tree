define(['controllers/login_controller', 'controllers/BaseController'], function(loginController, BaseController) {
	return Backbone.Router.extend({

		initialize : function () {
			this._container = $('#wr');
			this._currentController = null;
		},
		
		routes : {
			"tree" 		: "tree",
			"*actions"  : "login"
		},
		
		_runController : function (ControllerConstructor) {
			if (this._currentController) {
				this._currentController.destroy();
			}
			this._container.empty();
			this._currentController = new ControllerConstructor({el : this._container});
		},
		
		login : function () {
			this._runController(loginController);
		},
		
		tree : function () {
			//TODO: will be DONE soon
			this._runController(BaseController);
			console.log('load tree view');debugger
		}
		
	});

});
