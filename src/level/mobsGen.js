"use strict";

waw.generateMobs = function(){
    for (var i = 1; i < real_rooms.length; i++) {
        //start from i = 1, because 0 - start room w/o mobs
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
    i = waw.pickRandomArray(mob_set);
    var pickMobType = waw.theme.rules.mob_group[i];

    var mobCoord = waw.GetCoords2SpawnMob(roomType);
    var cr;
    for (i = 0; i < pickMobType.length; ++i) {
        if(false)
            mob = {x: 160, y: 110, mobType: "unknown", itemsDrop: ["invincibility"], itemsDropChance: 1};
        else
            mob = {x: 160, y: 110, mobType: "unknown"};
        mob.mobType = pickMobType[i];
        cr = Math.round(Math.random() * (mobCoord.length - 1));
        mob.x = mobCoord[cr].x;
        mob.y = mobCoord[cr].y;
        mobCoord.splice(cr, 1);
        mobs.push(mob);

        if(mobCoord.length<1) //add exta mob spawn coords
            mobCoord = waw.GetCoords2SpawnMob(0);
    }
    return mobs;
};

waw.putBossMob = function () {
    var room;
    var filtered_rooms = real_rooms.filter(
        function (r) {
            if (rooms.hasExit(r))
                return true;
            return false;
        }
    );
    if (filtered_rooms.length < 1) {
        filtered_rooms = real_rooms;
        console.log("No room for Boss");
    }
    for (var i = 0; i < filtered_rooms.length; i++) {
        room = filtered_rooms[i];
        if (room) {
            break;
        }
    }
    room.type = 0;  //boss room has no obstacles
    var mobs = [];
    //waw.theme.rules.mob_set[waw.theme.levelN];
    var mob = {x: 160, y: 110, mobType: "Boss", itemsDrop: ["moon"], itemsDropChance: 1};
    mobs.push(mob);
    room.mobs = mobs;
};

waw.fixOverlappingPos = function(x,y, m) {
    //check and fix spawn coords if they overlap other units
    var curRect = cc.rect(x - m.width/2, y, m.width, m.height);
    var flag = true;
    while (flag) {
        flag = false;
        for (var unit in waw.units) {
            if(!waw.units[unit])
                continue;
            if(cc.rectIntersectsRect(curRect, waw.units[unit].collideRect())){
                curRect.x = 40+Math.round(Math.random()*225);
                curRect.y = 40+Math.round(Math.random()*150);
                flag = true;
                break;
            }
        }
    }
    return cc.p(curRect.x + m.width/2, curRect.y);
};

waw.spawnMobs = function(layer){
//put enemy on the layer
    var foes = [];
    var pos, e, m, n;
    if(waw.curRoom.mobs.length < 1) {
        waw.curRoom.trap = false;   //no mobs? no trap room
    } else {
        for (n = 0; n < waw.curRoom.mobs.length; n++) {
            m = waw.curRoom.mobs[n];
            if (!m) {
                foes.push(null);
                continue;
            }
            switch (m.mobType) {
                case "Pig":
                    e = new waw.MobPig();
                    break;
                case "PigBouncer":  //TODO remove
                    e = new waw.MobPigBouncer();
                    break;
                case "Merchant":
                    e = new waw.MobMerchant();
                    break;
                case "DoveSeller":
                    e = new waw.MobDoveSeller();
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
                case "Boss":
                    e = new waw.BossDoveSeller();
                    break;
                default:
                    throw "Wrong mob type " + m.mobType;
            }
            pos = waw.fixOverlappingPos(m.x, m.y, e);   //TODO make it run only once
            e.setPosition(pos);
            if(m.itemsDrop){
                e.itemsDrop = m.itemsDrop;
                e.itemsDropChance = m.itemsDropChance;
            }
            m.mob = e; //to get some params of the mob later, when u exit the room
            e.setZOrder(250 - pos.y);
            layer.addChild(e, 250 - pos.y);
            //attach monsters shadow to layer OVER BG floor (its Z index = -15)
            layer.addChild(e.shadowSprite, -14);
            e.shadowSprite.setPosition(pos.x, pos.y - 0);
            e.debugCross.setTextureRect(cc.rect(0, 0, e.width, e.height)); //for correct debug grid size
            foes.push(e);
            waw.units[200 + n] = e;   //to make it obstacle
            e.becomeInvincible();
        }
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

waw.updateSpawnedMobs = function(layer) {
    for(var i=0; i<layer.mobs.length; ++i){
        if(layer.mobs[i]) {
            layer.mobs[i].update();
        }
    }
};

waw.allEnemyKilled = function () {
    for (var n = 0; n < waw.mobs.length; n++) {
        if (waw.mobs[n]) {
            if(waw.mobs[n].killable) {
                return false;
            }
        }
    }
    return true;
};

waw.GetCoords2SpawnMob = function (roomType) {
    var a = [];
    switch (roomType) {
        case 0:
            //no obstacles
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 220), y: y});
            }
            break;
        case 1:
        case 11:
            //. 1 obstacle in the middle of the room
            a.push({x: 50 + Math.round(Math.random() * 80), y: 45 + Math.round(Math.random() * 30)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 90 + Math.round(Math.random() * 20)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 130 + Math.round(Math.random() * 30)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 130 + Math.round(Math.random() * 30)});
            a.push({x: 185 + Math.round(Math.random() * 80), y: 90 + Math.round(Math.random() * 20)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 45 + Math.round(Math.random() * 30)});
            break;
        case 2:
        case 12:
        //.. 2 obstacles horizontally
        case 3:
        case 13:
        //2 obstacles TL BR
        case 4:
        case 14:
        //2 obstacle BL TR
        case 5:
        case 15:
        //.:
        case 6:
        case 16:
        //:.
        case 8:
        case 9:
        case 10:
        case 18:
            //::
            for (var y = 45; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 10), y: y});
                a.push({x: 120 + Math.round(Math.random() * 50), y: y});
                a.push({x: 256 + Math.round(Math.random() * 10), y: y});
            }
            break;
        case 7:
        case 17:
            //. . .horizontal line of obstacles in the room
            for (var x = 58; x < 280; x += 40) {
                a.push({x: x, y: 45 + Math.round(Math.random() * 30)});
                a.push({x: x, y: 140 + Math.round(Math.random() * 30)});
            }
            break;
    }
    return a;
};