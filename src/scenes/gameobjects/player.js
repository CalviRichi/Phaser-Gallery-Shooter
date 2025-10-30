import { Bullet } from "./bullet.js"

/*
this.player = this.add.sprite(640, 620, "player_ship");
*/

export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, mode) { // mode affects ship and stats
        super(scene, x, y, mode); 

        this.setScale(0.35, 0.35);
        this.physics.add.existing(this);

        this.attack_angle = 270; // always

        switch (mode) {
            case "ship_1":
                this.hp = 100;
                this.speed = 300;
                this.bullet_speed = 1000;
                break;
            default:
                this.hp = 100;
                this.speed = 300;
                this.bullet_speed = 1000;
                break;
        }
        

        




    }
    preUpdate(time) {

    }
}