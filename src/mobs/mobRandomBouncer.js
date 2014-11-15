"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobRandomBouncer = waw.Enemy.extend({
        ctor: function () {
            this._super();
            //console.info("MobRandomBouncer ctor");
            /*
             this.SCHEDULE_IDLE = new waw.Schedule([this.initIdle, this.onIdle], ["seeEnemy"]);
             this.SCHEDULE_WALK = new waw.Schedule([this.initWalk, this.onWalk], ["feelObstacle","seeEnemy"]);
             this.SCHEDULE_BOUNCE = new waw.Schedule([this.initBounce, this.onBounce], ["feelObstacle","seeEnemy"]);
             this.SCHEDULE_FOLLOW = new waw.Schedule([this.initFollowEnemy, this.onFollowEnemy], ["feelObstacle"]);
             */
            this.speed = 1 + Math.random() * 2;

            //this.sprite = cc.Sprite.create(s_EnemyPlain,
            //    cc.rect(Math.floor(waw.rand() * 3) * 49, 0, 48, 48));

            //this.addChild(this.sprite);
        },
        pickAISchedule: function () {
            switch (this.state) {
                case "idle":
                    if (Math.random() < 0.7) {
                        this.state = "idle";
                        this.stateSchedule = this.SCHEDULE_IDLE;
                    } else if (Math.random() < 0.3) {
                        this.state = "bounce";
                        this.stateSchedule = this.SCHEDULE_BOUNCE;
                    }
                    break;
                case "bounce":
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
            }
        }

    }
);