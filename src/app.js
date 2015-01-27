"use strict";

if (cc.sys.capabilities.hasOwnProperty('keyboard'))
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function (key, event) {
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
            waw.KEYS[key] = false;
        }
    }, 1);

//the Start method
waw.MainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        rooms.initLevel();
        rooms.genLevel();

        waw.player = new waw.Player();
        waw.player.setPosition(startPlayerPos);
        waw.whip = new waw.Whip();

        //TODO add menu
        var layer = new waw.MainLayer();
        layer.init();
        this.addChild(layer);
    }
});

//this layer exists on every Room
waw.MainLayer = cc.Layer.extend({
    foes: [], //current room enemy
    units: [], //curr room obstacles (collision boxes)
    topLabel: null, //Hi Score, Keys,etc
    topLabelString: "Hi-SCORE: "+waw.hiScore, //Hi Score, Keys,etc

    lightspot1: null,
    lightspot2: null,
    lightspot3: null,
    lightspot4: null,
    lightspotPos: null,

    init: function () {
        this._super();
        //console.info("init layer", currentRoomX, currentRoomY);
        waw.layer = this;
        waw.units = []; //clear obstacles
        this.units = waw.units;

        //Initially draw room BG, walls, foes onto layer
        currentRoom = rooms[currentRoomY][currentRoomX];
        if (currentRoom) {
            waw.initWalls(currentRoom); //init array units with non-destructable walls (8 pieces)
            waw.prepareRoomLayer(currentRoom);
        } else
            throw "this room coords are out of the grid";

        var room = rooms[currentRoomY][currentRoomX];
        room.visited = true;
        var miniMap = waw.GenerateMiniMap();
        this.addChild(miniMap, 400);
        if(room.walls.up_d > 0) //if the upper door is shifted to right, then put mini-map to left
            miniMap.setPosition(34,240-48);
        else
            miniMap.setPosition(320-33-40,240-48);  //mm to the right

        //HI-SCORE, keys
        this.topLabel = new cc.LabelTTF(this.topLabelString, "System", 10);
        this.topLabel.setAnchorPoint(0,1);
        this.addChild(this.topLabel , 299+5); //, TAG_LABEL_SPRITE1);
        this.topLabel .setPosition(16, 240-1);

        this.lightspot1 = new cc.Sprite(s_LightSpot);
        this.lightspot1.setAnchorPoint(0, 1);
        this.lightspot1.setRotation(0);
        this.lightspot1.setPosition(160, 120);
        this.lightspot2 = new cc.Sprite(s_LightSpot);
        this.lightspot2.setAnchorPoint(0, 1);
        this.lightspot2.setRotation(90);
        this.lightspot2.setPosition(160, 120);
        this.lightspot3 = new cc.Sprite(s_LightSpot);
        this.lightspot3.setAnchorPoint(0, 1);
        this.lightspot3.setRotation(180);
        this.lightspot3.setPosition(160, 120);
        this.lightspot4 = new cc.Sprite(s_LightSpot);
        this.lightspot4.setAnchorPoint(0, 1);
        this.lightspot4.setRotation(270);
        this.lightspot4.setPosition(160, 120);

        this.lightspot1.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.90),
                new cc.ScaleTo(0.5, 1)
            )
        ));
        this.lightspot2.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.90),
                new cc.ScaleTo(0.5, 1)
            )
        ));
        this.lightspot3.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.90),
                new cc.ScaleTo(0.5, 1)
            )
        ));
        this.lightspot4.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5, 0.90),
                new cc.ScaleTo(0.5, 1)
            )
        ));

        this.addChild(this.lightspot1, 290);
        this.addChild(this.lightspot2, 290);
        this.addChild(this.lightspot3, 290);
        this.addChild(this.lightspot4, 290);
        if (currentRoom.dark) {
            this.lightspot1.visible =
                this.lightspot2.visible =
                    this.lightspot3.visible =
                        this.lightspot4.visible = true;
        } else {
            this.lightspot1.visible =
                this.lightspot2.visible =
                    this.lightspot3.visible =
                        this.lightspot4.visible = false;
        }

        this.scheduleUpdate();
        //TODO Remove Debug menu
        waw.MenuDebug(this);
    },
    onEnter: function () {
        var i, m, e, pos;
        this._super();
        console.info("onEnter ROOM",currentRoomX,currentRoomY);

        waw.player.update();   //to update players sprite facing direction

        //attach players shadow to layer OVER BG floor (its Z index = -15)
        this.addChild(waw.player.shadowSprite,-14);
        this.addChild(waw.player,250-waw.player.y);

        waw.player.addChild(waw.whip,10);
        waw.whip.init();

        //put items on the layer
        this.items = [];
        for(var n=0; n<currentRoom.items.length; n++) {
            i = currentRoom.items[n];
            if (i === null) {
                this.items.push(null);
                continue;   //replace deleted items with null to keep the order
            }
            //TODO choose i.itemType
            var item = new waw.Item(i.itemType);
            item.setPosition(i.x, i.y);
            this.addChild(item,250-i.y);
            this.addChild(item.shadowSprite,-14);
            item.shadowSprite.setPosition(i.x, i.y-0);
            this.items.push(item);
        }
        waw.items = this.items;

        //put enemy on the layer
        this.foes = [];
        //TODO Plug. Temp put enemy on the screen
        for(var n=0; n<currentRoom.mobs.length; n++){
            m = currentRoom.mobs[n];
            if(!m) {
                this.foes.push(null);
                continue;
            }
            //TODO choose m.mobType
            switch(m.mobType){
                case "PigWalker":
                    e = new waw.MobPigWalker();
                    break;
                case "PigBouncer":
                    e = new waw.MobPigBouncer();
                    break;
                case "Merchant":
                    e = new waw.MobMerchant();
                    break;
                default:
                    throw "Wrong mob type";
            }
            pos = cc.p(e.toSafeXCoord(m.x), e.toSafeYCoord(m.y));
            e.setPosition(pos);
            m.mob = e; //to get some params of the mob later, when u exit the room
            e.setZOrder(250 - pos.y);
            e.setScale(0.1);
            e.runAction(new cc.ScaleTo(0.5, 1));
            //e.runAction(cc.Blink.create(1, 4)); //Blink Foe sprite
            this.addChild(e, 250 - pos.y);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            this.addChild(e.shadowSprite,-14);
            //position shadow
            e.shadowSprite.setPosition(pos.x, pos.y-0);
            this.foes.push(e);

            e.becomeInvincible();
        }
        waw.foes = this.foes;

        //TODO - wrap with func add FOES as units for collision
        for(var n=0; n<waw.foes.length; n++){
            m = waw.foes[n];
            if(m)
                m.getTag = function(){ return TAG_ENEMY};
            waw.units[200+n] = m;
        }
        waw.player.becomeInvincible();
    },
    onEnterTransitionDidFinish: function () {
        this._super();
//      console.info("onEnterTransitionDidFinish ROOM:",currentRoomX,currentRoomY);
        waw.player.scheduleUpdate();
    },
    onExitTransitionDidStart: function () {
        var m,pos;
        this._super();
        //console.info("onExitTransitionDidStart ROOM",currentRoomX,currentRoomY);

        this.removeChild(waw.player.shadowSprite);

        for(var i=0; i<currentRoom.mobs.length; i++) {
            m = currentRoom.mobs[i];
            if(!m)
                continue;
            if(!m.mob)      //TODO why it might be NULL ? cant find the prob
                continue;
            pos = m.mob.getPosition();
            m.x = pos.x;
            m.y = pos.y;
            m.mob = null;
        }

        for(var i=0; i<waw.foes.length; i++) {
            waw.foes[i] = null;
        }
        this.foes = [];
        waw.foes = [];
        this.units = [];
        this.cleanup();
    },
    onGotoNextRoom: function (e, playerPos) {
        //set player coords for the next room
        this.removeChild(waw.player, true);
        waw.player.setPosition(playerPos);
        waw.player.unscheduleUpdate();
        this.unscheduleUpdate();

        var room = null;
        var transition = cc.TransitionProgressRadialCW;   //transition for teleporting (never used)
        switch (e) {
            case cc.KEY.up:
                room = rooms[currentRoomY - 1][currentRoomX];
                if (room) {
                    currentRoomY -= 1;
                    transition = cc.TransitionSlideInT; //effect - scrolls one scene out
                    this.lightspot3.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
            case cc.KEY.down:
                room = rooms[currentRoomY + 1][currentRoomX];
                if (room) {
                    currentRoomY += 1;
                    transition = cc.TransitionSlideInB;
                    this.lightspot1.visible = false;
                    this.lightspot2.visible = false;
                } else
                    return;
                break;
            case cc.KEY.left:
                room = rooms[currentRoomY][currentRoomX - 1];
                if (room) {
                    currentRoomX -= 1;
                    transition = cc.TransitionSlideInL;
                    this.lightspot2.visible = false;
                    this.lightspot3.visible = false;
                } else
                    return;
                break;
            case cc.KEY.right:
                room = rooms[currentRoomY][currentRoomX + 1];
                if (room) {
                    currentRoomX += 1;
                    transition = cc.TransitionSlideInR;
                    this.lightspot1.visible = false;
                    this.lightspot4.visible = false;
                } else
                    return;
                break;
        }

        currentRoom = room; //TODO remove later?
        //create new scene to put a layer of the next room into it. To use DIRECTOR to use transitions between scenes
        var nextScene = new cc.Scene();
        var nextLayer = new waw.MainLayer();
        nextLayer.init();
        nextScene.addChild(nextLayer);

        cc.director.runScene(new transition(0.5, nextScene));  //1st arg = in seconds duration of the transition
        //cc.director.runScene(nextScene);    //Instant transition between rooms
    },
    update: function (dt) {
        //score-keys TODO: do not update every frame
        var s = "HI-SCORE:"+waw.hiScore+" SCORE:"+waw.score+" Keys:"+waw.keys+" Coins:"+waw.coins+" Gems:"+waw.gems;
        if (s != this.topLabelString)
            this.topLabel.setString(this.topLabelString = s);

        //
        if(currentRoom.dark) {
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

            this.lightspot1.setPosition(this.lightspotPos);
            this.lightspot2.setPosition(this.lightspotPos);
            this.lightspot3.setPosition(this.lightspotPos);
            this.lightspot4.setPosition(this.lightspotPos);
        } else {
            if(this.lightspot1.visible){
                this.lightspot1.visible =
                    this.lightspot2.visible =
                        this.lightspot3.visible =
                            this.lightspot4.visible = false;
            }
        }

        //monsters
        for(var i=0; i<this.foes.length; ++i){
            if(this.foes[i]) {
                this.foes[i].update();
            }
        }
        //go to another room?
        var playerPos = waw.player.getPosition();

        if (playerPos.x < 16) {
            playerPos.x = 320 - 32;
            this.onGotoNextRoom(cc.KEY.left, playerPos);
        } else if (playerPos.y < 16) {
            playerPos.y = 240 - 32 - 16; //upper wall is 16pix taller
            this.onGotoNextRoom(cc.KEY.down, playerPos);
        } else if (playerPos.x > 320 - 16) {
            playerPos.x = 32;
            this.onGotoNextRoom(cc.KEY.right, playerPos);
        } else if (playerPos.y > 240 - 32) {  //upper wall is 16pix taller
            playerPos.y = 32;
            this.onGotoNextRoom(cc.KEY.up, playerPos);
        }
    }
});