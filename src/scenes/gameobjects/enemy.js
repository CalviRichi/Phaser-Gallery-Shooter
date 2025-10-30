import { Bullet } from "./bullet.js"

// Some enemies will fire bullets, others will just try to crash into you
// By default they follow a path, like the patterns of the enemies in Galaga

// 

export class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, x, y, which, direction, speed, attack_rate, bullet_speed, damage, target, time) {

        super(scene, x, y, which);

        switch(which) { // rather than pass in 1000,000 variables, the sprite will determine the stats
            
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.direction = Phaser.Math.DegToRad(direction);

        this.scene = scene;
        this.speed = speed;
        this.rotation = this.direction;
        this.attack_rate = attack_rate;
        this.bullet_speed = bullet_speed;
        this.damage = damage;
        this.last_attack = time + Math.random()*this.attack_rate;
        
    }
    preUpdate(time, delta) { // this function is called during the update of the game loop
        let dt = delta / 1000;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy,dx);
        this.rotation = angle+2*Math.PI/2;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            this.x += Math.cos(angle)*this.speed*dt;
            this.x += Math.sin(angle)*this.speed*dt;
        } 
        if (this.last_attack + this.attack_rate < time) {
            this.last_attack = time;
            let b = new Bullet(this.scene, this.x, this.y, this.angle+180, this.bullet_speed, this.damage);
            this.scene.enemy_bullets.add(b);
        }
    }
 }


