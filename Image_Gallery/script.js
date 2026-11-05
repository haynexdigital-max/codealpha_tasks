
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeButton = document.getElementById("closeLightbox");
const nextButton = document.getElementById("nextBtn");
const prevButton = document.getElementById("prevBtn");


// =====================================
// 2. STORE GALLERY IMAGES
// =====================================

let currentIndex = 0;

const images = Array.from(galleryItems);


// =====================================
// 3. OPEN LIGHTBOX
// =====================================

function openLightbox(index) {

    currentIndex = index;

    const selectedItem = images[currentIndex];

    const image = selectedItem.querySelector("img");
    const title = selectedItem.querySelector("h3");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxCaption.textContent = title.textContent;

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";
}


// =====================================
// 4. CLOSE LIGHTBOX
// =====================================

function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "auto";
}


// =====================================
// 5. NEXT IMAGE
// =====================================

function nextImage() {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    openLightbox(currentIndex);
}


// =====================================
// 6. PREVIOUS IMAGE
// =====================================

function previousImage() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    openLightbox(currentIndex);
}


// =====================================
// 7. IMAGE CLICK EVENTS
// =====================================

images.forEach((item, index) => {

    item.addEventListener("click", () => {

        openLightbox(index);

    });

});


// =====================================
// 8. LIGHTBOX BUTTON EVENTS
// =====================================

closeButton.addEventListener("click", closeLightbox);

nextButton.addEventListener("click", nextImage);

prevButton.addEventListener("click", previousImage);


// =====================================
// 9. CLOSE LIGHTBOX BY CLICKING OUTSIDE
// =====================================

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


// =====================================
// 10. KEYBOARD NAVIGATION
// =====================================

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextImage();
    }

    if (event.key === "ArrowLeft") {
        previousImage();
    }

});



// CATEGORY FILTERING
const imageCount = document.getElementById("imageCount");

function updateImageCount() {
    const visibleImages = Array.from(galleryItems).filter(item =>
        !item.classList.contains("hidden")
    );

    if (imageCount) {
        imageCount.textContent = visibleImages.length;
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedCategory = button.dataset.filter;

        galleryItems.forEach(item => {
            const matches =
                selectedCategory === "all" ||
                item.dataset.category === selectedCategory;

            item.classList.toggle("hidden", !matches);
        });

        updateImageCount();
    });
});

updateImageCount();