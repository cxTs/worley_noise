function Arrow(pos, vel, size) {
    // the center or zero reference, on which arrow is based
    this.center = pos;
    // the velocity of the vehicle
    this.vel = vel;
    // the apex of the arrow which give the direction
    this.arrowhead = new Vector();
    this.size = size;
    // the angle of the velocity vector depeding of the cos axcis of the trigo circle
    this.velAngle = 0;
    // the 2 "wings" of the arrow
    this.w1 = new Vector();
    this.w2 = new Vector();
    // the angle to sum with the velocity angle to give the arrow its shape
    this.angleForArrowShape = Math.PI * .5;//Math.PI * 1.2;


    // args passed to allow the update of the arrow direction
    Arrow.prototype.update = function(pos, vel) {
        // change the shape of the arrow depending on the velocity magnitude
        let factor = vel.mag() / 20;
        // avoiding unwanted arrow shape
        factor = (factor > 1) ? 1 : factor;


        this.center = pos;
        this.vel = vel;

        // reset the arrowhead to (0,0) avoiding its constant growing
        this.arrowhead.mult(0);



        this.arrowhead.add(this.vel);
        this.arrowhead.norm();
        this.arrowhead.mult(this.size);

        // setting arrowhead to be visible on the canvas and displaying it int the right place
        this.arrowhead.add(this.center);

        // getting velocity angle to apply it to arrowhead
        this.velAngle = this.vel.angleFromCosAxcis();

        // reset w1 position
        this.w1.mult(0);
        // making w1 position the same as arrowhead
        this.w1.add(this.arrowhead);
        // then rotate w1 around the raaow center from its position
        this.w1.rotateAround(this.center, (this.velAngle + (this.angleForArrowShape + factor)));
        this.w2.mult(0);
        this.w2.add(this.arrowhead);
        this.w2.rotateAround(this.center, (this.velAngle + (-this.angleForArrowShape - factor)));
    }

    // first update at the init of the arrow
    this.update(this.center, this.vel);


    // Arrow.prototype.display = function(ctx, filled, stroked, color) {
    //     this.arrowhead.arrowFrom(ctx, this.w1);
    //     this.arrowhead.arrowFrom(ctx, this.w2);
    //     this.w1.arrowFrom(ctx, this.center);
    //     this.w2.arrowFrom(ctx, this.center);
    //     // DEBUG:
    //     // this.arrowhead.display(ctx, 5, true, false, "#F00");
    //     // this.w1.display(ctx, 5, true, false, "#F0F");
    //     // this.w2.display(ctx, 5, true, false, "#0F0");
    //     // this.center.display(ctx, 5);
    //     // END DEBUG
    //
    // }

    Arrow.prototype.display = function(ctx, fill, stroke, color) {
        let _fill = (fill == false) ? fill : true;
        let _stroke = (stroke == true) ? stroke : false;
        let _color = color || null;
        ctx.beginPath();
        ctx.moveTo(this.arrowhead.x, this.arrowhead.y);
        ctx.lineTo(this.w1.x, this.w1.y);
        ctx.lineTo(this.center.x, this.center.y);
        ctx.lineTo(this.w2.x, this.w2.y);
        if(_color != null) {
            ctx.save();
            ctx.fillStyle = _color;
            ctx.strokeStyle = _color;
        }
        if(_fill) {
            ctx.fill();
        }
        if(_stroke) {
            ctx.stroke();
        }
        ctx.closePath();

        if(_color != null) ctx.restore();

    }
}
