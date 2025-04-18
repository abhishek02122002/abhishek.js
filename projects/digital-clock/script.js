
      let timer;
      let startTime;
      let running = false;
      let handControlActive = false;
      let videoStream = null;

      document.addEventListener("keydown", function (event) {
        switch (event.key.toLowerCase()) {
          case "s": // Press 'S' to start
            start();
            break;
          case "p": // Press 'P' to stop
            stop();
            break;
          case "r": // Press 'R' to reset
            reset();
            break;
          case "h": // Press 'H' to toggle hand control
            toggleHandControl();
            break;
          case "?": // Press '?' to show/hide shortcut guide
            let guide = document.getElementById("shortcut-guide");
            guide.style.display =
              guide.style.display === "none" ? "block" : "none";
            break;
        }
      });

      function updateDisplay() {
        const elapsedTime = Date.now() - startTime;
        const totalSeconds = elapsedTime / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const milliseconds = Math.floor((totalSeconds % 1) * 10);
        document.getElementById("display").textContent = `${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}.${milliseconds}`;
      }

      function start() {
        if (!running) {
          startTime = Date.now() - (startTime ? Date.now() - startTime : 0);
          timer = setInterval(updateDisplay, 100);
          running = true;
        }
      }

      function stop() {
        clearInterval(timer);
        running = false;
      }

      function reset() {
        clearInterval(timer);
        running = false;
        startTime = 0;
        document.getElementById("display").textContent = "00:00:0";
      }

      function setTheme(theme) {
        let themes = {
          theme1: [
            "#003300",
            "#00ff00",
            "#004400",
            "#00ff00",
            "#009900",
            "#ffffff",
            "#003300",
          ],
          theme2: [
            "#330000",
            "#ff0000",
            "#550000",
            "#ff0000",
            "#990000",
            "#ffffff",
            "#330000",
          ],
          theme3: [
            "#333300",
            "#ffff00",
            "#555500",
            "#ffff00",
            "#999900",
            "#000000",
            "#333300",
          ],
        };
        let [bg, text, swBg, swBorder, btnBg, btnText, btnBorder] =
          themes[theme];
        document.body.style.background = bg;
        document.body.style.color = text;
        document.querySelector(".stopwatch").style.background = swBg;
        document.querySelector(".stopwatch").style.borderColor = swBorder;
        document.querySelectorAll("button").forEach((btn) => {
          btn.style.background = btnBg;
          btn.style.color = btnText;
          btn.style.borderColor = btnBorder;
        });
      }

      async function toggleHandControl() {
        handControlActive = !handControlActive;
        document.getElementById("handControlButton").textContent =
          handControlActive ? "Disable Hand Control" : "Hand Control";
        if (handControlActive) {
          startHandTracking();
        } else {
          stopHandTracking();
        }
      }

      async function startHandTracking() {
        const video = document.getElementById("video");
        video.style.display = "block";
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = videoStream;
        const model = await handpose.load();
        setInterval(async () => {
          if (!handControlActive) return;
          const predictions = await model.estimateHands(video);
          if (predictions.length > 0) {
            const hand = predictions[0].landmarks;

            // Detect Thumb Up (Start)
            if (hand[4][1] < hand[3][1]) start();

            // Detect Open Palm (Stop) - Fingers spread apart
            let fingersExtended =
              hand[8][1] < hand[6][1] &&
              hand[12][1] < hand[10][1] &&
              hand[16][1] < hand[14][1] &&
              hand[20][1] < hand[18][1];
            if (fingersExtended) stop();

            // Detect Fist (Reset) - All fingers curled in
            let fistDetected =
              hand[8][1] > hand[6][1] &&
              hand[12][1] > hand[10][1] &&
              hand[16][1] > hand[14][1] &&
              hand[20][1] > hand[18][1];
            if (fistDetected) reset();
          }
        }, 500);
      }

      function stopHandTracking() {
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
          document.getElementById("video").style.display = "none";
        }
      }
    