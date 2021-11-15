class Vehicle {
    location;
    velocity;
    acceleration;
    size;
    maxSpeed;
    maxForce;
    arrivingZone;
    avoidingZone;
    avoidSpeed;
    neighborZone;
    color = "rgba(127, 127, 127, .8)";


    constructor(x, y, size) {
        this.location = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.maxSpeed = 0;
        this.maxForce = 0;
        this.avoidSpeed = 0;
        this.size = size;
        this.avoidingZone = this.size * 2;
        this.arrivingZone = this.size * 2;
        this.neighborZone = this.size * 5;
    }
}

// PROTO //


// DISPLAYING
Vehicle.prototype.display = function(ctx) {
    // currently display a circle with velocity direction
    ctx.save();
    ctx.fillStyle = this.color;
    //this.showZone(ctx, this.arrivingZone);
    this.location.display(ctx, this.size / 2);
    ctx.restore();
    // option for debugging
    // this.showVelocity(ctx);
}

// show the velocity vector as a red colored normalized vector
Vehicle.prototype.showVelocity = function(ctx) {
    let v =  new Vector(this.velocity.x, this.velocity.y);
    v.normalize();
    v.mult(this.size / 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.location.x, this.location.y);
    ctx.lineTo(this.location.x + v.x , this.location.y + v.y);
    ctx.strokeStyle = "#F00";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

Vehicle.prototype.changeColor = function() {
    if(this.velocity.x > 0 && this.velocity.y > 0)
        this.color = "rgba(200, 127, 127, .5)";
    if(this.velocity.x <= 0 && this.velocity.y <= 0)
        this.color = "rgba(200, 127, 200, .5)";
    if(this.velocity.x > 0 && this.velocity.y <= 0)
        this.color = "rgba(127, 127, 200, .5)";
    if(this.velocity.x <= 0 && this.velocity.y > 0)
        this.color = "rgba(127, 200, 200, .5)";
}

// draw a circular zone around the vehicle centered on its location vector
Vehicle.prototype.showZone = function(ctx, zoneSize, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, zoneSize / 2, 0, Math.PI * 2, true);
    ctx.strokeStyle = color || "#F006";
    ctx.stroke();
    if(this.maxForce == this.maxSpeed) {
        ctx.fillStyle = "#F006";
        ctx.fill();
    }
    ctx.closePath();
    ctx.restore();
}

// FORCES

Vehicle.prototype.update = function(maxSpeed = null) {
    this.velocity.add(this.acceleration);
    this.limitSpeed(maxSpeed);
    this.location.add(this.velocity);
    // avoid constant accumulation of acceleration
    this.acceleration.mult(0);
}

Vehicle.prototype.applyForce = function(vectorForce) {
    this.acceleration.add(vectorForce);
}

Vehicle.prototype.limitSpeed = function(maxSpeed) {
    let max = (maxSpeed == null) ? this.maxSpeed : maxSpeed;
    if(max != null)
        this.velocity.limit(max);
}


// BEHAVIORS

// SEEK => desiredVelocity = targetLocation - vehicleLocation
// then normalize and set magnitude to desired speed

// FLEE => desiredVelocity = targetLocation - vehicleLocation
// then normalize and set magnitude to the invert of desired speed


// STEER => steer = desiredVelocity - velocity;


// return the desired velocity for a seeking behavior
Vehicle.prototype.getSeekVector = function(vectorTarget) {
    let desiredVelocity = Vector.sub(vectorTarget, this.location);
    desiredVelocity.normalize();
    desiredVelocity.mult(this.maxSpeed);
    return desiredVelocity;
}

// seeking function without steering, just go right ahead to the given target
Vehicle.prototype.seek = function(vectorTarget) {
    this.applyForce(this.getSeekVector(vectorTarget));
}

// return the desired velocity for a fleeing behavior
Vehicle.prototype.getFleeVector = function(vectorTarget) {
    let desiredVelocity = Vector.sub(vectorTarget, this.location);
    desiredVelocity.normalize();
    desiredVelocity.mult(-this.maxSpeed);
    return desiredVelocity;
}

// fleeing function with steering
Vehicle.prototype.flee = function(vectorTarget) {
    let desired = this.getFleeVector(vectorTarget);
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
}

// return the steer vector
Vehicle.prototype.getSteerVector = function(vectorTarget) {
    let desired = this.getSeekVector(vectorTarget);
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
}

// steering function
Vehicle.prototype.steer = function(vectorTarget) {
    let steer = this.getSteerVector(vectorTarget);
    this.applyForce(steer);
}

// maintain vehicle away from each other
Vehicle.prototype.getSeparateVector = function(vectorTargetArray, zone) {
    let sum = new Vector(0, 0);
    let neighbor = 0;
    let z = zone | this.avoidingZone;
    for(let v of vectorTargetArray) {
        if(this.inZone(v, z)) {
            let diff = Vector.sub(this.location, v.location);
            diff.normalize();
            sum.add(diff);
            neighbor++;
        }
    }
    if(neighbor > 0) {
        sum.div(neighbor);
        sum.normalize();
        sum.mult(this.avoidSpeed);
        let flee = Vector.sub(sum, this.velocity);
        flee.limit(this.maxForce);
        return flee;
    } else {
        return new Vector(0, 0);
    }
}

Vehicle.prototype.separate = function(vectorTargetArray) {
    let flee = this.getSeparateVector(vectorTargetArray);
    this.applyForce(flee);
}

Vehicle.prototype.getCohesionVector = function(vectorTargetArray, zone) {
    let sum = new Vector(0, 0);
    let neighbors = 0;
    let z = zone | this.neighborZone;
    for(let t of vectorTargetArray) {
        if(this.inZone(t, z)) {
            sum.add(t.location);
            neighbors++;
        }
    }
    if(neighbors > 0) {
        sum.div(neighbors);
        let steer = this.getSteerVector(sum);
        return steer;
    } else {
        return new Vector(0, 0);
    }
    return cohesion;
}

Vehicle.prototype.cohesion = function(vectorTargetArray) {
    let cohesion = this.getCohesionVector(vectorTargetArray);
    this.applyForce(cohesion);
}

Vehicle.prototype.getAlignVector = function(vectorTargetArray) {
    let velocitySum = new Vector(0, 0);
    let neighbors = 0;
    for(let t of vectorTargetArray) {
        if(this.inZone(t, this.neighborZone)) {
            velocitySum.add(t.velocity);
            neighbors++;
        }
    }
    if(neighbors > 0) {
        velocitySum.div(neighbors);
        velocitySum.setMag(this.maxSpeed);
        let steer = Vector.sub(velocitySum, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    } else {
        return new Vector(0, 0);
    }
}

Vehicle.prototype.align = function(vectorTargetArray) {
    let align = this.getAlignVector(vectorTargetArray);
    this.applyForce(align);
}

Vehicle.prototype.reachAndStopAt = function(vectorTarget) {
    let desired = Vector.sub(vectorTarget, this.location);
    let d = desired.mag();
    desired.norm();
    if(d < this.arrivingZone) {
        let m = map(d, 0, this.arrivingZone, 0, this.maxSpeed);
        desired.mult(m);
    } else {
        desired.mult(this.maxSpeed);
    }
    let steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
}

Vehicle.prototype.fleeZone = function(target, size) {
    let d = this.location.distanceFrom(target);
    let securityDist = size || this.avoidingZone;
    if(d <= securityDist) {
        let desired = Vector.sub(target, this.location);
        let m = map(d, 0, securityDist, 0, this.maxSpeed);
        desired.mult(-m);
        let steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }
}

// LOCATION

Vehicle.prototype.inZone = function(vectorTarget, zone) {
    if(this == vectorTarget) {
        return false;
    }
    let d = this.location.distanceFrom(vectorTarget.location);
    return (d >= 0) && (d < zone);
}

// checking if the vehicle is in a given zone (a rectangular one)
Vehicle.prototype.inRect = function(xOrigin, yOrigin, width, height) {
    let x = this.location.x;
    let y = this.location.y;
    return (x >= (xOrigin - width) &&
            x <= (xOrigin + width) &&
            y >= (yOrigin - height) &&
            y <= (yOrigin + height));
}

Vehicle.prototype.edge = function(width, height) {
    let r = this.size;
    if(this.location.x > width - r) {
        this.location.x = width - r;
        this.velocity.x *= -1;
        this.acceleration.mult(0);
    }
    if(this.location.x < 0 + r) {
        this.location.x = 0 + r;
        this.velocity.x *= -1;
        this.acceleration.mult(0);
    }
    if(this.location.y > height - r) {
        this.location.y = height - r;
        this.velocity.y *= -1;
        this.acceleration.mult(0);
    }
    if(this.location.y < 0 + r) {
        this.location.y = 0 + r;
        this.velocity.y *= -1;
        this.acceleration.mult(0);
    }
}

Vehicle.prototype.edgeToEdge = function(width, height) {
    let r = this.size;
    if(this.location.x > width + r) {
        this.location.x = 0 - r;
    }
    if(this.location.x < 0 - r) {
        this.location.x = width + r;
    }
    if(this.location.y > height + r) {
        this.location.y = 0 - r;
    }
    if(this.location.y < 0 - r) {
        this.location.y = height + r;
    }
}
