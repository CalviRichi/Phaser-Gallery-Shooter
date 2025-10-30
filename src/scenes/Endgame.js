export class Endgame extends Phaser.Scene {

    constructor() {
        super('Endgame');
    }

    preload() {
        this.load.image('background', 'assets/bg.png'); // not necessary
        
    }

    create() {
        // IDEALLY show score / high score etc...


        this.background = this.add.sprite(640, 320, 'background');
        this.add.text(100, 300, 'GAME OVER MAN.', { fontSize: '128px', fill: '#FFF', align: "center" });
        this.add.text(400, 440, 'GAME OVER', { fontSize: '78px', fill: '#FFF', align: "center" });
    }

}