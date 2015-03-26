"use strict";

waw.generateMobs = function(){

    for (var i = 0; i < real_rooms.length; i++) {
        var r = real_rooms[i];
        r.mobs = waw.generateMobsRoom(r.type);
    }
    waw.putBossMob();
};

//initially generate mobs in the room
waw.generateMobsRoom = function (roomType) {
    var mobs = [];
    var mob = null;
    var i;

    var mob_set = waw.theme.rules.mob_set[waw.theme.levelN];
    i = mob_set[Math.round(Math.random() * (mob_set.length - 1))];
    var pickMobType = waw.theme.rules.mob_group[i];

    var mobCoord = waw.GetMobSpawnCoords(roomType);
    var cr;
    for (i = 0; i < pickMobType.length; ++i) {
        mob = {x: 160, y: 110, mobType: "unknown"};
        mob.mobType = pickMobType[i];
        cr = Math.round(Math.random() * (mobCoord.length - 1));
        mob.x = mobCoord[cr].x;
        mob.y = mobCoord[cr].y;
        mobCoord.splice(cr, 1);
        mobs.push(mob);
    }
    return mobs;
};

waw.putBossMob = function () {
    
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
                throw "Wrong mob type "+m.mobType;
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

waw.GetMobSpawnCoords = function (roomType) {
    var a = [];
    switch (roomType) {
        case 0:
            //no obstacles
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 220), y: y});
            }
            break;
        case 1:
            //. 1 obstacle in the middle of the room
            a.push({x: 50 + Math.round(Math.random() * 80), y: 45 + Math.round(Math.random() * 30)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 90 + Math.round(Math.random() * 20)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 130 + Math.round(Math.random() * 30)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 130 + Math.round(Math.random() * 30)});
            a.push({x: 185 + Math.round(Math.random() * 80), y: 90 + Math.round(Math.random() * 20)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 45 + Math.round(Math.random() * 30)});
            break;
        case 2:
        //.. 2 obstacles horizontally
        case 3:
        //2 obstacles TL BR
        case 4:
        //2 obstacle BL TR
        case 5:
        //.:
        case 6:
        //:.
        case 8:
            //::
            for (var y = 45; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 10), y: y});
                a.push({x: 120 + Math.round(Math.random() * 50), y: y});
                a.push({x: 256 + Math.round(Math.random() * 10), y: y});
            }
            break;
        case 7:
            //. . .horizontal line of obstacles in the room
            for (var x = 58; x < 280; x += 40) {
                a.push({x: x, y: 45 + Math.round(Math.random() * 30)});
                a.push({x: x, y: 140 + Math.round(Math.random() * 30)});
            }
            break;
    }
    return a;
};