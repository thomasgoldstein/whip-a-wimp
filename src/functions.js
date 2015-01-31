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

