// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize registration form
  initRegistrationForm()

  // Initialize login form
  initLoginForm()
})

// Registration Form
function initRegistrationForm() {
  const registerForm = document.getElementById("registerForm")

  if (registerForm) {
    const passwordInput = document.getElementById("password")
    const strengthBar = document.getElementById("strengthBar")
    const strengthText = document.getElementById("strengthText")

    // Password strength checker
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      const strength = checkPasswordStrength(password)

      // Update strength bar
      strengthBar.style.width = `${strength.score * 25}%`
      strengthBar.style.backgroundColor = strength.color
      strengthText.textContent = strength.message
      strengthText.style.color = strength.color
    })

    // Form submission
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const fullName = document.getElementById("fullName").value
      const email = document.getElementById("email").value
      const studentId = document.getElementById("studentId").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirmPassword").value

      // Validate form
      let isValid = true

      // Reset error messages
      document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))

      // Validate full name
      if (!fullName) {
        document.getElementById("fullNameError").textContent = "Please enter your full name"
        isValid = false
      }

      // Validate email
      if (!email) {
        document.getElementById("emailError").textContent = "Please enter your email address"
        isValid = false
      } else if (!isValidEmail(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email address"
        isValid = false
      }

      // Validate student ID
      if (!studentId) {
        document.getElementById("studentIdError").textContent = "Please enter your student ID"
        isValid = false
      } else if (!isValidStudentId(studentId)) {
        document.getElementById("studentIdError").textContent = "Student ID must be in the format S12345"
        isValid = false
      }

      // Validate password
      if (!password) {
        document.getElementById("passwordError").textContent = "Please enter a password"
        isValid = false
      } else if (password.length < 8) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters long"
        isValid = false
      }

      // Validate confirm password
      if (!confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Please confirm your password"
        isValid = false
      } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match"
        isValid = false
      }

      // If form is valid, submit
      if (isValid) {
        // Save user data to localStorage
        const userData = {
          fullName,
          email,
          studentId,
          password,
          votingStatus: {
            president: false,
            vicePresident: false,
            secretary: false,
            treasurer: false,
          },
        }

        // Check if email already exists
        const existingUsers = JSON.parse(localStorage.getItem("users")) || []
        const emailExists = existingUsers.some((user) => user.email === email)

        if (emailExists) {
          document.getElementById("emailError").textContent = "This email is already registered"
          return
        }

        // Check if student ID already exists
        const studentIdExists = existingUsers.some((user) => user.studentId === studentId)

        if (studentIdExists) {
          document.getElementById("studentIdError").textContent = "This student ID is already registered"
          return
        }

        // Add user to existing users
        existingUsers.push(userData)
        localStorage.setItem("users", JSON.stringify(existingUsers))

        // Show success popup
        showPopup("popup")
        document.getElementById("popupTitle").textContent = "Registration Successful"
        document.getElementById("popupMessage").textContent =
          "Your account has been created successfully. You can now log in."

        // Update popup footer
        const popupFooter = document.querySelector("#popup .popup-footer")
        popupFooter.innerHTML = `
          <button class="btn btn-primary" onclick="redirectToLogin()">Log In</button>
        `

        // Reset form
        registerForm.reset()
      }
    })
  }
}

// Login Form
function initLoginForm() {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("rememberMe")?.checked

      // Reset error messages
      document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))

      // Validate form
      let isValid = true

      // Validate email
      if (!email) {
        document.getElementById("emailError").textContent = "Please enter your email address"
        isValid = false
      }

      // Validate password
      if (!password) {
        document.getElementById("passwordError").textContent = "Please enter your password"
        isValid = false
      }

      // If form is valid, submit
      if (isValid) {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || []

        // Find user by email
        const user = users.find((u) => u.email === email)

        // Check if user exists and password is correct
        if (!user) {
          document.getElementById("emailError").textContent = "Email not found"
          return
        }

        if (user.password !== password) {
          document.getElementById("passwordError").textContent = "Incorrect password"
          return
        }

        // Save logged in user to localStorage
        localStorage.setItem("currentUser", JSON.stringify(user))

        // If remember me is checked, save to localStorage
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ email }))
        } else {
          localStorage.removeItem("rememberedUser")
        }

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      }
    })

    // Check for remembered user
    const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"))
    if (rememberedUser && rememberedUser.email) {
      document.getElementById("email").value = rememberedUser.email
      if (document.getElementById("rememberMe")) {
        document.getElementById("rememberMe").checked = true
      }
    }
  }
}

// Check password strength
function checkPasswordStrength(password) {
  // Initialize score
  let score = 0

  // Check length
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score++

  // Check for lowercase letters
  if (/[a-z]/.test(password)) score++

  // Check for numbers
  if (/[0-9]/.test(password)) score++

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Calculate final score (max 4)
  score = Math.min(4, Math.floor(score / 1.5))

  // Define strength messages and colors
  const strengths = [
    { message: "Very Weak", color: "#e74c3c" },
    { message: "Weak", color: "#e67e22" },
    { message: "Medium", color: "#f39c12" },
    { message: "Strong", color: "#2ecc71" },
    { message: "Very Strong", color: "#27ae60" },
  ]

  return {
    score,
    message: strengths[score].message,
    color: strengths[score].color,
  }
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate student ID
function isValidStudentId(studentId) {
  const studentIdRegex = /^S\d{5}$/
  return studentIdRegex.test(studentId)
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = "login.html"
}

// Show popup function
function showPopup(popupId) {
  const popup = document.getElementById(popupId)
  if (popup) {
    popup.style.display = "flex"
  }
}

