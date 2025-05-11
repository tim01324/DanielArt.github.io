// Get all images and container elements
const images = document.querySelectorAll(".artwork-img");
const expandedImage = document.getElementById("expandedImage");
const modal = document.getElementById("imageModal");
const imageContainers = document.querySelectorAll(".pic-container");
const imageCaption = document.querySelector(".image-caption");

// Add event listener to each image for click event
images.forEach(image => {
  image.addEventListener("click", expandImage);
});

// Function to expand image
function expandImage(event) {
  const thumbnail = event.target;
  expandedImage.src = thumbnail.src;

  // Get the image title from the next sibling (p.pic-text)
  const imageTitle = thumbnail.nextElementSibling.textContent;
  imageCaption.textContent = imageTitle;

  thumbnail.classList.add("expanded");
  modal.style.display = "block";

  // Add animation class to body to prevent scrolling
  document.body.style.overflow = "hidden";

  // Animate the modal opening
  setTimeout(() => {
    modal.style.opacity = 1;
  }, 10);
}

// Function to close modal
function closeModal() {
  // Fade out animation
  modal.style.opacity = 0;

  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";

    // Remove expanded class from all images
    images.forEach(image => {
      image.classList.remove("expanded");
    });
  }, 300);
}

// When the user clicks the expanded image, close it
expandedImage.onclick = function (event) {
  // Prevent the event from bubbling up to the modal
  event.stopPropagation();
};

// Close modal when clicking outside the image (on the background)
modal.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
};

// Close modal when pressing Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// When the user scrolls the page, show images with a staggered animation
function checkScroll() {
  imageContainers.forEach((container, index) => {
    const imagePosition = container.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (imagePosition < windowHeight) {
      // Add a slight delay for each container to create a staggered effect
      setTimeout(() => {
        container.classList.add("pic-container-animation");
      }, index * 100);
    }
  });
}

// Initialize by checking initial scroll position
document.addEventListener("DOMContentLoaded", function () {
  // Add animation class to the first set of visible containers immediately
  const visibleContainers = document.querySelectorAll(".pic-container:nth-child(-n+6)");
  visibleContainers.forEach((container, index) => {
    setTimeout(() => {
      container.classList.add("pic-container-animation");
      container.style.opacity = "1";
    }, index * 100);
  });

  // Check for other containers on scroll
  checkScroll();
});

// Add event listener to window for scroll event
window.addEventListener("scroll", checkScroll);