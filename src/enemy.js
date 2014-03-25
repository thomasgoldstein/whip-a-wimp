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
    HP: 3,
    state: "idle",
    stateShedule: null,
    conditions: [],
    timeToThink: 0,
    SHEDULE_IDLE: null,
    SHEDULE_WALK: null,
    ctor: function () {
        this._super();
        //console.info("Enemy ctor");

        this.SHEDULE_IDLE = new waw.Shedule([this.initIdle, this.onIdle], ["seeEnemy"]);
        this.SHEDULE_WALK = new waw.Shedule([this.initWalk, this.onWalk], ["feelObstacle"]);

        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);
        this.speed = 1;
        this.safePos = cc.p(0, 0);

        this.sprite = cc.Sprite.create(s_EnemyPlain,
            cc.rect(Math.floor(waw.rand() * 3) * 32, 0, 32, 32));

        this.addChild(this.sprite);

        //print room coords X,Y at the upper left corner
        this.label = cc.LabelTTF.create("Mob", "System", 9);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(cc.p(0, -30));
        //label.setOpacity(200);

        this.state = "idle";
        this.stateShedule = this.SHEDULE_IDLE;
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
    pickAIShedule: function(){
        switch (this.state) {
            case "idle":
                if (Math.random() < 0.7) {
                    this.state = "idle";
                    this.stateShedule = this.SHEDULE_IDLE;
//                    console.log("-idle");
                } else {
                    this.state = "walk";
                    this.stateShedule = this.SHEDULE_WALK;
//                    console.log("-walk");
                }
                break;
            case "walk":
                if (Math.random() < 0.3) {
                    this.state = "idle";
                    this.stateShedule = this.SHEDULE_IDLE;
//                    console.log("-idle");
                } else {
                    this.state = "walk";
                    this.stateShedule = this.SHEDULE_WALK;
//                    console.log("-walk");
                }
                break;
            default:
                this.state = "idle";
                this.stateShedule = this.SHEDULE_IDLE;
//                console.log("-DEFLT-idle");
        }
    },
    update: function () {
        var currentTime = new Date();

        var pos = this.getPosition(),
            x = pos.x,
            y = pos.y;

        this.conditions = this.getConditions();
//        debugger;

        if (this.stateShedule.isDone()) {
            this.pickAIShedule();
        }
        this.stateShedule.update(this); //we pass 'this' to make anon funcs in shedule see current monsters vars

        this.label.setString("" + x + "->" + this.targetX + ")," + y + "->" + this.targetY + ")\n" + this.state + "");
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
            var pos = this.getPosition();
            x = pos.x;
            y = pos.y;
        }
        this.setPosition(x, y);
        this.setZOrder(250 - y);
        return true;
    },
    onIdle: function () {
        var currentTime = new Date();
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
            this.targetX = Math.round(50 + Math.random() * 220);
            this.targetY = Math.round(50 + Math.random() * 130);
        }
        return true;
    },
    onWalk: function () {
        var currentTime = new Date();
        if (currentTime.getTime() > this.timeToThink) {
            return true;
        }

        var pos = this.getPosition(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;

        this.oldPos = pos;

        //try to move unit
        if (this.targetX < x)
            x -= this.speed;
        else if (this.targetX > x)
            x += this.speed;
        if (this.targetY < y)
            y -= this.speed;
        else if (this.targetY > y)
            y += this.speed;

        this.setPosition(x, y);
        this.setZOrder(250 - y);

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