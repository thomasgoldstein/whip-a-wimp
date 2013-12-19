"use strict";
waw.Player = waw.Unit.extend({
    sprite: null,
    speed: 0,
    movement: null,
    direction: null,
    alive: null,    //if not, then disable all the player functions that might cause changing rooms / score / etc
    ctor: function() {
        this._super();
        console.info("Player ctor");
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

        var animData =
        {
            "standing_up":
            {
                frameRects:
                [
                    cc.rect(0, 96, 32, 48)
                ],
                delay: 0.1
            },
            "standing_down":
            {
                frameRects:
                [
                    cc.rect(0, 0, 32, 48)
                ],
                delay: 0.1
            },
            "standing_horiz":
            {
                frameRects:
                [
                    cc.rect(0, 48, 32, 48)
                ],
                delay: 0.1
            },
            "walking_up":
            {
                frameRects:
                [
                    cc.rect(0, 96, 32, 48),
                    cc.rect(32, 96, 32, 48),
                    cc.rect(64, 96, 32, 48),
                    cc.rect(32, 96, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walking_down":
            {
                frameRects:
                [
                    cc.rect(0, 0, 32, 48),
                    cc.rect(32, 0, 32, 48),
                    cc.rect(64, 0, 32, 48),
                    cc.rect(32, 0, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walking_horiz":
            {
                frameRects:
                [
                    cc.rect(0, 48, 32, 48),
                    cc.rect(32, 48, 32, 48)
                ],
                delay: 0.1
            }
        };

        this.sprite = new waw.AnimatedSprite(s_Jesus, animData);
        this.addChild(this.sprite);
        this.alive = true;
    },
    keyDown: function(e) {
        if(!this.alive)
            return;
        this.changeKey(e, true);
        this.updateDirection();
    },
    keyUp: function(e) {
        if(!this.alive)
            return;
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