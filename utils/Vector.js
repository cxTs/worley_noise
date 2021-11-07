/**
* @description : class Vector. The base class of the utils suite
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 20/01/2020 (last update and corrections on 09/03/2021)
* @required NONE
* @param {NUMBER} x : value of x position
* @param {NUMBER} y : value of y position
* @param {NUMBER} z : value of z position
* @return {VOID}
*
**/
class Vector {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    static add(vector1, vector2) {
        let x = vector1.x + vector2.x;
        let y = vector1.y + vector2.y;
        return new Vector(x, y);
    }

    static sub(vector1, vector2) {
        let x = vector1.x - vector2.x;
        let y = vector1.y - vector2.y;
        return new Vector(x, y);
    }

    static equal(vector1, vector2) {
        if(vector1.x == vector2.x && vector1.y == vector2.y)
            return true;
        return false;
    }
// return a normalized vector created with a vector "(0,0)" and an angle from the first radius of a trigo circle
    static fromAngle(angle) {
        let x = Math.cos(angle);
        let y = Math.sin(angle);
        return new Vector(x, y);
    }

// return a random normalized vector with max values as "seeds"
    static getRandomVector(maxX, maxY, maxZ) {
        let _maxX = (maxX != null) ? maxX : 1;
        let _maxY = (maxY != null) ? maxY : 1;
        let _maxZ = (maxZ != null) ? maxZ : 1;

        let x = Math.random() * _maxX;
        let y = Math.random() * _maxY;
        let z = Math.random() * _maxY;

        let v = new Vector(x, y, z);
        v.norm();
        return v;
    }

    static dist(x1, y1, x2, y2) {
        let v1 = new Vector(x1, y1);
        let v2 = new Vector(x2, y2);
        return v1.distanceFrom(v2);
    }

    // v a point out of the line
    // ab the line, a and b two points on the line
    // return a vector point that is the scalar projection of v on the line ab
    static getScalarProjection(v, a, b) {
        let ab = Vector.sub(b, a);
        let av = Vector.sub(v, a);
        ab.norm();
        ab.mult(av.dot(ab));
        let point = Vector.add(a, ab);
        return point;
    }

    /**
    * @description : return a random integer in range [min, max]
    *
    * @param {NUMBER} min : minimum value of the range
    * @param {NUMBER} min : maximum value of the range
    * @return {NUMBER} : a random integer
    *
    **/
    static getRandom(min, max) {
        if(max == null) {
    		max = min;
    		min = 0;
    	}
            min = Math.ceil(min);
            max = max | 0; // binary OR operator is faster than Math.floor() function
            return ((Math.random() * (max - min + 1)) | 0) + min;
    }

}

// PROTO //
// verify the equality of location between 2 vectors
Vector.prototype.equal = function(vector) {
    if(this.x == vector.x && this.y == vector.y && this.z == vector.z)
        return true;
    return false;
}

// give the distance between 2 vectors
Vector.prototype.distanceFrom = function(vector) {
    return Math.sqrt( Math.pow((vector.x-this.x), 2) + Math.pow((vector.y-this.y), 2) );
}

// give the square of the magnitude
Vector.prototype.magSq = function() {
    let xSq = this.x * this.x;
    let ySq = this.y * this.y;
    let zSq = this.z * this.z;
    return xSq + ySq + zSq ;
}

// give the magnitude of the vector
Vector.prototype.mag = function() {
    return Math.sqrt(this.magSq());
}

// limit the magnitude to the max parameter
Vector.prototype.limit = function(max) {
    if(this.mag() > max) {
        this.normalize();
        this.mult(max);
    }
}

// move vector compared to the x and y passed in args
Vector.prototype.move = function(x, y, z) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.z = z || this.z;
}

// randomly move vector in [min, max] range
Vector.prototype.randomMove = function(min, max) {
    this.x = this.x + Vector.getRandom(min,max);
    this.y = this.y + Vector.getRandom(min,max);
    this.z = this.z + Vector.getRandom(min,max);
}

// rotate the vector around point (0, 0)
Vector.prototype.rotate = function(angle) {
    let origin = new Vector(0, 0);
    let actualAngle = this.angleFromCosAxcis(); // getting actual heading OR angle between this vector and the x axcis
    angle += actualAngle; // adding actual angle to the desired angle of rotation
    this.rotateAround(origin, angle);
}

// rotate the vector around another by a given angle and maintain the distance between the 2 vectors
Vector.prototype.rotateAround = function(centerVector, angle) {
    let dist = this.distanceFrom(centerVector);
    this.x = (Math.cos(angle) * dist) + centerVector.x;
    this.y = (Math.sin(angle) * dist) + centerVector.y;
}


Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
}

Vector.prototype.sub = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
}

// multiply a vector by a vector and give a new Vector object
// it's not a scalar product ! it's the vectorial product
// the result is a perpendicular vector to the 2 vectors that are multiplied
// this perpendicular vector is oriented follow the right hand rule.
Vector.prototype.cross = function(vector) {
    let t = this.mag() * vector.mag() * Math.sin(this.angleFrom(vector));
    return new Vector(0, 0, t);
}


// multiply a vector by a factor ( to scale the vector)
Vector.prototype.mult = function(factor) {
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;
}

// divide a vector by a factor ( to scale the vector)
Vector.prototype.div = function(factor) {
    if(factor !== 0) {
        this.mult(1 / factor);
    } else {
        console.log("DIVISION BY 0 in Vector.div() function");
    }
}


// give the scalar product of a vector by a vector
// u.v = 1/2 * (||u||² + ||v||² - ||u - v||²)
// OR if you know the vectors coordinate
// for u(x,y) and v(x',y')
// u.v = x * x' + y * y' = ||u|| * ||v|| + cos(a) (where a is the angle between vectors u and v)
Vector.prototype.dot = function(vector) {
    return (this.x * vector.x) + (this.y * vector.y);
}

// give the angle between two vectors
// to get an angle in degrees, divide it by PI and multiply the result by 180.
Vector.prototype.angleFrom = function(vector) {
    let cosAngle = this.dot(vector) / (this.mag() * vector.mag());
    return Math.acos(cosAngle);
}

// ab the line, a and b two points on the line
// return a vector point that is the scalar projection of this on the line ab
Vector.prototype.getScalarProjection = function(a, b) {
    let ab = Vector.sub(b, a);
    let av = Vector.sub(this, a);
    ab.norm();
    ab.mult(av.dot(ab));
    let point = Vector.add(a, ab);
    return point;
}

// give the angle between x axcis and the arrow from (0,0) to (this.x, this.y)
Vector.prototype.angleFromCosAxcis = function(inDegree) {
    let angle = Math.atan2(this.y, this.x)
    if(inDegree) {
        angle *= 180;
        angle /= Math.PI;
    }
    return angle ;
}

// give the angle between the vector and the cos axcis of a trigo circle
//SOH CAH TOA
Vector.prototype.angle = function() {
    // vector (0,0), no angle
    if(this.x == 0 && this.y == 0) return null;
    // angle and pi constant calculus
    let angle = Math.atan(this.y / this.x);
    let pi = Math.PI;
    let alfPi = pi / 2;
    // angle have to be positive
    // 1 / angle for the case angle == -0, other way to point negative 0 have no results
    angle *= ((1 / angle) < 0) ? -1 : 1;
    if(this.x == 0 && this.y > 0)           return angle;
    if(this.x == 0 && this.y < 0)           return -angle;
    if(this.x > 0 && this.y > 0)            return angle;
    if(this.x > 0 && this.y == 0)           return 0;
    if(this.x < 0 && this.y == 0)           return pi;
    if(this.x < 0 && this.y > 0)            return pi - angle; //return pi - angle;
    if(this.x > 0 && this.y < 0)            return -angle;
    if(this.x < 0 && this.y < 0)            return -pi + angle;
}

// normalize the vector (give the corresponding unit vector)
Vector.prototype.normalize = function() {
    let mag = this.mag();
    if(mag !== 0) this.div(mag);
    return this;
}

// alias of normalize function
Vector.prototype.norm = function() {
    this.normalize();
}

// set magnitude to the value of the argument
Vector.prototype.setMag = function(value) {
    this.normalize();
    this.mult(value);
}

// draw the vector on canvas as a circle
Vector.prototype.display = function(ctx, size, fill = true, stroke = false, color = null) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    if(color != null) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    if(fill) {
        ctx.fill();
    }
    if(stroke) {
        ctx.stroke();
    }
    ctx.closePath();

    if(color != null) ctx.restore();

}

// draw the vector on canvas as a 1x1 dot
Vector.prototype.vertex = function(ctx, size = 1, color = null) {
    if(color != null) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);
        ctx.restore();
    } else {
        ctx.fillRect(this.x, this.y, size, size);
    }

}

// draw the arrow representation of the vector
Vector.prototype.arrow = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.stroke();
}

Vector.prototype.arrowFrom = function(ctx, origin, color) {
    if(color != null) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.stroke();
    if(color != null) {
        ctx.restore()
    }
}
