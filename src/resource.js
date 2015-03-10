"use strict";
var themeDir = "res/Themes/Temple/";
waw.gfx = {
    Barrel: themeDir + "Barrel.png",
    Bat: themeDir + "Bat.png",
    Cherub: "res/Common/Cherub.png",
    Chest: themeDir + "Chest.png",
    Doors: themeDir + "Doors.png",
    Floor: themeDir + "Floor.png",
    Items: themeDir + "Items.png",
    Jesus: "res/Common/Jesus.png",
    JesusCloth: "res/Common/JesusCloth.png",
    Kiwi: "res/Common/Kiwi.png",
    LightSpot: "res/Common/LightSpot.png",
    Map: themeDir + "Map.png",
    Merchant: themeDir + "Merchant.png",
    MiddleWalls: themeDir + "MiddleWalls.png",
    Pig: themeDir + "Pig.png",
    Pillar: themeDir + "Pillar.png",
    Shadow12x6: "res/Common/Shadow12x6.png",
    Shadow24x12: "res/Common/Shadow24x12.png",
    Shadow32x16: "res/Common/Shadow32x16.png",
    Sparkle: "res/Common/Sparkle.png",
    Spikes: themeDir + "Spikes.png",
    Textures: themeDir + "Textures.png",
    TitleGFX: themeDir + "TitleGFX.png",
    TouchControls: "res/UI/TouchControls.png",
    UpperWalls: themeDir + "UpperWalls.png",
    Weapons: "res/Common/Weapons.png"
};

//gfx for debug
waw.gfx.dbg = {
    HitBoxGrid: "res/DBG/hbGrid.png",
    HitBoxGridBlue: "res/DBG/hbGridBlue.png"
};

//music
waw.bgm = {
    Level1: "res/Music/ingame01.mp3"
};

//SFX
waw.sfx = {
    Candelabre01: "res/SFX/Candelabre01.ogg",
    Coin01: "res/SFX/Coin01.ogg",
    Door01: "res/SFX/Door01.ogg",
    MerchDeath: "res/SFX/MerchDeath.ogg",
    MerchHurt01: "res/SFX/MerchHurt01.ogg",
    MerchHurt02: "res/SFX/MerchHurt02.ogg",
    Ouch01: "res/SFX/Ouch01.ogg",
    Ouch02: "res/SFX/Ouch02.ogg",
    Ouch03: "res/SFX/Ouch03.ogg",
    PigDeath: "res/SFX/PigDeath.ogg",
    PigHurt01: "res/SFX/PigHurt01.ogg",
    PigHurt02: "res/SFX/PigHurt02.ogg",
    Punch01: "res/SFX/Punch01.ogg",
    Whip01: "res/SFX/Whip01.ogg",
    Whip02: "res/SFX/Whip02.ogg"
};

var g_resources = [
    //bgm
    {src:waw.bgm.Level1},

    //image
    {src:waw.gfx.Barrel},
    {src:waw.gfx.Bat},
    {src:waw.gfx.Cherub},
    {src:waw.gfx.Chest},
    {src:waw.gfx.Doors},
    {src:waw.gfx.Floor},
    {src:waw.gfx.Items},
    {src:waw.gfx.Jesus},
    {src:waw.gfx.JesusCloth},
    {src:waw.gfx.Kiwi},
    {src:waw.gfx.LightSpot},
    {src:waw.gfx.Map},
    {src:waw.gfx.Merchant},
    {src:waw.gfx.MiddleWalls},
    {src:waw.gfx.Pig},
    {src:waw.gfx.Pillar},
    {src:waw.gfx.Shadow12x6},
    {src:waw.gfx.Shadow24x12},
    {src:waw.gfx.Shadow32x16},
    {src:waw.gfx.Sparkle},
    {src:waw.gfx.Spikes},
    {src:waw.gfx.Textures},
    {src:waw.gfx.TitleGFX},
    {src:waw.gfx.TouchControls},
    {src:waw.gfx.UpperWalls},
    {src:waw.gfx.Weapons},

    //gfx for debug
    {src:waw.gfx.dbg.HitBoxGrid},
    {src:waw.gfx.dbg.HitBoxGridBlue},

    //plist

    //fnt

    //tmx

    //effect
    {src:waw.sfx.Candelabre01},
    {src:waw.sfx.Coin01},
    {src:waw.sfx.Door01},
    {src:waw.sfx.MerchDeath},
    {src:waw.sfx.MerchHurt01},
    {src:waw.sfx.MerchHurt02},
    {src:waw.sfx.Ouch01},
    {src:waw.sfx.Ouch02},
    {src:waw.sfx.Ouch03},
    {src:waw.sfx.PigDeath},
    {src:waw.sfx.PigHurt01},
    {src:waw.sfx.PigHurt02},
    {src:waw.sfx.Punch01},
    {src:waw.sfx.Whip01},
    {src:waw.sfx.Whip02}
];