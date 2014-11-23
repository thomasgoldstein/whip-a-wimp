"use strict";

waw.Whip = waw.Unit.extend({
    itemType: "whip",
    sprite: null,
    speed: 1,
    movement: null,
    direction: null,
    dx: 0,
    dy: 0,
    targetX: 160,
    targetY: 110,
    shadowYoffset: 0,
    spriteYoffset: 0,
    chainLength: 5,
    chain: [],
    ctor: function (itemT) {
        this._super();
        //console.info("Whip ctor "+itemT);
        //this.setContentSize(8, 8);

        var chainBase = this;
        for(var i=0; i<this.chainLength; i++) {
            var sprite = new cc.Sprite(s_Whip, cc.rect(0, 0, 7, 15));
            //sprite.setAnchorPoint(0.5, 0);
            if(i>0)
                sprite.setPosition(3.5,14);
            sprite.setAnchorPoint(0.5, 0);
            chainBase.addChild(sprite, 0, TAG_WHIP);
            chainBase = sprite;
        }

        this.init();
        this.scheduleUpdate();
    },
    init: function() {
        var chainBase = this;
        for(var i=0; i<this.chainLength; i++) {
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            if(Math.random() > 0.5)
                sprite.rotation = 1;
            else
                sprite.rotation = 359;
            chainBase = sprite;
        }
    },
    update: function () {
        var chainBase = this;
        var r = 0;
        for(var i=0; i<this.chainLength; i++) {
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            r = sprite.rotation + sprite.getParent().rotation;
            if(r>360)
                r -= 360;
            else if(r<0)
                r += 360;
            if(r > 180)
                sprite.rotation -= (1 - i * 0.2 * this.chainLength);
            else if(r < 180)
                sprite.rotation += (1 - i * 0.2 * this.chainLength);
            chainBase = sprite;
        }
        //if(this.rotation > 180)
        //    this.rotation -= 1;
        //else if(this.rotation < 180)
        //    this.rotation += 1;
        ////check conditions
        //var pPos = waw.player.getPosition();
        //var pos = this.getPosition();
        //if (cc.pDistanceSQ(pPos, pos) < 200) {
        //        this.onTake();
        //        this.init();
        //}
    },
    onTake: function () {
    },
    onUse: function () {
        //player uses item
    },
    onTouch: function () {
        //player touchs item on the floor (do we need it?)
    },
    onDestroy: function () {
        //what if the item has been destroyed by some forCe
    }
})
;