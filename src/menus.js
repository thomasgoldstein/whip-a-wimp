"use strict";
waw.Score = cc.Node.extend({
        shadowSprite: null,
        label: null,

        items: {sun:null, moon:null},

        ctor: function () {
            this._super();
            this.setAnchorPoint(0, 0.5);
            var s = waw.SpriteRect(16, 16);
            this.items = {
                keys: {
                    sprite: new cc.Sprite(waw.gfx.items, s(0, 0)),
                    oldValue: 0,
                    usage: function () {
                        console.log(this.name + " is used automatically")
                    },
                    update: function () {
                    }
                    //show:function(){ this.items.keys.sprite.visible = true; },
                    //hide:function(){ this.items.keys.sprite.visible = false;}
                },
                sun: {
                    sprite: new cc.Sprite(waw.gfx.items, s(0, 1)),
                    oldValue: 0,
                    usage: function () {
                        console.log(this.name + " is used automatically")
                    },
                    update: function () {
                    }
                    //show:function(){ this.items.sun.sprite.visible = true; },
                    //hide:function(){ this.items.sun.sprite.visible = false;}
                },
                moon: {
                    sprite: new cc.Sprite(waw.gfx.items, s(1, 1)),
                    oldValue: 0,
                    usage: function () {
                        console.log(this.name + " is used automatically")
                    },
                    update: function () {
                    }
                    //show:function(){ this.items.moon.sprite.visible = true; },
                    //hide:function(){ this.items.moon.sprite.visible = false;}
                },
                sunmoon: {
                    sprite: new cc.Sprite(waw.gfx.items, s(2, 1)),
                    oldValue: 0
                }
            };

            this.addChild(this.items.keys.sprite);
            this.items.keys.sprite.setPosition(0 * 16, 0);
            if (waw.keys > 1) {
                var keySpr = new cc.Sprite(waw.gfx.items, s(0, 0));
                this.items.keys.sprite.removeAllChildren();
                this.items.keys.sprite.addChild(keySpr, -1);
                keySpr.setAnchorPoint(0, 0);
                keySpr.setPosition(2, 2);
                keySpr.opacity = 200;
                waw.makeSpriteJump(keySpr);
            }
            if (waw.keys > 2) {
                var keySpr = new cc.Sprite(waw.gfx.items, s(0, 0));
                this.items.keys.sprite.addChild(keySpr, -2);
                keySpr.setAnchorPoint(0, 0);
                keySpr.setPosition(4, 4);
                keySpr.opacity = 127;
                waw.makeSpriteJump(keySpr);
            }
            if (waw.keys <= 0)
                this.items.keys.sprite.visible = false;
            this.items.keys.oldValue = waw.keys;

            this.addChild(this.items.sun.sprite, 3);
            this.items.sun.sprite.setPosition(1 * 16, 0);
            if (waw.sun <= 0)
                this.items.sun.sprite.visible = false;
            this.items.sun.oldValue = waw.sun;

            this.addChild(this.items.moon.sprite, 2);
            this.items.moon.sprite.setPosition(1 * 16, 1);
            if (waw.moon <= 0)
                this.items.moon.sprite.visible = false;
            this.items.moon.oldValue = waw.moon;

            if (waw.sun > 0 && waw.moon > 0) {
                this.items.sun.sprite.runAction(
                    new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.MoveBy(0, 0, -1),
                            new cc.DelayTime(0.4),
                            new cc.MoveBy(0, 0, 1),
                            new cc.DelayTime(0.4)
                        )
                    )
                );
                this.items.moon.sprite.runAction(
                    new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.MoveBy(0, 0, 1),
                            new cc.DelayTime(0.4),
                            new cc.MoveBy(0, 0, -1),
                            new cc.DelayTime(0.4)
                        )
                    )
                );
            } else {
                this.addChild(this.items.sunmoon.sprite, 1);
                this.items.sunmoon.sprite.setPosition(1 * 16, 0);
                this.items.sunmoon.sprite.opacity = 200;
            }
            this.scheduleUpdate();
        },
        update: function () {
            if (waw.keys !== this.items.keys.oldValue) {
                var s = waw.SpriteRect(16, 16);
                switch (waw.keys) {
                    case 0:
                        //this.items.keys.sprite.removeAllChildren();
                        this.items.keys.sprite.visible = false;
                        break;
                    case 1:
                        if (this.items.keys.oldValue === 0) {
                            this.items.keys.sprite.visible = true;
                        } else {
                            this.items.keys.sprite.removeAllChildren();
                        }
                        break;
                    case 2:
                        var keySpr = new cc.Sprite(waw.gfx.items, s(0, 0));
                        if (this.items.keys.oldValue === 1) {
                            this.items.keys.sprite.addChild(keySpr, -1);
                            keySpr.setAnchorPoint(0, 0);
                            keySpr.setPosition(2, 2);
                            keySpr.opacity = 200;
                            waw.makeSpriteJump(keySpr);
                        } else {
                            this.items.keys.sprite.removeAllChildren();
                            this.items.keys.sprite.addChild(keySpr, -1);
                            keySpr.setAnchorPoint(0, 0);
                            keySpr.setPosition(2, 2);
                            keySpr.opacity = 200;
                            waw.makeSpriteJump(keySpr);
                        }
                        break;
                    case 3:
                        var keySpr = new cc.Sprite(waw.gfx.items, s(0, 0));
                        if (this.items.keys.oldValue === 2) {
                            this.items.keys.sprite.addChild(keySpr, -2);
                            keySpr.setAnchorPoint(0, 0);
                            keySpr.setPosition(4, 4);
                            keySpr.opacity = 127;
                            waw.makeSpriteJump(keySpr);
                        } else
                            this.items.keys.sprite.visible = true;  //TODO its a hack for items+ to show any keys
                        break;
                }
                this.items.keys.oldValue = waw.keys;
            }
            if (waw.sun !== this.items.sun.oldValue) {
                this.items.sun.sprite.visible = (waw.sun > 0);
                this.items.sun.oldValue = waw.sun;
            }
            if (waw.moon !== this.items.moon.oldValue) {
                this.items.moon.sprite.visible = (waw.moon > 0);
                this.items.moon.oldValue = waw.moon;
            }

        }
    }
);

waw.MenuDebug = function (layer) {
    var menu, labelDebug;
    labelDebug = new cc.LabelTTF("Kiwi", "System", 12);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
        function () {
//        debugger;
            switch (Math.round(Math.random() * 0)) {
                //switch(0){
                case 0:
                default:
                    var e = new waw.MobKiwi();
                    break;
                case 3:
                    var e = new waw.MobPigBouncer();
                    break;
                case 1:
                    var e = new waw.MobPig();
                    break;
                case 2:
                    var e = new waw.MobMerchant();
                    break;
            }
            var m = {x: 100, y: 110};
            var pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            e.setScale(0.1);
            e.runAction(new cc.ScaleTo(0.5, 1));
            //e.runAction(new cc.Blink(1, 4)); //Blink Foe sprite
            this.addChild(e, 6);
            e.setZOrder(250 - pos.y);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            this.addChild(e.shadowSprite, -14);
            //position shadow
            e.shadowSprite.setPosition(pos.x, pos.y - 0);
            waw.mobs.push(e);

        }, layer);
    //debugOnOffItem.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16 + 2, 208);

    labelDebug = new cc.LabelTTF("HitBox", "System", 10);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
        function () {
            showDebugInfo = !showDebugInfo;
            waw.player.label.visible = showDebugInfo;
            waw.player.debugCross.visible = showDebugInfo;
            for (var i in waw.mobs) {
                if (!waw.mobs[i])
                    continue;
                waw.mobs[i].label.visible = showDebugInfo;
                waw.mobs[i].debugCross.visible = showDebugInfo;
            }
            for (var i in waw.units) {
                if (!waw.units[i])
                    continue;
                waw.units[i].debugCross.visible = showDebugInfo;
            }
            /*for (var i in waw.items) {
                if (!waw.items[i])
                    continue;
                //waw.items[i].debugCross.visible = showDebugInfo;
                waw.items[i].label.visible = showDebugInfo;
            }*/
        }, layer);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16, 239 - 7 - 38);

//---
    labelDebug = new cc.LabelTTF("Music", "System", 10);
    var debugMusicOnOff = new cc.MenuItemLabel(labelDebug,
        function () {
            if (cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.pauseMusic();
                //cc.audioEngine.stopAllEffects();
            } else {
                cc.audioEngine.resumeMusic();
            }
        }, layer
    );
    menu = new cc.Menu(debugMusicOnOff);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugMusicOnOff.setPosition(16, 239 - 7 - 48);


    labelDebug = new cc.LabelTTF("Items+", "System", 10);
    var debugDoors = new cc.MenuItemLabel(labelDebug,
        function () {
            waw.keys += 3;
            waw.sun += 3;
            waw.moon += 3;
            waw.player.HP = 2;
            waw.player.sprite2.visible = true;
            if (rooms.foundMap === false) {
                waw.AddMiniMap(waw.layer, waw.curRoom, true);
                rooms.foundMap = true;
            }
            waw.whip.addLink();
            waw.whip.addLink();
            waw.whip.addLink();
        }, layer);
    menu = new cc.Menu(debugDoors);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugDoors.setPosition(16, 160);

    labelDebug = new cc.LabelTTF("Weapon+", "System", 10);
    var debugMenu10 = new cc.MenuItemLabel(labelDebug,
        function () {
            switch (waw.player.currentWeapon) {
                case "":
                case "punch":
                    waw.player.currentWeapon = "whip";
                    break;
                case "whip":
                    waw.player.currentWeapon = "candelabre";
                    break;
                case "candelabre":
                    waw.player.currentWeapon = "punch";
                    break;
            }
        }, layer);
    menu = new cc.Menu(debugMenu10);
    menu.setPosition(10, 0);
    layer.addChild(menu, 300);
    debugMenu10.setPosition(16, 150);

    labelDebug = new cc.LabelTTF("Dark", "System", 10);
    var debugMenu11 = new cc.MenuItemLabel(labelDebug,
        function () {
            waw.curRoom.dark = !waw.curRoom.dark;
        }, layer);
    menu = new cc.Menu(debugMenu11);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugMenu11.setPosition(16, 140);

    labelDebug = new cc.LabelTTF("Chest", "System", 12);
    var debugSpawnChest = new cc.MenuItemLabel(labelDebug,
            function () {
                var itemType = Math.random() < 0.5 ? "boots" : Math.random() < 0.5 ? "moon" : "key";
                var locked = Math.random() < 0.5 ? true : false;
                var item = {
                    x: waw.player.x,
                    y: waw.player.y,
                    itemType: itemType, inChest: true, locked: locked
                };
                waw.curRoom.items.push(item);   //TODO isnt it extra stuff?
                waw.items[waw.curRoom.items.length-1] = item;

                var e = new waw.NoMobChest(item.locked, item.itemType, waw.curRoom.items.length - 1);
                var pos = waw.player.getPosition();
                e.setPosition(pos);
                e.setScale(0.1);
                e.runAction(new cc.ScaleTo(0.5, 1));
                this.addChild(e, 6);
                this.addChild(e.shadowSprite, -14);
                e.setZOrder(250 - pos.y);
                e.shadowSprite.setPosition(pos.x, pos.y + e.shadowYoffset);
                e.debugCross.setTextureRect(cc.rect(0,0, e.width, e.height)); //for correct debug grid size
                e.setTag(TAG_CHEST);
                this.scheduleOnce(function () {
                    waw.units.push(e);   //to make it obstacle&
                }, 1);

            }, layer
        );

    menu = new cc.Menu(debugSpawnChest);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugSpawnChest.setPosition(16, 126);

    labelDebug = new cc.LabelTTF("LVL+", "System", 12);
    var debugGetKey = new cc.MenuItemLabel(labelDebug,
        function () {
            //var transition = cc.TransitionZoomFlipAngular;
            var transition = cc.TransitionFade;
            cc.director.runScene(new transition(1, new waw.gotoNextLevel()));
        }, layer);

    menu = new cc.Menu(debugGetKey);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugGetKey.setPosition(16, 116);

    labelDebug = new cc.LabelTTF("K.O.", "System", 12);
    var debugInstaKill = new cc.MenuItemLabel(labelDebug,
        function () {
            waw.player.onDeath(waw.player);
        }, layer);

    menu = new cc.Menu(debugInstaKill);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugInstaKill.setPosition(16, 102);

    labelDebug = new cc.LabelTTF("Trap", "System", 12);
    var debugTrap = new cc.MenuItemLabel(labelDebug,
        function () {
            if(!waw.curRoom.trapActive)
                waw.curRoom.trap = true;
        }, layer);

    menu = new cc.Menu(debugTrap);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugTrap.setPosition(16, 90);
};