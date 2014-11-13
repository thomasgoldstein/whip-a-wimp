"use strict";

//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobMerchant = waw.MobRandomBouncer.extend({
    mobType: "Merchant",
    shadowYoffset: 0,
    spriteYoffset: 0,
    state: "idle",
    
    ctor: function () {
        this._super();
        console.info("MobMerchant ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "down_right":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48),
                        cc.rect(0+33*2, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48)
                    ],
                delay: 0.5
            },
            "down_left":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48),
                        cc.rect(0+33*2, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48)
                    ],
                delay: 0.5,
                flippedX: true
            },
            "up_right":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48),
                        cc.rect(0+33*2, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48)
                    ],
                delay: 0.5
            },
            "up_left":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48),
                        cc.rect(0+33*2, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48)
                    ],
                delay: 0.5,
                flippedX: true
            }
        };
        this.sprite = new waw.AnimatedSprite(s_Merchant, animData);
        this.sprite.playAnimation(this.calcAnimationFrame(0,0));

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow);
        //this.shadowSprite.setScale(1.4);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    calcAnimationFrame: function(x,y){
        var t="";
        if(Math.round(x) == 0){
            //TODO it doesnt work
            //when it moves vertically, make its left-right direction random
            x = 0.5 - Math.random();
        }
        if(Math.round(y)>0)
            t = "up_";
        else
            t = "down_";
        if(Math.round(x)<0)
             return t+"left";
        return t+"right";
    },
    update: function () {
        var currentTime = new Date();

        this.conditions = this.getConditions();

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        if(showDebugInfo && this.label) {
//            this.label.setString("" + x + "->" + this.targetX + "," + y + "->" + this.targetY + "\n" + this.state + "");
//            this.label.setString(""+this.state + "");

            //var pPos = waw.player.getPosition();
            var pos = this.getPosition();
//            this.label.setString(""+this.state + " "+ cc.pDistanceSQ(pPos, pos) );
            this.label.setString(this.mobType+"-"+pos.x.toFixed(2)+","+pos.y.toFixed(2)+"\n "+this.state+" "+this.dx.toFixed(2)+","+this.dy.toFixed(2) );
        }
    }
})
;