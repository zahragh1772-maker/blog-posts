interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

let posts: Post[] = [];
let favorites: number[] = [];
let showOnlyFavorites = false;

const postsContainer = document.getElementById(
  "postsContainer"
) as HTMLElement;

const searchInput = document.getElementById(
  "searchInput"
) as HTMLInputElement;

const favoritesButton = document.getElementById(
  "favoritesButton"
) as HTMLButtonElement;

const favoriteCount = document.getElementById(
  "favoriteCount"
) as HTMLElement;

const loading = document.getElementById(
  "loading"
) as HTMLElement;

const errorMessage = document.getElementById(
  "errorMessage"
) as HTMLElement;

const emptyState = document.getElementById(
  "emptyState"
) as HTMLElement;


const savedFavorites = localStorage.getItem("favorites");

if (savedFavorites) {
  favorites = JSON.parse(savedFavorites);
}


async function fetchPosts(): Promise<void> {
  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    posts = await response.json();

    renderPosts(posts);

  } catch (error) {
    errorMessage.classList.remove("hidden");
    console.error(error);

  } finally {
    loading.classList.add("hidden");
  }
}


function renderPosts(postsToRender: Post[]): void {
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchValue)
  );

  const finalPosts = showOnlyFavorites
    ? filteredPosts.filter((post) =>
        favorites.includes(post.id)
      )
    : filteredPosts;

  renderPosts(finalPosts);
});


postsContainer.addEventListener("click", (event) => {

  const target = event.target as HTMLElement;

  if (!target.classList.contains("favorite-btn")) {
    return;
  }

  const postId = Number(target.dataset.id);

  toggleFavorite(postId);
});


function toggleFavorite(postId: number): void {

  if (favorites.includes(postId)) {

    favorites = favorites.filter(
      (id) => id !== postId
    );

  } else {

    favorites.push(postId);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  filterAndRender();
}


function updateFavoriteCount(): void {

  favoriteCount.textContent =
    String(favorites.length);
}


favoritesButton.addEventListener("click", () => {

  showOnlyFavorites = !showOnlyFavorites;

  favoritesButton.classList.toggle(
    "bg-yellow-100",
    showOnlyFavorites
  );

  filterAndRender();
});


function filterAndRender(): void {

  const searchValue = searchInput.value
    .toLowerCase()
    .trim();

  let filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchValue)
  );

  if (showOnlyFavorites) {

    filteredPosts = filteredPosts.filter((post) =>
      favorites.includes(post.id)
    );
  }

  renderPosts(filteredPosts);
}


fetchPosts();