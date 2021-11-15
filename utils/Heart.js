function Heart(nbPoints, size) {
    this.points = [];
    this.nbPoints = nbPoints;
    this.size = size;
    // constructor
    this.init = function() {
        const xMin = 0,
              xMax = 1.139,
              xInc = xMax / nbPoints;

        var exp23 = 2 / 3,
            exp43 = 4 / 3,
            yPos,
            yNeg;
        for(let x = xMin; x <= xMax; x += xInc) {
            // first step
            yPos = yNeg = Math.pow(x, exp23);
            // 1/2 second step
            let underRootPart = Math.pow(x, exp43) + 4 - (4 * x * x);
            // 2/2 second step
            if(underRootPart < 0) {
                console.log("ok");
                let rootPart = -Math.sqrt(-underRootPart);
                yPos += rootPart;
                yNeg -= rootPart;
            } else {
                let rootPart = Math.sqrt(underRootPart);
                yPos += rootPart;
                yNeg -= rootPart;
            }
            // third step;
            yPos /= -2;
            yNeg /= -2;

            let vPosRight = new Vector(x, yPos);
            let vNegRight = new Vector(x, yNeg);
            let vPosLeft = new Vector(-x, yPos);
            let vNegLeft = new Vector(-x, yNeg);
            vPosRight.mult(this.size);
            vNegRight.mult(this.size);
            vPosLeft.mult(this.size);
            vNegLeft.mult(this.size);
            this.points.push(vPosRight, vPosLeft, vNegRight, vNegLeft);
        }
    }
    this.init();
    console.table(this.points);

    this.degug = function({points, nbPoints, size}) {
        console.log(`Prop ${points}, ${nbPoints}, ${size}`);
    }
}

Heart.prototype.moveHeartCenterTo = function(centerVector) {
    for(let v of this.points) {
        v.add(centerVector);
    }
}

Heart.prototype.giveFuturVector = function(index, centerPos) {
    if(index < this.points.length) {
        return Vector.add(this.points[index], centerPos);
    } else {
        console.log("%c index out of bound on calling function giveFuturVector", "color:#B17");
    }
}

Heart.prototype.show = function(ctx,size) {
    for(let v of this.points) {
        v.display(ctx, size);
    }
}
}
