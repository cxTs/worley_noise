// SETUP

let myImgData = ctx.createImageData(width, height);
let data = myImgData.data;

// DISPLAY IMAGE DATA
ctx.putImageData(myImgData, 0, 0);



// TV NOISE
// changing values of each pixels color (grayscale)
function tvNoise(imgData) {
    for(let i = 0; i < imgData.length; i += 4) {
        let c = getRandom(0, 255);
        imgData[i] = c;
        imgData[i + 1] = c;
        imgData[i + 2] = c;
        imgData[i + 3] = 255;
    }
}


// WORLEY NOISE
// need an array of random vectors placed on the canvas

// array of points setup
let points = [];
let nbPoints = 15;

for(let i = 0; i < nbPoints; i ++) {
    points.push(new Vector(getRandom(0, width), getRandom(0, height)));
}

function worleyNoise(imgData, points) {
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let distances = [];
            for(let i = 0; i < points.length; i++) {
                let d = Vector.dist(points[i].x, points[i].y, x, y);
                distances.push(d);
            }
            let n = 0;
            distances.sort(function(a, b) {return a - b;});
            let noise = map(distances[n], 0, width / 2, 0, 255);
            let index = (x + (y * width)) * 4;
            imgData[index] = noise;
            imgData[index + 1] = noise;
            imgData[index + 2] = noise;
            imgData[index + 3] = 255;
        }
    }
}

// AFTER noise function call, don't forget to call
ctx.putImageData(myImgData, 0, 0);
