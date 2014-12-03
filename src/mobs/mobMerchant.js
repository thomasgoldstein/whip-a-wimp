"use strict";

//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobMerchant = waw.MobRandomWalker.extend({
    mobType: "Merchant",
    shadowYoffset: 0,
    spriteYoffset: 0,
    state: "idle",
    
    ctor: function () {
        this._super();
        //console.info("MobMerchant ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "walk_down_right":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48),
                        cc.rect(0+33*2, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48)
                    ],
                delay: 0.3
            },
            "walk_down_left":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48),
                        cc.rect(0+33*2, 0, 32, 48),
                        cc.rect(0+33*1, 0, 32, 48)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "walk_up_right":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48),
                        cc.rect(0+33*2, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48)
                    ],
                delay: 0.3
            },
            "walk_up_left":
            {
                frameRects:
                    [
                        cc.rect(0+33*0, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48),
                        cc.rect(0+33*2, 0+49*1, 32, 48),
                        cc.rect(0+33*1, 0+49*1, 32, 48)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "rolling_down":
            {
                frameRects:
                    [
                        cc.rect(0+33*1, 0+49*0, 32, 48),
                        cc.rect(0+33*0, 0+49*0, 32, 48)
                    ],
                delay: 2,
                mirrorX: true
            },
            "rolling_up":
            {
                frameRects:
                    [
                        cc.rect(0+33*1, 0+49*1, 32, 48),
                        cc.rect(0+33*0, 0+49*1, 32, 48)
                    ],
                delay: 2,
                mirrorX: true
            }
        };
        animData["follow_up_left"] = animData["walk_up_left"];
        animData["follow_up_right"] = animData["walk_up_right"];
        animData["follow_down_left"] = animData["walk_down_left"];
        animData["follow_down_right"] = animData["walk_down_right"];
        animData["bounce_up_left"] = animData["walk_up_left"];
        animData["bounce_up_right"] = animData["walk_up_right"];
        animData["bounce_down_left"] = animData["walk_down_left"];
        animData["bounce_down_right"] = animData["walk_down_right"];

        animData["idle_up_left"] = animData["rolling_up"];
        animData["idle_up_right"] = animData["rolling_up"];
        animData["idle_down_left"] = animData["rolling_down"];
        animData["idle_down_right"] = animData["rolling_down"];

        this.sprite = new waw.AnimatedSprite(s_Merchant, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.state+"_"+this.direction);

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    update: function () {
        var currentTime = new Date();

        this.conditions = this.getConditions();

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        if(showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1)+","+this.y.toFixed(1)+" DX:"+this.dx.toFixed(1)+", DY"+this.dy.toFixed(1)+
            "\n"+this.mobType+" "+this.state+"_"+this.direction );
        }
    }
})
;