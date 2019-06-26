let cropper = new Cropper("canvas");
let imageSource = null;
$('#btnReset').click(cropper.clear);
$('#btnPen').click(cropper.startPen);
$('#btnRectangle').click(cropper.startRectangle);
$('#btnGetPos').click(()=>{
    let imgList = cropper.getPos();
    $("textarea").val(JSON.stringify(imgList));
    let testContainer = $("#test");
    testContainer.html("");
    testContainer.append(`<img src="${cropper.getImage()}"/>`);
    imgList.forEach(
        image=>{
            let croppedImage = cropper.crop(image);
            image.points.forEach(point=>{
                testContainer.append('<div style="left:${x}px;top:${y}px"/>'.replace("${x}",point.x).replace("${y}",point.y));
            })
            testContainer.append(`<img src="${croppedImage}"/>`);
        }
    )

});
$('#fileImage').change((evt)=>{
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

