Sprites and animations 

for a spritesheet use: this.load.spritesheet (key, source, config, datasource)
this.load.spritesheet("monster", filepath, {"framewidth": 64})
for image: this.load.image

linear interpolation allows you to calculate intermediate points between any two locations 

this.monster.rotation = Math.atan2(this)