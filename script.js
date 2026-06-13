window.onload = function () {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameOver = false;

const player = { x: 400, y: 250, s: 20, sp: 4 };

const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let enemies = [];
let orbs = [];

function rand(min,max){
    return Math.random()*(max-min)+min;
}

function spawnEnemy(){
    enemies.push({x:rand(0,800),y:rand(0,500),s:18,sp:1.2});
}

function spawnOrb(){
    orbs.push({x:rand(0,800),y:rand(0,500),s:10});
}

for(let i=0;i<3;i++) spawnEnemy();
for(let i=0;i<6;i++) spawnOrb();

function update(){
    if(gameOver) return;

    if(keys["w"]||keys["arrowup"]) player.y -= player.sp;
    if(keys["s"]||keys["arrowdown"]) player.y += player.sp;
    if(keys["a"]||keys["arrowleft"]) player.x -= player.sp;
    if(keys["d"]||keys["arrowright"]) player.x += player.sp;

    player.x = Math.max(0,Math.min(800-player.s,player.x));
    player.y = Math.max(0,Math.min(500-player.s,player.y));

    for(let e of enemies){
        let dx = player.x - e.x;
        let dy = player.y - e.y;
        let d = Math.hypot(dx,dy);

        if(d > 0){
            e.x += dx/d * e.sp;
            e.y += dy/d * e.sp;
        }

        if(d < player.s){
            gameOver = true;
            document.getElementById("over").style.display = "block";
        }
    }

    for(let i=orbs.length-1;i>=0;i--){
        let dx = player.x - orbs[i].x;
        let dy = player.y - orbs[i].y;
        let d = Math.hypot(dx,dy);

        if(d < player.s){
            score++;
            document.getElementById("score").innerText = score;
            orbs.splice(i,1);
            spawnOrb();
        }
    }
}

function draw(){
    ctx.clearRect(0,0,800,500);

    ctx.fillStyle="cyan";
    ctx.fillRect(player.x,player.y,player.s,player.s);

    ctx.fillStyle="red";
    enemies.forEach(e=>ctx.fillRect(e.x,e.y,e.s,e.s));

    ctx.fillStyle="lime";
    orbs.forEach(o=>{
        ctx.beginPath();
        ctx.arc(o.x,o.y,o.s,0,Math.PI*2);
        ctx.fill();
    });
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

};
