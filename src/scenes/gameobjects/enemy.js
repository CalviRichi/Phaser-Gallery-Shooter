import { Bullet } from "./bullet.js"

// Some enemies will fire bullets, others will just try to crash into you
// By default they follow a path, like the patterns of the enemies in Galaga

// 

export class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, which, direction, time) {
        // scene, path, x, y, tex, anim
        super(scene, path, x, y, which);

        // enemy specific stats
        switch(which) { // rather than pass in 1000,000 variables, the sprite will determine the stats
            // damage scales by 1.5
            case "enemy1":
                this.speed = 200;
                this.hp = 5; // will die in one bullet hit
                this.attack_rate = 800; // lower the faster
                this.bullet_speed = 800;
                this.damage = 5;
                break;
            case "enemy2":
                this.speed = 250;
                this.hp = 8; 
                this.attack_rate = 8500;
                this.bullet_speed = 800;
                this.damage = 7;
                break;
            case "enemy3":
                this.speed = 300;
                this.hp = 12; 
                this.attack_rate = 9000;
                this.bullet_speed = 800;
                this.damage = 12;
                break;
            case "enemy4": // needs missiles 
                this.speed = 220;
                this.hp = 15; 
                this.attack_rate = 1200;
                this.bullet_speed = 1000;
                this.damage = 18;
                break;
        }

        //general stats
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.direction = Phaser.Math.DegToRad(direction);
        this.scene = scene;
        this.rotation = this.direction;
        this.last_attack = time + Math.random()*this.attack_rate;

        const pathLength = this.path.getLength();
        const duration = (pathLength / this.speed) * 1000; // ms

        this.startFollow({
            duration: duration,
            repeat: -1,
            yoyo: true,
            rotateToPath: false
        });

        // ALL OF THIS IS FINE
        
    }
    preUpdate(time, delta) { // this function is called during the update of the game loop

        super.preUpdate(time, delta);
        let dt = delta / 1000;
        /*
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy,dx);
        this.rotation = angle+2*Math.PI/2;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            this.x += Math.cos(angle)*this.speed*dt;
            this.x += Math.sin(angle)*this.speed*dt;
        } 
        */
        if (this.last_attack + this.attack_rate < time) {
        this.last_attack = time;
        let b = new Bullet(
            this.scene,
            this.x,
            this.y,
            90,
            this.bullet_speed,
            this.damage,
            "bullet"
        );
        this.scene.enemies_bullet_list.add(b);
    }
    }
 }


