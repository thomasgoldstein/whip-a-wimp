"use strict";

waw.deepCopy = function(o) {
    var copy = o,k;

    if (o && typeof o === 'object') {
        copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
        for (k in o) {
            copy[k] = waw.deepCopy(o[k]);
        }
    }
    return copy;
};

//prowide width and height of the spritesheet frame
//and get a function that returns correct frame rect by its COLUMN, ROW
waw.SpriteRect = function(w, h) {
    return function(x , y) {
        return cc.rect(1+(w+2)*x, 1+(h+2)*y, w, h);
    };
};
