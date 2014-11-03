"use strict";
waw.Player = waw.Unit.extend({
    speed: 4,
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
        console.info("Player ctor");
        this.setContentSize(16, 16);
        this.setAnchorPoint(0, -1);

        //this.debugCross.setAnchorPoint(0, -1);

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
        this.debugCross.setPosition(0, -24);

        //add debug text info under the player
//        if(showDebugInfo) {
            this.label = new cc.LabelTTF("Player", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(0, -34);
            this.label.setVisible(showDebugInfo);
//        }

        //create players shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow);

        //this.alive = true;
    },
/*    isDirectionKey: function(e) {
        if (waw.KEYS[cc.KEY.up]
            || waw.KEYS[cc.KEY.down]
            || waw.KEYS[cc.KEY.left]
            || waw.KEYS[cc.KEY.right]) {
            return true;
        }
        return false;
    },
    updateDirection: function(e) {
        if (this.isDirectionKey(e)) { 
            this.direction.up = this.movement.up;
            this.direction.down = this.movement.down;
            this.direction.left = this.movement.left;
            this.direction.right = this.movement.right;
        }
    },*/
    getNextPosition: function() {
        var //p = this.getPositionF(),
            x = this.x,
            y = this.y;

        var fps = cc.director.getAnimationInterval();
        var speed = this.speed * fps * 10;

        if ((waw.KEYS[cc.KEY.left] || waw.KEYS[cc.KEY.right]) &&
            (waw.KEYS[cc.KEY.up] || waw.KEYS[cc.KEY.down])) {
            speed *= (2 / 3);
        }

        if (waw.KEYS[cc.KEY.left])
        {
            x -= speed;
        }
        else if (waw.KEYS[cc.KEY.right])
        {
            x += speed;
        }

        if (waw.KEYS[cc.KEY.up])
        {
            y += speed;
        }
        else if (waw.KEYS[cc.KEY.down])
        {
            y -= speed;
        }

        return cc.p(x, y);
    },
    update: function(pos_) {
        //debugger;
        //var pos = {x:100,y:100};
        var pos = this.getPosition();
        var animKey = this.getState() + "_" + this.getDirection();
        this.sprite.playAnimation(animKey);
        //this.sprite.playAnimation("walking_down");

        var nextPos = this.handleCollisions();
/*
         currentPlayerPos = nextPos;
        if (nextPos.x < 16) {
            currentPlayerPos.x = 320 - 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);    //TODO Fix it better. this setpos insta moves player to the next room pos. It prevents running UPDATE several times at once.
            this.onGotoNextRoom(cc.KEY.left);
            return;
        } else if (nextPos.y < 16) {
            currentPlayerPos.y = 240 - 32 - 16; //upper wall is 16pix taller
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.down);
            return;
        } else if (nextPos.x > 320 - 16) {
            currentPlayerPos.x = 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.right);
            return;
        } else if (nextPos.y > 240 - 32) {  //upper wall is 16pix taller
            currentPlayerPos.y = 32;
//            waw.player.alive = false;
            this.removeChild(waw.player, true);
            waw.player.setPosition(nextPos);
            this.onGotoNextRoom(cc.KEY.up);
            return;
        }
*/
//        waw.player.update(nextPos);

        pos = nextPos;

        this.setPosition(pos);
        //Z Index
        this.setZOrder(250- pos.y);

        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y-6);

        if(showDebugInfo && this.label) {
            //var pos2 = new cc.p();
            var pos2 = this.getAnchorPoint();
            this.label.setString("" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "\n" + pos2.x.toFixed(2) + "," + pos2.y.toFixed(2));
        }
    },
    handleCollisions: function () {
        var nextPos = this.getNextPosition();
        var oldPos = this.getPosition();
        var nextCollideRect = this.collideRect(nextPos);
        waw.units.forEach(function (unit) {
            var unitRect = unit.collideRect();
            var rect = cc.rectIntersection(nextCollideRect, unitRect);
            //TODO check this condition && why not || ?
            if (rect.width > 0 && rect.height > 0) // Collision!
            {
//                var oldPos = waw.player.getPosition();
                var oldRect = cc.rectIntersection(waw.player.collideRect(oldPos), unitRect);

                if (oldRect.height > 0) {
                    // Block the player horizontally
                    nextPos.x = oldPos.x;
                }

                if (oldRect.width > 0) {
                    // Block the player vertically
                    nextPos.y = oldPos.y;
                }
            }
        });
//        if(oldPos.x == nextPos.x || oldPos.y == nextPos.y ){
//            waw.player.runAction(cc.Blink.create(0.5, 2)); //Blink Foe sprite
//        }
        return nextPos;
    },

    getState: function() {
        var state =
            waw.KEYS[cc.KEY.left] ||
            waw.KEYS[cc.KEY.right] ||
            waw.KEYS[cc.KEY.up] ||
            waw.KEYS[cc.KEY.down] ? "walking" : "standing";
        return state;
    },
    getDirection: function() {
        var dir =
            waw.KEYS[cc.KEY.left] ? "left" :
                waw.KEYS[cc.KEY.right] ? "right" :
                    waw.KEYS[cc.KEY.up] ? "up" : "down";
        return dir;
    }
});