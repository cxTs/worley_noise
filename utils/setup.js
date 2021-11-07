/**
* @description setup of the canvas html element
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 20/01/2020
* @required Vector.js, Draw.js
* @param {VOID}
* @return {VOID} : nothing returned but 3 const variables set for canvas use
*                   width : contain the width of the canvas (scene) in px
*                   height : contain the height of the canvas (scene) in px
*                   ctx : contain the context object of the canvas (scene) from HTMLCanvasElementPrototype
*
**/

// CANVAS SETUP
const scene = document.querySelector("#canvas");
const scale = window.devicePixelRatio;

const xRatio = scale * 1;
// WHEN USED WITH RANGE CONTROL PANEL
//const xRatio = scale * .85;

const yRatio = scale * 1;
scene.width = document.getElementsByTagName("body")[0].clientWidth * xRatio;
scene.height = document.getElementsByTagName("body")[0].clientHeight * yRatio;
const ctx = scene.getContext('2d');
//canvasSize(1200, 600);
const width = scene.clientWidth;
const height = scene.clientHeight;

// CANVAS SETUP END

/**
* @description : clear the canvas from  (x,y) to (width, height) and cover it with an alpha if alpha given
*
* @param {NUMBER} x [optional]: give the "clear area" starting point value on x axcis, default 0
* @param {NUMBER} y [optional]: give the "clear area" starting point value on y axcis, default 0
* @param {NUMBER} alpha [optional]: value in range [0,1], default 0, will erase canvas on each call
* @return {VOID}
*
**/
function clear(x, y, alpha) {
    let xO = 0;
    let yO = 0;
    if( x != null && y != null) {
        xO = x;
        yO = y;
    }
    if(alpha != null) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
        ctx.fillRect(xO, yO, width, height);
        ctx.restore();
    } else {
        ctx.clearRect(xO, yO, width, height);
    }

}

/**
* @description : draw an orthonormal on the canvas with translation to the center, for dev purposes
*
* @param {OBJECT} ctx : context object from the HTMLCanvasElementPrototype
* @return {VOID}
*
**/
function orthonormal(ctx) {
    ctx.translate(width / 2, height / 2);
    let n = new Vector(0, height / 2);
    let s = new Vector(0, -height / 2);
    let w = new Vector(-width / 2, 0);
    let e = new Vector(width / 2, 0);
    Draw.line(ctx, n, s);
    Draw.line(ctx, w, e);
}

/**
* @description : draw an orthonormal on the canvas, for dev purposes
*
* @param {OBJECT} ctx : context object from the HTMLCanvasElementPrototype
* @return {VOID}
*
**/
function orthonormalWithoutTranslation(ctx) {
    let n = new Vector(width / 2, 0);
    let s = new Vector(width / 2, height);
    let w = new Vector(0, height / 2);
    let e = new Vector(width, height / 2);
    Draw.line(ctx, n, s);
    Draw.line(ctx, w, e);
}

/**
* @description : reset the size of canvas element
*
* @param {NUMBER} width : desired width (in px)
* @param {NUMBER} height : desired height (in px)
* @return {VOID}
*
**/
function canvasSize(width, height) {
    if(width) {
        ctx.canvas.width = width;
        ctx.canvas.height = height || width;
    }
}


/**
* @description : Stop or play animation on pressing "p" or space key
*                you have to surround `window.resquestAnimationFrame(draw)` in script draw function
*                with  an if(!__paused) statement
*
* @param {EVENT} event : event triggered by user on keyboard
* @return {VOID}
*
**/
let __paused = false;
document.onkeydown = function(event) {
    if(event.key == "p" || event.key == " ") {
        if(__paused) {
            console.log(" ▶️ "," Animation play");
        }
        // invert the __pause value
        __paused = !__paused;
        if(!__paused) {
            window.requestAnimationFrame(draw);
        } else {
            console.log(" ⏸️ "," Animation paused");
        }
    }
}


// RANGES SETTING

var slideNum = 0; // handle multiple sliders creation
/**
* @description create a screen bottom slider (html <input type='range'[...]/>) for live animation tunning
*
* @param {NUMBER} min : minimun value of the slider
* @param {NUMBER} max : maximum value of the slider
* @param {NUMBER} step : value of increment from min to max
* @param {STRING} id [optional] : value of the id tag in html <input> element, auto generated if not given
* @return {OBJECT} return a slider from which you can get current value
* with {yourSliderName}.getValue() ( WARN : returned value's type is {STRING})
*
**/
function slider(min, max, step, id) {
    this.id = id || `slider_${slideNum}`;
    slideNum++;
    // range config
    this.range = document.createElement("INPUT");
    this.range.id = this.id;
    this.range.name = this.range.id;
    this.range.type = "range";
    this.range.min = min;
    this.range.max = max;
    this.range.step = step;
    this.range.value = min; // put cursor on page load at min value
    this.currentValue = this.range.value; // set the first occurence of currentValue;
    // label config
    this.label = document.createElement("LABEL");
    this.label.for = this.range.name;
    this.label.innerHTML = ` : ${this.currentValue} on ${this.range.id} value`;
    // appends elem to the dom
    document.body.appendChild(this.range);
    document.body.appendChild(this.label);
    // listening to the change
    this.range.addEventListener("change", (evt) => {
        this.currentValue = evt.target.value;
        this.label.innerHTML = ` : ${this.currentValue} on ${this.range.id} value`;
    });
    // getting current value from the object slider
    this.getValue = function() {
        return this.currentValue;
    }
}
