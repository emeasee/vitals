if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  ///////////////////////////////////////

  // values
  var ww, wh;
  var renderer, scene, camera, canvas, container;

  var t = 0;
  var bt = 0;
  var lt = 0;

  var tx = 0;
  var ty = 0;


  var config = {
    color: [ 234, 0, 0 ],
    speed1: 0.001,
    level:  0.75,
    var1: 0.35,
    var2: 0,
    speed2: 0.02,
    random: function(){
      config.color[0] = Math.random() * 255;
      config.color[1] = Math.random() * 255;
      config.color[2] = Math.random() * 255;
      config.level = Math.random();
      config.var1 = Math.random();
      config.var2 = Math.random();
      config.speed1 = Math.random() * 0.2;
      config.speed2 = Math.random() * 0.2;
    }
  };

  var ball;
  var ballGeometry;
  var ballVertices;
  var ballMaterial;

  var light;

  var values = [],
    total = 0;
  var mousePos = {
    x: 0,
    y: 0
  };

  var cameraMode = true;
  var debugMode = false;
  var defaultCamera = 'manual';
  var ch, gh;


  ///////////////////////////////////////
  // constructor
  threeSetup();
  setResizeHandler();


  function threeSetup() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //container.addEventListener("click", function(){
    //  window.top.location.href='http://m-jo.co/categories/featured/';
    //});

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    //camera.up = { x:0, y:0, z:1 };
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    ballGeometry = new THREE.SphereGeometry(100, 40, 40);

    // setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfefefd, 1.0);
    container.appendChild(renderer.domElement);

    setupBeater();
    renderStart();
  };

  function setResizeHandler() {
    resize();
    window.addEventListener( 'resize', resize, false );
  };

  function resize(e) {
    ww = window.innerWidth;
    wh = window.innerHeight;

    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  function setupBeater() {
    ballMaterial = new THREE.MeshPhongMaterial({ambient: 0xff0000, color: 0xff0000})
    ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.castShadow = true;
    ball.receiveShadow = true;
    ballVertices = ball.geometry.vertices;
    var vertex;
    for(var i = 0, len = ballVertices.length; i < len; i++) {
      vertex = ballVertices[i];
      vertex.ox = vertex.x;
      vertex.oy = vertex.y;
      vertex.oz = vertex.z;
    }

    var ambient = new THREE.AmbientLight(0xAA0000);

    light = new THREE.DirectionalLight( 0x999999 );
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowCameraLeft = -500;
    light.shadowCameraRight = 500;
    light.shadowCameraTop = 500;
    light.shadowCameraBottom = -500;
    light.shadowCameraFar = 3500;

    scene.add(ball);
    scene.add(ambient);
    scene.add( light );
    scene.fog = new THREE.FogExp2( 0xFFD600, 0.002);

  }

  function updateDebugMode() {

    if (debugMode) {
      //ch.visible = true;
      gh.visible = true;
    } else {
      //ch.visible = false;
      gh.visible = false;
    }

  }

  function renderStart() {

    // debug
    //ch = new THREE.CameraHelper(camera);
    gh = new THREE.GridHelper(1000, 100);
    //scene.add(ch);
    scene.add(gh);

    updateDebugMode();

    // event
    window.addEventListener('mousemove', mousemove);

    // render
    camera.position.y = 100;
    camera.position.z = 300;
    cameraMode = defaultCamera;
    render();

  };

  function mousemove(e) {
    tx = e.clientX / ww * 2 - 1;
    ty = e.clientY / wh * 2 - 1;
  };

  function render() {

    mousePos.x += (tx - mousePos.x) * .05;
    mousePos.y += (ty - mousePos.y) * .05;

    t += config.speed1;
    bt += config.speed2;
    lt += 0.01;
    var vertex;
    var scale;
    var level = config.level;
    var multiplyRatio = config.multiplyRatio;
    var var1 = config.var1;
    var var2 = config.var2;

    for(var i = 0, len = ballVertices.length; i < len; i++) {
      vertex = ballVertices[i];
      scale = Math.sin(t + i * ((1 + i)/(1 + i * var2)) * var1/40) * Math.sin(bt + i/ len) * level;
      vertex.x = vertex.ox + vertex.ox * scale;
      vertex.y = vertex.oy + vertex.oy * scale;
      vertex.z = vertex.oz + vertex.oz * scale;
    }

    ball.geometry.verticesNeedUpdate = true;
    ball.geometry.normalsNeedUpdate = true;

    light.position.set( Math.cos(lt) * 200, Math.sin(lt) * 200, 50 );

    //ballMaterial.ambient.r = ballMaterial.color.r = config.color[0] / 255;
    //ballMaterial.ambient.g = ballMaterial.color.g = config.color[1] / 255;
    //ballMaterial.ambient.b = ballMaterial.color.b = config.color[2] / 255;

    camera.position.x = mousePos.x * 100;
    camera.position.y = mousePos.y * 200;

    camera.lookAt(scene.position);

    //debug( camera.position.x+', '+camera.position.y+', '+camera.position.z );

    renderer.render(scene, camera);
    requestAnimationFrame(render);

  };
  ///////////////////////////////////////

/*jshint ignore:end*/
