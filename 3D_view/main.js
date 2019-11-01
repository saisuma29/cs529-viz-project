// import data using queue
d3.queue()
  .defer(d3.csv,"IBM_layer0_nodes_volt_js.csv")
  .defer(d3.csv,"IBM_layer1_nodes_volt_js.csv")
  .defer(d3.csv,"IBM_layer2_nodes_volt_js.csv")
  .defer(d3.csv,"IBM_layer3_nodes_volt_js.csv")
  .await(ready)

function init(layer0, layer1, layer2, layer3) {
	var scene = new THREE.Scene();
	var clock = new THREE.Clock();
	// initialize objects
	var planeMaterial = getMaterial('basic', 'rgb(255, 255, 255)'); 
	// ---------------------------------------
	var plane0 = getPlane(planeMaterial, 20, 0);
	var plane1 = getPlane(planeMaterial, 20, 2);
	var plane2 = getPlane(planeMaterial, 20, 4);
	var plane3 = getPlane(planeMaterial, 20, 6);
	// ---------------------------------------
	var timestamp = 0;
	// ---------------------------------------
	plane0.name = 'plane-0';
	plane1.name = 'plane-1';
	plane2.name = 'plane-2';
	plane3.name = 'plane-3';
	// ---------------------------------------
	// manipulate objects
	plane0.rotation.x = Math.PI/2;
	plane0.rotation.z = Math.PI/4;
	plane1.rotation.x = Math.PI/2;
	plane1.rotation.z = Math.PI/4;
	plane2.rotation.x = Math.PI/2;
	plane2.rotation.z = Math.PI/4;
	plane3.rotation.x = Math.PI/2;
	plane3.rotation.z = Math.PI/4;
	// add objects to the scene
	scene.add(plane0);
	scene.add(plane1);
	scene.add(plane2);
	scene.add(plane3);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 450;
	camera.position.x = 15;
	camera.position.y = 30;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('webgl').appendChild(renderer.domElement);
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	update(renderer, scene, camera, controls, clock, layer0, layer1, layer2, layer3,timestamp);
	return scene;
}

function getPlane(material, size, Z) {
	// var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
	var geometry=new THREE.Geometry();
	// var colorScale = d3.scaleSequential(d3.interpolateViridis)
	// .domain([Max_, Min_])
	var scale_grid = 10;
	for( var j = 0; j < size; j++ ){
		for( var i = 0;  i< size; i++ ){
			geometry.vertices.push( new THREE.Vector3(i*scale_grid, j*scale_grid, Z));
		}
	}

	for( var i = 0; i < size-1; i++ ){
		for( var j = 0;  j< size-1; j++ ){
			geometry.faces.push( new THREE.Face3((i+j*size), (i+1+j*size), (i+size+j*size)));
			geometry.faces.push( new THREE.Face3((i+1+j*size), (i+1+size+j*size), (i+size+j*size)));
		}
	}
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;
	obj.castShadow = true;
	return obj;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
		wireframe: true,
	};
	switch (type) {
		case 'basic':
			// selectedMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors } );
			selectedMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors} );

			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors } );

			//selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}
	return selectedMaterial;
}

function update(renderer, scene, camera, controls, clock, layer0, layer1, layer2, layer3, timestamp) {
	controls.update();
	// console.log(clock)
	var elapsedTime = clock.getElapsedTime();
	// ------------------------------------------
	var plane0 = scene.getObjectByName('plane-0')
	var plane1 = scene.getObjectByName('plane-1')
	var plane2 = scene.getObjectByName('plane-2')
	var plane3 = scene.getObjectByName('plane-3')
	// ------------------------------------------
	var planeGeo0 = plane0.geometry;
	var planeGeo1 = plane1.geometry;
	var planeGeo2 = plane2.geometry;
	var planeGeo3 = plane3.geometry;
	// ------------------------------------------
	var colorScaleP = d3.scaleSequential(d3.interpolateWarm)
	.domain([1.8, 1.6])
	var colorScaleG = d3.scaleSequential(d3.interpolateWarm)
	.domain([0.3, 0])

	console.log(timestamp)
	if (timestamp > 5999){
		timestamp =0

	}else{
		timestamp +=6;

	}
	for (var i =0; i<400;i++){
		planeGeo3.vertices[i].z = layer3[i][timestamp]*-50 + 70;
		planeGeo1.vertices[i].z = layer1[i][timestamp]*-50 + 120;

		planeGeo2.vertices[i].z = layer2[i][timestamp]*-50 + 10;
		planeGeo0.vertices[i].z = layer0[i][timestamp]*-50 + 50;
	}
	// console.log(planeGeo.colorsNeedUpdate)
	planeGeo0.colorsNeedUpdate = true;
	planeGeo1.colorsNeedUpdate = true;
	planeGeo2.colorsNeedUpdate = true;
	planeGeo3.colorsNeedUpdate = true;

	for ( var i = 0; i < planeGeo0.faces.length; i ++ ) {
		var a = parseFloat(layer0[planeGeo0.faces[i].a][timestamp]);
		var b = parseFloat(layer0[planeGeo0.faces[i].b][timestamp]);
		var c = parseFloat(layer0[planeGeo0.faces[i].c][timestamp]);
		var ave = (a+b+c)/3;
		var color = colorScaleG(ave)
		planeGeo0.faces[i].color.set(color);
	}
	for ( var i = 0; i < planeGeo1.faces.length; i ++ ) {
		var a = parseFloat(layer1[planeGeo1.faces[i].a][timestamp]);
		var b = parseFloat(layer1[planeGeo1.faces[i].b][timestamp]);
		var c = parseFloat(layer1[planeGeo1.faces[i].c][timestamp]);
		var ave = (a+b+c)/3;
		var color = colorScaleP(ave)
		planeGeo1.faces[i].color.set(color);
	}
	for ( var i = 0; i < planeGeo2.faces.length; i ++ ) {
		var a = parseFloat(layer2[planeGeo2.faces[i].a][timestamp]);
		var b = parseFloat(layer2[planeGeo2.faces[i].b][timestamp]);
		var c = parseFloat(layer2[planeGeo2.faces[i].c][timestamp]);
		var ave = (a+b+c)/3;
		var color = colorScaleG(ave)
		planeGeo2.faces[i].color.set(color);
	}
	for ( var i = 0; i < planeGeo3.faces.length; i ++ ) {
		var a = parseFloat(layer3[planeGeo3.faces[i].a][timestamp]);
		var b = parseFloat(layer3[planeGeo3.faces[i].b][timestamp]);
		var c = parseFloat(layer3[planeGeo3.faces[i].c][timestamp]);
		var ave = (a+b+c)/3;
		var color = colorScaleP(ave)
		planeGeo3.faces[i].color.set(color);
	}
	// }
	// console.log(planeGeo)
	planeGeo0.colorsNeedUpdate = true;
	planeGeo1.colorsNeedUpdate = true;
	planeGeo2.colorsNeedUpdate = true;
	planeGeo3.colorsNeedUpdate = true;

	// console.log(planeGeo.colorsNeedUpdate)

	planeGeo0.verticesNeedUpdate = true;
	planeGeo1.verticesNeedUpdate = true;
	planeGeo2.verticesNeedUpdate = true;
	planeGeo3.verticesNeedUpdate = true;



	renderer.render(scene, camera);
	renderer.setClearColor('rgb(150,150,150)');

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock, layer0, layer1, layer2, layer3, timestamp);
	});
}

function ready (error, layer0, layer1, layer2, layer3){
	init(layer0, layer1, layer2, layer3);
	}