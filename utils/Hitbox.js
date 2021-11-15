// init the Hitbox with new Hitbox(pos) where pos is a vector object OR {x:val, y:val, z:val}
// then give the hitbox a shape with addCircleZone(radius) OR addRectZone(width, height)


class Hitbox {
    circle = false;
    rectangle = false;
    pos;
    width;
    height;
    radius;
    constructor(pos) {
        this.pos = new Vector(pos.x, pos.y);
    }
}

// proto //
// turn the hitbox to a circle one
Hitbox.prototype.addCircleZone = function(radius) {
    this.radius = radius;
    this.circle = true;
}

// turn the hitbox to a rectangle one
Hitbox.prototype.addRectZone = function(width, height) {
    this.width = width;
    this.height = height;
    this.rectangle = true;
 }


Hitbox.prototype.move = function(pos) {
    this.pos.x = pos.x || this.pos.x;
    this.pos.y = pos.y || this.pos.y;
    this.pos.z = pos.z || this.pos.z;
}


// display the hitbox stroke style
Hitbox.prototype.display = function(ctx, color) {
    if(color != null) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    if(this.circle) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
    }
    if(this.rectangle) {
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    if(color != null) ctx.restore();
}

Hitbox.prototype.hit = function(obj) {
    if(obj.constructor.name == "Vertice") {
        return this.hitVertice(obj);
    }
    if(obj.constructor.name == "Vector") {
        return this.hitVertice(obj);
    }
    if(obj.constructor.name == "Hitbox") {
        if(this.circle) {
            return this.hitCircle(obj);
        }
        if(this.rectangle) {
            return this.hitRect(obj);
        }
    }
}

Hitbox.prototype.hitVertice = function(vertice) {
    return  (vertice.x >= this.pos.x) &&
            (vertice.x <= this.pos.x + this.width) &&
            (vertice.y >= this.pos.y) &&
            (vertice.y <= this.pos.y + this.height);
}

Hitbox.prototype.hitVector = function(vector) {
    return  (vector.x >= this.pos.x) &&
            (vector.x <= this.pos.x + this.width) &&
            (vector.y >= this.pos.y) &&
            (vector.y <= this.pos.y + this.height);
}

Hitbox.prototype.hitCircle = function(hitboxCircle) {
    let a = hitboxCircle.pos.x - this.pos.x;
    let b = hitboxCircle.pos.y - this.pos.y;
    let c = (a * a + b * b);
    let dist = Math.sqrt(c);
    return dist < (hitboxCircle.radius + this.radius);

}

Hitbox.prototype.hitRect = function(hitboxRect) {
    return  (hitboxRect.pos.x + hitboxRect.width >= this.pos.x) &&
            (hitboxRect.pos.x <= this.pos.x + this.width) &&
            (hitboxRect.pos.y + hitboxRect.height >= this.pos.y) &&
            (hitboxRect.pos.y <= this.pos.y + this.height);
}
