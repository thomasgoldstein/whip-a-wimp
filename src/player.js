"use strict";
waw.Player = waw.Unit.extend({
    speed: 6,
    HP: 2,
    currentWeapon: "whip",
    weaponSprite: null,
    sprite: null,
    sprite2: null,

    ctor: function() {
        this._super();
        //console.info("Player ctor");
        this.HP = 2;

        this.setContentSize(16, 16);
        var s = waw.SpriteRect(32,48);

        var animData =
        {
            "hurt": {
                frameRects: [
                    s(0,10), s(1,10), s(1,10), s(0,10), s(2,7)
                ],
                delay: 0.15
            },
            "dead": {
                frameRects: [
                    s(0,10), s(1,10), s(0,10), s(0,11), s(1,11), s(1,11), s(1,11), s(1,11), s(1,11), s(1,11), s(1,11), s(1,11), s(1,11)
                ],
                delay: 0.15,
                mirrorX: true
            },
            "idle_up": {
                frameRects: [
                    s(0,1), s(1,1), s(2,1), s(1,1)
                ],
                delay: 0.2
            },
            "idle_down": {
                frameRects: [
                    s(0,0), s(1,0), s(2,0), s(1,0)
                ],
                delay: 0.2
            },
            "idle_left": {
                frameRects: [
                    s(0,2), s(1,2), s(2,2), s(1,2)
                ],
                delay: 0.2,
                flippedX: true
            },
            "idle_right": {
                frameRects: [
                    s(0,2), s(1,2), s(2,2), s(1,2)
                ],
                delay: 0.2
            },
            "walk_up": {
                frameRects: [
                    s(0,4), s(1,4), s(0,4), s(0,1)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_down": {
                frameRects: [
                    s(0,3), s(1,3), s(0,3), s(0,0)
                ],
                delay: 0.1,
                mirrorX: true
            },
            "walk_left": {
                frameRects: [
                    s(0,5), s(1,5), s(0,5), s(0,2), s(0,6), s(1,6), s(0,6), s(0,2)
                ],
                delay: 0.1,
                flippedX: true
            },
            "walk_right": {
                frameRects: [
                    s(0,5), s(1,5), s(0,5), s(0,2), s(0,6), s(1,6), s(0,6), s(0,2)
                ],
                delay: 0.1
            },
            "punch_up": {
                frameRects: [
                    s(0,8), s(1,8), s(2,8), s(2,8), s(2,8), s(2,8), s(2,8), s(0,1)
                ],
                delay: 0.1
            },
            "punch_down": {
                frameRects: [
                    s(0,7), s(1,7), s(2,7), s(2,7), s(2,7), s(2,7), s(2,7), s(0,0)
                ],
                delay: 0.1
            },
            "punch_left": {
                frameRects: [
                    s(0,9), s(1,9), s(2,9), s(2,9), s(2,9), s(2,9), s(0,2), s(0,2)
                ],
                delay: 0.1,
                flippedX: true
            },
            "punch_right": {
                frameRects: [
                    s(0,9), s(1,9), s(2,9), s(2,9), s(2,9), s(2,9), s(0,2), s(0,2)
                ],
                delay: 0.1
            }

        };
        //Red Cloth animations cloned from players
        var animData2 = waw.deepCopy(animData);
        animData2["walk_up"] =
        {
            frameRects: [
                s(0,4), s(1,4), s(0,4), s(0,1), s(3,4), s(4,4), s(3,4), s(0,1)
            ],
            delay: 0.1
        };
        animData2["walk_down"] =
        {
            frameRects: [
                s(0,3), s(1,3), s(0,3), s(0,0), s(3,3), s(4,3), s(3,3), s(0,0)
            ],
            delay: 0.1
        };
        animData2["idle_left"] =
        {
            frameRects: [
                s(3,2), s(4,2), s(5,2), s(4,2)
            ],
            delay: 0.2
        };
        animData2["walk_left"] =
        {
            frameRects: [
                s(3,5), s(4,5), s(3,5), s(3,2), s(3,6), s(4,6), s(3,6), s(3,2)
            ],
            delay: 0.1
        };
        animData2["punch_left"] =
        {
            frameRects: [
                s(3,9), s(4,9), s(5,9), s(5,9), s(5,9), s(5,9), s(3,2), s(3,2)
            ],
            delay: 0.1
        };

        this.sprite = new waw.AnimatedSprite(waw.gfx.jesus, animData);
        this.addChild(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0);

        this.sprite2 = new waw.AnimatedSprite(waw.gfx.jesusCloth, animData2);
        this.addChild(this.sprite2);
        this.sprite2.setAnchorPoint(0.5, 0);

        //add debug text info under the player
        this.label = new cc.LabelTTF("Player", "System", 9);
        this.addChild(this.label, 299); //, TAG_LABEL_SPRITE1);
        this.label.setPosition(0, -4);
        this.label.setVisible(showDebugInfo);

        //create players shadow sprite
        this.shadowSprite = new cc.Sprite(waw.gfx.shadow24x12);
        this.shadowSprite.setAnchorPoint(0.5 , 0.5);
    },
    getNextPosition: function() {
        var x = this.x,
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
            case "punch":
            case "candelabre":
            case "hurt":
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
                this.sprite2.playAnimation(animKey);
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
        return nextPos;
    },

    getState: function() {
        var state =
            waw.KEYS[cc.KEY.left] ||
            waw.KEYS[cc.KEY.right] ||
            waw.KEYS[cc.KEY.up] ||
            waw.KEYS[cc.KEY.down] ? "walk" : "idle";
        return state;
    },
    interactWithUnit: function (unit) {
        var t = unit.getTag();
        switch(t) {
            case TAG_PILLAR:
                //return true;
                break;
            case TAG_DOWN_DOORD:
                if(this.direction === "down") {
                    waw.openDoor(t, this.getParent());
                    return true;
                }
                break;
            case TAG_UP_DOORD:
                if(this.direction === "up") {
                    waw.openDoor(t, this.getParent());
                    return true;
                }
                break;
            case TAG_LEFT_DOORD:
                if(this.direction === "left") {
                    waw.openDoor(t, this.getParent());
                    return true;
                }
                break;
            case TAG_RIGHT_DOORD:
                if(this.direction === "right") {
                    waw.openDoor(t, this.getParent());
                    return true;
                }
                break;
            case TAG_CHEST:
                unit.onOpen(this);
                return true;
                break;
            case TAG_EXIT:
                waw.openExitDoor();
                return true;
                break;
            case TAG_SECRET:
                //TODO
                waw.openSecretDoor(unit);
                break;
            default:
                if(t>0)
                   console.log("Wrong Unit Tag 4interaction: "+t);
        }
        return false;
    },
    doCheckAction: function () {
        var currentTime = new Date();
        if (!waw.KEYS[cc.KEY.space]
            || this.subState === "whip"
            || this.subState === "punch"
            || this.subState === "candelabre"
            //|| this.subState === "invincible"
            || this.subState === "cooldown"
            || this.subState === "hurt"
        )
            return;

        var playerBiggerRect = cc.rect(this.x-10, this.y- 2, this.width + 4, this.height + 4);

        var interactions= 0;
        for (var i = 0; i < waw.units.length; i++) {
            var unit = waw.units[i];
            if(!unit)
                continue;
            //var unitRect = unit.collideRect();
            if(cc.rectIntersectsRect(playerBiggerRect, unit.collideRect())){
                if(this.interactWithUnit(unit))
                    interactions++;
            }
        }

        switch (this.state) {
            case "cooldown":
                break;
            case "invincible":
            case "idle":
            case "walk":
                this.setSubState(this.currentWeapon,600);   //whip, punch, candelabre, etc
                if(interactions>0) //TODO hack  to open chests/doors w/o whip
                    this.subState = "punch";
                switch (this.subState) {
                    case "punch":
                        cc.audioEngine.playEffect(waw.sfx.punch01);
                        this.showHitBoxAndKill(24, 8);

                        var animKey = "punch_" + this.direction;
                        this.sprite.playAnimation(animKey);
                        this.sprite2.playAnimation(animKey);
                        break;
                    case "candelabre":
                        cc.audioEngine.playEffect(waw.sfx.candelabre01);
                        this.showHitBoxAndKill(32, 12);

                        var animKey = "punch_" + this.direction;

                        this.weaponSprite = new cc.Sprite(waw.gfx.weapons,
                            cc.rect(13, 0, 34, 34));
                        this.weaponSprite.setAnchorPoint(0.5, 0.8);
                        this.weaponSprite.runAction(new cc.Sequence(
                            new cc.Spawn(
                                //new cc.FadeOut(0.6),
                                //new cc.RotateBy(0.6, 45),
                                new cc.ScaleTo(0.6, 1.1)
                            ),
                            new cc.RemoveSelf()
                        ));
                        this.addChild(this.weaponSprite);

                        this.sprite.playAnimation(animKey);
                        this.sprite2.playAnimation(animKey);

                        switch (this.direction) {
                            case "down":
                                this.weaponSprite.rotation = 0;
                                this.weaponSprite.zIndex = 10;
                                this.weaponSprite.setPosition(-10, 24);
                                this.scheduleOnce(function () {
                                    this.weaponSprite.setPosition(-10, 14);
                                }, 0.2);
                                this.weaponSprite.runAction(new cc.RotateBy(0.3, -10));
                                break;
                            case "right":
                                this.weaponSprite.rotation = -90;
                                this.weaponSprite.zIndex = 10;
                                this.weaponSprite.setPosition(-2, 22);
                                this.scheduleOnce(function () {
                                    this.weaponSprite.setPosition(12, 14);
                                }, 0.2);
                                this.weaponSprite.runAction(new cc.RotateBy(0.3, 30));
                                break;
                            case "up":
                                this.weaponSprite.rotation = 180;
                                this.weaponSprite.zIndex = -10;
                                this.weaponSprite.setPosition(10, 24);
                                this.scheduleOnce(function () {
                                    this.weaponSprite.setPosition(10, 14);
                                }, 0.2);
                                this.weaponSprite.runAction(new cc.RotateBy(0.3, 10));
                                break;
                            case "left":
                                this.weaponSprite.rotation = 90;
                                this.weaponSprite.zIndex = 10;
                                this.weaponSprite.setPosition(2, 22);
                                this.scheduleOnce(function () {
                                    this.weaponSprite.setPosition(-12, 14);
                                }, 0.2);
                                this.weaponSprite.runAction(new cc.RotateBy(0.3, -30));
                                break;
                        }
                        break;
                    case "whip":
                        if(Math.random() < 0.5)
                            cc.audioEngine.playEffect(waw.sfx.whip01);
                        else
                            cc.audioEngine.playEffect(waw.sfx.whip02);
                        waw.whip.visible = true;
                        this.showHitBoxAndKill(20 + waw.whip.chainLength * 10 , 8);
                        switch (this.direction) {
                            case "down":
                                waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                                waw.whip.setTo(waw.whip.WHIP_HIT_UP);
                                this.scheduleOnce(function () {
                                    waw.whip.setTo(waw.whip.WHIP_GROUNDL);
                                }, 0.40);
                                waw.whip.rotation = 0;
                                waw.whip.zIndex = 10;
                                waw.whip.setPosition(-10, 24);
                                this.scheduleOnce(function () {
                                    waw.whip.setPosition(-10, 14);
                                }, 0.2);
                                break;
                            case "right":
                                waw.whip.setInstantlyTo(waw.whip.WHIP_BACK1);
                                waw.whip.setTo(waw.whip.WHIP_HIT1);
                                this.scheduleOnce(function () {
                                    waw.whip.setTo(waw.whip.WHIP_GROUNDR);
                                }, 0.40);
                                waw.whip.rotation = -90;
                                waw.whip.zIndex = 10;
                                waw.whip.setPosition(0, 22);
                                this.scheduleOnce(function () {
                                    waw.whip.setPosition(12, 14);
                                }, 0.2);
                                break;
                            case "up":
                                waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                                waw.whip.setTo(waw.whip.WHIP_HIT_UP);
                                this.scheduleOnce(function () {
                                    waw.whip.setTo(waw.whip.WHIP_GROUNDL);
                                }, 0.40);
                                waw.whip.rotation = 180;
                                waw.whip.zIndex = -10;
                                waw.whip.setPosition(10, 24);
                                this.scheduleOnce(function () {
                                    waw.whip.setPosition(10, 14);
                                }, 0.2);
                                break;
                            case "left":
                                waw.whip.setInstantlyTo(waw.whip.WHIP_BACK2);
                                waw.whip.setTo(waw.whip.WHIP_HIT2);
                                this.scheduleOnce(function () {
                                    waw.whip.setTo(waw.whip.WHIP_GROUNDL);
                                }, 0.40);
                                waw.whip.rotation = 90;
                                waw.whip.zIndex = 10;
                                waw.whip.setPosition(0, 22);
                                this.scheduleOnce(function () {
                                    waw.whip.setPosition(-12, 14);
                                }, 0.2);
                                break;
                        }
                        var animKey = "punch_" + this.direction;
                        this.sprite.playAnimation(animKey);
                        this.sprite2.playAnimation(animKey);
                        break;
                }
                break;
        }
    },
    checkSubState: function () {
        var currentTime = new Date();
        if (this.subStateCountDown === 0 || this.subState === "" || currentTime.getTime() < this.subStateCountDown)
            return;
        //console.log("subact tim: ", this.subState);
        switch(this.subState){
            case "cooldown":
                this.setSubState("");
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                break;
            case "invincible":
                //console.log("REMOVE subact tim: ", this.subState);
                //this.stopActionByTag(TAG_SUBSTATE_ANIMATION);
                //this.visible = true;
                this.setSubState("");
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                break;
            case "punch":
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                this.state = "idle";
                this.setSubState("cooldown",250);
                break;
            case "hurt":
                this.state = "idle";
                this.becomeInvincible(500);
                break;
            case "candelabre":
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                this.state = "idle";
                this.setSubState("cooldown",400);
                break;
            case "whip":
                this.sprite.opacity = 255;
                this.shadowSprite.opacity = 255;
                //console.log("REMOVE subact tim: ", this.subState);

                var wp =  waw.whip.getHitPosition();
                //console.log("Whip HIT Coords: ", wp.x, wp.y );
                var cross = new cc.Sprite(waw.gfx.sparkle,
                    cc.rect(3 * 8, 0, 7, 7));
                cross.setPosition(wp.x, wp.y);
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
                this.setSubState("cooldown",500);
                break;
            default:
                this.setSubState("");
        }
    },
    showHitBoxAndKill: function(wa, ha) {
        var hitArea_rect = cc.rect(this.x - wa, this.y - ha + 8, wa*2, ha*2);
        switch (this.direction) {
            case "down":
                hitArea_rect = cc.rect(this.x - 8, this.y - wa + 8, ha*2, wa);
                break;
            case "right":
                hitArea_rect = cc.rect(this.x , this.y + 8, wa, ha*2);
                break;
            case "up":
                hitArea_rect = cc.rect(this.x - 8, this.y + 8, ha*2, wa);
                break;
            case "left":
                hitArea_rect = cc.rect(this.x - wa, this.y + 8, wa, ha*2);
                break;
        }
        if (showDebugInfo) {
            //debug - show hit box
            var hitArea = new cc.Sprite(waw.gfx.hitBoxGrid, hitArea_rect);
            hitArea.setPosition(this.x, this.y + 8);
            switch (this.direction) {
                case "down":
                    hitArea.setAnchorPoint(0.5, 1);
                    break;
                case "right":
                    hitArea.setAnchorPoint(0, 0.5);
                    break;
                case "up":
                    hitArea.setAnchorPoint(0.5, 0);
                    break;
                case "left":
                    hitArea.setAnchorPoint(1, 0.5);
                    break;
            }
            this.getParent().addChild(hitArea, 300);
            hitArea.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.RemoveSelf()
            ));
        }
        for(var n=0; n<waw.mobs.length; n++){
            var m = waw.mobs[n];
            if( m ) {
                if (cc.rectIntersectsRect(m.collideRect(), hitArea_rect)) {
                    m.onGetDamage(this);
                    //break;
                }
            }
        }
        //last mob killed? open trap room
        if(waw.curRoom.trapActive && waw.allEnemyKilled()){
            waw.deactivateTrapRoom();
        }
    },
    becomeInvincible: function() {
        this.setSubState("invincible", 1500);
        this.sprite.opacity = 180;
        this.shadowSprite.opacity = 180;

        waw.whip.visible = false; //hide Whip
    },
    onGetDamage : function (killer) {
        if (this.subState === "invincible"/* || killer.subState === "invincible"*/)
            return;
        if (this.subState === "hurt")
            return;
        if (this.subState === "dead")
            return;
        this.HP--;

        var random = Math.random();
        var sound = random >= 0.5 ? waw.sfx.ouch01 : random >= 0.2 ? waw.sfx.ouch02 : waw.sfx.ouch03;
        cc.audioEngine.playEffect(sound);

        this.setSubState("hurt", 500);
        this.sprite.playAnimation("hurt");
        this.sprite2.playAnimation("hurt");

        if (this.HP <= 0)
            this.onDeath(killer);
        if (this.HP === 1) {
            this.sprite2.visible = false;
            this.runAction(new cc.jumpBy(0.35, 0, 0, 8, 1));

            var redCloth = new cc.Sprite(waw.gfx.jesusCloth,
                cc.rect(0*34+1, 1*50+1, 32, 48));
            redCloth.setPosition(this.x, this.y+36);
            this.getParent().addChild(redCloth, 300);
            redCloth.runAction(new cc.Sequence(
                new cc.Spawn(
                    new cc.FadeOut(0.5),
                    new cc.RotateBy(0.5, -45 + Math.random()*90),
                    new cc.MoveBy(0.5, -8 + Math.random()*16, -24)
                ),
                new cc.RemoveSelf()
            ));
        }
    },
    onDeath: function (killer) {
        if (this.subState === "dead")
            return;
        waw.player.setZOrder(500);  //whole overlays all the other gfx
        //shift Y to hit the back
        var backY = 12;
        this.y += backY;
        this.sprite.y -= backY;

        this.unscheduleAllCallbacks();
        this.unscheduleUpdate();
        this.getParent().unscheduleUpdate(); //for the Scene (with mobs loop)

        var c = this.getParent().getChildren();
        for(var i=0; i<c.length; i++){
            if(c[i] !== this){
                c[i].unscheduleUpdate();
            }
        }

       /* var random = Math.random();
        var sound = random >= 0.5 ? waw.sfx.ouch01 : random >= 0.2 ? waw.sfx.ouch02 : waw.sfx.ouch03;
        cc.audioEngine.playEffect(sound);*/

        //Cherub anim
        var s = waw.SpriteRect(24,32);
        var animDataChe =
        {
            "left": {
                frameRects: [
                    s(0, 0), s(1, 0), s(2, 0), s(1, 0)
                ],
                delay: 0.15,
                flippedX: true
            },
            "right": {
                frameRects: [
                    s(0, 0), s(1, 0), s(2, 0), s(1, 0)
                ],
                delay: 0.16
            }
        };
        var cherubSprite1 = new waw.AnimatedSprite(waw.gfx.cherub, animDataChe);
        var cherubSprite2 = new waw.AnimatedSprite(waw.gfx.cherub, animDataChe);
        var spriteCross = new cc.Sprite(waw.gfx.jesus, cc.rect(2, 664, 50, 61)); //crs
        var spriteJh = new cc.Sprite(waw.gfx.jesus, cc.rect(1, 605, 52, 55)); //J hang

        var light = new cc.Node();
        var lightRayBlack1 = new cc.Sprite(waw.gfx.lightRay, cc.rect(8, 8, 8, 8));
        var lightRayBlack2 = new cc.Sprite(waw.gfx.lightRay, cc.rect(8, 8, 8, 8));
        var lightRayBlack3 = new cc.Sprite(waw.gfx.lightRay, cc.rect(8, 8, 8, 8));

        var blackScreen = new cc.Sprite(waw.gfx.lightRay, cc.rect(8, 8, 8, 8));

        lightRayBlack1.setScale(120);
        lightRayBlack2.setScale(120);
        lightRayBlack3.setScale(120);
        blackScreen.setScale(120);
        blackScreen.setScale(120);
        lightRayBlack1.setAnchorPoint(0.5, 1);
        lightRayBlack2.setAnchorPoint(1, 0);
        lightRayBlack3.setAnchorPoint(0, 0);
        blackScreen.setAnchorPoint(0, 0);

        var lightRayL = new cc.Sprite(waw.gfx.lightRay);
        lightRayL.setAnchorPoint(1,0);
        var lightRayR = new cc.Sprite(waw.gfx.lightRay);
        lightRayR.setAnchorPoint(0,0);
        lightRayR.flippedX = true;

        light.addChild(lightRayL);
        lightRayL.setPosition(0, 0);
        light.addChild(lightRayR);
        lightRayR.setPosition(0, 0);

        light.addChild(lightRayBlack1);
        lightRayBlack1.setPosition(0, 0);
        light.addChild(lightRayBlack2);
        lightRayBlack2.setPosition(-74, 0);
        light.addChild(lightRayBlack3);
        lightRayBlack3.setPosition(74, 0);

        this.getParent().addChild(light, 480);
        light.setPosition(this.x, this.y-48);
        light.visible = false;
        light.scaleX = 0.3;

        this.getParent().addChild(blackScreen, 490);
        blackScreen.setPosition(0, 0);

        blackScreen.opacity = 0;

        blackScreen.runAction(new cc.Sequence(
                new cc.DelayTime(1.2),
                new cc.FadeIn(1.2)
            )
        );

        this.subState = "dead";

        //cut-scene 1   - fall on the floor
        waw.whip.visible = false; //hide Whip
        this.sprite2.visible = false;
        this.sprite.opacity = 255;
        this.sprite.playAnimation("dead");
        //decide X shift due to the killer's pos
        var xs =0;
        if(killer.x > this.x+2)
            xs = -2 - Math.random()*2;
        else if(killer.x < this.x-2)
            xs = 2 + Math.random()*2;

        this.sprite.runAction(new cc.Sequence(
            new cc.jumpBy(0.35, 0, 0, 8, 1),
                new cc.Spawn(
                    new cc.Sequence(
                        new cc.DelayTime(0.25),
                        new cc.RotateBy(0, -xs*3)
                    ),
                    new cc.MoveBy(0.4, xs*2,-20)
                )
            )
        );
        this.scheduleOnce(function () {
            this.sprite.stopAllActions();   //stop body fall animation
        }, 1);

        //cut-scene 2
        this.scheduleOnce(function () {
            waw.curRoom.dark = false;
            this.getParent().lightspot.visible = false; //if dark room

            this.shadowSprite.y += backY; //the hit-back shift. move the shadow under the cross

            this.sprite.setZOrder(-10);
            //fade out fallen body
            this.sprite.runAction(new cc.Sequence(
                new cc.DelayTime(0.7),
                new cc.ScaleTo(0, 1.07,1),
                new cc.ScaleTo(0.3,1),
                new cc.DelayTime(0.5),
                new cc.FadeOut(1.5)
                )
            );

            xs = Math.random()<0.5 ? -2 : 2;
            //erect cross
            waw.player.addChild(spriteCross, -2, TAG_SPRITE_TEMP);
            spriteCross.setAnchorPoint(0.5, 0);
            spriteCross.setPosition(-1+xs*8,240);
            spriteCross.runAction(new cc.Sequence(
                    new cc.MoveTo(0.7, 0,0),
                    new cc.callFunc(function(){cc.audioEngine.playEffect(waw.sfx.ouch02);}, this),
                    new cc.SkewTo(0, xs, 0),
                    new cc.SkewTo(0.2, -xs, 0),
                    new cc.SkewTo(0.2, 0, 0)
                )
            );

            //added transp hanged
            spriteCross.addChild(spriteJh, 0, TAG_SPRITE_TEMP);
            spriteJh.setAnchorPoint(0.5, 0);
            spriteJh.opacity = 0;
            spriteJh.setPosition(25,2-12);
            spriteJh.runAction(new cc.Sequence(
                    new cc.DelayTime(2),
                    new cc.Spawn(
                        new cc.FadeIn(2),
                        new cc.MoveTo(1, 25,2)
                    )
                )
            );

        }, 2.5);

        //cut-scene 3
        this.scheduleOnce(function () {

            light.visible = true;
            light.runAction(new cc.ScaleTo(0.7, 1,1));

            blackScreen.runAction(
                new cc.Sequence(
                    new cc.FadeOut(3)
                )
            );

            spriteCross.runAction(
                new cc.Sequence(
                    new cc.DelayTime(2),
                    new cc.MoveBy(3, 0, 240)
                )
            );

            //Cherubs fly
            cherubSprite1.playAnimation("left");
            waw.player.addChild(cherubSprite1, -3, TAG_SPRITE_TEMP);
            cherubSprite1.setPosition(280,100);
            cherubSprite1.runAction(
                new cc.Sequence(
                    new cc.MoveTo(1.5, 25, 54),
                    new cc.DelayTime(0.5),
                    new cc.MoveBy(3, 0, 240)
                )
            );
            cherubSprite2.playAnimation("right");
            waw.player.addChild(cherubSprite2, -3, TAG_SPRITE_TEMP);
            cherubSprite2.setPosition(-280,100);
            cherubSprite2.runAction(
                new cc.Sequence(
                    new cc.MoveTo(1.5, -26, 54),
                    new cc.DelayTime(0.5),
                    new cc.MoveBy(3, 0, 240)
                )
            );

            this.shadowSprite.runAction(
                new cc.Sequence(
                    new cc.DelayTime(2),
                    new cc.Spawn(
                        new cc.FadeOut(3),
                        new cc.ScaleTo(3, 0.3)
                    )
                )
            );
        }, 6);

        if(killer){
            //TODO actions dont work. I make mob transparent for debug
            //console.log("You were killed by "+killer.mobType+"'s touch");
        }

        this.scheduleOnce(function () {
            var transition = cc.TransitionFade;
            cc.director.runScene(new transition(1, new waw.GameOverScene()));  //1st arg = in seconds duration of t
        }, 11);
    }
});