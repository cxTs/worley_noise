/**
* @description : implementation of the Worley noise on a html canvas with JS
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 04/06/2020
* @required Draw.js, misc.js, setupe.js, Vector.js
* @param {VOID} none
* @return {VOID}
*
**/

// loading a first img component to initialize the process

let myImgData = ctx.createImageData(width, height);
let data = myImgData.data;

// init random points that will permit the calculus of worley noise
let points = [];
let nbPoints = 30;
for(let i = 0; i < nbPoints; i ++) {
    points.push(new Vector(getRandom(0, width), getRandom(0, height)));
}

/**
* @description : Worley noise algorithm
*
* @param {OBJECT} imgData : a list of pixels with which canvas is drawing
* @param {ARRAY} points : contains randoms point. Amount of points set by nbPoints var
* @return {VOID} :  set imgData with the value obtained with the algorithm
*
**/
function worleyNoise(imgData, points) {
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let distances = [];
            for(let i = 0; i < points.length; i++) {
                let d = Vector.dist(points[i].x, points[i].y, x, y);
                distances.push(d);
            }
            /*
             * n = 0 : cells or bubbles aspect
             * n = 1 : angular or prism aspect
             */
            let n = 0;
            distances.sort(function(a, b) {return a - b;});
            let noise = map(distances[n], 0, width / 8, 0, 255);
            let index = (x + (y * width)) * 4;

            // noise = 255 - noise; // invert noise // 255 is full opacity
            imgData[index] = noise;
            imgData[index + 1] = noise;
            imgData[index + 2] = noise;
            imgData[index + 3] = noise;
        }
    }
}

worleyNoise(data, points);
ctx.putImageData(myImgData, 0, 0);

// random move animation
// need to set the canvas size and nbPoints in regards of compurter performance
/*
function draw() {
    clear();
    for(let i = 0; i < points.length; i++) {
        points[i].randomMove(-2,2);
    }
    worleyNoise(data, points);
    ctx.putImageData(myImgData, 0, 0);
    if(!__paused) {
        window.requestAnimationFrame(draw);
    }

}
window.requestAnimationFrame(draw);
*/
