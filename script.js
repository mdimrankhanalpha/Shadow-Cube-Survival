const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score, running, player, enemies, orbs;

const keys = {};

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function resetGame(){
    score = 0;
    running = true;

    player = { x: 400, y: 250, size: 20, speed: 4 };

    enemies = [];
    orbs = [];

    for(let i=0;i<4;i++) spawnEnemy();
    for(let i=0;i<8;i++) spawnOrb();

    document.getElementById("score").innerText = score;
    document.getElementById("gameOverBox").style.display = "none";
}

function rand(min,max){
    return Math.random()*(max-min)+min;
}

function spawnEnemy(){
    enemies.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        size: 18,
        speed: 1.2
    });
}

function spawnOrb(){
    orbs.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        size: 10
    });
}

function gameOver(){
    running = false;
    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("gameOverBox").style.display = "block";
}

function restartGame(){
    resetGame();
}

function update(){
    if(!running) return;

    if(keys["w"]||keys["arrowup"]) player.y -= player.speed;
    if(keys["s"]||keys["arrowdown"]) player.y += player.speed;
    if(keys["a"]||keys["arrowleft"]) player.x -= player.speed;
    if(keys["d"]||keys["arrowright"]) player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width-player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height-player.size, player.y));

    for(let e of enemies){
        let dx = player.x - e.x;
        let dy = player.y - e.y;
        let dist = Math.hypot(dx,dy);

        if(dist > 1){
            e.x += dx/dist * e.speed;
            e.y += dy/dist * e.speed;
        }

        if(dist < player.size){
            gameOver();
        }
    }

    for(let i=orbs.length-1;i>=0;i--){
        let dx = player.x - orbs[i].x;
        let dy = player.y - orbs[i].y;
        let dist = Math.hypot(dx,dy);

        if(dist < player.size){
            score++;
            document.getElementById("score").innerText = score;
            orbs.splice(i,1);
            spawnOrb();

            if(score % 4 === 0) spawnEnemy();
        }
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#00eaff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x,e.y,e.size,e.size));

    ctx.fillStyle = "lime";
    orbs.forEach(o=>{
        ctx.beginPath();
        ctx.arc(o.x,o.y,o.size,0,Math.PI*2);
        ctx.fill();
    });
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

// START GAME
resetGame();
loop();
