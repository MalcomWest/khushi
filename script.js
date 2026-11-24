
const collections = [
  {
    id: "cute",
    title: "The Cute Collection",
    description: "For all those pictures that make me go awww. ♡",
    folder: "images/cute",
    count: 20,
    cover: "images/cute/01.jpg"
  },
  {
    id: "hot",
    title: "The Hot Collection",
    description: "How can someone look this good and hot and sexy",
    folder: "images/hot",
    count: 12,
    cover: "images/hot/01.jpg"
  },
  {
    id: "babyyyyy",
    title: "Babyyyyy",
    description: "No explanation needed. Just myyyy sweeeet littleeeee babyyyyy ♡",
    folder: "images/babyyyyy",
    count: 20,
    cover: "images/babyyyyy/01.jpg"
  },
  {
    id: "favourites",
    title: "My Favourite",
    description: "OFCCC MY FAVVV ♡",
    folder: "images/favourites",
    count: 20,
    cover: "images/favourites/01.jpg"
  }
];

const placeholder = "images/placeholder.svg";
const allPhotos = [];

const list = document.getElementById("collection-list");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const viewerCaption = document.getElementById("viewer-caption");
const viewerCount = document.getElementById("viewer-count");

let currentIndex = 0;
let activePhotos = [];

// Generate image paths
function photoPath(folder, number) {
  return `${folder}/${String(number).padStart(2, "0")}.jpg`;
}

// Create collection cards
function makeCard(collection) {
  const card = document.createElement("article");
  card.className = "collection-card";

  const copy = document.createElement("div");
  copy.className = "collection-copy";

  copy.innerHTML = `
    <h3>${collection.title}</h3>
    <p>${collection.description}</p>
    <button class="pill-button" type="button">
      View Photos <span>→</span>
    </button>
  `;

  const image = document.createElement("img");
  image.className = "collection-photo";
  image.src = collection.cover;
  image.alt = `${collection.title} preview`;
  image.loading = "lazy";

  image.onerror = () => {
    image.src = placeholder;
  };

  // View Photos button
  copy.querySelector("button").addEventListener("click", () => {
    openViewer(collection.id, 0);
  });

  // Add photos to global storage
  for (let i = 1; i <= collection.count; i++) {
    allPhotos.push({
      src: photoPath(collection.folder, i),
      title: collection.title,
      collectionId: collection.id,
      number: i
    });
  }

  // Clicking collection image also opens gallery
  image.addEventListener("click", () => {
    openViewer(collection.id, 0);
  });

  image.style.cursor = "pointer";

  card.append(copy, image);
  list.appendChild(card);
}

// Generate all collections
collections.forEach(makeCard);

// Open independent collection slideshow
function openViewer(collectionId, index = 0) {
  activePhotos = allPhotos.filter(
    photo => photo.collectionId === collectionId
  );

  if (activePhotos.length === 0) {
    console.error("No photos found:", collectionId);
    return;
  }

  currentIndex = index;
  showPhoto();

  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

// Close viewer
function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

// Display current photo
function showPhoto() {
  const photo = activePhotos[currentIndex];

  if (!photo) return;

  viewerImage.onerror = () => {
    viewerImage.onerror = null;
    viewerImage.src = placeholder;
  };

  viewerImage.src = photo.src;
  viewerImage.alt = photo.title;

  viewerCaption.textContent = photo.title;

  viewerCount.textContent =
    `${currentIndex + 1} / ${activePhotos.length}`;
}

// Previous / Next navigation
function movePhoto(direction) {
  if (activePhotos.length === 0) return;

  currentIndex =
    (currentIndex + direction + activePhotos.length)
    % activePhotos.length;

  showPhoto();
}

// Viewer controls
document.querySelector(".viewer-close")
  ?.addEventListener("click", closeViewer);

document.querySelector(".viewer-prev")
  ?.addEventListener("click", () => movePhoto(-1));

document.querySelector(".viewer-next")
  ?.addEventListener("click", () => movePhoto(1));

// Close viewer by clicking outside
viewer?.addEventListener("click", event => {
  if (event.target === viewer) {
    closeViewer();
  }
});

// Keyboard navigation
document.addEventListener("keydown", event => {
  if (!viewer?.classList.contains("open")) return;

  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});

// Letter modal
const letterModal = document.getElementById("letter-modal");

document.getElementById("open-letter")
  ?.addEventListener("click", () => {
    letterModal.classList.add("open");
    letterModal.setAttribute("aria-hidden", "false");
  });

document.querySelector(".letter-close")
  ?.addEventListener("click", () => {
    letterModal.classList.remove("open");
    letterModal.setAttribute("aria-hidden", "true");
  });

letterModal?.addEventListener("click", event => {
  if (event.target === letterModal) {
    letterModal.classList.remove("open");
    letterModal.setAttribute("aria-hidden", "true");
  }
});

// Mobile navigation (safe if nav is absent)
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}



// Open website at the home section on initial load
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
});