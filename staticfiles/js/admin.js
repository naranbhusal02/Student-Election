import { Chart } from "@/components/ui/chart"
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is admin
  checkAdminLogin()

  // Initialize sidebar navigation
  initSidebarNav()

  // Initialize charts
  initCharts()

  // Initialize data tables
  initDataTables()

  // Initialize admin actions
  initAdminActions()
})

// Check if user is admin
function checkAdminLogin() {
  // In a real application, you would check if the user is an admin
  // For this demo, we'll just check if there's a currentAdmin in localStorage
  const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin"))

  // For demo purposes, create an admin if none exists
  if (!currentAdmin) {
    const adminUser = {
      name: "Admin User",
      email: "admin@university.edu",
      role: "Election Administrator",
      password: "admin123",
    }

    localStorage.setItem("currentAdmin", JSON.stringify(adminUser))
  }

  // Handle logout
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove current admin from localStorage
      localStorage.removeItem("currentAdmin")

      // Redirect to login page
      window.location.href = "index.html"
    })
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

// Initialize charts
function initCharts() {
  // Activity Chart
  const activityChartCanvas = document.getElementById("activityChart")

  if (activityChartCanvas) {
    const ctx = activityChartCanvas.getContext("2d")

    // Sample data
    const activityData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Votes Cast",
          data: [65, 120, 80, 95, 140, 80, 20],
          backgroundColor: "rgba(108, 99, 255, 0.2)",
          borderColor: "rgba(108, 99, 255, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    }

    // Chart options
    const activityOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(200, 200, 200, 0.1)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }

    // Create chart
    const activityChart = new Chart(ctx, {
      type: "line",
      data: activityData,
      options: activityOptions,
    })

    // Time range select
    const timeRangeSelect = document.getElementById("timeRangeSelect")
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener("change", () => {
        const value = timeRangeSelect.value

        // Update chart data based on selected time range
        if (value === "day") {
          activityChart.data.labels = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]
          activityChart.data.datasets[0].data = [10, 25, 30, 40, 35, 55, 45, 60, 30]
        } else if (value === "week") {
          activityChart.data.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          activityChart.data.datasets[0].data = [65, 120, 80, 95, 140, 80, 20]
        } else if (value === "month") {
          activityChart.data.labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
          activityChart.data.datasets[0].data = [250, 350, 300, 450]
        }

        activityChart.update()
      })
    }
  }

  // Department Chart
  const deptChartCanvas = document.getElementById("deptChart")

  if (deptChartCanvas) {
    const ctx = deptChartCanvas.getContext("2d")

    // Sample data
    const deptData = {
      labels: ["Computer Science", "Business", "Engineering", "Arts", "Medicine"],
      datasets: [
        {
          data: [65, 45, 70, 40, 55],
          backgroundColor: [
            "rgba(108, 99, 255, 0.7)",
            "rgba(255, 107, 107, 0.7)",
            "rgba(78, 205, 196, 0.7)",
            "rgba(255, 180, 95, 0.7)",
            "rgba(161, 97, 191, 0.7)",
          ],
          borderColor: [
            "rgba(108, 99, 255, 1)",
            "rgba(255, 107, 107, 1)",
            "rgba(78, 205, 196, 1)",
            "rgba(255, 180, 95, 1)",
            "rgba(161, 97, 191, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }

    // Chart options
    const deptOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    }

    // Create chart
    const deptChart = new Chart(ctx, {
      type: "pie",
      data: deptData,
      options: deptOptions,
    })

    // Chart type buttons
    const chartTypeBtns = document.querySelectorAll(".chart-type-btn")
    if (chartTypeBtns.length) {
      chartTypeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          // Update active button
          chartTypeBtns.forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")

          // Get chart type
          const type = btn.getAttribute("data-type")

          // Update chart type
          deptChart.config.type = type

          // Update options based on chart type
          if (type === "bar") {
            deptChart.options.plugins.legend.display = false
            deptChart.options.scales = {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(200, 200, 200, 0.1)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            }
          } else {
            deptChart.options.plugins.legend.display = true
            deptChart.options.scales = undefined
          }

          deptChart.update()
        })
      })
    }
  }
}

// Initialize data tables
function initDataTables() {
  // Select all checkbox
  const selectAllStudents = document.getElementById("selectAllStudents")
  const studentCheckboxes = document.querySelectorAll(".student-checkbox")

  if (selectAllStudents && studentCheckboxes.length) {
    selectAllStudents.addEventListener("change", () => {
      studentCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllStudents.checked
      })
    })

    studentCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Check if all checkboxes are checked
        const allChecked = Array.from(studentCheckboxes).every((cb) => cb.checked)
        selectAllStudents.checked = allChecked
      })
    })
  }
}

// Initialize admin actions
function initAdminActions() {
  // Add student button
  const addStudentBtn = document.getElementById("addStudentBtn")
  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
      showPopup("addStudentPopup")
    })
  }

  // Save student button
  const saveStudentBtn = document.getElementById("saveStudentBtn")
  if (saveStudentBtn) {
    saveStudentBtn.addEventListener("click", () => {
      // Get form values
      const studentName = document.getElementById("studentName").value
      const studentEmail = document.getElementById("studentEmail").value
      const studentId = document.getElementById("studentId").value
      const studentDepartment = document.getElementById("studentDepartment").value
      const studentPassword = document.getElementById("studentPassword").value

      // Validate form
      if (!studentName || !studentEmail || !studentId || !studentDepartment || !studentPassword) {
        alert("Please fill in all fields")
        return
      }

      // In a real application, you would save the student to a database
      // For this demo, we'll just close the popup
      closePopup("addStudentPopup")

      // Show success message
      showPopup("popup")
      document.getElementById("popupTitle").textContent = "Student Added"
      document.getElementById("popupMessage").textContent = `${studentName} has been added successfully.`

      // Update popup footer
      const popupFooter = document.querySelector("#popup .popup-footer")
      popupFooter.innerHTML = `
        <button class="btn btn-primary" onclick="closePopup('popup')">OK</button>
      `
    })
  }

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn")
  if (deleteButtons.length) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showPopup("deleteConfirmationPopup")

        // Set up confirm delete button
        const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
        confirmDeleteBtn.onclick = () => {
          // In a real application, you would delete the student from a database
          // For this demo, we'll just close the popup
          closePopup("deleteConfirmationPopup")

          // Show success message
          showPopup("popup")
          document.getElementById("popupTitle").textContent = "Student Deleted"
          document.getElementById("popupMessage").textContent = "The student has been deleted successfully."

          // Update popup footer
          const popupFooter = document.querySelector("#popup .popup-footer")
          popupFooter.innerHTML = `
            <button class="btn btn-primary" onclick="closePopup('popup')">OK</button>
          `
        }
      })
    })
  }

  // Election control button
  const electionControlBtn = document.getElementById("electionControlBtn")
  if (electionControlBtn) {
    electionControlBtn.addEventListener("click", () => {
      // Toggle button text and icon
      if (electionControlBtn.innerHTML.includes("Start")) {
        electionControlBtn.innerHTML = '<i class="fas fa-pause-circle"></i> Pause Election'
        electionControlBtn.classList.replace("btn-primary", "btn-warning")
      } else if (electionControlBtn.innerHTML.includes("Pause")) {
        electionControlBtn.innerHTML = '<i class="fas fa-play-circle"></i> Resume Election'
        electionControlBtn.classList.replace("btn-warning", "btn-success")
      } else {
        electionControlBtn.innerHTML = '<i class="fas fa-pause-circle"></i> Pause Election'
        electionControlBtn.classList.replace("btn-success", "btn-warning")
      }
    })
  }

  // Export data button
  const exportDataBtn = document.getElementById("exportDataBtn")
  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
      // In a real application, you would export the data to a file
      // For this demo, we'll just show a message
      showPopup("popup")
      document.getElementById("popupTitle").textContent = "Data Exported"
      document.getElementById("popupMessage").textContent = "The election data has been exported successfully."

      // Update popup footer
      const popupFooter = document.querySelector("#popup .popup-footer")
      popupFooter.innerHTML = `
        <button class="btn btn-primary" onclick="closePopup('popup')">OK</button>
      `
    })
  }
}

// Mock functions for showPopup and closePopup
function showPopup(popupId) {
  // In a real application, this function would display the popup with the given ID
  console.log("Showing popup:", popupId)
  document.getElementById(popupId).style.display = "block" // added to make it functional
}

function closePopup(popupId) {
  // In a real application, this function would close the popup with the given ID
  console.log("Closing popup:", popupId)
  document.getElementById(popupId).style.display = "none" // added to make it functional
}

