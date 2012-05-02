define(['models/TreeNodeModel'],function(TreeNodeModel){	
	return Backbone.Collection.extend({
		unique: true,
		model: TreeNodeModel,
		//url : "/data.json",
		url : "/server/api/get_tree",
		initialize: function(){
			this.bind('add', this.addModel);
			this.bind('remove', this.removeModel);
			/*this.fetch({
    				success: function(collection) {
       						console.log(collection);
       						
       					}
    			});
    		console.log(this);*/
	   	},
	   	addModel: function(model){
			console.log("add model");
			console.log(model);
			//this.ajaxSend("/server/api/add_node",model);
		},
		removeModel: function(model){
			console.log("remove model");
			console.log(model);
			//this.ajaxSend("/server/api/delete_node",model);
		},
		ajaxSend: function(url, model){
				$.ajax({
					url: url,
					type: "POST",
					data: {"json_response": JSON.stringify(model.toJSON())},
					success : function(data) {
						console.log(data);
						}
				});
		}
	});
});	