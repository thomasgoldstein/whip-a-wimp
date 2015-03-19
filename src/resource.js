"use strict";
var themeDir = "res/Themes/Temple/";
waw.gfx = {
    barrel: themeDir + "Barrel.png",
    bat: themeDir + "Bat.png",
    cherub: "res/Common/Cherub.png",
    chest: themeDir + "Chest.png",
    doors: themeDir + "Doors.png",
    floor: themeDir + "Floor.png",
    items: themeDir + "Items.png",
    jesus: "res/Common/Jesus.png",
    jesusCloth: "res/Common/JesusCloth.png",
    kiwi: "res/Common/Kiwi.png",
    lightSpot: "res/Common/LightSpot.png",
    lightRay: "res/Common/lightRay.png",
    map: themeDir + "Map.png",
    merchant: themeDir + "Merchant.png",
    middleWalls: themeDir + "MiddleWalls.png",
    pig: themeDir + "Pig.png",
    pillar: themeDir + "Pillar.png",
    shadow12x6: "res/Common/Shadow12x6.png",
    shadow24x12: "res/Common/Shadow24x12.png",
    shadow32x16: "res/Common/Shadow32x16.png",
    sparkle: "res/Common/Sparkle.png",
    spikes: themeDir + "Spikes.png",
    textures: themeDir + "Textures.png",
    titleGFX: themeDir + "TitleGFX.png",
    touchControls: "res/UI/TouchControls.png",
    upperWalls: themeDir + "UpperWalls.png",
    weapons: "res/Common/Weapons.png",
    
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
    pigDeath: "res/SFX/PigDeath.ogg",
    pigHurt01: "res/SFX/PigHurt01.ogg",
    pigHurt02: "res/SFX/PigHurt02.ogg",
    punch01: "res/SFX/Punch01.ogg",
    whip01: "res/SFX/Whip01.ogg",
    whip02: "res/SFX/Whip02.ogg"
};

var g_resources = [];

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