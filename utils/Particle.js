class Particle {
    x;
    y;
    vx;
    vy;
    size = 10;
    alpha = .75;

    constructor() {
        this.x = width / 2;
        this.y = height - this.size * 2;
        this.vx = this.getRandomFloat(-1.5, .5);
        this.vy = this.getRandomFloat(-6, -3);

    }
}

// PROTO //
Particle.prototype.show = function(ctx) {
    ctx.fillStyle = "rgba(255, 255, 255,"+this.alpha+")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath()
    ctx.fill();
}

Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= .007;
}

Particle.prototype.isFinished = function() {
    return this.alpha < 0;
}

Particle.prototype.getRandom = function(min, max) {
        min = (min >= 0 && max > 1) ? Math.ceil(min) : min;
        max = (max > 1) ? max | 0 : max;
        return ((Math.random() * (max - min +1)) | 0) + min;
}

Particle.prototype.getRandomFloat = function(min, max) {
        return (Math.random() * (max - min +1)) + min;
}
