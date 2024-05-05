export function startFireworks() {
  let canvas,
    ctx,
    w,
    h,
    particles = [],
    probability = 0.15,
    xPoint,
    yPoint;

  function init() {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.id = "fireworksCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
    window.requestAnimationFrame(updateWorld);
  }

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
  }

  function update() {
    if (particles.length < 1000 && Math.random() < probability) {
      createFirework();
    }
    particles = particles.filter((particle) => particle.move());
  }

  function paint() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((particle) => particle.draw(ctx));
  }

  function createFirework() {
    xPoint = Math.random() * w;
    yPoint = Math.random() * h;
    const nFire = Math.random() * 150 + 200; // More particles per firework
    const colors = [
      "rgb(255,0,0)",
      "rgb(0,255,0)",
      "rgb(0,0,255)",
      "rgb(255,255,0)",
      "rgb(0,255,255)",
      "rgb(255,0,255)",
      "rgb(255,165,0)",
      "rgb(255,255,255)",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angleIncrement = (Math.PI * 2) / nFire;

    for (let i = 0; i < nFire; i++) {
      let angle = i * angleIncrement;
      let speed = Math.random() * 5 + 2; // Random speed for each particle
      let vx = Math.cos(angle) * speed;
      let vy = Math.sin(angle) * speed;
      particles.push(new Particle(xPoint, yPoint, vx, vy, color));
    }
  }

  function Particle(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = Math.random() * 4 + 1;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.color = color;

    this.move = function () {
      this.vx *= 0.99; // Slow down by air resistance
      this.vy += 0.05; // Gravity effect
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.01; // Fade out
      return (
        this.x > -this.size &&
        this.x < w + this.size &&
        this.y < h + this.size &&
        this.alpha > 0
      );
    };

    this.draw = function (c) {
      c.save();
      c.fillStyle = this.color;
      c.globalAlpha = this.alpha;
      c.beginPath();
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      c.fill();
      c.restore();
    };
  }

  init(); // Start the fireworks
}
