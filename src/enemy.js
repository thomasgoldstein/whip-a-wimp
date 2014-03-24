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
    HP: 3,
    state: "idle",
    condition: {alive: true, canMove: true},
    timeToThink: 0,
    label: null,
    ctor: function () {
        this._super();
        console.info("Enemy ctor");
        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);
//        this.speed = 0.75; //??

        this.sprite = cc.Sprite.create(s_EnemyPlain,
            cc.rect(Math.floor(waw.rand() * 3) * 32, 0, 32, 32));

        this.addChild(this.sprite);

        //print room coords X,Y at the upper left corner
        this.label = cc.LabelTTF.create("Mob", "System", 9);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(cc.p(0, -30));
        //label.setOpacity(200);

        this.condition.alive = true;
    },
    getConditions: function(){
        var conditions = [];
        getVisualConditions(conditions);
        getSenseConditions(conditions);

        conditions.push("canWalk"); //always possible
        return conditions;
    },
    getVisualConditions: function(conditions){
        // might add "seeEnemy" "seeItem" "canAttack"
        //if(cc.p.dis)
        //    conditions.push("feelObstacle");

        return;
    },
    getSensorsConditions: function(conditions){
        // might add "feelObstacle"
        if(this.doesCollide(waw.units))
            conditions.push("feelObstacle");
        return;
    },
    update: function (env) {
        var currentTime = new Date();
        var pos = this.getPosition(),
            oldPos = pos,
            x = pos.x,
            y = pos.y;

        if (!this.condition.alive) {
            return;
        }
        //check
        if (this.HP <= 0) {

            this.condition.alive = false;
            //add die anim
            return;
        }

        //try to move unit
        y += this.dy;
        x += this.dx;

        this.condition.canMove = !(this.doesCollide(env.units));

        this.label.setString("Mob "+x+"("+this.dx+"),"+y+"("+this.dy+")\n"+this.state+"");
            //+this.timeToThink);

        if (this.condition.canMove){
            //move position
            this.setPosition(x, y);
            this.setZOrder(250 - y);
        } else {
            pos = oldPos;
            this.setPosition(pos.x, pos.y);
            this.setZOrder(250 - pos.y);

        }

        if( currentTime.getTime()< this.timeToThink) {
            return;
        }
        //TODO
        //set time, when you "think" next time
        //this.timeToThink = currentTime.getTime()+3000;

        //if(this.doesCollide(this.playe))

        switch (this.state) {
            case "idle":
                if (Math.random() < 0.5)
                    this.state = "walk";
                //this.dx = 0;
                //this.dy = 0;
                this.timeToThink = currentTime.getTime()+300;
                return;
                break;
            case "walk":
                if (!this.condition.canMove){
                    this.state = "idle";
                    this.timeToThink = currentTime.getTime()+3000;
                    this.dx = 0;
                    this.dy = 0;

                    this.runAction(cc.Blink.create(1, 2)); //Blink Foe sprite
                    //this.HP -= 1;
                    //return;
                }

                //AI plug
//                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5)
                        this.dy = this.speed;
                    else
                        this.dy = -this.speed;
//                }
//                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5)
                        this.dx = this.speed;
                    else
                        this.dx = -this.speed;
//                }
                break;
        }
        //     this.setPosition(oldPos);
        //this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
        //TODO 1.make enemy not stuck 2.check collision with other foes
        //Z Index

    }
})
;