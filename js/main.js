/* VascuTech Medical Limited — shared site behaviour:
   nav dropdown menus (hover on desktop, tap-to-toggle on touch)
   and a fade transition between pages. */
(function () {
  "use strict";

  /* ---- Fade in on load ----
     The body's initial opacity:0 is already committed by the time this script
     runs (it's set in the stylesheet, parsed before this script tag), so simply
     adding the class here is enough to trigger the CSS transition — no need for
     requestAnimationFrame, which can be throttled or skipped in background tabs. */
  function markLoaded() {
    document.body.classList.add("page-loaded");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markLoaded);
  } else {
    markLoaded();
  }

  /* ---- Dropdown menus: tap-to-toggle for touch devices ---- */
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".nav-item-dropdown"));
  var isTouch = window.matchMedia("(hover: none)").matches;

  if (isTouch) {
    dropdowns.forEach(function (dd) {
      var trigger = dd.querySelector(".dropdown-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function (e) {
        if (!dd.classList.contains("open")) {
          e.preventDefault();
          dropdowns.forEach(function (o) { o.classList.remove("open"); });
          dd.classList.add("open");
        }
      });
    });
    document.addEventListener("click", function (e) {
      dropdowns.forEach(function (dd) {
        if (!dd.contains(e.target)) dd.classList.remove("open");
      });
    });
  }

  /* ---- Fade-out transition on internal navigation ---- */
  var TRANSITION_MS = 380;

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    var link = e.target.closest("a");
    if (!link) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;

    var url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return;

    e.preventDefault();
    document.body.classList.remove("page-loaded");
    document.body.classList.add("page-leaving");
    window.setTimeout(function () {
      window.location.href = url.href;
    }, TRANSITION_MS);
  });
})();
