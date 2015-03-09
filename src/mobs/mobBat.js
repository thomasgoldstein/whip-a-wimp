"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobBat = waw.MobRandomWalker.extend({
    mobType: "Bat",
    shadowYoffset: 4,
    spriteYoffset: 24,
    HP: 1,
    state: "idle",
    sfx_hurt01: sfx_MerchHurt01,
    sfx_hurt02: sfx_MerchHurt02,
    sfx_death: sfx_Ouch03,

    ctor: function () {
        this._super();

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 3+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var animData =
        {
            "idle":
            {
                frameRects:
                    [
                        cc.rect(1+34*0, 1, 32, 24)
                    ],
                delay: 5+Math.random()*2
            },
            "walk":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24),
                        cc.rect(1+34*3, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24)
                    ],
                delay: 0.07
            },
            "hurt":
            {
                frameRects:
                    [
                        cc.rect(1+34*1, 1, 32, 24),
                        cc.rect(1+34*2, 1, 32, 24)
                    ],
                delay: 0.1
            }
        };
        animData["follow"] = animData["walk"];
        animData["attack"] = animData["hurt"];

        this.sprite = new waw.AnimatedSprite(s_Bat, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow12x6);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },
    getAnimationName: function() {
        return this.state;
    },
    getAnimationNameHurt: function() {
        return "hurt";
    },
    getVisualConditions: function (conditions) {
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        //if (cc.pDistanceSQ(pPos, pos) < 1000) {
        //    conditions.push("seeEnemy");
            if (cc.pDistanceSQ(pPos, pos) < 300) {
                conditions.push("canAttack");
            }
        //}
    },

    initIdle: function () {
        var currentTime = new Date();
        //stop
        this.timeToThink = currentTime.getTime() + 100 + Math.random() * 500;
        this.targetX = this.targetY = 0;
        var x, y;

        if (this.safePos.y != 0) {
            x = this.safePos.x;
            y = this.safePos.y;
        } else {
            var pos = this.getPosition();
            x = pos.x;
            y = pos.y;
        }
        this.setPosition(x, y);   //was a bug with Y ever shifting down. REMOVE?
        //not default for bats!
        if(y > 150)
            this.setZOrder(600 - y);    //to be over the upper wall
        else
            this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y + this.shadowYoffset);
        //TODO it doesnt slow
        //this.direction
        this.sprite.playAnimation(this.getAnimationName());

        //this.sprite.setPosition(0,this.spriteYoffset);
        this.sprite.runAction(new cc.MoveTo(0.5, 0,this.spriteYoffset*3));
        if(Math.random()<0.5)
            this.sprite.runAction(new cc.RotateTo(0.25, -180));
        else
            this.sprite.runAction(new cc.RotateTo(0.25, 180));
        this.shadowSprite.runAction(new cc.ScaleTo(0.5, 0.7));
        return true;
    },
    initWalk: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 500 + Math.random() * 1500;
        if (this.targetX == 0 || this.targetY == 0) {
            //random point to go
            this.targetX = this.toSafeXCoord( Math.round(50 + Math.random() * 220) );
            this.targetY = this.toSafeYCoord( Math.round(50 + Math.random() * 130) );
        } else {
            this.targetX = this.toSafeXCoord( this.targetX + Math.round(50 - Math.random() * 100));
            this.targetY = this.toSafeYCoord( this.targetY + Math.round(40 - Math.random() * 80));
        }
        this.calcDirection(this.targetX - this.x,this.targetY - this.y);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.runAction(new cc.MoveTo(0.5, 0,this.spriteYoffset));
        this.sprite.runAction(new cc.RotateTo(0.25, 0));
        this.shadowSprite.runAction(new cc.ScaleTo(0.5, 1.0));
        return true;
    },
    initAttack: function () {
        var currentTime = new Date();
        //stop
        this.timeToThink = currentTime.getTime() + 1000 + Math.random() * 50;
        this.targetX = this.targetY = 0;
        var x, y;

        if (this.safePos.y != 0) {
            x = this.safePos.x;
            y = this.safePos.y;
        } else {
            var pos = this.getPosition();
            x = pos.x;
            y = pos.y;
        }
        this.setPosition(x, y);   //was a bug with Y ever shifting down. REMOVE?
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y + this.shadowYoffset);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.runAction(new cc.MoveTo(0.5, 0,this.spriteYoffset));
        this.sprite.runAction(new cc.RotateTo(0.25, 0));
        this.shadowSprite.runAction(new cc.ScaleTo(0.5, 1.0));
        return true;
    },
    onGetDamage : function (killer) {
        if (this.state === "idle")  //idling bats are invincible
            return;
        if (this.subState === "invincible")
            return;
        if (this.subState === "dead")
            return;

        this.becomeInvincible(1000);
        this.HP--;

        this.state = "hurt";
        this.stateSchedule = this.SCHEDULE_HURT;
        this.stateSchedule.reset();

        if(this.HP <= 0)
            this.onDeath(killer);
        else {
            if(Math.random()<0.5)
                cc.audioEngine.playEffect(this.sfx_hurt01);
            else
                cc.audioEngine.playEffect(this.sfx_hurt02);
        }
    },
    update: function () {
        var currentTime = new Date();

        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.state !== "idle" && this.conditions.indexOf("canAttack")>=0) {
            console.log("mob attacks player 0b");
            this.state = "attack";
            this.stateSchedule = this.SCHEDULE_ATTACK;
            this.stateSchedule.reset();

            waw.player.onGetDamage(this);
        }

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if(showDebugInfo && this.label) {
            this.label.setString(this.x.toFixed(1)+","+this.y.toFixed(1)+" DX:"+this.dx.toFixed(1)+", DY"+this.dy.toFixed(1)+
            "\n"+this.mobType+" "+this.state+" "+this.subState+" "+this.direction );
        }
    }
})
;