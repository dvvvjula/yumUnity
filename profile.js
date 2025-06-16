// Sample notifications data - Updated with English text and different times
const notifications = [
  {
    id: 1,
    text: "Sarah liked your breakfast post with avocado toast",
    time: "2 min ago",
  },
  {
    id: 2,
    text: "New friend request from Mike_FoodLover",
    time: "15 min ago",
  },
  {
    id: 3,
    text: "Your lunch photo got 5 new likes!",
    time: "1 hour ago",
  },
  {
    id: 4,
    text: "Emma commented: 'This looks delicious! Recipe please?'",
    time: "2 hours ago",
  },
  {
    id: 5,
    text: "You have a new follower: ChefMaster2024",
    time: "3 hours ago",
  },
  {
    id: 6,
    text: "Weekly meal summary is ready to view",
    time: "1 day ago",
  },
]

// Sample friends data
const friends = [
  {
    id: 1,
    name: "funycat123",
    avatar: "pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true,
  },
  {
    id: 2,
    name: "yumyum8",
    avatar: "pictures/hp-prof-2.jpg",
    status: "Last seen 2h ago",
    isActive: false,
  },
  {
    id: 3,
    name: "ilikefood1",
    avatar: "pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true,
  },
  {
    id: 4,
    name: "foodlover22",
    avatar: "pictures/hp-prof-2.jpg",
    status: "Last seen 1h ago",
    isActive: false,
  },
  {
    id: 5,
    name: "cookmaster",
    avatar: "pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true,
  },
  {
    id: 6,
    name: "healthyeats",
    avatar: "pictures/hp-prof-2.jpg",
    status: "Last seen 30m ago",
    isActive: false,
  },
]

// Sample friend requests data
const friendRequests = [
  {
    id: 1,
    name: "foodlover22",
    avatar: "pictures/hp-prof-2.jpg",
    status: "Wants to be friends",
  },
  {
    id: 2,
    name: "cookmaster",
    avatar: "pictures/hp-prof-1.jpg",
    status: "Wants to be friends",
  },
  {
    id: 3,
    name: "healthyeats",
    avatar: "pictures/hp-prof-2.jpg",
    status: "Wants to be friends",
  },
]

let currentTab = "friendsList"
let searchQuery = ""

// User data storage - użyj danych z PHP jeśli dostępne
const userData = {
  username: window.currentUser ? window.currentUser.username : "user",
  email: window.currentUser ? window.currentUser.email : "user@example.com",
  profileImage: "pictures/hp-prof-1.jpg",
  bio: "new food this, new food that... i love pasta.",
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
const usedUsernames = ["admin", "user", "test", "demo"]

function toggleNotificationsPanel() {
  const panel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")

  // Close friends panel if open
  if (friendsPanel && friendsPanel.classList.contains("active")) {
    friendsPanel.classList.remove("active")
    friendsBtn.classList.remove("active")
  }

  if (panel.classList.contains("active")) {
    panel.classList.remove("active")
    notificationBtn.classList.remove("active")
  } else {
    panel.classList.add("active")
    notificationBtn.classList.add("active")
    populateNotifications()
  }
}

function toggleFriendsPanel() {
  const panel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")

  // Close notifications panel if open
  if (notificationsPanel && notificationsPanel.classList.contains("active")) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  if (panel.classList.contains("active")) {
    panel.classList.remove("active")
    friendsBtn.classList.remove("active")
  } else {
    panel.classList.add("active")
    friendsBtn.classList.add("active")
    populateFriendsContent()
  }
}

function searchFriends() {
  const searchInput = document.getElementById("friendSearchInput")
  searchQuery = searchInput.value.toLowerCase().trim()
  populateFriendsContent()
}

function populateNotifications() {
  const content = document.getElementById("notificationsContent")
  content.innerHTML = ""

  notifications.forEach((notification) => {
    const notificationElement = document.createElement("div")
    notificationElement.className = "notification-item"
    notificationElement.innerHTML = `
      <p class="notification-text">${notification.text}</p>
      <span class="notification-time">${notification.time}</span>
    `
    content.appendChild(notificationElement)
  })
}

function populateFriendsContent() {
  const content = document.getElementById("friendsContent")
  content.innerHTML = ""

  if (currentTab === "friendsList") {
    // Filter friends based on search query
    const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery))

    if (filteredFriends.length === 0 && searchQuery) {
      content.innerHTML = '<div class="friend-item"><p class="friend-name">No friends found</p></div>'
      return
    }

    filteredFriends.forEach((friend) => {
      const friendElement = document.createElement("div")
      friendElement.className = "friend-item"
      friendElement.innerHTML = `
        <img src="${friend.avatar}" alt="Friend avatar" class="friend-avatar">
        <div class="friend-info">
          <p class="friend-name">${friend.name}</p>
          <p class="friend-status">${friend.status}</p>
        </div>
        ${friend.isActive ? '<span class="active-indicator"></span>' : ""}
      `
      content.appendChild(friendElement)
    })
  } else {
    // Filter friend requests based on search query
    const filteredRequests = friendRequests.filter((request) => request.name.toLowerCase().includes(searchQuery))

    if (filteredRequests.length === 0 && searchQuery) {
      content.innerHTML = '<div class="friend-item"><p class="friend-name">No requests found</p></div>'
      return
    }

    filteredRequests.forEach((request) => {
      const requestElement = document.createElement("div")
      requestElement.className = "friend-request"
      requestElement.innerHTML = `
        <img src="${request.avatar}" alt="Friend request avatar" class="friend-avatar">
        <div class="friend-info">
          <p class="friend-name">${request.name}</p>
          <p class="friend-status">${request.status}</p>
        </div>
        <div class="request-actions">
          <button class="accept-btn" title="Accept" onclick="acceptFriendRequest(${request.id})">
            <i class="fas fa-check"></i>
          </button>
          <button class="decline-btn" title="Decline" onclick="declineFriendRequest(${request.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `
      content.appendChild(requestElement)
    })
  }
}

function switchTab(tabName) {
  currentTab = tabName

  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  // Clear search when switching tabs
  searchQuery = ""
  document.getElementById("friendSearchInput").value = ""

  // Update content
  populateFriendsContent()
}

function acceptFriendRequest(requestId) {
  const requestIndex = friendRequests.findIndex((req) => req.id === requestId)
  if (requestIndex !== -1) {
    const request = friendRequests[requestIndex]
    // Add to friends list
    friends.push({
      id: Date.now(),
      name: request.name,
      avatar: request.avatar,
      status: "Active now",
      isActive: true,
    })
    // Remove from requests
    friendRequests.splice(requestIndex, 1)

    // Update displays
    populateFriendsContent()
    updateFriendRequestBadge()
  }
}

function declineFriendRequest(requestId) {
  const requestIndex = friendRequests.findIndex((req) => req.id === requestId)
  if (requestIndex !== -1) {
    friendRequests.splice(requestIndex, 1)
    populateFriendsContent()
    updateFriendRequestBadge()
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge")
  const count = notifications.length

  if (count > 0) {
    badge.textContent = count > 9 ? "9+" : count.toString()
    badge.style.display = "flex"
  } else {
    badge.style.display = "none"
  }
}

function updateFriendRequestBadge() {
  const badge = document.getElementById("friendRequestBadge")
  const count = friendRequests.length

  if (count > 0) {
    badge.textContent = count > 9 ? "9+" : count.toString()
    badge.style.display = "flex"
  } else {
    badge.style.display = "none"
  }

  // Update tab count
  const tabCount = document.querySelector(".request-count")
  if (tabCount) {
    tabCount.textContent = count.toString()
  }
}

// Close panels when clicking outside
document.addEventListener("click", (event) => {
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")
  const settingsPanel = document.getElementById("settingsPanel")
  const settingsIcon = document.getElementById("settingsIcon")

  // Close notifications panel
  if (
    notificationsPanel &&
    notificationsPanel.classList.contains("active") &&
    !notificationsPanel.contains(event.target) &&
    !notificationBtn.contains(event.target)
  ) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  // Close friends panel
  if (
    friendsPanel &&
    friendsPanel.classList.contains("active") &&
    !friendsPanel.contains(event.target) &&
    !friendsBtn.contains(event.target)
  ) {
    friendsPanel.classList.remove("active")
    friendsBtn.classList.remove("active")
  }

  // Close settings panel
  if (
    settingsPanel.classList.contains("active") &&
    !settingsPanel.contains(event.target) &&
    !settingsIcon.contains(event.target)
  ) {
    closeSettings()
  }
})

// Gallery images data
const galleryImages = [
  ["pictures/pic-hp-gallery-1.jpg", "pictures/pic-hp-gallery-1-alt.jpg"],
  ["pictures/pic-hp-gallery-2.jpg", "pictures/pic-hp-gallery-2-alt.jpg"],
]

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

// Settings panel functions
async function openSettings() {
  const settingsPanel = document.getElementById("settingsPanel")
  settingsPanel.classList.add("active")

  try {
    const response = await fetch("api/profile.php")
    const data = await response.json()

    if (data.success) {
      const profile = data.profile

      // Load current values
      document.getElementById("usernameInput").value = profile.username || ""
      document.getElementById("bioInput").value = profile.bio || ""

      // Update userData object
      userData.username = profile.username || ""
      userData.bio = profile.bio || ""
    }
  } catch (error) {
    console.error("Error loading profile data:", error)
    // Fallback to current values
    document.getElementById("usernameInput").value = userData.username
    document.getElementById("bioInput").value = userData.bio
  }

  // Load other settings...
  document.getElementById("breakfastTimeInput").value = userData.mealSchedule.breakfast
  document.getElementById("lunchTimeInput").value = userData.mealSchedule.lunch
  document.getElementById("dinnerTimeInput").value = userData.mealSchedule.dinner
  document.getElementById("snackTimeInput").value = userData.mealSchedule.snack

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
async function saveSettings(event) {
  event.preventDefault()

  const username = document.getElementById("usernameInput").value.trim()
  const bio = document.getElementById("bioInput").value.trim()
  const password = document.getElementById("passwordInput").value
  const imageFile = document.getElementById("profileImageInput").files[0]

  try {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("bio", bio)
    if (password) {
      formData.append("password", password)
    }
    if (imageFile) {
      formData.append("profile_image", imageFile)
    }

    const response = await fetch("api/profile.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      // Update local data
      userData.username = username
      userData.bio = bio

      // Update display
      document.getElementById("profileUsername").textContent = username
      document.getElementById("profileBio").textContent = bio

      if (imageFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
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

      alert("Settings saved successfully!")
      closeSettings()
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error("Error saving settings:", error)
    alert("Error saving settings. Please try again.")
  }
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

  // Get user posts from localStorage
  const savedPosts = localStorage.getItem("userPosts")
  const userPosts = savedPosts ? JSON.parse(savedPosts) : []

  let images
  if (userPosts.length > cardIndex) {
    // Use user post images
    images = userPosts[cardIndex].images
  } else {
    // Use default gallery images
    images = galleryImages[cardIndex] || ["pictures/pic-hp-gallery-1.jpg"]
  }

  let newIndex
  if (direction === "left") {
    newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  } else {
    newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
  }

  img.src = images[newIndex]
  img.dataset.current = newIndex
}

// Like functionality - FIXED FOR PROFILE PAGE
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

// Funkcja do wyświetlania postów użytkownika z API
async function displayUserPosts() {
  const postsContainer = document.querySelector(".recent-friends-cards")
  if (!postsContainer) return

  try {
    // Pobierz posty użytkownika z API
    const response = await fetch(`api/posts.php?user_id=${window.currentUser?.id || 1}`)
    const data = await response.json()

    if (data.success && data.posts.length > 0) {
      // Wyczyść istniejące posty
      postsContainer.innerHTML = ""

      // Wyświetl maksymalnie 3 najnowsze posty
      const recentPosts = data.posts.slice(0, 3)

      recentPosts.forEach((post, index) => {
        const postElement = document.createElement("article")
        postElement.className = "card"
        postElement.dataset.index = index
        postElement.dataset.postId = post.id

        // Utwórz galerię zdjęć
        const galleryImages = post.images && post.images.length > 0 ? post.images : ["pictures/pic-hp-gallery-1.jpg"]

        postElement.innerHTML = `
          <div class="gallery-image-container">
            <img
              alt="User meal"
              src="${galleryImages[0]}"
              loading="lazy"
              class="gallery-image"
              data-current="0"
            />
            <button
              aria-label="Previous meal"
              class="gallery-arrow left"
              type="button"
              onclick="navigateGallery('left', ${index})"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              aria-label="Next meal"
              class="gallery-arrow right"
              type="button"
              onclick="navigateGallery('right', ${index})"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="flex items-center mt-3 justify-end">
            <div class="flex space-x-3 text-[12px] text-black">
              <button
                aria-label="Comment on meal"
                class="comment-btn"
                type="button"
                onclick="toggleComments(${post.id})"
              >
                <i class="fas fa-comment"></i>
                <span class="comment-count">${post.comments_count || 0}</span>
              </button>
              <button
                aria-label="Like meal"
                class="like-btn"
                type="button"
                onclick="toggleLike(this)"
              >
                <i class="fas fa-heart"></i>
                <span class="like-count">${post.likes_count || 0}</span>
              </button>
            </div>
          </div>
          <div class="avatar-username mt-3">
            <img
              alt="Your avatar"
              class="w-5 h-5 object-cover border border-black"
              height="20"
              src="${post.profile_image || "pictures/hp-prof-1.jpg"}"
              width="20"
            />
            <p class="text-[10px] font-sans select-none">${post.username}</p>
          </div>
          <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none card-description">
            ${post.description}
          </p>
          <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none">
            <strong>Type:</strong> ${post.meal_type.charAt(0).toUpperCase() + post.meal_type.slice(1)}
            ${post.calories ? ` • <strong>Calories:</strong> ${post.calories}` : ""}
          </p>
          <div class="comments-container" id="comments-${post.id}"></div>
        `

        postsContainer.appendChild(postElement)
      })
    }
  } catch (error) {
    console.error("Error loading user posts:", error)
  }
}

// Dodaj funkcje do obsługi komentarzy w profilu
async function toggleComments(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`)

  if (commentsContainer.classList.contains("active")) {
    commentsContainer.classList.remove("active")
    return
  }

  try {
    const response = await fetch(`api/comments.php?post_id=${postId}`)
    const data = await response.json()

    if (data.success) {
      displayComments(commentsContainer, data.comments, postId)
      commentsContainer.classList.add("active")
    }
  } catch (error) {
    console.error("Error loading comments:", error)
  }
}

function displayComments(container, comments, postId) {
  container.innerHTML = ""

  // Add comment input
  const inputDiv = document.createElement("div")
  inputDiv.className = "comment-input-container"
  inputDiv.innerHTML = `
    <input type="text" placeholder="Add a comment..." class="comment-input" id="comment-input-${postId}">
    <button onclick="addComment(${postId})" class="comment-submit-btn">Post</button>
  `
  container.appendChild(inputDiv)

  // Add existing comments
  comments.forEach((comment) => {
    const commentDiv = document.createElement("div")
    commentDiv.className = "comment-item"
    commentDiv.innerHTML = `
      <div class="comment-author">${comment.username}</div>
      <div class="comment-text">${comment.content}</div>
      <div class="comment-time">${new Date(comment.created_at).toLocaleTimeString()}</div>
    `
    container.appendChild(commentDiv)
  })
}

async function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`)
  const content = input.value.trim()

  if (!content) return

  try {
    const formData = new FormData()
    formData.append("post_id", postId)
    formData.append("content", content)

    const response = await fetch("api/comments.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      input.value = ""
      // Reload comments
      toggleComments(postId)
      toggleComments(postId)

      // Update comment count
      const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
      const countSpan = commentBtn.querySelector(".comment-count")
      countSpan.textContent = Number.parseInt(countSpan.textContent) + 1
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error("Error adding comment:", error)
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  generateCalendar()
  updateMealScheduleDisplay()
  updateQADisplay()
  updateNotificationBadge()
  updateFriendRequestBadge()
  displayUserPosts()

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

  // FIXED: Add like button click handlers for profile page
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
      const postId = card.dataset.postId
      if (postId) {
        toggleComments(postId)
      }
    })
  })

  // Add tab click listeners
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab)
    })
  })

  // Add search functionality
  const searchInput = document.getElementById("friendSearchInput")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchFriends()
      }
    })

    // Real-time search as user types
    searchInput.addEventListener("input", function () {
      searchQuery = this.value.toLowerCase().trim()
      populateFriendsContent()
    })
  }

  // Add search button functionality
  const searchBtn = document.querySelector(".search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", searchFriends)
  }
})

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  const settingsPanel = document.getElementById("settingsPanel")
  const notificationsPanel = document.getElementById("notificationsPanel")
  const friendsPanel = document.getElementById("friendsPanel")

  if (event.key === "Escape") {
    if (settingsPanel.classList.contains("active")) {
      closeSettings()
    }
    if (notificationsPanel && notificationsPanel.classList.contains("active")) {
      notificationsPanel.classList.remove("active")
      document.getElementById("nav-notifications").classList.remove("active")
    }
    if (friendsPanel && friendsPanel.classList.contains("active")) {
      friendsPanel.classList.remove("active")
      document.getElementById("nav-friends").classList.remove("active")
    }
  }
})
