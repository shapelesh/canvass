const myCanvas = document.querySelector("#playground");
const ctx = myCanvas.getContext("2d");

let globalGameData = {
  firstLoop: true,
  lastTime: 0,
  circles: [],
  mousePosition: {
    x: 0,
    y: 0,
  },
};

class Circle {
  constructor(id, posX, posY, radius, color) {
    this.id = id;
    this.x = posX;
    this.y = posY;
    this.r = radius;
    this.color = color;
    this.distanceToMouse = 999;
  }

  getMouseDistance() {
    const distance = Math.floor(
      Math.sqrt(
        Math.pow(this.x - globalGameData.mousePosition.x, 2) +
          Math.pow(this.y - globalGameData.mousePosition.y, 2)
      )
    );
    return distance;
  }
  checkMouseDirection() {
    // check if mouse is close (less than 50px)
    this.distanceToMouse = this.getMouseDistance(
      globalGameData.mousePosition.x,
      globalGameData.mousePosition.y
    );

    if (this.distanceToMouse < 100) {
      console.log(`Circle number: ${this.id}: `);
      if (globalGameData.mousePosition.x - this.x > 0) {
        this.x = this.x - 1;
      }
      if (globalGameData.mousePosition.x - this.x < 0) {
        this.x = this.x + 1;
      }
      if (globalGameData.mousePosition.y - this.y > 0) {
        this.y = this.y - 1;
      }
      if (globalGameData.mousePosition.y - this.y < 0) {
        this.y = this.y + 1;
      }
    }
  }
}

function gameLoop(timestamp) {
  let dTime = timestamp - globalGameData.lastTime;
  if (globalGameData.firstLoop) {
    initCircles(1000);
    myCanvas.addEventListener("mousemove", (e) => {
      globalGameData.mousePosition.x =
        e.clientX - myCanvas.getBoundingClientRect().left;
      globalGameData.mousePosition.y =
        e.clientY - myCanvas.getBoundingClientRect().top;
    });
    globalGameData.firstLoop = false;
  }

  globalGameData.lastTime = timestamp;

  update(dTime);
  render();

  requestAnimationFrame(gameLoop);
}

function update(dTime) {
  globalGameData.circles.forEach((circle) => {
    circle.checkMouseDirection(
      globalGameData.mousePosition.x,
      globalGameData.mousePosition.y
    );
  });
}
function render() {
  drawCircles(globalGameData.circles);
}
function initCircles(numberOfCircles) {
  let colors = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];

  for (let i = 0; i < numberOfCircles; i++) {
    // circle posX, posY, radius, color
    globalGameData.circles[i] = new Circle(
      i,
      randomNumber(500),
      randomNumber(500),
      30,
      colors[randomNumber(5)]
    );
  }
}

function randomNumber(max, min = 0) {
  return Math.floor(Math.random() * max) + min;
}

function getMousePosition(e) {}

function drawCircles(circles) {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  circles.forEach((circle) => {
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = circle.color;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, 30, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  });
}

requestAnimationFrame(gameLoop);
