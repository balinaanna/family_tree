define([],function(){	
	return Backbone.Model.extend({
		defaults:{
				tree: []		
		},
				
		initialize: function(){
			var root  = this;
			var key   = 'App';
			var re;
			this.url = '/server';
			this.bind("change:tree", function(){
                this.setLocal("tree",JSON.stringify(this.get("tree")));
            });
			/*this.save().complete(function(rest){
				re=rest;
				console.log(rest.responseText);
				var result =  eval( '(' + rest.responseText + ')');
				root.setLocal(key, rest.responseText);
				//root.setLocal(key,JSON.parse(rest.responseText));
			});*/
			//this.set({"items": this.getLocal(key)});
			
			
			var data = JSON.parse('{"id":"1","tree":{"1":{"l_name":"name1","f_name":"name2","f_id":"2","m_id":"3","ch_ids":["11","12","13"],"spouse_id":"10","b_date":"1989","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "2":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"5","ch_ids":"1","spouse_id":"3","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "3":{"l_name":"name3","f_name":"fname3","f_id":"6","m_id":"7","ch_ids":"1","spouse_id":"2","b_date":"1990","d_date":"0","sex":"f","photo_url":null,"comment":"comment"},\n\
													 "4":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":"2","spouse_id":"5","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "5":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":"2","spouse_id":"4","b_date":"1990","d_date":"0","sex":"f","photo_url":null,"comment":"comment"},\n\
													 "6":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":"3","spouse_id":"7","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "7":{"l_name":"name2","f_name":"fname2","f_id":"8","m_id":"9","ch_ids":"3","spouse_id":"6","b_date":"1990","d_date":"0","sex":"f","photo_url":null,"comment":"comment"},\n\
													 "8":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"9","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "9":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"8","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "11":{"l_name":"name2","f_name":"fname2","f_id":"1","m_id":"10","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "12":{"l_name":"name2","f_name":"fname2","f_id":"1","m_id":"10","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"},\n\
													 "13":{"l_name":"name2","f_name":"fname2","f_id":"1","m_id":"10","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"comment"}, \n\
													 "10":{"l_name":"name1","f_name":"name2","f_id":"","m_id":"","ch_ids":["11","12","13"],"spouse_id":"1","b_date":"1989","d_date":"0","sex":"m","photo_url":null,"comment":"comment"}}}');
			this.set("tree", data.tree);
			
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