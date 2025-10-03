// global variables
let notifications = []
let friends = []
let friendRequests = []
let currentTab = "friendsList"
let searchQuery = ""

// update current time every second
function updateTime() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, "0")
  const m = now.getMinutes().toString().padStart(2, "0")
  const s = now.getSeconds().toString().padStart(2, "0")
  document.getElementById("current-time").textContent = `${h}:${m}:${s}`
}
setInterval(updateTime, 1000)
updateTime()

function goToPage(url) {
  window.location.href = url
}

// load notifications from database
async function loadNotifications() {
  try {
    const response = await fetch("api/notifications.php")
    const data = await response.json()

    if (data.success) {
      notifications = data.notifications
      updateNotificationBadge()
    }
  } catch (error) {
    console.error("Error loading notifications:", error)
  }
}

// load friends from database
async function loadFriends() {
  try {
    const response = await fetch("api/friends.php?action=friends")
    const data = await response.json()

    if (data.success) {
      friends = data.friends
    }
  } catch (error) {
    console.error("Error loading friends:", error)
  }
}

// load friend requests from database
async function loadFriendRequests() {
  try {
    const response = await fetch("api/friends.php?action=requests")
    const data = await response.json()

    if (data.success) {
      friendRequests = data.requests
      updateFriendRequestBadge()
    }
  } catch (error) {
    console.error("Error loading friend requests:", error)
  }
}

// load posts from database
async function loadPosts() {
  try {
    const response = await fetch("api/posts.php?type=friends")
    const data = await response.json()

    if (data.success) {
      displayPosts(data.posts)
    }
  } catch (error) {
    console.error("Error loading posts:", error)
  }
}

function displayPosts(posts) {
  const postsContainer = document.querySelector(".recent-friends-cards")
  if (!postsContainer) return

  const existingPosts = postsContainer.querySelectorAll("article")
  existingPosts.forEach((post, index) => {
    if (index >= 3) {
      post.remove()
    }
  })

  posts.forEach((post, index) => {
    if (index < 3) return

    const postElement = document.createElement("article")
    postElement.className = "max-w-[220px]"
    postElement.setAttribute("data-post-id", post.id)

    const images = post.images && post.images.length > 0 ? post.images : ["pictures/pic-hp-gallery-1.jpg"]
    
    // gallery
    postElement.innerHTML = `
      <div class="gallery-image-container">
        <img
          alt="Meal by ${post.username}"
          src="${images[0]}"
          loading="lazy"
        />
        <button
          aria-label="Previous meal"
          class="gallery-arrow left"
          type="button"
          onclick="changeImage(${index}, -1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          aria-label="Next meal"
          class="gallery-arrow right"
          type="button"
          onclick="changeImage(${index}, 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="flex items-center mt-2 justify-end">
        <div class="flex space-x-3 text-[12px] text-black">
          <button
            aria-label="Comment on meal"
            class="comment-btn"
            type="button"
            onclick="toggleComments(${post.id})"
          >
            <i class="fas fa-comment"></i>
            <span class="comment-count">${post.comments_count}</span>
          </button>
          <button
            aria-label="Like meal"
            class="like-btn ${post.user_liked ? "active" : ""}"
            type="button"
            onclick="toggleLike(this, ${post.id})"
          >
            <i class="fas fa-heart"></i>
            <span class="like-count">${post.likes_count}</span>
          </button>
        </div>
      </div>
      <div class="avatar-username mt-3">
        <img
          alt="Avatar of ${post.username}"
          class="w-5 h-5 object-cover border border-black"
          height="20"
          src="${post.profile_image}"
          width="20"
        />
        <p class="text-[10px] font-sans select-none">${post.username}</p>
      </div>
      <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none">
        ${post.description}
      </p>
      <div class="comments-container" id="comments-${post.id}" style="display: none;"></div>
    `

    postsContainer.appendChild(postElement)
  })
}

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

// fixed ToggleComments function!
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

// for displaying comment form
function showSimpleCommentForm(postId, container) {
  container.innerHTML = `
    <div style="background: white; border-radius: 8px; padding: 1rem; margin-top: 0.5rem; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="max-height: 120px; overflow-y: auto; margin-bottom: 1rem;" id="existing-comments-${postId}">
        <div style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.8rem;">
          <strong>funycat123:</strong> This looks amazing!
          <span style="color: #94ade2; font-size: 0.7rem; float: right;">2 min ago</span>
        </div>
        <div style="padding: 0.5rem 0; font-size: 0.8rem;">
          <strong>yumyum8:</strong> Recipe please!
          <span style="color: #94ade2; font-size: 0.7rem; float: right;">5 min ago</span>
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
    <strong>${window.currentUser ? window.currentUser.username : "You"}:</strong> ${text}
    <span style="color: #94ade2; font-size: 0.7rem; float: right;">now</span>
  `

  existingComments.appendChild(newComment)
  input.value = ""

  // comment count (updated)
  const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
  if (commentBtn) {
    const countSpan = commentBtn.querySelector(".comment-count")
    countSpan.textContent = Number.parseInt(countSpan.textContent) + 1
  }
}

// enhanced addPost function to save to database
async function addPost() {
  const mealType = document.getElementById("mealTypeSelect").value
  const description = document.getElementById("mealDescription").value.trim()
  const calories = document.getElementById("caloriesInput").value
  const imageFiles = document.getElementById("mealImageInput").files

  if (!description) {
    alert("Please add a description for your meal.")
    return
  }

  try {
    const images = []

    // process images if any
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const base64 = await fileToBase64(file)
        images.push(base64)
      }
    }

    const postData = {
      meal_type: mealType,
      description: description,
      calories: calories || null,
      images: images,
    }

    const response = await fetch("api/posts.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    const data = await response.json()

    if (data.success) {
      closeAddPostPanel()
      document.getElementById("addPostForm").reset()
      document.getElementById("imagePreviewContainer").innerHTML = ""
      updateCharCount()

      loadPosts()

      alert("Your meal has been posted successfully!")
    } else {
      alert("Error posting meal: " + data.message)
    }
  } catch (error) {
    console.error("Error adding post:", error)
    alert("Error posting meal. Please try again.")
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  // load data from database
  loadNotifications()
  loadFriends()
  loadFriendRequests()
  loadPosts()

  const articles = document.querySelectorAll("article")
  articles.forEach((article, index) => {
    if (!article.querySelector(".comments-container")) {
      const commentsContainer = document.createElement("div")
      commentsContainer.className = "comments-container"
      commentsContainer.id = `comments-${index}`
      commentsContainer.style.display = "none"
      article.appendChild(commentsContainer)
    }
  })

  populateFriendsContent()

  // add form submit handler
  const addPostForm = document.getElementById("addPostForm")
  if (addPostForm) {
    addPostForm.addEventListener("submit", (e) => {
      e.preventDefault()
      addPost()
    })
  }

  // add character count listener
  const mealDescription = document.getElementById("mealDescription")
  if (mealDescription) {
    mealDescription.addEventListener("input", updateCharCount)
  }

  // update current time
  function updateTime() {
    const timeElement = document.getElementById("current-time")
    if (timeElement) {
      const now = new Date()
      timeElement.textContent = now.toLocaleTimeString()
    }
  }

  updateTime()
  setInterval(updateTime, 1000)
})

function toggleFriendsPanel() {
  const panel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const addPostPanel = document.getElementById("addPostPanel")

  if (notificationsPanel && notificationsPanel.classList.contains("active")) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  if (addPostPanel && addPostPanel.classList.contains("active")) {
    addPostPanel.classList.remove("active")
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

  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

  searchQuery = ""
  document.getElementById("friendSearchInput").value = ""

  populateFriendsContent()
}

async function acceptFriendRequest(requestId) {
  try {
    const response = await fetch("api/friends.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "accept_request",
        request_id: requestId,
      }),
    })

    const data = await response.json()

    if (data.success) {
      await loadFriends()
      await loadFriendRequests()
      populateFriendsContent()
    } else {
      alert("Error accepting friend request: " + data.message)
    }
  } catch (error) {
    console.error("Error accepting friend request:", error)
    alert("Error accepting friend request")
  }
}

async function declineFriendRequest(requestId) {
  try {
    const response = await fetch("api/friends.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "decline_request",
        request_id: requestId,
      }),
    })

    const data = await response.json()

    if (data.success) {
      await loadFriendRequests()
      populateFriendsContent()
    } else {
      alert("Error declining friend request: " + data.message)
    }
  } catch (error) {
    console.error("Error declining friend request:", error)
    alert("Error declining friend request")
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
  const addPostPanel = document.getElementById("addPostPanel")
  const penButton = document.querySelector(".pen-button")

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
    addPostPanel &&
    addPostPanel.classList.contains("active") &&
    !addPostPanel.contains(event.target) &&
    !penButton.contains(event.target)
  ) {
    closeAddPostPanel()
  }
})

// gallery images for each card
const galleryImages = [
  ["pictures/pic-hp-gallery-1.jpg", "pictures/pic-hp-gallery-1-2.jpg", "pictures/pic-hp-gallery-1-3.jpg"],
  ["pictures/pic-hp-gallery-2.jpg"],
  ["pictures/pic-hp-gallery-3.jpg", "pictures/pic-hp-gallery-3-2.jpg", "pictures/pic-hp-gallery-3-3.jpg"],
]

const currentImageIndex = [0, 0, 0]

function changeImage(cardIndex, direction) {
  const images = galleryImages[cardIndex]
  currentImageIndex[cardIndex] = (currentImageIndex[cardIndex] + direction + images.length) % images.length
  const container = document.querySelectorAll(".gallery-image-container")[cardIndex]
  const img = container.querySelector("img")
  img.src = images[currentImageIndex[cardIndex]]
}

// toggle like button active state and update count
async function toggleLike(button, postId = null) {
  const countSpan = button.querySelector(".like-count")
  let count = Number.parseInt(countSpan.textContent, 10)

  if (postId) {
    // handle database like/unlike
    try {
      const response = await fetch("api/likes.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          action: button.classList.contains("active") ? "unlike" : "like",
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (button.classList.contains("active")) {
          button.classList.remove("active")
          count--
        } else {
          button.classList.add("active")
          count++
        }
        countSpan.textContent = count
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  } else {
    if (button.classList.contains("active")) {
      button.classList.remove("active")
      count--
    } else {
      button.classList.add("active")
      count++
    }
    countSpan.textContent = count
  }
}

// highlight nav icon based on current page
function highlightNav() {
  const path = window.location.pathname
  const homeBtn = document.getElementById("nav-home")
  const profileBtn = document.getElementById("nav-profile")
  homeBtn.classList.remove("active")
  profileBtn.classList.remove("active")
  if (path.endsWith("homepage.php") || path.endsWith("/")) {
    homeBtn.classList.add("active")
  } else if (path.endsWith("profile.php")) {
    profileBtn.classList.add("active")
  }
}

function openAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  panel.classList.add("active")

  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")

  if (notificationsPanel && notificationsPanel.classList.contains("active")) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  if (friendsPanel && friendsPanel.classList.contains("active")) {
    friendsPanel.classList.remove("active")
    friendsBtn.classList.remove("active")
  }

  setDefaultMealType()

  document.getElementById("addPostForm").reset()
  document.getElementById("imagePreviewContainer").innerHTML = ""
  document.getElementById("charCount").textContent = "0"
  updateCharCount()
}

function closeAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  panel.classList.remove("active")
}

function setDefaultMealType() {
  const hour = new Date().getHours()
  const mealTypeSelect = document.getElementById("mealTypeSelect")

  if (hour >= 5 && hour < 11) {
    mealTypeSelect.value = "breakfast"
  } else if (hour >= 11 && hour < 15) {
    mealTypeSelect.value = "lunch"
  } else if (hour >= 15 && hour < 18) {
    mealTypeSelect.value = "snack"
  } else {
    mealTypeSelect.value = "dinner"
  }
}

function handleMealImagePreview() {
  const input = document.getElementById("mealImageInput")
  const previewContainer = document.getElementById("imagePreviewContainer")

  if (input.files.length > 0) {
    previewContainer.innerHTML = ""

    Array.from(input.files).forEach((file, index) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const wrapper = document.createElement("div")
        wrapper.className = "preview-image-wrapper"

        const img = document.createElement("img")
        img.src = e.target.result
        img.alt = "Meal preview"

        const removeBtn = document.createElement("button")
        removeBtn.className = "remove-image-btn"
        removeBtn.innerHTML = '<i class="fas fa-times"></i>'
        removeBtn.onclick = () => {
          wrapper.remove()
        }

        wrapper.appendChild(img)
        wrapper.appendChild(removeBtn)
        previewContainer.appendChild(wrapper)
      }

      reader.readAsDataURL(file)
    })
  }
}

function updateCharCount() {
  const mealDescription = document.getElementById("mealDescription")
  const charCount = document.getElementById("charCount")
  charCount.textContent = mealDescription.value.length
}
