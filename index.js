        // Skip button functionality
        document
          .getElementById("skipBtn")
          .addEventListener("click", function () {
            window.location.href = "customer/home/home.html";
          });

        // Show container after short delay
        setTimeout(() => {
          const container = document.getElementById("welcomeContainer");
          container.style.opacity = "1";
          container.style.transform = "translateY(0)";

          // Start progress bar
          document.getElementById("progressBar").style.width = "100%";
        }, 500);

        // Initialize typed.js
        const typed = new Typed("#typed-text", {
          strings: [
            "Welcome to Exclusive Electronics",
            "Premium Tech at Your Fingertips",
            "Innovation Meets Quality",
          ],
          typeSpeed: 50,
          backSpeed: 30,
          loop: false,
          showCursor: true,
          onComplete: () => {
            // After animation completes, wait 2 seconds then redirect
            setTimeout(() => {
              window.location.href = "customer/home/home.html";
            }, 1500);
          },
        });