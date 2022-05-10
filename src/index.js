
import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

const testImage = new URL('./assets/images/testImage.jpg', import.meta.url);
const image0 = new URL('./assets/images/ringCoverImage.png', import.meta.url);
const image1 = new URL('./assets/images/goPlayCoverImage.png', import.meta.url);
const image2 = new URL('./assets/images/anomalyCoverImage.png', import.meta.url);
const image3 = new URL('./assets/images/testImage.jpg', import.meta.url);

const date = new Date();
document.getElementById("currentYear").innerHTML = date.getFullYear();



let line, lineShadow, renderer, scene, camera, composer;
let matLine, shadowLine;

const points = [];
const pointNumber = 15;
const geometry = new LineGeometry();
const shadowGeometry = new LineGeometry();
const splineWidth = 6;
var setRotate = true;
var entered = false;

//Main shape div with control effects
var bounds = document.getElementById("bounds");

gsap.set("#bounds", {
    position: "fixed",
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
});

gsap.set(".about", {
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
});

gsap.set(".shape", {
    position: "fixed",
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
});

gsap.set(".icon", {
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
});

gsap.set("footer", {
    xPercent: -50,
    yPercent: -50,
})


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
        points.push(new THREE.Vector3(gsap.utils.random(-splineWidth, splineWidth), gsap.utils.random(-splineWidth, splineWidth), gsap.utils.random(-splineWidth, splineWidth)));
    }


    matLine = new LineMaterial({
        color: 0x404040,
        linewidth: 0.18,
        // in world units with size attenuation, pixels otherwise
        worldUnits: true,
        dashed: false,
        // alphaToCoverage: true,
    });

    shadowLine = new LineMaterial({
        color: 0xd1d1d1,
        linewidth: 0.25,
        // in world units with size attenuation, pixels otherwise
        worldUnits: true,
        dashed: false,
        // alphaToCoverage: true,
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
                x: gsap.utils.random(-splineWidth, splineWidth),
                y: gsap.utils.random(-splineWidth, splineWidth),
                z: gsap.utils.random(-splineWidth, splineWidth),
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
        { x: -48, y: -13, z: 0 },
        { x: -36, y: -13, z: 0 },
        { x: -30, y: -13, z: 0 },
        { x: -24, y: -13, z: 0 },
        { x: -18, y: -13, z: 0 },
        { x: -12, y: -13, z: 0 },
        { x: -6, y: -13, z: 0 },
        { x: -0, y: -13, z: 0 },
        { x: 6, y: -13, z: 0 },
        { x: 12, y: -13, z: 0 },
        { x: 18, y: -13, z: 0 },
        { x: 24, y: -13, z: 0 },
        { x: 36, y: -13, z: 0 },
        { x: 48, y: -13, z: 0 },
        { x: 54, y: -13, z: 0 },
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
    // bounds.style.width = (window.innerHeight * boundHeight).toString() + "px";

    //Adjust scene to window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    insetWidth = window.innerHeight / 4;
    insetHeight = window.innerHeight / 4;
    gsap.set("#bounds", { width: () => (window.innerHeight * 0.13).toString() + "px", height: "13%" });
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

    // Data for moving elements with three camera
    // // tempV.set(spline.position);
    // tempV.project(camera);

    // // Convert the normalized position to CSS coordinates
    // const x = (tempV.x * .5 + .5) * window.innerWidth;
    // const y = (tempV.y * -.5 + .5) * window.innerHeight;

    // // Move elements with camera to center
    // bounds.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

}


//Paralax
window.addEventListener("mousemove", e => {
    //Smooth move
    if (!entered) {
        // gsap.to(scene.position, { x: () => (e.pageX - window.innerWidth / 2) * (0.001), y: () => (e.pageY - window.innerHeight / 2) * (-0.001) });
    }
});

////////////SCROLL TRIGGERS/////////////////

let mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "4000",
        scrub: 1,
        snap: {
            snapTo: "labelsDirectional", // snap to the closest label in the timeline in the direction of scroll
            duration: { min: 0.2, max: 1, inertia: false }, // the snap animation should be at least 1 second, but no more than 2 seconds
            ease: "power1.inOut"
        },
        pinSpacing: false,
        // markers: true,
        invalidateOnRefresh: true,
    },
});

// let contentTl = gsap.timeline({
//     scrollTrigger: {
//         pinType: "fixed",

//         horizontal: true,
//         scroller: "#contentContainer",
//         trigger: "#contentInner",
//         start: "top top",
//         end: "bottom bottom",
//         pin: true,
//         scrub: 3,
//         snap: {
//             snapTo: "labelsDirectional", 
//             duration: { min: 0.2, max: 1 },
//             ease: "power1.inOut"
//         },
//         markers: true,
//         fastScrollEnd: true,
//         invalidateOnRefresh: true
//     },
// });

mainTl
    .addLabel("start")

    //About
    .to(".title", 3,
        { color: "rgba(0,0,0,0)" })
    .fromTo(".title", 0.5,
        { fontSize: "20vh", fontWeight: "100", textAlign: "center" }, { fontSize: "30px", fontWeight: "400", textAlign: "left" })
    .to(".header", 2,
        { alignItems: "flex-start", justifyContent: "left", paddingLeft: "30px", height: "50px" })
    .to("#headerLogo", 2,
        { display: "block", opacity: 1 }, "<")
    .to(".title", 2,
        { color: "#404040" }, "<")
    .to("#aboutLink", 2,
        { textDecoration: "line-through" }, "<")
    .fromTo("#aboutHeader", 2,
        { display: "block", x: -100, y: -160 },
        { x: -80, opacity: 1 })
    .fromTo("#aboutHeader2", 2,
        { display: "block", x: 100, y: 120 },
        { x: 80, opacity: 1 }, "<50%")
    .addLabel("about")


    //Work
    .delay(8)
    .to("#aboutHeader", 2,
        { opacity: 0, x: -100, display: "none" })
    .to("#aboutHeader2", 2,
        { opacity: 0, x: 100, display: "none" }, "<50%")
    .fromTo("#bounds", 1,
        { width: () => (window.innerHeight * 0.13).toString() + "px", height: "13%" },
        { borderRadius: "0px", width: "10rem", height: "55%", opacity: 0 })
    .fromTo("#shape0", 1,
        { backgroundImage: "url(" + image0.href + ")", width: () => (window.innerHeight * 0.13).toString() + "px", height: "13%", opacity: 0 },
        { borderRadius: "0px", width: "10rem", height: "55%", opacity: 1 }, "<")
    .fromTo("#shape1", 2,
        { backgroundImage: "url(" + image1.href + ")", borderRadius: "5px", width: "0rem", height: "50%", opacity: 1, x: 180, y: 0 },
        { borderRadius: "0px", width: "8rem", x: 180, y: 0 }, "<70%")
    .to("#shape2",
        { backgroundImage: "url(" + image2.href + ")", borderRadius: "0px", width: "6rem", height: "45%", opacity: 0, x: 0, y: 0 }, "<")
    .fromTo("#shape3", 2,
        { backgroundImage: "url(" + image3.href + ")", borderRadius: "5px", width: "0rem", height: "50%", opacity: 1, x: -180, y: 0 },
        { borderRadius: "0px", width: "8rem", x: -180, y: 0 }, "<")
    .to(spline, 4, { tension: 3.0 }, "<")
    .to("#workLink", 4, { textDecoration: "line-through" }, "<")
    .set("#bounds", { display: "none" })
    .addLabel("work")
    //show 1
    .to("#shape1", 4,
        { width: "10rem", height: "55%", opacity: 1, x: 0, y: 0 })
    .to("#shape2", 4,
        { width: "8rem", height: "50%", opacity: 1, x: 180, y: 0 }
        , "<")
    .to("#shape3", 4,
        { width: "6rem", height: "45%", opacity: 0, x: 0, y: 0 }
        , "<")
    .to("#shape0", 4,
        { width: "8rem", height: "50%", opacity: 1, x: -180, y: 0 }
        , "<")
    .addLabel("work1")
    //show 2
    .to("#shape2", 4,
        { width: "10rem", height: "55%", opacity: 1, x: 0, y: 0 })
    .to("#shape3", 4,
        { width: "8rem", height: "50%", opacity: 1, x: 180, y: 0 }
        , "<")
    .to("#shape0", 4,
        { width: "6rem", height: "45%", opacity: 0, x: 0, y: 0 }
        , "<")
    .to("#shape1", 4,
        { width: "8rem", height: "50%", opacity: 1, x: -180, y: 0 }
        , "<")
    .addLabel("work2")
    //show 3
    .to("#shape3", 4,
        { width: "10rem", height: "55%", opacity: 1, x: 0, y: 0 })
    .to("#shape0", 4,
        { width: "8rem", height: "50%", opacity: 1, x: 180, y: 0 }
        , "<")
    .to("#shape1", 4,
        { width: "6rem", height: "45%", opacity: 0, x: 0, y: 0 }
        , "<")
    .to("#shape2", 4,
        { width: "8rem", height: "50%", opacity: 1, x: -180, y: 0 }
        , "<")
    .addLabel("work3")
    //end
    .to("#shape0", 2,
        { width: "0rem", height: "50%", opacity: 1, x: 180, y: 0 })
    .to("#shape1", 2,
        { width: "0rem", height: "50%", x: 0, y: 0 }
        , "<")
    .to("#shape2", 2,
        { width: "0rem", height: "50%", x: -180, y: 0 }
        , "<")
    .set("#bounds", { display: "block" })


    //Contact
    .to("#shape3", 2,
        { borderRadius: "6rem", width: "12rem", height: "12rem", opacity: 0, x: -80, y: -80, rotation: 45 })
    .to(bounds, 2,
        { borderRadius: "6rem", width: "12rem", height: "12rem", opacity: 1, x: -80, y: -80, rotation: 45 }, "<")
    .to(spline, 4, { tension: 0.0 }, "<")
    .to("#contactLink", 4, { textDecoration: "line-through" }, "<")
    .to("footer", 2,
        { display: "block", opacity: 1 }, "<")
    .fromTo("#email", 2,
        { width: "7rem", opacity: 0, x: 70, y: -5 },
        { display: "block", opacity: 1, x: 100, y: -5 }, "<")
    .fromTo("#linkedIn", 2,
        { width: "0rem", x: 80, y: -100 },
        { display: "block", width: "2.5rem" }, "<25%")
    .fromTo("#github", 2,
        { width: "0rem", x: -20, y: 80 },
        { display: "block", width: "4rem" }, "<25%")

    .addLabel("contact")









//////////////LINKS TO HTML////////////////

const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

// if (isTouchDevice() && isMobile) {
//     // entryText.innerText = "[ tap to continue ]";
// }

// window.addEventListener("keypress", e => {
//     //allow for keypress entry
//     if (!entered) {
//         enterClick();
//     }
// });

// window.addEventListener("click", e => {
//     //allow for fullscreen click entry
//     if (!entered) {
//         enterClick();
//         // function() {
//         // var pos = mainTl.start + (mainTl.end - mainTl.start) *);
//         console.log(mainTl.labels.work2 / mainTl.duration() * 3000 - 50);
//         // mainTl.tweenFromTo("start", "work2");
//         // gsap.to(window, {scrollTo: mainTl.labels.work2 / mainTl.duration() * 3000 -10, duration: 1});
//         // }
//     }
// });

let previous;
let scrollPos;
let enabled = true;

document.getElementById("aboutLink").addEventListener("click", e => {
    previous = scrollPos;
    scrollPos = Math.floor(mainTl.labels.about / mainTl.duration() * (4000));
    if (scrollPos != previous) {
        gsap.to(window, { scrollTo: () => scrollPos });
    };
})

document.getElementById("workLink").addEventListener("click", e => {
    previous = scrollPos;
    scrollPos = Math.floor(mainTl.labels.work / mainTl.duration() * (4000));
    if (scrollPos != previous) {
        gsap.to(window, { scrollTo: () => scrollPos });
    };
})

document.getElementById("contactLink").addEventListener("click", e => {
    previous = scrollPos;
    scrollPos = Math.floor(mainTl.labels.contact / mainTl.duration() * (4000));
    if (scrollPos != previous) {
        gsap.to(window, { scrollTo: () => scrollPos });
    };
})

let shapes = document.getElementsByClassName("shape");

for (let i = 0; i < shapes.length; i++) {
    shapes[i].addEventListener("click", e => {
        enterClick();
        if (enabled) {
            mainTl.scrollTrigger.disable(false, false);
            gsap.to(shapes[i], 1, { width: "100%", height: "55%", maxWidth: "600px", x: 0, y: 0, zIndex: 999 })
            enabled = false;
        } else {
            mainTl.scrollTrigger.enable();
            getNewPosition();
        }
    })
}

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
}

function exit() {
    rotateSpeed = 0.01;
}

function enterClick() {
    entered = true;
    setRotate = false;
    drawPage();
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}