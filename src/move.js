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
                if (event.modifiers.shift) {
                    if (hit.type === 'segment') {
                        hit.segment.remove();
                    }
                    return;
                }
                if (event.modifiers.control) {
                    if (hit.type === 'stroke') {
                        var location = hit.location;
                        var segment = hit.item.insert(location.index + 1, event.point);
                    }
                    return;
                }
                selectedElement = hit.segment ||  hit.item;
                console.log(`click ${event.point} with selected ${JSON.stringify(selectedElement)}`)
                selectedElement.selected = true;
                //hit.item.crossings[0].segment.selected = true;
                var selectedPosition = selectedElement.position || selectedElement.point;
                movingShift.x = selectedPosition.x - event.point.x;
                movingShift.y = selectedPosition.y - event.point.y;
            }
        }
        parent.onMouseDrag= function (event) {
            if(me.options.move === false) return;
            if(selectedElement && selectedElement.selected){
                var selectedPosition = selectedElement.position || selectedElement.point;
                selectedPosition.x = event.point.x + movingShift.x;
                selectedPosition.y = event.point.y + movingShift.y;
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
        if(!me.options.zoom) return;
        let delta;
        if (event.wheelDelta){
            delta = event.wheelDelta;
        }else{
            delta = -1 * event.deltaY;
        }
        event.preventDefault(); // Limit wheel speed to prevent zoom too fast (#21)
        if (delta < 0){
            //console.log("DOWN");
            if(selectedElement && selectedElement.selected)
            {
                scaleOffset(selectedElement,-0.1);
                return;
            }
            //zoomIn()
        }else if (delta > 0){
            //console.log("UP");
            if(selectedElement && selectedElement.selected)
            {
                scaleOffset(selectedElement,0.1);
                return;
            }
            //zoomOut();
        }
    }
    return {
        start,
        stop,
        options:me.options
    }
}

module.exports = move