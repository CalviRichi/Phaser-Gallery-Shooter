import { Player } from "./gameobjects/player.js";
import { Bullet } from "./gameobjects/bullet.js";
import { Enemy } from "./gameobjects/enemy.js";


/*
let saveData = {
    highscore: 20000,
    lastLevel: 3
};

localStorage.setItem('gameData', JSON.stringify(saveData));

// Read it back
let loaded = JSON.parse(localStorage.getItem('gameData') || '{}');
console.log(loaded.highscore, loaded.lastLevel);

*/
// PROPOSED HIGHSCORE SYSTEM ^^^


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
        var time_add = 0;

        //const sprite = this.add.follower(path, 100, 100, "name"); // where name is a sprite
        //this.background = this.add.sprite(640, 320, 'background');

        this.player = new Player(this, 640, 620, "ship_1"); // using my player class
        
        this.last_time = 0;
        this.time_add = 0;

        this.planet_list = [];

        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.space = this.input.keyboard.addKey("SPACE", false, true);
        
        // most likely use , and . for bullets and missiles
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        this.time_add += dt;

        if (this.time_add >= 2.5) {
            if (this.planet_list.length < 6) {
                this.addPlanet();
            }
            this.time_add = 0;
        }

        this.backgroundScroll();

        if (this.left.isDown && this.right.isUp) this.player.x -= this.player.speed*dt;
        if (this.right.isDown && this.left.isUp) this.player.x += this.player.speed*dt;

        if (Phaser.Input.Keyboard.JustDown(this.space)) { // one bullet fired per press of space
            let bullet = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle, this.player.bullet_speed); // angle + i*90
            //console.log("firing");
        }
        
        
    }

    addPlanet() {
        // generate a random number for: planet / star, type of planet / star, location on x and y, scale

        // x 1280
        // y 720
        let x = Math.floor(Math.random() * 1000) + 1;
        let y = Math.floor(Math.random() * 700) + 1;
        let s = this.add.sprite(x, y, "planet");
        s.setScale(0.2,0.2);
        this.planet_list.push(s);

    }

    backgroundScroll() { // randomly adds stars and planets for the background 
        for (let p in this.planet_list) {
            console.log(p);
            this.planet_list[p].y += 1;
            if (this.planet_list[p].y >= 720) {
                this.planet_list[p].destroy(true);
                this.planet_list.splice(p,1);
            }
        }
    }
}