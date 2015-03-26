"use strict";

rooms.initNeighbours = function () {
    for (var y = 0; y < 9; y++) {
        for (var x = 0; x < 9; x++) {
            var r = rooms[y][x];
            if (r) {
                r.distance = 100;
                r.doors = 100;
                if (r.walls.up !== "wall")
                    r.up_room = rooms.getRoom(y - 1, x);
                if (r.walls.down !== "wall")
                    r.down_room = rooms.getRoom(y + 1, x);
                if (r.walls.left !== "wall")
                    r.left_room = rooms.getRoom(y, x - 1);
                if (r.walls.right !== "wall")
                    r.right_room = rooms.getRoom(y, x + 1);
            }
        }
    }
    rooms[4][4].distance = 0;
    rooms[4][4].doors = 0;

    real_rooms = []; // the start room goes 1st
/*    real_rooms.maxDistance = 0;
    real_rooms.maxDoors = 0;*/
    real_rooms.push(rooms[4][4]);
    for (y = 0; y < 9; y++) {
        for (x = 0; x < 9; x++) {
            r = rooms[y][x];
            if (r && !(x === 4 && y === 4)) {
                real_rooms.push(r);
            }
        }
    }
};

rooms.getRoom = function (y, x) {
    if (y < 0 || x < 0 || y >= 9 || x >= 9)
        return null;
    if (!rooms[y][x])
        return null;
    return rooms[y][x];
};

rooms.compareDistance = function (r, r2) {
    if (!r2)
        return;
    if (r.distance > r2.distance + 1) {
        console.log(r.name, "r > r2 ", r.distance, r2.distance, r2.name);
        r.distance = r2.distance + 1;
    } else if (r2.distance > r.distance + 1) {
        console.log(r2.name, "r2 > r ", r2.distance, r.distance, r.name);
        r2.distance = r.distance + 1;
    }
};

rooms.countDoors = function (r, r2, d) {
    if (!r2)
        return;
    switch(d) {
        case "":
        case "empty":
            if (r.doors > r2.doors)
                r.doors = r2.doors;
            else
                r2.doors = r.doors;
            break;
        case "door":
            if (r.doors > r2.doors) {
                r.doors = r2.doors + 1;
            } else if (r2.doors > r.doors + 1) {
                r2.doors = r.doors + 1;
            }
            break;
    }
};

rooms.calcDistance = function () {
    for (var pass = 1; pass <= 9; pass++) {
        console.log("Calc Distance pass " + pass);
        for (var i = 0; i < real_rooms.length; i++) {
            var r = real_rooms[i];
            rooms.compareDistance(r, r.up_room);
            rooms.compareDistance(r, r.down_room);
            rooms.compareDistance(r, r.left_room);
            rooms.compareDistance(r, r.right_room);

            rooms.countDoors(r, r.up_room, r.walls.up);
            rooms.countDoors(r, r.down_room, r.walls.down);
            rooms.countDoors(r, r.left_room, r.walls.left);
            rooms.countDoors(r, r.right_room, r.walls.right);
        }
    }
};

rooms.calcFinalStats = function () {
    real_rooms.maxDistance = 0;
    real_rooms.maxDoors = 0;

    console.log("Calc Final Stats");
    for (var i = 0; i < real_rooms.length; i++) {
        var r = real_rooms[i];
        real_rooms.maxDistance = Math.max(real_rooms.maxDistance, r.distance);
        real_rooms.maxDoors = Math.max(real_rooms.maxDoors, r.doors);
    }
};

//check room connections or so for better items placement
rooms.isDeadEnd = function (r) {
    //has 1 door
    if (!r)
        throw "No room found";
    var n = 0;
    if (r.walls.up !== "empty")
        n++;
    if (r.walls.right !== "empty")
        n++;
    if (r.walls.left !== "empty")
        n++;
    if (r.walls.down !== "empty")
        n++;
    if (n === 3)
        return true;
    return false;
};

rooms.isPassage = function (r) {
    //has 2 entrances
    if (!r)
        throw "No room found";
    var n = 0;
    if (r.walls.up !== "empty")
        n++;
    if (r.walls.right !== "empty")
        n++;
    if (r.walls.left !== "empty")
        n++;
    if (r.walls.down !== "empty")
        n++;
    if (n === 2)
        return true;
    return false;
};

rooms.isTLike = function (r) {
    //has 3 entrances
    if (!r)
        throw "No room found";
    var n = 0;
    if (r.walls.up !== "empty")
        n++;
    if (r.walls.right !== "empty")
        n++;
    if (r.walls.left !== "empty")
        n++;
    if (r.walls.down !== "empty")
        n++;
    if (n === 1)
        return true;
    return false;
};

rooms.hasNoItems = function (r) {
    //has no items
    if (!r)
        throw "No room found";
    if (r.items.length < 1)
        return true;
    return false;
};

rooms.hasNoMobs = function (r) {
    //has no monsters
    if (!r)
        throw "No room found";
    if (r.mobs.length < 1)
        return true;
    return false;
};

