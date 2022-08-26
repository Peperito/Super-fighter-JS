const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;

let r = Math.random();

setInterval(function(){   
    r = Math.random(); 
 }, 400);


const background = new Sprite({
    position:{
        x:0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position:{
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

const superAttackPlayer = new Sprite({
    position:{
        x: 0,
        y: 2000
    },
    imageSrc: './assets/samuraiMack/super.png',
    scale: 2,
    framesMax: 3,
    velocity: {
        x: 12,
        y: 0,
    },
    offset: {
        x:100,
        y:156
    },
    attackBox: {
        offset: {
            x: 60,
            y: 0
        },
        width: 80,
        height: 110
    }
})

const superAttackEnemy = new Sprite({
    position:{
        x: 0,
        y: 2000
    },
    imageSrc: './assets/kenji/super.png',
    scale: 2,
    framesMax: 3,
    velocity: {
        x: -8,
        y: 0,
    },
    offset: {
        x:255,
        y:127
    },
    attackBox: {
        offset: {
            x: -60,
            y: 0
        },
        width: 100,
        height: 200
    },
})


const playerBuilder = {
    position:{
        x:200,
        y:0
    },
    velocity:{
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x:215,
        y:156
    },
    sprites: {
        idle:{
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 155,
        height: 50
    },
    health: 100,
};

let player = new Fighter(playerBuilder);

const enemyBuilder = {
    position:{
        x:740,
        y:0
    },
    velocity:{
        x: 0,
        y: 0,
    },
    imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x:215,
        y:167
    },
    sprites: {
        idle:{
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            framesMax: 5
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -165,
            y: 50
        },
        width: 165,
        height: 50
    },
    health: 80,
};

let enemy = new Fighter(enemyBuilder);

const setAi = document.getElementById('setAi');

setAi.addEventListener('click', function handleClick() {
    enemy.isAi = true;
});

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
}

let timer = 60;
let timerId;

decreaseTimer();

const restart = document.getElementById('restart');

restart.addEventListener('click', function handleClick() {

    clearTimeout(timerId);
    timer = 60;
    decreaseTimer();

    player = new Fighter(playerBuilder);
    player.position.x = 200;
    player.update();

    enemy = new Fighter(enemyBuilder);
    enemy.position.x = 740;
    enemy.update();

    gsap.to('#playerHealth', {
        width: (player.health/player.startingHealth)*100  + '%'
    })

    gsap.to('#enemyHealth', {
        width: (enemy.health/enemy.startingHealth)*100  + '%'
    })
});

function animate(){
    
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0,0, canvas.width, canvas.height);

    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update();
    enemy.update();

    startFight(timer);

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if(keys.d.pressed && player.lastKey === 'd' && player.position.x < 970){
        player.velocity.x = 5;
        player.switchSprite('run');
    } else if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0) {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }


    //enemy movement
    if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x < 970){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0 ) {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })
        && player.isAttacking
        && player.framesCurrent === 4
        ){
        enemy.takeHit();
        player.isAttacking = false;

        gsap.to('#enemyHealth', {
            width: (enemy.health/enemy.startingHealth )* 100 + '%'
        })
    }

    //case player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false;
    }

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking
        && enemy.framesCurrent === 2
        ){
        player.takeHit();
        enemy.isAttacking = false;
        
        gsap.to('#playerHealth', {
            width: (player.health/player.startingHealth )* 100 + '%'
        })
    }   

    //case enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false;
    }
    
    //end game based on health
    if (enemy.health <= 0 || player.health <=0 ){
        determineWinner({player, enemy, timerId});
    }

    if(timer  === 0 ){
        determineWinner(player, enemy, timerId);
    }

    if(enemy.isAi){
        const enemyControl = new Ai(enemy, player);
        enemyControl.decideAction(r);
    }

    if(player.framesCurrent === 4 && player.superCount === 1){
        superAttackPlayer.position.x = player.position.x;
        superAttackPlayer.position.y = player.position.y;

        superAttackPlayer.attackBox.position.x = superAttackPlayer.position - superAttackPlayer.attackBox.offset
        superAttackPlayer.attackBox.position.y = superAttackPlayer.position - superAttackPlayer.attackBox.offset

        player.superCount++;
    }

    superAttackPlayer.update();

    if(enemy.framesCurrent === 2 && enemy.superCount === 1){
        superAttackEnemy.position.x = enemy.position.x;
        superAttackEnemy.position.y = enemy.position.y;

        superAttackEnemy.attackBox.position.x = superAttackEnemy.position - superAttackEnemy.attackBox.offset
        superAttackEnemy.attackBox.position.y = superAttackEnemy.position - superAttackEnemy.attackBox.offset

        enemy.superCount++;
    }

    superAttackEnemy.update();

    if(
        rectangularCollision({
            rectangle1: superAttackPlayer,
            rectangle2: enemy
        })
        ){
        enemy.takeHit();

        gsap.to('#enemyHealth', {
            width: (enemy.health/enemy.startingHealth )* 100 + '%'
        })
    }

    if(
        rectangularCollision({
            rectangle1: superAttackEnemy,
            rectangle2: player
        })
        ){
        player.takeHit();

        gsap.to('#playerHealth', {
            width: (player.health/player.startingHealth )* 100 + '%'
        })
    }

    
}

animate();

window.addEventListener('keydown', (e) => {
    if(!player.dead){
    switch(e.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey ='d';
        break
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break
        case 'w':
            if(player.position.y === 330){
                player.velocity.y = -20;
            }
        break
        case 's':
            player.attack()
        break
        case 'e':
            player.superAttack();
        break
    }
    }

    if(!enemy.dead){
    switch(e.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey ='ArrowRight';
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey ='ArrowLeft';
        break
        case 'ArrowUp':
            if(enemy.position.y === 330){
                enemy.velocity.y = -20;
            }
        break
        case 'ArrowDown':
            enemy.attack()
        break
        case '#':
            enemy.superAttack();
        break
    }
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key){
        //player
        case 'd':
            keys.d.pressed = false;
        break
        case 'a':
            keys.a.pressed = false;
        break
        case 'w':
            keys.w.pressed = false;
        break

        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
        break

    }
})