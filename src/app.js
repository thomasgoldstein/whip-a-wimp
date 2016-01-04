"use strict";

waw.oldLayer = null;
waw.currentScene = null;
waw.scrollActionDone = true; //isDone scrolling between rooms
//waw.menu = null;
waw.scoreMenu = null;

//console.log = console.info = function(){};

var keyboardListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function (key, event) {
        console.log(key);
        /*            if(key >= cc.KEY.dpadLeft && key <= cc.KEY.dpadCenter)
         key -= (cc.KEY.dpadLeft - cc.KEY.left);*/
        //if(key >= 71 && key <= 74)
        //    key = cc.KEY.space;
        waw.KEYS[key] = true;
        switch (key) {   //clean opposite arrows pressed status
            case cc.KEY.up:
                waw.KEYS[cc.KEY.down] = false;
                break;
            case cc.KEY.down:
                waw.KEYS[cc.KEY.up] = false;
                break;
            case cc.KEY.left:
                waw.KEYS[cc.KEY.right] = false;
                break;
            case cc.KEY.right:
                waw.KEYS[cc.KEY.left] = false;
                break;
        }
    },
    onKeyReleased: function (key, event) {
        //if(key >= 71 && key <= 74)
        //    key = cc.KEY.space;
        waw.KEYS[key] = false;
    }
});

if (cc.sys.capabilities.hasOwnProperty('keyboard'))
    cc.eventManager.addListener(keyboardListener, 1);

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        cc.audioEngine.setMusicVolume(0.2);
        cc.audioEngine.playMusic(waw.bgm.level1, true);
        waw.KEYS[cc.KEY.left] =
        waw.KEYS[cc.KEY.right] =
        waw.KEYS[cc.KEY.down] =
        waw.KEYS[cc.KEY.up] =
        waw.KEYS[cc.KEY.space] = false;

        rooms.initLevel();
        rooms.genLevel();
        rooms.initNeighbours();
        rooms.calcDistance();
        rooms.calcFinalStats();
        rooms.addSecretRoom();
        waw.generateItems();
        waw.generateMobs();

        waw.player = new waw.Player();
        waw.player.setPosition(startPlayerPos);
        waw.whip = new waw.Whip();
        waw.player.addChild(waw.whip, 10);

        //TODO add menu
        var layer = new waw.MainLayer();
        layer.init();
        this.addChild(layer);
    }
});

//this layer exists on every Room
waw.MainLayer = cc.Layer.extend({
    mobs: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)

    lightspot: null,
    lightspot1: null,
    lightspot2: null,
    lightspot3: null,
    lightspot4: null,
    lightspotPos: null,

    init: function () {
        this._super();
        //console.info("init layer", waw.curRoomX, waw.curRoomY);
        waw.layer = this;
        waw.units = []; //clear obstacles
        this.units = waw.units;

        //Initially draw room BG walls onto layer
        waw.curRoom = rooms[waw.curRoomY][waw.curRoomX];
        if (waw.curRoom) {
            waw.initWalls(waw.curRoom); //init array units with non-destructable walls (8 pieces)
            waw.prepareRoomLayer(waw.curRoom);
        } else
            throw "this room coords are out of the grid";
        waw.curRoom.visited = true;
        waw.curRoom.secret = false;

        if(rooms.foundMap)
            waw.AddMiniMap(this, waw.curRoom);

        this.lightspot = new cc.Sprite(waw.gfx.lightSpot, new cc.rect(0,0,1,1));
        this.lightspot.setAnchorPoint(0.5, 0.5);
        this.lightspot.setPosition(160, 120);
        //right down spot
        this.lightspot1 = new cc.Sprite(waw.gfx.lightSpot);
        this.lightspot1.setAnchorPoint(0, 1);
        this.lightspot1.setRotation(0);
        this.lightspot.addChild(this.lightspot1);
        this.lightspot1.setPosition(0, 0);
        //left down
        this.lightspot2 = new cc.Sprite(waw.gfx.lightSpot);
        this.lightspot2.setAnchorPoint(0, 1);
        this.lightspot2.setRotation(90);
        this.lightspot.addChild(this.lightspot2);
        this.lightspot2.setPosition(0, 0);
        //left up
        this.lightspot3 = new cc.Sprite(waw.gfx.lightSpot);
        this.lightspot3.setAnchorPoint(0, 1);
        this.lightspot3.setRotation(180);
        this.lightspot.addChild(this.lightspot3);
        this.lightspot3.setPosition(0, 0);
        //right up
        this.lightspot4 = new cc.Sprite(waw.gfx.lightSpot);
        this.lightspot4.setAnchorPoint(0, 1);
        this.lightspot4.setRotation(270);
        this.lightspot.addChild(this.lightspot4);
        this.lightspot4.setPosition(0, 0);

        this.lightspot.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.9), //0.9
                new cc.ScaleTo(0.5, 1)    //1
            )
        ));

        this.addChild(this.lightspot, 299);

        this.lightspot1.visible =
        this.lightspot2.visible =
        this.lightspot3.visible =
        this.lightspot4.visible = waw.curRoom.dark;

        this.scheduleUpdate();

        waw.scoreMenu = new waw.Score();
        //TODO Remove Debug menu
        waw.MenuDebug(this);
    },
    onEnter: function () {
        this._super();
        //console.info("onEnter ROOM",waw.curRoomX,waw.curRoomY);

        waw.player.update();   //to update players sprite facing direction

        //attach players shadow to layer OVER BG floor (its Z index = -15)
        this.addChild(waw.player.shadowSprite,-14);
        this.addChild(waw.player,250-waw.player.y);

        waw.whip.init();

        //waw.score = new waw.Score();
        this.addChild(waw.scoreMenu, 300);
        waw.scoreMenu.setPosition(24,224);

        //put items on the layer
        this.items = waw.spawnItems(this);

        //put mobs on the layer
        this.mobs = waw.spawnMobs(this);

        waw.player.becomeInvincible();
        //fix de-sync
        //var animKey = waw.player.getState() + "_" + waw.player.direction;
        //waw.player.sprite.playAnimation(animKey);
        //waw.player.sprite2.playAnimation(animKey);
        waw.player.scheduleUpdate();
    },
    onEnterTransitionDidFinish: function () {
        this._super();
//      console.info("onEnterTransitionDidFinish ROOM:",waw.curRoomX,waw.curRoomY);
    },
    onExitTransitionDidStart: function () {
        this._super();
        //console.info("onExitTransitionDidStart ROOM",waw.curRoomX,waw.curRoomY);
        this.removeChild(waw.player.shadowSprite);
        waw.cleanSpawnMobs(this);
        this.cleanup();
    },
    onGotoNextRoom: function (key, playerPos) {
        //set player coords for the next room
        this.removeChild(waw.player, true);
        waw.player.setPosition(playerPos);
        waw.player.unscheduleUpdate();
        this.unscheduleUpdate();
        waw.player.removeTempSprites();
        waw.scoreMenu.unscheduleUpdate();

        var room = null;
        switch (key) {
            case cc.KEY.up:
                room = rooms[waw.curRoomY - 1][waw.curRoomX];
                if (room) {
                    waw.curRoomY -= 1;
                    this.lightspot3.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[waw.curRoomY + 1][waw.curRoomX];
                if (room) {
                    waw.curRoomY += 1;
                    this.lightspot1.visible = false;
                    this.lightspot2.visible = false;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[waw.curRoomY][waw.curRoomX - 1];
                if (room) {
                    waw.curRoomX -= 1;
                    this.lightspot2.visible = false;
                    this.lightspot3.visible = false;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[waw.curRoomY][waw.curRoomX + 1];
                if (room) {
                    waw.curRoomX += 1;
                    this.lightspot1.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
        }
        waw.curRoom = room; //TODO remove later?

        this.scrollToNextRoom(key, 0.5);  //1st arg = in seconds duration of the transition
    },
    scrollToNextRoom: function (direction) {
        waw.oldLayer = this;
        waw.oldLayer.unscheduleUpdate();
        waw.oldLayer.stopAllActions();
        waw.oldLayer.onExitTransitionDidStart();

        var nextLayer = new waw.MainLayer();
        nextLayer.init();
        //sync player + cloth
        //var animKey = "idle_" + waw.player.direction;
        //waw.player.sprite.playAnimation(animKey);
        //waw.player.sprite2.playAnimation(animKey);
        //animKey = waw.player.getState() + "_" + waw.player.direction;
        //waw.player.sprite.playAnimation(animKey);
        //waw.player.sprite2.playAnimation(animKey);

        switch (direction) {
            case cc.KEY.up:
                nextLayer.setPosition(0,240);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 0,-240));
                break;
            case cc.KEY.down:
                nextLayer.setPosition(0,-240);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 0,240));
                break;
            case cc.KEY.left:
                nextLayer.setPosition(-320,0);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 320,0));
                break;
            case cc.KEY.right:
                nextLayer.setPosition(320,0);
                waw.oldLayer.runAction(new cc.MoveTo(0.5, -320,0));
                break;
            default:
                nextLayer.setPosition(60,60);   //debug
                waw.oldLayer.runAction(new cc.MoveTo(0.5, 200,200));
        }
        waw.scrollActionDone = false;
        waw.currentScene.addChild(nextLayer);
        nextLayer.runAction(new cc.MoveTo(0.5, 0,0));
        this.scheduleOnce(
            function(){
                waw.oldLayer.removeAllChildrenWithCleanup();
                waw.scrollActionDone = true;
            }, 0.9);
    },
    update: function (dt) {
        if(waw.curRoom.dark) {
            if(!this.lightspot1.visible){
                this.lightspot1.visible =
                this.lightspot2.visible =
                this.lightspot3.visible =
                this.lightspot4.visible = true;
            }
            //flickering
            if(this.lightspot1.opacity < 255) {
                this.lightspot1.opacity =
                this.lightspot2.opacity =
                this.lightspot3.opacity =
                this.lightspot4.opacity = this.lightspot1.opacity + 1;
            } else if(Math.random()<0.01){
                this.lightspot1.opacity =
                this.lightspot2.opacity =
                this.lightspot3.opacity =
                this.lightspot4.opacity = 200 + 5 * Math.round(Math.random()*10);
            }
            var pos = waw.player.getPosition();
            if(this.lightspotPos == null)
                this.lightspotPos = pos;
            pos.y += 24;
            switch(waw.player.direction){
                case "down":
                    pos.y -= 16;
                    break;
                case "up":
                    pos.y += 16;
                    break;
                case "left":
                    pos.x -= 16;
                    break;
                case "right":
                    pos.x += 16;
                    break;
            }

            if(this.lightspotPos.x < pos.x)
                this.lightspotPos.x = this.lightspotPos.x + (pos.x-this.lightspotPos.x)/20;
            else if(this.lightspotPos.x > pos.x)
                this.lightspotPos.x = this.lightspotPos.x - (this.lightspotPos.x-pos.x)/20;
            if(this.lightspotPos.y < pos.y)
                this.lightspotPos.y = this.lightspotPos.y + (pos.y-this.lightspotPos.y)/20;
            else if(this.lightspotPos.y > pos.y)
                this.lightspotPos.y = this.lightspotPos.y - (this.lightspotPos.y-pos.y)/20;

            this.lightspot.setPosition(this.lightspotPos);
        } else {
            if(this.lightspot1.visible){
                this.lightspot1.visible =
                    this.lightspot2.visible =
                        this.lightspot3.visible =
                            this.lightspot4.visible = false;
            }
        }

        //activate trap room
        if(waw.curRoom.trap && !waw.curRoom.trapActive){
            if(waw.player.x > 50 && waw.player.y > 50
                && waw.player.x < 265 && waw.player.y < 170) {
                waw.activateTrapRoom();
            }
        }

        //update all monsters in the room
        //if(Math.random()<0.5)  //TODO add call 15-30 FPS
        waw.updateSpawnedMobs(this);

        //go to another room?
        var playerPos = waw.player.getPosition();
        if(waw.scrollActionDone) {
            if (playerPos.x < 8/*16*/) {
                playerPos.x = 320-8;
                this.onGotoNextRoom(cc.KEY.left, playerPos);
            } else if (playerPos.y < 4) {
                playerPos.y = 240 - 12; //upper wall is 16pix taller
                this.onGotoNextRoom(cc.KEY.down, playerPos);
            } else if (playerPos.x > 320-8 ) {
                playerPos.x = 8;
                this.onGotoNextRoom(cc.KEY.right, playerPos);
            } else if (playerPos.y > 240 - 12) {  //upper wall is 16pix taller
                playerPos.y = 4;
                this.onGotoNextRoom(cc.KEY.up, playerPos);
            }
        } else {
            if (playerPos.x < 8) {
                waw.player.x = 8;
            } else if (playerPos.y < 4) {
                waw.player.y = 4 ; //upper wall is 16pix taller
            } else if (playerPos.x > 320-8 ) {
                waw.player.x = 320-8;
            } else if (playerPos.y > 240 - 12) {  //upper wall is 16pix taller
                waw.player.y = 240-12;
            }

        }
    }
});