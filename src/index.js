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
                for(var j=0; j < path.curves.length; j++) {
                    let point = path.curves[j].points[0];
                    //output.push({x:point.x,y:point.y})
                    var newX = (point.x  - x)/ raster.scaling.x;
                    var newY = (point.y - y) / raster.scaling.x;
                    realPos.push({x:newX,y:newY})
                    testContainer.append('<div style="left:${x}px;top:${y}px"/>'.replace("${x}",newX).replace("${y}",newY));
                }
                output.push(realPos);
            }
        }
        $("textarea").val(JSON.stringify(output));
        return output;
    }
    function loadImage(){
        //var imageElement = document.getElementById('imgOriginal');
        //raster.source  = imageElement //http://s6.sinaimg.cn/middle/5e95d7f2xb4d3a6caab75&690";
        // var newImg = new Image();
        // //newImg.setAttribute('crossOrigin', 'anonymous');
        // newImg.onload = function() {
        //     //raster.drawImage(this, 0, 0);
        //     document.getElementById("imgTest").src = this.src;
        //     var canvas = document.createElement("canvas");
        //     canvas.width =this.width;
        //     canvas.height =this.height;
        //
        //     var ctx = canvas.getContext("2d");
        //     ctx.drawImage(this, 0, 0);
        //     // var dataURL = canvas.toDataURL("image/png");
        //     // console.log(dataURL)
        // }
        // var raster = new Raster({
        //     source: "http://s6.sinaimg.cn/middle/5e95d7f2xb4d3a6caab75&690",
        //     position: view.center
        // });
    }

    function clear() {
        raster.position = view.center;
        raster.scaling.x=1;
        raster.scaling.y=1;
        paper.view.zoom = 1;
        for(var i=0;i<project.layers[0].children.length;i++){
            let item = project.layers[0].children[i]
            if(item instanceof Path) {
                item.remove();
            }
        }
    }


    document.getElementById('fileImage').onchange = function (evt) {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                var image = new Image();
                image.src = fr.result;
                image.onload = function() {
                    raster.source  =fr.result;
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


init("canvas")