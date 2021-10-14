//three.js responsive design via https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html

import * as THREE from './three/build/three.module.js';

import Stats from './three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { NURBSSurface } from './three/examples/jsm/curves/NURBSSurface.js';
import { NURBSCurve } from './three/examples/jsm/curves/NURBSCurve.js';


const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x0f0f0f0);

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);


const nurbsControlPoints = [];
const nurbsKnots = [];
const nurbsDegree = 3;
var pointNumber = 40;

const group = new THREE.Group();
scene.add(group)



for (let i = 0; i <= nurbsDegree; i++) {
    nurbsKnots.push(0);
}

for (let i = 0, j = pointNumber; i < j; i++) {
    nurbsControlPoints.push(new THREE.Vector4(gsap.utils.random(-1, 1), gsap.utils.random(-1, 1), gsap.utils.random(-1, 1), 1));
    const knot = (i + 1) / (j - nurbsDegree);
    nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
}

// const curve = new THREE.SplineCurve(curvePoints);

const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

const nurbsGeometry = new THREE.BufferGeometry();
nurbsGeometry.setFromPoints(nurbsCurve.getPoints(100));

const nurbsMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });

const nurbsLine = new THREE.Line(nurbsGeometry, nurbsMaterial);
nurbsLine.position.set(0, 0, 0);
group.add(nurbsLine);



// const points = curve.getPoints(50);
// const geometry = new THREE.BufferGeometry().setFromPoints(points);

// const material = new THREE.LineBasicMaterial({ color: 0x000000 });

// Create the final object to add to the scene
// const splineObject = new THREE.Line(geometry, material);

// scene.add(splineObject);
// renderer.render(scene, camera);

// const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xf0f0f0 );

// const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );

// const points = [];
// points.push( new THREE.Vector3( - 0.5, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 0.5, 0 ) );
// points.push( new THREE.Vector3( 0.5, 0, 0 ) );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( geometry, lineMaterial );

// scene.add( line );
// renderer.render( scene, camera );

// {
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
// }

// const boxWidth = 1;
// const boxHeight = 1;
// const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// function makeInstance(geometry, color, x) {
//     const material = new THREE.MeshPhongMaterial({ color });

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     cube.position.x = x;

//     return cube;
// }

// const cubes = [
//     makeInstance(geometry, 0x44aa88, 0),
//     makeInstance(geometry, 0x8844aa, -2),
//     makeInstance(geometry, 0xaa8844, 2),
// ];

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

    // cubes.forEach((cube, ndx) => {
    //     const speed = 1 + ndx * .1;
    //     const rot = time * speed;
    //     cube.rotation.x = rot;
    //     cube.rotation.y = rot;
    // });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

