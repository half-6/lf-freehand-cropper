import './index.scss'
$('[data-toggle="tooltip"]').tooltip()
$('.toast').toast('show')
let cropper = new Cropper("canvas");
cropper.setImage("assets/i/ele.jpg")
let imageSource = null;
$('#btnReset').click(()=>{
    let testContainer = $(".container-pos");
    testContainer.html("");
    cropper.clear();
});
$('#btnPen').click(cropper.startPen);
$('#btnRectangle').click(cropper.startRectangle);
$('#btnPos').click(()=>{
    let imgList = cropper.getPos();
    $("textarea").val(JSON.stringify(imgList));
    let testContainer = $(".container-pos");
    let output = [];

    //testContainer.append(`<img src="${cropper.getImage()}"/>`);
    imgList.forEach(
        image=>{
            let croppedImage = cropper.crop(image);
            output.push(`<div class="item d-flex">`);
            output.push(`<a href="javascript:openImage(\'${croppedImage}\')" target="_blank" class="image-container"><img src="${croppedImage}"/></a>`);
            output.push(`<div class="image-desc">`);
            // image.points.forEach(point=>{
            //     //testContainer.append('<div style="left:${x}px;top:${y}px"/>'.replace("${x}",point.x).replace("${y}",point.y));
            //     testContainer.append(`<div>Size:${x} * 200</div>`);
            // })
            output.push(`<div>Bound</div>`);
            output.push(`<ul>`);
            output.push(`<li>   Width:${image.bounds.width}, Height: ${image.bounds.height}</li>`);
            image.boundPos.forEach(point=>{
                output.push(`<li>X:${point.x} Y:${point.y}</li>`);
            })
            // output.push(`<li>   X:${image.bounds.x}, Y:${image.bounds.y}</li>`);
            output.push(`</ul>`);
            output.push(`<div>Points:</div>`);
            output.push(`<ul>`);
            image.points.forEach(point=>{
                output.push(`<li>X:${point.x} Y:${point.y}</li>`);
            })
            output.push(`</ul>`);
            output.push(`</div>`);
            output.push(`</div>`);
        }
    )
    testContainer.html(output.join(""));
});
window.openImage = function(data){
    var image = new Image();
    image.src = data;
    var w = window.open("");
    w.document.write(image.outerHTML);
}
$('#btnUpload').change((evt)=>{
    let tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            imageSource = fr.result;
            cropper.setImage(fr.result)
        }
        fr.readAsDataURL(files[0]);
    }
})

