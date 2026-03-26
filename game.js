const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//fixing the blurry-ness of the text on larger screens with more pixels to display

const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = "800px";
canvas.style.height = "600px";
ctx.scale(dpr, dpr);

let gameOver = false;
let winner = "";
let ball_x = 400;
let ball_y = 300;
let ball_vx = 240;
let ball_vy = 240;
let left_y = 300;
let right_y = 300;
let left_score = 0;
let right_score = 0;
let prev_ball_x = ball_x;
let prev_left_y = left_y;
let prev_right_y = right_y;
let left_paddle_vy = left_y - prev_left_y;
let right_paddle_vy = right_y - prev_right_y;
let lastTime = 0;                               //added to fix the "everything getting faster on displays with more refresh rate" problem

let gameState = 'menu';
// let gameType = 'singleplayer'

//event
let keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (gameState == 'over' && e.key == 'r') {

        //reset everything
        left_score = 0;
        right_score = 0;

        ball_x = 400;
        ball_y = 300;
        ball_vx = 240;
        ball_vy = 240;

        left_y = 300;
        right_y = 300;

        gameState = 'menu';
        winner = "";
    }
    if (gameState == 'menu' && e.key == 'Enter') {
        gameState = "open";
    }

    if (gameState == 'menu' && e.key == 's') {
        gameState = "open";
        gameType = "singlePlayer";
    }

    if (gameState == 'menu' && e.key == 'm') {
        gameState = "open";
        gameType = "multiPlayer";
    }

})

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
})

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * (800 / rect.width);
    let y = (e.clientY - rect.top) * (600 / rect.height);

    if (gameState === "menu") {
        if (x > 250 && x < 550 && y > 370 && y < 430) {
            gameType = "singlePlayer";
            gameState = "open";
        }

        if (x > 250 && x < 550 && y > 420 && y < 480) {
            gameType = "multiPlayer";
            gameState = "open";
        }
    }
    if (gameState === "over") {
        if (x > 250 && x < 550 && y > 370 && y < 430) {

            left_score = 0;
            right_score = 0;

            ball_x = 400;
            ball_y = 300;
            ball_vx = 240;
            ball_vy = 240;

            left_y = 300;
            right_y = 300;

            gameState = "menu";
            winner = "";
        }
    }
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    let x = (touch.clientX - rect.left) * (800 / rect.width);
    let y = (touch.clientY - rect.top) * (600 / rect.height);
    //menu area
    if (gameState === "menu") {
        if (x > 250 && x < 550 && y > 370 && y < 430) {
            gameType = "singlePlayer";
            gameState = "open";
        }

        if (x > 250 && x < 550 && y > 420 && y < 480) {
            gameType = "multiPlayer";
            gameState = "open";
        }
    }

    //last gameover screen
    if (gameState === "over") {
        if (x > 250 && x < 550 && y > 370 && y < 430) {

            left_score = 0;
            right_score = 0;

            ball_x = 400;
            ball_y = 300;
            ball_vx = 240;
            ball_vy = 240;
            left_y = 300;
            right_y = 300;

            gameState = "menu";
            winner = "";
        }
    }
    if (x < (rect.width * (800 / rect.width) / 2)) {
        // center paddle on finger
        left_y = y - 40; // 40 = half paddle height
        if (left_y < 0) left_y = 0;
        if (left_y > 520) left_y = 520;
    }
    if (x > (rect.width * (800 / rect.width) / 2)) {
        right_y = y - 40
        if (right_y < 0) right_y = 0;
        if (right_y > 520) right_y = 520
    }
})

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    let x = (touch.clientX - rect.left) * (800 / rect.width);
    let y = (touch.clientY - rect.top) * (600 / rect.height);
    if (x < (rect.width * (800 / rect.width) / 2)) {
        // center paddle on finger
        left_y = y - 40; // 40 = half paddle height
        if (left_y < 0) left_y = 0;
        if (left_y > 520) left_y = 520;
    }
    if (x > (rect.width * (800 / rect.width) / 2)) {
        right_y = y - 40
        if (right_y < 0) right_y = 0;
        if (right_y > 520) right_y = 520
    }

})



function gameloop(timestamp) {
    //to fix the framerate issue
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    //update
    if (gameState == "open") {                //checks if either of the player has won and only continues the the game function if it hasn't
        prev_ball_x = ball_x;
        prev_left_y = left_y;
        prev_right_y = right_y;
        ball_x += ball_vx * dt;
        ball_y += ball_vy * dt;
        if (keys['w'] && left_y > 0) left_y -= 360 * dt;
        if (keys['s'] && left_y < 520) left_y += 360 * dt;
        if (gameType == "multiPlayer") {
            if (keys["ArrowUp"] && right_y > 0) right_y -= 360 * dt;
            if (keys["ArrowDown"] && right_y < 520) right_y += 360 * dt;
        }

        left_paddle_vy = left_y - prev_left_y;
        right_paddle_vy = right_y - prev_right_y;

        //boundary conditions
        if (ball_x <= 5) {
            right_score += 1
            ball_x = 400
            ball_y = 300
            const options = [-180, -120, -60, 60, 120, 180];
            ball_vy = options[Math.floor(Math.random() * options.length)];
            ball_vx = 240
        }
        if (ball_x >= 795) {
            left_score += 1;
            ball_x = 400;
            ball_y = 300;

            const options = [-180, -120, -60, 60, 120, 180];
            ball_vy = options[Math.floor(Math.random() * options.length)];
            ball_vx = -240;
        }

        if (ball_y <= 5) {
            ball_y = 5;
            ball_vy *= -1;
        }
        if (ball_y >= 595) {
            ball_y = 595;
            ball_vy *= -1;
        }

        //paddle collisins

        if (
            prev_ball_x >= 42 && ball_x <= 42 && (ball_y > left_y - 10 && ball_y < left_y + 90)
        ) {
            ball_x = 42;
            ball_vx *= -1.2;
            if (Math.abs(ball_vx) > 1200) {
                ball_vx = ball_vx > 0 ? 1200 : -1200;
            }
            ball_vy += left_paddle_vy * 0.5;
            if (Math.abs(ball_vy) < 120) {
                ball_vy = ball_vy >= 0 ? 600 : -600;
            }
        }
        if (
            prev_ball_x <= 758 && ball_x >= 758 && (ball_y > right_y - 10 && ball_y < right_y + 90)
        ) {
            ball_x = 758;
            ball_vx *= -1.2;
            if (Math.abs(ball_vx) > 1200) {
                ball_vx = ball_vx > 0 ? 1200 : -1200;
            }
            ball_vy += right_paddle_vy * 0.5;
            if (Math.abs(ball_vy) < 120) {
                ball_vy = ball_vy >= 0 ? 600 : -600;
            }
        }

        if (
            gameType == "singlePlayer"
        ) {
            let x = Math.floor(Math.random() * 10) + 1;
            if ((ball_y < (right_y + 40)) && (right_y > 0)) {
                if (x < 10) {
                    right_y -= 360 * dt;
                }
            }
            if ((ball_y > right_y + 40) && (right_y < 520)) {
                if (x < 10) {
                    right_y += 360 * dt;
                }
            }
        }


        //detect winner
        if (left_score === 3) {
            gameState = 'over';
            winner = "LEFT WINS";
        }

        if (right_score === 3) {
            gameState = 'over';
            winner = "RIGHT WINS";
        }
    }

    //draw the background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 600);

    //draw the ball
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball_x, ball_y, 5, 0, Math.PI * 2)
    ctx.fill()

    //draw the paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(30, left_y, 12, 80);

    ctx.fillStyle = 'white';
    ctx.fillRect(758, right_y, 12, 80);

    ctx.fillStyle = "white";
    ctx.font = "48px monospace";
    ctx.textAlign = "center";
    ctx.fillText(left_score, 300, 50);
    ctx.fillText(right_score, 500, 50);

    //menu screen
    if (gameState === "menu") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = "white";
        ctx.font = "64px monospace";
        ctx.textAlign = "center";
        ctx.fillText("PONG", 400, 200);

        // ctx.font = "32px monospace";
        // ctx.fillText("Press Enter to Start", 400, 350);

        ctx.font = "32px monospace";
        ctx.fillText("SinglePlayer 's'", 400, 400);

        ctx.font = "32px monospace";
        ctx.fillText("Multiplayer 'm'", 400, 450);
    }

    //game over screen
    if (gameState == 'over') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = "white";
        ctx.font = "64px monospace";
        ctx.textAlign = "center";
        ctx.font = "24px monospace";
        ctx.fillText(winner, 400, 300);
        ctx.fillText("Press R to restart", 400, 400);
        ctx.fillText("Press E to quit", 400, 500)
    }

    requestAnimationFrame(gameloop);
}

gameloop();