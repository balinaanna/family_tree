define(['collections/TreeCollection', 'models/login_model'], function(TreeCollection, LoginModel) {
	return BaseView = Backbone.View.extend({
		objects : [],

		mouseX : 0,
		mouseY : 0,
		reverse : 1,
		stepY : 300,
		lineTurne : 375,
		dist : 6750,
		step : 2.5,

		isMouseDown : false,
		onMouseDownPosition: null,
		mouse : new THREE.Vector2(),
		nodeWidth : 360,
		nodeHeight : 450,
		imgPlusSize : 90,
		SELECTED: null,
		data1:{},
		data2:{},
		TempObj : {},
		texts: [],
		animating : true,

		light : new THREE.PointLight(0xFFCC99),
		ambient : new THREE.PointLight(0x333366),

		events: {
			"mousedown canvas" : "onmousedown",
			"mouseup canvas": "onmouseup",
			"mousemove canvas" : "onmousemove",
			"mousewheel canvas" : "onmousewheel",
			"click canvas" : "onclick",
			"mousemove #roll" : "navShow",
			"click #logout_btn" : "logout",
			"click #submit_person" : "submitFunc",
			"click #save_image" : "saveImage"
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
			setTimeout($.proxy(function(){
				this.animating = false;
				this.showedNav = true;
				this.navHide()
				},this),2000);

			$("#revers").css('display', 'none');
			$("#view3d").attr('value','2D View');
			this.container = document.createElement('div');
			$(this.el).append(this.container);
			this.projector = new THREE.Projector();

			try {
				this.renderer = new THREE.WebGLRenderer({
					antialias: false
				});
			} catch (err) {
				this.renderer = new THREE.CanvasRenderer({
					antialias: false
				});
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

			this.redrawTree();
		},

		navShow : function() {
			if(!this.showedNav && !this.animating) {
				this.animating = true;
				$('#navigator').css("background-color", "#617c83");
				$('#navigator').animate({
					left : '+='+this.navWidth+'px'
				},$.proxy(function(){
					this.animating = false;
				},this));
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
		text : function(data) {
			var canvas = document.createElement('canvas');
			canvas.width = this.nodeWidth;
			canvas.height = this.nodeHeight;
			var context = canvas.getContext("2d");
			context.fillStyle = "black";
			context.font = 'italic 50px Arial Black';
			//TODO text align
			var fNameL = data.f_name + ' ' + data.l_name;
			if (fNameL.length >= 14){
				fNameL = data.f_name.substring(0,1) + '. ' + data.l_name;
			}

			//set new text tabs later!
			var nameTab = (this.nodeWidth - 30*fNameL.length)/2;
			if (!data.d_date || data.d_date == "?"){
				var dates = data.b_date;
			} else {
				var dates = data.b_date.substr(-4) + ' - ' + data.d_date.substr(-4);
			}
			var datesTab = (this.nodeWidth - 30*dates.length)/2;

			context.fillText( fNameL, nameTab, this.nodeWidth);
			context.fillText( dates, datesTab, this.nodeWidth*1.15);
			var tex = new THREE.Texture(canvas);
			tex.needsUpdate = true;
			var mat = new THREE.MeshBasicMaterial({
				map : tex,
				overdraw : true
			});
			mat.transparent = true;
			var item = new THREE.Mesh(new THREE.PlaneGeometry(this.nodeWidth, this.nodeWidth, 30), mat);
			item.position.set(0, this.nodeWidth*1.1, 0);
			//item.rotation.x = -3.14/2;
			this.texts.push(item);
			return item;
		},
		createCube : function(x,y,z,data) {
			var node = new THREE.Object3D();
			if(data.photo_url == "" || data.photo_url == null) {
				data.photo_url = "no_avatar.jpg"
			};
			var photo = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, this.nodeWidth*0.8, this.nodeWidth*0.8);
			photo.position.set(0, 0, this.nodeWidth/2+5);
			var photo_back = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, this.nodeWidth*0.8, this.nodeWidth*0.8);
			photo_back.rotation.y = 3.14;
			photo_back.position.set(0, 0, -this.nodeWidth/2-10);

			var photo_right = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, this.nodeWidth*0.8, this.nodeWidth*0.8);
			photo_right.rotation.y = 3.14/2;
			photo_right.position.set(this.nodeWidth/2+10, 0, 0);

			var photo_left = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, this.nodeWidth*0.8, this.nodeWidth*0.8);
			photo_left.rotation.y = -3.14/2;
			photo_left.position.set(-this.nodeWidth/2-10, 0, 0);

			node.add(photo);
			node.add(photo_back);
			node.add(photo_right);
			node.add(photo_left);
			node.add(this.text(data));
			
			var cube = new THREE.Mesh(
				new THREE.CubeGeometry(this.nodeWidth,this.nodeWidth,this.nodeWidth, 1, 1, 1, new THREE.MeshBasicMaterial( {
					color: 0xFFFFFF
				} ) ),
				new THREE.MeshFaceMaterial({
					color: 0xFFFFFF, 
					opacity : 0
				})
				);
			cube.position.set(0,0,0);
			node.add(cube);

			node.position.set(x,y,z);

			var elems = {
				'child': {
					width: this.imgPlusSize,
					height: this.imgPlusSize,
					path: 'trash/add.png',
					trPath: 'trash/add_tr.png',
					posX: -this.imgPlusSize/2,
					posY: -this.nodeWidth/2-this.imgPlusSize/2-30,
					posZ: 0
				},
				'edit': {
					width: this.imgPlusSize,
					height: this.imgPlusSize,
					path: 'trash/edit.png',
					trPath: 'trash/edit_tr.png',
					posX: this.imgPlusSize/2,
					posY: -this.nodeWidth/2-this.imgPlusSize/2-30,
					posZ: 0
				}
			};
			
			var set_right = 1;
			if(!data.f_id || !data.m_id) {
				set_right = -1;
				elems.parent = {
					width: this.imgPlusSize,
					height: this.imgPlusSize,
					path: 'trash/add.png',
					trPath: 'trash/add_tr.png',
					posX: -this.imgPlusSize/2*3,
					posY: -this.nodeWidth/2-this.imgPlusSize/2-30,
					posZ: 0
				};
			}
			if(!data.spouse_id) {
				set_right = 1;
				if(data.sex == "m")
					var dx = Math.floor(this.nodeWidth / 2) - 40;
				if(data.sex == "f")
					var dx = -Math.floor(this.nodeWidth / 2) + 40;
				elems.spouse = {
					width: this.imgPlusSize,
					height: this.imgPlusSize,
					path: 'trash/add.png',
					trPath: 'trash/add_tr.png',
					posX: this.imgPlusSize/2*3,
					posY: -this.nodeWidth/2-this.imgPlusSize/2-30,
					posZ: 0
				};
			}
			if(data.id != localStorage.getItem("prof_id") && data.id != this.data2.id) {
				if((!data.f_id && !data.m_id && data.ch_ids.length < 2) || (data.ch_ids.length == 0 && data.spouse_id == 0)) {
					elems['delete'] = {
						width: this.imgPlusSize,
						height: this.imgPlusSize,
						path: 'trash/delete.png',
						trPath: 'trash/delete_tr.png',
						posX: (-this.nodeWidth/2+this.imgPlusSize/2)*set_right,
						posY: -this.nodeWidth/2-this.imgPlusSize/2-30,
						posZ: 0
					}
				}
			}
			for(var key in elems) {
				node.add(this.nodeElement(elems[key], key));
			}
			node.info = {
				"l_name" : data.l_name,
				"f_name" : data.f_name,
				"b_date" : data.b_date,
				"d_date" : data.d_date,
				"comment" : data.comment,
				"photo_url" : data.photo_url,
				"sex" : data.sex,
				"f_id" : data.f_id,
				"m_id" : data.m_id,
				"ch_ids" : data.ch_ids,
				"spouse_id" : data.spouse_id
			};

			return node;
		},
		unit : {},
		nodeElement : function(elem, name) {
			var element = new THREE.Object3D();

			var pic_front = this.texture(elem.trPath, this.imgPlusSize, this.imgPlusSize);
			pic_front.position.set(0, 0, this.imgPlusSize/2+3);
			element.add(pic_front);

			var pic_back = this.texture(elem.trPath, this.imgPlusSize, this.imgPlusSize);
			pic_back.position.set(0, 0, -this.imgPlusSize/2-3);
			pic_back.rotation.y = 3.14;
			element.add(pic_back);

			var pic_left = this.texture(elem.trPath, this.imgPlusSize, this.imgPlusSize);
			pic_left.position.set(this.imgPlusSize/2+3, 0, 0);
			pic_left.rotation.y = 3.14/2;
			element.add(pic_left);

			var pic_right = this.texture(elem.trPath, this.imgPlusSize, this.imgPlusSize);
			pic_right.position.set(-this.imgPlusSize/2-3, 0, 0);
			pic_right.rotation.y = -3.14/2;
			element.add(pic_right);

			var cube = new THREE.Mesh(
				new THREE.CubeGeometry(this.imgPlusSize,this.imgPlusSize,this.imgPlusSize, 1, 1, 1, new THREE.MeshBasicMaterial( {
					color: 0xddffdd
				} ) ),
				new THREE.MeshFaceMaterial({
					color: 0xFFFFFF,
					opacity : 0
				})
				);
			cube.position.set(0,0,0);
			element.add(cube);

			element.position.set(elem.posX, elem.posY, elem.posZ);
			element.matrixAutoUpdate = false;
			element.updateMatrix();
			element.overdraw = true;
			element.visible = true;
			//if(elem.trPath)	element.material.map.image.src = elem.trPath;
			element.name = name;
			return element;
		},
		create_tree : function(){
			//this.collection = new TreeCollection();
			//this.collection.fetch({
				//success : $.proxy(function(collection) {
					var arr = this.collection.toJSON();
					for(key in arr) {
						this.data1[arr[key].id] = arr[key];
						if(this.data1[arr[key].id].f_id == "0") {
							this.data1[arr[key].id].f_id = "";
						}
						if(this.data1[arr[key].id].m_id == "0") {
							this.data1[arr[key].id].m_id = "";
						}
						if(this.data1[arr[key].id].spouse_id == "0") {
							this.data1[arr[key].id].spouse_id = "";
						}
					}
					this.data2.tree = this.data1;
					this.scene = new THREE.Scene();
					this.camera.position.x = Math.cos(this.rotation)*this.dist;
					this.camera.position.z = Math.sin(this.rotation)*this.dist;
					this.camera.lookAt(this.scene.position);
					this.scene.add(this.camera);
					this.renderer.autoClear = false;
					//this.animate();
			//	}, this)
			//});
			tree = this.data1;
			this.tree = tree;
			
			this.lineGeo = new THREE.Geometry();
			this.lineMat = new THREE.LineBasicMaterial({
				color: 0x462424, 
				lineWidth: 1
			});
			this.lines = [];
			this.createTree(this.data2.id, {'x': 0, 'y': 0, 'z': 0}, 0);
			
			for (var k in this.lines){
				this.line = new THREE.Line(this.lines[k], this.lineMat);
				this.scene.add(this.line);
			}
		},
		createTree : function (id, position, i) {
			var start_node_id = id;
			if(i==0) {
				if(this.tree[id].f_id != '' && this.tree[id].m_id != '')
				{
					if(this.tree[id].f_id != '') id = this.tree[id].f_id;
					else if(this.tree[id].m_id != '') id = this.tree[id].m_id;
				}
				
				var cube = this.createCube(position.x,position.y,position.z,this.tree[id]);
				if(this.tree[id]['id'] == start_node_id)
				{
					cube.children[5].material = new THREE.MeshBasicMaterial({
									color: 0xffff77
								});
				}
				cube.info.user_id = this.tree[id]['id'];
				this.scene.add(cube);
				this.objects.push(cube);
				if(this.tree[id].sex=='f') {
					this.lineGeo.vertices.push(
						this.v(cube.position.x, cube.position.y, cube.position.z), this.v(cube.position.x+(this.step+1)*this.nodeWidth, cube.position.y, cube.position.z)
						);
				} else {
					this.lineGeo.vertices.push(
						this.v(cube.position.x, cube.position.y, cube.position.z), this.v(cube.position.x, cube.position.y-(this.step+1)*this.nodeHeight, cube.position.z)
						);
				}
				this.lines.push(this.lineGeo);
				this.lineGeo = new THREE.Geometry();
			}
			var unit={};
			i++;
			if(this.tree[id].spouse_id && i<=3){
				if(this.tree[this.tree[id].spouse_id].sex=='f') {
					var cube2 = this.createCube(position.x-this.step*this.nodeWidth,position.y-(this.step-1)*this.nodeHeight,position.z,this.tree[this.tree[id].spouse_id]);
					cube2.info.user_id = this.tree[this.tree[id].spouse_id]['id'];
					this.scene.add(cube2);

					this.lineGeo.vertices.push(
						this.v(cube2.position.x, cube2.position.y, cube2.position.z), this.v(cube2.position.x+(this.step+1)*this.nodeWidth, cube2.position.y, cube2.position.z)
						);

					unit = {
						'x':position.x, 
						'y':cube2.position.y, 
						'z':position.z
						};
				} else {
					var cube2 = this.createCube(position.x+this.step*this.nodeWidth,position.y+this.step*this.nodeHeight,position.z,this.tree[this.tree[id].spouse_id]);
					cube2.info.user_id = this.tree[this.tree[id].spouse_id]['id'];
					this.scene.add(cube2);

					this.lineGeo.vertices.push(
						this.v(cube2.position.x, cube2.position.y, cube2.position.z), this.v(cube2.position.x, cube2.position.y-(this.step+1)*this.nodeHeight, cube2.position.z)
						);

					unit = {
						'x':cube2.position.x, 
						'y':position.y, 
						'z':position.z
						};
				}
				this.lines.push(this.lineGeo);
				this.lineGeo = new THREE.Geometry();
				this.objects.push(cube2);
			}
			if(this.tree[id].ch_ids && i<=2){
				var arr = this.tree[id].ch_ids;
				this.lineGeo.vertices.push(
					this.v(unit.x, unit.y, unit.z - this.nodeWidth), this.v(unit.x, unit.y, unit.z+arr.length*this.step*this.nodeWidth)
					);
				this.lines.push(this.lineGeo);
				this.lineGeo = new THREE.Geometry();
				var cube3=[];
				for(key in arr){
					if(this.tree[arr[key]].sex=='m') {
						cube3[key] = this.createCube(unit.x, unit.y-this.step*this.nodeHeight + this.nodeHeight/2, unit.z + (key*1+1)*this.step*this.nodeWidth, this.tree[arr[key]]);
						cube3[key].info.user_id = this.tree[arr[key]]['id'];
						this.scene.add(cube3[key]);
						this.lineGeo.vertices.push(
							this.v(cube3[key].position.x, cube3[key].position.y+this.step*this.nodeHeight - this.nodeHeight/2, cube3[key].position.z), this.v(cube3[key].position.x, cube3[key].position.y-this.step*this.nodeHeight, cube3[key].position.z)
							);
					} else {
						cube3[key] = this.createCube(unit.x+this.step*this.nodeWidth - this.nodeWidth/2, unit.y, unit.z + (key*1+1)*this.step*this.nodeWidth, this.tree[arr[key]]);
						cube3[key].info.user_id = this.tree[arr[key]]['id'];
						this.scene.add(cube3[key]);
						this.lineGeo.vertices.push(
							this.v(cube3[key].position.x-this.step*this.nodeWidth + this.nodeWidth/2, cube3[key].position.y, cube3[key].position.z), this.v(cube3[key].position.x+this.step*this.nodeWidth, cube3[key].position.y, cube3[key].position.z)
							);
					}
					
					if(this.tree[arr[key]]['id'] == start_node_id)
					{
						cube3[key].children[5].material = new THREE.MeshBasicMaterial({
										color: 0xffff77
									});
					}	
					this.lines.push(this.lineGeo);
					this.lineGeo = new THREE.Geometry();
					this.objects.push(cube3[key]);
					this.createTree(arr[key], cube3[key].position, i);
				}
			}
		},
		
		redrawTree : function(id) {
			if(id) {
				this.data2.id = id;
			};
			this.objects = [];
			this.data2.tree = [];
			this.chWidth = {};
			this.chLShift = {};
			this.chRShift = {};
			this.chSide = {};
			this.width_spouse_for_f = 0;
			this.width_spouse_for_m = 0;
			this.spouseState = false;
			
			$.ajaxSetup({
				cache : false
			});
			this.collection.fetch({
				success : $.proxy(this.create_tree, this)
			});
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
			ev = ev || window.Event || window.event;
            if (ev && ((ev.button == 3 || ev.button == 2) || (ev.which ==3 || ev.which == 2))){
                if (ev.target == this.renderer.domElement) {
    				this.middledown = true;
    				this.sx = ev.clientX;
    				this.sy = ev.clientY;
    			}
            } else if (ev.target == this.renderer.domElement) {
				this.down = true;
				this.sx = ev.clientX;
				this.sy = ev.clientY;
			}
		},
		onmouseup : function(){
			this.middledown = false;
            this.down = false;
		},
		onmousemove : function(ev) {
			event.preventDefault();
			this.navHide();
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
			this.projector.unprojectVector(vector, this.camera);
			var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
			var intersects = ray.intersectObjects(this.objects);

			if (this.middledown) {
				var dx = ev.clientX - this.sx;
				var dy = ev.clientY - this.sy;
				this.rotation += dx/100;
				this.camera.position.x = Math.cos(this.rotation)*this.dist;
				this.camera.position.z = Math.sin(this.rotation)*this.dist;
				this.camera.position.y += Math.sin(dy/100)*this.dist;
				this.sx += dx;
				this.sy += dy;
			} else if (this.down) {
                var dx = ev.clientX - this.sx;
				var dy = ev.clientY - this.sy;
				this.rotation += dx/100;
				this.camera.position.x -= dx*10;
				this.camera.position.y += dy*10;
				this.camera.position.z += (Math.sin(dx/1000) - Math.sin(dy/1000))*this.dist;
				this.sx += dx;
				this.sy += dy;
			} else if(intersects.length > 0) {
				this.container.style.cursor = 'pointer';
				if (this.selectedObj != intersects[0].object.parent.children[5] && 
					this.selectedObj != null && 
					this.data2.id != this.selectedObj.parent.info.user_id)
				{
					this.selectedObj.material = new THREE.MeshBasicMaterial({
						color: 0xFFFFFF
					});
				}
				
				var hint = false;
				for( i = 0; i < intersects.length; i++) {
					switch (intersects[i].object.parent.name) {
						case 'parent':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add parent');
							$('#hint').css('opacity', '0.7');

							for( j = 0; j < intersects[i].object.parent.children.length; j++) {
								if(intersects[i].object.parent.children[j].material.map)
								{
									intersects[i].object.parent.children[j].material.map.image.src = 'trash/add.png';
								}
							}
							break;
						case 'child':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add child');
							$('#hint').css('opacity', '0.7');

							for( j = 0; j < intersects[i].object.parent.children.length; j++) {
								if(intersects[i].object.parent.children[j].material.map)
								{
									intersects[i].object.parent.children[j].material.map.image.src = 'trash/add.png';
								}
							}
							break;
						case 'edit':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Edit');
							$('#hint').css('opacity', '0.7');

							for( j = 0; j < intersects[i].object.parent.children.length; j++) {
								if(intersects[i].object.parent.children[j].material.map)
								{
									intersects[i].object.parent.children[j].material.map.image.src = 'trash/edit.png';
								}
							}
							break;
						case 'delete':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Delete');
							$('#hint').css('opacity', '0.7');

							for( j = 0; j < intersects[i].object.parent.children.length; j++) {
								if(intersects[i].object.parent.children[j].material.map)
								{
									intersects[i].object.parent.children[j].material.map.image.src = 'trash/delete.png';
								}
							}
							break;
						case 'spouse':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add spouse');
							$('#hint').css('opacity', '0.7');

							for( j = 0; j < intersects[i].object.parent.children.length; j++) {
								if(intersects[i].object.parent.children[j].material.map)
								{
									intersects[i].object.parent.children[j].material.map.image.src = 'trash/add.png';
								}
							}
							break;
						default:
							if(hint == false) {
								this.selectedObj = intersects[0].object.parent.children[5];
								$('#hint').css('left', -100);
								$('#hint').css('top', -100);
								$('#hint').css('opacity', '0');
								
								if(this.data2.id != this.selectedObj.parent.info.user_id)
								{
									this.selectedObj.material = new THREE.MeshBasicMaterial({
										color: 0x86A9F5
									});
								}
							}
							break;
					}
				}

				if(this.RISED != null) {
					if(this.RISED != intersects[0].object.parent) {
						for( j = 0; j < this.RISED.children.length; j++) {
							if(this.RISED.name == 'parent') {
								for( k = 0; k < par.children.length; k++) {
									if(this.RISED.children[k].material.map)
										this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
								}
							} else if(this.RISED.name == 'child') {
								for( k = 0; k < par.children.length; k++) {
									if(this.RISED.children[k].material.map)
										this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
								}
							} else if(this.RISED.name == 'edit') {
								for( k = 0; k < par.children.length; k++) {
									if(this.RISED.children[k].material.map)
										this.RISED.children[k].material.map.image.src = 'trash/edit_tr.png';
								}
							} else if(this.RISED.name == 'delete') {
								for( k = 0; k < par.children.length; k++) {
									if(this.RISED.children[k].material.map)
										this.RISED.children[k].material.map.image.src = 'trash/delete_tr.png';
								}
							} else if(this.RISED.name == 'spouse') {
								for( k = 0; k < par.children.length; k++) {
									if(this.RISED.children[k].material.map)
										this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
								}
							}
						}
						this.RISED = null;
					}
				}
				if(this.RISED == null) {
					//set full visibility for buttons
					par = intersects[0].object.parent;
					for( j = 0; j < par.children.length; j++) {
						if(par.name == 'parent') {
							for( k = 0; k < par.children.length; k++) {
								if(par.children[k].material.map)
									par.children[k].material.map.image.src = 'trash/add.png';
							}
						} else if(par.name == 'child') {
							for( k = 0; k < par.children.length; k++) {
								if(par.children[k].material.map)
									par.children[k].material.map.image.src = 'trash/add.png';
							}
						} else if(par.name == 'edit') {
							for( k = 0; k < par.children.length; k++) {
								if(par.children[k].material.map)
									par.children[k].material.map.image.src = 'trash/edit.png';
							}
						} else if(par.name == 'delete') {
							for( k = 0; k < par.children.length; k++) {
								if(par.children[k].material.map)
									par.children[k].material.map.image.src = 'trash/delete.png';
							}
						} else if(par.name == 'spouse') {
							for( k = 0; k < par.children.length; k++) {
								if(par.children[k].material.map)
									par.children[k].material.map.image.src = 'trash/add.png';
							}
						}
					}
					this.RISED = par;
				}

			} else if (intersects.length == 0){
				//hide hint
				$('#hint').css('opacity', '0');
				$('#hint').css('left', -100);
				$('#hint').css('top', -100);

				if(this.RISED != null) {
					for( j = 0; j < this.RISED.children.length; j++) {
						if(this.RISED.name == 'parent') {
							for( k = 0; k < par.children.length; k++) {
								if(this.RISED.children[k].material.map)
									this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
							}
						} else if(this.RISED.name == 'child') {
							for( k = 0; k < par.children.length; k++) {
								if(this.RISED.children[k].material.map)
									this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
							}
						} else if(this.RISED.name == 'edit') {
							for( k = 0; k < par.children.length; k++) {
								if(this.RISED.children[k].material.map)
									this.RISED.children[k].material.map.image.src = 'trash/edit_tr.png';
							}
						} else if(this.RISED.name == 'delete') {
							for( k = 0; k < par.children.length; k++) {
								if(this.RISED.children[k].material.map)
									this.RISED.children[k].material.map.image.src = 'trash/delete_tr.png';
							}
						} else if(this.RISED.name == 'spouse') {
							for( k = 0; k < par.children.length; k++) {
								if(this.RISED.children[k].material.map)
									this.RISED.children[k].material.map.image.src = 'trash/add_tr.png';
							}
						}
					}
					this.RISED = null;
				}

				if(intersects.length == 0 && this.selectedObj) {
					this.container.style.cursor = 'default';
					if(this.data2.id != this.selectedObj.parent.info.user_id)
					{
						this.selectedObj.material = new THREE.MeshBasicMaterial({
							color: 0xFFFFFF
						});
					}
				}
			}
		},
		onmousewheel : function(ev){
            this.camera.fov -= ev.originalEvent.wheelDeltaY*0.05;
            this.camera.updateProjectionMatrix();
		},
		onclick : function(event){
			event.preventDefault();
			var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
			this.projector.unprojectVector(vector, this.camera);
			var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
			var intersects = ray.intersectObjects(this.objects);
			if(intersects.length > 0)
			{
				var but = false;
				switch (intersects[0].object.parent.name)
				{
					case 'parent':
						nodex = intersects[0].object.parent.parent;
						if (nodex.father){
	                                		this.TempObj = {
	    							"action" : 'add_spouse',
	    							node : nodex.father
	    						};
						} else if (nodex.mother){
                                			this.TempObj = {
    								"action" : 'add_spouse',
    								node : nodex.mother
    							};
						} else {
                                			this.TempObj = {
    								"action" : 'add_parent',
    								node : nodex
    							};
						}
						OSX.init_edit({
							"action" : 'add_parent'
						}, nodex);
						but = true;
						break;
					case 'child':
						nodex = intersects[0].object.parent.parent;
						this.TempObj = {
							"action" : 'add_child',
							node : nodex
						};
						OSX.init_edit({
							"action" : 'add_child'
						}, nodex);
						but = true;
						break;
					case 'edit':
						nodex = intersects[0].object.parent.parent;
						this.TempObj = {
							"action" : 'edit_person',
							node : nodex
						};
						OSX.init_edit({
							'action' : 'edit_person'
						}, nodex);
						but = true;
						break;
					case 'delete':
						nodex = intersects[0].object.parent.parent;
						data = nodex.info;
						data.id = nodex.info.user_id;
						if(data.id == localStorage.getItem("prof_id"))return;
						if(data.ch_ids.length == 0 && data.spouse_id == 0){
							this.model.sendData({
								url : 'server/api/delete_node',
								data : data
							});
						}else if(data.f_id == 0 && data.m_id == 0 && data.ch_ids.length < 2){
							this.model.sendData({
								url : 'server/api/delete_node',
								data : data
							});
						}
						but = true;
						break;
					case 'spouse':
						nodex = intersects[0].object.parent.parent;
						this.TempObj = {
							"action" : 'add_spouse',
							node : nodex
						};
						OSX.init_edit({
							'action' : 'add_spouse'
						}, nodex);
						but = true;
						break;
					default:
						break;
				}
				if(!but && this.RISED) {
					this.redrawTree(intersects[0].object.parent.info.user_id);
				}				
			}
			else
			{

		}
		},
		animate : function () {
			requestAnimationFrame($.proxy(this.animate, this));
			if (!this.paused) {
				this.renderer.clear();
				if (this.middledown) this.camera.lookAt( this.scene.position);
				for (var k in this.texts){
					this.texts[k].lookAt(this.camera.position);
				}
				this.renderer.render(this.scene, this.camera);
				this.renderer.render(this.coordScene, this.camera);
			}
		},
		logout : function() {
			this.loginModel.logout();
		},
		saveImage : function() {
			var canvas = document.getElementsByTagName('canvas')[0];
			var context = canvas.getContext("2d");
			var dataURL = canvas.toDataURL("image/jpeg");
			document.getElementById("canvasImg").src = dataURL;
			Canvas2Image.saveAsJPEG(canvas);
		},
		submitFunc : function(event) {
			event.preventDefault();
			var h = $('#dp').height();
			var w = $('#dp').width();
			var scale = 1;
			var crop = 0;
			var upload = 0;
			if(h > $('#photo').height() || w > $('#photo').width()) {
				scale = h / $('#photo').height();
			};
			if(w > h) {
				scale = w / $('#photo').width();
			};
			if($('#cropped').val() == '1') {
				crop = 1;
			};
			if($('#uploaded').val() == '1') {
				upload = 1;
			};

			var data = {
				'id' : $('#user_id').val(),
				'f_name' : $('#f_name').val(),
				'l_name' : $('#l_name').val(),
				'b_date' : $('#b_date').val(),
				'd_date' : $('#d_date').val(),
				'x1' : $('#x1').val() * scale,
				'y1' : $('#y1').val() * scale,
				'x2' : $('#x2').val() * scale,
				'y2' : $('#y2').val() * scale,
				'w' : $('#w').val() * scale,
				'h' : $('#h').val() * scale,
				'f_id' : $('#f_id').val(),
				'm_id' : $('#m_id').val(),
				'ch_ids' : $('#ch_ids').val(),
				'spouse_id' : $('#spouse_id').val(),
				'sex' : $('input:radio[name="gender"]:checked').val(),
				'photo_url' : $('#photo').attr('src'),
				'comment' : $('#about').val(),
				'crop' : crop,
				'upload' : upload
			};
			this.TempObj.node.info.id = this.TempObj.node.info.user_id;
			if(!this.TempObj.node.info.ch_ids)
				this.TempObj.node.info.ch_ids = [];
			if(!data.ch_ids) {
				data.ch_ids = [];
			}
			if(this.TempObj.action == "add_parent") {
				data.action = this.TempObj.action;
				data.send_node_id = this.TempObj.node.info.id;
				if(!data.ch_ids)
					data.ch_ids = [];
				data.ch_ids.push(this.TempObj.node.info.id);
				data.f_id = "";
				data.m_id = "";
				if(this.TempObj.node.info.m_id) {
					data.spouse_id = this.TempObj.node.info.m_id;
				}
				if(this.TempObj.node.info.f_id) {
					data.spouse_id = this.TempObj.node.info.f_id;
				}
				this.model.sendData({
					url : 'server/api/add_node',
					data : data
				});
			};
			if(this.TempObj.action == "add_child") {
				data.action = this.TempObj.action;
				data.send_node_id = this.TempObj.node.info.id;
				if(this.TempObj.node.info.sex == "m") {
					data.f_id = this.TempObj.node.info.id;
					this.TempObj.node.info.spouse_id != "" ? data.m_id = this.TempObj.node.info.spouse_id : data.m_id = "";
				}
				if(this.TempObj.node.info.sex == "f") {
					data.m_id = this.TempObj.node.info.id;
					this.TempObj.node.info.spouse_id != "" ? data.f_id = this.TempObj.node.info.spouse_id : data.f_id = "";
				}
				this.model.sendData({
					url : 'server/api/add_node',
					data : data
				});
			};
			if(this.TempObj.action == "add_spouse") {
				data.action = this.TempObj.action;
				data.send_node_id = this.TempObj.node.info.id;
				data.ch_ids = this.TempObj.node.info.ch_ids;
				if(!data.ch_ids)
					data.ch_ids = [];
				data.f_id = "";
				data.m_id = "";
				data.spouse_id = this.TempObj.node.info.id;
				this.model.sendData({
					url : 'server/api/add_node',
					data : data
				});
			};
			if(this.TempObj.action == "edit_person") {
				data.f_id = this.TempObj.node.info.f_id;
				data.m_id = this.TempObj.node.info.m_id;
				data.ch_ids = this.TempObj.node.info.ch_ids;
				data.id = this.TempObj.node.info.user_id;
				data.spouse_id = this.TempObj.node.info.spouse_id;
				this.model.sendData({
					url : 'server/api/save_node',
					data : data
				});
			};
		}
	});
});