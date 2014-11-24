"use strict";
waw.Player = waw.Unit.extend({
    speed: 6,
    /*movement: {
        left: false,
        right: false,
        up: false,
        down: false
    },*/
    /*direction: {
        left: false,
        right: false,
        up: false,
        down: true
    },*/
    //alive: null,    //if not, then disable all the player functions that might cause changing rooms / score / etc
    ctor: function() {
        this._super();
        //console.info("Player ctor");
        this.setContentSize(16, 16);
        //this.setAnchorPoint(0, -1);
        //this.setAnchorPoint(0.5, 0);

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
                delay: 0.2,
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
            },
            "punching_up":
            {
                frameRects:
                    [
                        cc.rect(0, 192, 32, 48),
                        cc.rect(32, 192, 32, 48),
                        cc.rect(32, 192, 32, 48),
                        cc.rect(0, 48, 32, 48)
                    ],
                delay: 0.1,
                mirrorX: true
            },
            "punching_down":
            {
                frameRects:
                    [
                        cc.rect(0, 288, 32, 48),
                        cc.rect(32, 288, 32, 48),
                        cc.rect(32, 288, 32, 48),
                        cc.rect(0, 0, 32, 48)
                    ],
                delay: 0.1,
                mirrorX: true
            },
            "punching_left":
            {
                frameRects:
                    [
                        cc.rect(0, 240, 32, 48),
                        cc.rect(32, 240, 32, 48),
                        cc.rect(32, 240, 32, 48),
                        cc.rect(0, 96, 32, 48)
                    ],
                delay: 0.1,
                flippedX: true
            },
            "punching_right":
            {
                frameRects:
                    [
                        cc.rect(0, 240, 32, 48),
                        cc.rect(32, 240, 32, 48),
                        cc.rect(32, 240, 32, 48),
                        cc.rect(0, 96, 32, 48)
                    ],
                delay: 0.1
            }

        };
        this.sprite = new waw.AnimatedSprite(s_Jesus, animData);
        this.addChild(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0);
        //this.debugCross.setPosition(0, -24);

        //add debug text info under the player
//        if(showDebugInfo) {
            this.label = new cc.LabelTTF("Player", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(0, -4);
            this.label.setVisible(showDebugInfo);
//        }

        //create players shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow);
        this.shadowSprite.setAnchorPoint(0.5 , 0.5);

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
    calcDirection: function (dx, dy) {
        if (dx < 0)
            this.direction = "left";
        else if (dx > 0)
            this.direction = "right";
        else if (dy > 0)
            this.direction = "up";
        else if (dy < 0)
            this.direction = "down";
    },
    update: function(pos_) {
        //punching
/*        if(waw.KEYS[cc.KEY.space]){
            this.state = "punching";
            console.log("space");
        }*/

        //var curPos = this.getPosition();
        var pos = this.handleCollisions();

        this.calcDirection(pos.x - this.x, pos.y - this.y);

        this.setPosition(pos);
        //Z Index
        this.setZOrder(250- pos.y);

        var animKey = this.getState() + "_" + this.getDirection();
        this.sprite.playAnimation(animKey);

        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y+0);

        if(showDebugInfo && this.label) {
            //this.label.setString("" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "\n" + gr.x.toFixed(2) + "," + gr.y.toFixed(2));
            this.label.setString("" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "\n" + this.getDirection());
        }
    },
    handleCollisions: function () {
        var nextPos = this.getNextPosition();
        var curPos = this.getPosition();
        var curCollideRect = this.collideRect(curPos);
        var nextCollideRect = this.collideRect(nextPos);
        waw.units.forEach(function (unit) {
            var unitRect = unit.collideRect();
            var rect = cc.rectIntersection(nextCollideRect, unitRect);
            //TODO check this condition && why not || ?
            if (rect.width > 0 && rect.height > 0) // Collision!
            {
//                var oldPos = waw.player.getPosition();
                var oldRect = cc.rectIntersection(curCollideRect , unitRect);

                if (oldRect.height > 0) {
                    // Block the player horizontally
                    nextPos.x = curPos.x;
                }

                if (oldRect.width > 0) {
                    // Block the player vertically
                    nextPos.y = curPos.y;
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
            waw.KEYS[cc.KEY.down] ? "walking" :
                waw.KEYS[cc.KEY.space] ? "punching" : "standing";
        //if(waw.KEYS[cc.KEY.space])

        if(state === "punching" && !waw.whip.visible) {
            waw.whip.visible = true;
            switch(this.direction){
                case "down":
                    waw.whip.setTo(waw.whip.WHIP_HIT1);
                    waw.whip.rotation = 0;
                    waw.whip.zIndex = 10;
                    break;
                case "right":
                    waw.whip.setTo(waw.whip.WHIP_HIT1);
                    waw.whip.rotation = -90;
                    waw.whip.zIndex = 10;
                    break;
                case "up":
                    waw.whip.setTo(waw.whip.WHIP_HIT1);
                    waw.whip.rotation = 180;
                    waw.whip.zIndex = -10;
                    break;
                case "left":
                    waw.whip.setTo(waw.whip.WHIP_HIT2);
                    waw.whip.rotation = 90;
                    waw.whip.zIndex = -10;
                    break;
            }
        }
        if(state !== "punching" && waw.whip.visible) {
            waw.whip.visible = false;
            switch(this.direction){
                case "down":
                    waw.whip.setInstantlyTo(waw.whip.WHIP_BACK1);
                    waw.whip.rotation = 180;
                    waw.whip.zIndex = 10;
                    break;
                case "right":
                    waw.whip.setInstantlyTo(waw.whip.WHIP_BACK1);
                    waw.whip.rotation = 90;
                    waw.whip.zIndex = 10;
                    break;
                case "up":
                    waw.whip.setInstantlyTo(waw.whip.WHIP_BACK1);
                    waw.whip.rotation = 0;
                    waw.whip.zIndex = -10;
                    break;
                case "left":
                    waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                    waw.whip.rotation = -90;
                    waw.whip.zIndex = -10;
                    break;
            }

        }
        return state;
    },
    getDirection: function() {
        return this.direction;
    }
});