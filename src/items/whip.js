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

        //this.setAllTo(0, 5, 1);
        //console.info("Whip ctor "+itemT);
        //this.setContentSize(8, 8);

        var chainBase = this;
        for(var i=0; i<this.chainLength; i++) {
            var sprite = new cc.Sprite(s_Whip, cc.rect(0, 0, 7, 15));
            //sprite.setAnchorPoint(0.5, 0);
            if(i>0)
                sprite.setPosition(3.5,1);
            sprite.setAnchorPoint(0.5, 1);
            chainBase.addChild(sprite, 0, TAG_WHIP);
            chainBase = sprite;
        }

        this.init();
        this.scheduleUpdate();
    },
    init: function () {
        var chainBase = this;
        this.chain = [];
        for (var i = 0; i < this.chainLength; i++) {
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            if (Math.random() > 0.5) {
                sprite.rotation = 1;
                this.chain.push({rotation: sprite.rotation, rotation2: sprite.rotation, step: 1});
            } else {
                sprite.rotation = 0;
                this.chain.push({rotation: sprite.rotation, rotation2: sprite.rotation, step: 1});
            }
            chainBase = sprite;
        }
    },
    setAllTo: function (rot, rot2) {
        var a = [];
        for (var i = 0; i < this.chainLength; i++) {
            a.push({rotation: rot, step: 1, rotation2: rot2});
        }
        this.chain = a;
    },
    setTo: function (a) {
        this.chain = [];
        for (var i = 0; i < this.chainLength; i++) {
            this.chain.push(a[i]);
        }
    },
    update: function () {
        var chainBase = this;
        var r = 0;
        if (!this.chanin)
            for (var i = 0; i < this.chainLength; i++) {
                var sprite = chainBase.getChildByTag(TAG_WHIP);
                r = sprite.getParent().rotation;
                if (sprite.rotation < this.chain[i].rotation - this.chain[i].step)
                    sprite.rotation += this.chain[i].step;
                else if (sprite.rotation > this.chain[i].rotation + this.chain[i].step)
                    sprite.rotation -= this.chain[i].step;
                chainBase = sprite;
            }
        /*for(var i=0; i<this.chainLength; i++) {
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
        */
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
    update2: function () {
        var chainBase = this;
        var r = 0;
        for (var i = 0; i < this.chainLength; i++) {
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            r = sprite.rotation + sprite.getParent().rotation;
            if (r > 360)
                r -= 360;
            else if (r < 0)
                r += 360;
            if (r > 180)
                sprite.rotation -= (1 - i * 0.2 * this.chainLength);
            else if (r < 180)
                sprite.rotation += (1 - i * 0.2 * this.chainLength);
            chainBase = sprite;
        }
    }
});