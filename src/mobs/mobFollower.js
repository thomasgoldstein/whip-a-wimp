"use strict";
//states: idle walk follow attack
//conditions canAttck canWalk feelObstacle seePlayer seeItem

waw.MobFollower = waw.Enemy.extend({
        ctor: function () {
            this._super();
            //console.info("MobFollower ctor");
            this.speed = 1 + Math.random() * 2;
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
                case "follow":
                case "walk":
                    if (Math.random() < 0.5) {
                        this.state = "follow";
                        this.stateSchedule = this.SCHEDULE_FOLLOW;
                    } else if (Math.random() < 0.5) {
                        this.state = "walk";
                        this.stateSchedule = this.SCHEDULE_WALK;
                    } else{
                        this.state = "idle";
                        this.stateSchedule = this.SCHEDULE_IDLE;
                    }
                    break;
            }
        }

    }
);