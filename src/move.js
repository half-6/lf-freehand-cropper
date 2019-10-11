function move(parent,canvasElement,options){
    //{move,select,zoom}
    let me = {options};
    let movingShift = new Point(0,0);
    let selectedElement = null;
    let hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 10
    };

    function scaleOffset(obj,offset){
        var newScale = obj.scaling.x + offset;
        if(newScale<0.05) return;
        if(offset< 0 && (obj.bounds.width * (1+offset) < 20 ||obj.bounds.height * (1+offset) < 20 )) return;
        console.log(obj.bounds.width + " "  + obj.scaling.x)
        obj.scaling.x = newScale;
        obj.scaling.y = newScale;
    }
    function start() {
        parent.onMouseDown = function(event) {
            if(me.options.select === false) return;
            let hit = project.hitTest(event.point,hitOptions);
            disSelected();
            if (hit) {
                if (event.modifiers.shift && event.modifiers.control) {
                    if (hit.item instanceof Path) {
                        hit.item.remove();
                    }
                    return;
                }
                if (event.modifiers.shift) {
                    if (hit.type === 'segment') {
                        hit.segment.remove();
                    }
                    return;
                }
                if (event.modifiers.control) {
                    if (hit.type === 'stroke') {
                        let location = hit.location;
                        let segment = hit.item.insert(location.index + 1, event.point);
                    }
                    return;
                }
                if (hit.type === 'stroke') {
                    selectedElement = hit.location.curve;
                    selectedElement.selected = true;
                    console.log(`click ${event.point} on stroke ${selectedElement.point1} ${selectedElement.point2}`);
                    movingShift.x = event.point.x;
                    movingShift.y = event.point.y;
                    selectedElement.point1.oldX = selectedElement.point1.x;
                    selectedElement.point1.oldY = selectedElement.point1.y;
                    selectedElement.point2.oldX = selectedElement.point2.x;
                    selectedElement.point2.oldY = selectedElement.point2.y;
                    return;
                }
                selectedElement = hit.segment || hit.item;
                console.log(`click ${event.point} with selected ${JSON.stringify(selectedElement)}`)
                selectedElement.selected = true;
                if (me.options.onSelected) me.options.onSelected(hit.item);
                if (selectedElement.onSelected) selectedElement.onSelected(selectedElement);
                //hit.item.crossings[0].segment.selected = true;
            }
            if(me.options.move && selectedElement && selectedElement.move !== false){
                let selectedPosition = selectedElement.position || selectedElement.point;
                movingShift.x = selectedPosition.x - event.point.x;
                movingShift.y = selectedPosition.y - event.point.y;
                return;
            }
            if(me.options.fullMove)
            {
                let selectedPosition = project.activeLayer.position;
                movingShift.x = selectedPosition.x - event.point.x;
                movingShift.y = selectedPosition.y - event.point.y;
            }
        }
        parent.onMouseDrag= function (event) {
            if(me.options.move && selectedElement && selectedElement.move !== false && !selectedElement.locked  && selectedElement.selected){
                if(selectedElement instanceof Curve)
                {
                    let addX = event.point.x - movingShift.x;
                    let addY = event.point.y - movingShift.y;
                    selectedElement.point1.x = selectedElement.point1.oldX + addX;
                    selectedElement.point1.y = selectedElement.point1.oldY + addY;
                    selectedElement.point2.x = selectedElement.point2.oldX + addX;
                    selectedElement.point2.y = selectedElement.point2.oldY + addY;
                }
                else
                {
                    let selectedPosition = selectedElement.position || selectedElement.point;
                    selectedPosition.x = event.point.x + movingShift.x;
                    selectedPosition.y = event.point.y + movingShift.y;
                }
                return;
            }
            if(me.options.fullMove)
            {
                project.activeLayer.position.x = event.point.x + movingShift.x;
                project.activeLayer.position.y = event.point.y + movingShift.y;
                return;
            }

        }
        canvasElement.removeEventListener('wheel', scroll)
        canvasElement.addEventListener('wheel', scroll);
    }
    function disSelected() {
        if(selectedElement)
        {
            selectedElement.selected  = false;
            selectedElement = null;
        }
    }
    function stop() {
        disSelected();
        parent.onMouseDrag = parent.onMouseDown = null;
        canvasElement.removeEventListener('wheel', scroll)
    }
    function scroll(event){
        let delta;
        if (event.wheelDelta){
            delta = event.wheelDelta;
        }else{
            delta = -1 * event.deltaY;
        }
        event.preventDefault(); // Limit wheel speed to prevent zoom too fast (#21)
        if (delta < 0){
            //console.log("DOWN");
            if(me.options.zoom && selectedElement && selectedElement.selected && selectedElement.zoom !== false)
            {
                scaleOffset(selectedElement,-0.1);
                return;
            }
            zoomIn()
        }
        else if (delta > 0){
            //console.log("UP");
            if(me.options.zoom && selectedElement && selectedElement.selected  && selectedElement.zoom !== false)
            {
                scaleOffset(selectedElement,0.1);
                return;
            }
            zoomOut();
        }
    }
    function zoomIn() {
        if(me.options.fullZoom && parseFloat(project.view.zoom).toFixed(1)>0.1)
        {
            project.view.zoom -= 0.1
        }
    }
    function zoomOut() {
        if(me.options.fullZoom){
            project.view.zoom += 0.1
        }
    }
    return {
        start,
        stop,
        options:me.options
    }
}

module.exports = move