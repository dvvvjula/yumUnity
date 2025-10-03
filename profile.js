// user data storage - use php data if available
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

// used usernames (simulated database) for validation tests
const usedUsernames = ["admin", "user", "test", "demo"]

function toggleNotificationsPanel() {
  const panel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")

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

// for every notif in php table, display it
function populateNotifications() {
  const content = document.getElementById("notificationsContent")
  content.innerHTML = ""

  if (!window.notifications || window.notifications.length === 0) {
    content.innerHTML = "<p class='notification-empty'>Brak powiadomień.</p>"
    return
  }

  window.notifications.forEach((notification) => {
    const notificationElement = document.createElement("div")
    notificationElement.className = "notification-item"
    notificationElement.innerHTML = `
      <p class="notification-text">${notification.message}</p>
      <br>
      <span class="notification-time">${new Date(notification.created_at).toLocaleString()}</span>
    `
    content.appendChild(notificationElement)
  })
}


function populateFriendsContent() {
  const content = document.getElementById("friendsContent")
  content.innerHTML = ""

  if (currentTab === "friendsList") {
    // filter friends based on search query
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
    // filter friend requests based on search query
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

  // update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  // clear search when switching tabs
  searchQuery = ""
  document.getElementById("friendSearchInput").value = ""

  // update content
  populateFriendsContent()
}

function acceptFriendRequest(requestId) {
  const requestIndex = friendRequests.findIndex((req) => req.id === requestId)
  if (requestIndex !== -1) {
    const request = friendRequests[requestIndex]
    friends.push({
      id: Date.now(),
      name: request.name,
      avatar: request.avatar,
      status: "Active now",
      isActive: true,
    })
    friendRequests.splice(requestIndex, 1)

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

  const tabCount = document.querySelector(".request-count")
  if (tabCount) {
    tabCount.textContent = count.toString()
  }
}

document.addEventListener("click", (event) => {
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")
  const settingsPanel = document.getElementById("settingsPanel")
  const settingsIcon = document.getElementById("settingsIcon")

  if (
    notificationsPanel &&
    notificationsPanel.classList.contains("active") &&
    !notificationsPanel.contains(event.target) &&
    !notificationBtn.contains(event.target)
  ) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  if (
    friendsPanel &&
    friendsPanel.classList.contains("active") &&
    !friendsPanel.contains(event.target) &&
    !friendsBtn.contains(event.target)
  ) {
    friendsPanel.classList.remove("active")
    friendsBtn.classList.remove("active")
  }

  if (
    settingsPanel.classList.contains("active") &&
    !settingsPanel.contains(event.target) &&
    !settingsIcon.contains(event.target)
  ) {
    closeSettings()
  }
})

// gallery images data
const galleryImages = [
  ["pictures/pic-hp-gallery-1.jpg", "pictures/pic-hp-gallery-1-alt.jpg"],
  ["pictures/pic-hp-gallery-2.jpg", "pictures/pic-hp-gallery-2-alt.jpg"],
]

// calendar
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

// navigation functions
function goToPage(page) {
  console.log(`Navigating to ${page}`)
  window.location.href = page
}

// settings panel functions
async function openSettings() {
  const settingsPanel = document.getElementById("settingsPanel")
  settingsPanel.classList.add("active")

  try {
    const response = await fetch("api/profile.php")
    const data = await response.json()

    if (data.success) {
      const profile = data.profile

      // load current values
      document.getElementById("usernameInput").value = profile.username || ""
      document.getElementById("bioInput").value = profile.bio || ""

      // update userData object
      userData.username = profile.username || ""
      userData.bio = profile.bio || ""
    }
  } catch (error) {
    console.error("Error loading profile data:", error)
    // fallback to current values
    document.getElementById("usernameInput").value = userData.username
    document.getElementById("bioInput").value = userData.bio
  }

  // load other settings...
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

  document.getElementById("settingsForm").reset()
  document.getElementById("imagePreview").innerHTML = ""
  resetPasswordRequirements()
  updateSaveButton()
}

// password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
  }

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

// username validation
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

// toggle password visibility
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
      // update local data
      userData.username = username
      userData.bio = bio

      // update display
      document.getElementById("profileUsername").textContent = username
      document.getElementById("profileBio").textContent = bio

      if (imageFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          document.getElementById("profileImg").src = e.target.result
        }
        reader.readAsDataURL(imageFile)
      }

      // update meal schedule
      userData.mealSchedule = {
        breakfast: document.getElementById("breakfastTimeInput").value,
        lunch: document.getElementById("lunchTimeInput").value,
        dinner: document.getElementById("dinnerTimeInput").value,
        snack: document.getElementById("snackTimeInput").value,
      }

      // update q&a answers
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

// update meal schedule display
function updateMealScheduleDisplay() {
  document.getElementById("breakfastTime").textContent = userData.mealSchedule.breakfast
  document.getElementById("lunchTime").textContent = userData.mealSchedule.lunch
  document.getElementById("dinnerTime").textContent = userData.mealSchedule.dinner
  document.getElementById("snackTime").textContent = userData.mealSchedule.snack
}

// update q&a display
function updateQADisplay() {
  document.getElementById("qa1").textContent = userData.qaAnswers.qa1
  document.getElementById("qa2").textContent = userData.qaAnswers.qa2
  document.getElementById("qa3").textContent = userData.qaAnswers.qa3
}

function navigateGallery(direction, cardIndex) {
  const img = document.querySelector(`[data-index="${cardIndex}"] .gallery-image`)
  if (!img) return

  const currentIndex = Number.parseInt(img.dataset.current) || 0

  // get user posts from localStorage
  const savedPosts = localStorage.getItem("userPosts")
  const userPosts = savedPosts ? JSON.parse(savedPosts) : []

  let images
  if (userPosts.length > cardIndex) {
    // use user post images
    images = userPosts[cardIndex].images || ["pictures/pic-prof-gallery-1.jpg"]
  } else {
    // use default gallery images if needed (only for tests)
    const defaultGalleries = [
      [
        "pictures/pic-prof-gallery-1.jpg",
        "pictures/pic-prof-gallery-1-alt.jpg",
        "pictures/pic-prof-gallery-1-alt2.jpg",
      ], 
      [
        "pictures/pic-prof-gallery-2.jpg",
        "pictures/pic-prof-gallery-2-alt.jpg",
        "pictures/pic-prof-gallery-2-alt2.jpg",
      ],
    ]
    images = defaultGalleries[cardIndex] || ["pictures/pic-prof-gallery-1.jpg"]
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

function toggleComments(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`)

  if (!commentsContainer) {
    console.error(`Comments container not found for post ${postId}`)
    return
  }

  if (commentsContainer.style.display === "block") {
    commentsContainer.style.display = "none"
  } else {
    commentsContainer.style.display = "block"

    if (commentsContainer.innerHTML.trim() === "") {
      showSimpleCommentForm(postId, commentsContainer)
    }
  }
}


function showSimpleCommentForm(postId, container) {
  container.innerHTML = `
    <div style="background: white; border-radius: 8px; padding: 1rem; margin-top: 0.5rem; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="max-height: 120px; overflow-y: auto; margin-bottom: 1rem;" id="existing-comments-${postId}">
        <div style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.8rem;">
          <strong>funycat123:</strong> Your meals always look so good! 😍
          <span style="color: #94ade2; font-size: 0.7rem; float: right;">1 hour ago</span>
        </div>
        <div style="padding: 0.5rem 0; font-size: 0.8rem;">
          <strong>yumyum8:</strong> Can you share the recipe?
          <span style="color: #94ade2; font-size: 0.7rem; float: right;">2 hours ago</span>
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" 
               placeholder="Add a comment..." 
               style="flex: 1; padding: 0.5rem 0.75rem; border: 2px solid #e5e7eb; border-radius: 20px; font-size: 0.8rem; outline: none;"
               id="comment-input-${postId}"
               maxlength="200">
        <button onclick="addQuickComment(${postId})" 
                style="background-color: #94ade2; color: #000; border: 2px solid #000; border-radius: 15px; padding: 0.5rem 1rem; font-size: 0.75rem; cursor: pointer;">
          Post
        </button>
      </div>
    </div>
  `
}

function addQuickComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`)
  const text = input.value.trim()

  if (!text) return

  const existingComments = document.getElementById(`existing-comments-${postId}`)

  const newComment = document.createElement("div")
  newComment.style.cssText = "padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.8rem;"
  newComment.innerHTML = `
    <strong>friend123:</strong> ${text}
    <span style="color: #94ade2; font-size: 0.7rem; float: right;">now</span>
  `

  existingComments.appendChild(newComment)
  input.value = ""

  const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
  if (commentBtn) {
    const countSpan = commentBtn.querySelector(".comment-count")
    countSpan.textContent = Number.parseInt(countSpan.textContent) + 1
  }
}

function displayUserPosts() {
  const postsContainer = document.querySelector(".recent-friends-cards")
  if (!postsContainer) return

  const savedPosts = localStorage.getItem("userPosts")
  const userPosts = savedPosts ? JSON.parse(savedPosts) : []

  if (userPosts.length > 0) {
    const existingPosts = postsContainer.querySelectorAll("article")
    existingPosts.forEach((post, index) => {
      if (index >= 2) {
        // get 2 default posts
        post.remove()
      }
    })

    // dispaly max 3 last posts (just like in my figma)
    const recentPosts = userPosts.slice(0, 3)

    recentPosts.forEach((post, index) => {
      const postElement = document.createElement("article")
      postElement.className = "card"
      postElement.dataset.index = index + 2
      postElement.dataset.postId = post.id

      const galleryImages = post.images && post.images.length > 0 ? post.images : ["pictures/pic-hp-gallery-1.jpg"]

      postElement.innerHTML = `
        <div class="gallery-image-container" style="position: relative;">
          <button 
            class="delete-post-btn" 
            onclick="deletePost(${index + 2})"
            style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: 1px solid #000; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;"
            title="Delete post">
            <i class="fas fa-trash" style="font-size: 10px;"></i>
          </button>
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
            onclick="navigateGallery('left', ${index + 2})"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            aria-label="Next meal"
            class="gallery-arrow right"
            type="button"
            onclick="navigateGallery('right', ${index + 2})"
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
              <span class="comment-count">0</span>
            </button>
            <button
              aria-label="Like meal"
              class="like-btn"
              type="button"
              onclick="toggleLike(this)"
            >
              <i class="fas fa-heart"></i>
              <span class="like-count">0</span>
            </button>
          </div>
        </div>
        <div class="avatar-username mt-3">
          <img
            alt="Your avatar"
            class="w-5 h-5 object-cover border border-black"
            height="20"
            src="pictures/hp-prof-1.jpg"
            width="20"
          />
          <p class="text-[10px] font-sans select-none">${userData.username}</p>
        </div>
        <p class="post-description" style="font-family: 'Poppins', sans-serif; font-size: 12px; color: black; margin-top: 0.25rem; line-height: 1.4;">
          ${post.description}
        </p>
        <p class="text-[12px] mt-1 font-sans leading-tight select-none" style="color: #94ade2; font-weight: 500;">
          <strong>Type:</strong> ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          ${post.calories && post.calories !== "Not specified" ? ` • <strong>Calories:</strong> ${post.calories}` : ""}
        </p>
        <div class="comments-container" id="comments-${post.id}" style="display: none;"></div>
      `

      postsContainer.appendChild(postElement)
    })
  }
}

function deletePost(cardIndex) {
  if (confirm("Are you sure you want to delete your post?")) {
    const postElement = document.querySelector(`[data-index="${cardIndex}"]`)
    if (postElement) {
      postElement.remove()

      const savedPosts = localStorage.getItem("userPosts")
      if (savedPosts) {
        const userPosts = JSON.parse(savedPosts)
        const actualIndex = cardIndex - 2 
        if (userPosts.length > actualIndex && actualIndex >= 0) {
          userPosts.splice(actualIndex, 1)
          localStorage.setItem("userPosts", JSON.stringify(userPosts))
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateCalendar()
  updateMealScheduleDisplay()
  updateQADisplay()
  updateNotificationBadge()
  updateFriendRequestBadge()
  displayUserPosts()

  const articles = document.querySelectorAll("article.card")
  articles.forEach((article, index) => {
    if (!article.querySelector(".comments-container")) {
      const commentsContainer = document.createElement("div")
      commentsContainer.className = "comments-container"
      commentsContainer.id = `comments-${index}`
      commentsContainer.style.display = "none"
      article.appendChild(commentsContainer)
    }
  })

  const settingsIcon = document.getElementById("settingsIcon")
  settingsIcon.addEventListener("click", openSettings)

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

  // meal schedule inputs
  ;["breakfastTimeInput", "lunchTimeInput", "dinnerTimeInput", "snackTimeInput"].forEach((id) => {
    document.getElementById(id).addEventListener("change", updateSaveButton)
  })

  // q&a inputs
  ;["qa1Input", "qa2Input", "qa3Input"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateSaveButton)
  })

  settingsForm.addEventListener("submit", saveSettings)

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab)
    })
  })

  const searchInput = document.getElementById("friendSearchInput")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchFriends()
      }
    })

    searchInput.addEventListener("input", function () {
      searchQuery = this.value.toLowerCase().trim()
      populateFriendsContent()
    })
  }

  const searchBtn = document.querySelector(".search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", searchFriends)
  }
})

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
