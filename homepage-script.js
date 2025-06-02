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

function toggleFriendsPanel() {
  alert("Toggle Friends Panel")
}

function toggleNotificationsPanel() {
  alert("Toggle Notifications Panel")
}

// Gallery images for each card
const galleryImages = [
  [
    "https://storage.googleapis.com/a1aa/image/f8c8496c-c8a2-4228-cf1d-4c4c8bc595b2.jpg",
    "https://placehold.co/220x170?text=Meal+1+Alt+1",
    "https://placehold.co/220x170?text=Meal+1+Alt+2",
  ],
  [
    "https://storage.googleapis.com/a1aa/image/cfe2c722-28c9-42d9-3b5b-bea15ceb3706.jpg",
    "https://placehold.co/220x170?text=Meal+2+Alt+1",
    "https://placehold.co/220x170?text=Meal+2+Alt+2",
  ],
  [
    "https://storage.googleapis.com/a1aa/image/e9346f27-f317-4c6f-7e9f-cca453f37b2d.jpg",
    "https://placehold.co/220x170?text=Meal+3+Alt+1",
    "https://placehold.co/220x170?text=Meal+3+Alt+2",
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

// Toggle comments visibility (removed since comments are removed from HTML)
function toggleComments(cardIndex) {
  // Comments functionality removed
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
  if (path.endsWith("homepage.html") || path.endsWith("/")) {
    homeBtn.classList.add("active")
  } else if (path.endsWith("profile.html")) {
    profileBtn.classList.add("active")
  }
}
highlightNav()
