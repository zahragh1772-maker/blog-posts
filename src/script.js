"use strict";
let posts = [];
let favorites = [];
let showOnlyFavorites = false;
const postsContainer = document.getElementById("postsContainer");
const searchInput = document.getElementById("searchInput");
const favoritesButton = document.getElementById("favoritesButton");
const favoriteCount = document.getElementById("favoriteCount");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const savedFavorites = localStorage.getItem("favorites");
if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
}
async function fetchPosts() {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        posts = await response.json();
        renderPosts(posts);
    }
    catch (error) {
        errorMessage.classList.remove("hidden");
        console.error(error);
    }
    finally {
        loading.classList.add("hidden");
    }
}
function renderPosts(postsToRender) {
    postsContainer.innerHTML = "";
    if (postsToRender.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }
    emptyState.classList.add("hidden");
    postsToRender.forEach((post) => {
        const isFavorite = favorites.includes(post.id);
        const card = document.createElement("article");
        card.className =
            "bg-white rounded-2xl p-6 shadow-sm border border-gray-100";
        card.innerHTML = `
      <div class="flex justify-between items-start gap-4">

        <h2 class="text-xl font-semibold capitalize">
          ${post.title}
        </h2>

        <button
          class="favorite-btn text-2xl hover:scale-110 transition"
          data-id="${post.id}"
          title="Add to favorites"
        >
        ${isFavorite ? "⭐" : "☆"}
        </button>

      </div>

      <p class="text-gray-600 mt-4 leading-7">
        ${post.body}
      </p>
    `;
        postsContainer.appendChild(card);
    });
    updateFavoriteCount();
}
searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value
        .toLowerCase()
        .trim();
    const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchValue));
    const finalPosts = showOnlyFavorites
        ? filteredPosts.filter((post) => favorites.includes(post.id))
        : filteredPosts;
    renderPosts(finalPosts);
});
postsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("favorite-btn")) {
        return;
    }
    const postId = Number(target.dataset.id);
    toggleFavorite(postId);
});
function toggleFavorite(postId) {
    if (favorites.includes(postId)) {
        favorites = favorites.filter((id) => id !== postId);
    }
    else {
        favorites.push(postId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    filterAndRender();
}
function updateFavoriteCount() {
    favoriteCount.textContent =
        String(favorites.length);
}
favoritesButton.addEventListener("click", () => {
    showOnlyFavorites = !showOnlyFavorites;
    favoritesButton.classList.toggle("bg-yellow-100", showOnlyFavorites);
    filterAndRender();
});
function filterAndRender() {
    const searchValue = searchInput.value
        .toLowerCase()
        .trim();
    let filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchValue));
    if (showOnlyFavorites) {
        filteredPosts = filteredPosts.filter((post) => favorites.includes(post.id));
    }
    renderPosts(filteredPosts);
}
fetchPosts();
//# sourceMappingURL=script.js.map