import { Start } from './scenes/Start.js';
// import any other scene that is defined

const config = {
    type: Phaser.AUTO,
    title: 'Calvin Richards Gallery Shooter',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#24246bff',
    pixelArt: true,
    physics: {default: "arcade"}, // physics is not defined 
    scene: [
        Start // future would have title screen, playing, endgame
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            