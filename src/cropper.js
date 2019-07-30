import paper from 'paper'
import pen from './pen'
import move from './move'

function cropper(canvasId,options) {
    let me=this;
    me.options = Object.assign({move:true,select:true,zoom:true},options);

    //install to global
    if(!window.paper) {
        paper.install(window);
    }

    let canvas = (typeof canvasId ==="string")?document.getElementById(canvasId):canvasId;
    paper.setup(canvas);

    let tool = new Tool();
    let myMove = new move(tool,canvas,me.options);
    startAction();
    let myPen = new pen(tool,()=>{
        startAction();
    });

    let raster = new Raster();
    raster.position = view.center;

    function startPen() {
        stopAction();
        myPen.draw();
    }
    function startRectangle() {
        stopAction();
        myPen.drawRectangle();
    }
    function getPos(){
        if(raster.source==="data:,") return;
        let output = [];
        let x = raster.bounds.x;
        let y = raster.bounds.y;
        for(let i=0;i<project.layers[0].children.length;i++)
        {
            let item = project.layers[0].children[i]
            let realPos = [];
            if(item instanceof Path){
                let path = item;
                let minX,maxX,minY,maxY;
                for(let j=0; j < path.curves.length; j++) {
                    let point = path.curves[j].points[0];
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
                let imgPos = {
                    bounds:{x:minX,y:minY,width:boundWidth,height:boundHeight},
                    boundPos:[
                        {x:minX,y:minY},
                        {x:minX+boundWidth,y:minY},
                        {x:minX+boundWidth,y:minY+boundHeight},
                        {x:minX,y:minY+boundHeight},
                    ],
                    points:realPos
                };
                output.push(imgPos);
            }
        }
        return output;
    }
    function clear() {
        raster.position = view.center;
        paper.view.zoom = 1;
        for(var j=0;j<project.layers.length;j++){
            let layer = project.layers[j];
            for(var i=layer.children.length-1;i>0;i--){
                let item = layer.children[i]
                if(item instanceof Path) {
                    let item = layer.children[i]
                    item.remove();
                }
            }
        }
    }
    function destroy() {
        raster.clear();
        this.clear();
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
        options:me.options
    }
}
window.Cropper = cropper;
export default cropper
