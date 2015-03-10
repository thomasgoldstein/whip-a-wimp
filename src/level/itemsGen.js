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


//put items on the layer
waw.spawnItems = function(layer) {
    var items = [];
    var n, item, i;
    for (n = 0; n < currentRoom.items.length; n++) {
        i = currentRoom.items[n];
        if (i === null) {
            items.push(null);
            continue;   //replace deleted items with null to keep the order
        }
        //TODO choose i.itemType
        item = new waw.Item(i.itemType);
        item.setPosition(i.x, i.y);
        layer.addChild(item, 250 - i.y);
        layer.addChild(item.shadowSprite, -14);
        item.shadowSprite.setPosition(i.x, i.y - 0);
        items.push(item);
    }
    waw.items = items;
    return items;
};