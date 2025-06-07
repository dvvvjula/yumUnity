// Sample notifications data
const notifications = [
  {
    id: 1,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  },
  {
    id: 2,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  },
  {
    id: 3,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  },
  {
    id: 4,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  },
  {
    id: 5,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  },
  {
    id: 6,
    text: "Lorem ipsum dolor amet, consectetur adipiscing elit.",
    time: "13:46"
  }
];

// Sample friends data
const friends = [
  {
    id: 1,
    name: "funycat123",
    avatar: "/pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true
  },
  {
    id: 2,
    name: "yumyum8",
    avatar: "/pictures/hp-prof-2.jpg",
    status: "Last seen 2h ago",
    isActive: false
  },
  {
    id: 3,
    name: "ilikefood1",
    avatar: "/pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true
  },
  {
    id: 4,
    name: "foodlover22",
    avatar: "/pictures/hp-prof-2.jpg",
    status: "Last seen 1h ago",
    isActive: false
  },
  {
    id: 5,
    name: "cookmaster",
    avatar: "/pictures/hp-prof-1.jpg",
    status: "Active now",
    isActive: true
  },
  {
    id: 6,
    name: "healthyeats",
    avatar: "/pictures/hp-prof-2.jpg",
    status: "Last seen 30m ago",
    isActive: false
  }
];

// Sample friend requests data
const friendRequests = [
  {
    id: 1,
    name: "foodlover22",
    avatar: "/pictures/hp-prof-2.jpg",
    status: "Wants to be friends"
  },
  {
    id: 2,
    name: "cookmaster",
    avatar: "/pictures/hp-prof-1.jpg",
    status: "Wants to be friends"
  },
  {
    id: 3,
    name: "healthyeats",
    avatar: "/pictures/hp-prof-2.jpg",
    status: "Wants to be friends"
  }
];

// Comments data for profile posts
const profilePostComments = {};

// Post likes data for profile
const profilePostLikes = {};

let currentTab = 'friendsList';
let searchQuery = '';
let currentCommentPostId = null;

function toggleNotificationsPanel() {
  const panel = document.getElementById("notificationsPanel");
  const notificationBtn = document.getElementById("nav-notifications");
  const friendsPanel = document.getElementById("friendsPanel");
  const friendsBtn = document.getElementById("nav-friends");

  // Close friends panel if open
  if (friendsPanel && friendsPanel.classList.contains("active")) {
    friendsPanel.classList.remove("active");
    friendsBtn.classList.remove("active");
  }

  if (panel.classList.contains("active")) {
    panel.classList.remove("active");
    notificationBtn.classList.remove("active");
  } else {
    panel.classList.add("active");
    notificationBtn.classList.add("active");
    populateNotifications();
  }
}

function toggleFriendsPanel() {
  const panel = document.getElementById("friendsPanel");
  const friendsBtn = document.getElementById("nav-friends");
  const notificationsPanel = document.getElementById("notificationsPanel");
  const notificationBtn = document.getElementById("nav-notifications");

  // Close notifications panel if open
  if (notificationsPanel && notificationsPanel.classList.contains("active")) {
    notificationsPanel.classList.remove("active");
    notificationBtn.classList.remove("active");
  }

  if (panel.classList.contains("active")) {
    panel.classList.remove("active");
    friendsBtn.classList.remove("active");
  } else {
    panel.classList.add("active");
    friendsBtn.classList.add("active");
    populateFriendsContent();
  }
}

function searchFriends() {
  const searchInput = document.getElementById("friendSearchInput");
  searchQuery = searchInput.value.toLowerCase().trim();
  populateFriendsContent();
}

function populateNotifications() {
  const content = document.getElementById("notificationsContent");
  content.innerHTML = "";

  notifications.forEach(notification => {
    const notificationElement = document.createElement("div");
    notificationElement.className = "notification-item";
    notificationElement.innerHTML = `
      <p class="notification-text">${notification.text}</p>
      <span class="notification-time">${notification.time}</span>
    `;
    content.appendChild(notificationElement);
  });
}

function populateFriendsContent() {
  const content = document.getElementById("friendsContent");
  content.innerHTML = "";

  if (currentTab === 'friendsList') {
    // Filter friends based on search query
    const filteredFriends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchQuery)
    );
    
    if (filteredFriends.length === 0 && searchQuery) {
      content.innerHTML = '<div class="friend-item"><p class="friend-name">No friends found</p></div>';
      return;
    }
    
    filteredFriends.forEach(friend => {
      const friendElement = document.createElement("div");
      friendElement.className = "friend-item";
      friendElement.innerHTML = `
        <img src="${friend.avatar}" alt="Friend avatar" class="friend-avatar">
        <div class="friend-info">
          <p class="friend-name">${friend.name}</p>
          <p class="friend-status">${friend.status}</p>
        </div>
        ${friend.isActive ? '<span class="active-indicator"></span>' : ''}
      `;
      content.appendChild(friendElement);
    });
  } else {
    // Filter friend requests based on search query
    const filteredRequests = friendRequests.filter(request => 
      request.name.toLowerCase().includes(searchQuery)
    );
    
    if (filteredRequests.length === 0 && searchQuery) {
      content.innerHTML = '<div class="friend-item"><p class="friend-name">No requests found</p></div>';
      return;
    }
    
    filteredRequests.forEach(request => {
      const requestElement = document.createElement("div");
      requestElement.className = "friend-request";
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
      `;
      content.appendChild(requestElement);
    });
  }
}

function switchTab(tabName) {
  currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Clear search when switching tabs
  searchQuery = '';
  document.getElementById("friendSearchInput").value = '';

  // Update content
  populateFriendsContent();
}

function acceptFriendRequest(requestId) {
  const requestIndex = friendRequests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    const request = friendRequests[requestIndex];
    // Add to friends list
    friends.push({
      id: Date.now(),
      name: request.name,
      avatar: request.avatar,
      status: "Active now",
      isActive: true
    });
    // Remove from requests
    friendRequests.splice(requestIndex, 1);
    
    // Update displays
    populateFriendsContent();
    updateFriendRequestBadge();
  }
}

function declineFriendRequest(requestId) {
  const requestIndex = friendRequests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    friendRequests.splice(requestIndex, 1);
    populateFriendsContent();
    updateFriendRequestBadge();
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge");
  const count = notifications.length;

  if (count > 0) {
    badge.textContent = count > 9 ? "9+" : count.toString();
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function updateFriendRequestBadge() {
  const badge = document.getElementById("friendRequestBadge");
  const count = friendRequests.length;

  if (count > 0) {
    badge.textContent = count > 9 ? "9+" : count.toString();
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }

  // Update tab count
  const tabCount = document.querySelector(".request-count");
  if (tabCount) {
    tabCount.textContent = count.toString();
  }
}

// Comments functionality for profile
function openCommentsPanel(postId) {
  currentCommentPostId = postId;
  const panel = document.getElementById("commentsPanel");
  panel.classList.add("active");

  // Close other panels
  closeAllPanels();

  // Populate comments
  populateComments(postId);
}

function closeCommentsPanel() {
  const panel = document.getElementById("commentsPanel");
  panel.classList.remove("active");
  currentCommentPostId = null;

  // Clear comment input
  const commentInput = document.getElementById("commentInput");
  if (commentInput) {
    commentInput.value = "";
  }
}

function populateComments(postId) {
  const commentsList = document.getElementById("commentsList");
  const comments = profilePostComments[postId] || [];

  if (comments.length === 0) {
    commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
    return;
  }

  commentsList.innerHTML = "";
  comments.forEach(comment => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment-item";
    commentElement.innerHTML = `
      <div class="comment-author">${comment.author}</div>
      <p class="comment-text">${comment.text}</p>
      <div class="comment-time">${comment.time}</div>
    `;
    commentsList.appendChild(commentElement);
  });
}

function addComment() {
  const commentInput = document.getElementById("commentInput");
  const commentText = commentInput.value.trim();

  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }

  if (currentCommentPostId === null) return;

  // Add new comment
  if (!profilePostComments[currentCommentPostId]) {
    profilePostComments[currentCommentPostId] = [];
  }

  const newComment = {
    id: Date.now(),
    author: userData.username, // Current user
    text: commentText,
    time: "Just now"
  };

  profilePostComments[currentCommentPostId].push(newComment);

  // Update comment count in the UI
  const commentBtn = document.querySelector(`[data-post-id="${currentCommentPostId}"] .comment-count`);
  if (commentBtn) {
    const currentCount = parseInt(commentBtn.textContent);
    commentBtn.textContent = currentCount + 1;
  }

  // Refresh comments display
  populateComments(currentCommentPostId);

  // Clear input
  commentInput.value = "";

  // Show success message
  alert("Comment added successfully!");
}

function closeAllPanels() {
  const panels = ['notificationsPanel', 'friendsPanel'];
  const buttons = ['nav-notifications', 'nav-friends'];

  panels.forEach(panelId => {
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.remove("active");
  });

  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.remove("active");
  });
}

// Close panels when clicking outside
document.addEventListener("click", function(event) {
  const notificationsPanel = document.getElementById("notificationsPanel");
  const notificationBtn = document.getElementById("nav-notifications");
  const friendsPanel = document.getElementById("friendsPanel");
  const friendsBtn = document.getElementById("nav-friends");
  const commentsPanel = document.getElementById("commentsPanel");

  // Close notifications panel
  if (notificationsPanel && notificationsPanel.classList.contains("active") && 
      !notificationsPanel.contains(event.target) && 
      !notificationBtn.contains(event.target)) {
    notificationsPanel.classList.remove("active");
    notificationBtn.classList.remove("active");
  }

  // Close friends panel
  if (friendsPanel && friendsPanel.classList.contains("active") && 
      !friendsPanel.contains(event.target) && 
      !friendsBtn.contains(event.target)) {
    friendsPanel.classList.remove("active");
    friendsBtn.classList.remove("active");
  }

  // Close comments panel
  if (commentsPanel && commentsPanel.classList.contains("active") && 
      !commentsPanel.contains(event.target)) {
    closeCommentsPanel();
  }
});

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
  ["lengthReq", "numberReq", "uppercaseReq"].forEach((id) => {
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

  // Get user posts from localStorage
  const savedPosts = localStorage.getItem("userPosts");
  const userPosts = savedPosts ? JSON.parse(savedPosts) : [];

  let images;
  if (userPosts.length > cardIndex) {
    // Use user post images
    images = userPosts[cardIndex].images;
  } else {
    // Use default gallery images
    images = galleryImages[cardIndex] || ["/pictures/pic-hp-gallery-1.jpg"];
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

// Like functionality for profile posts
function toggleLike(button) {
  const article = button.closest("article");
  const postId = parseInt(article.dataset.index) || 0;

  if (!profilePostLikes[postId]) {
    profilePostLikes[postId] = { count: 0, liked: false };
  }

  const likeData = profilePostLikes[postId];
  const countSpan = button.querySelector(".like-count");

  if (likeData.liked) {
    // Unlike
    button.classList.remove("active");
    likeData.count--;
    likeData.liked = false;
  } else {
    // Like
    button.classList.add("active");
    likeData.count++;
    likeData.liked = true;
  }

  countSpan.textContent = likeData.count;
}

// Toggle comments for profile posts
function toggleComments(postId) {
  openCommentsPanel(postId);
}

// Funkcja do wyświetlania postów użytkownika
function displayUserPosts() {
  const postsContainer = document.querySelector(".recent-friends-cards");
  if (!postsContainer) return;

  // Pobierz posty z localStorage
  const savedPosts = localStorage.getItem("userPosts");
  const userPosts = savedPosts ? JSON.parse(savedPosts) : [];

  // Jeśli są posty, wyświetl je
  if (userPosts.length > 0) {
    // Wyczyść istniejące posty
    postsContainer.innerHTML = "";
    
    // Wyświetl maksymalnie 3 najnowsze posty
    const recentPosts = userPosts.slice(0, 3);
    
    recentPosts.forEach((post, index) => {
      const postElement = document.createElement("article");
      postElement.className = "card";
      postElement.dataset.index = index;
      
      // Utwórz galerię zdjęć
      const galleryImages = post.images.length > 0 ? post.images : ["/pictures/pic-hp-gallery-1.jpg"];
      
      // Initialize likes and comments for this post
      if (!profilePostLikes[index]) {
        profilePostLikes[index] = { count: post.likes || 0, liked: false };
      }
      if (!profilePostComments[index]) {
        profilePostComments[index] = post.comments || [];
      }
      
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
              data-post-id="${index}"
            >
              <i class="fas fa-comment"></i>
              <span class="comment-count">${profilePostComments[index].length}</span>
            </button>
            <button
              aria-label="Like meal"
              class="like-btn"
              type="button"
              onclick="toggleLike(this)"
            >
              <i class="fas fa-heart"></i>
              <span class="like-count">${profilePostLikes[index].count}</span>
            </button>
          </div>
        </div>
        <div class="avatar-username mt-3">
          <img
            alt="Your avatar"
            class="w-5 h-5 object-cover border border-black"
            height="20"
            src="/pictures/hp-prof-1.jpg"
            width="20"
          />
          <p class="text-[10px] font-sans select-none">${userData.username}</p>
        </div>
        <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none card-description">
          ${post.description}
        </p>
        <p class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none">
          <strong>Type:</strong> ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          ${post.calories !== "Not specified" ? ` • <strong>Calories:</strong> ${post.calories}` : ''}
        </p>
      `;
      
      postsContainer.appendChild(postElement);
    });
    
    // Add event listeners to comment buttons
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const postId = parseInt(this.dataset.postId);
        toggleComments(postId);
      });
    });
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
  ["breakfastTimeInput", "lunchTimeInput", "dinnerTimeInput", "snackTimeInput"].forEach((id) => {
    document.getElementById(id).addEventListener("change", updateSaveButton)
  })

  // Q&A inputs
  ["qa1Input", "qa2Input", "qa3Input"].forEach((id) => {
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
      const postId = parseInt(this.dataset.postId);
      toggleComments(postId);
    })
  })

  // Add tab click listeners
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });

  // Add search functionality
  const searchInput = document.getElementById("friendSearchInput");
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchFriends();
      }
    });
    
    // Real-time search as user types
    searchInput.addEventListener('input', function() {
      searchQuery = this.value.toLowerCase().trim();
      populateFriendsContent();
    });
  }

  // Add search button functionality
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener('click', searchFriends);
  }

  // Escape key functionality
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      const settingsPanel = document.getElementById("settingsPanel");
      const commentsPanel = document.getElementById("commentsPanel");
      
      if (settingsPanel && settingsPanel.classList.contains("active")) {
        closeSettings();
      }
      if (commentsPanel && commentsPanel.classList.contains("active")) {
        closeCommentsPanel();
      }
    }
  });
})

// Close panels when clicking outside
document.addEventListener("click", (event) => {
  const settingsPanel = document.getElementById("settingsPanel")
  const settingsIcon = document.getElementById("settingsIcon")

  // Close settings panel
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