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
                console.log(JSON.stringify(this.get("tree")));
            });
			/*this.save().complete(function(rest){
				re=rest;
				console.log(rest.responseText);
				var result =  eval( '(' + rest.responseText + ')');
				root.setLocal(key, rest.responseText);
				//root.setLocal(key,JSON.parse(rest.responseText));
			});*/
			//this.set({"items": this.getLocal(key)});
			
			
			var treeObj = '{"id":"1","tree":{"1":{"l_name":"name1","f_name":"name2","f_id":"4","m_id":"3","ch_ids":[],"spouse_id":"19","b_date":"1989","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"2":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"3":{"l_name":"MAMA","f_name":"fname3","f_id":"8","m_id":"7","ch_ids":["1","2","22","23","24","25"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"4":{"l_name":"PAPA","f_name":"fname2","f_id":"10","m_id":"9","ch_ids":["1","2","22","23","24","25"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"5":{"l_name":"name2","f_name":"fname2","f_id":"8","m_id":"7","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},'; 
            treeObj+='"6":{"l_name":"UNCLE","f_name":"fname2","f_id":"10","m_id":"9","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"7":{"l_name":"name2","f_name":"fname2","f_id":"12","m_id":"11","ch_ids":["3","5"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"8":{"l_name":"name2","f_name":"fname2","f_id":"14","m_id":"13","ch_ids":["3","5"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"9":{"l_name":"name2","f_name":"fname2","f_id":"16","m_id":"15","ch_ids":["6","4"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"10":{"l_name":"name2","f_name":"fname2","f_id":"18","m_id":"17","ch_ids":["6","4"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"11":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"12":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"13":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["8"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"14":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["8"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"15":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["9"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"16":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["9"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"17":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["10"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"18":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["10"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"19":{"l_name":"name2","f_name":"fname2","f_id":"20","m_id":"21","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"20":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"22":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"23":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"24":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"25":{"l_name":"name2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"21":{"l_name":"name2","f_name":"fname2","f_id":"","m_id":"","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"}}}';
			
            var data = JSON.parse(treeObj);
			this.set("tree", data);
			
		},
		update: function(key, data){
			this.set({key: data});
			this.trigger("change:tree");
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