/**
* @description : Light class. Simulate a light with ray of light from Ray.js class
*                Light source at the center is managed by an Vector object
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 24/01/2020
* @required Vector.js, Ray.js
* @param {NUMBER} x : value of x position (light source)
* @param {NUMBER} y : value of y position (light source)
* @param {NUMBER} nbRay : amount of ray that light gonna throw
* @param {NUMBER} radius : radius has to be init for the first ray calculus
* @param {STRING} color : css formated color
* @return {VOID}
*
**/
class Light {
    context = document.getElementById("canvas").getContext('2d');
    center;
    nbRay;
    rays = [];
    angle;
    radius; // fixed radius value for the purpose of each ray rotation angle calculus
    color;
    arcSize = Math.PI * 2;

    // args : x et y for the center position (light source) et nbRay for the number of ray that light gonna throw
    //  and then the color of the light (the rays)
    constructor(x, y, nbRay, radius, color) {
        this.center = new Vector(x, y);
        this.nbRay = nbRay;
        this.angle = this.arcSize / this.nbRay;
        this.radius = radius;
        this.color = color;
        this.populateRays();
    }
}

// PROTO //

// populate the rays array with this.nbRay value
Light.prototype.populateRays = function() {
    let angle = 0;
    for(let i = 0; i < this.nbRay; i++) {
        this.rays.push(new Ray(this.center, this.radius, angle, this.color, 1))
        // angle is incremented on each loop for the calculus of each ray end vector
        angle += this.arcSize / this.nbRay;
    }
}

// drawing each rays of the light
Light.prototype.show  = function() {
    for(let ray of this.rays) {
        ctx.save();
        ray.show();
        ctx.restore();
    }
}

// ray checking for the intersection with each walls of the wall array passed in argument
Light.prototype.touch = function(walls) {
    for(let ray of this.rays) {
        ray.touch(walls);
    }
}

// make the light follow the mouse when it's moved and updating ray lengths and positions
Light.prototype.follow = function(e, walls) {
    let x = e.clientX;
    let y = e.clientY;
    this.center.move(x, y);
    for(let ray of this.rays) {
        ray.move(this.center);
        ray.touch(walls);
        ray.show();
    }
}

// make the light follow the mouse when it's moved and updating ray lengths and positions
Light.prototype.move = function(vector, walls = null) {
    let x = vector.x;
    let y = vector.y;
    this.center.move(x, y);
    for(let ray of this.rays) {
        ray.move(this.center);
        if(walls !== null) ray.touch(walls);
        ray.show();
    }
}
