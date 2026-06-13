const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;

const player = {
    x: 450,
    y: 300,
    size: 25,
    speed: 5
};

const keys = {};

document.addEventListener("keydown", e=>{
    keys[e.key]=true;
});

document.addEventListener("keyup", e=>{
    keys[e.key]=false;
});

let enemies = [];
let orbs = [];

function spawnEnemy(){
    enemies.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        size:20,
        speed:1+Math.random()*2
    });
}

function spawnOrb(){
    orbs.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        size:12
    });
}

for(let i=0;i<5;i++){
    spawnEnemy();
}

for(let i=0;i<10;i++){
    spawnOrb();
}

function update(){

    if(keys["w"]||keys["ArrowUp"]) player.y-=player.speed;
    if(keys["s"]||keys["ArrowDown"]) player.y+=player.speed;
    if(keys["a"]||keys["ArrowLeft"]) player.x-=player.speed;
    if(keys["d"]||keys["ArrowRight"]) player.x+=player.speed;

    player.x=Math.max(0,Math.min(canvas.width-player.size,player.x));
    player.y=Math.max(0,Math.min(canvas.height-player.size,player.y));

    enemies.forEach(enemy=>{

        let dx=player.x-enemy.x;
        let dy=player.y-enemy.y;
        let dist=Math.sqrt(dx*dx+dy*dy);

        enemy.x+=dx/dist*enemy.speed;
        enemy.y+=dy/dist*enemy.speed;

        if(dist<player.size+enemy.size){
            alert("Game Over!\nScore: "+score);
            location.reload();
        }
    });

    for(let i=orbs.length-1;i>=0;i--){

        let dx=player.x-orbs[i].x;
        let dy=player.y-orbs[i].y;
        let dist=Math.sqrt(dx*dx+dy*dy);

        if(dist<player.size+orbs[i].size){
            score++;
            document.getElementById("score").innerText=score;
            orbs.splice(i,1);
            spawnOrb();

            if(score%5===0){
                spawnEnemy();
            }
        }
    }
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Player
    ctx.fillStyle="#00eaff";
    ctx.shadowBlur=25;
    ctx.shadowColor="#00eaff";
    ctx.fillRect(player.x,player.y,player.size,player.size);

    // Enemies
    enemies.forEach(enemy=>{
        ctx.fillStyle="red";
        ctx.shadowBlur=20;
        ctx.shadowColor="red";
        ctx.fillRect(enemy.x,enemy.y,enemy.size,enemy.size);
    });

    // Orbs
    orbs.forEach(orb=>{
        ctx.beginPath();
        ctx.fillStyle="lime";
        ctx.shadowBlur=15;
        ctx.shadowColor="lime";
        ctx.arc(orb.x,orb.y,orb.size,0,Math.PI*2);
        ctx.fill();
    });

}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
