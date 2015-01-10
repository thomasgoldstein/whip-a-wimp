"use strict";
waw.Player = waw.Unit.extend({
    speed: 6,
    //timeToThink: 0,
    ctor: function() {
        this._super();
        //console.info("Player ctor");
        this.setContentSize(16, 16);

        var animData =
        {
            "death":
            {
                frameRects:
                [
                    cc.rect(1*34+1, 6*50+1, 32, 48),
                    cc.rect(2*34+1, 2*50+1, 32, 48),
                    cc.rect(2*34+1, 1*50+1, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "idle_up":
            {
                frameRects:
                [
                    cc.rect(0*34+1, 1*50+1, 32, 48)
                ],
                delay: 0.1
            },
            "idle_down":
            {
                frameRects:
                [
                    cc.rect(0*34+1, 0*50+1, 32, 48)
                ],
                delay: 0.1
            },
            "idle_left":
            {
                frameRects:
                [
                    cc.rect(0*34+1, 2*50+1, 32, 48)
                ],
                delay: 0.1,
                flippedX: true
            },
            "idle_right":
            {
                frameRects:
                [
                    cc.rect(0*34+1, 2*50+1, 32, 48)
                ],
                delay: 0.1
            },
            "walk_up":
            {
                frameRects:
                [
                    cc.rect(1*34+1, 1*50+1, 32, 48),
                    cc.rect(2*34+1, 1*50+1, 32, 48),
                    cc.rect(1*34+1, 1*50+1, 32, 48),
                    cc.rect(0*34+1, 1*50+1, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_down":
            {
                frameRects:
                [
                    cc.rect(1*34+1, 0*50+1, 32, 48),
                    cc.rect(2*34+1, 0*50+1, 32, 48),
                    cc.rect(1*34+1, 0*50+1, 32, 48),
                    cc.rect(0*34+1, 0*50+1, 32, 48)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_left":
            {
                frameRects:
                [
                    cc.rect(0*34+1, 3*50+1, 32, 48),
                    cc.rect(1*34+1, 3*50+1, 32, 48),
                    cc.rect(0*34+1, 3*50+1, 32, 48),
                    cc.rect(0*34+1, 2*50+1, 32, 48),
                    cc.rect(1*34+1, 2*50+1, 32, 48),
                    cc.rect(2*34+1, 2*50+1, 32, 48),
                    cc.rect(1*34+1, 2*50+1, 32, 48),
                    cc.rect(0*34+1, 2*50+1, 32, 48)
                ],
                delay: 0.1,
                flippedX: true
            },
            "walk_right":
            {
                frameRects:
                [
                    cc.rect(1*34+1, 2*50+1, 32, 48),
                    cc.rect(2*34+1, 2*50+1, 32, 48),
                    cc.rect(1*34+1, 2*50+1, 32, 48),
                    cc.rect(0*34+1, 2*50+1, 32, 48),
                    cc.rect(0*34+1, 3*50+1, 32, 48),
                    cc.rect(1*34+1, 3*50+1, 32, 48),
                    cc.rect(0*34+1, 3*50+1, 32, 48),
                    cc.rect(0*34+1, 2*50+1, 32, 48)
                ],
                delay: 0.1
            },
            "punch_up":
            {
                frameRects:
                    [
                        cc.rect(0*34+1, 4*50+1, 32, 48),
                        cc.rect(1*34+1, 4*50+1, 32, 48),
                        cc.rect(1*34+1, 4*50+1, 32, 48),
                        cc.rect(0*34+1, 1*50+1, 32, 48)
                    ],
                delay: 0.2,
                //mirrorX: true
            },
            "punch_down":
            {
                frameRects:
                    [
                        cc.rect(0*34+1, 6*50+1, 32, 48),
                        cc.rect(1*34+1, 6*50+1, 32, 48),
                        cc.rect(1*34+1, 6*50+1, 32, 48),
                        cc.rect(0*34+1, 0*50+1, 32, 48)
                    ],
                delay: 0.2,
                //mirrorX: true
            },
            "punch_left":
            {
                frameRects:
                    [
                        cc.rect(0*34+1, 5*50+1, 32, 48),
                        cc.rect(1*34+1, 5*50+1, 32, 48),
                        cc.rect(1*34+1, 5*50+1, 32, 48),
                        cc.rect(0*34+1, 2*50+1, 32, 48)
                    ],
                delay: 0.2,
                flippedX: true
            },
            "punch_right":
            {
                frameRects:
                    [
                        cc.rect(0*34+1, 5*50+1, 32, 48),
                        cc.rect(1*34+1, 5*50+1, 32, 48),
                        cc.rect(1*34+1, 5*50+1, 32, 48),
                        cc.rect(0*34+1, 2*50+1, 32, 48)
                    ],
                delay: 0.2
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
        var pos = this.getPosition();

        this.doCheckAction();    //Hit Button
        this.checkSubState();

        switch(this.subState) {
            case "whip":
                break;
            default:
                //var curPos = this.getPosition();
                pos = this.handleCollisions();
                this.calcDirection(pos.x - this.x, pos.y - this.y);
                this.setPosition(pos);
                //Z Index
                this.setZOrder(250- pos.y);
                var animKey = this.getState() + "_" + this.direction;
                this.sprite.playAnimation(animKey);
                //position shadow
                this.shadowSprite.setPosition(pos.x, pos.y+0);

        }

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
            waw.KEYS[cc.KEY.down] ? "walk" :
                //waw.KEYS[cc.KEY.space] ? "punch" : "idle";
                "idle";
        //if(waw.KEYS[cc.KEY.space])
        /*if(this.subState === "whip"){
            state = "punch";
        }*/
        return state;
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
            case TAG_ENEMY:
                //TODO temp. remove later
                //unit.onDeath(this);
                break;
            default:
                if(t>0)
                   console.log("Wrong Unit Tag 4interaction: "+t);
        }
    },
    doCheckAction: function () {
        var currentTime = new Date();
        //var t, x = this.x-16, y = this.y- 8;
        //if (!waw.KEYS[cc.KEY.space] || currentTime.getTime() < this.timeToThink)
        if (!waw.KEYS[cc.KEY.space]
            || this.subState === "whip"
            || this.subState === "invincible"
        )
            return;
        //cool down time 1 sec
        //this.timeToThink = currentTime.getTime() + 1000;

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

        switch (this.state) {
            case "invincible":
                break;
            case "idle":
            case "walk":
                if(Math.random() < 0.5)
                    cc.audioEngine.playEffect(sfx_Whip01);
                else
                    cc.audioEngine.playEffect(sfx_Whip02);
                waw.whip.visible = true;
                this.setSubState("whip",600);
                switch (this.direction) {
                    case "down":
                        waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                        waw.whip.setTo(waw.whip.WHIP_HIT_UP);
                        this.scheduleOnce(function () {waw.whip.setTo(waw.whip.WHIP_GROUNDL);}, 0.40);
                        waw.whip.rotation = 0;
                        waw.whip.zIndex = 10;
                        waw.whip.setPosition(-10, 24);
                        this.scheduleOnce(function () {waw.whip.setPosition(-10, 14);}, 0.2);
                        break;
                    case "right":
                        waw.whip.setInstantlyTo(waw.whip.WHIP_BACK1);
                        waw.whip.setTo(waw.whip.WHIP_HIT1);
                        this.scheduleOnce(function () {waw.whip.setTo(waw.whip.WHIP_GROUNDR);}, 0.40);
                        waw.whip.rotation = -90;
                        waw.whip.zIndex = 10;
                        waw.whip.setPosition(-2, 22);
                        this.scheduleOnce(function () {waw.whip.setPosition(12, 14);}, 0.2);
                        break;
                    case "up":
                        waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                        waw.whip.setTo(waw.whip.WHIP_HIT_UP);
                        this.scheduleOnce(function () {waw.whip.setTo(waw.whip.WHIP_GROUNDL);}, 0.40);
                        waw.whip.rotation = 180;
                        waw.whip.zIndex = -10;
                        waw.whip.setPosition(10, 24);
                        this.scheduleOnce(function () {waw.whip.setPosition(10, 14);}, 0.2);
                        break;
                    case "left":
                        waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                        waw.whip.setTo(waw.whip.WHIP_HIT2);
                        this.scheduleOnce(function () {waw.whip.setTo(waw.whip.WHIP_GROUNDL);}, 0.40);
                        waw.whip.rotation = 90;
                        waw.whip.zIndex = 10;
                        waw.whip.setPosition(2, 22);
                        this.scheduleOnce(function () {waw.whip.setPosition(-12, 14);}, 0.2);
                        break;
                }
                var animKey = "punch_" + this.direction;
                this.sprite.playAnimation(animKey);
                break;
        }
    },
    checkSubState: function () {
        var currentTime = new Date();
        if (this.subStateCountDown === 0 || this.subState === "" || currentTime.getTime() < this.subStateCountDown)
            return;
        console.log("subact tim: ", this.subState);
        switch(this.subState){
            case "invincible":
                //console.log("REMOVE subact tim: ", this.subState);
                //this.stopActionByTag(TAG_SUBSTATE_ANIMATION);
                //this.visible = true;
                this.setSubState("");
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                break;
            case "whip":
                //console.log("REMOVE subact tim: ", this.subState);

                var wp =  waw.whip.getHitPosition();
                //console.log("Whip HIT Coords: ", wp.x, wp.y );
                var cross = new cc.Sprite(s_Sparkle,
                    cc.rect(3 * 8, 0, 7, 7));
                cross.setPosition(wp.x, wp.y);
                //var p = this.getParent();
                this.getParent().addChild(cross, 300);
                cross.runAction(new cc.Sequence(
                    new cc.Spawn(
                        new cc.FadeOut(0.3),
                        new cc.RotateBy(0.3, 45),
                        new cc.ScaleTo(0.3, 0.5)
                    ),
                    new cc.RemoveSelf()
                ));

                waw.whip.visible = false;
                this.state = "idle";
                this.setSubState("");

                for(var n=0; n<waw.foes.length; n++){
                    var m = waw.foes[n];
                    if( m ) {
                        //if (cc.rectContainsPoint(m.collideRect(), wp)) {
                        //    m.onDeath(this);
                            break;
                        //}
                    }
                }
                break;
            default:
                this.setSubState("");
        }
    },
    becomeInvincible: function() {
        this.setSubState("invincible", 2000);
        //var action = new cc.Blink(10,30);
        //var action = new cc.FadeTo(0.1,  128);
        //var action2 = new cc.FadeTo(0.1,  128);
        //action.setTag(TAG_SUBSTATE_ANIMATION);
        //this.sprite.runAction(action);
        //this.shadowSprite.runAction(action2);
        this.sprite.opacity = 180;
        this.shadowSprite.opacity = 180;

        waw.whip.visible = false; //hide Whip
    },
    onDeath: function (mob) {
        if (this.subState === "invincible")
            return;

        if (this.subState === "death")
            return;
        this.subState = "death";
        this.sprite.playAnimation("death");
        this.sprite.runAction(new cc.MoveBy(3, 0, 240));
        this.sprite.runAction(new cc.FadeOut(3));
        this.shadowSprite.runAction(new cc.FadeOut(3));
        this.shadowSprite.runAction(new cc.ScaleTo(3, 0.3));

        if(mob){
            //mob.sprite.visible = false;
            //TODO actions dont work. I make mob transparent for debug
            mob.sprite.opacity = 100;
            mob.shadowSprite.opacity = 100;
            console.log("You were killed by "+mob.mobType+"'s touch");
            //runAction(new cc.TintTo(0, 255, 0, 0));
        }

        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
            var transition = cc.TransitionRotoZoom;
            cc.director.runScene(new transition(1, new waw.GameOverScene()));  //1st arg = in seconds duration of t
        }, 1);
    }
});