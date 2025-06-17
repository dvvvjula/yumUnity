// Sample notifications data - Updated with English text and different times
const notifications = [
  {
    id: 1,
    text: "Sarah liked your breakfast post",
    time: "2 min ago",
  },
  {
    id: 2,
    text: "New friend request from Mike",
    time: "15 min ago",
  },
  {
    id: 3,
    text: "Your lunch got 5 new likes!",
    time: "1 hour ago",
  },
  {
    id: 4,
    text: "Emma commented on your post",
    time: "2 hours ago",
  },
  {
    id: 5,
    text: "New follower: ChefMaster2024",
    time: "3 hours ago",
  },
  {
    id: 6,
    text: "Weekly meal summary ready",
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

// Update current time every second
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

// POPRAWIONA FUNKCJA toggleComments
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

    // Jeśli kontener jest pusty, dodaj przykładowe komentarze i formularz
    if (commentsContainer.innerHTML.trim() === "") {
      showSimpleCommentForm(postId, commentsContainer)
    }
  }
}

// NOWA FUNKCJA do wyświetlania formularza komentarzy
function showSimpleCommentForm(postId, container) {
  container.innerHTML = `
    <div style="background: white; border-radius: 8px; padding: 1rem; margin-top: 0.5rem; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="max-height: 120px; overflow-y: auto; margin-bottom: 1rem;" id="existing-comments-${postId}">
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

// NOWA FUNKCJA do dodawania komentarzy
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

  // Zaktualizuj licznik komentarzy
  const commentBtn = document.querySelector(`[onclick="toggleComments(${postId})"]`)
  if (commentBtn) {
    const countSpan = commentBtn.querySelector(".comment-count")
    countSpan.textContent = Number.parseInt(countSpan.textContent) + 1
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
    username: window.currentUser ? window.currentUser.username : "user",
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

// POPRAWIONA FUNKCJA addPostToDisplay z kontenerem komentarzy
function addPostToDisplay(post) {
  const postsContainer = document.querySelector(".recent-friends-cards")
  const postElement = document.createElement("article")
  postElement.className = "max-w-[220px]"
  postElement.setAttribute("data-post-id", post.id)

  // Użyj pierwszego zdjęcia lub domyślnego
  // const imageUrl = post.images && post.images.length > 0 ? post.images[0] : "pictures/pic-hp-gallery-1.jpg"

  postsContainer.insertBefore(postElement, postsContainer.firstChild)
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // DODAJ KONTENERY KOMENTARZY do istniejących postów
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

function toggleFriendsPanel() {
  const panel = document.getElementById("friendsPanel")
  const friendsBtn = document.getElementById("nav-friends")
  const notificationsPanel = document.getElementById("notificationsPanel")
  const notificationBtn = document.getElementById("nav-notifications")
  const addPostPanel = document.getElementById("addPostPanel")

  // Close notifications panel if open
  if (notificationsPanel && notificationsPanel.classList.contains("active")) {
    notificationsPanel.classList.remove("active")
    notificationBtn.classList.remove("active")
  }

  // Close add post panel if open
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
  const addPostPanel = document.getElementById("addPostPanel")
  const penButton = document.querySelector(".pen-button")

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

  // Close add post panel
  if (
    addPostPanel &&
    addPostPanel.classList.contains("active") &&
    !addPostPanel.contains(event.target) &&
    !penButton.contains(event.target)
  ) {
    closeAddPostPanel()
  }
})

// Gallery images for each card
const galleryImages = [
  [
    "pictures/pic-hp-gallery-1-2.jpg",
    "pictures/pic-hp-gallery-1-3.jpg",
    "pictures/pic-hp-gallery-1-2.jpg",
  ],
  [
    "https://storage.googleapis.com/a1aa/image/cfe2c722-28c9-42d9-3b5b-bea15ceb3706.jpg",
  ],
  [
    "pictures/pic-hp-gallery-3-2.jpg",
    "pictures/pic-hp-gallery-3-3.jpg",
  ],
]

// Track current image index per card
const currentImageIndex = [0, 0, 0]

function changeImage(cardIndex, direction) {
  const images = galleryImages[cardIndex]
  currentImageIndex[cardIndex] = (currentImageIndex[cardIndex] + direction + images.length) % images.length
  const container = document.querySelectorAll(".gallery-image-container")[cardIndex]
  const img = container.querySelector("img")
  img.src = images[currentImageIndex[cardIndex]]
}

// Toggle like button active state and update count
function toggleLike(button) {
  const countSpan = button.querySelector(".like-count")
  let count = Number.parseInt(countSpan.textContent, 10)
  if (button.classList.contains("active")) {
    button.classList.remove("active")
    count--
  } else {
    button.classList.add("active")
    count++
  }
  countSpan.textContent = count
}

// Highlight nav icon based on current page
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

// Tablica do przechowywania postów użytkownika
const userPosts = []

// Funkcja do otwierania panelu dodawania postu
function openAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  panel.classList.add("active")

  // Zamknij inne panele jeśli są otwarte
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

  // Ustaw domyślny typ posiłku na podstawie aktualnej godziny
  setDefaultMealType()

  // Wyczyść formularz
  document.getElementById("addPostForm").reset()
  document.getElementById("imagePreviewContainer").innerHTML = ""
  document.getElementById("charCount").textContent = "0"
}

// Funkcja do zamykania panelu dodawania postu
function closeAddPostPanel() {
  const panel = document.getElementById("addPostPanel")
  panel.classList.remove("active")
}

// Funkcja do ustawiania domyślnego typu posiłku na podstawie godziny
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

// Funkcja do obsługi podglądu zdjęć
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

// Funkcja do aktualizacji licznika znaków
function updateCharCount() {
  const textarea = document.getElementById("mealDescription")
  const charCount = document.getElementById("charCount")
  const currentLength = textarea.value.length
  const maxLength = 200

  charCount.textContent = currentLength

  // Zmień kolor na czerwony jeśli przekroczono limit
  if (currentLength > maxLength) {
    charCount.style.color = "#ef4444"
    textarea.style.borderColor = "#ef4444"
    // Nie pozwól na dalsze pisanie
    textarea.value = textarea.value.substring(0, maxLength)
    charCount.textContent = maxLength
  } else if (currentLength === maxLength) {
    charCount.style.color = "#ef4444"
    textarea.style.borderColor = "#ef4444"
  } else {
    charCount.style.color = "#666"
    textarea.style.borderColor = "#000"
  }
}

// Funkcja do dodawania nowego postu
function addNewPost(event) {
  event.preventDefault()

  const mealType = document.getElementById("mealTypeSelect").value
  const description = document.getElementById("mealDescription").value
  const calories = document.getElementById("caloriesInput").value
  const imageInput = document.getElementById("mealImageInput")

  // Sprawdź czy opis nie jest pusty
  if (!description.trim()) {
    alert("Please add a description for your meal.")
    return
  }

  // Przygotuj obrazy
  const images = []
  if (imageInput.files.length > 0) {
    let processedImages = 0
    Array.from(imageInput.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        images.push(e.target.result)
        processedImages++

        // Gdy wszystkie obrazy są przetworzone, utwórz post
        if (processedImages === imageInput.files.length) {
          createPost()
        }
      }
      reader.readAsDataURL(file)
    })
  } else {
    // Domyślny obraz jeśli nie wybrano żadnego
    images.push("/pictures/pic-hp-gallery-1.jpg")
    createPost()
  }

  function createPost() {
    // Utwórz nowy post
    const newPost = {
      id: Date.now(),
      type: mealType,
      description: description,
      calories: calories || "Not specified",
      images: images,
      date: new Date(),
      likes: 0,
      comments: [],
    }

    // Pobierz istniejące posty z localStorage
    const savedPosts = localStorage.getItem("userPosts")
    const existingPosts = savedPosts ? JSON.parse(savedPosts) : []

    // Dodaj nowy post na początek tablicy
    existingPosts.unshift(newPost)

    // Zapisz posty w localStorage
    localStorage.setItem("userPosts", JSON.stringify(existingPosts))

    // Zamknij panel
    closeAddPostPanel()

    // Pokaż komunikat o sukcesie
    alert("Your meal has been posted successfully!")

    // Przekieruj na stronę profilu, aby zobaczyć nowy post
    window.location.href = "profile.php"
  }
}

// Dodaj event listenery po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  // Inicjalizacja
  updateNotificationBadge()
  updateFriendRequestBadge()
  highlightNav()

  // Event listener dla przycisku ołówka
  const penButton = document.querySelector(".pen-button")
  if (penButton) {
    penButton.addEventListener("click", openAddPostPanel)
  }

  // Event listener dla inputu z obrazami
  const mealImageInput = document.getElementById("mealImageInput")
  if (mealImageInput) {
    mealImageInput.addEventListener("change", handleMealImagePreview)
  }

  // Event listener dla textarea description
  const mealDescription = document.getElementById("mealDescription")
  if (mealDescription) {
    mealDescription.addEventListener("input", updateCharCount)
  }

  // Event listener dla formularza dodawania postu
  const addPostForm = document.getElementById("addPostForm")
  if (addPostForm) {
    addPostForm.addEventListener("submit", addNewPost)
  }

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

  // Zamykanie panelu po naciśnięciu Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const panel = document.getElementById("addPostPanel")
      if (panel && panel.classList.contains("active")) {
        closeAddPostPanel()
      }
    }
  })
})
