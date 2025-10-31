export class Endgame extends Phaser.Scene {

    constructor() {
        super('Endgame');

       
    }

    init(data) {
        this.winstate = data[0];
        this.score = data[1].score;
    }

    preload() {
        this.load.image('background', 'assets/bg.png'); // not necessary
        
    }

    create() {
        // IDEALLY show score / high score etc...

        if (this.winstate) { // if the player won
            this.add.text(100, 300, "YOU WIN!!!", {
                fontSize: "128px",
                fill: "#FFF",
                align: "center"
            });
            this.add.text(100,440, "CONGRATULATIONS..." +  " --- Score: " + this.score, {
                fontSize: "32px",
                fill: "#FFF",
                align: "center"
            })
        }
        else { // if the player lost 
            this.add.text(100, 300, 'GAME OVER', { fontSize: '128px', fill: '#FFF', align: "center" });
            //this.add.text(400, 440, 'GAME OVER', { fontSize: '78px', fill: '#FFF', align: "center" });
            this.add.text(100,440, "Score: " + this.score, {
                fontSize: "32px",
                fill: "#FFF",
                align: "center"
            })
        }
        this.add.text(100,600, "The game will restart shortly...", {
            fontSize: "32px",
            fill: "#FFF",
            align: "center"
        })

        this.time.delayedCall(10000, () => {
            this.scene.stop("Endgame");
            this.scene.start("Start");
        })

        //this.background = this.add.sprite(640, 320, 'background');
        
    }

}