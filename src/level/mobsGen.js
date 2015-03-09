"use strict";

//initially generate mobs in the room
waw.generateMobs = function(roomType){
    var mobs = [];
    var n = Math.round(Math.random()*5);    //max mobs in the room
    var mob = null;
    var pickMobType = ["PigWalker", "PigBouncer", "Merchant", "Bat", "Spikes", "Barrel"];
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