function pen(parent,onDrawEnd,options){
    function drawPath() {
        let path = initPath(options)
        let movPoint = null;
        console.log("pen is start")
        parent.onMouseDown = (event)=>{
            if(path.curves.length > 0)
            {
                //close on loop back to first one
                var fPoint = path.curves[0].points[0];
                if(Math.abs(event.point.x - fPoint.x)<5 && Math.abs(event.point.y - fPoint.y)<5)
                {
                    path.closed = true;
                    parent.onMouseMove()
                    console.log("pen is closed")
                    // path.fullySelected = false;
                    // path.selected = false;
                    parent.onMouseDown = null;
                    parent.onMouseMove = null;
                    path.selected = false;
                    if(onDrawEnd) onDrawEnd();
                    return;
                }
            }
            if(!path.closed)
            {
                path.lineTo(event.point);
            }
        }
        parent.onMouseMove = (event)=> {
            if(movPoint)
            {
                path.removeSegment(path.segments.length - 1);
                movPoint = null;
            }
            if(!path.closed)
            {
                var newPoint = event.point.clone();
                path.lineTo(newPoint);
                movPoint = newPoint;
            }
        }
        return path;
    }
    function drawRectangle() {
        parent.onMouseDown = (event)=>{
            var rectangle = new Path.Rectangle(event.point.x,event.point.y,100,50);
            rectangle.strokeColor = options.strokeColor;
            rectangle.selectedColor = options.selectedColor;
            rectangle.fillColor = options.fillColor;
            rectangle.selected = true;
            parent.onMouseDown = null;
            if(onDrawEnd) onDrawEnd();
        }
    }
    function initPath(options) {
        let path = new Path();
        path.closed = false;
        path.selected = true;
        path.strokeColor = options.strokeColor;
        path.selectedColor = options.selectedColor;
        path.fillColor = options.fillColor;
        return path;
    }
    function draw(points,options) {
        let path = initPath(options)
        for(let i=0;i<points.length;i++){
            let point = points[i];
            path.lineTo(point);
        }
        path.closed = true;
        path.selected = false;
    }
    return {
        draw,
        drawPath,
        drawRectangle
    }
}

module.exports = pen