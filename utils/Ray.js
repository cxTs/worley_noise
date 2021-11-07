/**
* @description : description
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date DATE
* @required REQUIRED CLASSES
* @param {OBJECT} origin : is an object Vector representing the start of the ray, i.e the center of the light object
* @param {NUMBER} length : is indicative, for the purpose of the calculation of the real length based on Al-Kashi theorem.
*                          it's a kind of "base" radius of the light with a 0 angle and a given length,
*                          all the rays created will turned// around their origin point compared to this start radius.
*
* @param {NUMBER}} angle : make possible the orientation of the ray compared to its center and the indicative initial length
* @param {STRING} color : is the color off the ray in CSS format, default value on "#FFFFFF33"
* @param {NUMBER} linewidth : the thickness of the ray , default value on 1;
* @return {VOID}
*
**/
class Ray {
    origin;
    length;
    angle;
    color;
    lineWidth;
    end;
    referenceRay;
    checkedPt = [];
    closestPt = null;

    constructor(origin, length, angle, color, lineWidth) {
        this.origin = origin;
        this.length = length;
        this.angle = angle;
        this.end = this.findEnd();
        this.color = color || "#FFFFFF06";
        this.lineWidth = lineWidth || 1;
    }
}

// PROTOS //

// draw ray object on the canvas
Ray.prototype.show = function() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
    ctx.closePath();
}

// find the end point of the ray based on the angle and the init length value
Ray.prototype.findEnd = function() {
    let x = (Math.cos(this.angle) * this.length) + this.origin.x;
    let y = (Math.sin(this.angle) * this.length) + this.origin.y;
    return new Vector(x, y);
}

// update the origin off the ray and its end point
Ray.prototype.move = function(newOrigin) {
    // move ray origin
    this.origin = newOrigin;
    // update the end point compared to the new origin
    this.end = this.findEnd();
}


// THE VERY FUNNY PARTS !!
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection

// check for the intersection of a ray and the walls of the array passed in argument
Ray.prototype.touch = function(walls) {
    // the log that contains all the intersections points (in case of several wall are crossed by the ray)
    // and so permit to choose which one is the nearest and draw the ray the right length.
    // (you could have for example another wall behind the first touched by the ray and the algorythm detect him too)
    let intersectPt = [];
    for(let i = 0; i<walls.length; i++) {
        // working to get t and u
        // realocating needed value in "formula like" vars names for more convinience in the read of the algorythm

        // for wall
        const x1 = walls[i].origin.x;
        const y1 = walls[i].origin.y;
        const x2 = walls[i].end.x;
        const y2 = walls[i].end.y;

        // for ray
        const x3 = this.origin.x;
        const y3 = this.origin.y;
        const x4 = this.end.x;
        const y4 = this.end.y;


        // denominator calculation (common to t and u)
        const den = ( ((x1-x2) * (y3-y4)) - ((y1-y2) * (x3-x4)) );
        // if den == 0, line are parallels so we stop the check, no intersection possible

        // if not, there's an intersection point so, let's go on
        if(den != 0) {

            const t = ( ((x1-x3) * (y3-y4)) - ((y1-y3) * (x3-x4)) ) / den;

            const u = - (( ((x1-x2) * (y1-y3)) - ((y1-y2) * (x1-x3)) ) / den);

            /* IF 0 < t < 1 AND u > 0
            * there's a change for the value u in regards of the original formula
            * ray is a light with a source, so no need to check for an intersection before the ray origin
            * THANK'S TO Daniel Shiffman for this point!
            * https://www.youtube.com/user/shiffman
            */

            // if true the lines (ray and wall) intersect
            if(t > 0 && t < 1 && u > 0) {
                // calculation of x value from t value
                let ptX = x1 + (t * (x2 - x1));

                // calculation of y value from t value
                let ptY = y1 + (t * (y2 - y1));

                let pt = new Vector(ptX,ptY);

                // add this new point to the log
                intersectPt.push(pt);
            }

            // checking for the nearest wall
            for(let j = 0; j<intersectPt.length; j++) {
                if(this.closestPt == null) {
                    // init of closestPt with the first value of checkedPt for the begining of comparison
                    // with the next value
                    this.closestPt = intersectPt[0];
                } else {
                    // else the first value have been had so we can compare it with the others values

                    // calculation of the distance between the origin and the current closestPt
                    let a = this.origin.distanceFrom(this.closestPt);

                    // calculation of the distance between pos the cuurent checkedPt value
                    let b = this.origin.distanceFrom(intersectPt[j]);
                    // if b < a , current checkedPt value replace current closestPt value
                    if(a > b) {
                        this.closestPt = intersectPt[j]
                    }
                }
            }
            // update of dir point for the calculation of the redraw of ray
            if(this.closestPt != null) {
                this.end.move(this.closestPt.x, this.closestPt.y);

                // length update of ray
                this.length = this.origin.distanceFrom(this.end);
            }

            // re-init closestPt to null for the next check,
            // otherwise, no more checking are possible
            this.closestPt = null;
        }
    }
}
