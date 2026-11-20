/* ===== Portfolio scripts: one file, no libraries ===== */
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return document.querySelectorAll(s); };

  // 1. Automatic copyright year
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // 2. Greeting based on time of day (conditions)
  var greet = $("#greet");
  if (greet) {
    var h = new Date().getHours();
    greet.textContent = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }

  // 3. Typing / rotating tagline (array + timer)
  var typed = $("#typed");
  if (typed) {
    var words = ["Engineering Technology Student", "Web Developer", "Systems Thinker"];
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      c += del ? -1 : 1;
      typed.textContent = word.slice(0, c);
      var wait = del ? 40 : 90;
      if (!del && c === word.length) { del = true; wait = 1400; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      setTimeout(tick, wait);
    })();
  }

  // 4. Hamburger menu
  var menuBtn = $("#menuBtn"), links = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  // 5. Dark / light mode toggle (remembered in the browser)
  var root = document.documentElement;
  if (localStorage.getItem("theme") === "dark") root.setAttribute("data-theme", "dark");
  $("#themeBtn").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", dark ? "light" : "dark");
  });

  // 6. Scroll-to-top button
  var top = $("#toTop");
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 300); });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // 7. "Read more" toggle (About page)
  var moreBtn = $("#moreBtn");
  if (moreBtn) moreBtn.addEventListener("click", function () {
    var hidden = $("#more").classList.toggle("hidden");
    moreBtn.textContent = hidden ? "Read more" : "Read less";
    moreBtn.setAttribute("aria-expanded", !hidden);
  });

  // 8. Skill tabs + animated skill bars (Skills page)
  function fillBars() {
    $$(".panel:not(.hidden) .bar i").forEach(function (b) { b.style.width = b.dataset.level + "%"; });
  }
  $$(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".tab").forEach(function (t) { t.classList.remove("active"); });
      $$(".panel").forEach(function (p) { p.classList.add("hidden"); });
      $$(".bar i").forEach(function (b) { b.style.width = 0; });
      tab.classList.add("active");
      $("#" + tab.dataset.tab).classList.remove("hidden");
      setTimeout(fillBars, 50);
    });
  });
  setTimeout(fillBars, 200);

  // 9. Project filter (Projects page)
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      $$(".proj").forEach(function (card) {
        var show = chip.dataset.filter === "all" || card.dataset.cat === chip.dataset.filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // 10. Project details modal
  var modal = $("#modal");
  if (modal) {
    $$(".open-modal").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".proj");
        $("#mTitle").textContent = card.querySelector("h3").textContent;
        $("#mBody").innerHTML = card.querySelector(".detail").innerHTML;
        modal.classList.remove("hidden");
      });
    });
    var closeModal = function () { modal.classList.add("hidden"); };
    $("#closeModal").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  // 11. Contact form validation (compulsory)
  var form = $("#contactForm");
  if (form) {
    var fields = ["name", "email", "subject", "message"];
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function check(id) {
      var el = document.getElementById(id), v = el.value.trim(), msg = "";
      if (v === "") msg = "Please enter your " + id + ".";
      else if (id === "email" && !emailOk.test(v)) msg = "Enter a valid email like name@example.com.";
      else if (id === "message" && v.length < 10) msg = "Message must be at least 10 characters.";
      document.getElementById("e-" + id).textContent = msg;
      el.classList.toggle("bad", msg !== "");
      return msg === "";
    }
    fields.forEach(function (id) {
      document.getElementById(id).addEventListener("blur", function () { check(id); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true;
      fields.forEach(function (id) { if (!check(id)) allOk = false; });
      $("#success").classList.toggle("hidden", !allOk);
      if (allOk) form.reset();
    });
  }

  // ===== Additions: paste these inside js/script.js, just before the final "});" =====

  // 12. Certificate lightbox (Education page)
  var lb = $("#lightbox");
  if (lb) {
    $$(".cert").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $("#lbImg").src = btn.dataset.full;
        $("#lbImg").alt = btn.dataset.caption;
        $("#lbCap").textContent = btn.dataset.caption;
        lb.classList.remove("hidden");
      });
    });
    var closeLb = function () { lb.classList.add("hidden"); };
    $("#closeLightbox").addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  }

  // 13. Accordion expand / collapse (Experience page)
  $$(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", open);
      head.querySelector(".acc-icon").textContent = open ? "-" : "+";
    });
  });
});
