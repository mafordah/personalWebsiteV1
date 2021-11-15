

import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { Line2 } from './three/examples/jsm/lines/Line2.js';
import { LineMaterial } from './three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from './three/examples/jsm/lines/LineGeometry.js';


let line, renderer, scene, camera, controls;
let matLine;

const points = [];
const pointNumber = 40;
const geometry = new LineGeometry();


// viewport
let insetWidth;
let insetHeight;

init();
animate();
getNewPosition();

function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(- 40, 0, 60);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 500;


    for (let i = 0, j = pointNumber; i < j; i++) {
        points.push(new THREE.Vector3(gsap.utils.random(-15, 15), gsap.utils.random(-15, 15), gsap.utils.random(-15, 15)));
    }

    matLine = new LineMaterial({

        color: 0x333333,
        linewidth: 1, // in world units with size attenuation, pixels otherwise
        vertexColors: true,
        //worldUnits: true,

        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true,

    });

    line = new Line2(geometry, matLine);
    //line.computeLineDistances();
    //line.scale.set(1, 1, 1);
    scene.add(line);

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

}

function getPosition() {
    const positions = [];


    const spline = new THREE.CatmullRomCurve3(points);
    const divisions = Math.round(12 * points.length);
    const point = new THREE.Vector3();



    for (let i = 0, l = divisions; i < l; i++) {

        const t = i / l;

        spline.getPoint(t, point);
        positions.push(point.x, point.y, point.z);

    }

    geometry.setPositions(positions);
}

function rotate() {
    line.rotation.y += 0.01;
}

function getNewPosition() {

    var durationSec = 5
    var durationMil = durationSec * 1000;
    

    for (let i = 0, j = pointNumber; i < j; i++) {
        //console.log(i, points[i]);
        gsap.to(points[i], { 
            duration: durationSec, 
            x: gsap.utils.random(-15, 15), 
            y: gsap.utils.random(-15, 15), 
            z: gsap.utils.random(-15, 15), 
            ease: "none",
            //repeat:-1,
            //repeatRefresh: true
        });
    }
    setTimeout(getNewPosition, durationMil);
}

function getRandom(min, max){
    return gsap.utils.random(min, max);
}



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    insetWidth = window.innerHeight / 4; // square
    insetHeight = window.innerHeight / 4;

}

function animate() {

    getPosition();

    rotate();

    requestAnimationFrame(animate);

    // main scene

    renderer.setClearColor(0xf0f0f0);

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    // renderer will set this eventually
    matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport

    renderer.render(scene, camera);

    // inset scene

    renderer.setClearColor(0xf0f0f0, 1);

    renderer.clearDepth(); // important!

    renderer.setScissorTest(true);

    renderer.setScissor(20, 20, insetWidth, insetHeight);

    renderer.setViewport(20, 20, insetWidth, insetHeight);

    // renderer will set this eventually
    matLine.resolution.set(insetWidth, insetHeight); // resolution of the inset viewport

    renderer.setScissorTest(false);

}
