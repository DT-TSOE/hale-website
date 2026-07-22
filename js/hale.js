/* Hale — progressive enhancement + generative canvas backgrounds. */
(function () {
  "use strict";

  var header = document.getElementById("header");
  var toggle = document.getElementById("navToggle");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (window.scrollY > 24) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.querySelectorAll("#mobileMenu a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Dropdown triggers: reflect open state for assistive tech */
  document.querySelectorAll(".has-menu").forEach(function (li) {
    var trigger = li.querySelector("a[aria-expanded]");
    if (!trigger) return;
    function set(state) { trigger.setAttribute("aria-expanded", state ? "true" : "false"); }
    li.addEventListener("mouseenter", function () { set(true); });
    li.addEventListener("mouseleave", function () { set(false); });
    li.addEventListener("focusin", function () { set(true); });
    li.addEventListener("focusout", function (e) {
      if (!li.contains(e.relatedTarget)) set(false);
    });
  });

  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--i", i);
    });
  });

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-marquee]").forEach(function (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  /* ---- Generative canvas backgrounds ---- */
  var GOLD = [211, 166, 69], BONE = [245, 245, 245];

  function initFx(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var type = canvas.dataset.fx || "particles";
    var colorMode = canvas.dataset.color || "mix";
    var density = parseFloat(canvas.dataset.density || "1");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, items = [], raf = null, running = false;

    function colFor(mode) {
      if (mode === "gold") return GOLD;
      if (mode === "bone") return BONE;
      return Math.random() < 0.32 ? GOLD : BONE;
    }

    function build() {
      items = [];
      var area = W * H;
      if (type === "network") {
        var n = Math.max(10, Math.min(52, Math.round(area / 24000 * density)));
        for (var i = 0; i < n; i++) items.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.8, gold: Math.random() < 0.25
        });
      } else if (type === "glitter") {
        var g = Math.max(14, Math.min(90, Math.round(area / 9000 * density)));
        for (var j = 0; j < g; j++) items.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.3 + 0.3, tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.03 + 0.008, light: Math.random() < 0.6
        });
      } else if (type === "orbs") {
        var o = Math.max(22, Math.min(72, Math.round(area / 26000 * density)));
        for (var m = 0; m < o; m++) items.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 20 + Math.random() * 50,
          sy: 0.2 + Math.random() * 0.5, sx: (Math.random() - 0.5) * 0.3,
          drift: Math.random() * Math.PI * 2, ds: 0.003 + Math.random() * 0.005,
          base: 0.3 + Math.random() * 0.4,
          ps: 0.5 + Math.random() * 1.5, po: Math.random() * Math.PI * 2
        });
      } else {
        var p = Math.max(20, Math.min(130, Math.round(area / 14000 * density)));
        for (var k = 0; k < p; k++) items.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.5, col: colFor(colorMode),
          a: Math.random() * 0.5 + 0.15, tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.014 + 0.004,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12
        });
      }
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      if (W === 0 || H === 0) return;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }

    function wrap(d) {
      if (d.x < -6) d.x = W + 6; if (d.x > W + 6) d.x = -6;
      if (d.y < -6) d.y = H + 6; if (d.y > H + 6) d.y = -6;
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, d, col;
      if (type === "network") {
        var D = 130;
        for (i = 0; i < items.length; i++) { d = items[i]; d.x += d.vx; d.y += d.vy; wrap(d); }
        for (i = 0; i < items.length; i++) {
          for (var jj = i + 1; jj < items.length; jj++) {
            var a = items[i], b = items[jj];
            var dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < D) {
              ctx.strokeStyle = "rgba(245,245,245," + (1 - dist / D) * 0.28 + ")";
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (i = 0; i < items.length; i++) {
          d = items[i]; col = d.gold ? GOLD : BONE;
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.7)";
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
        }
      } else if (type === "glitter") {
        for (i = 0; i < items.length; i++) {
          d = items[i]; d.tw += d.tws;
          var pulse = (Math.sin(d.tw) + 1) / 2;
          col = d.light ? [255, 250, 240] : [120, 85, 30];
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.12 + 0.55 * pulse) + ")";
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r * (0.6 + 0.8 * pulse), 0, Math.PI * 2); ctx.fill();
        }
      } else if (type === "orbs") {
        ctx.globalCompositeOperation = "lighter";
        var ts = performance.now() / 1000;
        for (i = 0; i < items.length; i++) {
          d = items[i];
          d.y -= d.sy; d.x += d.sx + Math.sin(d.drift) * 0.2; d.drift += d.ds;
          if (d.y < -d.r) { d.y = H + d.r; d.x = Math.random() * W; }
          if (d.x < -d.r) d.x = W + d.r; if (d.x > W + d.r) d.x = -d.r;
          var opl = 0.6 + 0.4 * Math.sin(ts * d.ps + d.po);
          var fade = Math.max(0, 1 - Math.abs(d.y - H / 2) / (H * 0.62));
          var op = d.base * opl * fade;
          if (op <= 0.012) continue;
          var og = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
          og.addColorStop(0, "rgba(245,200,110," + op + ")");
          og.addColorStop(0.2, "rgba(212,168,71," + (op * 0.8) + ")");
          og.addColorStop(0.5, "rgba(212,168,71," + (op * 0.25) + ")");
          og.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = og;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      } else {
        for (i = 0; i < items.length; i++) {
          d = items[i]; d.tw += d.tws;
          var pl = (Math.sin(d.tw) + 1) / 2;
          d.x += d.vx; d.y += d.vy; wrap(d);
          var alpha = d.a * (0.4 + 0.6 * pl), rad = d.r * (0.85 + 0.4 * pl);
          var grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, rad * 6);
          grad.addColorStop(0, "rgba(" + d.col[0] + "," + d.col[1] + "," + d.col[2] + "," + alpha + ")");
          grad.addColorStop(1, "rgba(" + d.col[0] + "," + d.col[1] + "," + d.col[2] + ",0)");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(d.x, d.y, rad * 6, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      if (type === "orbs") {
        ctx.globalCompositeOperation = "lighter";
        for (var o = 0; o < items.length; o++) {
          var e = items[o];
          var f = Math.max(0, 1 - Math.abs(e.y - H / 2) / (H * 0.62)) * e.base * 0.6;
          if (f <= 0.02) continue;
          var sg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
          sg.addColorStop(0, "rgba(245,200,110," + f + ")");
          sg.addColorStop(0.5, "rgba(212,168,71," + (f * 0.25) + ")");
          sg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = sg;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        return;
      }
      for (var i = 0; i < items.length; i++) {
        var d = items[i], col = d.col || (d.gold ? GOLD : BONE);
        if (type === "glitter") col = d.light ? [255, 250, 240] : [120, 85, 30];
        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (d.a || 0.4) + ")";
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    resize();
    if (W === 0) return;
    if (reduce) drawStatic(); else { running = true; frame(); }

    if ("IntersectionObserver" in window && !reduce) {
      var vis = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; frame(); }
          else if (!e.isIntersecting && running) { running = false; if (raf) cancelAnimationFrame(raf); }
        });
      }, { rootMargin: "100px" });
      vis.observe(canvas);
    }

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); if (reduce) drawStatic(); }, 200);
    }, { passive: true });
  }

  document.querySelectorAll("canvas.fx-bg").forEach(initFx);
})();
