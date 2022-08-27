class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}, velocity = {x:0, y:0}, attackBox = { offset: {}, width: undefined, height: undefined} }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
        this.velocity = velocity
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames(){

        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax -1){
                this.framesCurrent ++
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update()  {

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', imageSrc, scale = 1, framesMax = 1,
    offset = {x:0, y:0}, sprites, attackBox = { offset: {}, width: undefined, height: undefined},
    health
    }) {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health= health
        
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.isBlocking = true
        this.dead = false
        this.isAi = false
        this.invincible = false
        this.superCount = 0

        this.startingHealth = health
        this.startingPosition = position

        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update()  {
        this.draw()

        if(!this.dead){
            this.animateFrames()
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //show attack box if needed
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //gravity function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {

        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    superAttack(){

        this.switchSprite('attack1');
        this.isAttacking = true;
        this.superCount++;

    }

    takeHit(){

        if(this.invincible)return

        if(this.isBlocking){
            this.health -= 5;
        } else {
            this.health -= 20;
        }

        if (this.health <= 0 ) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite){

        if ( this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
            }
            return 
        }

        if ( this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax -1 ) return

        if ( this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax -1 ) {
            this.velocity.x = 0;
            this.invincible = true;
            return
        } else { this.invincible = false;}

        switch(sprite) {
            case 'idle':
                if ( this.image !== this.sprites.idle.image) {
                    this.isBlocking = true
                    this.invincible = false
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'run':
                if ( this.image !== this.sprites.run.image) {
                    this.isBlocking = false
                    this.invincible = false
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'jump':
                if ( this.image !== this.sprites.jump.image) {
                    this.isBlocking = false
                    this.invincible = false
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'fall':
                if ( this.image !== this.sprites.fall.image) {
                    this.isBlocking = false
                    this.invincible = false
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'attack1':
                if ( this.image !== this.sprites.attack1.image) {
                    this.isBlocking = false
                    this.invincible = false
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'takeHit':
                if ( this.image !== this.sprites.takeHit.image) {
                    this.isBlocking = false
                    this.invincible = true
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
            break;
            case 'death':
                if ( this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
            break;
        }
    }

}

class Ai {
    constructor(self, enemy){

        this.self = self;
        this.enemy = enemy;

    }

    AiAttack(){
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': 'ArrowDown'
        }));
        window.dispatchEvent(new KeyboardEvent('keyup', {
            'key': 'ArrowDown'
        }));
    }

    AiJump(){
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': 'ArrowUp'
        }));

        window.dispatchEvent(new KeyboardEvent('keyup', {
            'key': 'ArrowUp'
        }));
    }

    AiMoveLeft(){
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': 'ArrowLeft'
        }));

        if ( this.image === this.self.sprites.run.image && this.self.framesCurrent < this.self.sprites.run.framesMax - 5){
            window.dispatchEvent(new KeyboardEvent('keyup', {
                'key': 'ArrowLeft'
            }));
        }

    }

    AiMoveRight(){
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': 'ArrowRight'
        }));
        if ( this.image === this.self.sprites.run.image && this.self.framesCurrent < this.self.sprites.run.framesMax - 5){
            window.dispatchEvent(new KeyboardEvent('keyup', {
                'key': 'ArrowRight'
            }));
        }
    }

    AiBeIdle(){
        window.dispatchEvent(new KeyboardEvent('keyup', {
            'key': 'ArrowRight',
            'key': 'ArrowLeft',
            'key': 'ArrowUp',
        }));
    }

    AiSuperAttack(){
        window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': '#'
        }));
        window.dispatchEvent(new KeyboardEvent('keyup', {
            'key': '#'
        }));
    }


    decideAction(r){

        //Decide on Attacking
        if(Math.abs(this.self.position.x - this.enemy.position.x) < 200 ){
            if ( this.self.image === this.self.sprites.attack1.image && this.self.framesCurrent < this.self.sprites.attack1.framesMax -1 ) return;
            if(r < 0.25){
                this.AiAttack();
            } else {
                this.AiBeIdle();
            }
        }

        // Decide on Jumping
        if(this.self.position.y > this.enemy.position.y){
            if(r < 0.2){
                this.AiJump();
            } else {
                this.AiBeIdle()
            }
        }

        if(r < 0.1){
            this.AiJump();
        }

        // Decide on Moving
        if(this.self.position.x - this.enemy.position.x > 600){
            if(r < 0.40){
                this.AiMoveLeft();
            } else  if (r < 0.45) {
                this.AiMoveRight();
            } else {
                this.AiBeIdle()
            }
        }

        if(this.self.position.x - this.enemy.position.x > 200 && this.self.position.x - this.enemy.position.x < 600){
            if(r < 0.50){
                this.AiMoveLeft();
            } else {
                this.AiMoveRight();
            }
        }

        if(this.self.position.x - this.enemy.position.x < -600){
            if(r < 0.40){
                this.AiMoveRight();
            } else if (r < 0.45) {
                this.AiMoveLeft();
            } else {
                this.AiBeIdle();
            }
        }

        if(this.self.position.x - this.enemy.position.x < -200 && this.self.position.x - this.enemy.position.x > -600){
            if(r < 0.50){
                this.AiMoveRight();
            } else {
                this.AiMoveLeft();
            }
        }

        if(this.self.position.x < 50){
            if(r < 0.90){
                this.AiMoveRight();
            } else {
                this.AiMoveLeft();
            }
        }

        if(this.self.position.x > 920){
            if(r < 0.90){
                this.AiMoveLeft();
            } else {
                this.AiMoveRight();
            }
        }

        if (this.self.dead){
            this.velocity.x = 0;
        }

        if(this.self.health < 20){
            this.AiSuperAttack()
        }

    }

}
