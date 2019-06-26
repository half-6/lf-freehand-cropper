function pen(parent,onDrawEnd){
    let strokeColor = '#39f';
    let fillColor = new Color(0,0,0,0.1);
    function draw() {
        parent.moveable = false;
        let path = new Path();
        path.closed = false;
        path.selected = true;
        path.strokeColor = strokeColor;
        path.fillColor = fillColor;

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
                    parent.moveable = true;
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
            rectangle.strokeColor = strokeColor;
            rectangle.fillColor = fillColor;
            rectangle.selected = true;
            parent.onMouseDown = null;
            if(onDrawEnd) onDrawEnd();
        }

    }
    return {
        draw,
        drawRectangle
    }
}

module.exports = pen