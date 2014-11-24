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

    WHIP_HIT1: [
        {rotation: 2, rotation2: 3, step: 10},
        {rotation: 3, rotation2: 4, step: 15},
        {rotation: 8, rotation2: 8, step: 20},
        {rotation: 10, rotation2: 11, step: 25},
        {rotation: 15, rotation2: 16, step: 30}
    ],
    WHIP_HIT2: [
        {rotation: -2, rotation2: 3, step: 10},
        {rotation: -3, rotation2: 4, step: 15},
        {rotation: -8, rotation2: 8, step: 20},
        {rotation: -10, rotation2: 11, step: 25},
        {rotation: -15, rotation2: 16, step: 30}
    ],
    WHIP_BACK1: [
        {rotation: -115, rotation2: 6, step: 5},
        {rotation: -30, rotation2: 5, step: 10},
        {rotation: -35, rotation2: 4, step: 15},
        {rotation: -50, rotation2: 6, step: 20},
        {rotation: -75, rotation2: 6, step: 25}
    ],
    WHIP_BACK2: [
        {rotation: 115, rotation2: 6, step: 5},
        {rotation: 30, rotation2: 5, step: 10},
        {rotation: 35, rotation2: 4, step: 15},
        {rotation: 50, rotation2: 6, step: 20},
        {rotation: 75, rotation2: 6, step: 25}
    ],
    ctor: function (itemT) {
        this._super();

        //this.setAllTo(0, 5, 1);
        //console.info("Whip ctor "+itemT);
        //this.setContentSize(8, 8);

        var chainBase = this;
        var sprite;
        for (var i = 0; i < this.chainLength; i++) {
            if (i === 0)
                sprite = new cc.Sprite(s_Whip, cc.rect(0, 0, 7, 15));
            else if (i >= this.chainLength - 1)
                sprite = new cc.Sprite(s_Whip, cc.rect(0, 16 * 2, 7, 15));
            else
                sprite = new cc.Sprite(s_Whip, cc.rect(0, 16 * 1, 7, 15));
            //sprite.setAnchorPoint(0.5, 0);
            if (i > 0)
                sprite.setPosition(3.5, 1);
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
    setInstantlyTo: function (a) {
        this.chain = [];
        var chainBase = this;
        for (var i = 0; i < this.chainLength; i++) {
            this.chain.push(a[i]);
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            sprite.rotation = this.chain[i].rotation;
            chainBase = sprite;
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