/**
* @description : Arrow class. Draw an arrow pointing to the velocity direction of the object in which
*                you create it. Geometry of the arrow change with the value of the velocity
*                after creation of the arrow object, make sure that each update of your moving object
*                is transmitted to Arrow.update, and then display it with Arrow.display
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 23/09/2020
* @required Vector.js, Draw.js,
* @param {OBJECT} location : Vector object that old the location of the moving object
* @param {OBJECT} velocity : Vector object that old the velocity of the moving object
* @param {NUMBER} size : Size of the arrow
* @return {VOID} :  Draw an arrow pointing to the direction where the object moves
*
**/
function Arrow(location, velocity, size) {
    // the center or zero reference, on which arrow is based
    this.center = location;
    // the velocity of the vehicle
    this.vel = velocity;
    // the apex of the arrow which give the direction
    this.arrowhead = new Vector();
    this.size = size;
    // the angle of the velocity vector depeding of the cos axcis of the trigo circle
    this.velAngle = 0;
    // the 2 "wings" of the arrow
    this.w1;
    this.w2;
    // the angle to sum with the velocity angle to give the arrow its shape
    this.angleForArrowShape = Math.PI * .5;//Math.PI * 1.2;


    // args passed to allow the update of the arrow direction
    Arrow.prototype.update = function(location, velocity) {
        // change the shape of the arrow depending on the velocity magnitude
        let factor = velocity.mag() / 10;

        // avoiding unwanted arrow shape
        factor = (factor > 1.3) ? 1.3 : factor;

        // TEST for constant flying movement
        //this.angleForArrowShape += factor;
        // TEST END

        this.center = location;
        this.vel = velocity;

        // reset the arrowhead to (0,0) avoiding its constant growing
        this.arrowhead.mult(0);

        // getting velocity angle to apply it to arrowhead
        this.velAngle = this.vel.angle();
        this.arrowhead.add(this.vel);
        this.arrowhead.norm();
        this.arrowhead.mult(this.size);

        // setting arrowhead to be visible on the canvas and displaying it int the right place
        this.arrowhead.add(this.center);

        // creating wings of the arrow from the velocity angle
        this.w1 = Vector.fromAngle(this.velAngle);
        this.w2 = Vector.fromAngle(-this.velAngle);

        // applying rotation to put the wings in the right place
        this.w1.rotate(this.velAngle - (this.angleForArrowShape + factor));
        this.w2.rotate(this.velAngle + (this.angleForArrowShape  + factor));

        // setting wings to be visible on the canvas and displaying it at the right place
        this.w1.mult(this.size);
        this.w1.add(this.center);
        this.w2.mult(this.size);
        this.w2.add(this.center);
    }

    // first update at the init of the arrow
    this.update(this.center, this.vel);

    Arrow.prototype.display = function(ctx) {
        this.arrowhead.arrowFrom(ctx, this.w1);
        this.arrowhead.arrowFrom(ctx, this.w2);
        this.w1.arrowFrom(ctx, this.center);
        this.w2.arrowFrom(ctx, this.center);
    }

    Arrow.prototype.displayColored = function(ctx, color) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.arrowhead.x, this.arrowhead.y);
        ctx.lineTo(this.w1.x, this.w1.y);
        ctx.lineTo(this.center.x, this.center.y);
        ctx.lineTo(this.w2.x, this.w2.y);
        ctx.fillStyle = color || "#000";
        ctx.fill();
        ctx.restore();
    }
}
