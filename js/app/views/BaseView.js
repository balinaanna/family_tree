define(['models/TreeNodeModel', 'collections/TreeCollection', 'models/TreeNodeModel1'],function(TreeModel, TreeCollection, TreeModel1){
    BaseView = Backbone.View.extend({
		objects : [],
        
		mouseX : 0,
		mouseY : 0,
		
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
		
		events: {
			"mousedown canvas" : "onDocumentMouseDown",
			"mouseup canvas": "onDocumentMouseUp",
			"mousemove canvas" : "onDocumentMouseMove", 
			"mousewheel canvas" : "onDocumentMouseWheel",
			"click canvas": "onClick",
			"click #submit_person": "submitFunc",
			"click #logout_btn": "logout"		
		},
		
		initialize: function(){
			//test model
			this.data2.id = localStorage.getItem("prof_id");
			$.ajaxSetup({cache: false});
			this.collection = new TreeCollection();	
			this.collection.fetch({
                //url: '/data2.json',
				success: $.proxy(function(collection) {
					var arr = collection.toJSON();console.log(arr);
					for(key in arr){       							
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
						if(this.data1[arr[key].id].ch_ids == "[]") {
							this.data1[arr[key].id].ch_ids = [];
						}
					}
					this.data2.tree = this.data1;
					console.log(this.data2.tree);
					this.createTree();
				},this)});
			
			
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
			$('#navigator').on('mousemove', function(){$('#navigator').css('opacity', '0.8');});
			$('#navigator').on('mouseout', function(){$('#navigator').css('opacity', '0.5');});
				
			this.container = document.createElement('div');
			//this.el.append($("#navigator"));
			$(this.el).append(this.container);
			var info = document.createElement('div');
			this.el.appendChild(info);
			//$(this.container).append($("#osx-modal-data-edit"));
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.y = 150;
			this.camera.position.z = 3000;
			this.scene.add(this.camera);
			
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
			var cube = new THREE.Object3D();console.log(data);
			// TODO coords
			if(data.photo_url == "" || data.photo_url == null){data.photo_url = "no_avatar.jpg"};
			var photo = this.texture('assets/images/uploaded/avatars/'+data.photo_url, 260, 260);
			photo.position.set(0, 40, 1);
			//this.container.style.background = "url('trash/back_11111.jpg')";
			
		var elems = {
                'child': {
                    width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                },
                'edit': {
                    width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/edit.png', trPath: 'trash/edit_tr.png', posX: this.mouseX+this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                },
                'delete': {
                    width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/delete.png', trPath: 'trash/delete_tr.png', posX: this.mouseX-this.nodeWidth/4, posY: this.mouseY + Math.floor(this.nodeHeight / 2)
                }
            };
            if (!data.f_id || !data.m_id) elems.parent = {width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX, posY: this.mouseY - Math.floor(this.nodeHeight / 2)+20};
            if (!data.spouse_id){
                if(data.sex == "m") var dx = Math.floor(this.nodeWidth / 2)-20;
                if(data.sex == "f") var dx = -Math.floor(this.nodeWidth / 2)+20;
                elems.spouse = {width: this.imgPlusSize, height: this.imgPlusSize, path: 'trash/add.png', trPath: 'trash/add_tr.png', posX: this.mouseX + dx, posY: this.mouseY/2};
            } 
			
			
			cube.add(this.texture('trash/pol1.png', this.nodeWidth, this.nodeHeight));			// children[0]					
			
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
				"photo_url" : data.photo_url,
				"sex" : data.sex,
				"f_id" : data.f_id,
				"m_id" : data.m_id,
				"ch_ids" : data.ch_ids,
				"spouse_id" : data.spouse_id
			};
			cube.mother;
			cube.father;
			cube.child;
			
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
			var data2 = this.data2;
            var data = data2.tree;
			if(i == 1) {//TODO f_name
				var node = this.create_node(data[id]);
				node.position.set(0, this.nodeHeight + 200, 0);
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
					for (var k in this.objects){
                        for (var k2 in data[f_id].ch_ids){
                            if (this.objects[k].info.user_id == data[f_id].ch_ids[k2]) this.objects[k].father = f_node;
                        }
                    }
                    if (f_node) this.create_relation(nodex,f_node,"father","parent",f_id,i);
                    if (data[f_id].ch_ids.length == 1 || i > 2) f_node.position.set(nodex.position.x - (Math.pow((4 - i), 0.5)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 200), 0);
                    
                    if (data[f_id].ch_ids.length > 1 && i < 3){
                        if (data[id].sex=="f"){
                            f_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 200), 0);
                        }
                        if (data[id].sex=="m"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            var needed = (data[f_id].ch_ids.length*(this.nodeWidth+200)); 
                            if (norm < needed) {
                                f_node.position.set(nodex.position.x - needed, (i - 1) * (-this.nodeHeight - 200), 0);
                                if (i==2) this.width_spouse_for_f = needed;
                                var dx = needed/(data[f_id].ch_ids.length - 1);
                            } else {
                                f_node.position.set(nodex.position.x - norm, (i - 1) * (-this.nodeHeight - 200), 0);
                                if (i==2) this.width_spouse_for_f = norm;
                                var dx = norm/(data[f_id].ch_ids.length - 1);
                            }
                        }                                
                    }
					this.create_tree(f_id, a, f_node);
				}
				if(data[id].m_id) {
					var m_id = data[id].m_id;
					var m_node = this.create_node(data[m_id]);
                    for (var k in this.objects){
                        for (var k2 in data[m_id].ch_ids){
                            if (this.objects[k].info.user_id == data[m_id].ch_ids[k2]) this.objects[k].mother = m_node;
                        }
                    }
					if (m_node) this.create_relation(nodex,m_node,"mother","parent",m_id,i);
                    if (data[m_id].ch_ids.length == 1 || i > 2) m_node.position.set(nodex.position.x + (Math.pow((4 - i), 0.5)) * this.nodeWidth, (i - 1) * (-this.nodeHeight - 200), 0);
					if (data[m_id].ch_ids.length > 1 && i < 3){
                        if (data[id].sex=="m"){
                            m_node.position.set(nodex.position.x, (i - 1) * (-this.nodeHeight - 200), 0);
                        }
                        if (data[id].sex=="f"){
                            var norm =(Math.pow((4 - i), 1.25)) * (this.nodeWidth);
                            var needed = (data[m_id].ch_ids.length*(this.nodeWidth+200)); 
                            if (norm < needed) {
                                m_node.position.set(nodex.position.x + needed, (i - 1) * (-this.nodeHeight - 200), 0);
                                if (i==2) this.width_spouse_for_m = needed;
                                var dx = needed/(data[m_id].ch_ids.length - 1);
                            }else{
                                m_node.position.set(nodex.position.x + norm, (i - 1) * (-this.nodeHeight - 200), 0);
                                if (i==2) this.width_spouse_for_m = norm;
                                var dx = norm/(data[m_id].ch_ids.length - 1);
                            }
                        }
                    }
					this.create_tree(m_id, a, m_node);
				}
                var n = 1;
                if (f_id){
                    var p_id = f_id;
                }
                if (m_id){
                    var p_id = m_id;
                }
                
                if(p_id && i < 3){
                    for (var k in data[p_id].ch_ids){
                        if (data[p_id].ch_ids[k] != id){
                            var ch_id = data[p_id].ch_ids[k];
                            var ch_node = this.create_node(data[ch_id]);
                            if (data[id].sex=="m"){
                                ch_node.position.set(nodex.position.x - n*dx, nodex.position.y, 0);
                            }
                            if (data[id].sex=="f"){
                                ch_node.position.set(nodex.position.x + n*dx, nodex.position.y, 0);
                            }
                            ch_node.info.user_id = ch_id;
                            this.objects.push(ch_node);
    		                this.scene.add(ch_node);
                            ch_node.father = f_node;
                            ch_node.mother = m_node;
                            n++;
    	                }
                    }
                }
   			}
		},
        spouseState: null,
        create_spouse: function(nodex){
            var data2 = this.data2;
            var data = data2.tree;
            var id = data[data2.id].spouse_id;
            if (data[data2.id].sex == "m"){
                var dx = this.width_spouse_for_m + this.nodeWidth + 600;
                if (dx < this.chWidth[data2.id]) {dx = this.chWidth[data2.id];} else {this.spouseState = dx - this.chWidth[data2.id];}
            }else{
                var dx = -this.width_spouse_for_f - this.nodeWidth - 600;
                if (dx > -this.chWidth[data2.id]) {dx = -this.chWidth[data2.id]} else {this.spouseState = -dx - this.chWidth[data2.id];}
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
				f_node.position.set(nodex.position.x - 300, spouse_node.position.y - this.nodeHeight - 200, 0);
				if (f_node) this.create_relation(nodex,f_node,"father","parent",f_id,2);
			};
			if(data[id].m_id) {
				var m_id = data[id].m_id;
				var m_node = this.create_node(data[m_id]);
				m_node.position.set(nodex.position.x + 300, spouse_node.position.y - this.nodeHeight - 200, 0);
				if (m_node) this.create_relation(nodex,m_node,"mother","parent",m_id,2);
			};
        },
		create_relation: function(child,parent,relation,adding,id,generation) {
					
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
					
                    if (relation == "mother"){
                        parent.child = child;
                        child.mother = parent;
                    }
                    if (relation == "father"){
                        parent.child = child;
                        child.father = parent;
                    }
		},
        lines: function(color, child, parent, spouse){
            var lineMat = new THREE.LineBasicMaterial({
				//color : color,
				opacity : 1,
				linewidth : 2
			});
            var geom = new THREE.Geometry();
                geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));
				
            if (!spouse){
                geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y - 300, -10)));
				if (child.mother && child.father){
				    geom.vertices.push(new THREE.Vertex(new THREE.Vector3((child.mother.position.x + child.father.position.x)/2, child.position.y - 300, -10)));
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3((child.mother.position.x + child.father.position.x)/2, parent.position.y, -10)));
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
				}
                if (child.mother && !child.father){
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.mother.position.y + 300, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.mother.position.x, child.mother.position.y + 300, -10)));
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.mother.position.x, child.mother.position.y, -10)));
                }
                if (!child.mother && child.father){
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.father.position.y + 300, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.father.position.x, child.father.position.y + 300, -10)));
                    geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.father.position.x, child.father.position.y, -10)));
                }
            } else {
                geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
            }
				
            line = new THREE.Line(geom, lineMat);
            
            this.scene.add(line);
        },
        chWidth: {},
        chSide: {},
        chLShift: {},
        chRShift: {},
        countChildren: function(id, i){
            if (i<4){
                var data2 = this.data2;
                var data = data2.tree;
                var sumWidth = 0;
                var w = this.nodeWidth + 150;
            
                for (var key in data[id].ch_ids){
                    var ch_id = data[id].ch_ids[key];                
                    var width = w;
                    
                    if (data[ch_id].spouse_id && data[ch_id].ch_ids) {
                        //width += 150;
                        if (data[ch_id].sex == "m") {this.chSide[ch_id] = "r"} else {this.chSide[ch_id] = "l"} 
                    }
                    this.chWidth[ch_id] = width;
                    
                    this.countChildren(ch_id, i+1);
                }
                if (data[id].ch_ids){
                    var fId = data[id].ch_ids[0];
                    var lId = data[id].ch_ids[data[id].ch_ids.length-1];
                    if (data[id].ch_ids.length > 1){
                        if (data[id].sex == "m") {
                            if (this.chSide[fId] == "l") {this.chLShift[id] = this.chWidth[fId];if(this.chLShift[fId]){this.chLShift[id] += this.chLShift[fId];}}
                            if (this.chSide[lId] == "r") {this.chRShift[id] = this.chWidth[lId];if(this.chRShift[lId]){this.chRShift[id] += this.chRShift[lId];}}
                        }
                        if (data[id].sex == "f") {
                            if (this.chSide[fId] == "r") {this.chRShift[id] = this.chWidth[fId];if(this.chRShift[fId]){this.chRShift[id] += this.chRShift[fId];}}
                            if (this.chSide[lId] == "l") {this.chLShift[id] = this.chWidth[lId];if(this.chLShift[lId]){this.chLShift[id] += this.chLShift[lId];}}
                        }
                    }
                    if (data[id].ch_ids.length == 1){
                        if (this.chSide[fId] == "l") {this.chLShift[id] = this.chWidth[fId] - this.chWidth[id]*1/2;this.chLShift[id] += this.chWidth[id]*1/2;if(this.chLShift[fId]){this.chLShift[id] += this.chLShift[fId];}}
                        if (this.chSide[fId] == "r") {this.chRShift[id] = this.chWidth[fId] - this.chWidth[id]*1/2;this.chRShift[id] += this.chWidth[id]*1/2;if(this.chRShift[fId]){this.chRShift[id] += this.chRShift[fId];}}
                    }
                }
                if (data[id].ch_ids){
                    for (var key in data[id].ch_ids){
                        var ch_id = data[id].ch_ids[key];
                        if (data[id].ch_ids.length > 1){
                            if (data[id].sex == "m"){
                                if (key == 0){
                                    if (this.chSide[ch_id] == "l") sumWidth += w;
                                    if (this.chSide[ch_id] != "l") sumWidth += this.chWidth[data[id].ch_ids[key]] + w;
                                    if (!this.chSide[ch_id]) sumWidth -= w;
                                    if (this.chRShift[ch_id]) sumWidth += this.chRShift[data[id].ch_ids[key]];
                                }
                                if (key>0 && key < data[id].ch_ids.length-1){
                                    if (this.chLShift[ch_id]) sumWidth += this.chLShift[data[id].ch_ids[key]];
                                    sumWidth += this.chWidth[ch_id] + w;
                                    if (!this.chSide[ch_id]) sumWidth -= w;
                                    if (this.chRShift[ch_id]) sumWidth += this.chRShift[data[id].ch_ids[key]];
                                }
                                if (key == data[id].ch_ids.length-1){
                                    if (this.chSide[ch_id] == "l") sumWidth += this.chWidth[data[id].ch_ids[key]];
                                    if (this.chLShift[ch_id]) sumWidth += this.chLShift[data[id].ch_ids[key]];
                                }
                            }
                            if (data[id].sex == "f"){
                                if (key == 0){
                                    if (this.chSide[ch_id] == "r") sumWidth += w;
                                    if (this.chSide[ch_id] != "r") sumWidth += this.chWidth[data[id].ch_ids[key]] + w;
                                    if (!this.chSide[ch_id]) sumWidth -= w;
                                    if (this.chLShift[ch_id]) sumWidth += this.chLShift[data[id].ch_ids[key]];
                                }
                                if (key>0 && key < data[id].ch_ids.length-1){
                                    if (this.chLShift[ch_id]) sumWidth += this.chLShift[data[id].ch_ids[key]];
                                    sumWidth += this.chWidth[ch_id] + w;
                                    if (!this.chSide[ch_id]) sumWidth -= w;
                                    if (this.chRShift[ch_id]) sumWidth += this.chRShift[data[id].ch_ids[key]];
                                }
                                if (key == data[id].ch_ids.length-1){
                                    if (this.chSide[ch_id] == "r") sumWidth += this.chWidth[data[id].ch_ids[key]];
                                    if (this.chRShift[ch_id]) sumWidth += this.chRShift[data[id].ch_ids[key]];
                                }
                            }
                        }
                    }
                }
                if (!this.chWidth[id]) this.chWidth[id] = 0;
                if (data[id].ch_ids != [] && sumWidth != 0){
                    this.chWidth[id] = sumWidth;
                }
            }
        },
        createChildren: function(id, nodex, i) {
			var data2 = this.data2;
            var data = data2.tree;
            var dx = 0;
            
            if (data[id].ch_ids && i<4){
                for (var key in data[id].ch_ids){
                    var ch_id = data[id].ch_ids[key];
					var preChId = data[id].ch_ids[key-1];
                    var chNode = this.create_node(data[ch_id]);
                    
                    for (var k in this.objects){
                        if (this.objects[k].info.user_id == data[nodex.info.user_id].spouse_id) var spNodex = this.objects[k];
                    }
                    
                    if (data[id].ch_ids.length != 1){
                        if (data[nodex.info.user_id].sex == "m"){
                            if (key == 0){
                                chNode.position.set(nodex.position.x, nodex.position.y + 200 + this.nodeHeight, 0);
                            }else{
                                if (this.spouseState && i == 1) dx += this.spouseState/(data[id].ch_ids.length - 1);
                                if (this.chRShift[preChId]) dx += this.chRShift[preChId];
                                if (this.chLShift[ch_id]) dx += this.chLShift[ch_id];
                                if (this.chSide[ch_id] == "l") dx += this.chWidth[ch_id];
                                if (this.chSide[preChId] == "r" || !this.chSide[preChId]) dx += this.chWidth[preChId];
                                if (this.chSide[preChId]) dx += this.nodeWidth + 150;
                                chNode.position.set(nodex.position.x + dx, nodex.position.y + 200 + this.nodeHeight, 0);
                            }
                        } else if (data[nodex.info.user_id].sex == "f"){
                            if (key == 0){
                                chNode.position.set(nodex.position.x, nodex.position.y + 200 + this.nodeHeight, 0);
                            }else{
                                if (this.spouseState && i == 1) dx += this.spouseState/(data[id].ch_ids.length - 1);
                                if (this.chLShift[preChId]) dx += this.chLShift[preChId];
                                if (this.chRShift[ch_id]) dx += this.chRShift[ch_id];
                                if (this.chSide[ch_id] == "r") dx += this.chWidth[ch_id];
                                if (this.chSide[preChId] == "l" || !this.chSide[preChId]) dx += this.chWidth[preChId];
                                if (this.chSide[preChId]) dx += this.nodeWidth + 150;
                                chNode.position.set(nodex.position.x - dx, nodex.position.y + 200 + this.nodeHeight, 0);
                            }
                        }
                    } else {
                        if (spNodex) {chNode.position.set((nodex.position.x + spNodex.position.x)/2, nodex.position.y + 200 + this.nodeHeight, 0);}
						if (!spNodex) chNode.position.set(nodex.position.x, nodex.position.y + 200 + this.nodeHeight, 0);
                    }
                    
                    if (data[ch_id].spouse_id){
                        var chSpId = data[ch_id].spouse_id;
                        var chSpNode = this.create_node(data[chSpId]);
                        
                        if (data[chSpId].sex == "m"){
                            chSpNode.position.set(chNode.position.x - this.chWidth[ch_id], chNode.position.y, 0);
                        } else {
                            chSpNode.position.set(chNode.position.x + this.chWidth[ch_id], chNode.position.y, 0); 
                        }
                        this.create_relation(chSpNode,chNode,"","spouse",chSpId,1);
                    }
                    if (data[nodex.info.user_id].sex == "m"){
                        this.create_relation(chNode,nodex,"father","child",ch_id,1);
                        if (spNodex) this.create_relation(chNode,spNodex,"mother","",ch_id,1);
                    }else if (data[nodex.info.user_id].sex == "f"){
                        this.create_relation(chNode,nodex,"mother","child",ch_id,1);
                        if (spNodex) this.create_relation(chNode,spNodex,"father","",ch_id,1);
                    }
                    this.createChildren(ch_id, chNode, i+1);
                }
            }
		},
		createTree: function(){
			var data2 = this.data2;
            var data = data2.tree;
            //data2.id=26;
            this.create_tree(data2.id, 1);
            
            for (var key in this.objects){
                if (this.objects[key].info.user_id == data2.id) var nodeX = this.objects[key];
            }
            if(data[data2.id].ch_ids) this.countChildren(data2.id, 1);
            if(data[data2.id].spouse_id){
                this.create_spouse(nodeX);
            }
            if(data[data2.id].ch_ids) this.createChildren(data2.id, nodeX, 1);
            for (var key in this.objects){
                if (this.objects[key].father) this.lines(0x000000,this.objects[key],this.objects[key].father);
                if (this.objects[key].mother) this.lines(0x000000,this.objects[key],this.objects[key].mother);
                
                if (data[this.objects[key].info.user_id].spouse_id){
                    for (var k in this.objects){
                        if (this.objects[k].info.user_id == data[this.objects[key].info.user_id].spouse_id) {var spNode = this.objects[k]; break;}
                    }
                    if (spNode) this.lines(0x000000,this.objects[key],spNode,true);
                    spNode = null;
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
					context.font = 'italic 30px Arial Black';
					//TODO text align
					context.fillText(data.f_name+' '+data.l_name, this.nodeWidth * 0.15, this.nodeHeight * 0.78);
					context.fillText(data.b_date+' - '+data.d_date, this.nodeWidth * 0.15, this.nodeHeight * 0.85);
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
        redrawTree: function(id){
            ///////////////////////////////////////    CHANGE VIEW     ////////////////////////////////////////////////
                    this.data2.id = id;
                    
                    this.objects = [];
                    this.data2.tree = [];
                    this.chWidth = {};
                    this.chLShift = {};
                    this.chRShift = {};
                    this.chSide = {};
                    this.width_spouse_for_f = 0;
                    this.width_spouse_for_m = 0;
                    this.spouseState = false;
                    
                    $.ajaxSetup({ cache: false });
        			this.collection = new TreeCollection();
        			this.collection.fetch({
                        //url: '/data2.json',
        				success: $.proxy(function(collection) {
        					var arr = collection.toJSON();
        					for(key in arr){       							
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
        					this.createTree();
        				},this)});
        			
        			this.scene = new THREE.Scene();
        			this.scene.add(this.camera);
        			///////////////////////////////////////////////////////////////////////////////////////////////////
        },
		onDocumentMouseDown: function(event) {

				event.preventDefault();
				var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
				this.projector.unprojectVector(vector, this.camera);
				var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
				var intersects = ray.intersectObjects(this.objects);
				if(intersects.length > 0) {
					//this.SELECTED = intersects[0].object.parent;
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
			    var but = false;
                for(i = 0; i < intersects.length; i++) {
					if(intersects[i].object.name == 'child') {
						nodex = intersects[i].object.parent;
						this.TempObj = {
							"action" : 'add_child',
							node : nodex
						};
						OSX.init_edit({"action": 'add_child'}, intersects[i].object.parent);
                        but = true;
					}
					else if(intersects[i].object.name == 'parent')
					{	/////////////////////////////////////   ADDING PARENT    /////////////////////////////////////////
                        if (!intersects[0].object.parent.father || !intersects[0].object.parent.mother){
                            nodex = intersects[i].object.parent;
                
                             this.TempObj = {
									"action" : 'add_parent',
									node : nodex
								};
							 OSX.init_edit({"action": 'add_parent'}, nodex);
                        }
                        //////////////////////////////////////////////////////////////////////////////////////////////////
                        but = true;
					}else if(intersects[i].object.name == 'edit') {
						//edit persone 
						nodex = intersects[i].object.parent;
						this.TempObj = {
							"action" : 'edit_person',
							node : nodex
						};
						OSX.init_edit({'action': 'edit_person'}, nodex);
                        but = true;
					}else if(intersects[i].object.name == 'delete') {
						// delete node
                        but = true;
					}else if(intersects[i].object.name == 'spouse') {
						//edit persone 
						nodex = intersects[i].object.parent;
						this.TempObj = {
							"action" : 'add_spouse',
							node : nodex
						};
						OSX.init_edit({'action': 'add_spouse'}, nodex);
                        but = true;
					}
				}
                if (!but){
                    this.redrawTree(intersects[0].object.parent.info.user_id);
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
                            case 'spouse':
								hint = true;
								$('#hint').css('left',event.clientX);
								$('#hint').css('top',event.clientY-40);
								$('#hint').html('Add spouse');
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
							}else if(par.children[j].name == 'spouse') {
								par.children[j].children[0].material.map.image.src = 'trash/add.png';
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
								}else if(this.objects[i].children[j].name == 'spouse') {
									this.objects[i].children[j].children[0].material.map.image.src = 'trash/add_tr.png';
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

		logout: function(){
			localStorage.clear();
			document.cookie = 'ci_session' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
			window.location = window.location.href;
		},

		submitFunc : function(event) {
			event.preventDefault();
			var h = $('#dp').height();
			var w = $('#dp').width();
			var scale = 1;
			if(h > 300 || w > 300) {
				scale = h / 300;
			}
			if(w > h) {
				scale = w / 300;
			}

			console.log(this.TempObj);
			var data = {
				'id': $('#user_id').val(),
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
				'f_id' : $('#f_id').val(),
				'm_id' : $('#m_id').val(),
				'ch_ids' : $('#ch_ids').val(),
				'spouse_id' : $('#spouse_id').val(),
				'sex' : $('input:radio[name="gender"]:checked').val(),
				'photo_url' : $('#photo').attr('src'),
				'comment' : $('#about').val()
				
			};
			this.TempObj.node.info.id = this.TempObj.node.info.user_id;
			if(!this.TempObj.node.info.ch_ids)this.TempObj.node.info.ch_ids = [];
			if(!data.ch_ids){
					data.ch_ids = [];
					}
			console.log(data.sex);
			console.log(data);
			if(this.TempObj.action == "add_parent"){
				data.action = this.TempObj.action;
				data.send_node_id = this.TempObj.node.info.id;
				if(!data.ch_ids) data.ch_ids = [];
				data.ch_ids.push(this.TempObj.node.info.id);
				data.f_id = "";
				data.m_id = "";
				if(this.TempObj.node.info.m_id){ console.log(this.TempObj.node.info.m_id);
					data.spouse_id = this.TempObj.node.info.m_id;
				}
				if(this.TempObj.node.info.f_id){ console.log(this.TempObj.node.info.f_id);
					data.spouse_id = this.TempObj.node.info.f_id;
				}
				$.ajax({
				url : 'server/api/add_node',
				dataType : 'json',
				data : data,
				success : $.proxy(this.addNode, this),
				error : function(error) {
					console.log(error.responseText);
				}
			});
			}
			if(this.TempObj.action == "add_child"){
				data.action = this.TempObj.action;
				data.send_node_id = this.TempObj.node.info.id;
				if(this.TempObj.node.info.sex == "m") {
					data.f_id = this.TempObj.node.info.id;
					this.TempObj.node.info.spouse_id !="" ? data.m_id = this.TempObj.node.info.spouse_id : data.m_id = "";
				}
				if(this.TempObj.node.info.sex == "f") {
					data.m_id = this.TempObj.node.info.id;
					this.TempObj.node.info.spouse_id !="" ? data.f_id = this.TempObj.node.info.spouse_id : data.f_id = "";
				}
				$.ajax({
				url : 'server/api/add_node',
				dataType : 'json',
				data : data,
				success : $.proxy(this.addNode, this),
				error : function(error) {
					console.log(error.responseText);
				}
			});
			};
			if(this.TempObj.action == "add_spouse"){
				data.action = this.TempObj.action;
                data.send_node_id = this.TempObj.node.info.id;
                if(!data.ch_ids) data.ch_ids = [];
				data.f_id = "";
				data.m_id = "";
                data.spouse_id = this.TempObj.node.info.id;
                $.ajax({
    				url : 'server/api/add_node',
    				dataType : 'json',
    				data : data,
    				success : $.proxy(this.addNode, this),
    				error : function(error) {
    					console.log(error.responseText);
    				}
    			});
			};
			if(this.TempObj.action == "edit_person"){
				data.f_id = this.TempObj.node.info.f_id;
				data.m_id = this.TempObj.node.info.m_id;
				data.ch_ids = this.TempObj.node.info.ch_ids;
				data.id = this.TempObj.node.info.user_id;
				data.spouse_id = this.TempObj.node.info.spouse_id;
				this.saveNode({data: data});
			};
			if(this.TempObj.action == "delete_person"){
				
			}
			
			console.log(data);
			
		},
		addNode : function(response) {
			showPopup('show-popup', 'green', 'Saved', 2000);
		},
		saveNode : function(options) {
			
			$.ajax({
				url : 'server/api/save_node',
				dataType : 'json',
				data : options.data,
				success : $.proxy(function(response) {
					console.log(response);
					//update photo
					showPopup('show-popup', 'green', 'Saved', 2000);
				}, this),
				error : function(error) {
					console.log(error.responseText);
				}
			});
		}
		
	});
	return BaseView;
});
