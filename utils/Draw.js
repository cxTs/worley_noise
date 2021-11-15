class Draw {
    static line(context, origin, end) {
        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(end.x, end.y);
        context.stroke();
        context.closePath();
    }

    static arc(context, center, radius, startAngle = 0, endAngle = Math.PI * 2) {
        context.beginPath();
        context.arc(center.x, center.y, radius, startAngle, endAngle, true);
        context.stroke();
        context.closePath();
    }

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
