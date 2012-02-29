define([],function(){	
	return Backbone.Model.extend({
		defaults:{
			
			mouseX : 0,
			mouseY : 0,
			
			isMouseDown : false,
			onMouseDownPosition: null,
			mouse : new THREE.Vector2(),
			nodeWidth : 270,
			nodeHeight : 320,
            SELECTED: null
		}
	});
});	