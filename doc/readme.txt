# release steps
npm version patch
update version on public/index.html
npm run release
npm run build-demo
npm publish --access=public
