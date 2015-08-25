/// <reference path="typings/tsd.d.ts" />
requirejs.config({
    basepath: window.location.pathname.replace('/', ''),
    urlArgs: 'v=' + (new Date()).getTime(),
});
require(['illuminator'], function (illuminator) {
    (new illuminator(window.innerWidth, window.innerHeight)).start();
});
//# sourceMappingURL=require.config.js.map