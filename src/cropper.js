import paper from 'paper'
import pen from './pen'
import move from './move'

paper.install(window);
function cropper(canvasId) {
    let canvas = (typeof canvasId ==="string")?document.getElementById(canvasId):"canvasId";
    paper.setup(canvas);
    let tool = new Tool();
    tool.moveable = true;
    let myMove = new move(tool);
    myMove.start();

    let raster = new Raster();
    raster.position = view.center;

    function startPen() {
        myMove.stop();
        let myPen = new pen(tool);
        myPen.draw(()=>{
            myMove.start();
        });
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
                let imgPos = {
                    bounds:{x:minX,y:minY,width:maxX-minX,height:maxY-minY},
                    points:realPos
                };
                output.push(imgPos);
            }
        }
        return output;
    }
    function clear() {
        raster.position = view.center;
        raster.scaling.x=1;
        raster.scaling.y=1;
        paper.view.zoom = 1;
        for(var i=project.layers[0].children.length-1;i>0;i--){
            let item = project.layers[0].children[i]
            if(item instanceof Path) {
                item.remove();
            }
        }
    }
    function crop(imgPos){
        let canvas=document.createElement("CANVAS");
        canvas.width = imgPos.bounds.width;
        canvas.height = imgPos.bounds.height;
        let _ctx=canvas.getContext("2d");
        _ctx.save();
        _ctx.beginPath();
        _ctx.moveTo(imgPos.points[0].x - imgPos.bounds.x, imgPos.points[0].y - imgPos.bounds.y);
        for(let i=1;i<imgPos.points.length;i++)
        {
            _ctx.lineTo(imgPos.points[i].x - imgPos.bounds.x, imgPos.points[i].y - imgPos.bounds.y);
        }
        _ctx.clip();
        _ctx.drawImage(raster.image,imgPos.bounds.x, imgPos.bounds.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        _ctx.restore(); /// restore de
        return canvas.toDataURL()
    }
    function setImage(source) {
        let image = new Image();
        image.src = source;
        image.onload = function() {
            raster.source  = source;
            if(image.width > view.size.width)
            {
                raster.fitBounds(view.bounds, true)
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
    return {
        setImage,
        getImage,
        getPos,
        startPen,
        clear,
        crop
    }
}
window.Cropper = cropper;
export default cropper
