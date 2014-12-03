"use strict";
//Level Generator

var TAG_UP_DOOR = 200+0;
var TAG_RIGHT_DOOR = 200+1;
var TAG_DOWN_DOOR = 200+2;
var TAG_LEFT_DOOR = 200+3;
var TAG_UP_DOORD = 200+4;
var TAG_RIGHT_DOORD = 200+5;
var TAG_DOWN_DOORD = 200+6;
var TAG_LEFT_DOORD = 200+7;

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
    // ceiling & floor
    //TODO add usage of top / bottom ladders in the level
	this.top = "wall";
	this.bottom = "wall";
}

//a Room generator
function Room(_name,_x,_y) {
	this.name = _name || "nameless Room";
	this.x = _x;
	this.y = _y;
	this.walls = new Walls();
    this.visited = false;
    this.type = 0; //0 = clean room type
    //this.mobs = waw.generateMobs();
    //this.items = waw.generateItems();
    this.mobs = [];
    this.items = [];

// Random Seed to generate the same lists of decorative elements
    this.randomSeedDebris = Math.round(Math.random()*100000);
    this.randomSeedObstacles = Math.round(Math.random()*100000);
}

rooms.initLevel = function() {
	//init level 9x9
	for(var y = 0; y < 9 ; y++) {
		rooms[y] = {};
		for(var x = 0; x < 9 ; x++) {
			//var t = new Room("name"+x+"_"+y,x,y);
			rooms[y][x] = null;
		}
	}
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
	do {
		noCycle++;
		if(!rooms[y][x]) {
            var d = 0; //delta offset of the door/passage position
			var r = new Room("Room "+x+"-"+y,x,y);
			if(x == 4 && y == 4){ //for TEST mark start Room x4,y4
				//r.Walls.up = r.Walls.down = r.Walls.left = r.Walls.right = "empty";
				r.walls.bottom = "start";
                r.type = 0; //clean room. no obstacles in it
			}

            //random type of the room obstacles pattern
            //set chance to set a pattern to 90%  TODO - put it back to 50
            if(Math.random() <= 0.9)
                r.type = Math.floor(Math.random()*7);
            else
                r.type = 0;
            //gen spawn coords for items
            r.items = waw.generateItems(r.type);
            //gen spawn coords for mobs
            r.mobs = waw.generateMobs(r.type);

			//make connection between previous and current rooms
			if(oldx < x){
                if(Math.random()<0.2)   //20% chance for a closed door
                    temp = "door";
                else
                    temp = "empty";     //80% - passage
                r.walls.left = rooms[oldy][oldx].walls.right = temp;
                //TODO in the final ver, make the cance of the shifted door at 30% 1-> 0.3 . Now it is for debugging
                if(Math.random()<0.3)     //30% - chance of the shifted passage
                    r.walls.left_d = rooms[oldy][oldx].walls.right_d = Math.round(maxDy - Math.random()*(maxDy*2)); // -maxDy .. maxDy
            }
			if(oldx > x){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.right = rooms[oldy][oldx].walls.left = temp;
                if(Math.random()<0.3)
                    r.walls.right_d = rooms[oldy][oldx].walls.left_d = Math.round(maxDy - Math.random()*(maxDy*2)); // // -maxDy .. maxDy
			}
			if(oldy < y){
                if(Math.random()<0.2)
                    temp = "door";
                else
                    temp = "empty";
                r.walls.up = rooms[oldy][oldx].walls.down = temp;
                if(Math.random()<0.3)
                    r.walls.up_d = rooms[oldy][oldx].walls.down_d = Math.round(maxDx - Math.random()*(maxDx*2)); // -maxDx .. maxDx
			}
			if(oldy > y){
                if(Math.random()<0.2)
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
		if(Math.random()*100 < 50) {
			//X
			if(Math.random()*100 < 50)
				x++;
			else
				x--;	
		} else {
			//Y
			if(Math.random()*100 < 50)
				y--;
			else
				y++;
		}
		//check for bounds
		if(x>=8) {
			x=8;
			//noCycle--;
		}
		if(x<0) {
			x=0;
			//noCycle--;
		}
		if(y>=8) {
			y=8;
			//noCycle--;
		}
		if(y<0) {
			y=0;
			//noCycle--;
		}
		//check for max number of rooms to generate
	} while(noCycle<15 );

    //start room[4,4] should have no obstacles!
    rooms[4][4].type = 0;
};

waw.GetRoomItemsSpawnCoords = function (roomType) {
    var a = [];
    //if(roomType>1)
    //    roomType = 1;   //TODO remove. this is debug
    switch (roomType) {
        case 0:
            //no obstacles
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 220), y: y});
            }
            break;
        case 1:
            //1 obstacle in the middle of the room
            a.push({x: 50 + Math.round(Math.random() * 60), y: 50 + Math.round(Math.random() * 40)});
            a.push({x: 50 + Math.round(Math.random() * 60), y: 140 + Math.round(Math.random() * 40)});
            a.push({x: 210 + Math.round(Math.random() * 60), y: 140 + Math.round(Math.random() * 40)});
            a.push({x: 210 + Math.round(Math.random() * 60), y: 50 + Math.round(Math.random() * 40)});
            break;
        case 2:
            //4 obstacles around the middle of the room
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 30), y: y});
                a.push({x: 145 + Math.round(Math.random() * 30), y: y});
                a.push({x: 240 + Math.round(Math.random() * 30), y: y});
            }
            break;
        case 3:
            //4 obstacles wide around the middle of the room
            //TODO ajdust
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 40 + Math.round(Math.random() * 20), y: y});
                a.push({x: 110 + Math.round(Math.random() * 100), y: y});
                a.push({x: 260 + Math.round(Math.random() * 20), y: y});
            }
            break;
        case 4:
            //1 obstacle in the middle of the room
            //4 obstacles wide around the middle of the room
            a.push({x: 40 + Math.round(Math.random() * 20), y: 40 + Math.round(Math.random() * 20)});
            a.push({x: 40 + Math.round(Math.random() * 20), y: 170 + Math.round(Math.random() * 20)});
            a.push({x: 260 + Math.round(Math.random() * 20), y: 170 + Math.round(Math.random() * 20)});
            a.push({x: 260 + Math.round(Math.random() * 20), y: 40 + Math.round(Math.random() * 20)});
            a.push({x: 140 + Math.round(Math.random() * 40), y: 60 + Math.round(Math.random() * 30)});
            break;
        case 5:
            //horizontal line of obstacles in the room
            for (var x = 58; x < 280; x += 40) {
                a.push({x: x, y: 45 + Math.round(Math.random() * 40)});
                a.push({x: x, y: 145 + Math.round(Math.random() * 35)});
            }
            break;
        case 6:
            //vertical line of obstacles in the room
            for (var y = 48; y < 170; y += 40) {
                a.push({x: 50 + Math.round(Math.random() * 60), y: y});
                a.push({x: 210 + Math.round(Math.random() * 60), y: y});
            }
            break;
    }
    return a;
};

//Generate Mini Map Layer
waw.GenerateMiniMap = function() {
    var visited = null;
    var m = null;
    var r,w;
//    var layer = new cc.Layer(39, 39);    //transparent BG of mini-map
    var layer = new cc.LayerColor(cc.color(0,0,0,24), 45, 45);   //dark BG
    var draw = new cc.DrawNode();
    layer.addChild(draw);

    for(var y = 0; y < 9 ; y++) {
        for(var x = 0; x < 9; x++) {
            w = 0; //walls-doors counter
            r = rooms[y][x];
            if(r) {	//is it a Room
                //4 passages
                if(r.walls.up == "wall")
                    w |= 1;
                if(r.walls.right == "wall")
                    w |= 2;
                if(r.walls.down == "wall")
                    w |= 4;
                if(r.walls.left == "wall")
                    w |= 8;
                //the room
                m = new cc.Sprite(s_Map,
                    cc.rect(w * 6, 0, 6, 6));
                m.setOpacity(r.visited ? 255 : 63);
                draw.addChild(m);
                m.setPositionX(x*5+3);
                m.setPositionY((8-y)*5+2);
                if(currentRoomX == x && currentRoomY == y){
                    m.setScale(2);
                    m.runAction(new cc.ScaleTo(2, 1));
                    m.runAction(new cc.Blink(1, 2)); //Blink sprite
                    //red dot - players pos
                    m = new cc.Sprite(s_Map,
                        cc.rect(0, 12, 6, 6));
                    draw.addChild(m);
                    m.setPositionX(x*5+3);
                    m.setPositionY((8-y)*5+2);
                    m.setOpacity(127);

                }
            }
        }
    }
    return layer;
};

/*//old Vectors style
waw.GenerateMiniMapV = function() {
    var color = null;
//    var layer = cc.Layer.create(39, 39);    //transparent BG of mini-map
    var layer = cc.LayerColor.create(cc.c4b(0, 0, 0, 24), 39, 39);   //dark BG
    var draw = cc.DrawNode.create();
    layer.addChild(draw);

    for(var y = 0; y < 9 ; y++) {
        for(var x = 0; x < 9; x++) {
            var r = rooms[y][x];
            if(r) {	//is it a Room
                if(r.visited)
                    color = cc.c4f( 1,1,1, 0.5);
                else
                    color = cc.c4f( 0.2,0.2,0.2, 0.5);
                //4 passages
                if(r.walls.up != "wall")
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5 + 1.6), 0.5, color );
                if(r.walls.right != "wall")
                    draw.drawDot( cc.p(x*4+3.5 +1.6, (8-y)*4+3.5), 0.5, color );
                if(r.walls.down != "wall")
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5 - 1.6), 0.5, color );
                if(r.walls.left != "wall")
                    draw.drawDot( cc.p(x*4+3.5 -1.6, (8-y)*4+3.5), 0.5, color );
                //the room
                draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5), 1.7, color );
                //Draw yellow dot for player
                if(currentRoomX == x && currentRoomY == y)
                    draw.drawDot( cc.p(x*4+3.5, (8-y)*4+3.5), 1, cc.c4f( 25,0,0, 1) );
            }
        }
    }
    return layer;
};*/

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
        horizontalWall_rightX: -240/2 + 64/2,
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
    var wall, d;

    //add room Background
    var floor = new cc.Sprite(s_Floor);
    var middleWalls = new cc.Sprite(s_MiddleWalls);
    var upperWalls = new cc.Sprite(s_UpperWalls);
    layer.ignoreAnchor = true;
    floor.ignoreAnchor = true;
    middleWalls.ignoreAnchor = true;
    upperWalls.ignoreAnchor = true;
    layer.addChild(floor, -20); //Z index the lowest one
    layer.addChild(middleWalls, -19);
    layer.addChild(upperWalls, 255);

    //add doors
    switch (room.walls.up) {    //FAT upper wall
        case "door":
            d = new cc.Sprite(s_Doors, cc.rect(0,80,80,80)); //closed door
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18, TAG_UP_DOOR);
            d.setPosition(160+room.walls.up_d,240-88);
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
            d = new cc.Sprite(s_Doors, cc.rect(0,0,80,80));  //open door
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18);
            d.setPosition(160+room.walls.up_d,240-88);
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
    switch (room.walls.right) {
        case "door":
            d = new cc.Sprite(s_Doors, cc.rect(80*2,80,80,80)); //closed door
            layer.addChild(d,-18,TAG_RIGHT_DOOR);
            d.setPosition(320-32,120-40+room.walls.right_d);
            d.setAnchorPoint(0.5, 0);
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
            d = new cc.Sprite(s_Doors, cc.rect(80*2,0,80,80)); //open door
            layer.addChild(d,-18);
            d.setPosition(320-32,120-40+room.walls.right_d);
            d.setAnchorPoint(0.5, 0);
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
    switch (room.walls.down) {
        case "door":
            d = new cc.Sprite(s_Doors, cc.rect(80*3,80,80,80)); //closed door
            d.setPosition(160+room.walls.down_d,32);
            layer.addChild(d,-18, TAG_DOWN_DOOR);
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
            d = new cc.Sprite(s_Doors, cc.rect(80*3,0,80,80)); //open door
            d.setPosition(160+room.walls.down_d,32);
            layer.addChild(d,-18);
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
    switch (room.walls.left) {
        case "door":
            d = new cc.Sprite(s_Doors, cc.rect(80*1,80,80,80)); //closed door
            d.setPosition(32,120-40+room.walls.left_d);
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18, TAG_LEFT_DOOR);
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
            d = new cc.Sprite(s_Doors, cc.rect(80*1,0,80,80)); //open door
            d.setPosition(32,120-40+room.walls.left_d);
            d.setAnchorPoint(0.5, 0);
            layer.addChild(d,-18);
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
    //put obstacles in the room
    waw.prepareRoomPattern(room);

    //print room coords X,Y at the upper left corner
    if(showDebugInfo) {
        var label = new cc.LabelTTF("ROOM: "+currentRoomX+","+currentRoomY+" Type:"+room.type, "Arial", 12);
        layer.addChild(label, 300); //, TAG_LABEL_SPRITE1);
        label.setAnchorPoint(0,1);
        label.setPosition(20, 230);
        label.setOpacity(200);
    }

};

waw.openDoor = function (doorTag, layer) {
    for (var i = 0; i < waw.units.length; i++) {
        if (waw.units[i].getTag() === doorTag) {
            //make 'empty' passages for next room gen calls
            switch (doorTag) {
                case TAG_UP_DOORD:
                    waw.units.splice(i, 1);
                    i--;
                    rooms[currentRoomY][currentRoomX].walls.up =
                    rooms[currentRoomY - 1][currentRoomX].walls.down = "empty";
                    break;
                case TAG_RIGHT_DOORD:
                    waw.units.splice(i, 1);
                    i--;
                    rooms[currentRoomY][currentRoomX].walls.right =
                    rooms[currentRoomY][currentRoomX + 1].walls.left = "empty";
                    break;
                case TAG_DOWN_DOORD:
                    waw.units.splice(i, 1);
                    i--;
                    rooms[currentRoomY][currentRoomX].walls.down =
                    rooms[currentRoomY + 1][currentRoomX].walls.up = "empty";
                    break;
                case TAG_LEFT_DOORD:
                    waw.units.splice(i, 1);
                    i--;
                    rooms[currentRoomY][currentRoomX].walls.left =
                    rooms[currentRoomY][currentRoomX - 1].walls.right = "empty";
                    break;
            }
        }
    }
    var allSprites = layer.getChildren();
    for (var i = 0; i < allSprites.length; i++) {
        var node = allSprites[i];
        if (node.getTag() === doorTag-4) {
            switch (doorTag-4) {
                case TAG_UP_DOOR:
                    node.setTextureRect(cc.rect(0, 0, 80, 80));
                    node.setTag(0);
                    break;
                case TAG_RIGHT_DOOR:
                    node.setTextureRect(cc.rect(80 * 2, 0, 80, 80));
                    node.setTag(0);
                    break;
                case TAG_DOWN_DOOR:
                    node.setTextureRect(cc.rect(80 * 3, 0, 80, 80));
                    node.setTag(0);
                    break;
                case TAG_LEFT_DOOR:
                    node.setTextureRect(cc.rect(80 * 1, 0, 80, 80));
                    node.setTag(0);
                    break;
            }
        }
        //we need 2 tags _DOOR and _DOORD that's why -4
        if (node.getTag() === doorTag) {
                //remove this aux debug+hitbox sprites
            switch (doorTag) {
                case TAG_UP_DOORD:
                    layer.removeChild(node);
                    i--;
                    break;
                case TAG_RIGHT_DOORD:
                    layer.removeChild(node);
                    i--;
                    break;
                case TAG_DOWN_DOORD:
                    layer.removeChild(node);
                    i--;
                    break;
                case TAG_LEFT_DOORD:
                    layer.removeChild(node);
                    i--;
                    break;
            }
        }
    }
};

//adds obstacles of a room onto existing layer
waw.prepareRoomPattern = function(room) {
    if(!room) throw "unknown room";
    var units = waw.units;
    var layer = waw.layer;

    //some random debris to PSEUDO random per a room
    waw.rand = new Math.seedrandom(room.randomSeedDebris); //a temp Pseudo random func with set seed
    for(var x = 0; x < waw.rand()*2; x++) { //*3+1
        var d = new cc.Sprite(s_Debris,
            cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 32));

        layer.addChild(d,-15); //on the floor (lower than players/mobs shadows)
        d.setPosition(Math.round(64+waw.rand()*192),Math.round(64+waw.rand()*112));
        if(waw.rand()>0.5)
            continue;
        d.setRotation(waw.rand()*360);
        if(waw.rand()>0.5)
            continue;
        d.setScale(0.75 + waw.rand()*0.3);
        //d.runAction(cc.FadeTo.create(5,0.5));
    }
    //TODO remove them from there. they'll be in the patterns
    //we do not use "laying on the floor obstacles" now
/*
    for(var x = 0; x < waw.rand()*2; x++) {
        var d = cc.Sprite.create(s_Pit,
            cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 32));
        layer.addChild(d,-8); //on the floor
        d.setPosition(Math.round(64+waw.rand()*192),Math.round(64+waw.rand()*112));
        units.push(d);
    }
*/

    //now put some obstacles, according to the room.type
    waw.rand = new Math.seedrandom(room.randomSeedObstacles); //a temp Pseudo random func with set seed
    var offsetY = -12;
    var hitboxOffsetY = -8;
    switch(room.type){
        case 0:
            //no obstacles
            break;
        case 1:
            //1 obstacle in the middle of the room
            waw.putRoomObstacle(new cc.p(320/2,240/2+offsetY), new cc.Size(32,16), new cc.p(320/2,240/2+hitboxOffsetY));
            break;
        case 2:
            //4 obstacles around the middle of the room
            waw.putRoomObstacle(new cc.p(320/3,240/3+offsetY), new cc.Size(32,16), new cc.p(320/3,240/3+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320/3,240-240/3-12+offsetY), new cc.Size(32,16), new cc.p(320/3,240-240/3-12+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/3,240/3+offsetY), new cc.Size(32,16), new cc.p(320-320/3,240/3+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/3,240-240/3-12+offsetY), new cc.Size(32,16), new cc.p(320-320/3,240-240/3-12+hitboxOffsetY));
            break;
        case 3:
            //4 obstacles wide around the middle of the room
            waw.putRoomObstacle(new cc.p(320/4,240/4+8+offsetY), new cc.Size(32,16), new cc.p(320/4,240/4+8+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320/4,240-240/4-20+offsetY), new cc.Size(32,16), new cc.p(320/4,240-240/4-20+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/4,240/4+8+offsetY), new cc.Size(32,16), new cc.p(320-320/4,240/4+8+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/4,240-240/4-20+offsetY), new cc.Size(32,16), new cc.p(320-320/4,240-240/4-20+hitboxOffsetY));
            break;
        case 4:
            //1 obstacle in the middle of the room
            waw.putRoomObstacle(new cc.p(320/2,240/2+offsetY), new cc.Size(32,16), new cc.p(320/2,240/2+hitboxOffsetY));
            //4 obstacles wide around the middle of the room
            waw.putRoomObstacle(new cc.p(320/4,240/4+8+offsetY), new cc.Size(32,16), new cc.p(320/4,240/4+8+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320/4,240-240/4-20+offsetY), new cc.Size(32,16), new cc.p(320/4,240-240/4-20+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/4,240/4+8+offsetY), new cc.Size(32,16), new cc.p(320-320/4,240/4+8+hitboxOffsetY));
            waw.putRoomObstacle(new cc.p(320-320/4,240-240/4-20+offsetY), new cc.Size(32,16), new cc.p(320-320/4,240-240/4-20+hitboxOffsetY));
            break;
        case 5:
            //horizontal line of obstacles in the room
            for(var x = 0; x <= 80; x += 64){
                var y1 = 240/2+(Math.round(waw.rand()*8-4))-16;
                waw.putRoomObstacle(new cc.p(160+x,y1+offsetY), new cc.Size(32,16), new cc.p(160+x,y1+hitboxOffsetY));
                if(x!=0)
                    waw.putRoomObstacle(new cc.p(160-x,y1+offsetY), new cc.Size(32,16), new cc.p(160-x,y1+hitboxOffsetY));
            }
            break;
        case 6:
            //vertical line of obstacles in the room
            for(var y = 0; y <= 60; y += 48) {
                var x1 = 320/2+(Math.round(waw.rand()*8-4));
                waw.putRoomObstacle(new cc.p(x1,114+y+offsetY), new cc.Size(32,16), new cc.p(x1,114+y+hitboxOffsetY));
                if(y!=0)
                    waw.putRoomObstacle(new cc.p(x1,114-y+offsetY), new cc.Size(32,16), new cc.p(x1,114-y+hitboxOffsetY));
            }
            break;
    }

};

//initially generate mobs into the room
waw.generateMobs = function(){
    var mobs = [];
    var n = Math.round(Math.random()*2);    //max mobs in the room
    var m = null;

    var pickMobType = ["PigWalker", "PigBouncer", "Trader"];

    for(var i=0; i<n; ++i){
        m = {x:160, y:110, mobType:"unknown", mob:null};
        //m.mobType = Math.random()*100; //TODO replace temp mob TYPE with real
        m.mobType = pickMobType[ Math.round(Math.random()*2)]; //TODO replace temp mob TYPE with real
        m.x = Math.round(50 + Math.random() * 220);
        m.y = Math.round(50 + Math.random() * 130);
        mobs.push(m);
    }
    return mobs;
};

//initially generate items in the room
waw.generateItems = function(roomType){
    var items = [];
    var n = Math.round(Math.random()*5);    //TODO max items in the room
    var item = null;

    var pickItemType = ["key", "coin", "gem", "unknown"];
    var itemCoord = waw.GetRoomItemsSpawnCoords(roomType);
    var cr;
    //debugger;
    if(n>itemCoord.length)
        n = itemCoord.length;
    for(var i=0; i<n; ++i){
        item = {x:160, y:110, itemType:"unknown"};
        item.itemType = pickItemType[ Math.round(Math.random()*(pickItemType.length-1))]; //TODO replace temp item TYPE with real

        cr =  Math.round(Math.random()*(itemCoord.length-1)); //pic
        //console.log(n, cr, itemCoord[cr].x, itemCoord.length);
        item.x = itemCoord[cr].x;
        item.y = itemCoord[cr].y;
        //debugger;

        //itemCoord =
            itemCoord.splice(cr,1);
        //debugger;
        //item.x = Math.round(50 + Math.random() * 220);
        //item.y = Math.round(50 + Math.random() * 130);
        items.push(item);
    }
    return items;
};

//adds grid sprite to show hit Box
waw.AddHitBoxSprite = function (unit, layer, tag_) {
    //if(!showDebugInfo) return;
    var tag = tag_ | 0;
    //var contentSize = unit.getContentSize();
    if(unit.width < 100 && unit.height < 100)
        unit.debugCross = new cc.Sprite(s_HitBoxGridBlue, cc.rect(0, 0, unit.width, unit.height));
    else
        unit.debugCross = new cc.Sprite(s_HitBoxGrid, cc.rect(0, 0, unit.width, unit.height));
    unit.debugCross.setAnchorPoint(0.5, 0);
    unit.debugCross.x = unit.x;
    unit.debugCross.y = unit.y;
    layer.addChild(unit.debugCross, 300, tag);
    unit.debugCross.setVisible(showDebugInfo);

    //console.info("U ",unit.x, unit.y, unit.width, unit.height);
//    sprite.runAction(cc.FadeOut.create(10)); //remove marks
};

//adds Pillars obstacles of a room onto existing layer
waw.putRoomObstacle = function(pos, hitbox, hitboxPos, isAnchoredToBottom) {
    var units = waw.units;
    var layer = waw.layer;

    //var sprite = cc.Sprite.create(s_Pillar,cc.rect(Math.floor(waw.rand()*10)*32, 0, 32, 64)); //to pick random
    var sprite = new cc.Sprite(s_Pillar,cc.rect(0, 0, 32, 64));
    //coords in the room
    //pos.y += 20;
    //pos.y -= 0;
    sprite.setPosition(pos);
    //if(!isAnchoredToBottom)
    sprite.setAnchorPoint(0.5, 0);
    sprite.skewX = -3 + Math.round(6*Math.random());
    //layer.addChild(sprite, 20+ 250 - pos.y);
    layer.addChild(sprite, 250 - pos.y);
    var wall = new waw.Unit();
    //hitboxPos.y += 8;   //4
    wall.setAnchorPoint(0.5, 0);
    wall.sprite = sprite; //just a ref to put ACTIONS on the pillar spr
    wall.setContentSize(hitbox); //collision box
    wall.setPosition(hitboxPos); //collision box 32x16
    wall.setTag(TAG_PILLAR);
    units.push(wall);

    //debug
    waw.AddHitBoxSprite(wall, layer);
};