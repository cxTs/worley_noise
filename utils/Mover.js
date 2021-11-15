class Mover {
    loc;
    vel;
    acc;
    terminalSpeed;
    loss;
    mass;

    constructor(x, y) {
        this.loc = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
    }
}

// PROTO //
// vector loc (for location) tells where the mover is.
// vector vel (for velocity) is the the change of location over the time.
// vector acc (for acceleration) is the change of velocity over the time.
Mover.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    if (this.loss != null) {
        this.acc.add(this.loss);
    }    
}


Mover.prototype.applyForce = function(vector) {
    this.acc.add(vector);
}

Mover.prototype.addLoss = function(x, y) {
    this.loss = new Vector(x, y);
}

Mover.prototype.reset = function() {
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.update();
}

// à modifier suivant la forme à donner au mover héritant
Mover.prototype.display = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 15, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// donner la taille en px de la largeur et la hauteur du canvas
Mover.prototype.edge = function(width, height) {
    if(this.loc.x > width) {
        this.loc.x = width;
        this.vel.x *= -1;
    }
    if(this.loc.x <= 0) {
        this.loc.x = 0;
        this.vel.x *= -1;
    }
    if(this.loc.y > height) {
        this.loc.y = height;
        this.vel.y *= -1;
    }
    if(this.loc.y < 0) {
        this.loc.y = 0;
        this.vel.y *= -1;
    }
}

Mover.prototype.addMass = function(m) {
    this.mass = m;
}

Mover.prototype.addTerminalSpeed = function(termSpeedX, termSpeedY) {
    this.terminalSpeed = new Vector(termSpeedX, termSpeedY);
}
