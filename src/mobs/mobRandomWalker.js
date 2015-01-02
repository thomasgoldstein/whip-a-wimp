"use strict";
//states: idle walk attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobRandomWalker = waw.Enemy.extend({
        ctor: function () {
            this._super();
            //console.info("MobRandomWalker ctor");
            this.speed = 1 + Math.random() * 2;
        },
        pickAISchedule: function () {
            switch (this.state) {
                case "idle":
                    if (Math.random() < 0.7) {
                        this.state = "idle";
                        this.stateSchedule = this.SCHEDULE_IDLE;
                    } else if (Math.random() < 0.3) {
                        this.state = "walk";
                        this.stateSchedule = this.SCHEDULE_WALK;
                    }
                    break;
                case "attack":
                    this.state = "idle";
                    this.stateSchedule = this.SCHEDULE_IDLE;
                    console.log("mob attacks player end");
                    break;
                case "walk":
                    if (Math.random() < 0.3) {
                        this.state = "idle";
                        this.stateSchedule = this.SCHEDULE_IDLE;
                    } else {
                        this.state = "walk";
                        this.stateSchedule = this.SCHEDULE_WALK;
                    }
                    break;
            }
        }

    }
);