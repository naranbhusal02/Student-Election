// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  checkUserLogin()

  // Initialize user profile
  initUserProfile()

  // Initialize sidebar navigation
  initSidebarNav()

  // Initialize position tabs
  initPositionTabs()

  // Initialize results tabs
  initResultsTabs()

  // Initialize vote buttons
  initVoteButtons()
})

// Check if user is logged in
function checkUserLogin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (!currentUser) {
    // Redirect to login page
    window.location.href = "login.html"
  }
}

// Initialize user profile
function initUserProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (currentUser) {
    // Update user name and ID
    const userNameElements = document.querySelectorAll("#userName, #welcomeUserName")
    const userStudentIdElement = document.getElementById("userStudentId")

    userNameElements.forEach((el) => {
      if (el) el.textContent = currentUser.fullName
    })

    if (userStudentIdElement) {
      userStudentIdElement.textContent = `ID: ${currentUser.studentId}`
    }

    // Handle logout
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()

        // Remove current user from localStorage
        localStorage.removeItem("currentUser")

        // Redirect to login page
        window.location.href = "login.html"
      })
    }

    // Update vote buttons based on user's voting status
    updateVoteButtons(currentUser.votingStatus)
  }
}

// Initialize sidebar navigation
function initSidebarNav() {
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a")
  const contentSections = document.querySelectorAll(".content-section")

  if (sidebarLinks.length && contentSections.length) {
    // Hide all sections except the first one
    contentSections.forEach((section, index) => {
      if (index !== 0) {
        section.style.display = "none"
      }
    })

    // Add click event to sidebar links
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()

        // Get target section ID
        const targetId = link.getAttribute("href")

        // Hide all sections
        contentSections.forEach((section) => {
          section.style.display = "none"
        })

        // Show target section
        document.querySelector(targetId).style.display = "block"

        // Update active link
        sidebarLinks.forEach((l) => {
          l.parentElement.classList.remove("active")
        })

        link.parentElement.classList.add("active")
      })
    })
  }
}

// Initialize position tabs
function initPositionTabs() {
  const positionTabs = document.querySelectorAll(".position-tab")
  const positionCandidates = document.querySelectorAll(".position-candidates")

  if (positionTabs.length && positionCandidates.length) {
    positionTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Get position
        const position = tab.getAttribute("data-position")

        // Update active tab
        positionTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")

        // Show corresponding candidates
        positionCandidates.forEach((candidates) => {
          candidates.classList.remove("active")

          if (candidates.getAttribute("data-position") === position) {
            candidates.classList.add("active")
          }
        })
      })
    })
  }
}

// Initialize results tabs
function initResultsTabs() {
  const resultsTabs = document.querySelectorAll(".results-tab")
  const resultsPositions = document.querySelectorAll(".results-position")

  if (resultsTabs.length && resultsPositions.length) {
    resultsTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Get position
        const position = tab.getAttribute("data-position")

        // Update active tab
        resultsTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")

        // Show corresponding results
        resultsPositions.forEach((results) => {
          results.classList.remove("active")

          if (results.getAttribute("data-position") === position) {
            results.classList.add("active")
          }
        })
      })
    })
  }
}

// Initialize vote buttons
function initVoteButtons() {
  const voteButtons = document.querySelectorAll(".btn-vote")

  if (voteButtons.length) {
    voteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Get candidate and position
        const candidate = button.getAttribute("data-candidate")
        const position = button.getAttribute("data-position")

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem("currentUser"))

        // Check if user has already voted for this position
        if (currentUser.votingStatus[getPositionKey(position)]) {
          showPopup("popup")
          document.getElementById("popupTitle").textContent = "Already Voted"
          document.getElementById("popupMessage").textContent = `You have already voted for the ${position} position.`

          // Update popup footer
          const popupFooter = document.querySelector("#popup .popup-footer")
          popupFooter.innerHTML = `
            <button class="btn btn-primary" onclick="closePopup('popup')">OK</button>
          `

          return
        }

        // Show confirmation popup
        showPopup("voteConfirmationPopup")

        // Update candidate name and position
        document.getElementById("selectedCandidateName").textContent = getCandidateName(candidate)
        document.getElementById("selectedPosition").textContent = position

        // Set up confirm vote button
        const confirmVoteBtn = document.getElementById("confirmVoteBtn")
        confirmVoteBtn.onclick = () => {
          // Record vote
          recordVote(candidate, position)

          // Close confirmation popup
          closePopup("voteConfirmationPopup")

          // Show success popup
          showPopup("successPopup")

          // Update vote button
          button.classList.add("voted")
          button.disabled = true
          button.innerHTML = '<i class="fas fa-check-circle"></i> Voted'

          // Update other buttons for the same position
          const positionButtons = document.querySelectorAll(`.btn-vote[data-position="${position}"]`)
          positionButtons.forEach((btn) => {
            if (btn !== button) {
              btn.classList.add("disabled")
              btn.disabled = true
              btn.innerHTML = '<i class="fas fa-ban"></i> Already Voted'
            }
          })
        }
      })
    })
  }
}

// Record vote
function recordVote(candidate, position) {
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // Update voting status
  currentUser.votingStatus[getPositionKey(position)] = true

  // Save updated user data
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  // Update users array
  const users = JSON.parse(localStorage.getItem("users")) || []
  const userIndex = users.findIndex((user) => user.email === currentUser.email)

  if (userIndex !== -1) {
    users[userIndex].votingStatus = currentUser.votingStatus
    localStorage.setItem("users", JSON.stringify(users))
  }

  // Record vote in votes array
  const votes = JSON.parse(localStorage.getItem("votes")) || {}

  // Initialize position if it doesn't exist
  if (!votes[position]) {
    votes[position] = {}
  }

  // Initialize candidate if it doesn't exist
  if (!votes[position][candidate]) {
    votes[position][candidate] = 0
  }

  // Increment vote count
  votes[position][candidate]++

  // Save votes
  localStorage.setItem("votes", JSON.stringify(votes))

  // Update results display
  updateResults()
}

// Update vote buttons based on user's voting status
function updateVoteButtons(votingStatus) {
  for (const position in votingStatus) {
    if (votingStatus[position]) {
      const positionName = getPositionName(position)
      const positionButtons = document.querySelectorAll(`.btn-vote[data-position="${positionName}"]`)

      // Find the voted candidate
      const votes = JSON.parse(localStorage.getItem("votes")) || {}
      let votedCandidate = null

      if (votes[positionName]) {
        for (const candidate in votes[positionName]) {
          // This is a simplification - in a real app, you'd track which candidate each user voted for
          votedCandidate = candidate
          break
        }
      }

      positionButtons.forEach((button) => {
        if (button.getAttribute("data-candidate") === votedCandidate) {
          button.classList.add("voted")
          button.disabled = true
          button.innerHTML = '<i class="fas fa-check-circle"></i> Voted'
        } else {
          button.classList.add("disabled")
          button.disabled = true
          button.innerHTML = '<i class="fas fa-ban"></i> Already Voted'
        }
      })
    }
  }
}

// Update results display
function updateResults() {
  const votes = JSON.parse(localStorage.getItem("votes")) || {}

  // For each position
  for (const position in votes) {
    let totalVotes = 0

    // Calculate total votes for this position
    for (const candidate in votes[position]) {
      totalVotes += votes[position][candidate]
    }

    // Update result cards
    const resultCards = document.querySelectorAll(`.results-position[data-position="${position}"] .result-card`)

    resultCards.forEach((card) => {
      const candidateName = card.querySelector(".candidate-name").textContent
      const candidateKey = getCandidateKey(candidateName)

      if (votes[position][candidateKey]) {
        const voteCount = votes[position][candidateKey]
        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0

        // Update progress bar
        card.querySelector(".vote-progress").style.width = `${percentage}%`

        // Update percentage
        card.querySelector(".vote-percentage").textContent = `${percentage}%`

        // Update vote count
        card.querySelector(".vote-count").textContent = `${voteCount} votes`
      }
    })
  }

  // Update total votes
  const totalVotesElement = document.querySelector(".votes-count")
  if (totalVotesElement) {
    let totalVotes = 0

    // Calculate total votes across all positions
    for (const position in votes) {
      for (const candidate in votes[position]) {
        totalVotes += votes[position][candidate]
      }
    }

    totalVotesElement.textContent = totalVotes

    // Update participation rate
    const participationRateElement = document.querySelectorAll(".votes-count")[2]
    if (participationRateElement) {
      const eligibleVoters = 1200 // This would come from your database in a real app
      const participationRate = Math.round((totalVotes / (eligibleVoters * 4)) * 100) // 4 positions
      participationRateElement.textContent = `${participationRate}%`
    }
  }
}

// Helper functions
function getPositionKey(position) {
  // Convert position name to camelCase for object key
  const positionMap = {
    president: "president",
    "vice-president": "vicePresident",
    secretary: "secretary",
    treasurer: "treasurer",
  }

  return positionMap[position.toLowerCase()] || position.toLowerCase()
}

function getPositionName(positionKey) {
  // Convert position key to display name
  const positionMap = {
    president: "president",
    vicePresident: "vice-president",
    secretary: "secretary",
    treasurer: "treasurer",
  }

  return positionMap[positionKey] || positionKey
}

function getCandidateName(candidateKey) {
  // Convert candidate key to display name
  const candidateMap = {
    "alex-johnson": "Alex Johnson",
    "sophia-lee": "Sophia Lee",
    "michael-brown": "Michael Brown",
    "maria-garcia": "Maria Garcia",
    "james-wilson": "James Wilson",
    "david-kim": "David Kim",
    "emily-chen": "Emily Chen",
    "sarah-patel": "Sarah Patel",
    "ryan-thompson": "Ryan Thompson",
  }

  return candidateMap[candidateKey] || candidateKey
}

function getCandidateKey(candidateName) {
  // Convert candidate name to key
  return candidateName.toLowerCase().replace(/\s+/g, "-")
}

// Mock showPopup function
function showPopup(popupId) {
  const popup = document.getElementById(popupId)
  if (popup) {
    popup.style.display = "block"
  }
}

// Mock closePopup function
function closePopup(popupId) {
  const popup = document.getElementById(popupId)
  if (popup) {
    popup.style.display = "none"
  }
}

