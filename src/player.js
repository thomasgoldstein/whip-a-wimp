"use strict";
waw.Player = waw.Unit.extend({
    speed: 6,
    timeToThink: 0,
    ctor: function() {
        this._super();
        //console.info("Player ctor");
        this.setContentSize(16, 16);

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

        //add debug text info under the player
//        if(showDebugInfo) {
            this.label = new cc.LabelTTF("Player", "System", 9);
            this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
            this.label.setPosition(0, -4);
            this.label.setVisible(showDebugInfo);
//        }

        //create players shadow sprite
        this.shadowSprite = new cc.Sprite(s_Shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5 , 0.5);

        //this.alive = true;
    },
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

        var animKey = this.getState() + "_" + this.direction;
        this.sprite.playAnimation(animKey);

        //position shadow
        this.shadowSprite.setPosition(pos.x, pos.y+0);

        this.doCheckAction();    //Hit Button

        if(showDebugInfo && this.label) {
            //this.label.setString("" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "\n" + gr.x.toFixed(2) + "," + gr.y.toFixed(2));
            this.label.setString("" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "\n" + this.direction);
        }
    },
    handleCollisions: function () {
        var nextPos = this.getNextPosition();
        var curPos = this.getPosition();
        var curCollideRect = this.collideRect(curPos);
        var nextCollideRect = this.collideRect(nextPos);
        waw.units.forEach(function (unit) {
            if(unit && unit.getTag() < TAG_ENEMY) {
                var unitRect = unit.collideRect();
                var rect = cc.rectIntersection(nextCollideRect, unitRect);
                //TODO check this condition && why not || ?
                if (rect.width > 0 && rect.height > 0) // Collision!
                {
//                var oldPos = waw.player.getPosition();
                    var oldRect = cc.rectIntersection(curCollideRect, unitRect);

                    if (oldRect.height > 0) {
                        // Block the player horizontally
                        nextPos.x = curPos.x;
                    }

                    if (oldRect.width > 0) {
                        // Block the player vertically
                        nextPos.y = curPos.y;
                    }
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
    onDeath: function () {
        if (this.subState === "dead")
            return;

        this.subState = "dead";

        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
            var transition = cc.TransitionRotoZoom;
            cc.director.runScene(new transition(1, new waw.GameOverScene()));  //1st arg = in seconds duration of t
        }, 1);
    },
    shakePillar: function (unit) {
        //TODO move it to another file
        //console.log("shake pillar");
        var r = Math.random() * 3 + 2;
        if (Math.random() < 0.5)
            r = -r;
        unit.sprite.runAction(
            cc.sequence(
                cc.skewBy(0.3, -r, 0),
                cc.skewBy(0.3, r, 0)
            )
        );
    },
    interactWithUnit: function (unit) {
        var t = unit.getTag();
        switch(t) {
            case TAG_PILLAR:
                this.shakePillar(unit);
                break;
            case TAG_DOWN_DOORD:
            case TAG_UP_DOORD:
            case TAG_LEFT_DOORD:
            case TAG_RIGHT_DOORD:
                waw.openDoor(t, this.getParent());
                break;
            default:
                if(t>0)
                   console.log("Wrong Unit Tag 4interaction: "+t);
        }
    },
    doCheckAction: function () {
        var currentTime = new Date();
        //var t, x = this.x-16, y = this.y- 8;
        if (!waw.KEYS[cc.KEY.space] || currentTime.getTime() < this.timeToThink)
            return;
        //cool down time 1 sec
        this.timeToThink = currentTime.getTime() + 1000;

        var playerBiggerRect = cc.rect(this.x-16, this.y- 8, this.width + 16, this.height + 16);

        for (var i = 0; i < waw.units.length; i++) {
            var unit = waw.units[i];
            if(!unit)
                continue;
            //console.log(unit.getTag());
            var unitRect = unit.collideRect();
            if(cc.rectIntersectsRect(playerBiggerRect, unit.collideRect())){
                this.interactWithUnit(unit);
            }
            /*if (cc.rectContainsPoint(unitRect, new cc.Point(x + 16, y))) {
                this.interactWithUnit(unit);
            }*/
        }
    }
});