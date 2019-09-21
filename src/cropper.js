import paper from 'paper'
import pen from './pen'
import move from './move'
function cropper(canvasId,options) {
    let me=this;
    console.log('init cropper')
    //install to global
    destroy()
    if(!window.paper) {
        paper.install(window);
    }
    const defaultOption = {
        move:true,
        select:true,
        zoom:true,
        fullZoom:true,
        strokeColor:"#39f",
        selectedColor:null,
        fillColor:new Color(0,0,0,0.1),
        onDrawEnd:null,
        onSelected:null
    };

    me.options = Object.assign({},defaultOption,options);

    let canvas = (typeof canvasId ==="string")?document.getElementById(canvasId):canvasId;
    if(!canvas) throw new Error("canvas does not exist")
    paper.setup(canvas);
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    let tool = new Tool();
    let myMove = new move(tool,canvas,me.options);
    startAction();
    let myPen = new pen(tool,()=>{
        startAction();
    },me.options);

    let raster = new Raster();
    raster.position = view.center;

    function startPen(option) {
        stopAction();
        myPen.drawPath(Object.assign({},me.options,option));
    }
    function startRectangle(option) {
        stopAction();
        myPen.drawRectangle(Object.assign({},me.options,option));
    }
    /*
     * full move model
     * it will move image and drawing object when you selected image
     * it will move path if you selected path
     */
    function enableFullMove() {
        raster.move = false;
        raster.zoom = false;
        me.options.fullMove = true;
    }
    function disableFullMove() {
        raster.move = true;
        raster.zoom = true;
        me.options.fullMove = false;
    }
    function getPos(){
        if(raster.source==="data:,") return;
        let output = [];
        for(let i=0;i<project.layers[0].children.length;i++)
        {
            let item = project.layers[0].children[i]
            if(item instanceof Path){
                output.push(item.getPos());
            }
        }
        return output;
    }
    function clear() {
        if(raster) raster.position = view.center;
        paper.view.zoom = 1;
        for(let j=0;j<project.layers.length;j++){
            let layer = project.layers[j];
            for(let i=layer.children.length-1;i>0;i--){
                let item = layer.children[i]
                if(item instanceof Path) {
                    let item = layer.children[i]
                    item.remove();
                }
            }
        }
    }
    function destroy() {
        if(paper && paper.projects && paper.projects.length > 0){
            console.log('destroy cropper')
            if(raster) raster.clear();
            clear();
            paper.tool.remove();
            paper.project.clear();
            paper.projects = [];
            paper.remove();
        }
    }
    function crop(imgPos){
        let canvas=document.createElement("CANVAS");
        canvas.width = imgPos.bounds.width;
        canvas.height = imgPos.bounds.height;
        let ctx=canvas.getContext("2d");
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(imgPos.points[0].x - imgPos.bounds.x, imgPos.points[0].y - imgPos.bounds.y);
        for(let i=1;i<imgPos.points.length;i++)
        {
            ctx.lineTo(imgPos.points[i].x - imgPos.bounds.x, imgPos.points[i].y - imgPos.bounds.y);
        }
        ctx.clip();
        ctx.drawImage(raster.image,imgPos.bounds.x, imgPos.bounds.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        ctx.restore(); /// restore de
        return canvas.toDataURL()
    }
    function cropBounds(imgPos) {
        let canvas=document.createElement("CANVAS");
        canvas.width = imgPos.bounds.width;
        canvas.height = imgPos.bounds.height;
        let ctx=canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(raster.image,imgPos.bounds.x, imgPos.bounds.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        return canvas.toDataURL()
    }
    function setImage(source) {
        let image = new Image();
        image.src = source;
        image.onload = function() {
            raster.source  = source;
            if(image.width > view.size.width)
            {
                paper.project.layers[0].fitBounds(view.bounds,false)
            }
            else
            {
                raster.scaling = 1;

            }
        };
    }
    function getImage() {
        return raster.source==="data:,"?undefined:raster.source;
    }
    function startAction() {
        myMove.start()
    }
    function stopAction() {
        myMove.stop();
    }
    function draw(points,option) {
        let newPoints = [...points];
        let imgX = raster.bounds.x;
        let imgY = raster.bounds.y;
        for(let i=0;i<newPoints.length;i++){
            let newPoint = newPoints[i];
            newPoint.x = newPoint.x * raster.scaling.x + imgX;
            newPoint.y= newPoint.y * raster.scaling.y + imgY;
        }
        return myPen.draw(points,Object.assign({},me.options,option))
    }

    Path.prototype.getPos = function () {
        let x = raster.bounds.x;
        let y = raster.bounds.y;
        let realPos = [];
        let minX,maxX,minY,maxY;
        for(let j=0; j < this.curves.length; j++) {
            let point = this.curves[j].points[0];
            let newX = (point.x  - x)/ raster.scaling.x;
            let newY = (point.y - y) / raster.scaling.x;
            realPos.push({x:newX,y:newY})
            if(!minX || minX>newX) minX = newX;
            if(!maxX || maxX<newX) maxX = newX;
            if(!minY || minY>newY) minY = newY;
            if(!maxY || maxY<newY) maxY = newY;
        }
        let boundWidth = maxX-minX;
        let boundHeight = maxY-minY;
        return {
            bounds:{x:minX,y:minY,width:boundWidth,height:boundHeight},
            boundPos:[
                {x:minX,y:minY},
                {x:minX+boundWidth,y:minY},
                {x:minX+boundWidth,y:minY+boundHeight},
                {x:minX,y:minY+boundHeight},
            ],
            points:realPos
        };
    }
    return {
        setImage,
        getImage,
        getPos,
        startPen,
        startRectangle,
        clear,
        destroy,
        crop,
        cropBounds,
        options:me.options,
        objects:project.layers[0].children,
        draw,
        enableFullMove,
        disableFullMove
    }
}
window.Cropper = cropper;
export default cropper
