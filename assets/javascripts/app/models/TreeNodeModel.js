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
		
		}
		
	});
});	