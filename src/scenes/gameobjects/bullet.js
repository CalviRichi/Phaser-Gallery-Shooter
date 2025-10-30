export class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction, speed, damage, which) {
        super(scene, x, y, which); // because the scene is supplied and "projectile" is loaded in the scene, this works

        // damage and speed

        switch (which) {
            case "bullet":
                this.type = "bullet";
                this.speed = speed;
                this.damage = damage;
                this.setScale(0.1, 0.1);
                break;
            case "missile": // something like this
                this.type = "missile";
                this.speed = speed / 2;
                this.damage = damage * 3;
                this.setScale(0.15, 0.15);
                break;
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.direction = Phaser.Math.DegToRad(direction);

        this.scene = scene;
        this.last_time = this.scene.time.now;
       
        this.scene.time.delayedCall(10000, () => this.destroy());
    }

    preUpdate(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        this.x += Math.cos(this.direction)*this.speed*dt;
        this.y += Math.sin(this.direction)*this.speed*dt;
        //this.rotation += 15*dt;
    }
}