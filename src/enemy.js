"use strict";
waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 1.75,
    movement: null,
    direction: null,
    alive: null,
    state: "idle",
    ctor: function() {
        this._super();
        console.info("Enemy ctor");
        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);
//        this.speed = 0.75; //??

        this.sprite = cc.Sprite.create(s_EnemyPlain,
            cc.rect(Math.floor(waw.rand()*3)*32, 0, 32, 32));

        this.addChild(this.sprite);
        this.alive = true;
    },

    update: function(env) {
        var pos = this.getPosition(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;
        //AI plug
        if(Math.random()<0.5)
        {
            if(Math.random()<0.5)
                y -= this.speed;
            else
                y += this.speed;
        }
        if(Math.random()<0.3)
        {
            if(Math.random()<0.5)
                x -= this.speed;
            else
                x += this.speed;
        }
       //check collision with obstacles
       if(this.doesCollide(env.units)) {
            this.setPosition(oldPos);
            //this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
        } else
        this.setPosition(x, y);
        //TODO 1.make enemy not stuck 2.check collision with other foes

        //Z Index
        this.setZOrder(250 - y);
    }
});