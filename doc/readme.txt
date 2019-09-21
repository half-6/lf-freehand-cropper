# release steps
npm version patch
update version on public/index.html
npm run release
npm run build-demo
npm publish --access=public

# local test steps
npm pack
npm install D:\codes\linkfuture\lf-freehand-cropper\linkfuture-cropper-0.0.9.tgz
