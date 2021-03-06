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

//pick random item from array
waw.pickRandomArray = function(a) {
    if(a.length<1)
        return null;
    return a[Math.round(Math.random()*(a.length-1))];
};
//random X Y coords in the room
waw.pickSafeRandomX = function() {
    return Math.round(50 + Math.random() * 220);
};
waw.pickSafeRandomY = function() {
    return Math.round(40 + Math.random() * 130);
};

waw.pickRandomEdgeCoord = function() {
    var x,y;
    if(Math.random()<0.5){
        x = Math.round(Math.random()*320);
        y = Math.round()<0.5 ? 0 : 240;
    } else {
        y = Math.round(Math.random()*240);
        y = Math.round()<0.5 ? 0 : 320;
    }
    return cc.p(x,y);
};

waw.pickPlayersBackCoord = function(obj, n) {
    var x = obj.x, y = obj.y;
    var px = waw.player.x, py = waw.player.y;
    if(x < px)
        x = px + n;
    else
        x = px - n;
    if(y < py)
        y = py + n;
    else
        y = py - n;
    return cc.p(x,y);
};

waw.RandomPlusMinus = function(n) {
    return n - Math.round(Math.random()*2*n);
};

//prowide width and height of the spritesheet frame
//and get a function that returns correct frame rect by its COLUMN, ROW
waw.SpriteRect = function(w, h) {
    return function(x , y) {
        return cc.rect(1+(w+2)*x, 1+(h+2)*y, w, h);
    };
};

waw.makeSpriteJump = function(sprite) {
    sprite.runAction(
        new cc.RepeatForever(
            new cc.Sequence(
                new cc.JumpBy(0.3, 0, 0, 2, 1),
                new cc.JumpBy(0.2, 0, 0, 1, 1),
                new cc.DelayTime(1 + Math.random() * 3)
            )
        )
    )
};

waw.wipeMobsItemsOffScreen = function() {
    for (var i = 0; i < waw.mobs.length; i++) {
        if (waw.mobs) {
            waw.mobs[i].shadowSprite.visible = false;
            waw.mobs[i].sprite.runAction(new cc.MoveTo(0.5 + Math.random(), waw.mobs[i].x < 160 ? -40 : 360, waw.mobs[i].y < 120 ? -40 : 280));
            waw.mobs[i].runAction(new cc.RotateBy(0.5 + Math.random(), Math.random() < 0.5 ? -180 : 180));
        }
    }
    for (var i = 0; i < waw.items.length; i++) {
        if (waw.items) {
            waw.items[i].shadowSprite.visible = false;
            waw.items[i].sprite.runAction(new cc.MoveTo(0.5 + Math.random(), waw.items[i].x < 160 ? -40 : 360, waw.items[i].y < 120 ? -40 : 280));
            waw.items[i].runAction(new cc.RotateBy(0.5 + Math.random(), Math.random() < 0.5 ? -180 : 180));
        }
    }
};