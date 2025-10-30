import { Bullet } from "./bullet.js"

export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction, speed, damage, type) {
        super(scene, x, y, "");
        
    }
}