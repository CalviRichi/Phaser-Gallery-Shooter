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
        
        //this.background = this.add.sprite(640, 320, 'background');

        this.player = new Player(this, 640, 620, "ship_1"); // using my player class
        this.player.setDepth(10);

        this.last_time = 0;
        this.time_add = 0;

        this.planet_list = [];

        this.enemies = this.add.group("enemies");
        this.enemies_bullet_list = this.add.group("enemies_bullet_list");
        this.meteors = this.add.group("meteors");
        this.player_bullet_list = this.add.group("player_bullet_list");

        //const background_layer = this.add.layer();
        //background_layer.add(this.planet_list);

        this.round = 0;
        this.in_round = true;

        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.b = this.input.keyboard.addKey("B", false, true); // B for bullet 
        this.m = this.input.keyboard.addKey("M", false, true); // M for missile

        this.missile_timer = 0;
        this.can_fire_missile = false;

        this.metor_timer = 0;

        this.initial_enemy_count = 0;

        this.round_announcement = this.add.text(300,300,"", {
            fontSize: '32px',
            fill: '#FFF',
            align: 'center'
        });
        this.round_announcement.setOrigin(0.5,0.5);

        this.player_stats = this.add.text(100, 600, "HEALTH: " + this.player.hp + 
            " - - - Enemies Remaining: " + this.enemies.children.entries.length + "/" + this.initial_enemy_count, {
            fontSize: "16px",
            fill: '#FFF',
            align: "center"
        });
        this.player_stats.setOrigin(0,0.5);
        // most likely use , and . for bullets and missiles
    }

    update(time) {

        // TIMING
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        this.time_add += dt;
        this.missile_timer += dt;
        this.metor_timer += dt;
       
        // BACKGROUND AND ENEMY UPDATES

        if (this.time_add >= 1.25) {
            if (this.planet_list.length < 25) {
                this.addPlanet();
            }
            this.time_add = 0;
        }

        if (this.missile_timer >= 1) {
            this.can_fire_missile = true;
        }

        if (this.metor_timer > 5) {
            this.metor_timer = 0;
            if (this.meteors.children.entries.length < 4) {
                this.addMeteor();
            }
        }

        this.backgroundScroll();

        // -------------------------------------------------------------------------------------

        // CONTROLS

        if (this.left.isDown && this.right.isUp) this.player.x -= this.player.speed*dt;
        if (this.right.isDown && this.left.isUp) this.player.x += this.player.speed*dt;

        if (Phaser.Input.Keyboard.JustDown(this.b)) { // one bullet fired per press of space
            let bullet = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle, this.player.bullet_speed, this.player.damage, "bullet"); // angle + i*90
            this.player_bullet_list.add(bullet);
        }
        if (Phaser.Input.Keyboard.JustDown(this.m) && this.can_fire_missile) {
            this.can_fire_missile = false;
            this.missile_timer = 0;
            let missile = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle, this.player.bullet_speed, this.player.damage, "missile");
            this.player_bullet_list.add(missile);
        }

        // ---------------------------------------------------------------------------------------

        // WORLD LOGIC

        if (this.enemies.children.entries.length == 0 && this.in_round)
        {
            /**
             * this.title_text = this.add.text(640, 100, "WELCOME TO THE GAME!!!", { fontSize: '64px', fill: '#FFF', align: "center" });
                this.title_text.setOrigin(0.5, 0.5);
             */
            this.round++;
            this.in_round = false;
            this.initial_enemy_count = 0;
            // delayed call to announce enemy wave, delayed call to actually add the enemies 
            this.round_announcement.text = "Begin Round: " + this.round;
            this.time.delayedCall(5000, () => {
                this.round_announcement.text = "";
                this.addEnemies(time);
                this.in_round = true;
            });

            
            
        }

        // physics
        //checking player bullets colliding with enemies
        this.physics.world.overlap(this.player_bullet_list, this.enemies, (b,e) => {
            b.destroy(true); e.hp-=b.damage; console.log(e.hp);
            let tex = "damage_meteor";
            let collide = this.add.sprite(b.x, b.y, tex);
            collide.setScale(0.2,0.2);
            this.time.delayedCall(500, () => {collide.destroy(true)});
            if (e.hp <= 0) {e.destroy(true); this.player.score++; this.checkLevelUp(); }});
        
        // checking enemy bullets colliding with player
        this.physics.world.overlap(this.player, this.enemies_bullet_list, (p,b) => { p.hp -= b.damage; b.destroy(true); 
            let tex;
            switch(b.damage) { // 5, 7 , 12, 18
                case 5:
                    tex = "damage_enemy1";
                    break;
                case 7:
                    tex = "damage_enemy2";
                    break;
                case 12:
                    tex = "damage_enemy3";
                    break;
                case 18:
                    tex = "damage_enemy4";
                    break;
            }
            let collision = this.add.sprite(b.x, b.y, tex);
            collision.setScale(0.2,0.2);

            this.time.delayedCall(500, () => {collision.destroy(true)});
            this.checkEndGame(); });
        
        // checking enemies colliding with player (arcade rules, player loses health)
        this.physics.world.overlap(this.player, this.enemies, (p, e) => {p.hp -= (e.damage * 1.5); 
            let tex;
            switch(e.damage) { // 5, 7 , 12, 18
                case 5:
                    tex = "damage_enemy1";
                    break;
                case 7:
                    tex = "damage_enemy2";
                    break;
                case 12:
                    tex = "damage_enemy3";
                    break;
                case 18:
                    tex = "damage_enemy4";
                    break;
            }
            let collision = this.add.sprite(b.x, b.y, tex);
            this.time.delayedCall(500, () => {collision.destroy(true)});
            this.player.tint = 0xff0000; // copies from the demo game
            this.time.delayedCall(500, () => { this.player.tint = 0xffffff; });
            e.destroy(true); this.checkEndGame(); });
        // it hurts more for ships to crash into you

        // checking meteors colliding with player (player loses health)
        this.physics.world.overlap(this.player, this.meteors, (p, m) => {p.hp -= m.damage; 
            //console.log("player health: " + this.player.hp);
            let tex = "damage_meteor"; // texture of collision, there are 4 textures
            m.destroy(true); let collide = this.add.sprite(m.x, m.y, tex);
            this.player.tint = 0xff0000; // copies from the demo game
            this.time.delayedCall(500, () => { this.player.tint = 0xffffff; });
            collide.setScale(0.2,0.2);
            this.time.delayedCall(500, () => {collide.destroy(true)});
            m.destroy(true); this.checkEndGame(); });
        // meteors should do a good bit of damage

        // checking player bullets colliding with meteors
        this.physics.world.overlap(this.player_bullet_list, this.meteors, (b,m) => {
            
            let tex = "damage_meteor"; // texture of collision, there are 4 textures
            let collide = this.add.sprite(b.x, b.y, tex);
            collide.setScale(0.2,0.2);
            this.time.delayedCall(500, () => {collide.destroy(true)});
            
            if (b.type == "missile") {
                m.destroy(true); b.destroy(true); 
                this.player.score += 2; this.checkLevelUp();
            }
            else {
                m.hp -= b.damage; if (m.hp <= 0) {m.destroy(true);}
                b.destroy(true); 
                this.player.score += 2; this.checkLevelUp();
            }
            
        }); // maybe if instead the type is bullet there is a little collision animation


        this.player_stats.text = "HEALTH: " + this.player.hp + 
            " - - - Enemies Remaining: " + this.enemies.children.entries.length + "/" + this.initial_enemy_count;
    }
/*
  
*/
    addEnemies(time) {

        // JSON LIST IS NOT NECESSARY  

        /*
        The enemy constructor, using the enemy type, will determine the enemy stats
        */
        let e_count = 3;
        e_count += this.round * 4;

        // PATH LOGIC NEEDS TO GO HERE

        /**
         *  const path = new Phaser.Curves.Path(100,100);
            path.lineTo(400,100).lineTo(400,300).lineTo(100,300).closePath();

            const sprite = this.add.follower(path, 100, 100, "name"); // where name is a sprite
         */
        let tex;
        switch (this.round) {
            case 1:
                tex = "enemy1";
                break;
            case 2:
                tex = "enemy2";
                break;
            case 3:
                tex = "enemy3";
                break;
            case 4:
                tex = "enemy4";
                break;
            default:
                tex = "enemy4";
                break;
        }

        for (let a = 0; a < e_count; a++) {
          
            let start = 100 * a;
            const path = new Phaser.Curves.Path(start,0);
            path.lineTo(start + 400, 400).lineTo(start + 800, 200).lineTo(start, 400).closePath();
            
            const e = new Enemy(this, path, 100 * a + 20, 20, tex, this.player.attack_angle + 90, time);
            /**
             * e.setScale(0.5);
            Phaser.Math.RotateAround(e, 0, 0, Phaser.Math.DegToRad(angle));
            this.enemy_group.add(e);
            this.physics.add.existing(e);
             */
            
            e.setDepth(10);
            e.setScale(0.2,0.2);
            this.enemies.add(e); // 


            const pathLength = e.path.getLength();
            const duration = (pathLength / e.speed) * 1000; // ms
            
            this.time.delayedCall(a * 1000, () => {

                e.startFollow({
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    rotateToPath: false
                });
            });
            
            
            //this.add.existing(e);
            //this.physics.add.existing(e);
        }

        this.initial_enemy_count = this.enemies.children.entries.length;


    }

    addMeteor() { // meteors are like enemies but need missiles
                    // very similar functionally to add planet
        console.log("meteor");
        let t = Math.floor(Math.random() * 4);
        switch (t) {
            case 0:
                t = "meteor1";
                break;
            case 1:
                t = "meteor2";
                break;
            case 2:
                t = "meteor3";
                break;
            case 3:
                t = "meteor4";
                break;
        }

        let x = Math.floor(Math.random() * 1200) + 40;
        let y = -35;

        let sp = this.add.sprite(x, y, t);

        
        sp.scale = Math.random() * 0.5 + 0.1;
        sp.setScale(sp.scale,sp.scale);
        sp.setDepth(10);
        sp.hp = 30;
        sp.damage = 15; // for when it hits the player
        this.add.existing(sp); // shouldnt need to happen
        this.physics.add.existing(sp);

        this.meteors.add(sp);
        
    }

    addPlanet() {
        // generate a random number for: planet / star, type of planet / star, location on x and y, scale

        // x 1280
        // y 720

        let d = Math.random();
        let pl_or_star = false;
        if (d < 0.1) { // decides the ratio
            pl_or_star =true; // it is a planet
        }
        else {
            pl_or_star = false; // it is a star
        }

        let x = Math.floor(Math.random() * 1240) + 40;
        //let x_adjust = Math.floor(Math.random() * 600) + 1;
        let y = -35; //Math.floor(Math.random() * 700) + 1;

        let pl;
        if (pl_or_star) {
            pl = Math.floor(Math.random() * 10);
        }
        else {
            pl = Math.floor(Math.random() * 4) - 4; // -4 ... -1
        }
        
        //console.log(pl);
        let sp = "";

        switch (pl) {
            case -4:
                sp = "star1";
                break;
            case -3:
                sp = "star2";
                break;
            case -2:
                sp = "star3";
                break;
            case -1:
                sp = "star4";
                break;
            case 0:
                sp = "planet0";
                break;
            case 1:
                sp = "planet1";
                break;
            case 2:
                sp = "planet2";
                break;
            case 3:
                sp = "planet3";
                break;
            case 4:
                sp = "planet4";
                break;
            case 5:
                sp = "planet5";
                break;
            case 6:
                sp = "planet6";
                break;
            case 7:
                sp = "planet7";
                break;
            case 8:
                sp = "planet8";
                break;
            case 9:
                sp = "planet9";
                break;
            default:
                sp = "planet0";
                break;
        }
        let s = this.add.sprite(x, y, sp);

        let scale;
        if (pl_or_star) { // if it is a planet
                scale = Math.random() * 0.11;
        }
        else {
            if (sp == "star1" || sp == "star2") {
                scale = 0.1 // Math.random() * 0.15;
            }
            else 
                scale = Math.random() * 0.3;
            
        }



        s.setScale(scale,scale);
        s.speed_scale = scale;
        s.setDepth(0);
        this.add.existing(s); // this is necessary here because no group
        //background_layer.add(s);

        this.planet_list.push(s);

    }

    backgroundScroll() { // randomly adds stars and planets for the background 
        for (let p in this.planet_list) {
            //console.log(p);
            this.planet_list[p].y += 1 * this.planet_list[p].speed_scale * 5;
            if (this.planet_list[p].y >= 760) {
                this.planet_list[p].destroy(true);
                this.planet_list.splice(p,1);
            }
        }
        for (const m of this.meteors.getChildren()) {
            m.y += (1 / m.scale);
        }
    }
    checkLevelUp() {
        if (this.player.score >= 5) {
            this.player.level++;
        }
    }

    checkEndGame()
    {
        if (this.player.hp <= 0)
        {
            this.scene.stop("Playing");
            this.scene.start('Endgame');
        }
    }
}