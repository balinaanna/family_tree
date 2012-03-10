define(['collections/TreeCollection', 'models/login_model'], function(TreeCollection, LoginModel) {
    return BaseView = Backbone.View.extend({
		objects : [],
        
		mouseX : 0,
		mouseY : 0,
        reverse : 1,
		stepY : 300,
		lineTurne : 375,
        dist : 6750,
		
		isMouseDown : false,
		onMouseDownPosition: null,
		mouse : new THREE.Vector2(),
		nodeWidth : 360,
		nodeHeight : 450,			
		imgPlusSize : 70,
        SELECTED: null,
        data1:{},
		data2:{},
		TempObj : {},
		animating : true,
               
        light : new THREE.PointLight(0xFFCC99),
        ambient : new THREE.PointLight(0x333366),
		
		events: {
			"mousedown canvas" : "onmousedown",
			"mouseup canvas": "onmouseup",
			"mousemove canvas" : "onmousemove", 
			"mousewheel canvas" : "onmousewheel",
            "mousemove #roll" : "navShow"
		},
		
		initialize: function(){
            
            this.data2.id = localStorage.getItem("prof_id");
            $.ajaxSetup({
				cache : false
			});
            this.collection = new TreeCollection();
            this.model.bind("change:send_status", $.proxy(this.redrawTree, this));
            this.loginModel = new LoginModel();
            
            //navigation
			$("#slider").slider({
				orientation : "vertical",
				value : 8599,
				min : 100,
				max : 8999,
				slide : $.proxy(function(event, ui) {
					this.camera.position.z = 9099 - ui.value;
				},this)
			});

			this.navWidth = $('#navigator').css("width");
            this.navWidth = this.navWidth.slice(0,-2);
            this.navWidth = this.navWidth*1;
            this.navWidth -= 6;
            setTimeout($.proxy(function(){this.animating = false; this.showedNav = true; this.navHide()},this),2000);
            
            this.container = document.createElement('div');
			$(this.el).append(this.container);
            this.projector = new THREE.Projector();
            
            try {
                this.renderer = new THREE.WebGLRenderer({antialias: true});
            } catch (err) {
                this.renderer = new THREE.CanvasRenderer({antialias: false});
            }
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.container.appendChild(this.renderer.domElement);
            
            var width = this.renderer.domElement.width;
            var height = this.renderer.domElement.height;
            this.camera = new THREE.PerspectiveCamera( 70, width/height, 1, 30000 );
            this.camera.position.y = 30;
            this.scene = new THREE.Scene();
            this.coordScene = new THREE.Scene();
            
            this.light.position.set(150, 200, 300);
            this.scene.add(this.light);
            
            this.ambient.position.set(-150, -200, -300);
            this.scene.add(this.ambient);
            
            var json='[{"id":"50","l_name":"Derevenets","f_name":"Bogdan","f_id":"115","m_id":"116","ch_ids":["120","123","124","125"],"spouse_id":"121","b_date":"1989","d_date":"0","sex":"m","photo_url":"","comment":""},{"id":"115","l_name":"","f_name":"Father","f_id":"0","m_id":"0","ch_ids":["50","117"],"spouse_id":"116","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"116","l_name":"?","f_name":"Mother","f_id":"0","m_id":"0","ch_ids":["50","117"],"spouse_id":"115","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"117","l_name":"","f_name":"Brother","f_id":"115","m_id":"116","ch_ids":[],"spouse_id":"0","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"120","l_name":"","f_name":"kim","f_id":"50","m_id":"121","ch_ids":["127"],"spouse_id":"126","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"121","l_name":"?","f_name":"?","f_id":"0","m_id":"0","ch_ids":["120","123","124","125"],"spouse_id":"50","b_date":"0","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"123","l_name":"12","f_name":"12","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"12","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"124","l_name":"123","f_name":"123","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"12","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"125","l_name":"222","f_name":"112","f_id":"50","m_id":"121","ch_ids":[],"spouse_id":"0","b_date":"2222","d_date":"0","sex":"f","photo_url":"no_avatar.jpg","comment":""},{"id":"126","l_name":"21312","f_name":"2321","f_id":"0","m_id":"0","ch_ids":["127"],"spouse_id":"120","b_date":"1221","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""},{"id":"127","l_name":"ewrw","f_name":"324","f_id":"126","m_id":"120","ch_ids":[],"spouse_id":"0","b_date":"0","d_date":"0","sex":"m","photo_url":"no_avatar.jpg","comment":""}]';
            var jsonObject = JSON.parse(json);
            var prof_id=50;
            var tree=[];
            var arr = jsonObject;
            for(key in arr){
                tree[arr[key].id] = arr[key];
                if(tree[arr[key].id].f_id == "0") {
                  tree[arr[key].id].f_id = "";
                }
                if(tree[arr[key].id].m_id == "0") {
                  tree[arr[key].id].m_id = "";
                }
                if(tree[arr[key].id].spouse_id == "0") {
                  tree[arr[key].id].spouse_id = "";
                }
                if(tree[arr[key].id].ch_ids == "[]") {
                  tree[arr[key].id].ch_ids = [];
                }
            }
            this.tree = tree;
            this.lineGeo = new THREE.Geometry();
            this.lineMat = new THREE.LineBasicMaterial({color: 0x462424, lineWidth: 1});
            this.lines = [];
            
            this.createTree(50, {'x':0,'y':0,'z':0}, 0);

            for (var k in this.lines){
                this.line = new THREE.Line(this.lines[k], this.lineMat);
                this.scene.add(this.line);
            }
            
            this.camera.position.x = Math.cos(this.rotation)*this.dist;
            this.camera.position.z = Math.sin(this.rotation)*this.dist;
            this.scene.add(this.camera);
            this.renderer.autoClear = false;
            this.animate();
		},
		navShow : function() {
			if(!this.showedNav && !this.animating) {
				this.animating = true;
				$('#navigator').css("background-color", "#617c83");
				$('#navigator').animate({
					left : '+='+this.navWidth+'px'
				},$.proxy(function(){this.animating = false;},this));
                this.showedNav = true;
                $('#roll').css("z-index", "10");
            }
		},
		navHide : function() {
			if(this.showedNav && !this.animating) {
				this.animating = true;
                $('#navigator').animate({
					left : '-='+this.navWidth+'px'
				}, $.proxy(function() {
					$('#navigator').css("background-color", "#1A3457");
					this.animating = false;
					$('#roll').css("z-index", "110");
				},this));
                this.showedNav = false;
            }
		},
		texture : function(path, size_x, size_y) {
			var tex = THREE.ImageUtils.loadTexture(path);
			var mat = new THREE.MeshBasicMaterial({
				map : tex,
				overdraw : true
			});
			mat.transparent = true;
			var item = new THREE.Mesh(new THREE.PlaneGeometry(size_x, size_y), mat);
			return item;
		},
        createCube : function(x,y,z,data) {
            var node = new THREE.Object3D();
            if(data.photo_url == "" || data.photo_url == null) {
				data.photo_url = "no_avatar.jpg"
			};
            var photo = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, 260, 260);
			photo.position.set(0, 0, this.nodeWidth/4+5);
            var texture = this.texture('trash/pol1.png', this.nodeWidth, this.nodeHeight);
            texture.position.set(0, 0, this.nodeWidth/4+4);
            node.add(texture);
            node.add(photo);
            
            var cube = new THREE.Mesh(
              new THREE.CubeGeometry(this.nodeWidth,this.nodeHeight,this.nodeWidth/2, 1, 1, 1, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ),
              new THREE.MeshFaceMaterial({color: 0xFFFFFF, opacity : 0})
            );
            cube.position.set(0,0,0);
            node.add(cube);
            
            node.position.set(x,y,z);
            return node;
        },
        unit : {},
        createTree : function (id, position, i) {
            if(i==0) {
              var cube = this.createCube(position.x,position.y,position.z,this.tree[id]);
              this.scene.add(cube);
              this.objects.push(cube);
              if(this.tree[id].sex=='f') {
                this.lineGeo.vertices.push(
                  this.v(cube.position.x-this.nodeWidth, cube.position.y, cube.position.z), this.v(cube.position.x+25*this.nodeWidth, cube.position.y, cube.position.z)
                );
              } else {
                this.lineGeo.vertices.push(
                  this.v(cube.position.x, cube.position.y+this.nodeHeight, cube.position.z), this.v(cube.position.x, cube.position.y-25*this.nodeHeight, cube.position.z)
                );
              }
              this.lines.push(this.lineGeo);
              this.lineGeo = new THREE.Geometry();
            }
            var unit={};
            i++;
            if(this.tree[id].spouse_id){
              if(this.tree[this.tree[id].spouse_id].sex=='f') {
                var cube2 = this.createCube(position.x-2.5*this.nodeWidth,position.y-2.5*this.nodeHeight,position.z,this.tree[id]);
                this.scene.add(cube2);
                
                this.lineGeo.vertices.push(
                  this.v(cube2.position.x-this.nodeWidth, cube2.position.y, cube2.position.z), this.v(cube2.position.x+25*this.nodeWidth, cube2.position.y, cube2.position.z)
                );
    
                unit = {'x':position.x, 'y':cube2.position.y, 'z':position.z};
              } else {
                var cube2 = this.createCube(position.x+2.5*this.nodeWidth,position.y+2.5*this.nodeHeight,position.z,this.tree[id]);
                this.scene.add(cube2);
    
                this.lineGeo.vertices.push(
                  this.v(cube2.position.x, cube2.position.y+this.nodeHeight, cube2.position.z), this.v(cube2.position.x, cube2.position.y-2.5*this.nodeHeight, cube2.position.z)
                );
    
                unit = {'x':cube2.position.x, 'y':position.y, 'z':position.z};
              }
              this.lines.push(this.lineGeo);
              this.lineGeo = new THREE.Geometry();
              this.objects.push(cube2);
            }
            if(this.tree[id].ch_ids){
              var arr = this.tree[id].ch_ids;
              this.lineGeo.vertices.push(
                  this.v(unit.x, unit.y, unit.z-this.nodeWidth), this.v(unit.x, unit.y, unit.z+arr.length*2.5*this.nodeWidth+3.5*this.nodeWidth)
                );
              this.lines.push(this.lineGeo);
              this.lineGeo = new THREE.Geometry();
              var cube3=[];
              for(key in arr){
                if(this.tree[arr[key]].sex=='m') {
                  cube3[key] = this.createCube(unit.x, unit.y-2.5*this.nodeHeight, unit.z + 5*this.nodeWidth + key*2.5*this.nodeWidth, this.tree[arr[key]]);
                  this.scene.add(cube3[key]);
                  this.lineGeo.vertices.push(
                    this.v(cube3[key].position.x, cube3[key].position.y+2.5*this.nodeHeight, cube3[key].position.z), this.v(cube3[key].position.x, cube3[key].position.y-25*this.nodeHeight, cube3[key].position.z)
                  );
                } else {
                  cube3[key] = this.createCube(unit.x+2.5*this.nodeWidth, unit.y, unit.z + 5*this.nodeWidth + key*2.5*this.nodeWidth, this.tree[arr[key]]);
                  this.scene.add(cube3[key]);
                  this.lineGeo.vertices.push(
                    this.v(cube3[key].position.x-2.5*this.nodeWidth, cube3[key].position.y, cube3[key].position.z), this.v(cube3[key].position.x+25*this.nodeWidth, cube3[key].position.y, cube3[key].position.z)
                  );
                }
                this.lines.push(this.lineGeo);
                this.lineGeo = new THREE.Geometry();
                this.objects.push(cube3[key]);
                this.createTree(arr[key], cube3[key].position, i);
              }
            }
      },
      
      v : function (x,y,z){
            return new THREE.Vertex(new THREE.Vector3(x,y,z));
      },
      
      ////////////////////////////////////////////////////////////////////////////////////////
      down : false,
      sx : 0,
      sy : 0,
      rotation : 1,
      onmousedown : function (ev){
        if (ev.target == this.renderer.domElement) {
          this.down = true;
          this.sx = ev.clientX;
          this.sy = ev.clientY;
        }
      },
      onmouseup : function(){ this.down = false; },
      onmousemove : function(ev) {
        event.preventDefault();
		this.navHide();
    	this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
		this.projector.unprojectVector(vector, this.camera);
		var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
		var intersects = ray.intersectObjects(this.objects);
        
        if (this.down) {
            var dx = ev.clientX - this.sx;
            var dy = ev.clientY - this.sy;
            this.rotation += dx/100;
            this.camera.position.x = Math.cos(this.rotation)*this.dist;
            this.camera.position.z = Math.sin(this.rotation)*this.dist;
            this.camera.position.y += Math.sin(dy/100)*this.dist;
            this.sx += dx;
            this.sy += dy;
        } else if(intersects.length > 0) {
            this.container.style.cursor = 'pointer';
            if (this.selectedObj != intersects[0].object.parent.children[2] && this.selectedObj != null) this.selectedObj.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
            this.selectedObj = intersects[0].object.parent.children[2];
            this.selectedObj.material = new THREE.MeshBasicMaterial({color: 0x462424});
        } else if(intersects.length == 0 && this.selectedObj) {
            this.container.style.cursor = 'default';
            this.selectedObj.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        }
      },
      onmousewheel : function(ev){
        this.camera.position.z -= ev.originalEvent.wheelDeltaY;
        this.dist = this.camera.position.z;
      },
      animate : function () {
        requestAnimationFrame($.proxy(this.animate, this));
        if (!this.paused) {
          this.renderer.clear();
          this.camera.lookAt( this.scene.position );
          for (var k in this.objects){
                this.objects[k].lookAt(this.camera.position);
          }
          this.renderer.render(this.scene, this.camera);
          this.renderer.render(this.coordScene, this.camera);
        }
      }
	});
});