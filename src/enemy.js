"use strict";
waw.Enemy = waw.Unit.extend({
    sprite: null,
    speed: 0,
    movement: null,
    direction: null,
    alive: null,
    ctor: function() {
        this._super();
        console.info("Enemy ctor");
        this.setContentSize(new cc.Size(24, 16));
        this.setAnchorPoint(new cc.Point(0, -1));
        this.speed = 0.75;
        this.movement = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.direction = {
            left: false,
            right: false,
            up: false,
            down: true
        };
        this.sprite = new waw.AnimatedSprite(s_Jesus, animData);
        this.addChild(this.sprite);
        this.alive = true;
    },
    updateDirection: function() {
        this.direction.up = this.movement.up;
        this.direction.down = this.movement.down;
        this.direction.left = this.movement.left;
        this.direction.right = this.movement.right;
    },
    getNextPosition: function() {
        var p = this.getPositionF(),
            speed = this.speed;

        if ((this.movement.left || this.movement.right) &&
            (this.movement.up || this.movement.down)) {
            speed *= (2 / 3);
        }

        if (this.movement.left)
        {
            p.x -= speed;
        }
        else if (this.movement.right)
        {
            p.x += speed;
        }

        if (this.movement.up)
        {
            p.y += speed;
        }
        else if (this.movement.down)
        {
            p.y -= speed;
        }

        return p;
    },
    update: function(pos) {
        var animKey = this.getState() + "_" + this.getDirection();
        this.sprite.playAnimation(animKey);

        this.setPosition(pos);
        //Z Index
        this.setZOrder(250- pos.y);
    },
    getState: function() {
        var state =
            this.movement.left ||
            this.movement.right ||
            this.movement.up ||
            this.movement.down ? "walking" : "standing";

        return state;
    },
    getDirection: function() {
        var dir =
            this.direction.left || this.direction.right ? "horiz" :
            this.direction.up ? "up" : "down";

        return dir;
    }
});