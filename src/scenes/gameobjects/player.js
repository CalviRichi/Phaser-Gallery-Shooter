import { Bullet } from "./bullet.js"

/*
this.player = this.add.sprite(640, 620, "player_ship");
*/

export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, mode) { // mode affects ship and stats
        super(scene, x, y, mode); 

        this.setScale(0.2, 0.2);

        scene.add.existing(this);  
        scene.physics.add.existing(this); 

        this.score = 0;
        this.level = 1;
        this.attack_angle = 270; // always
        this.bullet_list = this.add.group("bullet_list");

        switch (mode) {
            case "ship_1": // easy
                this.hp = 100;
                this.speed = 500;
                this.damage = 5;
                this.bullet_speed = 1100;
                break;
            case "ship_2":
                this.hp = 75;
                this.speed = 450;
                this.damage = 4;
                this.bullet_speed = 100;
                break;
            case "ship_3":
                this.hp = 50;
                this.speed = 400;
                this.damage = 3;
                this.bullet_speed = 900;
                break;
            default:
                this.hp = 100;
                this.speed = 500;
                this.damage = 5;
                this.bullet_speed = 1100;
                break;
        }


    }
    preUpdate(time) {

    }
}