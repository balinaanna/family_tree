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
                //console.log(JSON.stringify(this.get("tree")));
            });
			/*this.save().complete(function(rest){
				re=rest;
				console.log(rest.responseText);
				var result =  eval( '(' + rest.responseText + ')');
				root.setLocal(key, rest.responseText);
				//root.setLocal(key,JSON.parse(rest.responseText));
			});*/
			//this.set({"items": this.getLocal(key)});
			
			
			var treeObj = '{"id":"1","tree":{"1":{"l_name":"1","f_name":"name2","f_id":"4","m_id":"3","ch_ids":["26","27","40"],"spouse_id":"19","b_date":"1989","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"2":{"l_name":"2","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"3":{"l_name":"3","f_name":"fname3","f_id":"8","m_id":"7","ch_ids":["1","2","22","23","24","25"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"4":{"l_name":"4","f_name":"fname2","f_id":"10","m_id":"9","ch_ids":["1","2","22","23","24","25"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"5":{"l_name":"5","f_name":"fname2","f_id":"8","m_id":"7","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},'; 
            treeObj+='"6":{"l_name":"6","f_name":"fname2","f_id":"10","m_id":"9","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"7":{"l_name":"7","f_name":"fname2","f_id":"12","m_id":"11","ch_ids":["3","5"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"8":{"l_name":"8","f_name":"fname2","f_id":"14","m_id":"13","ch_ids":["3","5"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"9":{"l_name":"9","f_name":"fname2","f_id":"16","m_id":"15","ch_ids":["6","4"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"10":{"l_name":"10","f_name":"fname2","f_id":"18","m_id":"17","ch_ids":["6","4"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"11":{"l_name":"11","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"12":{"l_name":"12","f_name":"fname2","f_id":"","m_id":"","ch_ids":["7"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"13":{"l_name":"13","f_name":"fname2","f_id":"","m_id":"","ch_ids":["8"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"14":{"l_name":"14","f_name":"fname2","f_id":"","m_id":"","ch_ids":["8"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"15":{"l_name":"15","f_name":"fname2","f_id":"","m_id":"","ch_ids":["9"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"16":{"l_name":"16","f_name":"fname2","f_id":"","m_id":"","ch_ids":["9"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"17":{"l_name":"17","f_name":"fname2","f_id":"","m_id":"","ch_ids":["10"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"18":{"l_name":"18","f_name":"fname2","f_id":"","m_id":"","ch_ids":["10"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"19":{"l_name":"19","f_name":"fname2","f_id":"20","m_id":"21","ch_ids":["26","27","40"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"20":{"l_name":"20","f_name":"fname2","f_id":"","m_id":"","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":null,"comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"22":{"l_name":"22","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"23":{"l_name":"23","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"24":{"l_name":"24","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
			treeObj+='"25":{"l_name":"25","f_name":"fname2","f_id":"4","m_id":"3","ch_ids":["19"],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            
            treeObj+='"26":{"l_name":"26","f_name":"","f_id":"1","m_id":"19","ch_ids":["30","37"],"spouse_id":"28","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"27":{"l_name":"27","f_name":"","f_id":"1","m_id":"19","ch_ids":["33"],"spouse_id":"29","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"28":{"l_name":"28","f_name":"","f_id":"","m_id":"","ch_ids":["30","37"],"spouse_id":"26","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"29":{"l_name":"29","f_name":"","f_id":"","m_id":"","ch_ids":["33"],"spouse_id":"27","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"30":{"l_name":"30","f_name":"","f_id":"28","m_id":"26","ch_ids":["34","35"],"spouse_id":"31","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"31":{"l_name":"31","f_name":"","f_id":"","m_id":"","ch_ids":["34","35"],"spouse_id":"30","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"32":{"l_name":"32","f_name":"","f_id":"","m_id":"","ch_ids":["36","38","39"],"spouse_id":"33","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"33":{"l_name":"33","f_name":"","f_id":"27","m_id":"29","ch_ids":["36","38","39"],"spouse_id":"32","b_date":"1990","d_date":"0","sex":"f","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"34":{"l_name":"34","f_name":"fname2","f_id":"30","m_id":"31","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"35":{"l_name":"35","f_name":"fname2","f_id":"30","m_id":"31","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"36":{"l_name":"36","f_name":"fname2","f_id":"32","m_id":"33","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"37":{"l_name":"37","f_name":"fname2","f_id":"28","m_id":"26","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"38":{"l_name":"38","f_name":"fname2","f_id":"32","m_id":"33","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"39":{"l_name":"39","f_name":"fname2","f_id":"32","m_id":"33","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            treeObj+='"40":{"l_name":"40","f_name":"fname2","f_id":"1","m_id":"19","ch_ids":[],"spouse_id":"","b_date":"1990","d_date":"0","sex":"m","photo_url":"image.jpg","comment":"<p><strong>Im comment</strong></p>"},';
            
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