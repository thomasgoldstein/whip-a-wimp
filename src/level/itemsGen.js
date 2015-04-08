"use strict";

//real_rooms - all rooms we have

waw.addItemSpawnCoordsToRooms = function(){
    for(var i = 0; i<real_rooms.length; i++){
        var room = real_rooms[i];
        room.itemCoord = waw.GetCoords2SpawnItem(room.type);
        //console.info("Item coords ", room.itemCoord.length ,"into",room.name);
    }
};

waw.addItemToRoom = function(room, itemName){
    //console.info("Put ",itemName,"into",room.name);
    if(!room)
        throw "No room";
    if(!room.itemCoord || room.itemCoord.length < 1)
        throw "Nowhere to fit item";

    var item = {x:160, y:110, itemType:itemName, inChest:false, locked:false};
    var cr =  Math.round(Math.random()*(room.itemCoord.length-1));
    item.x = room.itemCoord[cr].x;
    item.y = room.itemCoord[cr].y;
    room.itemCoord.splice(cr,1);
    room.items.push(item);
    console.info("Put ", item.itemType, "into",room.name);
};

waw.putMap = function () {
    if (Math.random() < waw.theme.rules.has_miniMap[waw.theme.levelN]) {
        var filtered_rooms = real_rooms.filter(
            function (room) {
                if (room.distance >= 2 && room.distance < real_rooms.maxDistance / 2)
                    return true;
                return false;
            }
        );
        if (filtered_rooms.length < 1)
            filtered_rooms = real_rooms;
        var room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
        waw.addItemToRoom(room, "map");
    }
};

waw.putRedCloth = function () {
    var filtered_rooms, room;
    if (Math.random() < waw.theme.rules.has_redCloth[waw.theme.levelN]) {

        filtered_rooms = real_rooms.filter(
            function (r) {
                if (rooms.isDeadEnd(r) && rooms.isPassage(r))
                    return true;
                return false;
            }
        );
        if (filtered_rooms.length > 0)
            room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
        else
            room = real_rooms[Math.round(Math.random() * (real_rooms.length - 1))];
        waw.addItemToRoom(room, "cloth");
    }
    //misc items temp
    filtered_rooms = real_rooms.filter(
        function (r) {
            if (rooms.isDeadEnd(r) && rooms.hasNoItems(r))
                return true;
            return false;
        }
    );
    if (filtered_rooms.length > 0)
        room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
    else
        room = real_rooms[Math.round(Math.random() * (real_rooms.length - 1))];
    waw.addItemToRoom(room, "coin");

    filtered_rooms = real_rooms.filter(
        function (r) {
            if (rooms.isPassage(r) && rooms.hasNoItems(r))
                return true;
            return false;
        }
    );
    if (filtered_rooms.length > 0)
        room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
    else
        room = real_rooms[Math.round(Math.random() * (real_rooms.length - 1))];
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

waw.putRopes = function () {
    if (Math.random() < waw.theme.rules.has_ropes[waw.theme.levelN]) {
        var filtered_rooms = real_rooms.filter(
            function (room) {
                if (room.distance >= real_rooms.maxDistance / 3 && rooms.isDeadEnd(room))
                    return true;
                return false;
            }
        );
        if (filtered_rooms.length < 1)
            filtered_rooms = real_rooms.filter(
                function (room) {
                    if (room.distance >= real_rooms.maxDistance / 2)
                        return true;
                    return false;
                }
            );
        if (filtered_rooms.length < 1)
            filtered_rooms = real_rooms;
        var room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
        console.info("Put Rope to ", room.name, " Dist:", room.distance);
        waw.addItemToRoom(room, "rope");
    }
};

waw.putBoots = function () {
    if (Math.random() < waw.theme.rules.has_boots[waw.theme.levelN]) {
        var filtered_rooms = real_rooms.filter(
            function (room) {
                if (room.distance >= real_rooms.maxDistance / 3 && rooms.hasNoItems(room) && (rooms.isPassage(room) || rooms.isTLike(room)))
                    return true;
                return false;
            }
        );
        if (filtered_rooms.length < 1)
            filtered_rooms = real_rooms.filter(
                function (room) {
                    if (room.distance >= real_rooms.maxDistance / 2 && rooms.hasNoItems(room))
                        return true;
                    return false;
                }
            );
        if (filtered_rooms.length < 1)
            filtered_rooms = real_rooms;
        var room = filtered_rooms[Math.round(Math.random() * (filtered_rooms.length - 1))];
        console.info("Put Boots to ", room.name, " Dist:", room.distance);
        waw.addItemToRoom(room, "boots");
    }
};

waw.putUselessItems = function () {
    var filtered_rooms = real_rooms.filter(
        function (r) {
            if (!rooms.isEntrance(r) && !rooms.hasExit(r))
                return true;
            return false;
        }
    );
    if (filtered_rooms.length < 1)
        filtered_rooms = real_rooms;
    for (var i = 0; i < filtered_rooms.length; i++) {
        var room = filtered_rooms[i];
        if (room && rooms.hasNoItems(room)) {
            waw.addItemToRoom(room, "unknown");
        }
    }
};

waw.putExit = function() {
    var filtered_rooms = real_rooms.filter(
        function(room) {
            if (room.distance >= real_rooms.maxDistance )
                return true;
            return false;
        }
    );
    var room = filtered_rooms[Math.round(Math.random()*(filtered_rooms.length-1))];
    var t="";
    for(var i=0; i<filtered_rooms.length; i++)
        t = t + " " + filtered_rooms[i].name + ":" + filtered_rooms[i].distance;
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

waw.putItemsIntoChests = function() {
    var fRooms = real_rooms.filter(
        function(room) {
            if (room.distance >= real_rooms.maxDistance/2 )
                return true;
            return false;
        }
    );
    for(var i=0; i<fRooms.length; i++) {
        var r = fRooms[i];
        for(var n=0; n < r.items.length; n++) {
            if(r.items[n].itemType === "unknown")
                continue;
            if(Math.random()<0.5) {
                r.items[n].inChest = true;
                console.info("Item wrapped in the chest", r.name);
            }
        }
    }
    //TODO add locks to some chests
};

waw.generateItems = function(){
    waw.addItemSpawnCoordsToRooms();
    waw.putExit();
    waw.putMap();
    waw.putKeys();
    waw.putRopes();
    waw.putRedCloth();
    waw.putBoots();
    waw.putUselessItems();
    waw.putItemsIntoChests();
};

//put rooms items on the layer
waw.spawnItems = function(layer) {
    var items = [];
    var n, i;
    for (n = 0; n < waw.curRoom.items.length; n++) {
        if (i = waw.curRoom.items[n]) {
            if(i.inChest)
                items.push(waw.spawnItemInChest(i.locked, i.itemType, i.x, i.y, n, layer));
            else
                items.push(waw.spawnItem(i.itemType, i.x, i.y, n, layer));
        }
        else
            items.push(null);
    }
    waw.items = items;
    return items;
};

waw.spawnItem = function (itemType, x, y, n, layer) {
    if(itemType === null) {
        console.log("null item?");
        return null;
    }
    var item = new waw.Item(itemType, n);
    item.setPosition(x, y);
    layer.addChild(item, 250 - y);
    layer.addChild(item.shadowSprite, -14);
    item.shadowSprite.setPosition(x, y - 0);
    return item;
};

waw.spawnItemInChest = function (locked, itemType, x, y, n, layer) {
    if(itemType === null)
        return;
    var item = {
        x: x,
        y: y,
        itemType: itemType, inChest: true, locked: locked
    };
    var e = new waw.NoMobChest(item.locked, item.itemType, n);
    e.setPosition(x, y);
    layer.addChild(e, 250 - y);
    layer.addChild(e.shadowSprite, -14);
    e.shadowSprite.setPosition(x, y - 0);
    e.setTag(TAG_CHEST);
    e.debugCross.setTextureRect(cc.rect(0,0, e.width, e.height)); //for correct debug grid size
    waw.units.push(e);   //to make it obstacle&
    return item;
};

waw.GetCoords2SpawnItem = function (roomType) {
    var a = [];
    switch (roomType) {
        case 0:
            //no obstacles
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 90), y: y});
                a.push({x: 160 + Math.round(Math.random() * 110), y: y});
            }
            break;
        case 1:
            //. 1 obstacle in the middle of the room
            a.push({x: 50 + Math.round(Math.random() * 80), y: 50 + Math.round(Math.random() * 40)});
            a.push({x: 50 + Math.round(Math.random() * 80), y: 120 + Math.round(Math.random() * 40)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 120 + Math.round(Math.random() * 40)});
            a.push({x: 185 + Math.round(Math.random() * 86), y: 50 + Math.round(Math.random() * 40)});
            a.push({x: 134, y: 91});
            a.push({x: 170, y: 91});
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