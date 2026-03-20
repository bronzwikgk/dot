(function () {
      var tracks = [
        "01_actionBrowser_v4_sex.mp3",
        "02_Broken_Men_1.mp3",
        "03_Broken_Men.mp3",
        "04_Broken_Men_v2.mp3",
        "05_Broken_Men_v3.mp3",
        "06_Broken_Men_v4.mp3",
        "07_Broken_Men_v5.mp3",
        "08_Broken_Men_v6.mp3",
        "09_Broken_Men_v7.mp3",
        "10_Broken_Men_v8.mp3",
        "11_chull_v1.mp3",
        "12_chull_v2.mp3",
        "13_freedom.mp3",
        "14_freedom_actionBrowser_v1_sexy.mp3",
        "15_freedom_actionBrowser_v2.mp3",
        "16_freedom_v2.mp3",
        "17_freedom_v3.mp3",
        "18_freedom_v4.mp3",
        "19_freedom_v5_default.mp3",
        "20_freedom_v6.mp3",
        "21_life_is_a_sales_pitch_v1.mp3",
        "22_life_is_a_sales_pitch_v2.mp3",
        "23_life_is_a_sales_pitch_v3.mp3",
        "24_pritam_v1.mp3",
        "25_pritam_v2.mp3",
        "26_subhah_classical.mp3",
        "27_subhah_classical_v2.mp3",
        "28_You_re_absolutely_right._A_14-year-old_h.mp3",
        "29_You_re_absolutely_right_v2.mp3",
        "30_kirdar_track.mp3",
        "31_kirdar_v2.mp3",
        "32_kirdar_v3.mp3",
        "33_kirdar_v4.mp3",
        "34_kirdar_v5.mp3",
        "35_Gumshuda_v1.mp3",
        "36_gumshuda_v2.mp3",
        "37 tum_v1.mp3",
        "38 tum_v2.mp3",
        "39 tum_v3.mp3",
        "40_tum_v4.mp3",
        "41_tum_v5.mp3",
        "42_tum_v5.mp3",
        "43_sapney_v2.mp3",
        "44_sapney_default_v1.mp3",
        "45_subah_v1.mp3",
        "46_subah_flute_male_v2.mp3",
      ];

      function getGroupKey(name) {
        return name
          .toLowerCase()
          .replace(/\.mp3$/i, "")
          .replace(/^\d+[\s_-]*/, "")
          .replace(/[.\s-]+/g, "_")
          .replace(/_default(?:_v\d+)?$/i, "")
          .replace(/_v\d+$/i, "")
          .replace(/_track$/i, "")
          .replace(/_+$/g, "");
      }

      function toTrackLabel(name) {
        return name
          .replace(/\.mp3$/i, "")
          .replace(/^\d+[\s_-]*/, "")
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      var preferredDefaultIndex = tracks.findIndex(function (name) { return /sapney.*default|default.*sapney/i.test(name); });
      if (preferredDefaultIndex < 0) {
        preferredDefaultIndex = tracks.findIndex(function (name) { return /default_v2|default_v1/i.test(name); });
      }
      if (preferredDefaultIndex < 0) {
        preferredDefaultIndex = tracks.findIndex(function (name) { return /default/i.test(name); });
      }
      if (preferredDefaultIndex > 0) {
        var preferredDefaultTrack = tracks.splice(preferredDefaultIndex, 1)[0];
        tracks.unshift(preferredDefaultTrack);
      }

      var trackGroups = tracks.map(getGroupKey);
      var audio = document.getElementById("wam-audio");
      var select = document.getElementById("track-select");
      var albumList = document.querySelector('#album ul[aria-label="Album tracks"]');
      var albumDownload = document.getElementById("album-download");
      var shuffleBtn = document.getElementById("btn-shuffle");
      var loopBtn = document.getElementById("btn-loop");
      var trackState = tracks.map(function () { return { failed: false }; });
      var currentIndex = -1;
      var loadToken = 0;
      var probeTimer = 0;
      var lastRetryAt = 0;
      var bootAutoplay = true;
      var startupRetryTimer = 0;
      var isShuffle = true;
      var isLoop = false;

      if (!audio || !select) {
        return;
      }

      function toTrackSrc(name) {
        return "../album_finally_alive/" + encodeURIComponent(name);
      }

      function updateTrackUi(index) {
        var options = select.options;
        for (var i = 0; i < options.length; i++) {
          options[i].disabled = !!trackState[i].failed;
        }
        if (!albumList) {
          return;
        }
        var items = albumList.querySelectorAll("li[data-track-index]");
        items.forEach(function (item) {
          var i = Number(item.getAttribute("data-track-index"));
          item.removeAttribute("aria-current");
          item.removeAttribute("data-unavailable");
          if (Number.isFinite(i) && trackState[i] && trackState[i].failed) {
            item.setAttribute("data-unavailable", "true");
          }
          if (Number.isFinite(i) && i === index) {
            item.setAttribute("aria-current", "true");
          }
        });
      }

      function renderAlbumTrackList() {
        if (!albumList) {
          return;
        }
        albumList.textContent = "";
        tracks.forEach(function (name, i) {
          var item = document.createElement("li");
          item.setAttribute("data-track-index", String(i));
          var icon = document.createElement("i");
          icon.className = "ri-music-2-line";
          icon.setAttribute("aria-hidden", "true");
          item.appendChild(icon);
          item.appendChild(document.createTextNode(" " + toTrackLabel(name)));
          albumList.appendChild(item);
        });
      }

      function findNextPlayable(startIndex, allowWrap) {
        var n = tracks.length;
        for (var step = 0; step < n; step++) {
          var i = startIndex + step;
          if (allowWrap) {
            i = (i + n) % n;
          } else if (i < 0 || i >= n) {
            break;
          }
          if (!trackState[i].failed) {
            return i;
          }
        }
        return -1;
      }

      function findRandomPlayable(excludeIndex) {
        var currentGroup = excludeIndex >= 0 ? trackGroups[excludeIndex] : "";
        var candidates = [];
        for (var i = 0; i < tracks.length; i++) {
          if (i !== excludeIndex && !trackState[i].failed && trackGroups[i] !== currentGroup) {
            candidates.push(i);
          }
        }
        if (candidates.length === 0) {
          for (var j = 0; j < tracks.length; j++) {
            if (j !== excludeIndex && !trackState[j].failed) {
              candidates.push(j);
            }
          }
          if (candidates.length === 0) {
            return findNextPlayable(excludeIndex + 1, true);
          }
        }
        var pick = Math.floor(Math.random() * candidates.length);
        return candidates[pick];
      }

      function updateToolStateUi() {
        if (shuffleBtn) {
          if (isShuffle) {
            shuffleBtn.setAttribute("aria-pressed", "true");
          } else {
            shuffleBtn.setAttribute("aria-pressed", "false");
          }
        }
        if (loopBtn) {
          if (isLoop) {
            loopBtn.setAttribute("aria-pressed", "true");
          } else {
            loopBtn.setAttribute("aria-pressed", "false");
          }
        }
      }

      function playTrackByIndex(index, manual) {
        if (!Number.isFinite(index) || index < 0 || index >= tracks.length) {
          return;
        }
        if (manual) {
          trackState[index].failed = false;
        } else if (trackState[index].failed) {
          var retry = findNextPlayable(index + 1, true);
          if (retry >= 0 && retry !== index) {
            playTrackByIndex(retry, false);
          }
          return;
        }

        currentIndex = index;
        select.selectedIndex = index;
        updateTrackUi(index);
        loadToken += 1;
        var token = loadToken;
        var src = toTrackSrc(tracks[index]);
        audio.pause();
        audio.src = src;
        audio.loop = isLoop;
        audio.load();
        window.clearTimeout(probeTimer);
        probeTimer = window.setTimeout(function () {
          if (token !== loadToken) {
            return;
          }
          if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            handleTrackFailure(index);
          }
        }, 15000);

        if (manual) {
          audio.muted = false;
          bootAutoplay = false;
        } else if (bootAutoplay) {
          audio.muted = true;
        }

        audio.play().catch(function () {
          audio.muted = true;
          audio.play().catch(function () {
            // Will retry on user interaction.
          });
        });
      }

      function handleTrackFailure(failedIndex) {
        if (!Number.isFinite(failedIndex) || failedIndex < 0 || failedIndex >= tracks.length) {
          return;
        }
        trackState[failedIndex].failed = true;
        updateTrackUi(failedIndex);
        var next = findNextPlayable(failedIndex + 1, true);
        if (next >= 0 && next !== failedIndex) {
          playTrackByIndex(next, false);
        }
      }

      tracks.forEach(function (name, i) {
        var option = document.createElement("option");
        option.value = String(i);
        option.textContent = toTrackLabel(name);
        select.appendChild(option);
      });

      renderAlbumTrackList();
      updateTrackUi(-1);

      if (albumList) {
        albumList.addEventListener("click", function (event) {
          var li = event.target && event.target.closest ? event.target.closest("li[data-track-index]") : null;
          if (!li) {
            return;
          }
          var i = Number(li.getAttribute("data-track-index"));
          if (Number.isFinite(i)) {
            playTrackByIndex(i, true);
          }
        });
      }

      if (albumDownload) {
        albumDownload.addEventListener("click", function (event) {
          event.preventDefault();
          tracks.forEach(function (name, i) {
            window.setTimeout(function () {
              var a = document.createElement("a");
              a.href = toTrackSrc(name);
              a.download = name;
              document.body.appendChild(a);
              a.click();
              a.remove();
            }, i * 180);
          });
        });
      }

      if (shuffleBtn) {
        shuffleBtn.addEventListener("click", function () {
          isShuffle = !isShuffle;
          updateToolStateUi();
        });
      }

      if (loopBtn) {
        loopBtn.addEventListener("click", function () {
          isLoop = !isLoop;
          audio.loop = isLoop;
          updateToolStateUi();
        });
      }

      function ensureAudiblePlayback() {
        var now = Date.now();
        if (now - lastRetryAt < 250) {
          return;
        }
        lastRetryAt = now;
        if (!audio.src) {
          return;
        }
        if (audio.muted) {
          audio.muted = false;
          bootAutoplay = false;
        }
        if (audio.paused) {
          audio.play().catch(function () {
            // Some browsers still require additional interaction.
          });
        }
      }

      function ensureAutoplayBoot() {
        if (!audio.src) {
          return;
        }
        if (!bootAutoplay) {
          return;
        }
        if (!audio.muted) {
          audio.muted = true;
        }
        if (audio.paused) {
          audio.play().catch(function () {
            // Will keep retrying in startup window.
          });
        }
      }

      select.addEventListener("change", function () {
        var i = Number(select.value);
        playTrackByIndex(i, true);
      });

      audio.addEventListener("canplay", function () {
        window.clearTimeout(probeTimer);
        ensureAutoplayBoot();
      });

      audio.addEventListener("ended", function () {
        if (isLoop) {
          return;
        }
        var next = isShuffle ? findRandomPlayable(currentIndex) : findNextPlayable(currentIndex + 1, true);
        if (next >= 0) {
          playTrackByIndex(next, false);
        }
      });

      audio.addEventListener("error", function () {
        handleTrackFailure(currentIndex);
      });

      var defaultIndex = 0;
      updateToolStateUi();
      playTrackByIndex(defaultIndex, false);
      ensureAutoplayBoot();

      startupRetryTimer = window.setInterval(function () {
        if (!audio.paused || !bootAutoplay) {
          window.clearInterval(startupRetryTimer);
          startupRetryTimer = 0;
          return;
        }
        ensureAutoplayBoot();
      }, 1200);
      window.setTimeout(function () {
        if (startupRetryTimer) {
          window.clearInterval(startupRetryTimer);
          startupRetryTimer = 0;
        }
      }, 15000);

      window.addEventListener("load", function () {
        ensureAudiblePlayback();
      }, { once: true });
      document.addEventListener("pointerdown", function () {
        ensureAudiblePlayback();
      }, { passive: true });
      document.addEventListener("keydown", function () {
        ensureAudiblePlayback();
      });
      document.addEventListener("touchstart", function () {
        ensureAudiblePlayback();
      }, { passive: true });
    })();

    (function () {
      var body = document.body;
      var timer = 0;
      var hideDelay = 1400;
      var menu = document.getElementById("site-menu");
      var dock = document.getElementById("audio-dock");
      var dockDetails = document.querySelector("#audio-dock details");

      function hideUi() {
        body.removeAttribute("data-ui");
      }

      function scheduleHide() {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          hideUi();
        }, hideDelay);
      }

      function positionMenu() {
        if (!menu || !dock) {
          return;
        }
        var rect = dock.getBoundingClientRect();
        menu.style.left = Math.max(10, rect.left) + "px";
        menu.style.top = (rect.bottom + 10) + "px";
      }

      function revealUi() {
        body.setAttribute("data-ui", "visible");
        scheduleHide();
      }

      var menuRaf = 0;
      var lastPointerEvent = null;
      function runMenuPointerFrame() {
        menuRaf = 0;
        var event = lastPointerEvent;
        if (!menu) {
          return;
        }
        if (event && event.clientY > (window.innerHeight - 160)) {
          scheduleHide();
          return;
        }
        positionMenu();
        revealUi();
      }

      document.addEventListener("pointermove", function (event) {
        lastPointerEvent = event;
        if (menuRaf) {
          return;
        }
        menuRaf = window.requestAnimationFrame(runMenuPointerFrame);
      }, { passive: true });

      window.addEventListener("resize", positionMenu, { passive: true });
      if (dockDetails) {
        dockDetails.addEventListener("toggle", positionMenu);
      }

      if (menu) {
        menu.addEventListener("pointerenter", function () {
          window.clearTimeout(timer);
          body.setAttribute("data-ui", "visible");
        });
        menu.addEventListener("pointerleave", function () {
          scheduleHide();
        });
      }

      positionMenu();
      scheduleHide();
    })();

    (function () {
      var stage = document.getElementById("navigation");
      if (!stage) {
        return;
      }
      var chatbotDock = document.getElementById("chatbot-dock");
      var sections = Array.prototype.slice.call(stage.querySelectorAll("[data-section-index]"));
      var links = Array.prototype.slice.call(document.querySelectorAll("#site-menu a[data-target]"));
      var dots = Array.prototype.slice.call(document.querySelectorAll("#slide-dots button[data-index]"));
      var index = 0;
      var animating = false;
      var wheelAccumulator = 0;
      var touchStartY = 0;
      var touchStartX = 0;
      var touchBypass = false;

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function render() {
        sections.forEach(function (node, i) {
          if (i < index) {
            node.setAttribute("data-state", "prev");
          } else if (i === index) {
            node.setAttribute("data-state", "current");
          } else {
            node.setAttribute("data-state", "next");
          }
        });
        dots.forEach(function (dot, i) {
          if (i === index) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      }

      function goTo(nextIndex) {
        var target = clamp(nextIndex, 0, sections.length - 1);
        if (target === index || animating) {
          return;
        }
        animating = true;
        index = target;
        if (chatbotDock) {
          chatbotDock.hidden = index < 1;
        }
        stage.setAttribute("data-animating", "true");
        render();
        window.setTimeout(function () {
          stage.removeAttribute("data-animating");
          animating = false;
        }, 860);
      }

      function moveBy(direction) {
        if (direction > 0) {
          goTo(index + 1);
        } else if (direction < 0) {
          goTo(index - 1);
        }
      }

      render();
      if (chatbotDock) {
        chatbotDock.hidden = true;
      }

      window.addEventListener("wheel", function (event) {
        if (event.target instanceof Element && event.target.closest("#audio-dock, #bg-filmstrip")) {
          return;
        }
        event.preventDefault();
        wheelAccumulator += event.deltaY;
        if (Math.abs(wheelAccumulator) < 42 || animating) {
          return;
        }
        moveBy(wheelAccumulator > 0 ? 1 : -1);
        wheelAccumulator = 0;
      }, { passive: false });

      window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
          event.preventDefault();
          moveBy(1);
        } else if (event.key === "ArrowUp" || event.key === "PageUp") {
          event.preventDefault();
          moveBy(-1);
        }
      });

      window.addEventListener("touchstart", function (event) {
        if (!event.touches || !event.touches[0]) {
          return;
        }
        touchBypass = !!(event.target instanceof Element && event.target.closest("#audio-dock, #bg-filmstrip"));
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      window.addEventListener("touchmove", function (event) {
        if (!event.touches || !event.touches[0] || animating || touchBypass) {
          return;
        }
        var dx = event.touches[0].clientX - touchStartX;
        var dy = event.touches[0].clientY - touchStartY;
        if (Math.abs(dy) < 48 || Math.abs(dy) < Math.abs(dx)) {
          return;
        }
        moveBy(dy < 0 ? 1 : -1);
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
      }, { passive: true });

      window.addEventListener("touchend", function () {
        touchBypass = false;
      }, { passive: true });

      links.forEach(function (link) {
        link.addEventListener("click", function (event) {
          var targetId = link.getAttribute("data-target");
          if (!targetId) {
            return;
          }
          var targetNode = document.getElementById(targetId);
          if (!targetNode) {
            return;
          }
          event.preventDefault();
          var targetIndex = Number(targetNode.getAttribute("data-section-index"));
          if (Number.isFinite(targetIndex)) {
            goTo(targetIndex);
          }
        });
      });

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var targetIndex = Number(dot.getAttribute("data-index"));
          if (Number.isFinite(targetIndex)) {
            goTo(targetIndex);
          }
        });
      });

    })();

    (function () {
      function makeDraggable(node, handle) {
        if (!node || !handle) {
          return;
        }
        var dragging = false;
        var offsetX = 0;
        var offsetY = 0;
        var activePointerId = null;

        function clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }

        function start(clientX, clientY) {
          var rect = node.getBoundingClientRect();
          dragging = true;
          offsetX = clientX - rect.left;
          offsetY = clientY - rect.top;
          node.style.right = "auto";
          node.style.bottom = "auto";
        }

        function move(clientX, clientY) {
          if (!dragging) {
            return;
          }
          var w = node.offsetWidth;
          var h = node.offsetHeight;
          var left = clamp(clientX - offsetX, 0, window.innerWidth - w);
          var top = clamp(clientY - offsetY, 0, window.innerHeight - h);
          node.style.left = left + "px";
          node.style.top = top + "px";
        }

        function end() {
          dragging = false;
        }

        handle.addEventListener("pointerdown", function (event) {
          event.preventDefault();
          start(event.clientX, event.clientY);
          activePointerId = event.pointerId;
        });

        document.addEventListener("pointermove", function (event) {
          if (!dragging) {
            return;
          }
          if (activePointerId !== null && event.pointerId !== activePointerId) {
            return;
          }
          move(event.clientX, event.clientY);
        });

        document.addEventListener("pointerup", function (event) {
          if (activePointerId !== null && event.pointerId !== activePointerId) {
            return;
          }
          activePointerId = null;
          end();
        });
        document.addEventListener("pointercancel", function () {
          activePointerId = null;
          end();
        });
      }

      var audioDock = document.getElementById("audio-dock");
      var audioHandle = document.querySelector("#audio-dock summary");
      var chatbotDock = document.getElementById("chatbot-dock");
      var chatbotHandle = document.getElementById("chatbot-handle");

      makeDraggable(audioDock, audioHandle);
      makeDraggable(chatbotDock, chatbotHandle);
    })();

    (function () {
      var root = document.documentElement;
      var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!root || prefersReduced) {
        return;
      }
      var tx = 0;
      var ty = 0;
      var x = 0;
      var y = 0;
      var raf = 0;

      function frame() {
        x += (tx - x) * 0.045;
        y += (ty - y) * 0.045;
        root.style.setProperty("--bg-pan-x", x.toFixed(2) + "px");
        root.style.setProperty("--bg-pan-y", y.toFixed(2) + "px");
        if (Math.abs(tx - x) > 0.06 || Math.abs(ty - y) > 0.06) {
          raf = window.requestAnimationFrame(frame);
        } else {
          raf = 0;
        }
      }

      window.addEventListener("pointermove", function (event) {
        var vw = window.innerWidth || 1;
        var vh = window.innerHeight || 1;
        var nx = (event.clientX / vw) * 2 - 1;
        var ny = (event.clientY / vh) * 2 - 1;
        tx = nx * -10;
        ty = ny * -6;
        if (!raf) {
          raf = window.requestAnimationFrame(frame);
        }
      }, { passive: true });

      window.addEventListener("pointerleave", function () {
        tx = 0;
        ty = 0;
        if (!raf) {
          raf = window.requestAnimationFrame(frame);
        }
      }, { passive: true });
    })();

    (function () {
      var body = document.body;
      var stage = document.getElementById("navigation");
      if (!body || !stage) {
        return;
      }

      body.setAttribute("data-focus-mode", "bg");

      function isInsideCurrentSection(clientX, clientY) {
        var current = document.querySelector('#navigation [data-section-index][data-state="current"]');
        if (!current) {
          return false;
        }
        var rect = current.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }

      var focusMode = "bg";
      var focusRaf = 0;
      var focusPointer = null;
      function runFocusFrame() {
        focusRaf = 0;
        if (!focusPointer) {
          return;
        }
        var nextMode = isInsideCurrentSection(focusPointer.clientX, focusPointer.clientY) ? "sections" : "bg";
        if (nextMode !== focusMode) {
          focusMode = nextMode;
          body.setAttribute("data-focus-mode", nextMode);
        }
      }

      document.addEventListener("pointermove", function (event) {
        focusPointer = event;
        if (focusRaf) {
          return;
        }
        focusRaf = window.requestAnimationFrame(runFocusFrame);
      }, { passive: true });
    })();

    (function () {
      var root = document.documentElement;
      var thumbsHost = document.getElementById("bg-thumbs");
      var currentCredit = document.getElementById("photo-credit-current");
      var imageFiles = [
        "adam-sherez-Txge5z8jxmY-unsplash.jpg",
        "aiden-marples-Udu9NgiNFk8-unsplash.jpg",
        "alok-sharma-pzsz8e1IMvo-unsplash.jpg",
        "ashwini-chaudhary-monty-59WyLiVmiCo-unsplash.jpg",
        "austin-neill-hgO1wFPXl3I-unsplash.jpg",
        "chris-7WfcHibcR3Y-unsplash.jpg",
        "debabrata-patra-QBdIEE_eU7g-unsplash.jpg",
        "dibakar-roy-siaJVOP57dk-unsplash.jpg",
        "himanshu-FhmeUZKBx5s-unsplash.jpg",
        "karthikeyan-k-xXKnF0yYNNE-unsplash.jpg",
        "pexels-brett-sayles-1277547.jpg",
        "pexels-kevinbidwell-1427368.jpg",
        "raja-a-qhrKRd5Td34-unsplash.jpg",
        "rashmi-bhatia-1jOzM7chGhE-unsplash.jpg",
        "sergey-vinogradov-HMcOR_nwyNA-unsplash.jpg",
        "shrikant-ambawale-8kpjs_2xPN0-unsplash.jpg",
        "sreekumar-pillai-SzVfJkiuVu0-unsplash.jpg",
        "swastik-arora-XNQtAngSjRg-unsplash.jpg",
        "yogesh-pedamkar-MuFn69FbyzE-unsplash.jpg",
      ];

      function toTitle(text) {
        return text.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
      }

      function parsePhotographer(file) {
        var base = file.replace(/\.[^.]+$/, "");
        if (base.indexOf("-unsplash") > -1) {
          var raw = base.replace(/-unsplash$/, "").replace(/-[A-Za-z0-9_]{8,}$/, "");
          return toTitle(raw.replace(/-/g, " "));
        }
        if (base.indexOf("pexels-") === 0) {
          var pexelsRaw = base.replace(/^pexels-/, "").replace(/-\d+(?:-\d+)*$/, "");
          return toTitle(pexelsRaw.replace(/-/g, " "));
        }
        if (base.indexOf("photo-") === 0) {
          return "Unsplash Contributor";
        }
        return toTitle(base.replace(/-\d+(?:-\d+)*$/, "").replace(/-/g, " "));
      }

      function parseSource(file) {
        if (file.indexOf("-unsplash") > -1 || file.indexOf("photo-") === 0) {
          return "https://unsplash.com";
        }
        if (file.indexOf("pexels-") === 0) {
          return "https://www.pexels.com";
        }
        return "#";
      }

      var slides = imageFiles.map(function (file) {
        return {
          src: "../asset/images_v2_optimized/" + file,
          photographer: parsePhotographer(file),
          source: parseSource(file)
        };
      });
      if (!root || slides.length === 0) {
        return;
      }

      slides.forEach(function (slide) {
        var img = new Image();
        img.src = slide.src;
      });

      var idx = 0;
      var showingA = true;
      var holdMs = 18000;
      var timer = 0;
      var layerA = document.getElementById("bg-photo-a");
      var layerB = document.getElementById("bg-photo-b");
      var thumbsBound = false;
      var dragFromIndex = -1;

      function setVar(name, value) {
        root.style.setProperty(name, value);
      }

      function toCssBgUrl(src) {
        return 'url("' + new URL(src, window.location.href).href + '")';
      }

      function syncThumbs() {
        if (!thumbsHost) {
          return;
        }
        var buttons = thumbsHost.querySelectorAll("button[data-slide-index]");
        buttons.forEach(function (button) {
          var i = Number(button.getAttribute("data-slide-index"));
          if (i === idx) {
            button.setAttribute("aria-current", "true");
          } else {
            button.removeAttribute("aria-current");
          }
        });
      }

      function updateCurrentCredit() {
        if (!currentCredit || !slides[idx]) {
          return;
        }
        currentCredit.textContent = slides[idx].photographer;
      }

      function renderThumbs() {
        if (!thumbsHost) {
          return;
        }
        thumbsHost.textContent = "";
        slides.forEach(function (slide, i) {
          var li = document.createElement("li");
          li.setAttribute("data-slide-index", String(i));
          li.draggable = true;
          var button = document.createElement("button");
          var img = document.createElement("img");
          button.type = "button";
          button.setAttribute("data-slide-index", String(i));
          button.setAttribute("aria-label", "Background " + (i + 1));
          button.draggable = false;
          img.src = slide.src;
          img.alt = "Background preview " + (i + 1);
          img.draggable = false;
          img.loading = "lazy";
          button.appendChild(img);
          li.appendChild(button);
          thumbsHost.appendChild(li);
        });
      }

      function clearDropTargets() {
        if (!thumbsHost) {
          return;
        }
        thumbsHost.querySelectorAll('li[data-drop-target="true"]').forEach(function (li) {
          li.removeAttribute("data-drop-target");
        });
      }

      function reorderSlides(fromIndex, toIndex) {
        if (!Number.isFinite(fromIndex) || !Number.isFinite(toIndex) || fromIndex === toIndex) {
          return;
        }
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= slides.length || toIndex >= slides.length) {
          return;
        }
        var currentSrc = slides[idx] ? slides[idx].src : "";
        var moved = slides.splice(fromIndex, 1)[0];
        slides.splice(toIndex, 0, moved);
        if (currentSrc) {
          var currentNewIndex = slides.findIndex(function (slide) { return slide.src === currentSrc; });
          if (currentNewIndex >= 0) {
            idx = currentNewIndex;
          }
        }
        renderThumbs();
        syncThumbs();
        updateCurrentCredit();
        restartTimer();
      }

      function bindThumbInteractions() {
        if (!thumbsHost || thumbsBound) {
          return;
        }
        thumbsBound = true;

        thumbsHost.addEventListener("click", function (event) {
          var button = event.target && event.target.closest ? event.target.closest("button[data-slide-index]") : null;
          if (!button) {
            return;
          }
          var next = Number(button.getAttribute("data-slide-index"));
          if (!Number.isFinite(next)) {
            return;
          }
          goToSlide(next);
          restartTimer();
        });

        thumbsHost.addEventListener("dragstart", function (event) {
          var li = event.target instanceof Element ? event.target.closest("li[data-slide-index]") : null;
          if (!li) {
            return;
          }
          dragFromIndex = Number(li.getAttribute("data-slide-index"));
          li.setAttribute("data-dragging", "true");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(dragFromIndex));
          }
        });

        thumbsHost.addEventListener("dragover", function (event) {
          var li = event.target instanceof Element ? event.target.closest("li[data-slide-index]") : null;
          if (!li) {
            return;
          }
          event.preventDefault();
          clearDropTargets();
          li.setAttribute("data-drop-target", "true");
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
          }
        });

        thumbsHost.addEventListener("drop", function (event) {
          var li = event.target instanceof Element ? event.target.closest("li[data-slide-index]") : null;
          if (!li) {
            return;
          }
          event.preventDefault();
          var toIndex = Number(li.getAttribute("data-slide-index"));
          reorderSlides(dragFromIndex, toIndex);
          dragFromIndex = -1;
          clearDropTargets();
          thumbsHost.querySelectorAll('li[data-dragging="true"]').forEach(function (node) {
            node.removeAttribute("data-dragging");
          });
        });

        thumbsHost.addEventListener("dragend", function () {
          dragFromIndex = -1;
          clearDropTargets();
          thumbsHost.querySelectorAll('li[data-dragging="true"]').forEach(function (node) {
            node.removeAttribute("data-dragging");
          });
        });
      }

      function goToSlide(next) {
        idx = (next + slides.length) % slides.length;
        if (showingA) {
          var bgB = toCssBgUrl(slides[idx].src);
          setVar("--bg-image-b", bgB);
          if (layerB) {
            layerB.style.backgroundImage = bgB;
          }
          setVar("--bg-fade", "1");
        } else {
          var bgA = toCssBgUrl(slides[idx].src);
          setVar("--bg-image-a", bgA);
          if (layerA) {
            layerA.style.backgroundImage = bgA;
          }
          setVar("--bg-fade", "0");
        }
        showingA = !showingA;
        syncThumbs();
        updateCurrentCredit();
      }

      function restartTimer() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          goToSlide(idx + 1);
        }, holdMs);
      }

      var initialA = toCssBgUrl(slides[idx].src);
      var initialB = toCssBgUrl(slides[(idx + 1) % slides.length].src);
      setVar("--bg-image-a", initialA);
      setVar("--bg-image-b", initialB);
      if (layerA) {
        layerA.style.backgroundImage = initialA;
      }
      if (layerB) {
        layerB.style.backgroundImage = initialB;
      }
      setVar("--bg-fade", "0");
      renderThumbs();
      bindThumbInteractions();
      syncThumbs();
      updateCurrentCredit();
      restartTimer();
    })();
