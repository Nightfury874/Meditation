// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // STARS CANVAS
    var sky = document.getElementById("sky");
  
    // Function to resize canvas to fill the window
    function resizeCanvas() {
      sky.width = window.innerWidth;
      sky.height = window.innerHeight;
      drawStars();
    }
  
    // Function to draw stars
    function drawStars() {
      if (sky.getContext) {
        var skyContext = sky.getContext("2d");
        skyContext.clearRect(0, 0, sky.width, sky.height); // Clear previous stars
  
        var starCount;
        var currentMode = getCurrentMode();
        if (currentMode === "night") {
          starCount = 240;
        } else if (currentMode === "evening") {
          starCount = 120;
        } else {
          starCount = 0;
        }
  
        for (var star = 0; star < starCount; star++) {
          var radius = Math.random() * (3 - 0.5) + 0.5; // Star size between 0.5 and 3
          var centerX = Math.random() * sky.width;
          var centerY = Math.random() * sky.height;
  
          skyContext.beginPath();
          skyContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  
          var opacity = Math.random();
          skyContext.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
          skyContext.fill();
        }
      }
    }
  
    // Initial canvas setup
    resizeCanvas();
  
    // Redraw stars on window resize
    window.addEventListener("resize", resizeCanvas);
  
    // Function to get current mode based on body class
    function getCurrentMode() {
      if (document.body.classList.contains("night-mode")) {
        return "night";
      } else if (document.body.classList.contains("evening-mode")) {
        return "evening";
      } else if (document.body.classList.contains("day-mode")) {
        return "day";
      } else {
        return "night"; // Default mode
      }
    }
  
    // BUTTON CLICK HANDLER
    var buttons = document.querySelectorAll(".modeBtn");
  
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        console.log(`Button "${button.textContent}" clicked.`); // Debug statement
  
        // Check if already in evening mode
        if (getCurrentMode() !== "evening") {
          console.log("Transitioning to Evening mode."); // Debug statement
          document.body.classList.remove("night-mode", "day-mode");
          document.body.classList.add("evening-mode");
          drawStars();
        } else {
          console.log("Already in Evening mode."); // Debug statement
        }
  
        // Disable all buttons to prevent multiple clicks
        buttons.forEach(function (btn) {
          btn.disabled = true;
          btn.style.cursor = "not-allowed"; // Visual feedback
        });
  
        // After 1 second, navigate to the target page
        setTimeout(function () {
          var targetPage = button.getAttribute("data-target");
          console.log(`Navigating to ${targetPage}`); // Debug statement
  
          // Check if targetPage exists
          if (targetPage) {
            window.location.href = targetPage;
          } else {
            console.error("No target page specified.");
            // Re-enable buttons if navigation fails
            buttons.forEach(function (btn) {
              btn.disabled = false;
              btn.style.cursor = "pointer";
            });
          }
        }, 1000);
      });
    });
  });
  