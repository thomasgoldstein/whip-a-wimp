"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobDoveSeller = waw.MobRandomWalker.extend({
    mobType: "DoveSeller",
    shadowYoffset: 0,
    spriteYoffset: 0,
    HP: 2,
    state: "idle",
    itemsDrop: ["key","unknown","unknown"],
    sfx_hurt01: waw.sfx.doveSellerHurt01,
    sfx_hurt02: waw.sfx.doveSellerHurt02,
    sfx_death: waw.sfx.doveSellerDeath,

    ctor: function () {
        this._super();
        //console.info("MobDoveSeller ctor");

        this.setContentSize(16, 16);
        //this.setAnchorPoint(0.5, 0);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        var s = waw.SpriteRect(32,48);
        var animData =
        {
            "walk_down_right":
            {
                frameRects:
                    [
                        s(0,0), s(1,0),s(2,0),s(1,0)
                    ],
                delay: 0.3
            },
            "walk_down_left":
            {
                frameRects:
                    [
                        s(0,0), s(1,0),s(2,0),s(1,0)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "walk_up_right":
            {
                frameRects:
                    [
                        s(0,1), s(1,1),s(2,1),s(1,1)
                    ],
                delay: 0.3
            },
            "walk_up_left":
            {
                frameRects:
                    [
                        s(0,1), s(1,1),s(2,1),s(1,1)
                    ],
                delay: 0.3,
                flippedX: true
            },
            "attack_down_right":
            {
                frameRects:
                    [
                        s(0,0), s(1,0),s(2,0),s(1,0)
                    ],
                delay: 0.1
            },
            "attack_down_left":
            {
                frameRects:
                    [
                        s(0,0), s(1,0),s(2,0),s(1,0)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "attack_up_right":
            {
                frameRects:
                    [
                        s(0,1), s(1,1),s(2,1),s(1,1)
                    ],
                delay: 0.1
            },
            "attack_up_left":
            {
                frameRects:
                    [
                        s(0,1), s(1,1),s(2,1),s(1,1)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "rolling_down":
            {
                frameRects:
                    [
                        s(1,0), s(0,0)
                    ],
                delay: 2,
                mirrorX: true
            },
            "rolling_up":
            {
                frameRects:
                    [
                        s(1,1), s(0,1)
                    ],
                delay: 2,
                mirrorX: true
            },
            "hurt_down_right":
            {
                frameRects:
                    [
                        s(0,2), s(1,2),s(1,2),s(0,2),s(1,0)
                    ],
                delay: 0.15
            },
            "hurt_down_left":
            {
                frameRects:
                    [
                        s(0,2), s(1,2),s(1,2),s(0,2),s(1,0)
                    ],
                delay: 0.15,
                flippedX: true
            }
        };
        animData["follow_up_left"] = animData["walk_up_left"];
        animData["follow_up_right"] = animData["walk_up_right"];
        animData["follow_down_left"] = animData["walk_down_left"];
        animData["follow_down_right"] = animData["walk_down_right"];
        animData["runaway_up_left"] = animData["walk_up_left"];
        animData["runaway_up_right"] = animData["walk_up_right"];
        animData["runaway_down_left"] = animData["walk_down_left"];
        animData["runaway_down_right"] = animData["walk_down_right"];
        animData["bounce_up_left"] = animData["walk_up_left"];
        animData["bounce_up_right"] = animData["walk_up_right"];
        animData["bounce_down_left"] = animData["walk_down_left"];
        animData["bounce_down_right"] = animData["walk_down_right"];

        animData["idle_up_left"] = animData["rolling_up"];
        animData["idle_up_right"] = animData["rolling_up"];
        animData["idle_down_left"] = animData["rolling_down"];
        animData["idle_down_right"] = animData["rolling_down"];

        animData["hurt_up_left"] = animData["hurt_down_left"];
        animData["hurt_up_right"] = animData["hurt_down_right"];


        this.sprite = new waw.AnimatedSprite(waw.gfx.doveSeller, animData);
        this.calcDirection(0,0);
        this.sprite.playAnimation(this.getAnimationName());

        this.sprite.setPosition(0,this.spriteYoffset); //pig 48x48
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.debugCross.setAnchorPoint(0.5, 0);

        //create monsters shadow sprite
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5, 0.5);
    },

    pickAISchedule: function () {
        switch (this.state) {
            case "runaway":
                if (Math.random() < 0.7) {
                    this.state = "runaway";
                    this.stateSchedule = this.SCHEDULE_RUNAWAY;
                    this.stateSchedule.reset();
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
                    this.stateSchedule.reset();
                }
                break;
            case "idle":
                if(this.HP < 2){
                    this.state = "runaway";
                    this.stateSchedule = this.SCHEDULE_RUNAWAY;
                    this.stateSchedule.reset();
                    this.throwDove();
                    break;
                }
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                if(Math.random() < 0.10)
                    this.throwDove();
                if (Math.random() < 0.7) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
                }
                break;
            case "attack":
                this.state = "idle";
                this.stateSchedule = this.SCHEDULE_IDLE;
                //console.log("mob attacks player end");
                break;
            case "hurt":
                this.state = "follow";
                this.stateSchedule = this.SCHEDULE_FOLLOW;
                this.stateSchedule.reset();
                this.speed += 1;
                //console.log("mobs hurt stat end");
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
    throwDove: function () {
        var dove = new waw.BulletDove();
        waw.layer.addChild(dove, 350);
        dove.setPosition(this.x, this.y);
        dove.scale = 0.5;
        var bezier = [waw.pickPlayersBackCoord(this, 60), cc.p(waw.player.x, waw.player.y), waw.pickRandomEdgeCoord()];
        var bezierTo = new cc.BezierTo(3, bezier);
        dove.runAction( new cc.Spawn(
            new cc.ScaleTo(0.5, 1),
            new cc.Sequence(
                bezierTo,
                new cc.RemoveSelf(true)
            )
            )
        )
    },
    update: function () {
        //var currentTime = new Date();

        this.conditions = this.getConditions();

        if(this.state !== "attack" && this.conditions.indexOf("canAttack")>=0) {
            //console.log("mob attacks player0");
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
});