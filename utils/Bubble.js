class Bubble {
    center;
    radius;
    fillColor = "rgba(255, 255, 255, .1)";
    strokeColor = "rgba(255, 255, 255, 1)";
    growFactor = .25;
    constructor(x, y, radius = 10) {
        this.center = new Vector(x, y);
        this.radius = radius;
    }
}

// PROTO //

Bubble.prototype.update = function(xInc = 1, yInc = 1) {
    let x = this.getRandom(-xInc, xInc);
    let y = this.getRandom(-yInc, yInc);
    this.center.add(new Vector(x, y));
}

Bubble.prototype.display = function(ctx) {
    ctx.save();
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    this.center.display(ctx, this.radius, true, true);
    ctx.restore();
}

Bubble.prototype.getRandom = function(min, max) {
    min = (min >= 0 && max > 1) ? Math.ceil(min) : min;
    max = (max > 1) ? max | 0 : max;
    return ((Math.random() * (max - min + 1)) | 0) + min;
}

Bubble.prototype.getRandomFloat = function(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}

Bubble.prototype.intersects = function(bubble) {
    return ((this.radius + bubble.radius) > this.center.distanceFrom(bubble.center))
}

Bubble.prototype.grow = function(inc) {
    this.radius += inc * this.growFactor;
}

Bubble.prototype.merge = function(bubble) {
    if(this.intersects(bubble)) {
        if(this.isBigger(bubble)) {
            this.grow(bubble.radius);
            bubble.radius = 0;
        } else {
            bubble.grow(this.radius);
            this.radius = 0;
        }
    }
}

Bubble.prototype.isBigger = function(bubble) {
    return this.radius > bubble.radius;
}

Bubble.prototype.edge = function(width, height) {
    if(this.center.x > width + this.radius) {
        this.center.x = 0;
    }
    if(this.center.x < 0 - this.radius) {
        this.center.x = width;
    }
    if(this.center.y > height + this.radius) {
        this.center.y = 0;
    }
    if(this.center.y < 0 - this.radius) {
        this.center.y = height;
    }
}
