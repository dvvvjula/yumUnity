// Gallery images data
const galleryImages = [
  ["/pictures/pic-hp-gallery-1.jpg", "/pictures/pic-hp-gallery-1-alt.jpg"],
  ["/pictures/pic-hp-gallery-2.jpg", "/pictures/pic-hp-gallery-2-alt.jpg"],
]

// User data storage
const userData = {
  username: "xyz",
  profileImage: "https://storage.googleapis.com/a1aa/image/426f1e38-5fc2-4d39-c2d3-4eaa3829ce7c.jpg",
  bio: "Lorem ipsum dolor amet, consectetur adipiscing elit. Massa imperdiet eget eget netusque semper purus amet viverra. Fermentum vel lectus odio euq est nulla. Condimentum penatibus faucibus nec mollis nullam ac mattis, ac ultrices fermentum consectetur eu iaculis. Interdum sit per pellentesque orci accumsan ut condimentum eu bibendum praesent dictum.",
  mealSchedule: {
    breakfast: "08:00",
    lunch: "12:00",
    dinner: "18:00",
    snack: "15:00",
  },
  qaAnswers: {
    qa1: "Italian cuisine with fresh pasta and tomatoes.",
    qa2: "I'm vegetarian and avoid spicy food.",
    qa3: "Intermediate - I love trying new recipes!",
  },
}

// Used usernames (simulated database)
const usedUsernames = ["admin", "user", "test", "demo", "xyz"]

// Calendar generation
function generateCalendar() {
  const calendarBody = document.getElementById("calendarBody")
  const calendarTitle = document.getElementById("calendarTitle")
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]

  calendarTitle.textContent = `${monthNames[month]} '${year.toString().slice(-2)}`

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  calendarBody.innerHTML = ""

  let date = 1
  let nextMonthDate = 1

  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr")

    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td")

      if (i === 0 && j < firstDay) {
        const prevDate = daysInPrevMonth - firstDay + j + 1
        cell.textContent = prevDate
        cell.classList.add("outside")
      } else if (date > daysInMonth) {
        cell.textContent = nextMonthDate
        cell.classList.add("outside")
        nextMonthDate++
      } else {
        cell.textContent = date

        if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          cell.classList.add("today")
        }

        date++
      }

      row.appendChild(cell)
    }

    calendarBody.appendChild(row)

    if (date > daysInMonth) {
      break
    }
  }
}

// Navigation functions
function goToPage(page) {
  console.log(`Navigating to ${page}`)
  window.location.href = page
}

function toggleFriendsPanel() {
  console.log("Toggle friends panel")
}

function toggleNotificationsPanel() {
  console.log("Toggle notifications panel")
}

// Settings panel functions
function openSettings() {
  const settingsPanel = document.getElementById("settingsPanel")
  settingsPanel.classList.add("active")

  // Load current values
  document.getElementById("usernameInput").value = userData.username
  document.getElementById("bioInput").value = userData.bio
  document.getElementById("breakfastTimeInput").value = userData.mealSchedule.breakfast
  document.getElementById("lunchTimeInput").value = userData.mealSchedule.lunch
  document.getElementById("dinnerTimeInput").value = userData.mealSchedule.dinner
  document.getElementById("snackTimeInput").value = userData.mealSchedule.snack

  // Load Q&A answers
  document.getElementById("qa1Input").value = userData.qaAnswers.qa1
  document.getElementById("qa2Input").value = userData.qaAnswers.qa2
  document.getElementById("qa3Input").value = userData.qaAnswers.qa3
}

function closeSettings() {
  const settingsPanel = document.getElementById("settingsPanel")
  settingsPanel.classList.remove("active")

  // Reset form
  document.getElementById("settingsForm").reset()
  document.getElementById("imagePreview").innerHTML = ""
  resetPasswordRequirements()
  updateSaveButton()
}

// Password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
  }

  // Update UI
  updateRequirement("lengthReq", requirements.length)
  updateRequirement("numberReq", requirements.number)
  updateRequirement("uppercaseReq", requirements.uppercase)

  return Object.values(requirements).every((req) => req)
}

function updateRequirement(id, isValid) {
  const element = document.getElementById(id)
  const icon = element.querySelector("i")
  const span = element.querySelector("span")

  if (isValid) {
    element.classList.remove("invalid")
    element.classList.add("valid")
    icon.classList.remove("fa-times")
    icon.classList.add("fa-check")
    span.style.color = "#94ADE2"
    icon.style.color = "#94ADE2"
  } else {
    element.classList.remove("valid")
    element.classList.add("invalid")
    icon.classList.remove("fa-check")
    icon.classList.add("fa-times")
    span.style.color = "black"
    icon.style.color = "black"
  }
}

function resetPasswordRequirements() {
  ;["lengthReq", "numberReq", "uppercaseReq"].forEach((id) => {
    updateRequirement(id, false)
  })
}

// Username validation
function validateUsername(username) {
  const trimmed = username.trim()
  const errorDiv = document.getElementById("usernameError")

  if (trimmed.length < 3) {
    errorDiv.textContent = "Username must be at least 3 characters"
    return false
  }

  if (trimmed !== userData.username && usedUsernames.includes(trimmed.toLowerCase())) {
    errorDiv.textContent = "Username already taken"
    return false
  }

  errorDiv.textContent = ""
  return true
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const icon = document.getElementById("passwordToggleIcon")

  if (input.type === "password") {
    input.type = "text"
    icon.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    icon.className = "fas fa-eye"
  }
}

// Update save button state
function updateSaveButton() {
  const username = document.getElementById("usernameInput").value
  const password = document.getElementById("passwordInput").value
  const bio = document.getElementById("bioInput").value
  const saveButton = document.getElementById("saveButton")

  const isUsernameValid = validateUsername(username)
  const isPasswordValid = password === "" || validatePassword(password)
  const hasChanges =
    username !== userData.username ||
    bio !== userData.bio ||
    password !== "" ||
    document.getElementById("profileImageInput").files.length > 0 ||
    document.getElementById("breakfastTimeInput").value !== userData.mealSchedule.breakfast ||
    document.getElementById("lunchTimeInput").value !== userData.mealSchedule.lunch ||
    document.getElementById("dinnerTimeInput").value !== userData.mealSchedule.dinner ||
    document.getElementById("snackTimeInput").value !== userData.mealSchedule.snack ||
    document.getElementById("qa1Input").value !== userData.qaAnswers.qa1 ||
    document.getElementById("qa2Input").value !== userData.qaAnswers.qa2 ||
    document.getElementById("qa3Input").value !== userData.qaAnswers.qa3

  saveButton.disabled = !(isUsernameValid && isPasswordValid && hasChanges)
}

// Handle image preview
function handleImagePreview(file) {
  const preview = document.getElementById("imagePreview")

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Profile preview">`
    }
    reader.readAsDataURL(file)
  } else {
    preview.innerHTML = ""
  }
}

// Save settings
function saveSettings(event) {
  event.preventDefault()

  const username = document.getElementById("usernameInput").value.trim()
  const bio = document.getElementById("bioInput").value.trim()
  const password = document.getElementById("passwordInput").value
  const imageFile = document.getElementById("profileImageInput").files[0]

  // Update username
  if (username !== userData.username) {
    userData.username = username
    document.getElementById("profileUsername").textContent = username

    // Remove old username from used list and add new one
    const oldIndex = usedUsernames.indexOf(userData.username)
    if (oldIndex > -1) {
      usedUsernames.splice(oldIndex, 1)
    }
    usedUsernames.push(username.toLowerCase())
  }

  // Update bio
  if (bio !== userData.bio) {
    userData.bio = bio
    document.getElementById("profileBio").textContent = bio
  }

  // Update profile image
  if (imageFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userData.profileImage = e.target.result
      document.getElementById("profileImg").src = e.target.result
    }
    reader.readAsDataURL(imageFile)
  }

  // Update meal schedule
  userData.mealSchedule = {
    breakfast: document.getElementById("breakfastTimeInput").value,
    lunch: document.getElementById("lunchTimeInput").value,
    dinner: document.getElementById("dinnerTimeInput").value,
    snack: document.getElementById("snackTimeInput").value,
  }

  // Update Q&A answers
  userData.qaAnswers = {
    qa1: document.getElementById("qa1Input").value,
    qa2: document.getElementById("qa2Input").value,
    qa3: document.getElementById("qa3Input").value,
  }

  updateMealScheduleDisplay()
  updateQADisplay()

  // Show success message
  alert("Settings saved successfully!")
  closeSettings()
}

// Update meal schedule display
function updateMealScheduleDisplay() {
  document.getElementById("breakfastTime").textContent = userData.mealSchedule.breakfast
  document.getElementById("lunchTime").textContent = userData.mealSchedule.lunch
  document.getElementById("dinnerTime").textContent = userData.mealSchedule.dinner
  document.getElementById("snackTime").textContent = userData.mealSchedule.snack
}

// Update Q&A display
function updateQADisplay() {
  document.getElementById("qa1").textContent = userData.qaAnswers.qa1
  document.getElementById("qa2").textContent = userData.qaAnswers.qa2
  document.getElementById("qa3").textContent = userData.qaAnswers.qa3
}

// Gallery navigation
function navigateGallery(direction, cardIndex) {
  const img = document.querySelector(`[data-index="${cardIndex}"] .gallery-image`)
  const currentIndex = Number.parseInt(img.dataset.current)
  const images = galleryImages[cardIndex]

  let newIndex
  if (direction === "left") {
    newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  } else {
    newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
  }

  img.src = images[newIndex]
  img.dataset.current = newIndex
}

// Like functionality
function toggleLike(button) {
  button.classList.toggle("active")
  const likeCount = button.querySelector(".like-count")
  let count = Number.parseInt(likeCount.textContent)

  if (button.classList.contains("active")) {
    count++
  } else {
    count--
  }

  likeCount.textContent = count
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  generateCalendar()
  updateMealScheduleDisplay()
  updateQADisplay()

  // Settings icon click handler
  const settingsIcon = document.getElementById("settingsIcon")
  settingsIcon.addEventListener("click", openSettings)

  // Form event listeners
  const usernameInput = document.getElementById("usernameInput")
  const passwordInput = document.getElementById("passwordInput")
  const bioInput = document.getElementById("bioInput")
  const profileImageInput = document.getElementById("profileImageInput")
  const settingsForm = document.getElementById("settingsForm")

  usernameInput.addEventListener("input", updateSaveButton)
  bioInput.addEventListener("input", updateSaveButton)
  passwordInput.addEventListener("input", function () {
    if (this.value) {
      validatePassword(this.value)
    } else {
      resetPasswordRequirements()
    }
    updateSaveButton()
  })

  profileImageInput.addEventListener("change", function () {
    handleImagePreview(this.files[0])
    updateSaveButton()
  })

  // Meal schedule inputs
  ;["breakfastTimeInput", "lunchTimeInput", "dinnerTimeInput", "snackTimeInput"].forEach((id) => {
    document.getElementById(id).addEventListener("change", updateSaveButton)
  })

  // Q&A inputs
  ;["qa1Input", "qa2Input", "qa3Input"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateSaveButton)
  })

  settingsForm.addEventListener("submit", saveSettings)

  // Like button click handlers
  const likeButtons = document.querySelectorAll(".like-btn")
  likeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      toggleLike(this)
    })
  })

  // Comment button click handlers
  const commentButtons = document.querySelectorAll(".comment-btn")
  commentButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".card")
      const cardIndex = Number.parseInt(card.dataset.index)
      console.log(`Show comments for card ${cardIndex}`)
    })
  })
})

// Close settings panel when clicking outside
document.addEventListener("click", (event) => {
  const settingsPanel = document.getElementById("settingsPanel")
  const settingsIcon = document.getElementById("settingsIcon")

  if (
    settingsPanel.classList.contains("active") &&
    !settingsPanel.contains(event.target) &&
    !settingsIcon.contains(event.target)
  ) {
    closeSettings()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  const settingsPanel = document.getElementById("settingsPanel")

  if (event.key === "Escape" && settingsPanel.classList.contains("active")) {
    closeSettings()
  }
})
