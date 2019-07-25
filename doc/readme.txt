# release steps
npm version patch
npm run release
npm run build-demo
npm publish --access=public

