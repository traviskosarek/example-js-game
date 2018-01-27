var canvas;
var canvasContext;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

var leftPaddleX;
var leftPaddleY;

var rightPaddleX;
var rightPaddleY;

var rightPaddleSpeed;

const BALL_RADIUS = 12;
var ballX;
var ballY;
var ballSpeedX;
var ballSpeedY;

var leftScore;
var rightScore;

const NET_WIDTH = 2;
const NET_HEIGHT = 20;

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    init();

    resetBall();
    var framesPerSecond = 1000 / 30;
    setInterval(update, framesPerSecond);

    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = calculateMousePosition(evt);
        leftPaddleY = mousePos.y - (PADDLE_HEIGHT / 2);
    })
}

function init() {
    leftPaddleX = 10;
    leftPaddleY = (canvas.height / 2) - (PADDLE_HEIGHT / 2);

    resetRightPaddle();

    leftScore = 0;
    rightScore = 0;
}

function update() {
    moveEverything();
    drawEverything();
}

function calculateMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function moveEverything() {
    moveBall();
    moveRightPaddle();
}

function moveBall() {
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    // if ball hits left paddle
    if (ballX - BALL_RADIUS <= leftPaddleX + PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= leftPaddleY &&
        ballY - BALL_RADIUS <= leftPaddleY + PADDLE_HEIGHT) {

        ballSpeedX = -1 * ballSpeedX;

        var deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
    }

    // if ball hits right paddle
    else if (ballX + BALL_RADIUS >= rightPaddleX &&
        ballY + BALL_RADIUS >= rightPaddleY &&
        ballY - BALL_RADIUS <= rightPaddleY + PADDLE_HEIGHT) {

        ballSpeedX = -1 * ballSpeedX;

        var deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
    }

    // if ball hits the top or bottom of the screen, bounce
    else if (ballY - BALL_RADIUS <= 0 || ballY + BALL_RADIUS >= canvas.height) {
        ballSpeedY = -1 * ballSpeedY;
    }

    // if ball is out of bounds on the right side
    if (ballX + BALL_RADIUS >= canvas.width) {
        leftScore += 10;
        resetBall();
        resetRightPaddle();
    }

    // if ball is out of bounds on the left side
    else if (ballX - BALL_RADIUS <= 0) {
        rightScore += 10;
        resetBall();
        resetRightPaddle();
    }
}

function moveRightPaddle() {
    var rightPaddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;

    if (ballY > rightPaddleCenter + PADDLE_HEIGHT * 0.25) {
        rightPaddleY += rightPaddleSpeed;
    } else if (ballY < rightPaddleCenter - PADDLE_HEIGHT * 0.25) {
        rightPaddleY -= rightPaddleSpeed;
    }
}

function resetRightPaddle() {
    rightPaddleX = canvas.width - PADDLE_WIDTH - 10;
    rightPaddleY = (canvas.height / 2) - (PADDLE_HEIGHT / 2);
    rightPaddleSpeed = 12;
}

function resetBall() {
    ballX = (canvas.width / 2) - (BALL_RADIUS / 2);
    ballY = (canvas.height / 2) - (BALL_RADIUS / 2);
    ballSpeedX = 8;
    ballSpeedY = 8;
}

function drawEverything() {
    drawBackground();
    drawNet();
    drawScores();
    drawLeftPaddle();
    drawRightPaddle();
    drawBall();
}

function drawBackground() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
}

function drawNet() {
    for (i = NET_HEIGHT / 2; i < canvas.height; i += NET_HEIGHT * 2) {
        drawRect(canvas.width / 2 - NET_WIDTH / 2, i, NET_WIDTH, NET_HEIGHT, "white");
    }
}

function drawScores() {
    drawText(100, 100, "Your Score: " + leftScore);
    drawText(canvas.width - 275, 100, "Computer Score: " + rightScore);
}

function drawBall() {
    drawCircle(ballX, ballY, BALL_RADIUS, "white");
}

function drawLeftPaddle() {
    drawRect(leftPaddleX, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
}

function drawRightPaddle() {
    drawRect(rightPaddleX, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
}

function drawRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function drawCircle(x, y, width, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, width, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function drawText(x, y, text) {
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(text, x, y);
}