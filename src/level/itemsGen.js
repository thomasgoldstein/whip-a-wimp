"use strict";

//initially generate items in the room
waw._old_generateItems = function(roomType){
    var items = [];
    var n = Math.round(Math.random()*5);    //TODO max items in the room
    var item = null;
    var pickItemType = ["key", "coin", "gem", "map", "rope", "cloth", "invincibility", "unknown"];
    var itemCoord = waw.GetItemSpawnCoords(roomType);
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
        room.itemCoord = waw.GetItemSpawnCoords(room.type);
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
    if(!waw.theme.rules.has_miniMap[waw.theme.levelN])
        return;
    var rooms = real_rooms.filter(
      function(room) {
          if (room.distance >= 2 && room.distance < real_rooms.maxDistance / 2)
              return true;
          return false;
      }
    );
    if(rooms.length<1)
        rooms = real_rooms;
    var room = rooms[Math.round(Math.random()*(rooms.length-1))];
    var t="";
    for(var i=0; i<rooms.length; i++)
        t = t + " " + rooms[i].name + ":" + rooms[i].distance;
    console.info(t, "put Map into any of it. Max distance:", real_rooms.maxDistance);
    waw.addItemToRoom(room, "map");
};

waw.putRedCloth = function() {
    var room;
    if(waw.theme.rules.has_redCloth[waw.theme.levelN]) {
        room = real_rooms[Math.round(Math.random() * (real_rooms.length - 1))];
        waw.addItemToRoom(room, "cloth");
    }
    //misc items temp
    room = real_rooms[Math.round(Math.random()*(real_rooms.length-1))];
    waw.addItemToRoom(room, "coin");
    room = real_rooms[Math.round(Math.random()*(real_rooms.length-1))];
    waw.addItemToRoom(room, "gem");
};

waw.putKeys = function () {
    if (waw.theme.rules.doors_chance[waw.theme.levelN] <= 0)
        return; //no keys for doorless level

    for (var doors = 0; doors < real_rooms.maxDoors; doors++) {
        var rooms = real_rooms.filter(
            function (room) {
                if (room.doors == doors)
                    return true;
                return false;
            }
        );
        if (rooms.length < 1)
            continue;
        var room = rooms[Math.round(Math.random() * (rooms.length - 1))];
        var t = "";
        for (var i = 0; i < rooms.length; i++)
            t = t + " " + rooms[i].name + ":" + rooms[i].distance;
        console.info(t, "put Key into any of it. Current doors #:", room.doors);
        waw.addItemToRoom(room, "key");
    }
};

waw.putRopes = function() {
    for(var n = 1; n<waw.theme.rules.has_ropes[waw.theme.levelN]; n++) {
        var rooms = real_rooms.filter(
            function (room) {
                if (room.distance >= real_rooms.maxDistance / n)
                    return true;
                return false;
            }
        );
        if(rooms.length<1)
            continue;
        var room = rooms[Math.round(Math.random() * (rooms.length - 1))];
        var t = "";
        for (var i = 0; i < rooms.length; i++)
            t = t + " " + rooms[i].name + ":" + rooms[i].distance;
        console.info(t, "put Rope into any of it. Current dist:", room.distance);
        waw.addItemToRoom(room, "rope");
    }
};

waw.putExit = function() {
    var rooms = real_rooms.filter(
        function(room) {
            if (room.distance >= real_rooms.maxDistance )
                return true;
            return false;
        }
    );
    var room = rooms[Math.round(Math.random()*(rooms.length-1))];
    var t="";
    for(var i=0; i<rooms.length; i++)
        t = t + " " + rooms[i].name + ":" + rooms[i].distance;
    console.info(t, "<- EXIT DOOR:", real_rooms.maxDistance);
    //replace empty walls to exit door
    if(room.walls.up === "wall"){
        room.walls.up = "exit";
        return;
    }
    if(room.walls.left === "wall"){
        room.walls.left = "exit";
        return;
    }
    if(room.walls.right === "wall"){
        room.walls.right = "exit";
        return;
    }
    if(room.walls.down === "wall"){
        room.walls.down = "exit";
        return;
    }
};

waw.generateItems = function(){
    waw.addItemSpawnCoordsToRooms();
    waw.putExit();
    waw.putMap();
    waw.putKeys();
    waw.putRopes();
    waw.putRedCloth();
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

waw.GetItemSpawnCoords = function (roomType) {
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
            a.push({x: 50 + Math.round(Math.random() * 80), y: 50 + Math.round(Math.random() * 40)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 120 + Math.round(Math.random() * 40)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 120 + Math.round(Math.random() * 40)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 50 + Math.round(Math.random() * 40)});
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
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 44 + Math.round(Math.random() * 15), y: y});
                a.push({x: 115 + Math.round(Math.random() * 90), y: y});
                a.push({x: 256 + Math.round(Math.random() * 10), y: y});
            }
            break;
        case 7:
            //. . .horizontal line of obstacles in the room
            for (var x = 58; x < 280; x += 40) {
                a.push({x: x, y: 45 + Math.round(Math.random() * 40)});
                a.push({x: x, y: 130 + Math.round(Math.random() * 45)});
            }
            break;
    }
    return a;
};