define(['collections/TreeCollection', 'models/login_model'], function(TreeCollection, LoginModel) {
	return BaseView = Backbone.View.extend({
		objects : [],

		mouseX : 0,
		mouseY : 0,
		reverse : 1,
		stepY : 300,
		lineTurne : 375,

		isMouseDown : false,
		onMouseDownPosition : null,
		mouse : new THREE.Vector2(),
		nodeWidth : 360,
		nodeHeight : 450,
		imgPlusSize : 70,
		SELECTED : null,
		data1 : {},
		data2 : {},
		TempObj : {},
		animating : true,
		width_spouse_for_m : 0,
		width_spouse_for_f : 0,
		spouseState : null,
		chWidth : {},
		chSide : {},
		chLShift : {},
		chRShift : {},
		RISED : null,
		riseX : 0,
		riseY : 0,

		events : {
			"mousedown canvas" : "onDocumentMouseDown",
			"mouseup canvas" : "onDocumentMouseUp",
			"mousemove canvas" : "onDocumentMouseMove",
			"mousewheel canvas" : "onDocumentMouseWheel",
			"click canvas" : "onClick",
			"click #submit_person" : "submitFunc",
			"click #logout_btn" : "logout",
			"click #revers" : "reverseTree",
			"click #save_image" : "saveImage",
			"click #view3d" : "changeView",
			"mousemove #roll" : "navShow"
		},

		initialize : function() {
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
				max : 7999,
				slide : $.proxy(function(event, ui) {
					this.camera.position.z = 9099 - ui.value;
				}, this)
			});

			this.navWidth = $('#navigator').css("width");
			this.navWidth = this.navWidth.slice(0, -2);
			this.navWidth = this.navWidth * 1;
			this.navWidth -= 6;
			setTimeout($.proxy(function() {
				this.animating = false;
				this.showedNav = true;
				this.navHide()
			}, this), 2000);

			$("#rev_div").css('display', 'block');
			$("#view3d").attr('value','3D View');
			this.container = document.createElement('div');
			$(this.el).append(this.container);
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.y = 150;
			this.camera.position.z = 3000;
			this.scene.add(this.camera);
			this.projector = new THREE.Projector();
			this.onMouseDownPosition = new THREE.Vector2();
			try {
				this.renderer = new THREE.WebGLRenderer({
					antialias : true,
                    			preserveDrawingBuffer : true
				});
			} catch(err) {
				this.renderer = new THREE.CanvasRenderer({
					antialias : false
				});
			}
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.autoClear = false;
			this.container.appendChild(this.renderer.domElement);
			this.redrawTree();
		},
		changeView : function() {
			Backbone.history.navigate('tree3d', true);
		},
		navShow : function() {
			if(!this.showedNav && !this.animating) {
				this.animating = true;
				$('#navigator').css("background-color", "#617c83");
				$('#navigator').animate({
					left : '+=' + this.navWidth + 'px'
				}, $.proxy(function() {
					this.animating = false;
				}, this));
				this.showedNav = true;
				$('#roll').css("z-index", "10");
			}
		},
		navHide : function() {
			if(this.showedNav && !this.animating) {
				this.animating = true;
				$('#navigator').animate({
					left : '-=' + this.navWidth + 'px'
				}, $.proxy(function() {
					$('#navigator').css("background-color", "#1A3457");
					this.animating = false;
					$('#roll').css("z-index", "110");
				}, this));
				this.showedNav = false;
			}
		},
		reverseTree : function() {
			this.reverse = this.reverse * (-1);
			this.redrawTree(this.data2.id);
		},
		saveImage : function() {
			var canvas = document.getElementsByTagName('canvas')[0];
			var context = canvas.getContext("2d");
			var dataURL = canvas.toDataURL("image/png");
      		var fname = 'family_tree';
        	var data = dataURL;
        	data = data.substr(data.indexOf(',') + 1).toString();
         
        	var dataInput = document.createElement("input") ;
        	dataInput.setAttribute("name", 'imgdata') ;
        	dataInput.setAttribute("value", data);
         
        	var nameInput = document.createElement("input") ;
        	nameInput.setAttribute("name", 'name') ;
        	nameInput.setAttribute("value", fname + '.png');
         
        	var myForm = document.createElement("form");
        	myForm.method = 'post';
        	myForm.action = "/server/api/screenshot";
        	myForm.appendChild(dataInput);
        	myForm.appendChild(nameInput);
         
        	document.body.appendChild(myForm) ;
        	myForm.submit() ;
        	document.body.removeChild(myForm) ;
		},
		create_node : function(data) {
			var node = new THREE.Object3D();
			// TODO coords
			if(data.photo_url == "" || data.photo_url == null) {
				data.photo_url = "no_avatar.jpg"
			};
			var photo = this.texture('assets/images/uploaded/avatars/thumbs/' + data.photo_url, 260, 260);
			photo.position.set(0, 40, 4);

			var elems = {
				'child' : {
					width : this.imgPlusSize,
					height : this.imgPlusSize,
					path : 'trash/add.png',
					trPath : 'trash/add_tr.png',
					posX : this.mouseX,
					posY : this.mouseY + (this.reverse) * (Math.floor(this.nodeHeight / 2) - 20),
					posZ : 10
				},
				'edit' : {
					width : this.imgPlusSize,
					height : this.imgPlusSize,
					path : 'trash/edit.png',
					trPath : 'trash/edit_tr.png',
					posX : this.mouseX + this.nodeWidth / 4,
					posY : this.mouseY + Math.floor(this.nodeHeight / 2) - 20,
					posZ : 10
				}
			};
			if(!data.f_id || !data.m_id) {
				elems.parent = {
					width : this.imgPlusSize,
					height : this.imgPlusSize,
					path : 'trash/add.png',
					trPath : 'trash/add_tr.png',
					posX : this.mouseX,
					posY : this.mouseY - (this.reverse) * (Math.floor(this.nodeHeight / 2) - 20),
					posZ : 10
				};
			}
			if(data.id != localStorage.getItem("prof_id") && data.id != this.data2.id) {
				if((!data.f_id && !data.m_id && data.ch_ids.length < 2) || (data.ch_ids.length == 0 && data.spouse_id == 0)) {
					elems['delete'] = {
						width : this.imgPlusSize,
						height : this.imgPlusSize,
						path : 'trash/delete.png',
						trPath : 'trash/delete_tr.png',
						posX : this.mouseX - this.nodeWidth / 4,
						posY : this.mouseY + Math.floor(this.nodeHeight / 2) - 20,
						posZ : 10
					}
				}
			}
			if(!data.spouse_id) {
				if(data.sex == "m")
					var dx = Math.floor(this.nodeWidth / 2) - 40;
				if(data.sex == "f")
					var dx = -Math.floor(this.nodeWidth / 2) + 40;
				elems.spouse = {
					width : this.imgPlusSize,
					height : this.imgPlusSize,
					path : 'trash/add.png',
					trPath : 'trash/add_tr.png',
					posX : this.mouseX + dx,
					posY : this.mouseY / 2,
					posZ : 10
				};
			}

			node.add(this.texture('trash/pol1.png', this.nodeWidth, this.nodeHeight));
			// children[0]

			var minVal = -0.2;
			var maxVal = 0.2;
			var floatVal = 2;
			var randVal = minVal + (Math.random() * (maxVal - minVal));
			node.rotation.z = typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);

			node.add(photo);
			// children[1]
			node.add(this.text(data));
			// children[2]

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
		nodeElement : function(elem, name) {
			var element = this.texture(elem.path, elem.width, elem.height)
			element.position.set(elem.posX, elem.posY, elem.posZ);
			element.matrixAutoUpdate = false;
			element.updateMatrix();
			element.overdraw = true;
			element.visible = true;
			if(elem.trPath)
				element.material.map.image.src = elem.trPath;
			element.name = name;
			return element;
		},
		create_tree : function(id, i, nodex) {
			var data2 = this.data2;
			var data = data2.tree;
			if(i == 1) {//TODO f_name
				var node = this.create_node(data[id]);
				node.position.set(0, this.nodeHeight, 0);
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
					for(var k in this.objects) {
						for(var k2 in data[f_id].ch_ids) {
							if(this.objects[k].info.user_id == data[f_id].ch_ids[k2])
								this.objects[k].father = f_node;
						}
					}
					if(f_node)
						this.create_relation(nodex, f_node, "father", "parent", f_id, i);
					if(data[f_id].ch_ids.length == 1 || i > 2) {
						f_node.position.set(nodex.position.x - (Math.pow((4 - i), 1.25)) * this.nodeWidth, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
						if(this.width_spouse_for_f < (Math.pow((4 - i), 1.25)) * this.nodeWidth + 300)
							this.width_spouse_for_f = (Math.pow((4 - i), 1.25)) * this.nodeWidth + 300;
					}
					if(data[f_id].ch_ids.length > 1 && i < 3) {
						if(data[id].sex == "f") {
							f_node.position.set(nodex.position.x, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
						}
						if(data[id].sex == "m") {
							var norm = (Math.pow((4 - i), 1.25)) * (this.nodeWidth) * 2;
							var needed = ((data[f_id].ch_ids.length - 1) * (this.nodeWidth + this.stepY));
							if(norm < needed) {
								f_node.position.set(nodex.position.x - needed, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
								if(i == 2)
									this.width_spouse_for_f = needed / 2;
								var dx = needed / (data[f_id].ch_ids.length - 1);
							} else {
								f_node.position.set(nodex.position.x - norm, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
								if(i == 2)
									this.width_spouse_for_f = norm / 2;
								var dx = norm / (data[f_id].ch_ids.length - 1);
							}
						}
					}
					this.create_tree(f_id, a, f_node);
				}
				if(data[id].m_id) {
					var m_id = data[id].m_id;
					var m_node = this.create_node(data[m_id]);
					for(var k in this.objects) {
						for(var k2 in data[m_id].ch_ids) {
							if(this.objects[k].info.user_id == data[m_id].ch_ids[k2])
								this.objects[k].mother = m_node;
						}
					}
					if(m_node)
						this.create_relation(nodex, m_node, "mother", "parent", m_id, i);
					if(data[m_id].ch_ids.length == 1 || i > 2) {
						m_node.position.set(nodex.position.x + (Math.pow((4 - i), 1.25)) * this.nodeWidth, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
						if(this.width_spouse_for_m < (Math.pow((4 - i), 1.25)) * this.nodeWidth + 300)
							this.width_spouse_for_m = (Math.pow((4 - i), 1.25)) * this.nodeWidth + 300;
					}
					if(data[m_id].ch_ids.length > 1 && i < 3) {
						if(data[id].sex == "m") {
							m_node.position.set(nodex.position.x, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
						}
						if(data[id].sex == "f") {
							var norm = (Math.pow((4 - i), 1.25)) * (this.nodeWidth) * 2;
							var needed = ((data[m_id].ch_ids.length - 1) * (this.nodeWidth + this.stepY));
							if(norm < needed) {
								m_node.position.set(nodex.position.x + needed, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
								if(i == 2)
									this.width_spouse_for_m = needed / 2;
								var dx = needed / (data[m_id].ch_ids.length - 1);
							} else {
								m_node.position.set(nodex.position.x + norm, nodex.position.y + this.reverse * (-this.nodeHeight - this.stepY), 0);
								if(i == 2)
									this.width_spouse_for_m = norm / 2;
								var dx = norm / (data[m_id].ch_ids.length - 1);
							}
						}
					}
					this.create_tree(m_id, a, m_node);
				}
				var n = 1;
				if(f_id) {
					var p_id = f_id;
				}
				if(m_id) {
					var p_id = m_id;
				}

				if(p_id && i < 3) {
					for(var k in data[p_id].ch_ids) {
						if(data[p_id].ch_ids[k] != id) {
							var ch_id = data[p_id].ch_ids[k];
							var ch_node = this.create_node(data[ch_id]);
							if(data[id].sex == "m") {
								ch_node.position.set(nodex.position.x - n * dx, nodex.position.y, 0);
							}
							if(data[id].sex == "f") {
								ch_node.position.set(nodex.position.x + n * dx, nodex.position.y, 0);
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
		create_spouse : function(nodex) {
			var data2 = this.data2;
			var data = data2.tree;
			var id = data[data2.id].spouse_id;
			if(data[data2.id].sex == "m") {
				var dx = this.width_spouse_for_m + this.nodeWidth + 600;
				if(dx < this.chWidth[data2.id]) {
					dx = this.chWidth[data2.id];
				} else {
					this.spouseState = dx - this.chWidth[data2.id];
				}
			} else {
				var dx = -this.width_spouse_for_f - this.nodeWidth - 600;
				if(dx > -this.chWidth[data2.id]) {
					dx = -this.chWidth[data2.id];
				} else {
					this.spouseState = -dx - this.chWidth[data2.id];
				}
			}
			var node = this.create_node(data[id]);
			node.position.set(nodex.position.x + dx, nodex.position.y, 0);
			node.info.user_id = id;
			node.generation = 1;
			this.objects.push(node);
			this.scene.add(node);

			if(data[id].f_id) {
				var f_id = data[id].f_id;
				var f_node = this.create_node(data[f_id]);
				f_node.position.set(node.position.x - 300, nodex.position.y - this.reverse * (this.nodeHeight + this.stepY), 0);
				if(f_node)
					this.create_relation(node, f_node, "father", "parent", f_id, 2);
			};
			if(data[id].m_id) {
				var m_id = data[id].m_id;
				var m_node = this.create_node(data[m_id]);
				m_node.position.set(node.position.x + 300, nodex.position.y - this.reverse * (this.nodeHeight + this.stepY), 0);
				if(m_node)
					this.create_relation(node, m_node, "mother", "parent", m_id, 2);
			};
		},
		create_relation : function(child, parent, relation, adding, id, generation) {

			if(adding == "parent") {
				parent.info.user_id = id;
				parent.generation = generation;
				this.objects.push(parent);
				this.scene.add(parent);
			}
			if(adding == "child") {
				child.info.user_id = id;
				child.generation = generation;
				this.objects.push(child);
				this.scene.add(child);
			}
			if(adding == "spouse") {
				child.info.user_id = id;
				this.objects.push(child);
				this.scene.add(child);
			}

			if(relation == "mother") {
				parent.child = child;
				child.mother = parent;
			}
			if(relation == "father") {
				parent.child = child;
				child.father = parent;
			}
		},
		lines : function(color, child, parent, spouse) {
			var lineMat = new THREE.LineBasicMaterial({
				//color : color,
				opacity : 1,
				linewidth : 2
			});
			var geom = new THREE.Geometry();
			geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y, -10)));

			if(!spouse) {
				geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.position.y - this.reverse * this.lineTurne, -10)));
				if(child.mother && child.father) {
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3((child.mother.position.x + child.father.position.x) / 2, child.position.y - this.reverse * this.lineTurne, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3((child.mother.position.x + child.father.position.x) / 2, parent.position.y, -10)));
				}
				if(child.mother && !child.father) {
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.mother.position.y + this.reverse * this.lineTurne, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.mother.position.x, child.mother.position.y + this.reverse * this.lineTurne, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.mother.position.x, child.mother.position.y, -10)));
				}
				if(!child.mother && child.father) {
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.position.x, child.father.position.y + this.reverse * this.lineTurne, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.father.position.x, child.father.position.y + this.reverse * this.lineTurne, -10)));
					geom.vertices.push(new THREE.Vertex(new THREE.Vector3(child.father.position.x, child.father.position.y, -10)));
				}
			} else {
		                var lineMat2 = new THREE.LineBasicMaterial({
        				color : '0x023703',
        				opacity : 1,
        				linewidth : 4
        			});
				geom.vertices.push(new THREE.Vertex(new THREE.Vector3(parent.position.x, parent.position.y, -10)));
			}
		            if (!spouse) line = new THREE.Line(geom, lineMat);
		            if (spouse) line = new THREE.Line(geom, lineMat2);

			this.scene.add(line);
		},
		countChildren : function(id, i) {
			if(i < 4) {
				var data2 = this.data2;
				var data = data2.tree;
				var sumWidth = 0;
				var w = this.nodeWidth + 150;

				for(var key in data[id].ch_ids) {
					var ch_id = data[id].ch_ids[key];

					if(data[ch_id].spouse_id && data[ch_id].ch_ids) {
						if(data[ch_id].sex == "m") {
							this.chSide[ch_id] = "r"
						} else {
							this.chSide[ch_id] = "l"
						}
					}
					this.chWidth[ch_id] = w;

					this.countChildren(ch_id, i + 1);
				}
				if(data[id].ch_ids) {
					var fId = data[id].ch_ids[0];
					var lId = data[id].ch_ids[data[id].ch_ids.length - 1];
					if(data[id].ch_ids.length > 1) {
						if(data[id].sex == "m") {
							if(this.chSide[fId] == "l") {
								this.chLShift[id] = this.chWidth[fId];
								if(this.chLShift[fId]) {
									this.chLShift[id] += this.chLShift[fId];
								}
							}
							if(this.chSide[lId] == "r") {
								this.chRShift[id] = this.chWidth[lId];
								if(this.chRShift[lId]) {
									this.chRShift[id] += this.chRShift[lId];
								}
							}
						}
						if(data[id].sex == "f") {
							if(this.chSide[fId] == "r") {
								this.chRShift[id] = this.chWidth[fId];
								if(this.chRShift[fId]) {
									this.chRShift[id] += this.chRShift[fId];
								}
							}
							if(this.chSide[lId] == "l") {
								this.chLShift[id] = this.chWidth[lId];
								if(this.chLShift[lId]) {
									this.chLShift[id] += this.chLShift[lId];
								}
							}
						}
					}
					if(data[id].ch_ids.length == 1) {
						if(this.chSide[fId] == "l") {
							this.chLShift[id] = this.chWidth[fId] - this.chWidth[id] * 1 / 2;
							this.chLShift[id] += this.chWidth[id] * 1 / 2;
							if(this.chLShift[fId]) {
								this.chLShift[id] += this.chLShift[fId];
							}
						}
						if(this.chSide[fId] == "r") {
							this.chRShift[id] = this.chWidth[fId] - this.chWidth[id] * 1 / 2;
							this.chRShift[id] += this.chWidth[id] * 1 / 2;
							if(this.chRShift[fId]) {
								this.chRShift[id] += this.chRShift[fId];
							}
						}
					}
				}
				if(data[id].ch_ids) {
					for(var key in data[id].ch_ids) {
						var ch_id = data[id].ch_ids[key];
						if(data[id].ch_ids.length > 1) {
							if(data[id].sex == "m") {
								if(key == 0) {
									if(this.chSide[ch_id] == "l")
										sumWidth += w;
									if(this.chSide[ch_id] != "l")
										sumWidth += this.chWidth[data[id].ch_ids[key]] + w;
									if(!this.chSide[ch_id])
										sumWidth -= w;
									if(this.chRShift[ch_id])
										sumWidth += this.chRShift[data[id].ch_ids[key]];
								}
								if(key > 0 && key < data[id].ch_ids.length - 1) {
									if(this.chLShift[ch_id])
										sumWidth += this.chLShift[data[id].ch_ids[key]];
									sumWidth += this.chWidth[ch_id] + w;
									if(!this.chSide[ch_id])
										sumWidth -= w;
									if(this.chRShift[ch_id])
										sumWidth += this.chRShift[data[id].ch_ids[key]];
								}
								if(key == data[id].ch_ids.length - 1) {
									if(this.chSide[ch_id] == "l")
										sumWidth += this.chWidth[data[id].ch_ids[key]];
									if(this.chLShift[ch_id])
										sumWidth += this.chLShift[data[id].ch_ids[key]];
								}
							}
							if(data[id].sex == "f") {
								if(key == 0) {
									if(this.chSide[ch_id] == "r")
										sumWidth += w;
									if(this.chSide[ch_id] != "r")
										sumWidth += this.chWidth[data[id].ch_ids[key]] + w;
									if(!this.chSide[ch_id])
										sumWidth -= w;
									if(this.chLShift[ch_id])
										sumWidth += this.chLShift[data[id].ch_ids[key]];
								}
								if(key > 0 && key < data[id].ch_ids.length - 1) {
									if(this.chLShift[ch_id])
										sumWidth += this.chLShift[data[id].ch_ids[key]];
									sumWidth += this.chWidth[ch_id] + w;
									if(!this.chSide[ch_id])
										sumWidth -= w;
									if(this.chRShift[ch_id])
										sumWidth += this.chRShift[data[id].ch_ids[key]];
								}
								if(key == data[id].ch_ids.length - 1) {
									if(this.chSide[ch_id] == "r")
										sumWidth += this.chWidth[data[id].ch_ids[key]];
									if(this.chRShift[ch_id])
										sumWidth += this.chRShift[data[id].ch_ids[key]];
								}
							}
						}
					}
				}
				if(!this.chWidth[id])
					this.chWidth[id] = 0;
				if(data[id].ch_ids != [] && sumWidth != 0) {
					this.chWidth[id] = sumWidth;
				}
			}
		},
		createChildren : function(id, nodex, i) {
			var data2 = this.data2;
			var data = data2.tree;
			var dx = 0;

			if(data[id].ch_ids && i < 4) {
				for(var key in data[id].ch_ids) {
					var ch_id = data[id].ch_ids[key];
					var preChId = data[id].ch_ids[key - 1];
					var chNode = this.create_node(data[ch_id]);

					for(var k in this.objects) {
						if(this.objects[k].info.user_id == data[nodex.info.user_id].spouse_id)
							var spNodex = this.objects[k];
					}

					if(data[id].ch_ids.length != 1) {
						if(data[nodex.info.user_id].sex == "m") {
							if(key == 0) {
								chNode.position.set(nodex.position.x, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
							} else {
								if(this.spouseState && i == 1)
									dx += this.spouseState / (data[id].ch_ids.length - 1);
								if(this.chRShift[preChId])
									dx += this.chRShift[preChId];
								if(this.chLShift[ch_id])
									dx += this.chLShift[ch_id];
								if(this.chSide[ch_id] == "l")
									dx += this.chWidth[ch_id];
								if(this.chSide[preChId] == "r" || !this.chSide[preChId])
									dx += this.chWidth[preChId];
								if(this.chSide[preChId])
									dx += this.nodeWidth + 150;
								chNode.position.set(nodex.position.x + dx, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
							}
						} else if(data[nodex.info.user_id].sex == "f") {
							if(key == 0) {
								chNode.position.set(nodex.position.x, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
							} else {
								if(this.spouseState && i == 1)
									dx += this.spouseState / (data[id].ch_ids.length - 1);
								if(this.chLShift[preChId])
									dx += this.chLShift[preChId];
								if(this.chRShift[ch_id])
									dx += this.chRShift[ch_id];
								if(this.chSide[ch_id] == "r")
									dx += this.chWidth[ch_id];
								if(this.chSide[preChId] == "l" || !this.chSide[preChId])
									dx += this.chWidth[preChId];
								if(this.chSide[preChId])
									dx += this.nodeWidth + 150;
								chNode.position.set(nodex.position.x - dx, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
							}
						}
					} else {
						if(spNodex) {
							chNode.position.set((nodex.position.x + spNodex.position.x) / 2, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
						}
						if(!spNodex)
							chNode.position.set(nodex.position.x, nodex.position.y + this.reverse * (this.stepY + this.nodeHeight), 0);
					}

					if(data[ch_id].spouse_id) {
						var chSpId = data[ch_id].spouse_id;
						var chSpNode = this.create_node(data[chSpId]);

						if(data[chSpId].sex == "m") {
							chSpNode.position.set(chNode.position.x - this.chWidth[ch_id], chNode.position.y, 0);
						} else {
							chSpNode.position.set(chNode.position.x + this.chWidth[ch_id], chNode.position.y, 0);
						}
						this.create_relation(chSpNode, chNode, "", "spouse", chSpId, 1);
					}
					if(data[nodex.info.user_id].sex == "m") {
						this.create_relation(chNode, nodex, "father", "child", ch_id, 1);
						if(spNodex)
							this.create_relation(chNode, spNodex, "mother", "", ch_id, 1);
					} else if(data[nodex.info.user_id].sex == "f") {
						this.create_relation(chNode, nodex, "mother", "child", ch_id, 1);
						if(spNodex)
							this.create_relation(chNode, spNodex, "father", "", ch_id, 1);
					}
					this.createChildren(ch_id, chNode, i + 1);
				}
			}
		},
		createTree : function() {
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
			this.scene.add(this.camera);

			var data2 = this.data2;
			var data = data2.tree;
			//data2.id=26;
			this.create_tree(data2.id, 1);

			for(var key in this.objects) {
				if(this.objects[key].info.user_id == data2.id)
					var nodeX = this.objects[key];
			}
			if(data[data2.id].ch_ids)
				this.countChildren(data2.id, 1);
			if(data[data2.id].spouse_id) {
				this.create_spouse(nodeX);
			}
			if(data[data2.id].ch_ids)
				this.createChildren(data2.id, nodeX, 1);
			for(var key in this.objects) {
				if(this.objects[key].father)
					this.lines(0x000000, this.objects[key], this.objects[key].father);
				if(this.objects[key].mother)
					this.lines(0x000000, this.objects[key], this.objects[key].mother);

				if(data[this.objects[key].info.user_id].spouse_id) {
					for(var k in this.objects) {
						if(this.objects[k].info.user_id == data[this.objects[key].info.user_id].spouse_id) {
							var spNode = this.objects[k];
							break;
						}
					}
					if(spNode)
						this.lines(0x000000, this.objects[key], spNode, true);
					spNode = null;
				}
			}
			//set main node scale
			for( i = 0; i < this.objects.length; i++) {
				if(this.objects[i].info.user_id == data2.id) {
					this.objects[i].scale.x = 1.4;
					this.objects[i].scale.y = 1.4;
				}
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
			context.font = 'italic 30px Arial Black';
			//TODO text align
			var fNameL = data.f_name + ' ' + data.l_name;
			if(fNameL.length >= 15) {
				fNameL = data.f_name.substring(0, 1) + '. ' + data.l_name;
			}
			var nameTab = (this.nodeWidth - 18 * fNameL.length) / 2;
			if(!data.d_date || data.d_date == "?") {
				var dates = data.b_date;
			} else {
				var dates = data.b_date.substr(-4) + ' - ' + data.d_date.substr(-4);
			}
			var datesTab = (this.nodeWidth - 18 * dates.length) / 2;
			context.fillText(fNameL, nameTab, this.nodeHeight * 0.78);
			context.fillText(dates, datesTab, this.nodeHeight * 0.85);
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
		redrawTree : function(id) {
			///////////////////////////////////////    CHANGE VIEW     ////////////////////////////////////////////////
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
				success : $.proxy(this.createTree, this)
			});

			///////////////////////////////////////////////////////////////////////////////////////////////////
		},
		onDocumentMouseDown : function(event) {
			event.preventDefault();
			this.isMouseDown = true;
			this.container.style.cursor = 'move';
			this.onMouseDownPosition.x = event.clientX;
			this.onMouseDownPosition.y = event.clientY;
		},
		onClick : function(event) {
			event.preventDefault();
			var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
			this.projector.unprojectVector(vector, this.camera);
			var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
			var intersects = ray.intersectObjects(this.objects);

			if(intersects.length > 1) {
				var but = false;
				for( i = 0; i < intersects.length; i++) {
					if(intersects[i].object.name == 'child') {
						nodex = intersects[i].object.parent;
						this.TempObj = {
							"action" : 'add_child',
							node : nodex
						};
						OSX.init_edit({
							"action" : 'add_child'
						}, intersects[i].object.parent);
						but = true;
					} else if(intersects[i].object.name == 'parent') {
						if(!intersects[0].object.parent.father || !intersects[0].object.parent.mother) {
							nodex = intersects[i].object.parent;

							this.TempObj = {
								"action" : 'add_parent',
								node : nodex
							};
							OSX.init_edit({
								"action" : 'add_parent'
							}, nodex);
						}
						but = true;
					} else if(intersects[i].object.name == 'edit') {
						//edit persone
						nodex = intersects[i].object.parent;
						if(!nodex.info) nodex = nodex.parent;
						this.TempObj = {
							"action" : 'edit_person',
							node : nodex
						};
						OSX.init_edit({
							'action' : 'edit_person'
						}, nodex);
						but = true;
					} else if(intersects[i].object.name == 'delete') {
						// delete node
						nodex = intersects[i].object.parent;
						data = nodex.info;
						data.id = nodex.info.user_id;
						if(data.id == localStorage.getItem("prof_id"))
							return;
						if(data.ch_ids.length == 0 && data.spouse_id == 0) {
							this.model.sendData({
								url : 'server/api/delete_node',
								data : data
							});
						} else if(data.f_id == 0 && data.m_id == 0 && data.ch_ids.length < 2) {
							this.model.sendData({
								url : 'server/api/delete_node',
								data : data
							});
						}
						but = true;
					} else if(intersects[i].object.name == 'spouse') {
						//edit persone
						nodex = intersects[i].object.parent;
						this.TempObj = {
							"action" : 'add_spouse',
							node : nodex
						};
						OSX.init_edit({
							'action' : 'add_spouse'
						}, nodex);
						but = true;
					}
				}
				if(!but && this.RISED) {
					this.redrawTree(intersects[0].object.parent.info.user_id);
				}
			}
		},
		onDocumentMouseMove : function(event) {
			event.preventDefault();
			this.navHide();
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
			this.projector.unprojectVector(vector, this.camera);
			var ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
			var intersects = ray.intersectObjects(this.objects);

			if(intersects.length > 0 && !this.isMouseDown) {
				this.container.style.cursor = 'pointer';

				//show hint on mouse over buttons
				hint = false;
				for( i = 0; i < intersects.length; i++) {
					switch (intersects[i].object.name) {
						case 'child':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add child');
							$('#hint').css('opacity', '0.7');
							break;
						case 'parent':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add parent');
							$('#hint').css('opacity', '0.7');
							break;
						case 'edit':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Edit');
							$('#hint').css('opacity', '0.7');
							break;
						case 'delete':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Delete');
							$('#hint').css('opacity', '0.7');
							break;
						case 'spouse':
							hint = true;
							$('#hint').css('left', event.clientX);
							$('#hint').css('top', event.clientY - 40);
							$('#hint').html('Add spouse');
							$('#hint').css('opacity', '0.7');
							break;
						default:
							if(hint == false) {
								$('#hint').css('left', -100);
								$('#hint').css('top', -100);
								$('#hint').css('opacity', '0');
							}
							break;
					}
				}

				if(this.RISED != null) {

					if(this.RISED != intersects[0].object.parent) {
						this.RISED.position.x += this.riseX;
						this.RISED.position.y += this.riseY;
						this.RISED.position.z = 0;
						for( j = 0; j < this.RISED.children.length; j++) {
							if(this.RISED.children[j].name == 'child') {
								this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
							} else if(this.RISED.children[j].name == 'parent') {
								this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
							} else if(this.RISED.children[j].name == 'edit') {
								this.RISED.children[j].material.map.image.src = 'trash/edit_tr.png';
							} else if(this.RISED.children[j].name == 'delete') {
								this.RISED.children[j].material.map.image.src = 'trash/delete_tr.png';
							} else if(this.RISED.children[j].name == 'spouse') {
								this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
							}
						}
						this.RISED = null;
					}
				}
				if(this.RISED == null) {
					//set full visibility for buttons
					par = intersects[0].object.parent;
					for( j = 0; j < par.children.length; j++) {
						if(par.children[j].name == 'child') {
							par.children[j].material.map.image.src = 'trash/add.png';
						} else if(par.children[j].name == 'parent') {
							par.children[j].material.map.image.src = 'trash/add.png';
						} else if(par.children[j].name == 'edit') {
							par.children[j].material.map.image.src = 'trash/edit.png';
						} else if(par.children[j].name == 'delete') {
							par.children[j].material.map.image.src = 'trash/delete.png';
						} else if(par.children[j].name == 'spouse') {
							par.children[j].material.map.image.src = 'trash/add.png';
						}
					}
					par.position.z = 300;
					this.riseX = (par.position.x - this.camera.position.x) * par.position.z / this.camera.position.z;
					this.riseY = (par.position.y - this.camera.position.y) * par.position.z / this.camera.position.z;
					par.position.x -= this.riseX;
					par.position.y -= this.riseY;
					this.RISED = par;
				}
			} else {
				if(this.RISED != null) {
					this.RISED.position.x += this.riseX;
					this.RISED.position.y += this.riseY;
					this.RISED.position.z = 0;
					for( j = 0; j < this.RISED.children.length; j++) {
						if(this.RISED.children[j].name == 'child') {
							this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
						} else if(this.RISED.children[j].name == 'parent') {
							this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
						} else if(this.RISED.children[j].name == 'edit') {
							this.RISED.children[j].material.map.image.src = 'trash/edit_tr.png';
						} else if(this.RISED.children[j].name == 'delete') {
							this.RISED.children[j].material.map.image.src = 'trash/delete_tr.png';
						} else if(this.RISED.children[j].name == 'spouse') {
							this.RISED.children[j].material.map.image.src = 'trash/add_tr.png';
						}
					}
					this.RISED = null;
				}
				//hide hint
				$('#hint').css('opacity', '0');
				$('#hint').css('left', -100);
				$('#hint').css('top', -100);

				this.container.style.cursor = 'auto';
				if(this.isMouseDown) {
					this.container.style.cursor = 'move';
					var deltaX = -(event.clientX - this.onMouseDownPosition.x);
					var deltaY = event.clientY - this.onMouseDownPosition.y;
					this.camera.position.x += deltaX * this.camera.position.z / 750;
					this.camera.position.y += deltaY * this.camera.position.z / 750;
					this.onMouseDownPosition.x = event.clientX;
					this.onMouseDownPosition.y = event.clientY;
					this.camera.updateMatrix();
				} else {
					this.container.style.cursor = 'auto';
				}
			}
		},
		onDocumentMouseUp : function(event) {
			this.container.style.cursor = 'auto';
			this.isMouseDown = false;
		},
		onDocumentMouseWheel : function(event) {
			if(this.camera.position.z > 0)
				this.camera.position.z -= event.originalEvent.wheelDeltaY;
			if(this.camera.position.z < 100)
				this.camera.position.z = 101;
			if(this.camera.position.z > 9000)
				this.camera.position.z = 8999;
			this.camera.updateMatrix();
		},
		navigation : function(event) {
			event.preventDefault();
			switch (event.target.id) {
				case "plus":
					if(this.camera.position.z > 100)
						this.camera.position.z -= 10;
					break;
				case "minus":
					if(this.camera.position.z < 8999)
						this.camera.position.z += 10;
					break;
			};
		},
		animate : function() {
			requestAnimationFrame($.proxy(this.animate, this));
			this.renderer.clear();
			this.render();

		},
		render : function() {
			$("#slider").slider("value", 9099 - this.camera.position.z);
			this.renderer.render(this.scene, this.camera);
		},
		logout : function() {
			this.loginModel.logout();
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
