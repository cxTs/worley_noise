class Wall {
    context = document.getElementById("canvas").getContext('2d');
    ////
    origin;
    end;

    constructor(xOrigin, yOrigin, xEnd, yEnd) {
        this.origin = new Vector(xOrigin, yOrigin);
        this.end = new Vector(xEnd, yEnd);
    }
}

// PROTO //

Wall.prototype.newRandom = function() {
    let maxX = document.getElementById('canvas').offsetHeight;
    let maxY = document.getElementById('canvas').offsetWidth;

    // init a new wall origin
    let x1 = Math.ceil(Math.random() * (maxX-0) + 0);
    let y1 = Math.ceil(Math.random() * (maxY-0) + 0);
    this.origin = new Vector(x1, y1);

    // init a new wall end
    let x2 = Math.ceil(Math.random() * (maxX-0) + 0);
    let y2 = Math.ceil(Math.random() * (maxY-0) + 0);
    this.end = new Vector(x2, y2);
}

// draw the line between origin poitn and end point on the canvas
Wall.prototype.show = function() {
    context.save();
    // wall color
    context.strokeStyle = "#999";
    // wall thickness
    context.lineWidth = 3;
    Draw.line(this.context, this.origin, this.end);
    context.restore();
}
