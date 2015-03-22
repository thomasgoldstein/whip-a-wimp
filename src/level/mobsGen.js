"use strict";

//initially generate mobs in the room
waw.generateMobs = function(roomType){
    var mobs = [];
    var n = Math.round(Math.random()*5);    //max mobs in the room
    var mob = null;
    var pickMobType = ["PigWalker", "PigBouncer", "Merchant", "Bat", "Spikes"];
    var mobCoord = waw.GetRoomSpawnCoords(roomType);
    var cr;
    if(n>mobCoord.length)
        n = mobCoord.length;
    for(var i=0; i<n; ++i){
        mob = {x:160, y:110, mobType:"unknown"};
        mob.mobType = pickMobType[Math.round(Math.random()*(pickMobType.length-1))]; //TODO replace temp mob TYPE according to the room type etc
        cr =  Math.round(Math.random()*(mobCoord.length-1));
        mob.x = mobCoord[cr].x;
        mob.y = mobCoord[cr].y;
        mobCoord.splice(cr,1);
        mobs.push(mob);
    }
    return mobs;
};

waw.spawnMobs = function(layer){
//put enemy on the layer
    var foes = [];
    var pos, e, m, n;
    //TODO Plug. Temp put enemy on the screen
    for(n=0; n<waw.curRoom.mobs.length; n++){
        m = waw.curRoom.mobs[n];
        if(!m) {
            foes.push(null);
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
            case "Spikes":
                e = new waw.MobSpikes();
                break;
            case "Bat":
                e = new waw.MobBat();
                break;
            case "Barrel":
                e = new waw.MobBarrel();
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
        layer.addChild(e, 250 - pos.y);
        //attach monsters shadow to layer OVER BG floor (its Z index = -15)
        layer.addChild(e.shadowSprite,-14);
        //position shadow
        e.shadowSprite.setPosition(pos.x, pos.y-0);
        foes.push(e);

        waw.units[200+n] = e;   //to make it obstacle

        e.becomeInvincible();
    }
    waw.mobs = foes;
    return foes;
};

waw.cleanSpawnMobs = function(layer) {
    var i, m, pos;
    for(i=0; i<waw.curRoom.mobs.length; i++) {
        m = waw.curRoom.mobs[i];
        if(!m)
            continue;
        if(!m.mob)      //TODO why it might be NULL ? cant find the prob
            continue;
        pos = m.mob.getPosition();
        m.x = pos.x;
        m.y = pos.y;
        m.mob = null;
    }
    for(i=0; i<waw.mobs.length; i++) {
        waw.mobs[i] = null;
    }
    layer.mobs = [];
    waw.mobs = [];
    layer.units = [];
};

waw.updateSpawnMobs = function(layer) {
    for(var i=0; i<layer.mobs.length; ++i){
        if(layer.mobs[i]) {
            layer.mobs[i].update();
        }
    }
};