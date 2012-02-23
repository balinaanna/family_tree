//(function () {

	//var URL = 'js/app/templates/',
	//EJS = '.ejs'
		
define(['models/TreeNodeModel'],function(TreeModel){
    BaseView = Backbone.View.extend({
		objects : [],
        
		mouseX : 0,
		mouseY : 0,
		
		isMouseDown : false,
		onMouseDownPosition: null,
		mouse : new THREE.Vector2(),
		nodeWidth : 360,
		nodeHeight : 350,			
		imgPlusSize : 70,
        SELECTED: null,
		
		events: {
			"mousedown canvas" : "onDocumentMouseDown",
			"mouseup canvas": "onDocumentMouseUp",
			"mousemove canvas" : "onDocumentMouseMove", 
			"mousewheel canvas" : "onDocumentMouseWheel",
			"click canvas": "onClick",
			//"click #osx-modal-content-edit": "submitFunc",
			"click #submit_person": "submitFunc"//?			
		},
		
		initialize: function(){
			//test model
			this._model = new TreeModel();
			console.log(this._model);
			for (i in this._model.toJSON()){
			console.log(i);};
			//this._model.set('15', "sdf");
			this.treeObj = this._model.toJSON();
			//this._model.set('15', this.treeObj);
			console.log(this.treeObj);
			console.log(JSON.stringify(this.treeObj));	
			
			//navigation
			$("#slider").slider({
				orientation : "vertical",
				value : 8599,
				min : 100,
				max : 9999,
				slide : $.proxy(function(event, ui) {
					this.camera.position.z = 10099 - ui.value;
				},this)
			});
			$('#navigator').on("click", "div", $.proxy(this.navigation, this));
			$('#navigator').on('mousemove', function(){$('#navigator').css('opacity', '0.7');});
			$('#navigator').on('mouseout', function(){$('#navigator').css('opacity', '0.3');});
				
				this.container = document.createElement('div');
				//this.el.append($("#navigator"));
				$(this.el).append(this.container);
				var info = document.createElement('div');
				this.el.appendChild(info);
				//$(this.container).append($("#osx-modal-data-edit"));
				this.scene = new THREE.Scene();
				this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
				this.camera.position.y = 150;
				this.camera.position.z = 1500;
				this.scene.add(this.camera);
				//THREE.Object3D._threexDomEvent.camera(this.camera);
				this.create_tree("1", 1);
                var data2 = this._model.get("tree");
                for (var key in this.objects){
                    if (this.objects[key].info.user_id == data2.id) var nodeX = this.objects[key];
                }
                this.countChildren(this._model.get("tree").id,0);
                this.create_spouse();
                this.createChildren(this._model.get("tree").id, nodeX);
                //console.log(this.objects);
                //console.log(this._model.get("tree"));
                //console.log(this.chWidth);
				/*for(var key in this.objects) {
					this.objects[key].children[0].on('dblclick', function(event) {
						OSX.init_view(event.target.parent.info);
					});
				}*/
				this.projector = new THREE.Projector();
				this.onMouseDownPosition = new THREE.Vector2();
				this.renderer = new THREE.CanvasRenderer();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
				this.container.appendChild(this.renderer.domElement);
				this.stats = new Stats();
				this.stats.domElement.style.position = 'absolute';
				this.stats.domElement.style.top = '0px';
				this.stats.domElement.style.right = '0px';
				this.container.appendChild(this.stats.domElement);
		},
		
		create_node: function (data){
					var cube = new THREE.Object3D();
					// TODO coords
					if(data.photo_url == "" || data.photo_url == null){data.photo_url = "no_avatar.jpg"};
					var photo = this.texture('assets/images/uploaded/avatars/thumbs/'+data.photo_url, 235, 235);
					photo.position.set(0, 30, 1);
					this.container.style.background = "url('trash/back_11111.jpg')";
					
					var elems = {
                        'parent': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY - Math.floor(this.nodeHeight / 2)
                        },
                        'child': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        },
                        //'arrow': {
                        //    width: 30, height: 48, path: 'trash/arrow.png', posX: this.mouseX, posY: this.mouseY - 30 - Math.floor(this.nodeHeight / 2)
                        //},
                        'edit': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/edit.png', trPath: 'trash/edit_tr.png', posX: this.mouseX+this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        },
                        'delete': {
                            width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/delete.png', trPath: 'trash/delete_tr.png', posX: this.mouseX-this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                        }
                    };
					
					cube.add(this.texture('trash/polaroid.png', this.nodeWidth*0.8, this.nodeHeight));			// children[0]					
					
					var minVal = -0.2;
					var maxVal = 0.2;
					var floatVal = 2;
					var randVal = minVal+(Math.random()*(maxVal-minVal));
					cube.rotation.z = typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
					
				   
					cube.add(photo);			// children[1]
					cube.add(this.text(data));	// children[2]
					
                    for(var key in elems){
                        cube.add(this.nodeElement(elems[key], key));
                    }
					cube.info = {
						"l_name" : data.l_name,
						"f_name" : data.f_name,
						"b_date" : data.b_date,
						"d_date" : data.d_date,
						"comment" : data.comment,
						"photo_url" : data.photo_url
					};
					cube.mother;
					cube.father;
					cube.child;
					cube.lineM;
					cube.lineF;
					cube.lineC;
					cube.redrawLine = function(){
						if(cube.mother){
							cube.lineM.geometry.vertices[0].position.set(cube.position.x,cube.position.y,-10);
							cube.lineM.geometry.vertices[1].position.set(cube.position.x, cube.position.y - 200, -10);
							cube.lineM.geometry.vertices[2].position.set(cube.mother.position.x, cube.position.y - 200, -10);
						};
						if(cube.father){
							cube.lineF.geometry.vertices[0].position.set(cube.position.x,cube.position.y,-10);
							cube.lineF.geometry.vertices[1].position.set(cube.position.x, cube.position.y - 200, -10);
							cube.lineF.geometry.vertices[2].position.set(cube.father.position.x, cube.position.y - 200, -10);
						};
						if(cube.child){
						cube.lineC.geometry.vertices[2].position.set(cube.position.x, cube.child.position.y - 200, -10);
						cube.lineC.geometry.vertices[3].position.set(cube.position.x,cube.position.y,-10);
						};
					}
					return cube;
		},
        nodeElement: function(elem, name){
            var element = new THREE.Mesh(new THREE.PlaneGeometry(elem.width, elem.height));
			element.add(this.texture(elem.path, elem.width, elem.height));
			element.position.set(elem.posX, elem.posY, 1);
			element.matrixAutoUpdate = false;
			element.updateMatrix();
			element.overdraw = true;
			element.visible = true;
			if (elem.trPath) element.children[0].material.map.image.src = elem.trPath;
			element.name = name;
            return element;
        },
		width_spouse_for_m: 0,
        width_spouse_for_f: 0,
        
		create_tree: function(id, i, nodex) {
			var data2 = this._model.get("tree");
            var data = data2.tree;
			if(i == 1) {//TODO f_name
				var node = this.create_node(data[id]);
				node.position.set(0, this.nodeHeight + 50, 0);
				node.info.user_id = id;
				node.generation = 1;
				this.objects.push(node);
				this.scene.add(node);
				nodex = node;
			}
			if(i < 4) {
				var a = i + 1;
				if(data[id].f_id) {
					var f_id = data[id].f_id;
					var f_node = this.create_node(data[f_id]);
					if (data[f_id].ch_ids.length == 1) f_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * (-this.nodeWidth), (i - 1) * (-this.nodeHeight - 50), 0);
                    if (data[f_id].ch_ids.length > 1){
                        if (data[id].sex=="f"){
                            f_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 50), 0);
                        }
                        if (data[id].sex=="m"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            var needed = (data[f_id].ch_ids.length*(this.nodeWidth+200)); 
                            if (norm < needed) {
                                f_node.position.set(nodex.position.x - needed, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_f = needed;
                                var dx = needed/(data[f_id].ch_ids.length - 1);
                            } else {
                                f_node.position.set(nodex.position.x - norm, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_f = norm;
                                var dx = norm/(data[f_id].ch_ids.length - 1);
                            }
                            for (k=0; k < data[f_id].ch_ids.length; k++){
                                if (data[f_id].ch_ids[k] != id){
                                    var ch_id = data[f_id].ch_ids[k];
                                    var ch_node = this.create_node(data[ch_id]);
                                    ch_node.position.set(nodex.position.x - k*dx, nodex.position.y, 0);
                                    if (data[f_id].ch_ids.length == 2) ch_node.position.set(nodex.position.x - dx, nodex.position.y, 0);
                                    this.create_relation(0x000000,ch_node,f_node,"father","child",ch_id,i-1);
				                }                                
                            }
                        }                                
                    }
                    this.create_relation(0x000000,nodex,f_node,"father","parent",f_id,i);
					//if(i==3){
					//	f_node.children[5].visible = true;
					//}
					this.create_tree(f_id, a, f_node);
				};
				if(data[id].m_id) {
					var m_id = data[id].m_id;
					var m_node = this.create_node(data[m_id]);
					if (data[m_id].ch_ids.length == 1) m_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 50), 0);
					if (data[m_id].ch_ids.length > 1){
                        if (data[id].sex=="m"){
                            m_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 50), 0);
                        }
                        if (data[id].sex=="f"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            var needed = (data[m_id].ch_ids.length*(this.nodeWidth+200)); 
                            if (norm < needed) {
                                m_node.position.set(nodex.position.x + needed, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_m = needed;
                                var dx = needed/(data[f_id].ch_ids.length - 1);
                            }else{
                                m_node.position.set(nodex.position.x + norm, (i - 1) * (-this.nodeHeight - 50), 0);
                                if (i==2) this.width_spouse_for_m = norm;
                                var dx = norm/(data[f_id].ch_ids.length - 1);
                            }
                            for (k=0; k < data[m_id].ch_ids.length; k++){
                                if (data[m_id].ch_ids[k] != id){
                                    var ch_id = data[m_id].ch_ids[k];
                                    var ch_node = this.create_node(data[ch_id]);
                                    ch_node.position.set(nodex.position.x + k*dx,nodex.position.y , 0);
                                    if (data[m_id].ch_ids.length == 2) ch_node.position.set(nodex.position.x + dx, nodex.position.y, 0);
        							this.create_relation(0x000000,ch_node,m_node,"mother","child",ch_id,i-1);
                                }                                
                            }
                        }
                    }
					this.create_relation(0x000000,nodex,m_node,"mother","parent",m_id,i);
					//if(i==3){
					//	m_node.children[5].visible = true;
					//}
					this.create_tree(m_id, a, m_node);
				};
			}
		},
        create_spouse: function(){
            var data2 = this._model.get("tree");
            var data = data2.tree;
            var id = data[data2.id].spouse_id;
            if (data[data2.id].sex == "m"){
                var dx = this.width_spouse_for_m + this.nodeWidth + 600;
                if (dx < this.chWidth[data2.id]) dx = this.chWidth[data2.id] 
            }else{
                var dx = -this.width_spouse_for_f - this.nodeWidth - 600;
                if (dx > -this.chWidth[data2.id]) dx = -this.chWidth[data2.id]
            }
            var node = this.create_node(data[id]);
			for (var key in this.objects){
			    if (this.objects[key].info.user_id == data2.id) spouse_node = this.objects[key];
			}
            node.position.set(spouse_node.position.x + dx, spouse_node.position.y, 0);
			node.info.user_id = id;
			node.generation = 1;
			this.objects.push(node);
			this.scene.add(node);
			nodex = node;

			if(data[id].f_id) {
				var f_id = data[id].f_id;
				var f_node = this.create_node(data[f_id]);
				f_node.position.set(nodex.position.x - 300, spouse_node.position.y - this.nodeHeight - 100, 0);
				this.create_relation(0x000000,nodex,f_node,"father","parent",f_id,2);
			};
			if(data[id].m_id) {
				var m_id = data[id].m_id;
				var m_node = this.create_node(data[m_id]);
				m_node.position.set(nodex.position.x + 300, spouse_node.position.y - this.nodeHeight - 100, 0);
				this.create_relation(0x000000,nodex,m_node,"mother","parent",m_id,2);
			};
        },
		create_relation: function(color,child,parent,relation,adding,id,generation) {
					
    				if(adding == "parent"){
    				    parent.info.user_id = id;
                        parent.generation = generation;
    				    this.objects.push(parent);
    				    this.scene.add(parent);
    				}
                    if(adding == "child"){
    				    child.info.user_id = id;
                        child.generation = generation;
                        this.objects.push(child);
    				    this.scene.add(child);
    				}
                    if(adding == "spouse"){
                        child.info.user_id = id;
                        this.objects.push(child);
                        this.scene.add(child);
                    }
                    
                    var lineMat = new THREE.LineBasicMaterial({
						color : color,
						opacity : 1,
						linewidth : 3
					});

					if (adding != "spouse"){
                        var geom = new THREE.Geometry();
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y - 200, -10)));
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, child.position.y - 200, -10)));
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
					} else {
                        var geom = new THREE.Geometry();
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));
    					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
					}
                    line = new THREE.Line(geom, lineMat);
                    
                    this.scene.add(line);
					
                    if (relation == "mother"){
                        parent.lineC = line;
                        parent.child = child;
                        child.mother = parent;
                        child.lineM = line;
                    }
                    if (relation == "father"){
                        parent.lineC = line;
                        parent.child = child;
                        child.father = parent;
                        child.lineF = line;
                    }
		},
        chWidth: {1: 0 },
        countChildren: function(id,i,nodeX){
            var data2 = this._model.get("tree");
            var data = data2.tree;
            var sumWidth = 0;
            var w = this.nodeWidth + 100;
        
            for (var key in data[id].ch_ids){                
                var ch_id = data[id].ch_ids[key];                
                var width = w;
                
                if (data[ch_id].spouse_id) {
                    width += w;
                }
                this.chWidth[ch_id] = width - 100;                
                this.countChildren(ch_id);
            }
            for (var key in data[id].ch_ids){                
                sumWidth += this.chWidth[data[id].ch_ids[key]];
            }
            if (this.chWidth[id] < sumWidth){
                this.chWidth[id] = sumWidth;
            }
        },
        createChildren: function(id, nodex) {
			var data2 = this._model.get("tree");
            var data = data2.tree;
            var dx = 0;
            
            if (data[id].ch_ids){
                for (var key in data[id].ch_ids){
                    var ch_id = data[id].ch_ids[key];
                    var chNode = this.create_node(data[ch_id]);
                    
                    for (i=0; i<=key; i++){
                        dx += this.chWidth[data[id].ch_ids[i]];
                    }
                    for (var k in this.objects){
                        if (this.objects[k].info.user_id == data[nodex.info.user_id].spouse_id) var spNodex = this.objects[k];
                    }
                    if (data[id].ch_ids.length != 1){
                        if (data[nodex.info.user_id].sex == "m"){
                            if (key == 0){
                                chNode.position.set(nodex.position.x, nodex.position.y + 100 + this.nodeHeight, 0);
                            }else{                            
                                chNode.position.set(nodex.position.x + dx - 100, nodex.position.y + 100 + this.nodeHeight, 0);
                            }
                        } else if (data[nodex.info.user_id].sex == "f"){
                            if (key == 0){
                                chNode.position.set(nodex.position.x, nodex.position.y + 100 + this.nodeHeight, 0);
                            }else{
                                chNode.position.set(nodex.position.x - dx + 100, nodex.position.y + 100 + this.nodeHeight, 0);
                            }
                        }
                    } else {
                        chNode.position.set((nodex.position.x + spNodex.position.x)/2, nodex.position.y + 100 + this.nodeHeight, 0);
                    }
                    
                    if (data[ch_id].spouse_id){
                        var chSpNode = this.create_node(data[data[ch_id].spouse_id]);
                        
                        if (data[data[ch_id].spouse_id].sex == "m"){
                            chSpNode.position.set(chNode.position.x - this.chWidth[ch_id], chNode.position.y, 0);
                        } else {
                            chSpNode.position.set(chNode.position.x + this.chWidth[ch_id], chNode.position.y, 0);
                        }
                        this.create_relation(0x000000,chSpNode,chNode,"","spouse",data[ch_id].spouse_id,1);
                    }
                    if (data[nodex.info.user_id].sex == "m"){
                        this.create_relation(0x000000,chNode,nodex,"father","child",ch_id,1);
                        this.create_relation(0x000000,chNode,spNodex,"mother","",ch_id,1);
                    }else if (data[nodex.info.user_id].sex == "f"){
                        this.create_relation(0x000000,chNode,nodex,"mother","child",ch_id,1);
                        this.create_relation(0x000000,chNode,spNodex,"father","",ch_id,1);
                    }
                    this.createChildren(ch_id, chNode);
                }
            }
		},
		texture: function(path, size_x, size_y) {
					var tex = THREE.ImageUtils.loadTexture(path);
					var mat = new THREE.MeshBasicMaterial({
						map : tex,
						overdraw : true
					});
					mat.transparent = true;
					var item = new THREE.Mesh(new THREE.PlaneGeometry(size_x, size_y), mat);
					return item;
		},
		text: function(data) {
					var canvas = document.createElement('canvas');
					canvas.width = this.nodeWidth;
					canvas.height = this.nodeHeight;
					var context = canvas.getContext("2d");
					context.fillStyle = "black";
					context.font = 'italic 22px Arial Black';
					//TODO text align
					context.fillText(data.f_name, this.nodeWidth * 0.2, this.nodeHeight * 0.83);
					context.fillText(data.l_name, this.nodeWidth * 0.5, this.nodeHeight * 0.83);
					context.fillText(data.b_date, this.nodeWidth * 0.3, this.nodeHeight * 0.9);
					context.fillText(data.d_date, this.nodeWidth * 0.55, this.nodeHeight * 0.9);
					var tex = new THREE.Texture(canvas);
					tex.needsUpdate = true;
					var mat = new THREE.MeshBasicMaterial({
						map : tex,
						overdraw : true
					});
					mat.transparent = true;
					var item = new THREE.Mesh(new THREE.PlaneGeometry(this.nodeWidth, this.nodeHeight), mat);
					item.position.z = 1;
					return item;
		},
		onDocumentMouseDown: function(event) {

				event.preventDefault();
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					this.SELECTED = intersects[0].object.parent;
				} else {
					this.isMouseDown = true;
					this.container.style.cursor = 'move';
					this.SELECTED = null;
				}
				this.onMouseDownPosition.x = event.clientX;
				this.onMouseDownPosition.y = event.clientY;
		},
		
		onClick: function(event) {
				event.preventDefault();
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					for(i = 0; i < intersects.length; i++)
					{
						if(intersects[i].object.name == 'child') {
							OSX.init_edit({"action": 'add_child'}, intersects[i].object.parent);
						}
						else if(intersects[i].object.name == 'parent')
						{	/////////////////////////////////////   ADDING PARENT    /////////////////////////////////////////
                            if (!intersects[0].object.parent.father || !intersects[0].object.parent.mother){
                                nodex = intersects[i].object.parent;
                                i = nodex.generation+1;
                                var n_id = nodex.info.user_id;
                                var p_id = this.objects.length+1;
                               // data = JSON.parse(this.tree);
                                data = this.treeObj;
                                if (data[n_id].f_id == ""){
                                    var m_id = data[n_id].m_id;
                                    data[n_id].m_id = "";
                                    data[n_id].f_id = p_id;
                                } else if (data[n_id].m_id == ""){
                                    var f_id = data[n_id].f_id;
                                    data[n_id].f_id = "";
                                    data[n_id].m_id = p_id;
                                }
                                var addNode = {};
                                addNode[n_id] = data[n_id];
                                addNode[p_id] = {
                                                    "l_name":"newName",
                                                    "f_name":"newfname",
                                                    "f_id":"",
                                                    "m_id":"",
                                                    "ch_ids": n_id,
                                                    "spouse_id":"",
                                                    "b_date":"1920",
                                                    "d_date":"0",
                                                    "sex":"f",
                                                    "photo_url":"back_3.jpg",
                                                    "comment":"comment"
                                                };
                                 //tree2 = JSON.stringify(addNode);
                                 this.create_tree(addNode,n_id,i,nodex);
                                 if (f_id){
                                    data[n_id].f_id = f_id;
                                    f_id = null;
                                 } else if (m_id) {
                                    data[n_id].m_id = m_id;
                                    m_id = null;
                                 }
                                 data[p_id] = addNode[p_id];
                                 this.treeObj = data;
                                 this._model.update("tree",this.treeObj);
                                 console.log(this._model.get("tree",this.treeObj));
								 OSX.init_edit({"action": 'add_parent'}, nodex);
                            }                            
                            //////////////////////////////////////////////////////////////////////////////////////////////////
						} else if(intersects[i].object.name == 'edit')
						{
							//edit persone 
							nodex = intersects[i].object.parent;
							OSX.init_edit({'action': 'edit_person'}, nodex);
						}else if(intersects[i].object.name == 'delete')
						{
							// delete node
						}
					}
                    
				} else {
					
				}
		},
		
		onDocumentMouseMove: function(event) {
				event.preventDefault();
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);

				if( intersects.length > 0 ) {
					this.container.style.cursor = 'pointer';
					
					hint = false;
					for(i = 0; i < intersects.length; i++)
					{
						switch (intersects[i].object.name) 
						{
							case 'child':
								hint = true;
								$('#hint').css('left',event.clientX);
								$('#hint').css('top',event.clientY-40);
								$('#hint').html('Add child');
								$('#hint').css('opacity','0.7');
								break;
							case 'parent':
								hint = true;
								$('#hint').css('left',event.clientX);
								$('#hint').css('top',event.clientY-40);
								$('#hint').html('Add parent');
								$('#hint').css('opacity','0.7');
								break;
							case 'edit':
								hint = true;
								$('#hint').css('left',event.clientX);
								$('#hint').css('top',event.clientY-40);
								$('#hint').html('Edit');
								$('#hint').css('opacity','0.7');
								break;
							case 'delete':
								hint = true;
								$('#hint').css('left',event.clientX);
								$('#hint').css('top',event.clientY-40);
								$('#hint').html('Delete');
								$('#hint').css('opacity','0.7');
								break;
							default:
								if(hint == false)
								{
									$('#hint').css('left',-100);
									$('#hint').css('top',-100);
									$('#hint').css('opacity','0');
								}
								break;
						}
					}
					
					if(intersects.length >1)
					{
						par = intersects[1].object.parent;
						for( j = 0; j < par.children.length; j++) {						
							if(par.children[j].name == 'child') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/add.png';
							}else if(par.children[j].name == 'parent') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/add.png';
							}else if(par.children[j].name == 'edit') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/edit.png';
							}else if(par.children[j].name == 'delete') {
								//par.children[j].visible = true;
								par.children[j].children[0].material.map.image.src = 'trash/delete.png';
							}
						}
					}
                    if(this.SELECTED == intersects[0].object.parent) {
						this.container.style.cursor = 'pointer';
						var deltaX = -(event.clientX - this.onMouseDownPosition.x) * this.camera.position.z / 450;
						var deltaY = (event.clientY - this.onMouseDownPosition.y) * this.camera.position.z / 450;
						this.mouseX -= deltaX;
						this.mouseY += deltaY;
						this.onMouseDownPosition.x = event.clientX;
						this.onMouseDownPosition.y = event.clientY;
						intersects[0].object.parent.position.x -= deltaX;
						intersects[0].object.parent.position.y -= deltaY;
						intersects[0].object.parent.redrawLine();
					}
                    
				} else {
					$('#hint').css('opacity','0');
					$('#hint').css('left',-100);
					$('#hint').css('top',-100);
					
                    if(!this.SELECTED){
                        for( i = 0; i < this.objects.length; i++) {
    						for( j = 0; j < this.objects[i].children.length; j++) {
    							if(this.objects[i].children[j].name == 'child') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/add_tr.png';
								}else if(this.objects[i].children[j].name == 'parent') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/add_tr.png';
								}else if(this.objects[i].children[j].name == 'edit') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/edit_tr.png';
								}else if(this.objects[i].children[j].name == 'delete') {
									//par.children[j].visible = true;
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/delete_tr.png';
								}
								else
								{
									
								}
    						}
    					}
    					this.container.style.cursor = 'auto';
    					if(this.isMouseDown) {
    						this.container.style.cursor = 'move';
    						var deltaX = -(event.clientX - this.onMouseDownPosition.x);
    						var deltaY = event.clientY - this.onMouseDownPosition.y;
    						this.camera.position.x += deltaX * this.camera.position.z / 450;
    						this.camera.position.y += deltaY * this.camera.position.z / 450;
    						this.onMouseDownPosition.x = event.clientX;
    						this.onMouseDownPosition.y = event.clientY;
    						this.camera.updateMatrix();
    					} else {
    						this.container.style.cursor = 'auto';
    					}
                    } else {
   						var deltaX = -(event.clientX - this.onMouseDownPosition.x) * this.camera.position.z / 450;
						var deltaY = (event.clientY - this.onMouseDownPosition.y) * this.camera.position.z / 450;
						this.mouseX -= deltaX;
						this.mouseY += deltaY;
						this.onMouseDownPosition.x = event.clientX;
						this.onMouseDownPosition.y = event.clientY;
						this.SELECTED.position.x -= deltaX;
						this.SELECTED.position.y -= deltaY;
						this.SELECTED.redrawLine();
                    }
                    
				}
		},
		
		onDocumentMouseUp: function(event) {
				this.SELECTED = null;
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					this.container.style.cursor = 'pointer';
				} else {
					this.container.style.cursor = 'auto';
					this.isMouseDown = false;
					this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x;
					this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y;
				}
		},
		
		onDocumentMouseWheel: function(event) {
			
				if(this.camera.position.z > 0)
					this.camera.position.z -= event.originalEvent.wheelDeltaY;
				if(this.camera.position.z < 100)
					this.camera.position.z = 101;
				if(this.camera.position.z > 10000)
					this.camera.position.z = 9999;
				this.camera.updateMatrix();
		},
		
		navigation: function(event) {
				//console.log(event.target);
				event.preventDefault();
				switch (event.target.id) {
					case "arrowdown":
						this.camera.position.y -= 10;
						break;
					case "arrowup":
						this.camera.position.y += 10;
						break;
					case "arrowright":
						this.camera.position.x += 10;
						break;
					case "arrowleft":
						this.camera.position.x -= 10;
						break;
					case "plus":
						if(this.camera.position.z > 100)
							this.camera.position.z -= 10;
						break;
					case "minus":
						if(this.camera.position.z < 9999)
							this.camera.position.z += 10;
						break;
				};						
		},
		animate: function() {
				requestAnimationFrame($.proxy(this.animate, this));
				this.render();
				this.stats.update();
				
		},
		render: function(){
			$("#slider").slider("value", 10099 - this.camera.position.z);
			this.renderer.render(this.scene, this.camera);
			
		},
		submitFunc: function(event){
			event.preventDefault();
			var h = $('#dp').height();
			var w = $('#dp').width();
			var scale = 1;
			if(h > 300 || w > 300)
			{
				scale = h/300;
			}
			if(w > h)
			{
				scale = w/300;
			}
			
			$.ajax({
				url: 'server/api/save_node',
				dataType: 'json',
				data: {
					//'user_id': $('#user_id').val(),
					'f_name' : $('#f_name').val(),
					'l_name' : $('#l_name').val(),
					'b_date' : $('#b_date').val(),
					'd_date' : $('#d_date').val(),
					'x1': $('#x1').val()*scale,
					'y1': $('#y1').val()*scale,
					'x2': $('#x2').val()*scale,
					'y2': $('#y2').val()*scale,
					'w': $('#w').val()*scale,
					'h': $('#h').val()*scale,
					'f_id' : '1',
					'm_id' : '1',
					'ch_ids' : '[]',
					'spouse_id' : '1',
					'sex' : 'm',
					'photo_url' : $('#photo').attr('src'),
					'comment' : $('#about').val(),
					'crop' : true
				},
				success: function(response){
					//update photo
					console.log(response);
					showPopup('show-popup','green','Saved', 2000);
				}
			});
			/*
			$.ajax({
				url: 'server/api/add_node',
				dataType: 'json',
				data: {
					//'user_id': $('#user_id').val(),
					'f_name' : $('#f_name').val(),
					'l_name' : $('#l_name').val(),
					'b_date' : $('#b_date').val(),
					'd_date' : $('#d_date').val(),
					'x1': $('#x1').val()*scale,
					'y1': $('#y1').val()*scale,
					'x2': $('#x2').val()*scale,
					'y2': $('#y2').val()*scale,
					'w': $('#w').val()*scale,
					'h': $('#h').val()*scale,
					'f_id' : '1',
					'm_id' : '1',
					'ch_ids' : '[]',
					'spouse_id' : '1',
					'sex' : 'm',
					'photo_url' : $('#photo').attr('src'),
					'comment' : $('#about').val(),
					'crop' : true
				},
				success: function(response){
					//update photo
					console.log(response);
					showPopup('show-popup','green','Saved', 2000);
				}
			});
			*/
		}
		
	});
	return BaseView;
});
