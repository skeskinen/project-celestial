import THREE from 'three';
import Detector from 'three/examples/js/Detector';

import * as theme from './theme';

if (Detector.webgl) {
	var scene, camera, renderer;

	/* We need this stuff too */
	var container, aspectRatio,
		HEIGHT, WIDTH, fieldOfView,
		nearPlane, farPlane,
		mouseX, mouseY, windowHalfX,
		windowHalfY, stats, geometry,
		starStuff, materialOptions, stars;

	init();
	animate();

	function init() {
		container = document.getElementById('backgroundContainer');

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 75;
		nearPlane = 1.0;
		farPlane = 1000;
		mouseX = 0;
		mouseY = 0;

		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

		//Z positioning of camera

		camera.position.z = farPlane / 2;

		scene = new THREE.Scene();
		// scene.fog = new THREE.FogExp2( 0x000000, 0.0003 );

		// The wizard's about to get busy.
		starForge();

    renderer = new THREE.WebGLRenderer()

		renderer.setClearColor(theme.backgroundColorInt, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(WIDTH, HEIGHT);
		container.appendChild(renderer.domElement);

		// stats = new Stats();
		// stats.domElement.style.position = 'absolute';
		// stats.domElement.style.top = '0px';
		// stats.domElement.style.right = '0px';
		// container.appendChild( stats.domElement );

		window.addEventListener('resize', onWindowResize, false );
		document.addEventListener('mousemove', onMouseMove, false );
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
		// stats.update();
	}


	function render() {
		camera.position.x += ((mouseX/2) - camera.position.x) * 0.005;
		camera.position.y += ( - (mouseY/2) - camera.position.y) * 0.005;
		camera.lookAt(scene.position );
		renderer.render(scene, camera);
	}

	function onWindowResize() {

		// Everything should resize nicely if it needs to!
	  	var WIDTH = window.innerWidth,
	  		HEIGHT = window.innerHeight;

	  	camera.aspect = aspectRatio;
	  	camera.updateProjectionMatrix();
	  	renderer.setSize(WIDTH, HEIGHT);
	}

	function starForge() {
		/* 	Yep, it's a Star Wars: Knights of the Old Republic reference,
			are you really surprised at this point?
													*/
		var starQty = 45000;
		geometry = new THREE.SphereGeometry(1000, 100, 50);

  	materialOptions = {
  		size: 0.2, //I know this is the default, it's for you.  Play with it if you want.
  	};

  	// starStuff = new THREE.PointsMaterial(materialOptions);
  	starStuff = new THREE.PointsMaterial(materialOptions);

		// The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms

		for (var i = 0; i < starQty; i++) {

			var starVertex = new THREE.Vector3();
			starVertex.x = Math.random() * 2000 - 1000;
			starVertex.y = Math.random() * 2000 - 1000;
			starVertex.z = Math.random() * 2000 - 1000;

			geometry.vertices.push(starVertex);
		}

		stars = new THREE.Points(geometry, starStuff);
		scene.add(stars);
	}

	function onMouseMove(e) {
		mouseX = e.clientX - windowHalfX;
		mouseY = e.clientY - windowHalfY;
	}
}
