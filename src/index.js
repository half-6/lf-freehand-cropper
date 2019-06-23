import paper from 'paper'
import pen from './pen'
import move from './move'

paper.install(window);

function init(canvasId) {
    let canvas = document.getElementById(canvasId);
    paper.setup(canvas);
    let tool = new Tool();
    tool.moveable = true;
    let myMove = new move(tool);
    myMove.start();

    var imageElement = document.getElementById('imgOriginal');
    var raster = new Raster(imageElement);
    raster.position = view.center;
    loadImage();

    $('#btnReset').click(clear);
    $('#btnPen').click(startDraw);
    $('#btnGetPos').click(getPos);

    function startDraw() {
        myMove.stop();
        let myPen = new pen(tool);
        myPen.draw(()=>{
            myMove.start();
        });
    }
    function getPos(){
        if(raster.source==="data:,") return
        var testContainer = $("#test");
        testContainer.html("");
        testContainer.append(`<img src="${raster.source}"/>`);
        var output = [];
        var x = raster.bounds.x;
        var y = raster.bounds.y;
        for(var i=0;i<project.layers[0].children.length;i++)
        {
            let item = project.layers[0].children[i]
            var realPos = [];
            if(item instanceof Path){
                let path = item;
                let minX,maxX,minY,maxY;
                for(var j=0; j < path.curves.length; j++) {
                    let point = path.curves[j].points[0];
                    //output.push({x:point.x,y:point.y})
                    var newX = (point.x  - x)/ raster.scaling.x;
                    var newY = (point.y - y) / raster.scaling.x;
                    realPos.push({x:newX,y:newY})
                    if(!minX || minX>newX) minX = newX;
                    if(!maxX || maxX<newX) maxX = newX;
                    if(!minY || minY>newY) minY = newY;
                    if(!maxY || maxY<newY) maxY = newY;
                    testContainer.append('<div style="left:${x}px;top:${y}px"/>'.replace("${x}",newX).replace("${y}",newY));
                }
                let imgPos = {
                    bounds:{x:minX,y:minY,width:maxX-minX,height:maxY-minY},
                    points:realPos
                };
                output.push(imgPos);
                let croppedImage = crop(imgPos);
                testContainer.append(`<img src="${croppedImage}"/>`);

            }
        }
        $("textarea").val(JSON.stringify(output));
        return output;
    }
    function loadImage(){
        document.getElementById('fileImage').onchange = function (evt) {
            var tgt = evt.target || window.event.srcElement,
                files = tgt.files;
            if (FileReader && files && files.length) {
                var fr = new FileReader();
                fr.onload = function () {
                    var image = new Image();
                    image.src = fr.result;
                    image.onload = function() {
                        raster.source  = fr.result;
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
                fr.readAsDataURL(files[0]);
            }
        }
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
}


init("canvas")