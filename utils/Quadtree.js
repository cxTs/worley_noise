/**
* @description : optimisation of the communication and relation between object that have to be aware of their
*                neighbors. Ex: if 100 cells are on screen and have to maintain a distance from another cells
*                quadtree avoid a cell to check cell at the other side of the canvas and not in its neighbors
*                it's save a lot of memery consumming
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 23/09/2020
* @required Vector.js
* @return {OBJECT} a quadtree object
*
**/

// POINT CLASS PART

/**
* @description : class Point. point are the location vector of whatever have to insert in the quadtree
*
* @param {NUMBER} x : the x value of the loc vector of the object to "check"
* @param {NUMBER} y : the y value of the loc vector of the object to "check"
* @return {OBJECT} : a Vector object that have the same coordinate as the loc Vector of the object to "check"
*
**/
class Point {
    location;
    constructor(x, y) {
        this.location = new Vector(x, y);
    }
}



// RECTANGLE CLASS PART

/**
* @description : class Rectangle, rectangle is the base tile of the quadtree
*
* @param {NUMBER} x : x pos of the origin of the first rectangle of quadtree
* @param {NUMBER} y : y pos of the origin of the first rectangle of quadtree
* @param {NUMBER} w : width of the rectangle
* @param {NUMBER} h : height of the rectangle
* @return {OBJECT} : a rectangle (i.e a subdivision of the quadtree)
*
**/
class Rectangle {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w || x; // case x is the canvas center and Rectangle is the whole canvas
        this.h = h || y; // case y is the canvas center and Rectangle is the whole canvas
    }
}

// RECTANGLE PROTO //

// return true if the given point is contained by the Rectangle
Rectangle.prototype.contains = function(point) {
    let x = point.location.x;
    let y = point.location.y;
    return (x >= (this.x - this.w) &&
            x <= (this.x + this.w) &&
            y >= (this.y - this.h) &&
            y <= (this.y + this.h));
}

// intersection algorythm for rectangular range OR circular range
Rectangle.prototype.intersects = function(range) {
    let w;
    let h;
    // for circular range case
    if(range.size) {
        // size is the radius of a circle in this case
        range.w = range.size;
        range.h = w;
    }
    return !(
        this.x + this.w < range.x - range.w ||
        this.x - this.w > range.x + range.w ||
        this.y + this.h < range.y - range.h ||
        this.y - this.h > range.y + range.h
    );
}

Rectangle.prototype.display = function(ctx, color = "#0F0") {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.strokeRect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
    ctx.restore();
}

/**
* @description : QUADTREE CLASS PART
*
* @param {OBJECT} rectangle : Rectangle object (see precedent class in this file).
*                             rectangle is often the whole canvas scene
* @param {Number} n : n is the maximum object holded by a division of the quadtree without subdivising itself
* @param {TYPE} NAME :
* @return {VOID}
*
**/
class Quadtree {
    boundary;
    capacity;
    points;
    divided;

    constructor(rectangle, n) {
        this.boundary = rectangle;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }
}

// QUADTREE PROTO //
// CORE PRINCIPLE, SUBDIVISION OF THE TREE

Quadtree.prototype.subdivide = function() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let ne = new Rectangle(x + (w / 2), y - (h / 2), w / 2, h / 2);
    this.northeast = new Quadtree(ne, this.capacity, "#F00");
    let nw = new Rectangle(x - (w / 2), y - (h / 2), w / 2, h / 2);
    this.northwest = new Quadtree(nw, this.capacity, "#FF0");
    let se = new Rectangle(x + (w / 2), y + (h / 2), w / 2, h / 2);
    this.southeast = new Quadtree(se, this.capacity, "#0FF");
    let sw = new Rectangle(x - (w / 2), y + (h / 2), w / 2, h / 2);
    this.southwest = new Quadtree(sw, this.capacity, "#00F");
    this.divided = true;
}

// INSERTION OF "THING" (location coordinates) IN THE QUADTREE points array
Quadtree.prototype.insert = function(point) {
    if(!this.boundary.contains(point)) {
        return false;
    }
    if(this.points.length < this.capacity) {
        this.points.push(point);
        return true;
    } else {
        if(!this.divided) {
            this.subdivide();
        }
        if(this.northeast.insert(point)) {
            //this.northeast.display(ctx);
            return true;
        } else if(this.northwest.insert(point)) {
            //this.northwest.display(ctx);
            return true;
        } else if(this.southeast.insert(point)) {
            //this.southeast.display(ctx);
            return true;
        } else if(this.southwest.insert(point)) {
            //this.southwest.display(ctx);
            return true;
        }
    }
    //this.display(ctx);
}

// return the points found in a certain location (range)
// FIRST CALL HAVE found = null
// found non-null in the recursive part
Quadtree.prototype.query = function(range, found) {
    if(found == null) {
        found = [];
    }
    if(!this.boundary.intersects(range)) {
        // return; // OFF for the following test section
        // test start
        // for the case scene is bigger than first boundary of the quadtree
        return found;
        // test end
    } else {
        for(let p of this.points) {
            if(range.contains(p))
                found.push(p);
        }
        if(this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }
    }
    return found;
}

// DISPLAY
Quadtree.prototype.display = function(ctx) {
    // for(let p of this.points) {
    //     p.location.display(ctx, 2, true, false, "#F60");
    // }
    this.boundary.display(ctx);
    if(this.divided) {
        this.northeast.display(ctx);
        this.northwest.display(ctx);
        this.southeast.display(ctx);
        this.southwest.display(ctx);
    }
}
