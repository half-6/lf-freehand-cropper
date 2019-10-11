function pen(parent,onDrawEnd,options){
    function drawPath(option) {
        let path = initPath(Object.assign({},options,option))
        let movPoint = null;
        console.log("pen is start")
        parent.onMouseDown = (event)=>{
            if(path.curves.length > 0)
            {
                //close on loop back to first one
                let fPoint = path.curves[0].points[0];
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
                    if(option && option.onDrawEnd) option.onDrawEnd(path);
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
                let newPoint = event.point.clone();
                path.lineTo(newPoint);
                movPoint = newPoint;
            }
        }
        return path;
    }
    function drawRectangle(option) {
        console.log("rectangle is start")
        let path = initPath(Object.assign({},options,option));
        let startPoint = null;
        let movPoint = null;
        parent.onMouseDown = (event)=>{
            parent.onMouseMove = null;
            if(!startPoint)
            {
                startPoint = event.point.clone();
                movPoint = null;
                path.segments[0].point = startPoint
                let width = 12;
                let height = 12;
                path.lineTo(new Point(startPoint.x + width,startPoint.y));
                path.lineTo(new Point(startPoint.x + width,startPoint.y + height));
                path.lineTo(new Point(startPoint.x,startPoint.y + height));
                path.closed = true;
            }
        }
        parent.onMouseDrag = (event)=> {
            parent.onMouseDown = null;
            if(startPoint)
            {
                let newPos = event.point.clone();
                path.segments[1].point.x =  newPos.x;
                path.segments[2].point= newPos;
                path.segments[3].point.y =  newPos.y;
            }
        }
        parent.onMouseUp = (event)=> {
            startPoint = null;
            parent.onMouseDrag = null;
            parent.onMouseUp = null;
            path.selected = false;
            if(onDrawEnd) onDrawEnd();
            if(option && option.onDrawEnd) option.onDrawEnd(path);
            console.log("rectangle is end")
        }
        parent.onMouseMove = (event)=> {
            if(!startPoint && !path.closed)
            {
                if(!movPoint)
                {
                    let newPoint = event.point.clone();
                    path.lineTo(newPoint);
                    movPoint = newPoint;
                }
                else
                {
                    path.segments[0].point.x = event.point.x;
                    path.segments[0].point.y = event.point.y;
                }
            }
        }
    }
    function initPath(option) {
        let path = new Path();
        path.name = option.name;
        path.closed = false;
        path.selected = option.selected || true;
        path.locked = option.locked || false;
        path.strokeColor = option.strokeColor;
        path.selectedColor = option.selectedColor;
        path.fillColor = option.fillColor;
        return path;
    }
    function draw(points,option) {
        let path = initPath(option)
        for(let i=0;i<points.length;i++){
            let point = points[i];
            path.lineTo(point);
        }
        path.closed = true;
        path.selected = false;
        return path;
    }
    return {
        draw,
        drawPath,
        drawRectangle
    }
}

module.exports = pen