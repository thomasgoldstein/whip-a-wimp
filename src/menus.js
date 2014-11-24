waw.MenuDebug = function (layer) {
    var menu, labelDebug;
    labelDebug = new cc.LabelTTF("Spawn", "System", 12);
    var debugOnOffItem = new cc.MenuItemLabel(labelDebug,
        function () {
//        debugger;
            switch (Math.round(Math.random() * 2)) {
                //switch(0){
                case 0:
                default:
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
                waw.foes[i].label.setVisible(showDebugInfo);
                waw.foes[i].debugCross.setVisible(showDebugInfo);
            }
            for (var i in waw.units) {
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


    var a = [];
    a.push({rotation: -15, rotation2: 6, step: 1});
    a.push({rotation: -20, rotation2: 5, step: 1});
    a.push({rotation: -35, rotation2: 4, step: 1});
    a.push({rotation: -50, rotation2: 6, step: 2});
    a.push({rotation: -75, rotation2: 6, step: 3});
    labelDebug = new cc.LabelTTF("Whip", "System", 10);
    var debugWhip = new cc.MenuItemLabel(labelDebug,
        function () {
            //waw.whip.init();
            //if(Math.random()<0.5)
                //waw.whip.setAllTo(-150, 150, 1);
            //else
            //    waw.whip.setAllTo(150, 180, 1);
                waw.whip.setTo(a);
                waw.whip.rotation = -190;
        }, layer);
    menu = new cc.Menu(debugWhip);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugWhip.setPosition(16, 150);

    var a2 = [];
    a2.push({rotation: 2, rotation2: 6, step: 1});
    a2.push({rotation: 3, rotation2: 5, step: 1});
    a2.push({rotation: 7, rotation2: 4, step: 1});
    a2.push({rotation: 10, rotation2: 6, step: 1});
    a2.push({rotation: 15, rotation2: 6, step: 1});
    labelDebug = new cc.LabelTTF("Whip2", "System", 10);
    var debugWhip2 = new cc.MenuItemLabel(labelDebug,
        function () {
            waw.whip.setTo(a2);
            waw.whip.rotation = -90;
        }, layer);
    menu = new cc.Menu(debugWhip2);
    menu.setPosition(0, 0);
    layer.addChild(menu, 300);
    debugWhip2.setPosition(16, 140);
};