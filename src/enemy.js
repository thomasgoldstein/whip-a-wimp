"use strict";
waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 0,
    movement: null,
    direction: null,
    alive: null,
    ctor: function() {
        this._super();
        console.info("Enemy ctor");
        this.setContentSize(new cc.Size(16, 16));
        this.setAnchorPoint(new cc.Point(0, -1));
        this.speed = 0.75; //??

        this.sprite = cc.Sprite.create(s_EnemyPlain,
            cc.rect(Math.floor(waw.rand()*3)*32, 0, 32, 32));

        this.addChild(this.sprite);
        this.alive = true;
    },

    update: function() {
        var pos = this.getPosition();

        //var animKey = this.getState() + "_" + this.getDirection();
        //this.sprite.;
        if(Math.random()<0.3)
        {
            if(Math.random()<0.5)
                pos.y--;
            else
                pos.y++;
        }
        if(Math.random()<0.3)
        {
            if(Math.random()<0.5)
                pos.x--;
            else
                pos.x++;
        }

        this.setPosition(pos);
        //Z Index
        this.setZOrder(250- pos.y);
    }
});