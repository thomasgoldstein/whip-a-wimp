"use strict";
waw.Player = waw.Unit.extend({
//    sprite: null,
    speed: 0.75,
    movement: {
        left: false,
        right: false,
        up: false,
        down: false
    },
    direction: {
        left: false,
        right: false,
        up: false,
        down: true
    },
    //alive: null,    //if not, then disable all the player functions that might cause changing rooms / score / etc
    ctor: function() {
        this._super();
//        console.info("Player ctor");
        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);

/*
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
*/

        var animData =
        {
            "standing_up":
            {
                frameRects:
                [
                    cc.rect(0, 48, 32, 48)
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
            "standing_left":
            {
                frameRects:
                [
                    cc.rect(0, 96, 32, 48)
                ],
                delay: 0.1,
                flippedX: true
            },
            "standing_right":
            {
                frameRects:
                [
                    cc.rect(0, 96, 32, 48)
                ],
                delay: 0.1
            },
            "walking_up":
            {
                frameRects:
                [
                    cc.rect(32, 48, 32, 48),
                    cc.rect(64, 48, 32, 48),
                    cc.rect(32, 48, 32, 48),
                    cc.rect(0, 48, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walking_down":
            {
                frameRects:
                [
                    cc.rect(32, 0, 32, 48),
                    cc.rect(64, 0, 32, 48),
                    cc.rect(32, 0, 32, 48),
                    cc.rect(0, 0, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walking_left":
            {
                frameRects:
                [
                    cc.rect(0, 144, 32, 48),
                    cc.rect(32, 144, 32, 48),
                    cc.rect(0, 144, 32, 48),
                    cc.rect(0, 96, 32, 48),
                    cc.rect(32, 96, 32, 48),
                    cc.rect(64, 96, 32, 48),
                    cc.rect(32, 96, 32, 48),
                    cc.rect(0, 96, 32, 48)
                ],
                delay: 0.1,
                flippedX: true
            },
            "walking_right":
            {
                frameRects:
                [
                    cc.rect(32, 96, 32, 48),
                    cc.rect(64, 96, 32, 48),
                    cc.rect(32, 96, 32, 48),
                    cc.rect(0, 96, 32, 48),
                    cc.rect(0, 144, 32, 48),
                    cc.rect(32, 144, 32, 48),
                    cc.rect(0, 144, 32, 48),
                    cc.rect(0, 96, 32, 48)
                ],
                delay: 0.1
            }
        };
        this.sprite = new waw.AnimatedSprite(s_Jesus, animData);
        this.addChild(this.sprite);

        //add debug text info under the player
//        if(showDebugInfo) {
            this.label = cc.LabelTTF.create("Player", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(cc.p(0, -34));
            this.label.setVisible(showDebugInfo);
//        }

        //create players shadow sprite
        this.shadowSprite = cc.Sprite.create(s_Shadow);

        //this.alive = true;
    },
    keyDown: function(e) {
        this.changeKey(e, true);
        this.updateDirection(e);
    },
    keyUp: function(e) {
        this.changeKey(e, false);

        if (this.getState() === "walking")
        {
            // Only update the direction the player is facing if he's still walking,
            // so as to remember the last direction he's been moving toward
            this.updateDirection(e);
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
    isDirectionKey: function(e) {
        switch (e)
        {
            case cc.KEY.up:
            case cc.KEY.down:
            case cc.KEY.left:
            case cc.KEY.right:
                return true;

            default:
                return false;
        }
    },
    updateDirection: function(e) {
        if (this.isDirectionKey(e)) { 
            this.direction.up = this.movement.up;
            this.direction.down = this.movement.down;
            this.direction.left = this.movement.left;
            this.direction.right = this.movement.right;
        }
    },
    getNextPosition: function() {
        var p = this.getPositionF(),
            speed = this.speed,
            x = p.x,
            y = p.y;

        if ((this.movement.left || this.movement.right) &&
            (this.movement.up || this.movement.down)) {
            speed *= (2 / 3);
        }

        if (this.movement.left)
        {
            x -= speed;
        }
        else if (this.movement.right)
        {
            x += speed;
        }

        if (this.movement.up)
        {
            y += speed;
        }
        else if (this.movement.down)
        {
            y -= speed;
        }

        return cc.p(x, y);
    },
    update: function(pos) {
        var animKey = this.getState() + "_" + this.getDirection();
        this.sprite.playAnimation(animKey);

        this.setPosition(pos);
        //Z Index
        this.setZOrder(250- pos.y);

        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y-6);
        //TODO fix as players shadow
        if(showDebugInfo && this.label)
            this.label.setString("P " + pos.x + "," + pos.y + "");
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
            this.direction.left ? "left" :
            this.direction.right ? "right" :
            this.direction.up ? "up" : "down";

        return dir;
    }
});