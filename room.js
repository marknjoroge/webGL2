import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

import { RectAreaLightHelper } from './rect_area_light_helper.js';

import ColorGUIHelper from './color_gui_helper.js';

function main() {
    let canvas = document.querySelector('#my-canvas');
    let renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);

    let planeSize = 40;
    let doorSize = 6;

    let color = 0xFFFFFF;

    let door;

    let doorIsOpen = true;
    let timeIsDay = true;

    let WALL_HEIGHT = 20;

    let sofaTexture = new THREE.TextureLoader().load('./textures/sofa.jpg');
    let bulbTexture = new THREE.TextureLoader().load('./textures/white.jpg');
    let wallTexture = new THREE.TextureLoader().load('./textures/brick.jpeg');
    let socksTexture = new THREE.TextureLoader().load('./textures/socks.png');
    let floorTexture = new THREE.TextureLoader().load('./textures/floor.png');
    let bedTexture = new THREE.TextureLoader().load('./textures/bed.jpg');
    let cookerTexture = new THREE.TextureLoader().load('./textures/cooker.jpeg');
    let clothesTexture = new THREE.TextureLoader().load('./textures/clothes.jpeg');

    let fov = 45;
    let aspect = window.innerWidth / window.innerHeight;  // the canvas default
    let near = 0.1;
    let far = 1000;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 30, 80);
    // camera.lookAt(0,0,0);

    let bulbOn = true;
    let tvIsOn = true;

    let tvLight;

    let controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    let scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    // Walls

    let doorGeo = new THREE.BoxGeometry(0.01, 10, doorSize);
    let doorMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
    door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(planeSize / 2, 5, 0);
    // scene.add(door);

    let wallSize = planeSize;
    let wallGeo = new THREE.BoxGeometry(0.01, WALL_HEIGHT, wallSize);
    let wallMat = new THREE.MeshStandardMaterial({ map: wallTexture });
    let wall1 = new THREE.Mesh(wallGeo, wallMat);
    wall1.position.set(-wallSize / 2, WALL_HEIGHT / 2, 0);
    scene.add(wall1);

    let wallGeo0 = new THREE.BoxGeometry(wallSize, WALL_HEIGHT, 0.01);
    let wall0 = new THREE.Mesh(wallGeo0, wallMat);
    wall0.position.set(0, WALL_HEIGHT / 2, -wallSize / 2);
    scene.add(wall0);


    let floorGeo = new THREE.BoxGeometry(wallSize, 0.001, wallSize);
    let floorMat = new THREE.MeshStandardMaterial({ map: floorTexture });
    let floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0, 0);
    scene.add(floor);

    // let loader = new THREE.TextureLoader();
    // let texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.magFilter = THREE.NearestFilter;
    // let repeats = planeSize / 2;
    // texture.repeat.set(repeats, repeats);

    // let planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    // let planeMat = new THREE.MeshStandardMaterial({
    //     map: texture,
    //     side: THREE.DoubleSide,
    // });
    // let mesh = new THREE.Mesh(planeGeo, planeMat);
    // mesh.rotation.x = Math.PI * -.5;


    // scene.add(mesh);


    // objects in the house

    let CUBE_SIZE = 4;
    {
        let cubeGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        let cubeMat = new THREE.MeshStandardMaterial({ map: cookerTexture });
        let mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(2, CUBE_SIZE/2, - planeSize / 2 + CUBE_SIZE /2);
        scene.add(mesh);
    }
    {
        let torchGeo = new THREE.CylinderGeometry(.1, .2, 1, 10);
        let torchMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
        let torch = new THREE.Mesh(torchGeo, torchMat);

        scene.add(torch);
        torch.position.set(CUBE_SIZE - 15, 0, 7)
    }
    {
        // let CUBE_SIZE = 2;
        // let cubeGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        // let cubeMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
        // let mesh = new THREE.Mesh(cubeGeo, cubeMat);
        // mesh.position.set(CUBE_SIZE, CUBE_SIZE, -15);
        // scene.add(mesh);
    }
    {
        let bulbHolber = .4;
        let sphereWidthDivisions = 32;
        let sphereHeightDivisions = 16;
        let sphereGeo = new THREE.SphereGeometry(bulbHolber, sphereWidthDivisions, sphereHeightDivisions);
        let sphereMat = new THREE.MeshStandardMaterial({ map: bulbTexture });
        let mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(0, planeSize /2, 0);
        scene.add(mesh);
    }
    {
        let tvGeo = new THREE.BoxGeometry(10, 5, .1);
        let tvMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
        let tv = new THREE.Mesh(tvGeo, tvMat);
        tv.position.set(-12, 5, - planeSize / 2 + .7);
        scene.add(tv);


        tvLight = new THREE.RectAreaLight(0xffffff, 1, 10, 5);
        tvLight.position.set(-12, 5, - planeSize / 2 + .7);
        tvLight.lookAt(12, 5);

        tvIntensity();
        scene.add(tvLight)
    }
    {
        let sofaGeo1 = new THREE.BoxGeometry(10, CUBE_SIZE, 2);
        let ssofaMat1 = new THREE.MeshStandardMaterial({ map: sofaTexture });
        let sofa1 = new THREE.Mesh(sofaGeo1, ssofaMat1);
        sofa1.position.set(CUBE_SIZE - 15, CUBE_SIZE / 2, 1);
        scene.add(sofa1);

        let sofaGeo2 = new THREE.BoxGeometry(2, CUBE_SIZE, 4);
        let ssofaMat2 = new THREE.MeshStandardMaterial({ map: sofaTexture });
        let sofa2 = new THREE.Mesh(sofaGeo2, ssofaMat2);
        sofa2.position.set(CUBE_SIZE - 20, CUBE_SIZE / 2, -1);
        scene.add(sofa2);

        let sofa3 = new THREE.Mesh(sofaGeo2, ssofaMat2);
        sofa3.position.set(CUBE_SIZE - 10, CUBE_SIZE / 2, -1);
        scene.add(sofa3);

        let sofaGeo4 = new THREE.BoxGeometry(8, 2, CUBE_SIZE);
        let ssofaMat4 = new THREE.MeshStandardMaterial({ map: sofaTexture });
        let sofa4 = new THREE.Mesh(sofaGeo4, ssofaMat4);
        sofa4.position.set(CUBE_SIZE - 15, CUBE_SIZE / 2, -1);
        scene.add(sofa4);
    }
    {

        let tableGeo4 = new THREE.BoxGeometry(4, 2, CUBE_SIZE);
        let tableMat4 = new THREE.MeshStandardMaterial({ map: sofaTexture });
        let table = new THREE.Mesh(tableGeo4, tableMat4);
        table.position.set(CUBE_SIZE - 15, CUBE_SIZE / 2, -7);
        scene.add(table);
    }
    {
        let clothesGeo = new THREE.CylinderGeometry(.5, 3, 5, .1);
        let clothesMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
        let tv = new THREE.Mesh(clothesGeo, clothesMat);
        tv.position.set(-12, 5, - planeSize / 2 + .7);
        scene.add(tv);
    } 
    {

        let socksGeo = new THREE.BoxGeometry(5,.1 ,5 );
        let socksMat = new THREE.MeshStandardMaterial({ map: socksTexture });
        let socks = new THREE.Mesh(socksGeo, socksMat);
        socks.position.set(CUBE_SIZE - 15, 0, 7);
        scene.add(socks);

    }
    {
        let bedGeo4 = new THREE.BoxGeometry(16, CUBE_SIZE, 10);
        let bedMat4 = new THREE.MeshStandardMaterial({ map: bedTexture });
        let bed4 = new THREE.Mesh(bedGeo4, bedMat4);
        bed4.position.set(CUBE_SIZE - 16, CUBE_SIZE / 2, 15);
        scene.add(bed4);
    }
    {
        let basketGeo4 = new THREE.CylinderGeometry(2.5, 1.5, 3, 32);
        let basketMat4 = new THREE.MeshStandardMaterial({ map: clothesTexture });
        let basket = new THREE.Mesh(basketGeo4, basketMat4);
        basket.position.set(CUBE_SIZE, CUBE_SIZE / 2, 15);
        scene.add(basket);
    }


    // lights
    let intensity = 0.7;

    let width = 5;
    let height = 10;

    let ambientLight = new THREE.AmbientLight(color, intensity);

    let sunLight = new THREE.DirectionalLight(color, 0.08);

    let bulbLight = new THREE.PointLight(color, .4);

    let torchLight = new THREE.PointLight(color, 1);

    let rectLight = new THREE.RectAreaLight(0xffffff, 5, width, height);
    rectLight.position.set(planeSize / 2, height / 2, 0);
    rectLight.lookAt(0, height / 2, 0);

    let rectLight2 = new THREE.RectAreaLight(0xffffff, 5, width, height);
    rectLight2.position.set(planeSize / 2, height / 2, 0);
    rectLight2.lookAt(0, height / 2, 0);

    let rectLightHelper = new RectAreaLightHelper(rectLight);
    rectLight.add(rectLightHelper);

    scene.add(rectLight)
    scene.add(ambientLight);
    scene.add(bulbLight);
    scene.add(sunLight);

    bulbLight.position.set(0, 10, 0);


    // GUI buttons logic
    var switches = {
        night: function () {
            if (timeIsDay) {
                sunLight.intensity = 0;
                ambientLight.intensity = 0.04;
                rectLight.intensity = 0.01;
            } else {
                sunLight.intensity = 0.08;
                ambientLight.intensity = 0.7;
                rectLight = 5;
            }
        },
        lights: function () {
            if (!bulbOn) {
                ambientLight.intensity = 0.20;
                bulbLight.intensity = 1.0;
                bulbOn = true;
                console.log(bulbOn);
            } else {
                ambientLight.intensity = 0.001;
                bulbLight.intensity = 0.0;
                bulbOn = false;
            }
        },
        toogleDoor: function () {
            if (doorIsOpen) {
                // rotateAboutPoint(door,
                //     new THREE.Vector3(planeSize / 2, 5, - doorSize / 2),
                //     new THREE.Vector3(planeSize / 2, 5, doorSize / 2),
                //     THREE.Math.degToRad(90)
                // );
                reduceLight();
            } else {
                increaseLight();
            }
            doorIsOpen = !doorIsOpen;
        },
        switchTV: function () {
            tvIsOn ? tvLight.intensity = 0 : tvLight.intensity = 4
            tvIsOn = !tvIsOn;
        }
    }




    // custom redude light animation
    async function reduceLight() {
        // Sleep in loop
        for (let i = rectLight.intensity * 10; i > 0; i--) {
            await sleep(20);
            rectLight.intensity -= 0.1;
            console.log(rectLight.intensity);
        }
    }

    async function increaseLight() {
        // Sleep in loop
        for (let i = 50; i > 0; i--) {
            await sleep(20);
            rectLight.intensity += 0.1;
            console.log(rectLight.intensity);
        }
    }

    async function tvIntensity() {
        // Sleep in loop
        while (tvIsOn) {
            await sleep(200);
            tvLight.intensity = Math.floor(Math.random() * 10);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    // GUI options
    function createGUI() {
        let gui = new GUI();
        gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        gui.add(ambientLight, 'intensity', 0, 2, 0.01).name("ambient light");
        gui.add(bulbLight, 'intensity', 0, 2, 0.1).name("bulb light");
        gui.add(sunLight, 'intensity', 0, 2, 0.01).name("sun light");
        gui.add(rectLight, 'intensity', 0, 2, 0.01).name("rect light");
        gui.add(switches, 'lights').name("bulb on/off");
        gui.add(switches, 'night').name("day/night");
        gui.add(switches, 'toogleDoor').name('open/close door');
        gui.add(switches, 'switchTV').name('switch tv');
    }

    createGUI();

    function resizeRendererToDisplaySize(renderer) {
        let canvas = renderer.domElement;
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        let needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
        pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

        if (pointIsWorld) {
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if (pointIsWorld) {
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            let canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    window.addEventListener('resize', onWindowResize, false);

    requestAnimationFrame(render);
}

main();
