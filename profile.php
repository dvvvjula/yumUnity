<?php
require_once 'check_session.php';
requireLogin();
$user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Profile Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
      rel="stylesheet"
    />
    <!-- Backup Google Font -->
    <link
      href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
      rel="stylesheet"
    />
    
    <!-- Preload Pecita font files -->
    <link rel="preload" href="fonts/Pecita.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="fonts/Pecita.otf" as="font" type="font/otf" crossorigin>
    
    <link rel="stylesheet" href="profile.css" />
    
    <style>
      /* Inline Pecita font loading for extra security */
      @font-face {
        font-family: 'PecitaInline';
        src: url('./fonts/Pecita.woff2') format('woff2'),
             url('./fonts/pecita.woff2') format('woff2'),
             url('fonts/Pecita.woff2') format('woff2'),
             url('fonts/pecita.woff2') format('woff2'),
             url('./fonts/Pecita.otf') format('opentype'),
             url('./fonts/pecita.otf') format('opentype'),
             url('fonts/Pecita.otf') format('opentype'),
             url('fonts/pecita.otf') format('opentype');
        font-display: swap;
        font-weight: normal;
        font-style: normal;
      }
      
      /* Force Pecita loading classes */
      .force-pecita {
        font-family: 'PecitaInline', 'Pecita', 'Indie Flower', cursive !important;
        font-weight: normal !important;
        font-style: normal !important;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body>
    <!-- Font loading test element (invisible) -->
    <div style="position: absolute; left: -9999px; font-family: 'PecitaInline', 'Pecita', 'Indie Flower', cursive;">Font test</div>
    
    <!-- Top bar with logo and logout -->
    <header class="flex justify-center relative py-4">
      <img
        src="pictures/logo.png"
        alt="YM University logo black text on transparent background"
        class="logo-img"
        role="img"
        aria-label="YM University logo"
        tabindex="0"
        onclick="goToPage('homepage.php')"
      />
      <button
        class="logout-btn"
        type="button"
        onclick="window.location.href='authentication/logout.php'"
        aria-label="Log out"
      >
        Log out
      </button>
    </header>

    <!-- Left Navigation -->
    <nav class="left-nav" role="navigation" aria-label="Main navigation">
      <button
        class="nav-btn"
        onclick="goToPage('homepage.php')"
        title="Home"
        type="button"
        id="nav-home"
      >
        <i class="fas fa-home"></i>
      </button>
      <button
        class="nav-btn active"
        onclick="goToPage('profile.php')"
        title="Profile"
        type="button"
        id="nav-profile"
      >
        <i class="fas fa-user"></i>
      </button>
      <button
        class="nav-btn"
        onclick="toggleFriendsPanel()"
        title="Friends"
        type="button"
        id="nav-friends"
      >
        <i class="fas fa-globe"></i>
        <span class="friend-request-badge" id="friendRequestBadge">3</span>
      </button>
      <button
        class="nav-btn"
        onclick="toggleNotificationsPanel()"
        title="Notifications"
        type="button"
        id="nav-notifications"
      >
        <i class="fas fa-bell"></i>
        <span class="notification-badge" id="notificationBadge">6</span>
      </button>
    </nav>

    <!-- Friends Panel -->
    <div class="friends-panel" id="friendsPanel">
      <div class="friends-header">
        <h3>Friends</h3>
      </div>
      <div class="friends-search">
        <input
          type="text"
          placeholder="Search friends..."
          id="friendSearchInput"
        />
        <button class="search-btn" onclick="searchFriends()">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="friends-tabs">
        <button class="tab-btn active" data-tab="friendsList">Friends</button>
        <button class="tab-btn" data-tab="friendRequests">
          Requests <span class="request-count">3</span>
        </button>
      </div>
      <div class="friends-content" id="friendsContent">
        <!-- Content will be populated by JavaScript -->
      </div>
    </div>

    <div class="notifications-panel" id="notificationsPanel">
      <div class="notifications-header">
        <h3>Notifications</h3>
      </div>
      <div class="notifications-content" id="notificationsContent">
        <!-- Powiadomienia będą dodawane przez JavaScript -->
      </div>
    </div>

    <main class="main-content">
      <!-- Profile label container -->
      <div class="profile-label-container">
        <div class="profile-label force-pecita">My profile</div>
      </div>

      <!-- Profile and Q&A container -->
      <section
        class="profile-main-container"
        aria-label="Profile information and Q&A"
      >
        <img
          alt="Profile picture"
          class="profile-image"
          src="pictures/hp-prof-1.jpg"
          width="140"
          height="140"
          id="profileImg"
        />
        <div class="profile-text">
          <h2 id="profileUsername"><?php echo htmlspecialchars($user['username']); ?></h2>
          <p id="profileBio"><?php 
require_once 'config.php';
$pdo = getDBConnection();
$stmt = $pdo->prepare("SELECT bio FROM users WHERE id = ?");
$stmt->execute([$user['id']]);
$profile = $stmt->fetch();
echo htmlspecialchars($profile['bio'] ?? 'new food this, new food that... i love pasta.');
?></p>
        </div>
        <aside class="qa-box" aria-label="Q and A">
          <h3>Q&amp;A</h3>
          <div id="qaContent">
            <div class="qa-item">
              <strong>What's your favorite cuisine?</strong>
              <p id="qa1">italian cuisine with fresh pasta and tomatoes</p>
            </div>
            <div class="qa-item">
              <strong>Do you have any dietary restrictions?</strong>
              <p id="qa2">im vegetarian and avoid spicy food</p>
            </div>
            <div class="qa-item">
              <strong>What's your cooking skill level?</strong>
              <p id="qa3">intermediate - i love trying new recipes!</p>
            </div>
          </div>
        </aside>
        <i
          class="fas fa-cog settings-icon"
          title="Settings"
          role="button"
          tabindex="0"
          aria-label="Open settings panel"
          id="settingsIcon"
        ></i>
      </section>

      <!-- Bottom white boxes: calendar and meal schedule -->
      <section class="bottom-boxes" aria-label="Calendar and meal schedule">
        <div
          class="calendar-box"
          aria-label="Calendar for current month and year"
        >
          <h4 id="calendarTitle">MARCH '25</h4>
          <table
            aria-labelledby="calendarTitle"
            role="grid"
            aria-readonly="true"
          >
            <thead>
              <tr>
                <th scope="col">S</th>
                <th scope="col">M</th>
                <th scope="col">T</th>
                <th scope="col">W</th>
                <th scope="col">T</th>
                <th scope="col">F</th>
                <th scope="col">S</th>
              </tr>
            </thead>
            <tbody id="calendarBody"></tbody>
          </table>
        </div>
        <aside class="meal-schedule-box" aria-label="My meal schedule">
          <h4>MY MEAL SCHEDULE</h4>
          <div class="meal-schedule-content">
            <div class="meal-item">
              <span class="meal-name">Breakfast:</span>
              <span class="meal-time" id="breakfastTime">8:00</span>
            </div>
            <div class="meal-item">
              <span class="meal-name">Lunch:</span>
              <span class="meal-time" id="lunchTime">12:00</span>
            </div>
            <div class="meal-item">
              <span class="meal-name">Dinner:</span>
              <span class="meal-time" id="dinnerTime">18:00</span>
            </div>
            <div class="meal-item">
              <span class="meal-name">Snack:</span>
              <span class="meal-time" id="snackTime">15:00</span>
            </div>
          </div>
        </aside>
      </section>

      <!-- My recent meals heading -->
      <h3 class="recent-meals-title">My recent meals</h3>

      <!-- Gallery -->
      <section aria-label="Recent friends' meals" class="recent-friends-cards">
        <!-- Card 1 -->
        <article class="card" data-index="0">
          <div class="gallery-image-container">
            <img
              alt="Sandwich cut in half on white plate on a light surface"
              src="pictures/pic-prof-gallery-1.jpg"
              loading="lazy"
              class="gallery-image"
              data-current="0"
            />
            <button
              aria-label="Previous meal"
              class="gallery-arrow left"
              type="button"
              onclick="navigateGallery('left', 0)"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              aria-label="Next meal"
              class="gallery-arrow right"
              type="button"
              onclick="navigateGallery('right', 0)"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="flex items-center mt-3 justify-end">
            <div class="flex space-x-3 text-[12px] text-black">
              <button
                aria-label="Comment on meal xyz1"
                class="comment-btn"
                type="button"
              >
                <i class="fas fa-comment"></i>
                <span class="comment-count">3</span>
              </button>
              <button
                aria-label="Like meal xyz1"
                class="like-btn"
                type="button"
                onclick="toggleLike(this)"
              >
                <i class="fas fa-heart"></i>
                <span class="like-count">12</span>
              </button>
            </div>
          </div>
          <div class="avatar-username mt-3">
            <img
              alt="Avatar image of user"
              class="w-5 h-5 object-cover border border-black"
              height="20"
              src="pictures/hp-prof-1.jpg"
              width="20"
            />
            <p class="text-[10px] font-sans select-none"><?php echo htmlspecialchars($user['username']); ?></p>
          </div>
          <p
            class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none card-description"
          >
            my sandwiches look so nice!!! white cheese and cucumbers hihi
          </p>
        </article>

        <!-- Card 2 -->
        <article class="card" data-index="1">
          <div class="gallery-image-container">
            <img
              alt="Dumplings in a bowl with greens"
              src="pictures/pic-prof-gallery-2.jpg"
              loading="lazy"
              class="gallery-image"
              data-current="0"
            />
            <button
              aria-label="Previous meal"
              class="gallery-arrow left"
              type="button"
              onclick="navigateGallery('left', 1)"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              aria-label="Next meal"
              class="gallery-arrow right"
              type="button"
              onclick="navigateGallery('right', 1)"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="flex items-center mt-3 justify-end">
            <div class="flex space-x-3 text-[12px] text-black">
              <button
                aria-label="Comment on meal xyz2"
                class="comment-btn"
                type="button"
              >
                <i class="fas fa-comment"></i>
                <span class="comment-count">5</span>
              </button>
              <button
                aria-label="Like meal xyz2"
                class="like-btn"
                type="button"
                onclick="toggleLike(this)"
              >
                <i class="fas fa-heart"></i>
                <span class="like-count">8</span>
              </button>
            </div>
          </div>
          <div class="avatar-username mt-3">
            <img
              alt="Avatar image of user"
              class="w-5 h-5 object-cover border border-black"
              height="20"
              src="pictures/hp-prof-1.jpg"
              width="20"
            />
            <p class="text-[10px] font-sans select-none"><?php echo htmlspecialchars($user['username']); ?></p>
          </div>
          <p
            class="text-[8px] mt-1 font-sans text-black/70 leading-tight select-none card-description"
          >
            how do you like my lunch GUYSSSSSS hello
          </p>
        </article>
      </section>
    </main>

    <!-- Settings Panel -->
    <div class="settings-panel" id="settingsPanel">
      <h3 class="force-pecita">Settings</h3>
      <form class="auth-form" id="settingsForm">
        <div class="form-group">
          <input
            type="text"
            id="usernameInput"
            name="username"
            placeholder="Username"
            value="<?php echo htmlspecialchars($user['username']); ?>"
          />
          <div id="usernameError" class="error-message"></div>
        </div>

        <div class="form-group password-group">
          <input
            type="password"
            id="passwordInput"
            name="password"
            placeholder="New Password"
          />
          <button
            type="button"
            class="password-toggle"
            onclick="togglePassword('passwordInput')"
          >
            <i class="fas fa-eye" id="passwordToggleIcon"></i>
          </button>
        </div>

        <div class="password-requirements">
          <div class="requirement" id="lengthReq">
            <i class="fas fa-times"></i>
            <span>min. 8 characters</span>
          </div>
          <div class="requirement" id="numberReq">
            <i class="fas fa-times"></i>
            <span>min. 1 number</span>
          </div>
          <div class="requirement" id="uppercaseReq">
            <i class="fas fa-times"></i>
            <span>min. 1 uppercase letter</span>
          </div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio/Description:</label>
          <textarea
            id="bioInput"
            placeholder="Tell us about yourself..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <input
            type="file"
            id="profileImageInput"
            name="profileImage"
            accept="image/*"
            style="display: none"
          />
          <button
            type="button"
            class="auth-button"
            onclick="document.getElementById('profileImageInput').click()"
          >
            Choose Profile Image
          </button>
          <div id="imagePreview" class="image-preview"></div>
        </div>

        <!-- Meal Schedule Settings -->
        <div class="meal-schedule-settings">
          <h4>Meal Schedule</h4>
          <div class="meal-time-inputs">
            <div class="form-group meal-time-group">
              <label for="breakfastTimeInput">Breakfast</label>
              <input type="time" id="breakfastTimeInput" value="08:00" />
            </div>
            <div class="form-group meal-time-group">
              <label for="lunchTimeInput">Lunch</label>
              <input type="time" id="lunchTimeInput" value="12:00" />
            </div>
            <div class="form-group meal-time-group">
              <label for="dinnerTimeInput">Dinner</label>
              <input type="time" id="dinnerTimeInput" value="18:00" />
            </div>
            <div class="form-group meal-time-group">
              <label for="snackTimeInput">Snack</label>
              <input type="time" id="snackTimeInput" value="15:00" />
            </div>
          </div>
        </div>

        <!-- Q&A Settings -->
        <div class="qa-settings">
          <h4>Q&A</h4>
          <div class="form-group">
            <label for="qa1Input">What's your favorite cuisine?</label>
            <textarea
              id="qa1Input"
              placeholder="Tell us about your favorite cuisine..."
              rows="2"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="qa2Input">Do you have any dietary restrictions?</label>
            <textarea
              id="qa2Input"
              placeholder="Share your dietary preferences..."
              rows="2"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="qa3Input">What's your cooking skill level?</label>
            <textarea
              id="qa3Input"
              placeholder="Describe your cooking experience..."
              rows="2"
            ></textarea>
          </div>
        </div>

        <button type="submit" class="auth-button" id="saveButton" disabled>
          Save Changes
        </button>
      </form>
      <button
        class="auth-button"
        onclick="closeSettings()"
        style="margin-top: 1rem"
      >
        Close
      </button>
    </div>

    <!-- Footer -->
    <footer class="page-footer">
      <a class="footer-link" href="#">ABOUT US</a>
      <div class="copyright">
        <span>©</span>
        <span class="footer-yumunity pecita-font force-pecita">YumUnity</span>
        <span>All right reserved.</span>
      </div>
      <div class="social-links">
        <a aria-label="Facebook" class="social-link" href="#"
          ><i class="fab fa-facebook-f"></i
        ></a>
        <a aria-label="Instagram" class="social-link" href="#"
          ><i class="fab fa-instagram"></i
        ></a>
        <a aria-label="Twitter" class="social-link" href="#"
          ><i class="fab fa-twitter"></i
        ></a>
      </div>
    </footer>

    <script>
      // Pass user data to JavaScript
      window.currentUser = {
        username: "<?php echo htmlspecialchars($user['username']); ?>",
        email: "<?php echo htmlspecialchars($user['email']); ?>"
      };
    </script>
    <script src="profile.js"></script>
    
    <!-- Font debugging script -->
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Check font loading
        const testElements = document.querySelectorAll('.force-pecita');
        if (testElements.length > 0) {
          const computedStyle = getComputedStyle(testElements[0]);
          console.log('Pecita font family applied:', computedStyle.fontFamily);
          console.log('Font weight:', computedStyle.fontWeight);
          console.log('Font style:', computedStyle.fontStyle);
        }
        
        // Force font loading check
        if (document.fonts) {
          document.fonts.ready.then(function() {
            console.log('All fonts loaded successfully');
            document.fonts.forEach(function(font) {
              if (font.family.includes('Pecita')) {
                console.log('Pecita font loaded:', font.family, font.style, font.weight);
              }
            });
          });
        }
        
        // Test font loading after 2 seconds
        setTimeout(function() {
          const profileLabel = document.querySelector('.profile-label.force-pecita');
          if (profileLabel) {
            console.log('Profile label Pecita font after 2s:', getComputedStyle(profileLabel).fontFamily);
          }
        }, 2000);
      });
    </script>
  </body>
</html>
