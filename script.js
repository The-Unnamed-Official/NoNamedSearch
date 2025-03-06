let loggedIn = false;
const customizeBtn = document.getElementById("customizeBtn");
const themeSidebar = document.getElementById("themeSidebar");
const closeThemeSidebar = document.getElementById("closeThemeSidebar");
const mainContent = document.getElementById("mainContent");
const themeOptions = document.querySelectorAll(".theme-option");
const logoutPopup = document.getElementById("logoutPopup");
const loginPopup = document.getElementById("loginPopup");
const profile = document.getElementById("profileContainer");
const userIcon = document.getElementById("userIcon");
const profilePic = document.getElementById("profilePic");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loadingScreen = document.createElement("div");
const inputs = document.querySelectorAll("input, button, textarea, select");

// Show/hide theme sidebar
customizeBtn.addEventListener("click", () => {
  themeSidebar.classList.add("show");
  mainContent.classList.add("shrink");
});
closeThemeSidebar.addEventListener("click", () => {
  themeSidebar.classList.remove("show");
  mainContent.classList.remove("shrink");
});
document.addEventListener("click", (event) => {
  if (!themeSidebar.contains(event.target) && !customizeBtn.contains(event.target)) {
    themeSidebar.classList.remove("show");
    mainContent.classList.remove("shrink");
  }
});

// Setup loading screen element
loadingScreen.classList.add("loading-screen");
loadingScreen.innerHTML = '<div class="loader"></div>';
document.body.appendChild(loadingScreen);

// Profile popup toggling
profile.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!loggedIn) {
    loginPopup.classList.toggle("show");
    logoutPopup.classList.remove("show");
  } else {
    logoutPopup.classList.toggle("show");
    loginPopup.classList.remove("show");
  }
});
document.addEventListener("click", (event) => {
  if (!profile.contains(event.target)) {
    logoutPopup.classList.remove("show");
    loginPopup.classList.remove("show");
  }
});

// Loading screen functions
function showLoadingScreen() {
  loadingScreen.classList.add("visible");
  document.querySelectorAll("input, button, textarea, select").forEach(el => {
    el.disabled = true;
  });
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  setTimeout(() => {
    loadingScreen.classList.remove("visible");
    document.querySelectorAll("input, button, textarea, select").forEach(el => {
      el.disabled = false;
    });
  }, 800);
}
function showLoadingScreenLong() {
  loadingScreen.classList.add("visible");
  document.querySelectorAll("input, button, textarea, select").forEach(el => {
    el.disabled = true;
  });
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  setTimeout(() => {
    loadingScreen.classList.remove("visible");
    document.querySelectorAll("input, button, textarea, select").forEach(el => {
      el.disabled = false;
    });
  }, 2000);
}

// Login / logout functionality
loginBtn.addEventListener("click", () => {
  showLoadingScreen();
  setTimeout(() => {
    loggedIn = true;
    userIcon.classList.add("hide");
    profilePic.classList.remove("hide");
    loginPopup.classList.remove("show");
  }, 800);
});
logoutBtn.addEventListener("click", () => {
  showLoadingScreen();
  setTimeout(() => {
    loggedIn = false;
    userIcon.classList.remove("hide");
    profilePic.classList.add("hide");
    logoutPopup.classList.remove("show");
  }, 800);
});

// Preset theme function – also clears custom selection
function applyTheme(theme) {
  // Clear any custom background style and custom button selection
  document.body.style.backgroundColor = "";
  const customThemeBtn = document.getElementById("customTheme");
  if (customThemeBtn) {
    customThemeBtn.classList.remove("selected");
    customThemeBtn.style.backgroundColor = "";
  }
  
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else if (theme === "light") {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }
  localStorage.setItem("selectedTheme", theme);
  themeOptions.forEach((btn) => btn.classList.remove("selected"));
  const selectedBtn = document.getElementById(`${theme}Theme`);
  if (selectedBtn) {
    selectedBtn.classList.add("selected");
  }
}
const savedTheme = localStorage.getItem("selectedTheme") || "system";
applyTheme(savedTheme);
document.getElementById("systemTheme").addEventListener("click", () => applyTheme("system"));
document.getElementById("darkTheme").addEventListener("click", () => applyTheme("dark"));
document.getElementById("lightTheme").addEventListener("click", () => applyTheme("light"));

// Main DOMContentLoaded for search and navigation
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search");
  const mainContent = document.getElementById("mainContent");
  const homeContent = document.getElementById("homeContent");
  const resultsContent = document.getElementById("resultsContent");
  const navbar = document.createElement("div");
  let historyStack = [];
  let currentHistoryIndex = -1;
  
  // Create the navigation bar with search input
  navbar.classList.add("navbar");
  navbar.innerHTML = `
      <div class="nav-left">
          <i id="backBtn" class="fa-solid fa-arrow-left-long disabled"></i>
          <i id="forwardBtn" class="fa-solid fa-arrow-right-long disabled"></i>
          <i id="homeBtn" class="fa-solid fa-house"></i>
      </div>
      <div class="search-container">
          <input type="text" id="topSearch" placeholder="Search here...">
      </div>
  `;
  document.body.prepend(navbar);
  
  // Ensure the loading screen is set up
  loadingScreen.classList.add("loading-screen");
  loadingScreen.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(loadingScreen);
  
  // Home page search input event
  searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
          event.preventDefault();
          performSearch(searchInput.value);
      }
  });
  
  // Nav bar search input event
  document.getElementById("topSearch").addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
          event.preventDefault();
          performSearch(event.target.value);
      }
  });
  
  // Optional: search icon click (if present)
  document.getElementById("searchIcon") && document.getElementById("searchIcon").addEventListener("click", function () {
      const topSearchValue = document.getElementById("topSearch").value;
      performSearch(topSearchValue);
  });
  
  // Simulated search function
  function performSearch(query) {
    query = query.trim();
    if (query === "") {
      console.warn("Search query is empty!");
      return;
    }
    console.log("Searching for:", query);
    showLoadingScreenLong();
    setTimeout(() => {
      showResults(query);
      updateHistory(query);
    }, 2000);
  }
  
  // Display search results based on query
  function showResults(query) {
    if (!resultsContent) {
      console.error("Error: #resultsContent not found in the HTML!");
      return;
    }
    // Special case: "sols's rng" or "sols rng" or "sol rng"
    if (query.trim().toLowerCase() === "sol's rng" || query.trim().toLowerCase() === "sol's" || query.trim().toLowerCase() === "sols" || query.trim().toLowerCase() === "sols rng" || query.trim().toLowerCase() === "sol rng" || query.trim().toLowerCase() === "sols wiki" || query.trim().toLowerCase() === "sols rng wiki" || query.trim().toLowerCase() === "sol's rng wiki") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
      <div class="results-page">
          <h2>NoNamedSearch found 16 results for: <span>"${query}"</span></h2>
          <div class="result">
              <a target="_blank" href="https://sol-rng.fandom.com/wiki/Sol%27s_RNG_Wiki">Sol's RNG Wiki | Fandom</a>
              <p>Take your favorite fandoms with you and never miss a beat. ... Sol's RNG Wiki is a FANDOM Games Community. View Full Site ...</p>
          </div>
              <div class="resultLine">
                  <a target="_blank" href="https://sol-rng.fandom.com/wiki/Auras">Auras</a>
                  <p>This article is about Auras, which are Equipable VFX. For more ...</p>
              </div>
              <div class="resultLine">
                  <a target="_blank" href="https://sol-rng.fandom.com/wiki/Biomes">Biomes</a>
                  <p>It has a 1 in 3,000/s (0.033%/s) chance and lasts 10min. The ...</p>
              </div>
              <div class="resultLine">
                  <a target="_blank" href="https://sol-rng.fandom.com/wiki/NPC">NPC</a>
                  <p>NPC. NPCs are non-player characters with whom the player ...</p>
              </div>
              <div class="resultLine">
                  <a target="_blank" href="https://sol-rng.fandom.com/f">The Community!</a>
                  <p>Just Updated ... WE ARE ALL MAKING AN AURA ...</p>
              </div>
              <div class="resultLine">
                  <a target="_blank" href="https://sol-rng.fandom.com/wiki/Easter_Eggs">Easter Eggs</a>
                  <p>Easter Eggs are hidden secrets found within the game. They ...</p>
              </div>
          <div class="result">
            <a target="_blank" href="https://www.roblox.com/games/15532962292/Sols-RNG">Sol's RNG [❄️]</a>
              <p>Late Winter event just started!! ❄️ What is Sol's RNG? Click the "Roll" button to get 125+ Auras 🛠️ Craft unique gears with your auras!</p>
          </div>
          <div class="result">
            <a target="_blank" href="https://sol-rng.fandom.com/wiki/%E2%98%85%E2%98%85%E2%98%85">Information - Sol's RNG Wiki - Fandom</a>
              <p>Take your favorite fandoms with you and never miss a beat. ... Sol's RNG Wiki is a FANDOM Games Community. View Full Site ...</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://en.namu.wiki/w/Sol's%20RNG">Sol's RNG - NamuWiki</a>
              <p>Roblox 's hardcore RNG game. It was made by Korean developers. It is one of the few Korean popular games from ROBLOX. It is a game where you obtain and ...</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://namu.wiki/w/Sol's%20RNG">Sol's RNG</a>
              <p>Roblox의 하드코어 RNG류 게임. 한국인 개발자들이 만들었다. Roblox에서 몇 안되는 한국 출신 대인기 게임이다. 간단히 뽑기를 해서 아우라를 얻고 수집하는 게임이다 ...</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://www.reddit.com/r/SolsRNG">Sol's RNG on Reddit</a>
              <p>Join the Reddit community for discussion, updates, and fan content related to Sol's RNG.</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://www.youtube.com/results?search_query=Sol%27s+RNG">Sol's RNG Gameplay Videos | YouTube</a>
              <p>Watch gameplay videos, tutorials, and fan-made content on YouTube.</p>
          </div>
          <div class="resultLine">
              <a target="_blank" href="https://www.youtube.com/@FreezaReborn">FreezaReborn | Sol's RNG | YouTube</a>
              <p>Watch gameplay videos, tutorials, and fan-made content at FreezaReborn.</p>
          </div>
          <div class="resultLine">
              <a target="_blank" href="https://www.youtube.com/@NoodlyBlox">NoodleBlox | Sol's RNG | YouTube</a>
              <p>Watch gameplay videos, tutorials, and fan-made content at NoodleBlox.</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://discord.com/invite/solsrng">Sol's RNG Discord</a>
              <p>Join the official Discord server for real-time discussions and updates on Sol's RNG.</p>
          </div>
          <div class="result">
              <a target="_blank" href="https://twitter.com/search?q=Sol%27s%20RNG">Sol's RNG on Twitter</a>
              <p>Check out the latest tweets and news about Sol's RNG on Twitter.</p>
          </div>
      </div>
    `;
      navbar.classList.add("visible");

      // Function to set up simulated visited links
      function setupSimulatedVisited() {
        // Select all links within the results page
        const resultLinks = document.querySelectorAll('.results-page a');
        resultLinks.forEach(link => {
          // Create a unique key for each link
          const storageKey = 'visited_' + link.href;
          // If this link has been clicked before, add the simulated visited class
          if (localStorage.getItem(storageKey)) {
            link.classList.add('simulated-visited');
          }
          // Add event listener to update the storage and class when clicked
          link.addEventListener('click', () => {
            localStorage.setItem(storageKey, 'true');
            link.classList.add('simulated-visited');
          });
        });
      }

      // Run the setup after the HTML is inserted.
      // Using setTimeout to ensure the DOM is updated.
      setTimeout(setupSimulatedVisited, 0);
      
      // End of special case handling
      return;
    }
    // Special case: "unnamed"
    if (query.trim().toLowerCase() === "unnamed" || query.trim().toLowerCase() === "owner of nonamedsearch") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://cdn.discordapp.com/avatars/611204110955446301/a_876899e45f04e96d95558844412f7e7d.gif?size=1024" class="avatar">
            </div>
            <div class="profile-info">
                <p><span class="icon fas fa-user"></span> <strong>User ID:</strong> <a href="#" class="user-id">611204110955446301</a></p>
                <p><span class="icon fas fa-hashtag"></span> <strong>Username:</strong> <span class="username">not.unnamed</span></p>
                <p><span class="icon fas fa-tags"></span> <strong>Badges:</strong> <img src="https://discord.id/img/flags/7.png" class="badge"><img src="https://discord.id/img/flags/22.png" class="badge"></p>
                <p><span class="icon fas fa-asterisk"></span> <strong>Created:</strong> <span class="created-date">Wed, 14 Aug 2019 14:26:55 UTC</span></p>
                <p><span class="icon fas fa-palette"></span> <strong>Banner Color:</strong> <span class="banner-color-boxWhite"></span></p>
                <p><span class="icon fas fa-palette"></span> <img src="https://cdn.discordapp.com/banners/611204110955446301/a_e76e5091d6a08b37f5ff1979fa7462ad.gif?size=1024" class="badgeImage"></p>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      return;
    }
    // Special case: "lubjub"
    if (query.trim().toLowerCase() === "lubjub" || query.trim().toLowerCase() === "lubby") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://cdn.discordapp.com/avatars/698631401196617800/09dfecb1f1abc29e1b03607922120505.png?size=1024" class="avatar">
            </div>
            <div class="profile-info">
                <p><span class="icon fas fa-user"></span> <strong>User ID:</strong> <a href="#" class="user-id">698631401196617800</a></p>
                <p><span class="icon fas fa-hashtag"></span> <strong>Username:</strong> <span class="username">lubjub</span></p>
                <p><span class="icon fas fa-tags"></span> <strong>Badges:</strong> <img src="https://discord.id/img/flags/8.png" class="badge"></p>
                <p><span class="icon fas fa-asterisk"></span> <strong>Created:</strong> <span class="created-date">Sat, 11 Apr 2020 20:31:45 UTC</span></p>
                <p><span class="icon fas fa-palette"></span> <strong>Banner Color:</strong> <span class="banner-color-boxWhite"></span></p>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      return;
    }
    // Special case: "firecraze"
    if (query.trim().toLowerCase() === "firecraze" || query.trim().toLowerCase() === "fire") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://cdn.discordapp.com/avatars/1019955707153490000/63f8e7132a3e6a579a6ddb659b21b8fe.png?size=1024" class="avatar">
            </div>
            <div class="profile-info">
                <p><span class="icon fas fa-user"></span> <strong>User ID:</strong> <a href="#" class="user-id">1019955707153490000</a></p>
                <p><span class="icon fas fa-hashtag"></span> <strong>Username:</strong> <span class="username">firecraze_onyt</span></p>
                <p><span class="icon fas fa-tags"></span> <strong>Badges:</strong> <img src="https://discord.id/img/flags/7.png" class="badge"></p>
                <p><span class="icon fas fa-asterisk"></span> <strong>Created:</strong> <span class="created-date">Thu, 15 Sep 2022 12:59:50 UTC</span></p>
                <p><span class="icon fas fa-palette"></span> <strong>Banner Color:</strong> <span class="banner-color-boxFire"></span></p>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      return;
    }
    // Special case: "shenvi"
    if (query.trim().toLowerCase() === "shenvi" || query.trim().toLowerCase() === "shenvii") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://cdn.discordapp.com/avatars/518400920048893952/50764303ed018d64af8177fb42a5cef3.webp?size=1024&width=410&height=410" class="avatar">
            </div>
            <div class="profile-info">
                <p><span class="icon fas fa-user"></span> <strong>User ID:</strong> <a href="#" class="user-id">518400920048893952</a></p>
                <p><span class="icon fas fa-hashtag"></span> <strong>Username:</strong> <span class="username">shenevii</span></p>
                <p><span class="icon fas fa-tags"></span> <strong>Badges:</strong> <img src="https://discord.id/img/flags/8.png" class="badge"></p>
                <p><span class="icon fas fa-asterisk"></span> <strong>Created:</strong> <span class="created-date">Sat, 01 Dec 2018 12:20:10 UTC</span></p>
                <p><span class="icon fas fa-palette"></span> <strong>Banner Color:</strong> <span class="banner-color-boxEmpty"></span></p>
                <p><span class="icon fas fa-palette"></span> <img src="https://cdn.discordapp.com/banners/518400920048893952/a_6a5a18d2ae0c2498d99996f863e04fe6.gif?size=1024" class="badgeImage"></p>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      return;
    }
    // Special case: "liam"
    if (query.trim().toLowerCase() === "liam" || query.trim().toLowerCase() === "lima") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://cdn.discordapp.com/avatars/513431643466235926/ddcf5bf9faf2d67dd8cbf92a113561b6.png?size=1024" class="avatar">
            </div>
            <div class="profile-info">
                <p><span class="icon fas fa-user"></span> <strong>User ID:</strong> <a href="#" class="user-id">513431643466235926</a></p>
                <p><span class="icon fas fa-hashtag"></span> <strong>Username:</strong> <span class="username">liam4114</span></p>
                <p><span class="icon fas fa-tags"></span> <strong>Badges:</strong> <img src="https://discord.id/img/flags/7.png" class="badge"></p>
                <p><span class="icon fas fa-asterisk"></span> <strong>Created:</strong> <span class="created-date">Sat, 17 Nov 2018 19:14:02 UTC</span></p>
                <p><span class="icon fas fa-palette"></span> <strong>Banner Color:</strong> <span class="banner-color-boxLiam"></span></p>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      return;
    }
    // Special case: "unnamed rng", "unnameds rng", or "unnamed's rng"
    if (
      query.trim().toLowerCase() === "unnamed rng" ||
      query.trim().toLowerCase() === "unnameds rng" ||
      query.trim().toLowerCase() === "unnamed's rng"
    ) {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";

      resultsContent.innerHTML = `
        <iframe src="unnamedrng.html" class="full-screen-iframe"></iframe>
      `;

      navbar.classList.add("visible");
      return;
    }
    // Special case: "unnamed's rng" or "unnamed rng" or "rng"
    const lowered = query.trim().toLowerCase();
    if (lowered === "rng") {
      if (homeContent) homeContent.style.display = "none";
      mainContent.style.display = "none";
      resultsContent.style.display = "block";
      resultsContent.innerHTML = `
        <div class="results-page">
            <div class="rng-container">
                <button id="rngButton">Roll RNG</button>
                <div style="margin-top: 10px;">
                    <label for="maxNumber" style="font-size: 18px;">Max Number:</label>
                    <input type="number" id="maxNumber" value="6" min="1">
                </div>
                <div id="rngResult" class="rng-result"></div>
            </div>
        </div>
      `;
      navbar.classList.add("visible");
      setTimeout(() => {
        const rngButton = document.getElementById("rngButton");
        const maxNumberInput = document.getElementById("maxNumber");
        const rngResult = document.getElementById("rngResult");
        if (rngButton) {
          rngButton.addEventListener("click", function () {
            const maxValue = parseInt(maxNumberInput.value) || 6;
            const randomNum = Math.floor(Math.random() * maxValue) + 1;
            rngResult.textContent = randomNum;
            adjustFontSize(rngResult, randomNum);
          });
        }
      }, 0);
      return;
    }
    // Default search results
    if (homeContent) homeContent.style.display = "none";
    mainContent.style.display = "none";
    resultsContent.style.display = "block";
    resultsContent.innerHTML = `
      <div class="results-page">
          <h2>Search Results for: <span>"${query}"</span></h2>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query} HSAGDDhjgsad</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query} HSAGDDhjgsad</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query} HSAGDDhjgsad</span></p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span>.</p>
          </div>
          <div class="result">
              <a href="#"><span>${query}${query}${query}${query}${query}${query}${query}${query}</span></a>
              <p><span>${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}${query}</span></p>
          </div>
      </div>
    `;
    navbar.classList.add("visible");
  }
  
  function updateHistory(query) {
    historyStack = historyStack.slice(0, currentHistoryIndex + 1);
    historyStack.push(query);
    currentHistoryIndex++;
    updateNavButtons();
  }
  
  function updateNavButtons() {
    document.getElementById("backBtn").classList.toggle("disabled", currentHistoryIndex <= 0);
    document.getElementById("forwardBtn").classList.toggle("disabled", currentHistoryIndex >= historyStack.length - 1);
  }
  
  document.getElementById("backBtn").addEventListener("click", function () {
    if (currentHistoryIndex > 0) {
      currentHistoryIndex--;
      showResults(historyStack[currentHistoryIndex]);
      updateNavButtons();
    }
  });
  
  document.getElementById("forwardBtn").addEventListener("click", function () {
    if (currentHistoryIndex < historyStack.length - 1) {
      currentHistoryIndex++;
      showResults(historyStack[currentHistoryIndex]);
      updateNavButtons();
    }
  });
  
  document.getElementById("homeBtn").addEventListener("click", function () {
    if (homeContent) homeContent.style.display = "block";
    mainContent.style.display = "block";
    resultsContent.style.display = "none";
    resultsContent.innerHTML = "";
    navbar.classList.remove("visible");
    historyStack = [];
    currentHistoryIndex = -1;
  });
});

// Adjust the font size of the RNG result based on its length
function adjustFontSize(element, number) {
  const numberLength = number.toString().length;
  let fontSize = 80;
  if (numberLength > 10) {
    fontSize = 70;
  } 
  if (numberLength > 15) {
    fontSize = 65;
  }
  if (numberLength > 16) {
    fontSize = 62;
  }
  if (numberLength > 17) {
    fontSize = 59;
  }
  if (numberLength > 18) {
    fontSize = 56;
  }
  if (numberLength > 19) {
    fontSize = 53;
  }
  if (numberLength > 20) {
    fontSize = 50;
  }
  element.style.fontSize = `${fontSize}px`;
}

// Custom theme functionality
document.addEventListener("DOMContentLoaded", function () {
  const customColorPicker = document.getElementById("customColorPicker");
  const customThemeBtn = document.getElementById("customTheme");
  
  customColorPicker.addEventListener("change", (e) => {
    const chosenColor = e.target.value;
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.style.backgroundColor = chosenColor;
    localStorage.setItem("customThemeColor", chosenColor);
    localStorage.setItem("selectedTheme", "custom");
    
    // Mark the custom button as selected (turn it green)
    const themeOptions = document.querySelectorAll(".theme-option");
    themeOptions.forEach(btn => btn.classList.remove("selected"));
    customThemeBtn.classList.add("selected");
    customThemeBtn.style.backgroundColor = "green";
  });
  
  const savedCustomColor = localStorage.getItem("customThemeColor");
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme === "custom" && savedCustomColor) {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.style.backgroundColor = savedCustomColor;
    const themeOptions = document.querySelectorAll(".theme-option");
    themeOptions.forEach(btn => btn.classList.remove("selected"));
    customThemeBtn.classList.add("selected");
    customThemeBtn.style.backgroundColor = "green";
  }
});