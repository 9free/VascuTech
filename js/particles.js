/* VascuTech Medical Limited — hero particle field.
   Dots and connecting lines drift gently across the hero, colored from the
   brand gradient (crimson -> mauve -> indigo) at low, "70% transparent" opacity
   so the effect reads as texture, not decoration competing with the copy. */
(function () {
  "use strict";

  var canvas = document.getElementById("particles-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var PALETTE = ["#9C2B45", "#77396C", "#3E4E78"]; // brand gradient stops
  var DOT_ALPHA = 0.3;   // ~70% transparent
  var LINE_ALPHA = 0.14;
  var LINK_DIST = 130;
  var DENSITY = 16000;   // px^2 per particle
  var MAX_PARTICLES = 70;

  function hexToRgb(hex) {
    var v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  var RGB = PALETTE.map(hexToRgb);

  var w, h, particles;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(MAX_PARTICLES, Math.round((w * h) / DENSITY));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.4 + Math.random() * 1.8,
        c: RGB[i % RGB.length],
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    if (!reduceMotion) {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }
    }

    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var p1 = particles[a], p2 = particles[b];
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          var alpha = LINE_ALPHA * (1 - dist / LINK_DIST);
          ctx.strokeStyle = "rgba(" + p1.c[0] + "," + p1.c[1] + "," + p1.c[2] + "," + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    for (var i2 = 0; i2 < particles.length; i2++) {
      var p3 = particles[i2];
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + p3.c[0] + "," + p3.c[1] + "," + p3.c[2] + "," + DOT_ALPHA + ")";
      ctx.arc(p3.x, p3.y, p3.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
})();
