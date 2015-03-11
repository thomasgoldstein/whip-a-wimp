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
    chainLength: 2,
    chainLengthMax: 5,
    chain: [],

    WHIP_HIT1: [
        {rotation: -5, rotation2: 3, step: 10},
        {rotation: 5, rotation2: 4, step: 12},
        {rotation: 20, rotation2: 8, step: 15},
        {rotation: 0, rotation2: 11, step: 17},
        {rotation: 0, rotation2: 16, step: 20}
    ],
    WHIP_HIT2: [
        {rotation: 5, rotation2: 3, step: 10},
        {rotation: -5, rotation2: 4, step: 12},
        {rotation: -20, rotation2: 8, step: 15},
        {rotation: 0, rotation2: 11, step: 17},
        {rotation: 0, rotation2: 16, step: 20}
    ],
    //==============
    WHIP_DOWN1: [
        {rotation: 0, rotation2: 3, step: 50},
        {rotation: 1, rotation2: 4, step: 30},
        {rotation: 2, rotation2: 8, step: 20},
        {rotation: 3, rotation2: 11, step: 10},
        {rotation: 5, rotation2: 16, step: 5}
    ],
    WHIP_DOWN2: [
        {rotation: 0, rotation2: 3, step: 50},
        {rotation: -1, rotation2: 4, step: 30},
        {rotation: -2, rotation2: 8, step: 20},
        {rotation: -3, rotation2: 11, step: 10},
        {rotation: -5, rotation2: 16, step: 5}
    ],
    //==============
    WHIP_GROUNDL: [
        {rotation: -40, rotation2: 3, step: 5 },
        {rotation: 30, rotation2: 4, step: 3},
        {rotation: 10, rotation2: 8, step: 2},
        {rotation: 0, rotation2: 11, step: 1},
        {rotation: 0, rotation2: 16, step: 1}
    ],
    WHIP_GROUNDR: [
        {rotation: 40, rotation2: 3, step: 5},
        {rotation: -35, rotation2: 4, step: 3},
        {rotation: -10, rotation2: 8, step: 2},
        {rotation: 0, rotation2: 11, step: 1},
        {rotation: 0, rotation2: 16, step: 1}
    ],
    //==============
    WHIP_HIT_UP: [
        {rotation: -10, rotation2: 3, step: 10 },
        {rotation: -5, rotation2: 4, step: 10},
        {rotation: -5, rotation2: 8, step: 15},
        {rotation: 0, rotation2: 11, step: 15},
        {rotation: 0, rotation2: 16, step: 20}
    ],
    WHIP_HIT_DOWNN: [
        {rotation: 10, rotation2: 3, step: 10},
        {rotation: 5, rotation2: 4, step: 10},
        {rotation: 5, rotation2: 8, step: 15},
        {rotation: 0, rotation2: 11, step: 15},
        {rotation: 0, rotation2: 16, step: 20}
    ],
    //================
    WHIP_BACK1: [
        {rotation: -115, rotation2: 6, step: 5},
        {rotation: -130, rotation2: 5, step: 10},
        {rotation: -135, rotation2: 4, step: 15},
        {rotation: -150, rotation2: 6, step: 10},
        {rotation: -150, rotation2: 6, step: 15}
    ],
    WHIP_BACK2: [
        {rotation: 115, rotation2: 6, step: 5},
        {rotation: 130, rotation2: 5, step: 10},
        {rotation: 135, rotation2: 4, step: 15},
        {rotation: 150, rotation2: 6, step: 10},
        {rotation: 150, rotation2: 6, step: 15}
    ],
    ctor: function (itemT) {
        this._super();

        //this.setAllTo(0, 5, 1);
        //console.info("Whip ctor "+itemT);
        //this.setContentSize(8, 8);

        var chainBase = this;
        var sprite;
        for (var i = 0; i < this.chainLengthMax; i++) {
            if (i === 0)
                sprite = new cc.Sprite(waw.gfx.weapons, cc.rect(0, 0, 7, 15));
            else if (i >= this.chainLengthMax - 1)
                sprite = new cc.Sprite(waw.gfx.weapons, cc.rect(0, 16 * 2, 7, 15));
            else
                sprite = new cc.Sprite(waw.gfx.weapons, cc.rect(0, 16 * 1, 7, 15));
            //sprite.setAnchorPoint(0.5, 0);
            if (i > 0)
                sprite.setPosition(3.5, 1);
            sprite.setAnchorPoint(0.5, 1);
            if(i >= this.chainLength)
                sprite.visible = false;
            chainBase.addChild(sprite, 0, TAG_WHIP);
            chainBase = sprite;
        }

        this.init();
    },
    init: function () {
        var chainBase = this;
        this.chain = [];
        for (var i = 0; i < this.chainLengthMax; i++) {
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
        this.scheduleUpdate();
    },
    setAllTo: function (rot, rot2) {
        var a = [];
        for (var i = 0; i < this.chainLengthMax; i++) {
            a.push({rotation: rot, step: 1, rotation2: rot2});
        }
        this.chain = a;
    },
    setTo: function (a) {
        this.chain = [];
        for (var i = 0; i < this.chainLengthMax; i++) {
            this.chain.push(a[i]);
        }
    },
    setInstantlyTo: function (a) {
        this.chain = [];
        var chainBase = this;
        for (var i = 0; i < this.chainLengthMax; i++) {
            this.chain.push(a[i]);
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            sprite.rotation = this.chain[i].rotation;
            chainBase = sprite;
        }
    },
    getHitPosition: function() {
        var chainBase = this;
        for (var i = 0; i < this.chainLength; i++) {
            var sprite = chainBase.getChildByTag(TAG_WHIP);
            chainBase = sprite;
        }
        return chainBase.convertToWorldSpace(chainBase.getPosition());
    },
    addLink: function () {
        if (this.chainLength < this.chainLengthMax) {
            this.chainLength++;
            var chainBase = this;
            for (var i = 0; i < this.chainLength; i++) {
                var sprite = chainBase.getChildByTag(TAG_WHIP);
                sprite.visible = true;
                chainBase = sprite;
            }
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
                    sprite.rotation += this.chain[i].step + Math.random()*1;
                else if (sprite.rotation > this.chain[i].rotation + this.chain[i].step)
                    sprite.rotation -= this.chain[i].step + Math.random()*1;
                chainBase = sprite;
                //sprite.rotation += -3 + Math.random()*6;
            }
    }
});