<script src="/js/libs/Three.js"></script>
		<script src="/js/libs/js/Stats.js"></script>
		<script src="/js/libs/js/helvetiker_regular.typeface.js"></script>

<script>
			var container, stats;

			var camera, scene, renderer;

			var cube, plane, c;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;
			var mouseY = 0;
			var mouseYOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Drag to spin the cube';
				container.appendChild( info );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 150;
				camera.position.z = 500;
				//camera.position.x = 200;
				scene.add( camera );

				// Cube

				var materials = [], materials2 = [];

				for ( var i = 0; i < 6; i ++ ) {
					materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
					materials2.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
				}
				
				
				
				
				
				c = create_element("Last", "First");
				
				function create_element(l_name, f_name){
				   var canvas = document.createElement('canvas');
				   var width = 300;
				   var height = 200;
				   canvas.width = width;
				   canvas.height = height;
				   var context = canvas.getContext("2d");
				   
	
				   context.beginPath();
				   context.rect(0, 0, width, height);
				   context.fillStyle = "#8ED6FF";
				   context.fill();
				   context.fillStyle = "orange";
				   context.font = '24px Arial';
				   context.fillText(l_name+" "+f_name, 100, 180);
				   var tex = new THREE.Texture(canvas);
				   tex.needsUpdate = true;
				   var mat = new THREE.MeshBasicMaterial({map: tex});
				   mat.transparent = true;
				   var item = new THREE.Mesh(  new THREE.PlaneGeometry(canvas.width, canvas.height), mat);
				   return item;
				};
    
				c.position.x=-300;
				scene.add( c );




				cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials2 ), new THREE.MeshFaceMaterial() );
				cube.position.y = 80;
				cube.overdraw = true;
				scene.add( cube );
				
				cube1 = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
				cube1.position.y = 300;
				cube1.scale.x = 2;
				cube1.scale.z = 0.10;
				cube1.overdraw = true;


				cube2 = new THREE.Object3D();
				
				cube2.add( cube1 );
				scene.add( cube2 );
				
				// Plane

				plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe9a0e0 } ) );
				plane.rotation.x = - 90 * ( Math.PI / 180 );
				plane.overdraw = true;
				scene.add( plane );

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			}

			//

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );

				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;
			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

				targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
			}

			function onDocumentMouseUp( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onDocumentMouseOut( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;

				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

				}
			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				plane.rotation.z = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
				c.position.x = mouseX-120;
				c.position.y = -mouseY+150;
				renderer.render( scene, camera );

			}
</script>