import match from "./match.js";

var config = {
    type: Phaser.AUTO,
    enableDebug: false,
    
    
    scale: {
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
    default: 'arcade',
    arcade: {
        gravity: { y:0, x:0 },
        debug: false
    }

},
    scene: [match]
};

var game = new Phaser.Game(config);
