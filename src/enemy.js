"use strict";

//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem


waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 1,
    movement: null,
    direction: null,
    dx: 1,
    dy: -1,
    targetX: 160,
    targetY: 110,
    safePos: null,
//    HP: 3,
    state: "idle",
    stateSchedule: null,
    conditions: [],
    timeToThink: 0,
//    SCHEDULE_IDLE: null,
//    SCHEDULE_WALK: null,
    ctor: function () {
        this._super();
        //console.info("Enemy ctor");

        this.SCHEDULE_IDLE = new waw.Schedule([this.initIdle, this.onIdle], ["seeEnemy"]);
        this.SCHEDULE_WALK = new waw.Schedule([this.initWalk, this.onWalk], ["feelObstacle","seeEnemy"]);
        this.SCHEDULE_BOUNCE = new waw.Schedule([this.initBounce, this.onBounce], ["feelObstacle","seeEnemy"]);
        this.SCHEDULE_FOLLOW = new waw.Schedule([this.initFollowEnemy, this.onFollowEnemy], ["feelObstacle"]);

        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);
        this.speed = 1+Math.random()*2;
        this.safePos = cc.p(0, 0);

        this.sprite = cc.Sprite.create(s_EnemyPlain,
            cc.rect(Math.floor(waw.rand() * 3) * 32, 0, 32, 32));

        this.addChild(this.sprite);

        //create monsters shadow sprite
        this.shadowSprite = cc.Sprite.create(s_Shadow);

        //add debug text info under a mob
//        if(showDebugInfo) {
            this.label = cc.LabelTTF.create("Mob", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(cc.p(0, -30));
            this.label.setVisible(showDebugInfo);
//        }
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
    },
    getVisualConditions: function (conditions) {
        // might add "seeEnemy" "seeItem" "canAttack"
        //if(cc.p.dis)
//        conditions.push("seeItem");
        var pPos = waw.player.getPositionF();
        var pos = this.getPositionF();
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
//                    console.log("-idle");
                } else if (Math.random() < 0.3) {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
//                    console.log("-idle");

                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
//                    console.log("-walk");
                }
                break;
            case "walk":
                if(this.conditions.indexOf("seeEnemy")>=0) {
                    this.state = "follow";
                    this.stateSchedule = this.SCHEDULE_FOLLOW;
                    this.stateSchedule.reset();
                    break;
                }
                if (Math.random() < 0.3) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
//                    console.log("-idle");
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
//                    console.log("-walk");
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
//                    console.log("-idle");
                } else {
                    this.state = "bounce";
                    this.stateSchedule = this.SCHEDULE_BOUNCE;
//                    console.log("-walk");
                }
                break;
            case "follow":
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
//                console.log("-DEFLT-idle");
        }
    },
    update: function () {
        var currentTime = new Date();

        var pos = this.getPositionF(),
            x = pos.x,
            y = pos.y;

        this.conditions = this.getConditions();
//        debugger;

        if (this.stateSchedule.isDone()) {
            this.pickAISchedule();
        }
        this.stateSchedule.update(this); //we pass 'this' to make anon funcs in schedule see current monsters vars

        if(showDebugInfo && this.label) {
//            this.label.setString("" + x + "->" + this.targetX + "," + y + "->" + this.targetY + "\n" + this.state + "");
//            this.label.setString(""+this.state + "");

            var pPos = waw.player.getPositionF();
            var pos = this.getPositionF();
//            this.label.setString(""+this.state + " "+ cc.pDistanceSQ(pPos, pos) );
            this.label.setString(""+this.state + " "+ Math.round(pos.x)+","+Math.round(pos.y)+" dxy "+this.dx+" "+this.dy );
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
            var pos = this.getPositionF();
            x = pos.x;
            y = pos.y;
        }
        this.setPosition(x, y-1);
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y+2);
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
    toSafeXCoord: function (x) {
        return (x<50 ? 50 : (x>270 ? 270 : x));
    },
    toSafeYCoord: function (y) {
        return (y<50 ? 50 : (y>180 ? 180 : y));
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
        return true;
    },
    onWalk: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }

        var pos = this.getPositionF(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;

        this.oldPos = pos;

        var d = cc.Director.getInstance();
        var fps = d.getAnimationInterval();
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
        this.shadowSprite.setPosition(pos.x, pos.y-0);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
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
        return true;
    },
    onBounce: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }

        var pos = this.getPositionF(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;

        this.oldPos = pos;

        var d = cc.Director.getInstance();
        var fps = d.getAnimationInterval();
        var speed = this.speed * fps * 10;

        //try to move unit
            x += this.dx*speed;
            y += this.dy*speed;
        // || this.conditions.indexOf("feelObstacle")>=0
        if(x<50 || x>270) {
            this.dx = -this.dx;
//            x = oldPos.x;
        }
        if(y<40 || y>180) {
            this.dy = -this.dy;
//            y = oldPos.y;
        }

        this.setPosition(x, y);
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y-0);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    },
    initFollowEnemy: function () {
        var currentTime = new Date();
        this.timeToThink = currentTime.getTime() + 3500 + Math.random() * 2500;
        var pos = waw.player.getPositionF();
        this.targetX = pos.x;
        this.targetY = pos.y;
        this.dx = 0;
        this.dy = 0;
        return true;
    },
    onFollowEnemy: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }

        var pos = this.getPositionF(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;

        this.oldPos = pos;

        var d = cc.Director.getInstance();
        var fps = d.getAnimationInterval();
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
        this.shadowSprite.setPosition(pos.x, pos.y-0);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    }   //this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
    //TODO 1.make enemy not stuck 2.check collision with other foes
})
;