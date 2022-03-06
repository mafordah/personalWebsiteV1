import * as THREE from './three/build/three.module.js';

import { Line2 } from './three/examples/jsm/lines/Line2.js';
import { LineMaterial } from './three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from './three/examples/jsm/lines/LineGeometry.js';



let line, lineShadow, renderer, scene, camera, controls;
let matLine, shadowLine;

const points = [];
const pointNumber = 20;
const geometry = new LineGeometry();
const shadowGeometry = new LineGeometry();
const width = 6;
var setRotate = true;
var entered = false;

//Div for spline click boundary
var bounds = document.getElementById("bounds");
bounds.style.width = (window.innerHeight * 0.4) + "px";

//Div for entry text
var entryText = document.getElementById("entry");

var rotateSpeed = 0.01;

//Viewport
let insetWidth;
let insetHeight;

var spline;

init();
animate();
getNewPosition();

function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 60);


    for (let i = 0, j = pointNumber; i < j; i++) {
        points.push(new THREE.Vector3(gsap.utils.random(-width, width), gsap.utils.random(-width, width), gsap.utils.random(-width, width)));
    }


    matLine = new LineMaterial({
        color: 0x404040,
        linewidth: 2,
        // in world units with size attenuation, pixels otherwise
        //worldUnits: true,
        dashed: false,
        alphaToCoverage: true,
    });

    shadowLine = new LineMaterial({
        color: 0xd1d1d1,
        linewidth: 3,
        // in world units with size attenuation, pixels otherwise
        //worldUnits: true,
        dashed: false,
        alphaToCoverage: true,
    });



    line = new Line2(geometry, matLine);
    lineShadow = new Line2(shadowGeometry, shadowLine);
    lineShadow.position.set(0, -15, 0);
    lineShadow.scale.set(1.2, 1.2, 1.2);

    line.geometry.center();
    lineShadow.geometry.center();

    scene.add(line, lineShadow);

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

}


function getPosition() {
    const positions = [];
    const shadowPositions = [];
    spline = new THREE.CatmullRomCurve3(points, false, "catmullrom", 1.5);
    const divisions = Math.round(12 * points.length);
    const point = new THREE.Vector3();

    for (let i = 0, l = divisions; i < l; i++) {

        const t = i / l;

        spline.getPoint(t, point);
        positions.push(point.x, point.y, point.z);
        shadowPositions.push(point.x, 0, point.z)
    }

    geometry.setPositions(positions);
    shadowGeometry.setPositions(shadowPositions);
}


function rotate() {
    if (setRotate) {
        line.rotation.y += rotateSpeed;
        lineShadow.rotation.y += rotateSpeed;
        if (line.rotation.y >= Math.PI * 2) {
            line.rotation.y = 0;
            lineShadow.rotation.y = 0;
        }
    }
}


function getNewPosition() {
    var durationSec = 20;
    var durationMil = durationSec * 1000;


    if (setRotate) {
        for (let i = 0, j = pointNumber; i < j; i++) {
            //console.log(i, points[i]);
            gsap.to(points[i], {
                duration: durationSec,
                x: gsap.utils.random(-width, width),
                y: gsap.utils.random(-width, width),
                z: gsap.utils.random(-width, width),
                ease: "rough({ template: none.out, strength: 1, points: 10, taper: none, randomize: true, clamp: true})",
                //repeat:-1,
                //repeatRefresh: true
            });
        }
        setTimeout(getNewPosition, durationMil);
    }
}


function makeSignature() {
    const duration = 1;
    const cameraDuration = 2.3;
    // var signature = [
    //     { x: -120, y: 0, z: 0 },
    //     { x: -108, y: 0, z: 0 },
    //     { x: -102, y: 0, z: 0 },
    //     { x: -96, y: 0, z: 0 },
    //     { x: -90, y: 0, z: 0 },
    //     { x: -84, y: 0, z: 0 },
    //     { x: -78, y: 0, z: 0 },
    //     { x: -72, y: 0, z: 0 },
    //     { x: -66, y: 0, z: 0 },
    //     { x: -60, y: 0, z: 0 },
    //     { x: -54, y: 0, z: 0 },
    //     { x: -48, y: 0, z: 0 },
    //     { x: -42, y: 0, z: 0 },
    //     { x: -20, y: 0, z: 0 },
    //     { x: -5, y: 0, z: 0 },
    //     { x: -4, y: 0, z: 0 },
    //     { x: -3, y: 0, z: 0 },
    //     { x: -2, y: 0, z: 0 },
    //     { x: -1, y: 0, z: 0 },
    //     { x: -0, y: 0, z: 0 },
    //     { x: -0, y: 0, z: 0 },
    // ];

    var signature = [
        { x: -60, y: 0, z: 0 },
        { x: -54, y: 0, z: 0 },
        { x: -48, y: 0, z: 0 },
        { x: -42, y: 0, z: 0 },
        { x: -36, y: 0, z: 0 },
        { x: -30, y: 0, z: 0 },
        { x: -24, y: 0, z: 0 },
        { x: -18, y: 0, z: 0 },
        { x: -12, y: 0, z: 0 },
        { x: -6, y: 0, z: 0 },
        { x: -0, y: 0, z: 0 },
        { x: 6, y: 0, z: 0 },
        { x: 12, y: 0, z: 0 },
        { x: 18, y: 0, z: 0 },
        { x: 24, y: 0, z: 0 },
        { x: 30, y: 0, z: 0 },
        { x: 36, y: 0, z: 0 },
        { x: 42, y: 0, z: 0 },
        { x: 48, y: 0, z: 0 },
        { x: 54, y: 0, z: 0 },
    ];

    // var signature = [
    //     { x: 0, y: 60, z: 0 },
    //     { x: 0, y: 57, z: 0 },
    //     { x: 0, y: 54, z: 0 },
    //     { x: 0, y: 51, z: 0 },
    //     { x: 0, y: 48, z: 0 },
    //     { x: 0, y: 45, z: 0 },
    //     { x: 0, y: 42, z: 0 },
    //     { x: 0, y: 39, z: 0 },
    //     { x: 0, y: 36, z: 0 },
    //     { x: 0, y: 33, z: 0 },
    //     { x: 0, y: 30, z: 0 },
    //     { x: 0, y: 27, z: 0 },
    //     { x: 0, y: 24, z: 0 },
    //     { x: 0, y: 18, z: 0 },
    //     { x: 0, y: 15, z: 0 },
    //     { x: 0, y: 4, z: 0 },
    //     { x: 0, y: 3, z: 0 },
    //     { x: 0, y: 2, z: 0 },
    //     { x: 0, y: 0, z: 0 },
    //     { x: 0, y: 0, z: 0 },
    //     { x: 0, y: 0, z: 0 },
    // ];

    // var signature = [
    //     { x: 0, y: -45, z: 0 },
    //     { x: 0, y: -42, z: 0 },
    //     { x: 0, y: -39, z: 0 },
    //     { x: 0, y: -36, z: 0 },
    //     { x: 0, y: -33, z: 0 },
    //     { x: 0, y: -30, z: 0 },
    //     { x: 0, y: -27, z: 0 },
    //     { x: 0, y: -24, z: 0 },
    //     { x: 0, y: -18, z: 0 },
    //     { x: 0, y: -15, z: 0 },
    //     { x: 0, y: -12, z: 0 },
    //     { x: 0, y: -9, z: 0 },
    //     { x: 0, y: -6, z: 0 },
    //     { x: 0, y: -3, z: 0 },
    //     { x: 0, y: 0, z: 0 },
    //     { x: 0, y: 1, z: 0 },
    //     { x: 0, y: 2, z: 0 },
    //     { x: 0, y: 3, z: 0 },
    //     { x: 0, y: 4, z: 0 },
    //     { x: 0, y: 5, z: 0 },
    // ];

    //Stop previous animation
    for (let i = 0, j = pointNumber; i < j; i++) {
        gsap.killTweensOf(points[i]);
    }

    var move = gsap.timeline({});

    //Move Camera
    gsap.to(camera.position, { duration: cameraDuration, y: 15, ease: "power2.inOut" });
    //gsap.to(camera.position, { duration: cameraDuration, y: 30 });


    //Decide rotation duration based on current rotation
    if (line.rotation.y > Math.PI) {
        move.to(line.rotation, { duration: duration, y: Math.PI * 2 }, "<");
        move.to(lineShadow.rotation, { duration: duration, y: Math.PI * 2 }, "<");
    } else {
        move.to(line.rotation, { duration: duration, y: 0 }, "<");
        move.to(lineShadow.rotation, { duration: duration, y: 0 }, "<");
    }

    //Move line elasictially to array of points
    for (let i = 0, j = pointNumber; i < j; i++) {
        move.to(points[i], {
            duration: 3,
            x: signature[i].x,
            y: signature[i].y,
            z: signature[i].z,
            ease: "elastic.out(1, 0.2)",
        }, "<2%");
    }

    //Cleanup: Remove entry text 
    move.add(function(){entryText.style.display = "none"});

}

// function getRandom(min, max) {
//     return gsap.utils.random(min, max);
// }


function onWindowResize() {
    //Reset bounds of spline
    bounds.style.width = (window.innerHeight * 0.4) + "px";

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    insetWidth = window.innerHeight / 4;
    insetHeight = window.innerHeight / 4;

}



function animate() {
    const tempV = new THREE.Vector3();

    getPosition();

    rotate();

    requestAnimationFrame(animate);

    // Main scene
    renderer.setClearColor(0xf0f0f0);

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    // renderer will set this eventually
    matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
    shadowLine.resolution.set(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

    //Inset scene
    renderer.setClearColor(0xf0f0f0, 1);
    renderer.clearDepth();
    renderer.setScissorTest(true);
    renderer.setScissor(20, 20, insetWidth, insetHeight);
    renderer.setViewport(20, 20, insetWidth, insetHeight);

    //Renderer will set this eventually
    matLine.resolution.set(insetWidth, insetHeight); // resolution of the inset viewport
    renderer.setScissorTest(false);
    tempV.project(camera);

    // Convert the normalized position to CSS coordinates
    const x = (tempV.x * .5 + .5) * window.innerWidth;
    const y = (tempV.y * -.5 + .5) * window.innerHeight;

    // Move bounds
    bounds.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    entryText.style.transform = `translate(-50%, -50%) translate(${x}px,${y + 145}px)`;


}

//Move scene on mouse moves
window.addEventListener("mousemove", e => {
    // scene.position.y = (e.pageY - window.innerWidth/2) * (-0.001);
    // scene.position.x = (e.pageX - window.innerHeight/2) * (0.001);

    //Smooth move
    gsap.to(scene.position, { x: (e.pageX - window.innerWidth / 2) * (-0.001), y: (e.pageY - window.innerHeight / 2) * (0.001) });

    console.log(spline.getPoint(e.pageX/window.innerWidth));

});



//////////////LINKS TO HTML////////////////



//Entry animation
var entryTextDelay = 8;
gsap.to(entryText, { delay: entryTextDelay, duration: 3, color: "rgb(128,128,128)" });

const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

if (isTouchDevice() && isMobile){
    entryText.innerText = "[ tap to continue ]";
}

window.addEventListener("keypress", e => {
    //allow for keypress entry
    if (!entered) {
        enterClick();
    }
});

window.addEventListener("click", e => {
    //allow for fullscreen click entry
    if (!entered) {
        enterClick();
    }
});

bounds.addEventListener("mouseover", enter);
bounds.addEventListener("mouseout", exit);
// bounds.addEventListener("click", enterClick);

function enter() {
    rotateSpeed = 0.03;
}

function exit() {
    rotateSpeed = 0.01;
}

function enterClick() {
    entered = true;
    setRotate = false;
    makeSignature();
    bounds.style.display = "none";
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}