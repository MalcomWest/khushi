// Change these counts to match how many photos you put in each folder.
// Name files 01.jpg, 02.jpg, 03.jpg ... (or change extension below).
const collections = [
  {
    id: "cute",
    title: "The Cute Collection",
    description: "For all those pictures that make me go awww. ♡",
    folder: "images/cute",
    count: 75,
    cover: "images/cute/01.jpg"
  },
  {
    id: "hot",
    title: "The Hot Collection",
    description: "How can someone look this good and hot and sexy",
    folder: "images/hot",
    count: 75,
    cover: "images/hot/01.jpg"
  },
  {
    id: "babyyyyy",
    title: "Babyyyyy",
    description: "No explanation needed. Just myyyy sweeeet littleeeee babyyyyy ♡",
    folder: "images/babyyyyy",
    count: 75,
    cover: "images/babyyyyy/01.jpg"
  },
  {
    id: "favourites",
    title: "My Favourite",
    description: "The ones I could look at forever. ♡",
    folder: "images/favourites",
    count: 75,
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

function photoPath(folder, number) {
  return `${folder}/${String(number).padStart(2, "0")}.jpg`;
}

function makeCard(collection) {
  const card = document.createElement("article");
  card.className = "collection-card";

  const copy = document.createElement("div");
  copy.className = "collection-copy";
  copy.innerHTML = `
    <h3>${collection.title}</h3>
    <p>${collection.description}</p>
    <button class="pill-button" type="button">View Photos <span>→</span></button>
  `;

  const image = document.createElement("img");
  image.className = "collection-photo";
  image.src = collection.cover;
  image.alt = `${collection.title} preview`;
  image.loading = "lazy";
  image.onerror = () => { image.src = placeholder; };

  copy.querySelector("button").addEventListener("click", () => {
    const first = allPhotos.findIndex(photo => photo.collectionId === collection.id);
    openViewer(Math.max(first, 0));
  });

  card.append(copy, image);
  list.appendChild(card);

  for (let i = 1; i <= collection.count; i++) {
    allPhotos.push({
      src: photoPath(collection.folder, i),
      title: collection.title,
      collectionId: collection.id,
      number: i
    });
  }
}

collections.forEach(makeCard);

function openViewer(index) {
  currentIndex = index;
  showPhoto();
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function showPhoto() {
  const photo = allPhotos[currentIndex];
  viewerImage.src = photo.src;
  viewerImage.onerror = () => { viewerImage.src = placeholder; };
  viewerImage.alt = photo.title;
  viewerCaption.textContent = photo.title;
  viewerCount.textContent = `${currentIndex + 1} / ${allPhotos.length}`;
}
function movePhoto(direction) {
  currentIndex = (currentIndex + direction + allPhotos.length) % allPhotos.length;
  showPhoto();
}

document.querySelectorAll(".collection-card").forEach((card, cardIndex) => {
  const image = card.querySelector(".collection-photo");
  image.style.cursor = "pointer";
  image.addEventListener("click", () => {
    const first = allPhotos.findIndex(photo => photo.collectionId === collections[cardIndex].id);
    openViewer(Math.max(first, 0));
  });
});

document.querySelector(".viewer-close").addEventListener("click", closeViewer);
document.querySelector(".viewer-prev").addEventListener("click", () => movePhoto(-1));
document.querySelector(".viewer-next").addEventListener("click", () => movePhoto(1));
viewer.addEventListener("click", event => { if (event.target === viewer) closeViewer(); });
document.addEventListener("keydown", event => {
  if (!viewer.classList.contains("open")) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});

const letterModal = document.getElementById("letter-modal");
document.getElementById("open-letter").addEventListener("click", () => {
  letterModal.classList.add("open");
  letterModal.setAttribute("aria-hidden", "false");
});
document.querySelector(".letter-close").addEventListener("click", () => {
  letterModal.classList.remove("open");
  letterModal.setAttribute("aria-hidden", "true");
});
letterModal.addEventListener("click", event => {
  if (event.target === letterModal) letterModal.classList.remove("open");
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
