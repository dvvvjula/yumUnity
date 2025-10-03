<?php
require_once 'check_session.php';
requireLogin();
$user = getCurrentUser();

require_once 'config.php';
$pdo = getDBConnection();
$stmt = $pdo->prepare("SELECT bio FROM users WHERE id = ?");
$stmt->execute([$user['id']]);
$profile = $stmt->fetch();
$bio = $profile['bio'] ?? 'new food this, new food that... i love pasta.';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <title>Profile Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet" />

  <link rel="preload" href="fonts/Pecita.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/Pecita.otf" as="font" type="font/otf" crossorigin>

  <link rel="stylesheet" href="profile.css" />

  <style>
    @font-face {
      font-family: 'PecitaInline';
      src:
        url('./fonts/Pecita.woff2') format('woff2'),
        url('fonts/Pecita.woff2') format('woff2'),
        url('./fonts/Pecita.otf') format('opentype'),
        url('fonts/Pecita.otf') format('opentype');
      font-display: swap;
      font-weight: normal;
      font-style: normal;
    }

    .force-pecita {
      font-family: 'PecitaInline', 'Pecita', 'Indie Flower', cursive !important;
      font-weight: normal !important;
      font-style: normal !important;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .post-description {
      font-family: 'Poppins', sans-serif !important;
      font-size: 12px !important;
      color: black !important;
      margin-top: 0.25rem;
      line-height: 1.4;
      font-weight: normal;
    }
  </style>
</head>
<body>
  <div style="position: absolute; left: -9999px; font-family: 'PecitaInline', 'Pecita', 'Indie Flower', cursive;">Font test</div>

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

  <!-- left navigation -->
  <nav class="left-nav" role="navigation" aria-label="Main navigation">
    <button class="nav-btn" onclick="goToPage('homepage.php')" title="Home" type="button" id="nav-home">
      <i class="fas fa-home"></i>
    </button>
    <button class="nav-btn active" onclick="goToPage('profile.php')" title="Profile" type="button" id="nav-profile">
      <i class="fas fa-user"></i>
    </button>
    <button class="nav-btn" onclick="toggleFriendsPanel()" title="Friends" type="button" id="nav-friends">
      <i class="fas fa-globe"></i>
      <span class="friend-request-badge" id="friendRequestBadge">3</span>
    </button>
    <button class="nav-btn" onclick="toggleNotificationsPanel()" title="Notifications" type="button" id="nav-notifications">
      <i class="fas fa-bell"></i>
      <span class="notification-badge" id="notificationBadge">6</span>
    </button>
  </nav>

    <!-- friends panel (same as homepage.php) -->
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
      </div>
    </div>

    <div class="notifications-panel" id="notificationsPanel">
      <div class="notifications-header">
        <h3>Notifications</h3>
      </div>
      <div class="notifications-content" id="notificationsContent">
      </div>
    </div>

    <main class="main-content">
      <!-- profile label container -->
      <div class="profile-label-container">
        <div class="profile-label force-pecita">My profile</div>
      </div>

      <!-- profile and q&a container -->
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

      <!-- bottom white boxes: calendar and meal schedule -->
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

    <!-- gallery -->
    <section aria-label="Recent friends' meals" class="recent-friends-cards">
      <!-- card 1 -->
      <article class="card" data-index="0">
        <div class="gallery-image-container" style="position: relative;">
          <button 
            class="delete-post-btn" 
            onclick="deletePost(0)"
            style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: 1px solid #000; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;"
            title="Delete post">
            <i class="fas fa-trash" style="font-size: 10px;"></i>
          </button>
          <img
            alt="Sandwich cut in half on white plate on a light surface"
            src="pictures/pic-prof-gallery-1.jpg"
            loading="lazy"
            class="gallery-image"
            data-current="0"
          />
          <button aria-label="Previous meal" class="gallery-arrow left" type="button" onclick="navigateGallery('left', 0)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button aria-label="Next meal" class="gallery-arrow right" type="button" onclick="navigateGallery('right', 0)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="flex items-center mt-3 justify-end">
          <div class="flex space-x-3 text-[12px] text-black">
            <button aria-label="Comment on meal xyz1" class="comment-btn" type="button" onclick="toggleComments(0)">
              <i class="fas fa-comment"></i>
              <span class="comment-count">0</span>
            </button>
            <button aria-label="Like meal xyz1" class="like-btn" type="button" onclick="toggleLike(0)">
              <i class="fas fa-heart"></i>
              <span class="like-count">3</span>
            </button>
          </div>
        </div>
        <p class="post-description force-pecita" id="desc-0">
          sandwich with ham and cheese on white bread, light and tasty
        </p>
      </article>

      <!-- card 2 -->
      <article class="card" data-index="1">
        <div class="gallery-image-container" style="position: relative;">
          <button 
            class="delete-post-btn" 
            onclick="deletePost(1)"
            style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: 1px solid #000; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;"
            title="Delete post">
            <i class="fas fa-trash" style="font-size: 10px;"></i>
          </button>
          <img
            alt="Caprese salad with tomatoes and mozzarella on a white plate"
            src="pictures/pic-prof-gallery-2.jpg"
            loading="lazy"
            class="gallery-image"
            data-current="0"
          />
          <button aria-label="Previous meal" class="gallery-arrow left" type="button" onclick="navigateGallery('left', 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button aria-label="Next meal" class="gallery-arrow right" type="button" onclick="navigateGallery('right', 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="flex items-center mt-3 justify-end">
          <div class="flex space-x-3 text-[12px] text-black">
            <button aria-label="Comment on meal xyz2" class="comment-btn" type="button" onclick="toggleComments(1)">
              <i class="fas fa-comment"></i>
              <span class="comment-count">2</span>
            </button>
            <button aria-label="Like meal xyz2" class="like-btn" type="button" onclick="toggleLike(1)">
              <i class="fas fa-heart"></i>
              <span class="like-count">4</span>
            </button>
          </div>
        </div>
        <p class="post-description force-pecita" id="desc-1">
          caprese salad with fresh mozzarella and tomatoes, perfect for summer
        </p>
      </article>
    </section>
  </main>

  <!-- settings panel -->
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

        <!-- meal schedule settings -->
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

        <!-- q&a Settings -->
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

    <!-- footer -->
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
      // pass user data to js
      window.currentUser = {
        username: "<?php echo htmlspecialchars($user['username']); ?>",
        email: "<?php echo htmlspecialchars($user['email']); ?>"
      };
    </script>
    <script src="profile.js"></script>

  <script src="profile.js"></script>
</body>
</html>
