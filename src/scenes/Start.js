export class Start extends Phaser.Scene {

    constructor() {
        super("Start");
    }

    preload() {
        // this is just for loading assets - done in title screen because it is the entry point for the game

        this.load.image('background', 'assets/bg.png'); // loading in assets used by the game 
        // this.load.spritesheet("monster", "filepath", {"framewidth": 64}); // supposedly how you add a spritesheet
        this.load.image('ship_1', "assets/spaceShips_004.png");
        this.load.image('ship_2', "assets/spaceShips_002.png");
        this.load.image('ship_3', "assets/spaceShips_003.png");
        // load ship 1, 2, 3
        this.load.image('bullet', "assets/spaceRocketParts_002.png");
        this.load.image("missile", "assets/spaceRocketParts_001.png")
        // bullets and rockets  
        this.load.image("planet0", "assets/planet00.png");
        this.load.image("planet1", "assets/planet01.png");
        this.load.image("planet2", "assets/planet02.png");
        this.load.image("planet3", "assets/planet03.png");
        this.load.image("planet4", "assets/planet04.png");
        this.load.image("planet5", "assets/planet05.png");
        this.load.image("planet6", "assets/planet06.png");
        this.load.image("planet7", "assets/planet07.png");
        this.load.image("planet8", "assets/planet08.png");
        this.load.image("planet9", "assets/planet09.png");

        this.load.image("star1", "assets/star_large.png");
        this.load.image("star2", "assets/star_medium.png");
        this.load.image("star3", "assets/star_small.png");
        this.load.image("star4", "assets/star_tiny.png");

        this.load.image("enemy1", "assets/shipBlue_manned.png");
        this.load.image("enemy2", "assets/shipGreen_manned.png");
        this.load.image("enemy3", "assets/shipPink_manned.png");
        this.load.image("enemy4", "assets/shipYellow_manned.png");
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
