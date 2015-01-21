waw.MenuDebug = function (layer) {
    var menu, labelDebug;
    labelDebug = new cc.LabelTTF("Spawn", "System", 12);
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
                    var e = new waw.MobPigWalker();
                    break;
                case 2:
                    var e = new waw.MobMerchant();
                    break;
            }
            var m = {x: 100, y: 110};
            var pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            e.setZOrder(250 - pos.y);
            e.setScale(0.1);
            e.runAction(new cc.ScaleTo(0.5, 1));
            //e.runAction(new cc.Blink(1, 4)); //Blink Foe sprite
            this.addChild(e, 6);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            this.addChild(e.shadowSprite, -14);
            //position shadow
            e.shadowSprite.setPosition(pos.x, pos.y - 0);
            waw.foes.push(e);

        }, layer);
    //debugOnOffItem.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16, 239 - 28);

    labelDebug = new cc.LabelTTF("HitBox", "System", 10);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
        function () {
            showDebugInfo = !showDebugInfo;
            waw.player.label.setVisible(showDebugInfo);
            waw.player.debugCross.setVisible(showDebugInfo);
            for (var i in waw.foes) {
                if (!waw.foes[i])
                    continue;
                waw.foes[i].label.setVisible(showDebugInfo);
                waw.foes[i].debugCross.setVisible(showDebugInfo);
            }
            for (var i in waw.units) {
                if (!waw.units[i])
                    continue;
                waw.units[i].debugCross.setVisible(showDebugInfo);
            }
            for (var i in waw.items) {
                if (!waw.items[i])
                    continue;
                waw.items[i].debugCross.setVisible(showDebugInfo);
                waw.items[i].label.setVisible(showDebugInfo);
            }
        }, layer);
    //debugOnOffItem.setAnchorPoint(0.5, 0.5);
    menu = new cc.Menu(debugOnOffItem);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugOnOffItem.setPosition(16, 239 - 7 - 38);

//---
    labelDebug = new cc.LabelTTF("Music Off", "System", 10);
    var debugMusicOnOff = new cc.MenuItemLabel(labelDebug,
        function () {
//            if(audioEngine.isMusicPlaying){
//                audioEngine.pauseMusic();
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
//            } else {
//                audioEngine.resumeMusic();
//                audioEngine.playMusic(bgm_Level1, true);
//            }
        }, layer
    );
    menu = new cc.Menu(debugMusicOnOff);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugMusicOnOff.setPosition(16, 239 - 7 - 48);

    labelDebug = new cc.LabelTTF("Doors N", "System", 10);
    var debugDoors = new cc.MenuItemLabel(labelDebug,
        function () {
            waw.openDoor(TAG_DOWN_DOORD, layer);
            waw.openDoor(TAG_UP_DOORD, layer);
            waw.openDoor(TAG_LEFT_DOORD, layer);
            waw.openDoor(TAG_RIGHT_DOORD, layer);
        }, layer);
    menu = new cc.Menu(debugDoors);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugDoors.setPosition(16, 160);


    labelDebug = new cc.LabelTTF("Ch.Weapon", "System", 10);
    var debugMenu10 = new cc.MenuItemLabel(labelDebug,
        function () {
            switch(waw.player.currentWeapon){
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
            currentRoom.dark = !currentRoom.dark;
        }, layer);
    menu = new cc.Menu(debugMenu11);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugMenu11.setPosition(16, 140);
};