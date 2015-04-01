"use strict";
var g_resources = [];

waw.theme = {
    name: "",
    levelN: 0,
    rules: {},
    themeDir: "",
    init: function() {
        this.name = "Temple";
        this.themeDir = "res/Themes/" + this.name + "/";
        this.rules = this.temple_rules;
        this.levelN = 0;
    },
    gotoNextLevel: function(){
        //this.init();    //replace to pick next theme
        //this.loadResources();
        this.levelN ++;
        if(this.levelN > 4)
            this.gotoNextTheme();
    },
    gotoNextTheme: function(){
        this.init();    //replace to pick next theme
        this.loadResources();
        waw.initScoreAndItems();
    },
    loadResources: function(){
        waw.gfx = {
            barrel: this.themeDir + "Barrel.png",
            bat: this.themeDir + "Bat.png",
            cherub: "res/Common/Cherub.png",
            chest: this.themeDir + "Chest.png",
            doors: this.themeDir + "Doors.png",
            floor: this.themeDir + "Floor.png",
            items: this.themeDir + "Items.png",
            jesus: "res/Common/Jesus.png",
            jesusCloth: "res/Common/JesusCloth.png",
            kiwi: "res/Common/Kiwi.png",
            lightSpot: "res/Common/LightSpot.png",
            lightRay: "res/Common/LightRay.png",
            map: this.themeDir + "Map.png",
            merchant: this.themeDir + "Merchant.png",
            doveSeller: this.themeDir + "DoveSeller.png",
            middleWalls: this.themeDir + "MiddleWalls.png",
            pig: this.themeDir + "Pig.png",
            pillar: this.themeDir + "Pillar.png",
            shadow12x6: "res/Common/Shadow12x6.png",
            shadow24x12: "res/Common/Shadow24x12.png",
            shadow32x16: "res/Common/Shadow32x16.png",
            sparkle: "res/Common/Sparkle.png",
            spikes: this.themeDir + "Spikes.png",
            textures: this.themeDir + "Textures.png",
            titleGFX: this.themeDir + "TitleGFX.png",
            touchControls: "res/UI/TouchControls.png",
            upperWalls: this.themeDir + "UpperWalls.png",
            weapons: "res/Common/Weapons.png",
            title: "res/Common/Title.png",

            //gfx for debug
            hitBoxGrid: "res/DBG/hbGrid.png",
            hitBoxGridBlue: "res/DBG/hbGridBlue.png"
        };
        //music
        waw.bgm = {
            level1: "res/Music/ingame01.mp3"
        };
//SFX
        waw.sfx = {
            candelabre01: "res/SFX/Candelabre01.ogg",
            coin01: "res/SFX/Coin01.ogg",
            door01: "res/SFX/Door01.ogg",
            merchDeath: "res/SFX/MerchDeath.ogg",
            merchHurt01: "res/SFX/MerchHurt01.ogg",
            merchHurt02: "res/SFX/MerchHurt02.ogg",
            ouch01: "res/SFX/Ouch01.ogg",
            ouch02: "res/SFX/Ouch02.ogg",
            ouch03: "res/SFX/Ouch03.ogg",
            good01: "res/SFX/Good01.ogg",
            good02: "res/SFX/Good02.ogg",
            good03: "res/SFX/Good03.ogg",
            cough01: "res/SFX/Cough01.ogg",
            cough02: "res/SFX/Cough02.ogg",
            nah01: "res/SFX/Nah01.ogg",
            nah02: "res/SFX/Nah02.ogg",
            laugh01: "res/SFX/Laugh01.ogg",
            batDeath01: "res/SFX/BatDeath01.ogg",
            batDeath02: "res/SFX/BatDeath02.ogg",
            pigDeath: "res/SFX/PigDeath.ogg",
            pigHurt01: "res/SFX/PigHurt01.ogg",
            pigHurt02: "res/SFX/PigHurt02.ogg",
            punch01: "res/SFX/Punch01.ogg",
            whip01: "res/SFX/Whip01.ogg",
            whip02: "res/SFX/Whip02.ogg"
        };

        g_resources = [];

        for (var key in waw.gfx) {
            if (waw.gfx.hasOwnProperty(key)) {
                g_resources.push({src:waw.gfx[key]});
            }
        }

        for (var key in waw.bgm) {
            if (waw.bgm.hasOwnProperty(key)) {
                g_resources.push({src:waw.bgm[key]});
            }
        }

        for (var key in waw.sfx) {
            if (waw.sfx.hasOwnProperty(key)) {
                g_resources.push({src:waw.sfx[key]});
            }
        }
    },

    temple_rules: {
        name: "Temple",

        max_rooms: [3,5,9,13,15],   //rooms per level

        room_set: [ //possible room type
            [1],
            [2],
            [3, 4],
            [1, 2, 3, 4],
            [1, 2, 3, 4, 5, 6]
        ],

        doors_chance: [ //chance to have a door in a room
            0, 0.1, 0.15, 0.2, 0.3
        ],

        dark_chance: [  //darkness in the room
            0, 0, 0, 0.01, 0.05
        ],

        has_redCloth: [  //has spawn of this item
            false, false, true, true, true
        ],

        has_miniMap: [ //has spawn of this item
            false, false, false, true, true
        ],

        has_ropes: [
            0, 0, 1, 2, 3
        ],

        has_extraKeys: [ //spawn extra items and how much
            2, 1, 0, 0, 0
        ],

        mob_group: [
            ["Spikes"],
            ["Spikes", "Merchant"],
            ["Spikes", "Merchant", "Merchant"],
            ["DoveSeller", "Merchant", "Merchant"],
            ["Spikes", "Bat", "Bat"],
            ["Bat", "Bat", "Bat", "Spikes"],
            ["Spikes", "Bat", "Bat", "DoveSeller"],
            ["Merchant", "Bat", "Bat", "Bat","DoveSeller"],
            ["Bat", "Bat", "Bat", "DoveSeller", "Merchant"]
        ],

        boss_group: [
            "Merchant", "Bat", "Lilith"
        ],

        mob_set: [
            [0],
            [0, 1, 2],
            [0, 1, 2, 3],
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4, 5, 6]
        ]
    }
};

waw.theme.gotoNextTheme();  //initial init of the level
