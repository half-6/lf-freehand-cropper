# LF Freehand image cropper
Freehand image cropper built with HTML5 canvas

## Demo
https://cyokin.github.io/lf-freehand-cropper/ 
![Alt Text](demo/cropper.gif)
## Project setup
```
npm install @linkfuture/cropper
import Cropper from './cropper'
let cropper = new Cropper("canvas",{move:true,select:true,zoom:true}); //canvas id or canvas object
cropper.setImage("<backgaround image source>");//backgaround image source, url or base64 image string
cropper.getImage(); //get image source
cropper.startPen(); //start crop by using pen 
cropper.getPos();   //get position list of cropper 
cropper.clear();    //clear all drawing, but for the image
cropper.crop(imgPos);  //get croppered image by passing image position, which given by cropper.getPos()
cropper.options;  //set or set options

```

### Compiles and minifies for production
```
npm run release //generate cropper.min.js
npm run start   //start local demo
```

### Freehand image cropper release package
download [here](lib/lf-cropper.min.js)
