define([],function(){	
	return Backbone.Model.extend({
		defaults:{
				//tree: []
				id: null,
				l_name: null,
				f_name:null,	
				f_id:null,	
				m_id:null,
				ch_ids:[],
				spouse_id:null,
				b_date:null,
				d_date:null,
				sex:null,
				photo_url:null,
				comment:null
		},
				
		initialize: function(){
		this.on("change", function(model, key, atribute){
                console.log(model);
                console.log(model.id);
                console.log(model.changedAttributes());
                var obj = model.changedAttributes();
                obj.id = model.id;
               
                $.ajax({
					url: "/server/api/save_node",
					type: "POST",
					data: {"json_response": JSON.stringify(obj)},
					//data: model.changedAttributes(),
					success : function(data) {
						console.log(data);
						}
				});
            });
			
		},
		update: function(key, data){
			this.set({key: data});
			this.trigger("change");
		},
		getLocal: function(key){
			console.log('getlocal');
			return localStorage.getItem(key);
		},
		setLocal: function(key, value){
			localStorage.setItem(key, value);
		}
	});
});	