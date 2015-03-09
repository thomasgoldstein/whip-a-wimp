"use strict";

//initially generate items in the room
waw.generateItems = function(roomType){
    var items = [];
    var n = Math.round(Math.random()*5);    //TODO max items in the room
    var item = null;
    var pickItemType = ["key", "coin", "gem", "map", "rope", "cloth", "invincibility", "unknown"];
    var itemCoord = waw.GetRoomSpawnCoords(roomType);
    var cr;
    if(n>itemCoord.length)
        n = itemCoord.length;
    for(var i=0; i<n; ++i){
        item = {x:160, y:110, itemType:"unknown"};
        item.itemType = pickItemType[Math.round(Math.random()*(pickItemType.length-1))]; //TODO replace temp item TYPE with real
        cr =  Math.round(Math.random()*(itemCoord.length-1));
        item.x = itemCoord[cr].x;
        item.y = itemCoord[cr].y;
        itemCoord.splice(cr,1);
        items.push(item);
    }
    return items;
};