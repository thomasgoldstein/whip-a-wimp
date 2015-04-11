"use strict";
//Level Generator

//constructor - Walls in a Room
function Walls() {
	this.up = "wall";   //wall type
	this.right = "wall";
	this.down = "wall";
	this.left = "wall";
    this.up_d = 0;      //the passage/door DELTA offset in pixels +-100px
    this.right_d = 0;
    this.down_d = 0;
    this.left_d = 0;
}

//a Room generator
function Room(_name,_x,_y) {
	this.name = _name || "nameless Room";
	this.x = _x;
	this.y = _y;
	this.walls = new Walls();
    this.visited = false;
    this.secret = false;
    this.showSecret = false;
    this.dark = false;
    this.trap = false;
    this.type = 0; //0 = clean room type
    this.mobs = [];
    this.items = [];

    //rooms around
    this.up_room = null;    //near rooms, even trough doors
    this.right_room = null;
    this.down_room = null;
    this.left_room = null;

    this.distance = 100;    //rooms to the level entrance
    this.doors = 100;   //# closed doors to the level entrance
// Random Seed to generate the same lists of decorative elements
    this.randomSeedTextures = Math.round(Math.random()*100000);
    this.randomSeedObstacles = Math.round(Math.random()*100000);

    if(Math.random()<0.05){  //random subtle room color
        this.floorR = Math.round(Math.random()*25 +230);
        this.floorG = Math.round(Math.random()*25 +230);
        this.floorB = Math.round(Math.random()*25 +230);
    } else {
        this.floorR = 255;
        this.floorG = 255;
        this.floorB = 255;
    }
}

rooms.initLevel = function() {
    waw.curRoom = null;
    waw.curRoomX = waw.curRoomY = 4; //The start room is 4,4 by default
	//init level 9x9
	for(var y = 0; y < 9 ; y++) {
		rooms[y] = {};
		for(var x = 0; x < 9 ; x++) {
			rooms[y][x] = null;
		}
	}
    rooms.foundMap = false; //player found no map yet
    if(waw.keys > 3)
        waw.keys = 0;
    waw.coins = 0;
    waw.gems = 0;
};

rooms.genLevel = function() {
	//1st Room is at 4,4 pas always
	var x = 4;
	var y = 4;
	var oldx = x;
	var oldy = y;
	var noCycle = 0;
    var temp = "empty";
    var maxDy = 36; //+- max vertical shift of left + right doors
    var maxDx = 90; //+- max horizontal shift of up + down doors
    var max_rooms_N = waw.theme.rules.max_rooms[waw.theme.levelN];   //15;
	do {
		noCycle++;
		if(!rooms[y][x]) {
            var d = 0; //delta offset of the door/passage position
			var r = new Room("Room "+x+"-"+y,x,y);
			if(x == 4 && y == 4){ //for TEST mark start Room x4,y4
				r.walls.bottom = "start";
                r.type = 0; //clean room. no obstacles in it
			} else {
                if(Math.random() <= waw.theme.rules.dark_chance[waw.theme.levelN] * (r.secret ? 4 : 1))
                    r.dark = true;
                if(Math.random() <= waw.theme.rules.trap_chance[waw.theme.levelN])
                    r.trap = true;
            }

            //random type of the room obstacles pattern
            if(Math.random() <= 0.5) {
                var a = waw.theme.rules.room_set[waw.theme.levelN];
                r.type = a[Math.round(Math.random()*(a.length-1))];
            } else
                r.type = 0;

			//make connection between previous and current rooms
			if(oldx < x){
                if(Math.random()<waw.theme.rules.doors_chance[waw.theme.levelN])   //20% chance for a closed door
                    temp = "door";
                else
                    temp = "empty";     //80% - passage
                r.walls.left = rooms[oldy][oldx].walls.right = temp;
                //TODO in the final ver, make the cance of the shifted door at 30% 1-> 0.3 . Now it is for debugging
                if(Math.random()<0.3)     //30% - chance of the shifted passage
                    r.walls.left_d = rooms[oldy][oldx].walls.right_d = Math.round(maxDy - Math.random()*(maxDy*2)); // -maxDy .. maxDy
            }
			if(oldx > x){
                if(Math.random()<<waw.theme.rules.doors_chance[waw.theme.levelN])
                    temp = "door";
                else
                    temp = "empty";
                r.walls.right = rooms[oldy][oldx].walls.left = temp;
                if(Math.random()<0.3)
                    r.walls.right_d = rooms[oldy][oldx].walls.left_d = Math.round(maxDy - Math.random()*(maxDy*2)); // // -maxDy .. maxDy
			}
			if(oldy < y){
                if(Math.random()<<waw.theme.rules.doors_chance[waw.theme.levelN])
                    temp = "door";
                else
                    temp = "empty";
                r.walls.up = rooms[oldy][oldx].walls.down = temp;
                if(Math.random()<0.3)
                    r.walls.up_d = rooms[oldy][oldx].walls.down_d = Math.round(maxDx - Math.random()*(maxDx*2)); // -maxDx .. maxDx
			}
			if(oldy > y){
                if(Math.random()<<waw.theme.rules.doors_chance[waw.theme.levelN])
                    temp = "door";
                else
                    temp = "empty";
                r.walls.down = rooms[oldy][oldx].walls.up = temp;
                if(Math.random()<0.3)
                    r.walls.down_d = rooms[oldy][oldx].walls.up_d = Math.round(maxDx- Math.random()*(maxDx*2)); // -maxDx .. maxDx
			}
			rooms[y][x] = r;
		} else {
			//cannot put a Room here
			noCycle--;
		}

        oldx = x;
        oldy = y;
        // % CHANCE //randomly move to the next room in the generated maze
        if (Math.random() * 100 < 50) {
            //X
            if (Math.random() * 100 < 50)
                x++;
            else
                x--;
        } else {
            //Y
            if (Math.random() * 100 < 50)
                y--;
            else
                y++;
        }
        //check for bounds
        if (x >= 8) {
            x = 8;
        }
        if (x < 0) {
            x = 0;
        }
        if (y >= 8) {
            y = 8;
        }
        if (y < 0) {
            y = 0;
        }
		//check for max number of rooms to generate
	} while(noCycle < max_rooms_N);
    //start room[4,4] should has no obstacles!
    rooms[4][4].type = 0;
};

//Generate Mini Map Layer
waw.GenerateMiniMap = function () {
    var m = null;
    var r, w, x, y;
    var mapXOffset = 15, mapYOffset = 5;
    var layerMapSprite = new cc.Sprite(waw.gfx.map,
        cc.rect(0, 6, 64, 56));
    layerMapSprite.opacity = 200;
    //cc.LayerColor(cc.color(0,0,0,24), 45, 45);   //dark BG

    //calc filled rooms to center mini-map
    var minX = 4, minY = 4, maxX = 4, maxY = 4;
    for (y = 0; y < 9; y++) {
        for (x = 0; x < 9; x++) {
            r = rooms[y][x];
            if (r) {	//is it a Room
                if (x < minX)
                    minX = x;
                if (y < minY)
                    minY = y;
                if (x > maxX)
                    maxX = x;
                if (y > maxY)
                    maxY = y;
            }
        }
    }
    var realW = maxX - minX + 1;
    var realH = maxY - minY + 1;
    realW = (45 - realW * 5)/2 - minX*5;
    realH = (45 - realH * 5)/2 - minY*5;
    mapXOffset += realW;
    mapYOffset -= realH;

    for (y = 0; y < 9; y++) {
        for (x = 0; x < 9; x++) {
            w = 0; //walls-doors counter
            r = rooms[y][x];
            if (r && (!r.secret || r.showSecret)) {	//is it a Room & not secret
                //4 passages
                if (r.walls.up !== "empty")
                    w |= 1;
                if (r.walls.right !== "empty")
                    w |= 2;
                if (r.walls.down !== "empty")
                    w |= 4;
                if (r.walls.left !== "empty")
                    w |= 8;
                //the room
                m = new cc.Sprite(waw.gfx.map,
                    cc.rect(w * 6, 0, 5, 5));
                m.setOpacity(r.visited ? 255 : 63);
                if(r.secret){
                    m.runAction(new cc.Blink(20, 20));
                }
                layerMapSprite.addChild(m);
                m.setPositionX(x * 5 + 3 + mapXOffset);
                m.setPositionY((8 - y) * 5 + 2 + mapYOffset);
                if (waw.curRoomX === x && waw.curRoomY === y) {
                    m.setScale(2);
                    m.runAction(new cc.ScaleTo(2, 1));
                    m.runAction(new cc.Blink(1, 2)); //Blink sprite
                    m = new cc.Sprite(waw.gfx.map, cc.rect(90, 6, 5, 5)); //red dot - players pos
                    layerMapSprite.addChild(m);
                    m.setPositionX(x * 5 + 3 + mapXOffset);
                    m.setPositionY((8 - y) * 5 + 2 + mapYOffset);
                    m.setOpacity(127);
                }
            }
        }
    }
    return layerMapSprite;
};

waw.AddMiniMap = function (layer, room, animateTheMapOpening) {
    var miniMap = waw.GenerateMiniMap();
    layer.addChild(miniMap, 400);
    var x = 320 - 42;  //if the upper door is shifted to right, then put mini-map to left
    var y = 240 - 32;
    if(animateTheMapOpening){
        miniMap.setPosition(waw.player.x, waw.player.y);
        miniMap.setScale(0.2, 0.2);
        miniMap.runAction(new cc.RotateBy(1.2, 360));
        miniMap.runAction(new cc.ScaleTo(1.2, 1));
        miniMap.runAction(new cc.MoveTo(1, x, y));
    } else {
        miniMap.setPosition(x, y);
    }
};

//init 8 pieces of impassable walls
waw.initWalls = function(room) {
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;
    var wall;

    var wp = {
        wallSize: 32, //thickness of the border walls
        wallSize2: 48, //thickness of the TOP walls
        verticalWall_upY: 240/2+64/2,
        verticalWall_downY: -240/2 + 64/2,
        horizontalWall_leftX: -240/2 + 64/2,
        horizontalWall_rightX: -240/2 + 64/2
    };

    // Left wall upper
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.width = wp.wallSize;
    wall.height = 240-64;
    wall.x = wp.wallSize / 2;
    wall.y = wp.verticalWall_upY + room.walls.left_d;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Left wall lower
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.width = wp.wallSize;
    wall.height = 240-64;
    wall.x = wp.wallSize / 2;
    wall.y = wp.verticalWall_downY + room.walls.left_d;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Right wall upper
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(wp.wallSize, 240-64));
    wall.x = 320-wp.wallSize / 2;
    wall.y = wp.verticalWall_upY + room.walls.right_d;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Right wall lower
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(wp.wallSize, 240-64));
    wall.x = 320-wp.wallSize / 2;
    wall.y = wp.verticalWall_downY + room.walls.right_d;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Top wall. left half
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320 - 64, wp.wallSize2));   //fat top wall
    wall.x = 0+room.walls.up_d;
    wall.y = 240 - 24 - wp.wallSize2/2 + 4;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Top wall. right
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320 - 64, wp.wallSize2));
    wall.x = 320 + room.walls.up_d;
    wall.y = 240 - 24 - wp.wallSize2/2 +4;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);

    // Bottom wall left
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320 - 64, wp.wallSize));
    wall.x = 0 + room.walls.down_d;
    wall.y = 0;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
    // Bottom wall right
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320 - 64, wp.wallSize));
    wall.x = 320 + room.walls.down_d;
    wall.y = 0;
    units.push(wall);
    //debug - shows hit box over the wall
    waw.AddHitBoxSprite(wall, layer);
};

//preparesand adds elements of a room onto existing layer
waw.prepareRoomLayer = function(room) {
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;
    var wall, d, g;

    //add room Background
    var floor = new cc.Sprite(waw.gfx.floor);
    var middleWalls = new cc.Sprite(waw.gfx.middleWalls);
    var upperWalls = new cc.Sprite(waw.gfx.upperWalls);
    layer.ignoreAnchor = true;
    floor.ignoreAnchor = true;
    middleWalls.ignoreAnchor = true;
    upperWalls.ignoreAnchor = true;
    layer.addChild(floor, -21); //Z index the lowest one
    layer.addChild(middleWalls, -20);
    layer.addChild(upperWalls, 280); //255

    //floor.setColor(new cc.Color(155,233,233,255));    //like blue water
    floor.setColor(new cc.Color(room.floorR,room.floorG,room.floorB,255));
    middleWalls.setColor(new cc.Color(room.floorR,room.floorG,room.floorB,255));
    upperWalls.setColor(new cc.Color(room.floorR,room.floorG,room.floorB,255));

    var s = waw.SpriteRect(16,16); //for lock sprite
    //add doors and gates
    d = null; g = null;
    switch (room.walls.up) {    //FAT upper wall
        case "exit":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(0, 80, 80, 80)); //closed door
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d, -18, TAG_EXIT);
            d.setPosition(160 + room.walls.up_d, 240 - 88);
            d.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.TintTo(1, 0, 255, 0),
                    new cc.TintTo(1, 255, 255, 255)
                )
            ));
            //add rotating locks
            var l = new cc.Sprite(waw.gfx.items, s(1, 0));
            l.addChild(new cc.Sprite(waw.gfx.items, s(2, 0)));
            l.setAnchorPoint(0, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40, 55);
            l.scale = 0.5;
            l.runAction(new cc.RepeatForever(
                    new cc.RotateBy(1, -45)
            ));
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(0, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = 40;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            //we set here obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(80, 80));
            wall.setAnchorPoint(0.5, 0);
            wall.setPosition(160 + room.walls.up_d, 240 - 48 + 4);
            wall.setTag(TAG_EXIT);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_EXIT);
            break;
        case "door":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(0,80,80,80)); //closed door
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18, TAG_UP_DOOR);
            d.setPosition(160+room.walls.up_d,240-88);
            //add lock
            var l = new cc.Sprite(waw.gfx.items, s(8, 0)); //lock
            l.setAnchorPoint(0.5, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40, 55);
            waw.makeSpriteJump(l);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(0, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = 40;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            //we set here obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(80, 80));
            wall.setAnchorPoint(0.5, 0);
            wall.setPosition(160+room.walls.up_d,240 - 48 + 4);
            wall.setTag(TAG_UP_DOORD);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_UP_DOORD);
            break;
        case "empty":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(0,0,80,80));  //open door
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18);
            d.setPosition(160+room.walls.up_d,240-88);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(0, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = 40;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            wall = new waw.Unit();
            wall.setAnchorPoint(0.5, 0);
            wall.setContentSize(new cc.Size(80, 80));
            wall.setPosition(160,240 - 48 + 4);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
            break;
    }
    if(d)   //keep sprite ref for trap rooms
        room.up_sprite = d;
    if(g)   //keep sprite ref for trap rooms
        room.up_gate = g;
    d = null; g = null;
    switch (room.walls.right) {
        case "exit":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80 * 2, 80, 80, 80)); //closed door
            layer.addChild(d, -18, TAG_EXIT);
            d.setPosition(320 - 32, 120 - 40 + room.walls.right_d);
            d.setAnchorPoint(0.5, 0);
            d.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.TintTo(1, 0, 255, 0),
                    new cc.TintTo(1, 255, 255, 255)
                )
            ));
            //add rotating locks
            var l = new cc.Sprite(waw.gfx.items, s(1, 0));
            l.addChild(new cc.Sprite(waw.gfx.items, s(2, 0)));
            l.setAnchorPoint(0, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40+8, 55-15);
            l.scale = 0.5;
            l.runAction(new cc.RepeatForever(
                new cc.RotateBy(1, -45)
            ));
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(160, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(320, 120 - 32 + room.walls.right_d);
            wall.setAnchorPoint(0.5, 0);
            wall.setTag(TAG_EXIT);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_EXIT);
            break;
        case "door":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*2,80,80,80)); //closed door
            layer.addChild(d,-18,TAG_RIGHT_DOOR);
            d.setPosition(320-32,120-40+room.walls.right_d);
            d.setAnchorPoint(0.5, 0);
            var l = new cc.Sprite(waw.gfx.items, s(8, 0)); //lock
            l.setAnchorPoint(0.5, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40+8, 55-15);
            l.setRotation(90);
            waw.makeSpriteJump(l);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(160, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(320,120-32+room.walls.right_d);
            wall.setAnchorPoint(0.5, 0);
            wall.setTag(TAG_RIGHT_DOORD);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_RIGHT_DOORD);
            break;
        case "empty":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*2,0,80,80)); //open door
            layer.addChild(d,-18);
            d.setPosition(320-32,120-40+room.walls.right_d);
            d.setAnchorPoint(0.5, 0);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(160, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(320,120-32);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
            break;
    }
    if(d)   //keep sprite ref for trap rooms
        room.right_sprite = d;
    if(g)   //keep sprite ref for trap rooms
        room.right_gate = g;
    d = null; g = null;
    switch (room.walls.down) {
        case "exit":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80 * 3, 80, 80, 80)); //closed door
            d.setPosition(160 + room.walls.down_d, 32);
            layer.addChild(d, -18, TAG_EXIT);
            d.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.TintTo(1, 0, 255, 0),
                    new cc.TintTo(1, 255, 255, 255)
                )
            ));
            //add rotating locks
            var l = new cc.Sprite(waw.gfx.items, s(1, 0));
            l.addChild(new cc.Sprite(waw.gfx.items, s(2, 0)));
            l.setAnchorPoint(0, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(41, 55-24);
            l.scale = 0.5;
            l.runAction(new cc.RepeatForever(
                new cc.RotateBy(1, -45)
            ));
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(240, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = -20;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(160 + room.walls.down_d, 0 - 32);
            wall.setTag(TAG_EXIT);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_EXIT);
            break;
        case "door":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*3,80,80,80)); //closed door
            d.setPosition(160+room.walls.down_d,32);
            layer.addChild(d,-18, TAG_DOWN_DOOR);
            var l = new cc.Sprite(waw.gfx.items, s(8, 0)); //lock
            l.setAnchorPoint(0.5, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(41, 55-24);
            l.setRotation(180);
            waw.makeSpriteJump(l);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(240, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = -20;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(160+room.walls.down_d,0-32);
            wall.setTag(TAG_DOWN_DOORD);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer,TAG_DOWN_DOORD);
            break;
        case "empty":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*3,0,80,80)); //open door
            d.setPosition(160+room.walls.down_d,32);
            layer.addChild(d,-18);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(240, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = 0;
            g.openPosY = -20;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(160,0-32);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
            break;
    }
    if(d)   //keep sprite ref for trap rooms
        room.down_sprite = d;
    if(g)   //keep sprite ref for trap rooms
        room.down_gate = g;
    d = null; g = null;
    switch (room.walls.left) {
        case "exit":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80 * 1, 80, 80, 80)); //closed door
            d.setPosition(32, 120 - 40 + room.walls.left_d);
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d, -18, TAG_EXIT);
            d.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.TintTo(1, 0, 255, 0),
                    new cc.TintTo(1, 255, 255, 255)
                )
            ));
            //add rotating locks
            var l = new cc.Sprite(waw.gfx.items, s(1, 0));
            l.addChild(new cc.Sprite(waw.gfx.items, s(2, 0)));
            l.setAnchorPoint(0, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40-8, 55-15);
            l.scale = 0.5;
            l.runAction(new cc.RepeatForever(
                new cc.RotateBy(1, -45)
            ));
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(80, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = -20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(0, 120 - 32 + room.walls.left_d);
            wall.setAnchorPoint(0.5, 0);
            wall.setTag(TAG_EXIT);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_EXIT);
            break;
        case "door":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*1,80,80,80)); //closed door
            d.setPosition(32,120-40+room.walls.left_d);
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18, TAG_LEFT_DOOR);
            var l = new cc.Sprite(waw.gfx.items, s(8, 0)); //lock
            l.setAnchorPoint(0.5, 0.5);
            d.addChild(l,1, TAG_SPRITE_TEMP);
            l.setPosition(40-8, 55-15);
            l.setRotation(-90);
            waw.makeSpriteJump(l);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(80, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = -20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;

            // obstacle
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(0,120-32+room.walls.left_d);
            wall.setAnchorPoint(0.5, 0);
            wall.setTag(TAG_LEFT_DOORD);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer, TAG_LEFT_DOORD);
            break;
        case "empty":
            d = new cc.Sprite(waw.gfx.doors, cc.rect(80*1,0,80,80)); //open door
            d.setPosition(32,120-40+room.walls.left_d);
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18);
            //add and hide gates
            g = new cc.Sprite(waw.gfx.doors, cc.rect(80, 160, 80, 80)); //gate
            g.setAnchorPoint(0, 0);
            d.addChild(g, 2);
            g.openPosX = -20;
            g.openPosY = 0;
            g.setPosition(g.openPosX, g.openPosY);
            g.visible = false;
            break;
        case "wall":
            //we don't draw wall (it's on the bg)
            wall = new waw.Unit();
            wall.setContentSize(new cc.Size(64, 64));
            wall.setPosition(0,120-32);
            wall.setAnchorPoint(0.5, 0);
            units.push(wall);
            //debug - shows hit box over the wall
            waw.AddHitBoxSprite(wall, layer);
            break;
    }
    if(d)   //keep sprite ref for trap rooms
        room.left_sprite = d;
    if(g)   //keep sprite ref for trap rooms
        room.left_gate = g;
    d = null; g = null;
    //put obstacles in the room
    waw.prepareRoomPattern(room);

    if(showDebugInfo) {
        var label = new cc.LabelTTF("ROOM: "+waw.curRoomX+","+waw.curRoomY+" Type:"+room.type+" Dist:"+room.distance+" Doors:"+room.doors, "Arial", 12);
        layer.addChild(label, 300); //, TAG_LABEL_SPRITE1);
        label.setAnchorPoint(0,1);
        label.setPosition(20, 230);
        label.setOpacity(200);
    }
};

waw.openDoor = function (doorTag, layer) {
    if(waw.curRoom.trapActive)
        return;
    if(waw.keys<=0) {
        if(Math.random()<0.5)
            cc.audioEngine.playEffect(waw.sfx.nah01);
        else
            cc.audioEngine.playEffect(waw.sfx.nah02);
        //console.log("You have no a key to open the door");
        return;
    }
    for (var i = 0; i < waw.units.length; i++) {
        if (!waw.units[i])
            continue;
        if (waw.units[i].getTag() === doorTag) {
            //make 'empty' passages for next room gen calls
            switch (doorTag) {
                case TAG_UP_DOORD:
                    rooms[waw.curRoomY][waw.curRoomX].walls.up =
                        rooms[waw.curRoomY - 1][waw.curRoomX].walls.down = "empty";
                    break;
                case TAG_RIGHT_DOORD:
                    rooms[waw.curRoomY][waw.curRoomX].walls.right =
                        rooms[waw.curRoomY][waw.curRoomX + 1].walls.left = "empty";
                    break;
                case TAG_DOWN_DOORD:
                    rooms[waw.curRoomY][waw.curRoomX].walls.down =
                        rooms[waw.curRoomY + 1][waw.curRoomX].walls.up = "empty";
                    break;
                case TAG_LEFT_DOORD:
                    rooms[waw.curRoomY][waw.curRoomX].walls.left =
                        rooms[waw.curRoomY][waw.curRoomX - 1].walls.right = "empty";
                    break;
            }
            waw.units[i] = null;
        }
    }
    waw.keys--;
    var node = layer.getChildByTag(doorTag - 4);
    switch (doorTag - 4) {
        case TAG_UP_DOOR:
            node.setTextureRect(cc.rect(0, 0, 80, 80));
            node.setTag(0);
            node.runAction(new cc.Sequence( //animate opened door
                new cc.ScaleTo(0.1, 1.2, 1),
                new cc.ScaleTo(0.1, 1)
            ));
            node.getChildByTag(TAG_SPRITE_TEMP).runAction(new cc.Spawn( //animate the lock
                new cc.MoveBy(0.3, 0, -8),
                new cc.FadeOut(0.3)
            ));

            break;
        case TAG_RIGHT_DOOR:
            node.setTextureRect(cc.rect(80 * 2, 0, 80, 80));
            node.setTag(0);
            node.runAction(new cc.Sequence(
                new cc.ScaleTo(0.1, 1, 1.2),
                new cc.ScaleTo(0.1, 1)
            ));
            node.getChildByTag(TAG_SPRITE_TEMP).runAction(new cc.Spawn( //animate the lock
                new cc.MoveBy(0.3, 0, -8),
                new cc.FadeOut(0.3)
            ));
            break;
        case TAG_DOWN_DOOR:
            node.setTextureRect(cc.rect(80 * 3, 0, 80, 80));
            node.setTag(0);
            node.runAction(new cc.Sequence(
                new cc.ScaleTo(0.1, 1.2, 1),
                new cc.ScaleTo(0.1, 1)
            ));
            node.getChildByTag(TAG_SPRITE_TEMP).runAction(new cc.Spawn( //animate the lock
                new cc.MoveBy(0.3, 0, -8),
                new cc.FadeOut(0.3)
            ));
            break;
        case TAG_LEFT_DOOR:
            node.setTextureRect(cc.rect(80 * 1, 0, 80, 80));
            node.setTag(0);
            node.runAction(new cc.Sequence(
                new cc.ScaleTo(0.1, 1, 1.2),
                new cc.ScaleTo(0.1, 1)
            ));
            node.getChildByTag(TAG_SPRITE_TEMP).runAction(new cc.Spawn( //animate the lock
                new cc.MoveBy(0.3, 0, -8),
                new cc.FadeOut(0.3)
            ));
            break;
    }
    //we need 2 tags _DOOR and _DOORD that's why -4
    layer.removeChildByTag(doorTag);
    cc.audioEngine.playEffect(waw.sfx.door01);
};

waw.openExitDoor = function (layer) {
    if(waw.curRoom.trapActive)
        return;
    if(waw.coins<=0 || waw.gems<=0) {
        if(Math.random()<0.5)
            cc.audioEngine.playEffect(waw.sfx.nah01);
        else
            cc.audioEngine.playEffect(waw.sfx.nah02);
        //console.log("You must have Coin+Gem to open the exit door");
        return;
    }
    waw.coins--;
    waw.gems--;
    cc.audioEngine.playEffect(waw.sfx.door01);

    var transition = cc.TransitionFade;
    //var transition = cc.TransitionZoomFlipAngular;
    cc.director.runScene(new transition(1, new waw.gotoNextLevel()));  //1st arg = in seconds duration of t
};

//adds obstacles of a room onto existing layer
waw.prepareRoomPattern = function(room) {
    if(!room) throw "unknown room";
    var layer = waw.layer;
    var d;

    //some random floor debris to PSEUDO random per a room
    waw.rand = new Math.seedrandom(room.randomSeedTextures); //a temp Pseudo random func with set seed
    for(var x = 0; x < waw.rand()*4; x++) {
        d = new cc.Sprite(waw.gfx.textures,
            cc.rect(Math.floor(waw.rand()*8)*18+1, 1, 16, 16));

        layer.addChild(d,-15); //on the floor (lower than players/mobs shadows)
        d.opacity = 127;
        d.setPosition(Math.round(64+waw.rand()*192),Math.round(64+waw.rand()*112));
        //if(waw.rand()>0.5)
        //    continue;
        d.setRotation(Math.round((waw.rand()*4))*90);
        if(waw.rand()>0.5)
            continue;
        d.setScale(1 + waw.rand()*0.25);
    }
    //some of them go to the walls
    var wallDecorN = [0,1,2,3,4,5,6]; //u can repeat some elements like cracks
    //upper
    var n = Math.floor(waw.rand() * wallDecorN.length);
    n = wallDecorN.splice(n,1);
    if(waw.rand()< 0.5) {
        d = new cc.Sprite(waw.gfx.textures,
            cc.rect(n[0] * 22 + 1, 19, 20, 20));
        d.setAnchorPoint(0.5, 1);
        layer.addChild(d, -19); //middle wall Zindex = -20
        d.opacity = 127;
        d.setPosition(Math.round(64 + waw.rand() * 192), 228);
        if (waw.rand() > 0.5)
            d.flippedX = true;
        if (waw.rand() > 0.5)
            d.setScale(1+waw.rand()*0.25);
    }
    //bottom
    n = Math.floor(waw.rand() * wallDecorN.length);
    n = wallDecorN.splice(n,1);
    if(waw.rand()< 0.5) {
        d = new cc.Sprite(waw.gfx.textures,
            cc.rect(n[0] * 22 + 1, 19, 20, 20));
        d.setAnchorPoint(0.5, 0);
        layer.addChild(d, -19); //middle wall Zindex = -20
        d.opacity = 127;
        d.setPosition(Math.round(64 + waw.rand() * 192), 12);
        if (waw.rand() > 0.5)
            d.flippedX = true;
        if (waw.rand() > 0.5)
            d.flippedY = true;
    }
    //left
    n = Math.floor(waw.rand() * wallDecorN.length);
    n = wallDecorN.splice(n,1);
    if(waw.rand()< 0.5) {
        d = new cc.Sprite(waw.gfx.textures,
            cc.rect(n[0] * 22 + 1, 19, 20, 20));
        d.setAnchorPoint(0.5, 0);
        d.rotation = 90;
        layer.addChild(d, -19); //middle wall Zindex = -20
        d.opacity = 127;
        d.setPosition(12, Math.round(32 + waw.rand() * 170));
        if (waw.rand() > 0.5)
            d.flippedX = true;
        if (waw.rand() > 0.5)
            d.flippedY = true;
    }
    //right
    n = Math.floor(waw.rand() * wallDecorN.length);
    n = wallDecorN.splice(n,1);
    if(waw.rand()< 0.5) {
        d = new cc.Sprite(waw.gfx.textures,
            cc.rect(n[0] * 22 + 1, 19, 20, 20));
        d.setAnchorPoint(0.5, 0);
        d.rotation = -90;
        layer.addChild(d, -19); //middle wall Zindex = -20
        d.opacity = 127;
        d.setPosition(308, Math.round(32 + waw.rand() * 170));
        if (waw.rand() > 0.5)
            d.flippedX = true;
        if (waw.rand() > 0.5)
            d.flippedY = true;
    }

    //now put some obstacles, according to the room.type
    waw.rand = new Math.seedrandom(room.randomSeedObstacles); //a temp Pseudo random func with set seed
    var hitboxOffsetY = 6;
    switch(room.type){
        case 0:
            //no obstacles
            break;
        case 1:
            //. 1 obstacle in the middle of the room
            waw.putRoomObstacle(new cc.Point(160,105), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 2:
            //.. 2 obstacles horizontally
            waw.putRoomObstacle(new cc.Point(88,105), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(232,105), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 3:
            //2 obstacles TL BR
            waw.putRoomObstacle(new cc.Point(88,137), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(232,67), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 4:
            //2 obstacle BL TR
            waw.putRoomObstacle(new cc.Point(232,137), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(88,67), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 5:
            //.:
            waw.putRoomObstacle(new cc.Point(232,67), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(232,137), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(88,105), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 6:
            //:.
            waw.putRoomObstacle(new cc.Point(88,67), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(88,137), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(232,105), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 7:
            //. . .horizontal line of obstacles in the room
            var y1 = 105+(Math.round(waw.rand()*8-16));
            waw.putRoomObstacle(new cc.Point(88,y1), new cc.Size(32,16), hitboxOffsetY);
            y1 = 105+(Math.round(waw.rand()*8-16));
            waw.putRoomObstacle(new cc.Point(160,y1), new cc.Size(32,16), hitboxOffsetY);
            y1 = 105+(Math.round(waw.rand()*8-16));
            waw.putRoomObstacle(new cc.Point(232,y1), new cc.Size(32,16), hitboxOffsetY);
            break;
        case 8:
            //::
            waw.putRoomObstacle(new cc.Point(232,67), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(232,137), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(88,67), new cc.Size(32,16), hitboxOffsetY);
            waw.putRoomObstacle(new cc.Point(88,137), new cc.Size(32,16), hitboxOffsetY);
            break;
    }
};


//block exits
waw.activateTrapRoom = function() {
    var units = waw.units;
    var layer = waw.layer;
    var wall;
    var r = waw.curRoom;

    var wp = {
        wallSize: 32, //thickness of the border walls
        wallSize2: 48, //thickness of the TOP walls
        verticalWall_upY: 240/2+64/2,
        verticalWall_downY: -240/2 + 64/2,
        horizontalWall_leftX: -240/2 + 64/2,
        horizontalWall_rightX: -240/2 + 64/2
    };

    console.log("activate trap room");
    r.trapActive = true;
    cc.audioEngine.playEffect(waw.sfx.door01);

/*    //hide doors - entrances
    if(r.up_sprite)
        r.up_sprite.runAction(
                new cc.FadeOut(0.5)
        );
    if(r.right_sprite)
        r.right_sprite.runAction(
                new cc.FadeOut(0.5)
        );
    if(r.down_sprite)
        r.down_sprite.runAction(
                new cc.FadeOut(0.5)
        );
    if(r.left_sprite)
        r.left_sprite.runAction(
                new cc.FadeOut(0.5)
        );*/

    // Left wall
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.width = wp.wallSize;
    wall.height = 240;
    wall.x = wp.wallSize / 2;
    wall.y = 0;
    units.push(wall);
    waw.AddHitBoxSprite(wall, layer, TAG_TRAP);
    r.left_trap = wall;

    // Right wall
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(wp.wallSize, 240));
    wall.x = 320-wp.wallSize / 2;
    wall.y = 0;
    units.push(wall);
    waw.AddHitBoxSprite(wall, layer, TAG_TRAP);
    r.right_trap = wall;

    // Top wall
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320, wp.wallSize2));   //fat top wall
    wall.x = 320/2;
    wall.y = 240 - 24 - wp.wallSize2/2 + 4;
    units.push(wall);
    waw.AddHitBoxSprite(wall, layer, TAG_TRAP);
    r.up_trap = wall;

    // Bottom wall
    wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.setContentSize(new cc.Size(320, wp.wallSize));
    wall.x = 320/2;
    wall.y = 0;
    units.push(wall);
    waw.AddHitBoxSprite(wall, layer, TAG_TRAP);
    r.down_trap = wall;
    //close gates
    var g;
    if((g = r.up_gate)){
        g.visible = true;
        g.runAction(new cc.MoveTo(0.5+Math.random()/2, 0, 0));
    }
    if((g = r.right_gate)){
        g.visible = true;
        g.runAction(new cc.MoveTo(0.5+Math.random()/2, 0, 0));
    }
    if((g = r.down_gate)){
        g.visible = true;
        g.runAction(new cc.MoveTo(0.5+Math.random()/2, 0, 0));
    }
    if((g = r.left_gate)){
        g.visible = true;
        g.runAction(new cc.MoveTo(0.5+Math.random()/2, 0, 0));
    }
};

//unblock exits
waw.deactivateTrapRoom = function () {
    var g, r = waw.curRoom;
    waw.curRoom.trap = false;
    waw.curRoom.trapActive = false;

    console.log("open exits in trap room");
    cc.audioEngine.playEffect(waw.sfx.door01);
    waw.layer.removeChildByTag(TAG_TRAP, true);

    //open gates
    if((g = r.up_gate)){
        g.runAction(new cc.MoveTo(0.5+Math.random(), g.openPosX, g.openPosY));
    }
    if((g = r.right_gate)){
        g.runAction(new cc.MoveTo(0.5+Math.random(), g.openPosX, g.openPosY));
    }
    if((g = r.down_gate)){
        g.runAction(new cc.MoveTo(0.5+Math.random(), g.openPosX, g.openPosY));
    }
    if((g = r.left_gate)){
        g.runAction(new cc.MoveTo(0.5+Math.random(), g.openPosX, g.openPosY));
    }

/*
    if (r.up_sprite)
        r.up_sprite.runAction(
            new cc.FadeIn(0.5)
        );
    if (r.right_sprite)
        r.right_sprite.runAction(
            new cc.FadeIn(0.5)
        );
    if (r.down_sprite)
        r.down_sprite.runAction(
            new cc.FadeIn(0.5)
        );
    if (r.left_sprite)
        r.left_sprite.runAction(
            new cc.FadeIn(0.5)
        );
*/

    for (var i = 0; i < waw.units.length; i++) {
        var w = waw.units[i];
        if (!w)
            continue;
        if (w === waw.curRoom.left_trap ||
            w === waw.curRoom.right_trap ||
            w === waw.curRoom.up_trap ||
            w === waw.curRoom.down_trap) {
            w.debugCross.visible = false;
            waw.units[i] = null;
        }
    }
};

//adds grid sprite to show hit Box
waw.AddHitBoxSprite = function (unit, layer, tag_) {
    var tag = tag_ | 0;
    if(unit.width < 100 && unit.height < 100)
        unit.debugCross = new cc.Sprite(waw.gfx.hitBoxGridBlue, cc.rect(0, 0, unit.width, unit.height));
    else
        unit.debugCross = new cc.Sprite(waw.gfx.hitBoxGrid, cc.rect(0, 0, unit.width, unit.height));
    unit.debugCross.setAnchorPoint(0.5, 0);
    unit.debugCross.x = unit.x;
    unit.debugCross.y = unit.y;
    layer.addChild(unit.debugCross, 300, tag);
    unit.debugCross.setVisible(showDebugInfo);
};

//adds Pillars obstacles of a room onto existing layer
waw.putRoomObstacle = function (pos, hitbox, hitboxYoffset) {
    var units = waw.units;
    var layer = waw.layer;
    var room = waw.curRoom;

    var sprite = new cc.Sprite(waw.gfx.pillar, cc.rect(0, 0, 32, 64));
    sprite.setColor(new cc.Color(room.floorR,room.floorG,room.floorB,255));
    sprite.setPosition(pos);
    sprite.setAnchorPoint(0.5, 0);
    //sprite.skewX = -3 + Math.round(6*Math.random());
    layer.addChild(sprite, 250 - pos.y);
    var wall = new waw.Unit();
    wall.setAnchorPoint(0.5, 0);
    wall.sprite = sprite; //just a ref to put ACTIONS on the pillar spr
    wall.setContentSize(hitbox); //collision box
    wall.setPosition(pos.x, pos.y + hitboxYoffset);
    wall.setTag(TAG_PILLAR);
    units.push(wall);
    //debug
    waw.AddHitBoxSprite(wall, layer);
};