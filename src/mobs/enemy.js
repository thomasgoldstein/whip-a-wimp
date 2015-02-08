"use strict";

//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.Enemy = waw.Unit.extend({
    mobType: "unknown",
    sprite: null,
    speed: 1,
    dx: 1,
    dy: -1,
    targetX: 160,
    targetY: 110,
    shadowYoffset: 4,
    spriteYoffset: -4,
    safePos: null,  //TODO revise? why for
    HP: 1,
//    state: "idle",
    stateSchedule: null,
    conditions: [],
    timeToThink: 0,
    sfx_hurt: sfx_Punch01,
    sfx_dead: sfx_Candelabre01,
    ctor: function () {
        this._super();
        //console.info("Enemy ctor");

        this.SCHEDULE_IDLE = new waw.Schedule([this.initIdle, this.onIdle], ["seeEnemy"]);
        this.SCHEDULE_ATTACK = new waw.Schedule([this.initAttack, this.onAttack], []);
        this.SCHEDULE_HURT = new waw.Schedule([this.initHurt, this.onHurt], ["none"]);
        this.SCHEDULE_WALK = new waw.Schedule([this.initWalk, this.onWalk], ["feelObstacle","seeEnemy"]);
        this.SCHEDULE_BOUNCE = new waw.Schedule([this.initBounce, this.onBounce], ["feelObstacle","seeEnemy"]);
        this.SCHEDULE_FOLLOW = new waw.Schedule([this.initFollowEnemy, this.onFollowEnemy], ["feelObstacle"]);

        this.setContentSize(16, 16);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        //add debug text info under a mob
        this.label = new cc.LabelTTF("Mob", "System", 9);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(0, -16);
        this.label.setVisible(showDebugInfo);

        this.state = "idle";
        this.calcDirection(0, 0);
        this.stateSchedule = this.SCHEDULE_IDLE;
    },
    calcDirection: function(dx, dy){
        var t="";
        if(dy>0)
            t = "up_";
        else
            t = "down_";
        if(Math.round(dx) == 0){
            //TODO it doesnt work
            //when it moves vertically, make its left-right direction random
            dx = 0.5 - Math.random();
        }
        if(dx<0)
             t += "left";
        else
             t += "right";
        this.direction = t;
    },
    getVisualConditions: function (conditions) {
        // might add "seeEnemy" "seeItem" "canAttack"
        //if(cc.p.dis)
        //conditions.push("seeItem");
        var pPos = waw.player.getPosition();
        var pos = this.getPosition();
        if (cc.pDistanceSQ(pPos, pos) < 2000) {
            conditions.push("seeEnemy");
            if (cc.pDistanceSQ(pPos, pos) < 500) {
                conditions.push("canAttack");
            }

        }
    },
    getSensorsConditions: function (conditions) {
        // might add "feelObstacle"
        if (this.doesCollide(waw.units))
            conditions.push("feelObstacle");
    },
    getConditions: function () {
        var conditions = [];
        this.getVisualConditions(conditions);
        this.getSensorsConditions(conditions);

        conditions.push("canWalk"); //always possible
        return conditions;
    },
    pickAISchedule: function () {
        switch (this.state) {
            case "idle":
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                if (Math.random() < 0.7) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else if (Math.random() < 0.3) {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
                }
                break;
            case "attack":
                this.state = "idle";
                this.stateSchedule = this.SCHEDULE_IDLE;
                console.log("mob attacks player end");
                break;
            case "hurt":
                this.state = "follow";
                this.stateSchedule = this.SCHEDULE_FOLLOW;
                this.stateSchedule.reset();
                this.speed += 1;
                console.log("mobs hurt stat end");
                break;
            case "walk":
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    //console.log("seeEnem - follow");
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                if (Math.random() < 0.3) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
                }
                break;
            case "bounce":
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                if (Math.random() < 0.3) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
                }
                break;
            case "follow":
                if(this.conditions.indexOf("canAttack")>=0) {
                    this.state = "attack";
                    this.stateSchedule = this.SCHEDULE_ATTACK;
                    this.stateSchedule.reset();
                    break;
                }
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                this.state = "idle";
                this.stateSchedule = this.SCHEDULE_IDLE;
                break;
            default:
                this.state = "idle";
                this.stateSchedule = this.SCHEDULE_IDLE;
        }
    },
    update: function () {
        var currentTime = new Date();
        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.conditions.indexOf("canAttack")>=0) {
            this.state = "attack";
            this.stateSchedule = this.SCHEDULE_ATTACK;
            this.stateSchedule.reset();
        }

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        this.checkSubState();

        if(showDebugInfo && this.label) {
            this.label.setString(this.mobType+"-"+this.x.toFixed(1)+","+this.y.toFixed(1)+"\n "+this.state+" "+this.dx.toFixed(1)+","+this.dy.toFixed(1) );
        }
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
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y + this.shadowYoffset);
        //TODO it doesnt slow
        //this.direction
        this.sprite.playAnimation(this.state+"_"+this.direction);
        return true;
    },
    onIdle: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
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
        this.sprite.playAnimation(this.state+"_"+this.direction);
        return true;
    },
    onAttack: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
    },
    initHurt: function () {
        var currentTime = new Date();
        //stop
        this.timeToThink = currentTime.getTime() + 350 + Math.random() * 50;

        this.sprite.playAnimation("hurt_"+this.direction);
        this.runAction(new cc.jumpBy(0.35, 0, 0, 4, 1));
        return true;
    },
    onHurt: function () {
        var currentTime = new Date();
        this.dx = this.dy = 0;
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        return false;
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
        this.sprite.playAnimation(this.state+"_"+this.direction);
        return true;
    },
    onWalk: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        var oldPos = this.getPosition(),
            x = this.x,
            y = this.y;

        var fps = cc.director.getAnimationInterval();
        var speed = this.speed * fps * 10;

        //try to move unit
        if (this.targetX < x)
            x -= speed;
        else if (this.targetX > x)
            x += speed;
        this.x = x;
        if(x<50 || x>270 || this.doesCollide(waw.units)) {
            x = this.x = oldPos.x;
            y = this.y = oldPos.y;
            this.conditions.push("feelObstacle");
        }
        if (this.targetY < y)
            y -= speed;
        else if (this.targetY > y)
            y += speed;
        this.y = y;
        if(y<40 || y>180 || this.doesCollide(waw.units)) {
            y = this.y = oldPos.y;
            x = this.x = oldPos.x;
            this.conditions.push("feelObstacle");
        }
        //TODO add move around obstacles

        this.setPosition(x, y);
        this.setZOrder(250 - this.y);
        //position shadow
        this.shadowSprite.setPosition(this.x, this.y + this.shadowYoffset);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), oldPos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    },
    initBounce: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 2500 + Math.random() * 5500;
        if (this.dx == 0 || this.dy == 0) {
            //random way to bounce
            do {
                this.dx = Math.round(1 - Math.random()*2);
                this.dy = Math.round(1 - Math.random()*2);
            } while (this.dx == 0 && this.dy == 0);
        } else {
            if(Math.random()<0.5)
                this.dx = -this.dx;
            if(Math.random()<0.5)
                this.dy = -this.dy;
        }
        this.calcDirection(this.dx, this.dy);
        this.sprite.playAnimation(this.state + "_" + this.direction);
        return true;
    },
    onBounce: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        var pos = this.getPosition(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;
        var fps = cc.director.getAnimationInterval();
        var speed = this.speed * fps * 10;

        //try to move unit
        x += this.dx*speed;
        this.x = x;

        if(x<50 || x>270 || this.doesCollide(waw.units)) {
            this.dx = -this.dx;
            this.calcDirection(this.dx, this.dy);
            this.sprite.playAnimation(this.state+"_"+this.direction);
            x = this.x = oldPos.x;
            y = this.y = oldPos.y;
            this.conditions.push("feelObstacle");
        }

        y += this.dy*speed;
        this.y = y;
        if(y<40 || y>180 || this.doesCollide(waw.units)) {
            this.dy = -this.dy;
            this.calcDirection(this.dx, this.dy);
            this.sprite.playAnimation(this.state+"_"+this.direction);
            y = this.y = oldPos.y;
            x = this.x = oldPos.x;
            this.conditions.push("feelObstacle");
        }

        this.setPosition(x, y);
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y + this.shadowYoffset);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    },
    initFollowEnemy: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 3500 + Math.random() * 2500;
        this.targetX = waw.player.x;
        this.targetY = waw.player.y;
        this.dx = 0;
        this.dy = 0;
        this.calcDirection(this.targetX - this.x,this.targetY - this.y);
        this.sprite.playAnimation(this.state+"_"+this.direction);
        return true;
    },
    onFollowEnemy: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }
        var pos = this.getPosition(),
            x = pos.x,
            y = pos.y;
        var fps = cc.director.getAnimationInterval();
        var speed = this.speed * fps * 10;

        //try to move unit
        if (this.targetX < x)
            x -= speed;
        else if (this.targetX > x)
            x += speed;
        if (this.targetY < y)
            y -= speed;
        else if (this.targetY > y)
            y += speed;

        this.setPosition(x, y);
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y + this.shadowYoffset);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    },
    checkSubState: function () {
        var currentTime = new Date();
        if (this.subStateCountDown === 0 || this.subState === "" || currentTime.getTime() < this.subStateCountDown)
            return;
        //console.log("ENMY subact tim: ", this.subState);
        switch(this.subState){
            case "invincible":
                //console.log("ENM REMOVE subact tim: ", this.subState);
                this.setSubState("");
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                break;
            default:
                this.setSubState("");
        }
    },
    becomeInvincible: function() {
        this.setSubState("invincible", 1000);
        this.sprite.opacity = 180;
        this.shadowSprite.opacity = 180;
    },
    onGetDamage : function (killer) {
        if (this.subState === "invincible")
            return;

        if (this.subState === "dead")
            return;

        this.becomeInvincible(1000);
        this.HP--;
        cc.audioEngine.playEffect(this.sfx_hurt);
        this.state = "hurt";
        this.stateSchedule = this.SCHEDULE_HURT;
        this.stateSchedule.reset();

        //this.sprite.playAnimation("hurt_"+this.direction);
        if(this.HP <= 0)
            this.onDeath(killer);
    },
    onDeath : function (killer) {
        if (this.subState === "dead")
            return;
        this.unscheduleAllCallbacks();
        this.subState = "dead";
        this.sprite.opacity = 255;
        this.shadowSprite.opacity = 255;

        this.sprite.playAnimation("hurt_"+this.direction);
        this.runAction(new cc.jumpBy(0.35, 0, 0, 4, 1));
        this.scheduleOnce(function () {
            cc.audioEngine.playEffect(this.sfx_dead);
            //this.sprite.setAnchorPoint(0.5, 1);
            //this.sprite.rotation = 180;
            this.sprite.runAction(new cc.FadeOut(1));
            this.sprite.runAction(new cc.ScaleTo(1, 0.7));
            this.shadowSprite.runAction(new cc.FadeOut(0.7));
            this.shadowSprite.runAction(new cc.ScaleTo(0.7, 0.5));
        }, 0.6);

        if(killer){
            //mob.sprite.visible = false;
            //console.log("Mob "+mob.mobType+"'s touch");
        }

        //clear from this 1. local room foes 2. global room 3. local units - collision check
        for(var n=0; n<waw.foes.length; n++){
            var m = waw.foes[n];
            if( this === m ){
                waw.foes[n] = null;
                waw.units[200+n] = null;
                currentRoom.mobs[n] = null;
                break;
            }
        }
    }
});