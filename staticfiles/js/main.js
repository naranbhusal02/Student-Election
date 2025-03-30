// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading screen
  initLoadingScreen()

  // Initialize theme toggle
  initThemeToggle()

  // Initialize audio toggle
  initAudioToggle()

  // Initialize custom cursor
  initCustomCursor()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize countdown timer
  initCountdown()

  // Initialize carousel
  initCarousel()

  // Initialize popups
  initPopups()
})

// Loading Screen
function initLoadingScreen() {
  const loadingScreen = document.querySelector(".loading-screen")

  if (loadingScreen) {
    // Simulate loading time
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1500)
  }
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById("toggleTheme")
  const body = document.body
  const icon = themeToggle ? themeToggle.querySelector("i") : null

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    body.classList.add("dark-mode")
    if (icon) icon.classList.replace("fa-moon", "fa-sun")
  }

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode")

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark")
        icon.classList.replace("fa-moon", "fa-sun")
      } else {
        localStorage.setItem("theme", "light")
        icon.classList.replace("fa-sun", "fa-moon")
      }
    })
  }
}

// Audio Toggle
function initAudioToggle() {
  const audioToggle = document.getElementById("toggleAudio")
  const bgMusic = document.getElementById("bgMusic")
  const audioIcon = document.getElementById("audioIcon")

  if (audioToggle && bgMusic) {
    audioToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.volume = 0.2
        bgMusic.play()
        audioIcon.classList.replace("fa-volume-mute", "fa-volume-up")
      } else {
        bgMusic.pause()
        audioIcon.classList.replace("fa-volume-up", "fa-volume-mute")
      }
    })
  }
}

// Custom Cursor
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor")

  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"
    })

    document.addEventListener("mousedown", () => {
      cursor.style.width = "15px"
      cursor.style.height = "15px"
      cursor.style.opacity = "0.8"
    })

    document.addEventListener("mouseup", () => {
      cursor.style.width = "20px"
      cursor.style.height = "20px"
      cursor.style.opacity = "0.6"
    })

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0"
    })

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "0.6"
    })

    // Change cursor on clickable elements
    const clickables = document.querySelectorAll("a, button, input, select, .candidate-card, .carousel-btn")
    clickables.forEach((element) => {
      element.addEventListener("mouseover", () => {
        cursor.style.width = "30px"
        cursor.style.height = "30px"
        cursor.style.opacity = "0.4"
      })

      element.addEventListener("mouseout", () => {
        cursor.style.width = "20px"
        cursor.style.height = "20px"
        cursor.style.opacity = "0.6"
      })
    })
  }
}

// Mobile Menu
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  const authButtons = document.querySelector(".auth-buttons")

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")

      if (hamburger.classList.contains("active")) {
        navLinks.style.display = "flex"
        navLinks.style.flexDirection = "column"
        navLinks.style.position = "absolute"
        navLinks.style.top = "70px"
        navLinks.style.left = "0"
        navLinks.style.width = "100%"
        navLinks.style.backgroundColor = "var(--glass-bg)"
        navLinks.style.backdropFilter = "blur(10px)"
        navLinks.style.padding = "20px"
        navLinks.style.zIndex = "99"

        if (authButtons) {
          authButtons.style.display = "flex"
          authButtons.style.flexDirection = "column"
          authButtons.style.width = "100%"
          authButtons.style.marginTop = "20px"
        }
      } else {
        navLinks.style.display = ""
        navLinks.style.flexDirection = ""
        navLinks.style.position = ""
        navLinks.style.top = ""
        navLinks.style.left = ""
        navLinks.style.width = ""
        navLinks.style.backgroundColor = ""
        navLinks.style.backdropFilter = ""
        navLinks.style.padding = ""
        navLinks.style.zIndex = ""

        if (authButtons) {
          authButtons.style.display = ""
          authButtons.style.flexDirection = ""
          authButtons.style.width = ""
          authButtons.style.marginTop = ""
        }
      }
    })
  }
}

// Countdown Timer
function initCountdown() {
  const daysElement = document.getElementById("days")
  const hoursElement = document.getElementById("hours")
  const minutesElement = document.getElementById("minutes")
  const secondsElement = document.getElementById("seconds")
  const dashboardCountdown = document.getElementById("dashboardCountdown")

  if (daysElement && hoursElement && minutesElement && secondsElement) {
    // Set the election end date (May 1, 2025)
    const electionEndDate = new Date("May 1, 2025 23:59:59").getTime()

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
      // Get current date and time
      const now = new Date().getTime()

      // Calculate the time remaining
      const timeRemaining = electionEndDate - now

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

      // Display the countdown
      daysElement.textContent = days.toString().padStart(2, "0")
      hoursElement.textContent = hours.toString().padStart(2, "0")
      minutesElement.textContent = minutes.toString().padStart(2, "0")
      secondsElement.textContent = seconds.toString().padStart(2, "0")

      // Update dashboard countdown if it exists
      if (dashboardCountdown) {
        dashboardCountdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`
      }

      // If the countdown is over
      if (timeRemaining < 0) {
        clearInterval(countdownInterval)
        daysElement.textContent = "00"
        hoursElement.textContent = "00"
        minutesElement.textContent = "00"
        secondsElement.textContent = "00"

        if (dashboardCountdown) {
          dashboardCountdown.textContent = "Election Ended"
        }
      }
    }, 1000)
  }
}

// Carousel
function initCarousel() {
  const carouselTrack = document.querySelector(".carousel-track")
  const prevBtn = document.querySelector(".carousel-btn.prev")
  const nextBtn = document.querySelector(".carousel-btn.next")

  if (carouselTrack && prevBtn && nextBtn) {
    let currentIndex = 0
    const candidateCards = document.querySelectorAll(".carousel-track .candidate-card")
    const cardWidth = candidateCards[0].offsetWidth + 30 // Card width + gap

    // Set initial position
    carouselTrack.style.transform = `translateX(0)`

    // Previous button click
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--
        updateCarouselPosition()
      }
    })

    // Next button click
    nextBtn.addEventListener("click", () => {
      if (currentIndex < candidateCards.length - getVisibleCards()) {
        currentIndex++
        updateCarouselPosition()
      }
    })

    // Update carousel position
    function updateCarouselPosition() {
      carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`
    }

    // Get number of visible cards based on viewport width
    function getVisibleCards() {
      const viewportWidth = window.innerWidth
      if (viewportWidth >= 1200) return 4
      if (viewportWidth >= 900) return 3
      if (viewportWidth >= 600) return 2
      return 1
    }

    // Update on window resize
    window.addEventListener("resize", () => {
      // Reset position on resize
      currentIndex = 0
      updateCarouselPosition()
    })
  }
}

// Popups
function initPopups() {
  // Close popup when clicking outside
  window.addEventListener("click", (e) => {
    const popups = document.querySelectorAll(".popup")
    popups.forEach((popup) => {
      if (e.target === popup) {
        closePopup(popup)
      }
    })
  })
}

// Show popup
function showPopup(popupId) {
  const popup = document.getElementById(popupId)
  if (popup) {
    popup.classList.add("active")
  }
}

// Close popup
function closePopup(popup) {
  if (typeof popup === "string") {
    popup = document.getElementById(popup)
  }

  if (popup) {
    popup.classList.remove("active")
  } else {
    // Close all popups if no specific popup is provided
    const popups = document.querySelectorAll(".popup")
    popups.forEach((p) => p.classList.remove("active"))
  }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId)
  const icon = input.nextElementSibling.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.replace("fa-eye", "fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.replace("fa-eye-slash", "fa-eye")
  }
}

// Show forgot password popup
function showForgotPasswordPopup() {
  showPopup("popup")
  document.getElementById("popupTitle").textContent = "Forgot Password"
  document.getElementById("popupMessage").textContent = "Enter your email address to reset your password."

  // Add reset email input if it doesn't exist
  if (!document.getElementById("resetEmail")) {
    const popupBody = document.querySelector("#popup .popup-body")
    const inputGroup = document.createElement("div")
    inputGroup.className = "input-group"
    inputGroup.innerHTML = `
      <span class="input-icon"><i class="fas fa-envelope"></i></span>
      <input type="email" id="resetEmail" required>
      <label for="resetEmail">Email Address</label>
    `
    popupBody.appendChild(inputGroup)
  }

  // Update footer buttons
  const popupFooter = document.querySelector("#popup .popup-footer")
  popupFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="closePopup('popup')">Cancel</button>
    <button class="btn btn-primary" onclick="sendResetEmail()">Send Reset Link</button>
  `
}

// Send reset email
function sendResetEmail() {
  const resetEmail = document.getElementById("resetEmail").value

  if (resetEmail) {
    // Show success message
    document.getElementById("popupTitle").textContent = "Email Sent"
    document.getElementById("popupMessage").textContent =
      `A password reset link has been sent to ${resetEmail}. Please check your inbox.`

    // Remove input field
    const inputGroup = document.querySelector("#popup .input-group")
    if (inputGroup) {
      inputGroup.remove()
    }

    // Update footer button
    const popupFooter = document.querySelector("#popup .popup-footer")
    popupFooter.innerHTML = `
      <button class="btn btn-primary" onclick="closePopup('popup')">OK</button>
    `
  }
}

