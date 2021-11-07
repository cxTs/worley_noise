/**
* @description : Static class Draw. Simplify drawing action on canvas
*
* @author cxts  <couchaux.thomas@gmail.com>
* @github https://github.com/cxTs
* @date 27/05/2020
* @required NONE
* @return {VOID} : Draw on the html canvas
*
**/
class Draw {
    /**
    * @description : draw a line
    *
    * @param {OBJECT} ctx : context object from the HTMLCanvasElementPrototype
    * @param {OBJECT} origin : Vector object
    * @param {OBJECT} end : Vector object
    * @return {VOID}
    *
    **/
    static line(context, origin, end) {
        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(end.x, end.y);
        context.stroke();
        context.closePath();
    }

    /**
    * @description : draw an arc ( and so a circle)
    *
    * @param {OBJECT} ctx : context object from the HTMLCanvasElementPrototype
    * @param {OBJECT} center : Vector object
    * @param {NUMBER} radius : value of the radius of the arc
    * @param {NUMBER} startAngle : location of the starting point of the arc on a trigo circle
    * @param {NUMBER} endAngles : location of the ending point of the arc on a trigo circle (default on Math.PI * 2 to draw a circle)
    * @return {VOID}
    *
    **/
    static arc(context, center, radius, startAngle, endAngle) {
        let sA = startAngle || 0;
        let eA = endAngle || Math.PI * 2;
        context.beginPath();
        context.arc(center.x, center.y, radius, sA, eA, true);
        context.stroke();
        context.closePath();
    }

    /**
    * @description : draw a rectangle
    *
    * @param {OBJECT} ctx : context object from the HTMLCanvasElementPrototype
    * @param {OBJECT} origin : Vector object
    * @param {NUMBER} width
    * @param {NUMBER} height
    * @param {STRING} type : can be stroke / fill / clear
    * @return {VOID}
    *
    **/
    static rect(context, origin, width, height, type) {
        switch (type) {
            case "stroke":
                context.strokeRect(origin.x, origin.y, width, height)
                break;
            case "fill":
                context.fillRect(origin.x, origin.y, width, height)
                break;
            case "clear":
                context.clearRect(origin.x, origin.y, width, height)
                break;
            default:
                context.strokeRect(origin.x, origin.y, width, height)
        }

    }
}
