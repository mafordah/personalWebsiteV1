import * as THREE from './three/build/three.module.js';

import { Line2 } from './three/examples/jsm/lines/Line2.js';
import { LineMaterial } from './three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from './three/examples/jsm/lines/LineGeometry.js';



let line, lineShadow, renderer, scene, camera, composer;
let matLine, shadowLine;

const points = [];
const pointNumber = 15;
const geometry = new LineGeometry();
const shadowGeometry = new LineGeometry();
const width = 4.5;
var setRotate = true;
var entered = false;

//Div for spline click boundary
var bounds = document.getElementById("bounds");
var boundHeight = 0.13
bounds.style.width = (window.innerHeight * boundHeight).toString() + "px"; //intial height

// var entryText = document.getElementById("entry");

var rotateSpeed = 0.01;

//Viewport
let insetWidth;
let insetHeight;

var spline = new THREE.CatmullRomCurve3(points, false, "catmullrom", 1.0);


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
        linewidth: 0.18,
        // in world units with size attenuation, pixels otherwise
        worldUnits: true,
        dashed: false,
        alphaToCoverage: true,
    });

    shadowLine = new LineMaterial({
        color: 0xd1d1d1,
        linewidth: 0.25,
        // in world units with size attenuation, pixels otherwise
        worldUnits: true,
        dashed: false,
        alphaToCoverage: true,
    });



    line = new Line2(geometry, matLine);
    lineShadow = new Line2(shadowGeometry, shadowLine);
    lineShadow.position.set(0, -14, 0);
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
            gsap.to(points[i], {
                duration: durationSec,
                x: gsap.utils.random(-width, width),
                y: gsap.utils.random(-width, width),
                z: gsap.utils.random(-width, width),
                ease: "rough({ template: none.out, strength: 1, points: 10, taper: none, randomize: true, clamp: true})",
            });
        }
        setTimeout(getNewPosition, durationMil);
    }
}


function drawPage() {
    const duration = 1;
    const cameraDuration = 2.3;

    //Det. points for unwrap
    // var signature = [
    //     { x: -48, y: 0, z: 0 },
    //     { x: -36, y: 0, z: 0 },
    //     { x: -30, y: 0, z: 0 },
    //     { x: -24, y: 0, z: 0 },
    //     { x: -18, y: 0, z: 0 },
    //     { x: -12, y: 0, z: 0 },
    //     { x: -6, y: 0, z: 0 },
    //     { x: -0, y: 0, z: 0 },
    //     { x: 6, y: 0, z: 0 },
    //     { x: 12, y: 0, z: 0 },
    //     { x: 18, y: 0, z: 0 },
    //     { x: 24, y: 0, z: 0 },
    //     { x: 36, y: 0, z: 0 },
    //     { x: 48, y: 0, z: 0 },
    //     { x: 54, y: 0, z: 0 },
    // ];

    var signature = [
        { x: -48, y: 0, z: 0 },
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
        { x: 36, y: 0, z: 0 },
        { x: 48, y: 0, z: 0 },
        { x: 54, y: 0, z: 0 },
    ];


    //Stop previous animation
    for (let i = 0, j = pointNumber; i < j; i++) {
        gsap.killTweensOf(points[i]);
    }

    //Readjust tension for unwrap
    gsap.to(spline, { tension: 1.0 });

    //Start new timeline
    var move = gsap.timeline({});

    //Move camera positioning
    // gsap.to(camera.position, { duration: cameraDuration, y: 13, ease: "power2.inOut" });

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


    /*CLEANUP*/
    //Remove hero bounds
    // move.add(function () { bounds.style.display = "none" })
    //Move scene to center
    gsap.to(scene.position, { x: 0, y: 0 });

}


function onWindowResize() {
    //Reset bounds of spline
    bounds.style.width = (window.innerHeight * boundHeight).toString() + "px";

    //Adjust scene to window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    insetWidth = window.innerHeight / 4;
    insetHeight = window.innerHeight / 4;
}


//Draw function
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

    // Renderer will set this eventually
    matLine.resolution.set(insetWidth, insetHeight); // resolution of the inset viewport
    renderer.setScissorTest(false);

    // tempV.set(spline.position);
    tempV.project(camera);

    // Convert the normalized position to CSS coordinates
    const x = (tempV.x * .5 + .5) * window.innerWidth;
    const y = (tempV.y * -.5 + .5) * window.innerHeight;

    // Move elements with camera to center
    // bounds.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    // bounds.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

}


//Paralax
window.addEventListener("mousemove", e => {
    //Smooth move
    if (!entered) {
        gsap.to(scene.position, { x: (e.pageX - window.innerWidth / 2) * (0.001), y: (e.pageY - window.innerHeight / 2) * (-0.001) });
    }
});

////////////MAIN TIMELINE/////////////////

let mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "1000",
        pin: true,
        scrub: 1,
        markers: true,
    },
});

mainTl
    //About
    .to(".title", 1, { color: "rgba(0,0,0,0)" }, "<")
    .to(".title", 0.5, { fontSize: "30px", fontWeight: "400", textAlign: "left" })
    .to(".header", 2, { alignItems: "flex-start", justifyContent: "left", paddingLeft: "30px", height: "50px" })
    .to("#headerLogo", 2, { display: "block", opacity: 1 }, "<")
    .to(".title", 2, { color: "#404040" }, "<")
    .to("#aboutLink", 1, {textDecoration: "line-through"}, "<")

    //Work
    .to("#bounds", 4, { borderRadius: "0px", height: "55%",})
    .to(spline, 4, { tension: 3.0 }, "<")
    .to("#workLink", 1, {textDecoration: "line-through"}, "<")

    //Contact
    .to("#bounds", 4, { borderRadius: "8em", width: "16em", height: "16em", x: -200, y: -200, rotation: 45 })
    .to(spline, 4, { tension: 0.0 }, "<")
    .to("#contactLink", 1, {textDecoration: "line-through"}, "<")





//////////////LINKS TO HTML////////////////

const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

if (isTouchDevice() && isMobile) {
    // entryText.innerText = "[ tap to continue ]";
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

document.getElementById("aboutLink").addEventListener("mouseover", function () { gsap.to(spline, { tension: 1.0 }); });
document.getElementById("aboutLink").addEventListener("mouseout", function () { gsap.to(spline, { tension: 1.0 }); });
document.getElementById("workLink").addEventListener("mouseover", function () { gsap.to(spline, { tension: 3.0 }); });
document.getElementById("workLink").addEventListener("mouseout", function () { gsap.to(spline, { tension: 1.0 }); });
document.getElementById("contactLink").addEventListener("mouseover", function () { gsap.to(spline, { tension: 0.0 }); });
document.getElementById("contactLink").addEventListener("mouseout", function () { gsap.to(spline, { tension: 1.0 }); });



function enter() {
    rotateSpeed = 0.03;
    // gsap.to(spline, { tension: 2.0 });
}

function exit() {
    rotateSpeed = 0.01;
    // gsap.to(spline, { tension: 1.0 });
}

function enterClick() {
    entered = true;
    setRotate = false;
    drawPage();
    // bounds.style.display = "none";
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}