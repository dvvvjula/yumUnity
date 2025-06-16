// User data - should be set from PHP
const userData = {
  username: window.currentUser?.username || "user",
  email: window.currentUser?.email || "user@example.com",
}

// Sample friends data with correct image paths
const friends = [
  { id: 1, name: "funycat123", avatar: "pictures/hp-prof-1.jpg", status: "Active now", isActive: true },
  { id: 2, name: "yumyum8", avatar: "pictures/hp-prof-2.jpg", status: "Last seen 2h ago", isActive: false },
  { id: 3, name: "ilikefood1", avatar: "pictures/hp-prof-1.jpg", status: "Active now", isActive: true },
]

const friendRequests = [
  { id: 4, name: "foodlover22", avatar: "pictures/hp-prof-2.jpg", status: "Wants to be friends" },
  { id: 5, name: "cookmaster", avatar: "pictures/hp-prof-1.jpg", status: "Wants to be friends" },
  { id: 6, name: "healthyeats", avatar: "pictures/hp-prof-2.jpg", status: "Wants to be friends" },
]

// Updated notifications with English text and different times
const notifications = [
  {
    id: 1,
    text: "Someone commented on your breakfast photo: 'That avocado toast looks amazing!'",
    time: "5 min ago",
  },
  {
    id: 2,
    text: "Your lunch post received 8 new likes from friends",
    time: "23 min ago",
  },
  {
    id: 3,
    text: "New friend request from @healthyfoodie_jane",
    time: "1 hour ago",
  },
  {
    id: 4,
    text: "Someone shared your dinner recipe to their story",
    time: "2 hours ago",
  },
  {
    id: 5,
    text: "Weekly meal summary: You tried 3 new recipes this week!",
    time: "4 hours ago",
  },
  {
    id: 6,
    text: "Reminder: Don't forget to log your snack today",
    time: "6 hours ago",
  },
]

// Sample all users data with correct image paths
const allUsers = [
  { id: 1, name: "funycat123", avatar: "pictures/hp-prof-1.jpg", status: "Active now" },
  { id: 2, name: "yumyum8", avatar: "pictures/hp-prof-2.jpg", status: "Last seen 2h ago" },
  { id: 3, name: "ilikefood1", avatar: "pictures/hp-prof-1.jpg", status: "Active now" },
  { id: 4, name: "foodlover22", avatar: "pictures/hp-prof-2.jpg", status: "Last seen 1h ago" },
  { id: 5, name: "cookmaster", avatar: "pictures/hp-prof-1.jpg", status: "Active now" },
  { id: 6, name: "healthyeats", avatar: "pictures/hp-prof-2.jpg", status: "Last seen 30m ago" },
  { id: 7, name: "veggiequeen", avatar: "pictures/hp-prof-1.jpg", status: "Last seen 1d ago" },
  { id: 8, name: "pizzalover", avatar: "pictures/hp-prof-2.jpg", status: "Active now" },
  { id: 9, name: "sushimaster", avatar: "pictures/hp-prof-1.jpg", status: "Last seen 3h ago" },
  { id: 10, name: "bakingpro", avatar: "pictures/hp-prof-2.jpg", status: "Last seen 5h ago" },
]

const currentTab = "friendsList"
const searchQuery = ""

// Update notifications panel
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

// Comment form functionality
function openCommentForm(postId) {
  const existingForm = document.getElementById(`comment-form-${postId}`)
  if (existingForm) {
    existingForm.remove()
    return
  }

  const commentsContainer = document.getElementById(`comments-${postId}`)
  const commentForm = document.createElement("div")
  commentForm.id = `comment-form-${postId}`
  commentForm.className = "comment-form-container"
  commentForm.innerHTML = `
    <div class="comment-form">
      <textarea
        id="comment-text-${postId}"
        placeholder="Write your comment..."
        rows="3"
        maxlength="500"
        class="comment-textarea"
      ></textarea>
      <div class="comment-form-footer">
        <span class="comment-char-count">
          <span id="comment-char-count-${postId}">0</span>/100 words
        </span>
        <div class="comment-form-actions">
          <button onclick="cancelComment(${postId})" class="comment-cancel-btn">Cancel</button>
          <button onclick="submitComment(${postId})" class="comment-submit-btn" id="comment-submit-${postId}" disabled>Post</button>
        </div>
      </div>
    </div>
  `

  commentsContainer.insertBefore(commentForm, commentsContainer.firstChild)

  // Add event listener for word counting
  const textarea = document.getElementById(`comment-text-${postId}`)
  textarea.addEventListener("input", () => {
    updateCommentWordCount(postId)
  })
}

function updateCommentWordCount(postId) {
  const textarea = document.getElementById(`comment-text-${postId}`)
  const counter = document.getElementById(`comment-char-count-${postId}`)
  const submitBtn = document.getElementById(`comment-submit-${postId}`)

  const words = textarea.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = textarea.value.trim() === "" ? 0 : words.length

  counter.textContent = wordCount

  if (wordCount > 100) {
    counter.style.color = "#ef4444"
    submitBtn.disabled = true
  } else if (wordCount > 0) {
    counter.style.color = "#94ade2"
    submitBtn.disabled = false
  } else {
    counter.style.color = "#666"
    submitBtn.disabled = true
  }
}

function cancelComment(postId) {
  const form = document.getElementById(`comment-form-${postId}`)
  if (form) {
    form.remove()
  }
}

async function submitComment(postId) {
  const textarea = document.getElementById(`comment-text-${postId}`)
  const text = textarea.value.trim()

  if (!text) return

  const words = text.split(/\s+/).filter((word) => word.length > 0)
  if (words.length > 100) {
    alert("Comment is too long. Maximum 100 words allowed.")
    return
  }

  try {
    const formData = new FormData()
    formData.append("post_id", postId)
    formData.append("content", text)

    const response = await fetch("api/comments.php", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      // Add comment to display
      addCommentToDisplay(postId, text)

      // Update comment count
      const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
      const countSpan = commentBtn.querySelector(".comment-count")
      countSpan.textContent = Number.parseInt(countSpan.textContent) + 1

      // Remove form
      cancelComment(postId)
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error("Error submitting comment:", error)
    alert("Error submitting comment. Please try again.")
  }
}

function addCommentToDisplay(postId, text) {
  const commentsContainer = document.getElementById(`comments-${postId}`)
  const commentElement = document.createElement("div")
  commentElement.className = "comment-item"
  commentElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author">${userData.username}</span>
      <button class="comment-delete-btn" onclick="deleteComment(this)" title="Delete comment">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="comment-text">${text}</div>
    <div class="comment-time">${new Date().toLocaleTimeString()}</div>
  `

  commentsContainer.appendChild(commentElement)
}

function deleteComment(button) {
  if (confirm("Are you sure you want to delete this comment?")) {
    const commentItem = button.closest(".comment-item")
    const commentsContainer = commentItem.closest(".comments-container")
    const postId = commentsContainer.id.replace("comments-", "")

    commentItem.remove()

    // Update comment count
    const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
    const countSpan = commentBtn.querySelector(".comment-count")
    countSpan.textContent = Math.max(0, Number.parseInt(countSpan.textContent) - 1)
  }
}

function toggleComments(postId) {
  let commentsContainer = document.getElementById(`comments-${postId}`)

  if (!commentsContainer) {
    // Znajdź post i dodaj kontener komentarzy
    const postElement =
      document.querySelector(`[data-post-id="${postId}"]`) || document.querySelectorAll("article")[postId]
    if (postElement) {
      commentsContainer = document.createElement("div")
      commentsContainer.className = "comments-container"
      commentsContainer.id = `comments-${postId}`
      commentsContainer.style.display = "none"
      postElement.appendChild(commentsContainer)
    }
  }

  if (commentsContainer.style.display === "block") {
    commentsContainer.style.display = "none"
    commentsContainer.innerHTML = ""
  } else {
    commentsContainer.style.display = "block"
    showSimpleCommentForm(postId, commentsContainer)
  }
}

// Enhanced addPost function to save to database
async function addPost() {
  const mealType = document.getElementById("mealTypeSelect").value
  const description = document.getElementById("mealDescription").value.trim()
  const calories = document.getElementById("caloriesInput").value
  const imageFiles = document.getElementById("mealImageInput").files

  if (!description) {
    alert("Please add a description for your meal.")
    return
  }

  // Stwórz nowy post bez API na razie
  const newPost = {
    id: Date.now(),
    mealType: mealType,
    description: description,
    calories: calories || null,
    images: [],
    likes: 0,
    comments: 0,
    timestamp: new Date().toISOString(),
    username: userData.username,
  }

  // Obsłuż zdjęcia
  if (imageFiles.length > 0) {
    Array.from(imageFiles).forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPost.images.push(e.target.result)
        if (newPost.images.length === imageFiles.length) {
          addPostToDisplay(newPost)
        }
      }
      reader.readAsDataURL(file)
    })
  } else {
    // Użyj domyślnego zdjęcia
    newPost.images = ["pictures/pic-hp-gallery-1.jpg"]
    addPostToDisplay(newPost)
  }

  // Zapisz do localStorage
  const savedPosts = localStorage.getItem("userPosts")
  const userPosts = savedPosts ? JSON.parse(savedPosts) : []
  userPosts.unshift(newPost)
  localStorage.setItem("userPosts", JSON.stringify(userPosts))

  // Zamknij panel i zresetuj formularz
  closeAddPostPanel()
  document.getElementById("addPostForm").reset()
  document.getElementById("imagePreviewContainer").innerHTML = ""
  updateCharCount()
}

// Popraw funkcję addPostToDisplay:
function addPostToDisplay(post) {
  const postsContainer = document.querySelector(".recent-friends-cards")
  const postElement = document.createElement("article")
  postElement.className = "max-w-[220px]"
  postElement.setAttribute("data-post-id", post.id)

  // Użyj pierwszego zdjęcia lub domyślnego
  const imageUrl = post.images && post.images.length > 0 ? post.images[0] : "pictures/pic-hp-gallery-1.jpg"

  postElement.innerHTML = `
    <div class="gallery-image-container">
      <img
        alt="User meal"
        src="${imageUrl}"
        loading="lazy"
        class="gallery-image"
        data-current="0"
      />
      <button
        aria-label="Previous meal"
        class="gallery-arrow left"
        type="button"
        onclick="changeImage(${post.id}, -1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        aria-label="Next meal"
        class="gallery-arrow right"
        type="button"
        onclick="changeImage(${post.id}, 1)"
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
      <p class="text-[10px] font-sans select-none">${post.username}</p>
    </div>
    <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none">
      ${post.description}
    </p>
    <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none">
      <strong>Type:</strong> ${post.mealType.charAt(0).toUpperCase() + post.mealType.slice(1)}
      ${post.calories ? ` • <strong>Calories:</strong> ${post.calories}` : ""}
    </p>
  `

  postsContainer.insertBefore(postElement, postsContainer.firstChild)
}

// Rest of the existing functions remain the same...
function populateFriendsContent() {
  const content = document.getElementById("friendsContent")
  content.innerHTML = ""

  if (currentTab === "friendsList") {
    // Filter friends based on search query
    const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery))

    if (filteredFriends.length === 0 && searchQuery) {
      // Show search results from all users if no friends match
      const searchResults = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) &&
          !friends.some((friend) => friend.id === user.id) &&
          !friendRequests.some((req) => req.id === user.id),
      )

      if (searchResults.length > 0) {
        searchResults.forEach((user) => {
          const userElement = document.createElement("div")
          userElement.className = "friend-item"
          userElement.innerHTML = `
            <img src="${user.avatar}" alt="User avatar" class="friend-avatar">
            <div class="friend-info">
              <p class="friend-name">${user.name}</p>
              <p class="friend-status">${user.status}</p>
            </div>
            <button class="send-request-btn" onclick="sendFriendRequest(${user.id}, '${user.name}', '${user.avatar}')">
              Add Friend
            </button>
          `
          content.appendChild(userElement)
        })
      } else {
        content.innerHTML = '<div class="friend-item"><p class="friend-name">No users found</p></div>'
      }
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
    // Friend requests tab
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

function sendFriendRequest(userId, userName, userAvatar) {
  // Add to friend requests (simulate sending request)
  friendRequests.push({
    id: userId,
    name: userName,
    avatar: userAvatar,
    status: "Wants to be friends",
  })

  // Update badge
  updateFriendRequestBadge()

  // Refresh content
  populateFriendsContent()

  // Show confirmation
  alert(`Friend request sent to ${userName}!`)
}

function acceptFriendRequest(requestId) {
  // Find the request and add it to friends
  const request = friendRequests.find((req) => req.id === requestId)
  if (request) {
    friends.push(request)
    // Remove from friend requests
    friendRequests.splice(friendRequests.indexOf(request), 1)
    // Update badge
    updateFriendRequestBadge()
    // Refresh content
    populateFriendsContent()
    // Show confirmation
    alert(`Friend request accepted from ${request.name}!`)
  }
}

function declineFriendRequest(requestId) {
  // Find the request and remove it from friend requests
  const requestIndex = friendRequests.findIndex((req) => req.id === requestId)
  if (requestIndex !== -1) {
    friendRequests.splice(requestIndex, 1)
    // Update badge
    updateFriendRequestBadge()
    // Refresh content
    populateFriendsContent()
    // Show confirmation
    alert(`Friend request declined!`)
  }
}

function updateFriendRequestBadge() {
  const badge = document.getElementById("friendRequestBadge")
  if (badge) {
    badge.textContent = friendRequests.length.toString()
    badge.style.display = friendRequests.length > 0 ? "block" : "none"
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

function closeAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  if (panel) {
    panel.style.display = "none"
  }
}

function openAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  if (panel) {
    panel.style.display = "flex"
  }
}

function updateCharCount() {
  const textarea = document.getElementById("mealDescription")
  const counter = document.getElementById("charCount")
  if (textarea && counter) {
    const wordCount = textarea.value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    counter.textContent = wordCount.toString()
  }
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

function showSimpleCommentForm(postId, container) {
  container.innerHTML = `
    <div style="background: white; border-radius: 8px; padding: 1rem; margin-top: 0.5rem; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="max-height: 120px; overflow-y: auto; margin-bottom: 1rem;">
        <div style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.8rem;">
          <strong>funycat123:</strong> This looks amazing! 😍
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

  const container = document.getElementById(`comments-${postId}`)
  const existingComments = container.querySelector("div > div")

  const newComment = document.createElement("div")
  newComment.style.cssText = "padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.8rem;"
  newComment.innerHTML = `
    <strong>${userData.username}:</strong> ${text}
    <span style="color: #94ade2; font-size: 0.7rem; float: right;">now</span>
  `

  existingComments.appendChild(newComment)
  input.value = ""

  // Zaktualizuj licznik komentarzy
  const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
  if (commentBtn) {
    const countSpan = commentBtn.querySelector(".comment-count")
    countSpan.textContent = Number.parseInt(countSpan.textContent) + 1
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Add comments containers to existing posts
  const articles = document.querySelectorAll("article")
  articles.forEach((article, index) => {
    if (!article.querySelector(".comments-container")) {
      const commentsContainer = document.createElement("div")
      commentsContainer.className = "comments-container"
      commentsContainer.id = `comments-${index}`
      article.appendChild(commentsContainer)
    }
  })

  // Initialize friends panel
  populateFriendsContent()

  // Initialize notifications
  updateNotificationBadge()
  updateFriendRequestBadge()

  // Add form submit handler
  const addPostForm = document.getElementById("addPostForm")
  if (addPostForm) {
    addPostForm.addEventListener("submit", (e) => {
      e.preventDefault()
      addPost()
    })
  }

  // Add character count listener
  const mealDescription = document.getElementById("mealDescription")
  if (mealDescription) {
    mealDescription.addEventListener("input", updateCharCount)
  }

  // Update current time
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

// Close panels when clicking outside
document.addEventListener("click", (event) => {
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const friendsPanel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")

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
})
