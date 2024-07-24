const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    size: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw() {
        ctx.fillStyle = '#FF0';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.size > canvas.height || this.y < 0) {
            this.y = Math.min(Math.max(this.y, 0), canvas.height - this.size);
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    }
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 120;
let score = 0;

function drawPipes() {
    ctx.fillStyle = '#0F0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const top = Math.random() * (canvas.height - pipeGap);
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x === bird.x) {
            score++;
        }
    });
    if (pipes[0] && pipes[0].x + pipeWidth < 0) pipes.shift();
}

function checkCollision() {
    return pipes.some(pipe =>
        bird.x < pipe.x + pipeWidth &&
        bird.x + bird.size > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.size > canvas.height - pipe.bottom)
    );
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    drawPipes();
    drawScore();
}
 
function update() {
    bird.update();
    updatePipes();
    if (checkCollision()) {
        alert('Game Over\nYour Score: ' + score);
        resetGame();
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => bird.flap());
resetGame();
gameLoop();
