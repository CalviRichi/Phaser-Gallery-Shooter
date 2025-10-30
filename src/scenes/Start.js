export class Start extends Phaser.Scene {

    constructor() {
        super("Start");
    }

    preload() {
        // this is just for loading assets - done in title screen because it is the entry point for the game

        this.load.image('background', 'assets/bg.png'); // loading in assets used by the game 
        // this.load.spritesheet("monster", "filepath", {"framewidth": 64}); // supposedly how you add a spritesheet
        this.load.image('ship_1', "assets/spaceShips_004.png");
        // load ship 1, 2, 3
        this.load.image('projectile', "assets/spaceRocketParts_002.png");
        // bullets and rockets  
        this.load.image("planet", "assets/spaceShips_002.png");
    }

    create() {
        // show the title screen
        this.title_text = this.add.text(640, 100, "WELCOME TO THE GAME!!!", { fontSize: '64px', fill: '#FFF', align: "center" });
        this.title_text.setOrigin(0.5, 0.5);

        this.space = this.input.keyboard.addKey("SPACE", false, true);
    }

    update(time) {

        if (Phaser.Input.Keyboard.JustDown(this.space)) { // if the player presses space, start the real game
            this.scene.stop("Start");
            this.scene.start('Playing');
        }
    }
    
    
}
