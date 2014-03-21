"use strict";
waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 0.56,
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
        this.label = cc.LabelTTF.create("Mob", "System", 7);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(cc.p(0, -30));
        //label.setOpacity(200);

        this.condition.alive = true;
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

        this.label.setString("Mob "+x+","+y+" "+this.state+"\n"+this.timeToThink);

        if (this.condition.canMove){
            //move position
            this.setPosition(x, y);
            this.setZOrder(250 - y);
        }

        if( currentTime.getTime()< this.timeToThink) {
            return;
        }
        //TODO
        //set time, when you "think" next time
        this.timeToThink = currentTime.getTime()+3000;

        //if(this.doesCollide(this.playe))

        switch (this.state) {
            case "idle":
                if (Math.random() < 0.01)
                    this.state = "walk";
                this.dx = 0;
                this.dy = 0;
                return;
                break;
            case "walk":
                if (!this.condition.canMove){
                    this.state = "idle";
                    this.timeToThink = currentTime.getTime()+300;
                    this.dx = 0;
                    this.dy = 0;

                    this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
                    //this.HP -= 1;
                    return;
                }

                //AI plug
                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5)
                        this.dy = this.speed;
                    else
                        this.dy = -this.speed;
                }
                if (Math.random() < 0.3) {
                    if (Math.random() < 0.5)
                        this.dx = this.speed;
                    else
                        this.dx = -this.speed;
                }
                break;
        }
        //     this.setPosition(oldPos);
        //this.runAction(cc.Blink.create(1, 10)); //Blink Foe sprite
        //TODO 1.make enemy not stuck 2.check collision with other foes
        //Z Index

    }
})
;