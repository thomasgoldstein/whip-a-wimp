"use strict";

//initially generate items in the room
waw._old_generateItems = function(roomType){
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

//real_rooms - all rooms we have

waw.addItemSpawnCoordsToRooms = function(){
    for(var i = 0; i<real_rooms.length; i++){
        var room = real_rooms[i];
        room.itemCoord = waw.GetRoomSpawnCoords(room.type);
        //console.info("Item coords ", room.itemCoord.length ,"into",room.name);
    }
};

waw.addItemToRoom = function(room, itemName){
    //console.info("Put ",itemName,"into",room.name);
    if(!room)
        throw "No room";
    if(!room.itemCoord || room.itemCoord.length < 1)
        throw "Nowhere to fit item";

    var item = {x:160, y:110, itemType:itemName};
    var cr =  Math.round(Math.random()*(room.itemCoord.length-1));
    item.x = room.itemCoord[cr].x;
    item.y = room.itemCoord[cr].y;
    room.itemCoord.splice(cr,1);
    room.items.push(item);
    console.info("Put ", item.itemType, "into",room.name);
};

waw.putMap = function() {

    var rooms = real_rooms.filter(
      function(room) {
          if (room.distance >= 2 && room.distance < real_rooms.maxDistance / 2)
              return true;
          return false;
      }
    );
    var room = rooms[Math.round(Math.random()*(rooms.length-1))];
    var t="";
    for(var i=0; i<rooms.length; i++)
        t = t + " " + rooms[i].name + ":" + rooms[i].distance;
    console.info(t, "put Map into any of it. Max distance:", real_rooms.maxDistance);

    waw.addItemToRoom(room, "map");

};

waw.putKeys = function() {

};

waw.putExit = function() {

};

waw.generateItems = function(){
    var items = [];

    waw.addItemSpawnCoordsToRooms();
    waw.putExit();
    waw.putMap();
    waw.putKeys();

    return items;
};


//put items on the layer
waw.spawnItems = function(layer) {
    var items = [];
    var n, item, i;
    for (n = 0; n < waw.curRoom.items.length; n++) {
        i = waw.curRoom.items[n];
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
