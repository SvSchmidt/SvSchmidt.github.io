/// <reference path="typings/tsd.d.ts" />

requirejs.config(<any>{
    basepath: window.location.pathname.replace('/', ''),
    urlArgs: 'v=' + (new Date()).getTime(),
});

require(['illuminator'], (illuminator: any) => {
    (new illuminator(window.innerWidth, window.innerHeight)).start();
});