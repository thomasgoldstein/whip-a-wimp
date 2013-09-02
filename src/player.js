"use strict";
waw.Player = waw.Unit.extend({
    sprite: null,
    speed: 0,
    movement: null,
    direction: null,
    ctor: function() {
        this._super();

        this.setContentSize(new cc.Size(32, 32));
        this.setAnchorPoint(new cc.Point(0, -0.5));
        this.speed = 1.5;
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

        var animData =
        {
            "standing_up":
            {
                frameRects:
                [
                    cc.rect(0, 128, 32, 64)
                ]
            },
            "standing_down":
            {
                frameRects:
                [
                    cc.rect(0, 0, 32, 64)
                ]
            },
            "standing_horiz":
            {
                frameRects:
                [
                    cc.rect(0, 64, 32, 64)
                ]
            },
            "walking_up":
            {
                frameRects:
                [
                    cc.rect(0, 128, 32, 64),
                    cc.rect(32, 128, 32, 64)
                ]
            },
            "walking_down":
            {
                frameRects:
                [
                    cc.rect(0, 0, 32, 64),
                    cc.rect(32, 0, 32, 64)
                ]
            },
            "walking_horiz":
            {
                frameRects:
                [
                    cc.rect(0, 64, 32, 64),
                    cc.rect(32, 64, 32, 64)
                ]
            }
        };

        this.sprite = new waw.AnimatedSprite(s_Jesus, animData, 0.2);
        this.addChild(this.sprite);
    },
    keyDown: function(e) {
        this.changeKey(e, true);
        this.updateDirection();
    },
    keyUp: function(e) {
        this.changeKey(e, false);

        if (this.getState() === "walking")
        {
            // Only update the direction the player is facing if he's still walking,
            // so as to remember the last direction he's been moving toward
            this.updateDirection();
        }
    },
    changeKey: function(e, pressed) {
        switch (e)
        {
            case cc.KEY.up:
                this.movement.up = pressed;
                break;
            case cc.KEY.down:
                this.movement.down = pressed;
                break;
            case cc.KEY.left:
                this.movement.left = pressed;
                break;
            case cc.KEY.right:
                this.movement.right = pressed;
                break;
        }
    },
    updateDirection: function() {
        this.direction.up = this.movement.up;
        this.direction.down = this.movement.down;
        this.direction.left = this.movement.left;
        this.direction.right = this.movement.right;
    },
    getNextPosition: function() {
        var p = this.getPosition();

        if (this.movement.left)
        {
            p.x -= this.speed;
        }
        else if (this.movement.right)
        {
            p.x += this.speed;
        }

        if (this.movement.up)
        {
            p.y += this.speed;
        }
        else if (this.movement.down)
        {
            p.y -= this.speed;
        }

        return p;
    },
    update: function(pos) {
        var animKey = this.getState() + "_" + this.getDirection();
        this.sprite.setFlipX(this.direction.left);
        this.sprite.playAnimation(animKey);

        this.setPosition(pos);
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