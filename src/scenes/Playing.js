import { Player } from "./gameobjects/player.js";
import { Bullet } from "./gameobjects/bullet.js";
import { Enemy } from "./gameobjects/enemy.js";

export class Playing extends Phaser.Scene {
    
    constructor() {
        super('Playing');
       
    }

    preload() {
        
    }

    create() {
        // initialization stage 
        // resolution 1280 x 720 -> middle of the screen is 640 x 320 ish
        const path = new Phaser.Curves.Path(100,100);
        path.lineTo(400,100).lineTo(400,300).lineTo(100,300).closePath();

        //const sprite = this.add.follower(path, 100, 100, "name"); // where name is a sprite
        //this.background = this.add.sprite(640, 320, 'background');

        this.player = new Player(this, 640, 620, "ship_1"); // using my player class
        
        this.last_time = 0;

        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.space = this.input.keyboard.addKey("SPACE", false, true);
        
        // keyLeft1 = this.input.keyboard.addKey("A", false, true);
        // keyLeft2 = this.input.keyboard.addKey("left", false, true)
        // this.left = keyLeft1 || keyLeft2;
        // or keyLeft1.isDown ? this.left = keyLeft1 : this.left = keyLeft2;
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        if (this.left.isDown && this.right.isUp) this.player.x -= this.player.speed*dt;
        if (this.right.isDown && this.left.isUp) this.player.x += this.player.speed*dt;

        if (Phaser.Input.Keyboard.JustDown(this.space)) { // one bullet fired per press of space
            let bullet = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle, this.player.bullet_speed); // angle + i*90
            console.log("firing");
        }
        
        
    }


    backgroundScroll() { // randomly adds stars and planets for the background 

    }
}