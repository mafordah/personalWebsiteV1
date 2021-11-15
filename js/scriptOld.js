//three.js responsive design via https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html

import * as THREE from './three/build/three.module.js';

import Stats from './three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { NURBSCurve } from './three/examples/jsm/curves/NURBSCurve.js';
import { Line2 } from './three/examples/jsm/lines/Line2.js';
import { LineMaterial } from './three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from './three/examples/jsm/lines/LineGeometry.js';


const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x333333);
renderer.clearDepth();
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 6;
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const points = [];
const curvePoints = [];
//const nurbsKnots = [];
//const nurbsDegree = 5;
const point = new THREE.Vector3;
var pointNumber = 10;
var divisions = 10;

const group = new THREE.Group();
scene.add(group)

const controls = new OrbitControls( camera, renderer.domElement );
//controls.minDistance = 10;
//controls.maxDistance = 500;



// for (let i = 0; i <= nurbsDegree; i++) {
//     nurbsKnots.push(0);
// }

for (let i = 0, j = pointNumber; i < j; i++) {
    //points.push(gsap.utils.random(-1, 1), gsap.utils.random(-1, 1), gsap.utils.random(-1, 1));
    points.push(new THREE.Vector3(gsap.utils.random(-1, 1), gsap.utils.random(-1, 1), gsap.utils.random(-1, 1)));

    //const knot = (i + 1) / (j - nurbsDegree);
    //nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
}


//const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

const curve = new THREE.CatmullRomCurve3(points);


for ( let i = 0, j = divisions; i < j; i ++ ) {

    const t = i / j;

    curve.getPoint( t, point );
    curvePoints.push( point.x, point.y, point.z );

}

const geometry = new LineGeometry();
//geometry.setFromPoints(curve.getPoints(200));
geometry.setPositions(curvePoints);

const material = new LineMaterial({
    color: 0x333333,
    linewidth: 2,
    vertexColors: true,
    // linecap: 'round',
    // linejoin: 'round',
    dashed: false,
    alphaToCoverage: true,
});

const line = new Line2(geometry, material);
line.position.set(0, 0, 0);
// line.scale.set(1, 1, 1);
group.add(line);


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

