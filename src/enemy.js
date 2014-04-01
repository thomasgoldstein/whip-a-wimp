"use strict";

//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem


waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 1,
    movement: null,
    direction: null,
//    dx: 1,
//    dy: -1,
    targetX: 160,
    targetY: 110,
    safePos: null,
//    HP: 3,
    state: "idle",
    stateSchedule: null,
    conditions: [],
    timeToThink: 0,
    SCHEDULE_IDLE: null,
    SCHEDULE_WALK: null,
    ctor: function () {
        this._super();
        //console.info("Enemy ctor");

        this.SCHEDULE_IDLE = new waw.Schedule([this.initIdle, this.onIdle], ["seeEnemy"]);
        this.SCHEDULE_WALK = new waw.Schedule([this.initWalk, this.onWalk], ["feelObstacle"]);

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
        if(showDebugInfo) {
            this.label = cc.LabelTTF.create("Mob", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(cc.p(0, -30));
            //label.setOpacity(200);
        }
        this.state = "idle";
        this.stateSchedule = this.SCHEDULE_IDLE;
    },
    getVisualConditions: function (conditions) {
        // might add "seeEnemy" "seeItem" "canAttack"
        //if(cc.p.dis)
//        conditions.push("seeItem");
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
    pickAISchedule: function(){
        switch (this.state) {
            case "idle":
                if (Math.random() < 0.7) {
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
//                    console.log("-idle");
                } else {
                    this.state = "walk";
                    this.stateSchedule = this.SCHEDULE_WALK;
//                    console.log("-walk");
                }
                break;
            case "walk":
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

        if(showDebugInfo && this.label)
            this.label.setString("" + x + "->" + this.targetX + "," + y + "->" + this.targetY + "\n" + this.state + "");
    },
    initIdle: function () {
        var currentTime = new Date();
        //stop
        this.timeToThink = currentTime.getTime() + 100 + Math.random() * 50;
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
        this.setPosition(x, y);
        this.setZOrder(250 - y);
        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y-6);
        return true;
    },
    onIdle: function () {
        var currentTime = new Date();
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
        this.shadowSprite.setPosition(pos.x, pos.y-6);

        if (cc.pDistanceSQ(cc.p(this.targetX, this.targetY), pos) < 32) {
            return true; //get to the target x,y
        }
        return false;
    }

    //     this.setPosition(oldPos);
    //this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
    //TODO 1.make enemy not stuck 2.check collision with other foes
    //Z Index
})
;