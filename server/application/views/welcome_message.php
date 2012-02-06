<script src="/js/libs/Three.js"></script>
		<script src="/js/libs/js/Stats.js"></script>
		<script src="/js/libs/js/helvetiker_regular.typeface.js"></script>

<script>
			var container, stats;

			var camera, scene, renderer;

			var cube, plane;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

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

				cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
				cube.position.y = 80;
				cube.overdraw = true;
				scene.add( cube );
				
				cube1 = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials2 ), new THREE.MeshFaceMaterial() );
				cube1.position.y = 300;
				cube1.scale.x = 2;
				cube1.scale.z = 0.10;
				cube1.overdraw = true;
				
				
				
				var text3d = new THREE.TextGeometry( 'Last Name', {

					size: 20,
					height: 10,
					curveSegments: 2,
					font: "helvetiker"

				});

				text3d.computeBoundingBox();
				var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

				var textMaterial = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: true } );
				text = new THREE.Mesh( text3d, textMaterial );

				text.doubleSided = false;

				text.position.x = centerOffset;
				text.position.y = 250;
				text.position.z = 10;

				text.rotation.x = 0;
				text.rotation.y = Math.PI * 2;

				cube2 = new THREE.Object3D();
				cube2.add( text );
				cube2.add( cube1 );
				scene.add( cube2 );
				
				
				
				
				// Plane

				plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
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
				plane.rotation.z = cube2.rotation.y += ( targetRotation - cube2.rotation.y ) * 0.05;
				renderer.render( scene, camera );

			}
</script>