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
const customThemeLabel = document.querySelector(".custom-color-label");
const interactiveSelector = "input, button, textarea, select";

const loadingScreen = document.createElement("div");
loadingScreen.classList.add("loading-screen");
loadingScreen.innerHTML = '<div class="loader"></div>';
document.body.appendChild(loadingScreen);

function setInteractiveElementsDisabled(disabled) {
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.disabled = disabled;
  });
}

function showLoadingScreen() {
  loadingScreen.classList.add("visible");
  setInteractiveElementsDisabled(true);
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
}

function hideLoadingScreen() {
  loadingScreen.classList.remove("visible");
  setInteractiveElementsDisabled(false);
}

function clearCustomThemeSelection() {
  if (customThemeLabel) {
    customThemeLabel.classList.remove("selected");
    customThemeLabel.style.backgroundColor = "";
    customThemeLabel.style.color = "";
  }
}

function setCustomThemeSelection(color) {
  if (!customThemeLabel || !color) {
    return;
  }
  customThemeLabel.classList.add("selected");
  customThemeLabel.style.backgroundColor = color;
  customThemeLabel.style.color = getContrastingTextColor(color);
}

function getContrastingTextColor(color) {
  if (!color) {
    return "#fff";
  }

  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }

  if (hex.length !== 6) {
    return "#fff";
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return "#fff";
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000" : "#fff";
}

// Show/hide theme sidebar
if (customizeBtn && themeSidebar && closeThemeSidebar) {
  customizeBtn.addEventListener("click", () => {
    themeSidebar.classList.add("show");
    if (mainContent) {
      mainContent.classList.add("shrink");
    }
  });
  closeThemeSidebar.addEventListener("click", () => {
    themeSidebar.classList.remove("show");
    if (mainContent) {
      mainContent.classList.remove("shrink");
    }
  });
  document.addEventListener("click", (event) => {
    if (!themeSidebar.contains(event.target) && !customizeBtn.contains(event.target)) {
      themeSidebar.classList.remove("show");
      if (mainContent) {
        mainContent.classList.remove("shrink");
      }
    }
  });
}

// Profile popup toggling
if (profile) {
  profile.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!loggedIn) {
      loginPopup?.classList.toggle("show");
      logoutPopup?.classList.remove("show");
    } else {
      logoutPopup?.classList.toggle("show");
      loginPopup?.classList.remove("show");
    }
  });

  document.addEventListener("click", (event) => {
    if (!profile.contains(event.target)) {
      logoutPopup?.classList.remove("show");
      loginPopup?.classList.remove("show");
    }
  });
}

// Login / logout functionality
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    showLoadingScreen();
    setTimeout(() => {
      loggedIn = true;
      userIcon?.classList.add("hide");
      profilePic?.classList.remove("hide");
      loginPopup?.classList.remove("show");
      hideLoadingScreen();
    }, 800);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    showLoadingScreen();
    setTimeout(() => {
      loggedIn = false;
      userIcon?.classList.remove("hide");
      profilePic?.classList.add("hide");
      logoutPopup?.classList.remove("show");
      hideLoadingScreen();
    }, 800);
  });
}

// Preset theme function – also clears custom selection
function applyTheme(theme) {
  document.body.style.backgroundColor = "";
  clearCustomThemeSelection();

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

document.getElementById("systemTheme")?.addEventListener("click", () => applyTheme("system"));
document.getElementById("darkTheme")?.addEventListener("click", () => applyTheme("dark"));
document.getElementById("lightTheme")?.addEventListener("click", () => applyTheme("light"));

// Main DOMContentLoaded for search and navigation
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search");
  const homeContent = document.getElementById("homeContent");
  const resultsContent = document.getElementById("resultsContent");
  if (!resultsContent) {
    return;
  }

  const navbar = document.createElement("div");
  navbar.classList.add("navbar");
  navbar.innerHTML = `
      <div class="nav-left">
          <i id="backBtn" class="fa-solid fa-arrow-left-long disabled" aria-label="Go back"></i>
          <i id="forwardBtn" class="fa-solid fa-arrow-right-long disabled" aria-label="Go forward"></i>
          <i id="homeBtn" class="fa-solid fa-house" aria-label="Go home"></i>
      </div>
      <div class="search-container">
          <input type="text" id="topSearch" placeholder="Search here..." aria-label="Search" autocomplete="off">
      </div>
  `;
  document.body.prepend(navbar);

  const backBtn = navbar.querySelector("#backBtn");
  const forwardBtn = navbar.querySelector("#forwardBtn");
  const homeBtn = navbar.querySelector("#homeBtn");
  const navSearchInput = navbar.querySelector("#topSearch");
  const homeSearchIcon = document.getElementById("searchIcon");

  const historyStack = [];
  let currentHistoryIndex = -1;

  function setSearchValues(value) {
    if (searchInput) {
      searchInput.value = value;
    }
    if (navSearchInput) {
      navSearchInput.value = value;
    }
  }

  function updateNavButtons() {
    if (backBtn) {
      backBtn.classList.toggle("disabled", currentHistoryIndex <= 0);
    }
    if (forwardBtn) {
      const disableForward = currentHistoryIndex === -1 || currentHistoryIndex >= historyStack.length - 1;
      forwardBtn.classList.toggle("disabled", disableForward);
    }
  }

  function ensureResultsView() {
    homeContent?.style.setProperty("display", "none");
    if (mainContent) {
      mainContent.style.display = "none";
    }
    resultsContent.style.display = "block";
    navbar.classList.add("visible");
  }

  function renderResults(entry) {
    ensureResultsView();
    setSearchValues(entry.query);

    const page = document.createElement("div");
    page.className = "results-page";

    const heading = document.createElement("h2");
    heading.textContent = `Search results for "${entry.query}"`;
    page.appendChild(heading);

    if (!entry.results.length) {
      const noResults = document.createElement("p");
      noResults.className = "no-results";
      noResults.textContent = `We couldn't find any results for "${entry.query}". Try a different search.`;
      page.appendChild(noResults);
    } else {
      entry.results.forEach((result) => {
        const resultEl = document.createElement("div");
        resultEl.className = "result";

        const link = document.createElement("a");
        link.href = result.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = result.title;
        resultEl.appendChild(link);

        if (result.displayUrl) {
          const urlEl = document.createElement("span");
          urlEl.className = "result-url";
          urlEl.textContent = result.displayUrl;
          resultEl.appendChild(urlEl);
        }

        if (result.description) {
          const description = document.createElement("p");
          description.textContent = result.description;
          resultEl.appendChild(description);
        }

        page.appendChild(resultEl);
      });
    }

    resultsContent.innerHTML = "";
    resultsContent.appendChild(page);
  }

  function showSearchError(query, message) {
    ensureResultsView();
    setSearchValues(query);

    const page = document.createElement("div");
    page.className = "results-page";

    const heading = document.createElement("h2");
    heading.textContent = query ? `Search results for "${query}"` : "Search";
    page.appendChild(heading);

    const error = document.createElement("p");
    error.className = "error-message";
    error.textContent = message;
    page.appendChild(error);

    resultsContent.innerHTML = "";
    resultsContent.appendChild(page);
  }

  function openHistoryEntry(index) {
    const entry = historyStack[index];
    if (!entry) {
      return;
    }
    currentHistoryIndex = index;
    renderResults(entry);
    updateNavButtons();
  }

  function resetToHome() {
    if (homeContent) {
      homeContent.style.display = "block";
    }
    if (mainContent) {
      mainContent.style.display = "block";
    }
    resultsContent.style.display = "none";
    resultsContent.innerHTML = "";
    navbar.classList.remove("visible");
    historyStack.length = 0;
    currentHistoryIndex = -1;
    setSearchValues("");
    updateNavButtons();
  }

  async function performSearch(rawQuery) {
    const query = rawQuery.trim();
    if (!query) {
      return;
    }

    showLoadingScreen();
    try {
      const results = await fetchSearchResults(query);
      const entry = { query, results };
      historyStack.splice(currentHistoryIndex + 1);
      historyStack.push(entry);
      currentHistoryIndex = historyStack.length - 1;
      renderResults(entry);
      updateNavButtons();
    } catch (error) {
      console.error("Search failed", error);
      showSearchError(query, "We ran into a problem loading results. Please try again.");
    } finally {
      hideLoadingScreen();
    }
  }

  searchInput?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(searchInput.value);
    }
  });

  navSearchInput?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(navSearchInput.value);
    }
  });

  if (homeSearchIcon) {
    homeSearchIcon.addEventListener("click", () => {
      const value = searchInput?.value || "";
      performSearch(value);
    });
  }

  backBtn?.addEventListener("click", () => {
    if (currentHistoryIndex > 0) {
      openHistoryEntry(currentHistoryIndex - 1);
    }
  });

  forwardBtn?.addEventListener("click", () => {
    if (currentHistoryIndex >= 0 && currentHistoryIndex < historyStack.length - 1) {
      openHistoryEntry(currentHistoryIndex + 1);
    }
  });

  homeBtn?.addEventListener("click", () => {
    resetToHome();
  });
});

async function fetchSearchResults(query) {
  const endpoint = `https://r.jina.ai/https://duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {
    headers: {
      "Accept": "text/plain",
    },
  });
  if (!response.ok) {
    throw new Error(`Search request failed with status ${response.status}`);
  }
  const text = await response.text();
  return parseDuckDuckGoLite(text);
}

function parseDuckDuckGoLite(markdownText) {
  const marker = "Markdown Content:";
  const markerIndex = markdownText.indexOf(marker);
  if (markerIndex === -1) {
    return [];
  }

  const content = markdownText.slice(markerIndex + marker.length);
  const resultPattern = /(\d+)\.\[(.+?)\]\(([\s\S]+?)\)\n([\s\S]*?)(?=\n\d+\.\[|$)/g;
  const results = [];
  let match;

  while ((match = resultPattern.exec(content)) !== null) {
    const title = normaliseText(match[2]);
    const url = decodeDuckDuckGoUrl(match[3].replace(/\s+/g, ""));
    const descriptionBlock = match[4] || "";
    const descriptionLines = descriptionBlock
      .split("\n")
      .map((line) => normaliseText(line))
      .filter((line) =>
        line &&
        !/^More at/i.test(line) &&
        !/^Images?:/i.test(line) &&
        !/^Videos?:/i.test(line)
      );

    results.push(
      finalizeResult({
        title,
        url,
        descriptionLines,
      })
    );
  }

  return results.slice(0, 20);
}

function finalizeResult(result) {
  const descriptionLines = [];
  let displayUrl = "";

  result.descriptionLines.forEach((line) => {
    if (!displayUrl && isLikelyDomain(line)) {
      displayUrl = line;
      return;
    }
    if (line) {
      descriptionLines.push(line);
    }
  });

  return {
    title: result.title,
    url: result.url,
    displayUrl: displayUrl || extractHostname(result.url),
    description: descriptionLines.join(" ").trim(),
  };
}

function normaliseText(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeDuckDuckGoUrl(url) {
  try {
    const parsed = new URL(url);
    const redirected = parsed.searchParams.get("uddg");
    if (redirected) {
      return decodeURIComponent(redirected);
    }
    return url;
  } catch (error) {
    return url;
  }
}

function isLikelyDomain(text) {
  return /^[\w.-]+\.[\w.-]+(?:[\/?#][^\s]*)?$/.test(text);
}

function extractHostname(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./i, "");
  } catch (error) {
    return url;
  }
}

// Custom theme functionality
document.addEventListener("DOMContentLoaded", () => {
  const customColorPicker = document.getElementById("customColorPicker");
  if (!customColorPicker) {
    return;
  }

  customColorPicker.addEventListener("change", (event) => {
    const chosenColor = event.target.value;
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.style.backgroundColor = chosenColor;
    localStorage.setItem("customThemeColor", chosenColor);
    localStorage.setItem("selectedTheme", "custom");

    themeOptions.forEach((btn) => btn.classList.remove("selected"));
    setCustomThemeSelection(chosenColor);
  });

  const savedCustomColor = localStorage.getItem("customThemeColor");
  const savedThemeValue = localStorage.getItem("selectedTheme");
  if (savedThemeValue === "custom" && savedCustomColor) {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.style.backgroundColor = savedCustomColor;
    themeOptions.forEach((btn) => btn.classList.remove("selected"));
    setCustomThemeSelection(savedCustomColor);
  }
});
