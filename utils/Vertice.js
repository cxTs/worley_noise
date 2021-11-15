class Vertice {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}

// proto //
Vertice.prototype.move = fucntion(x, y, z) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.z = z || this.z;
}

Vertice.prototype.display(ctx, size = 1, color = null) {
    if(color != null) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, size, size);
        ctx.restore();
    } else {
        ctx.fillRect(this.x, this.y, size, size);
    }
}
