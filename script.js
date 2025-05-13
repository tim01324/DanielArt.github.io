// Use DOMContentLoaded to ensure DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Get all images and container elements
  const images = document.querySelectorAll(".artwork-img");
  const expandedImage = document.getElementById("expandedImage");
  const modal = document.getElementById("imageModal");
  const imageContainers = document.querySelectorAll(".pic-container");
  const imageCaption = document.querySelector(".image-caption");

  // Add event listener to each image for click event - use event delegation for better performance
  document.getElementById("pic-grid").addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("artwork-img")) {
      expandImage(event);
    }
  });

  // Function to expand image
  function expandImage(event) {
    const thumbnail = event.target;
    expandedImage.src = thumbnail.src;

    // Get the image title from the parent container's pic-text
    const container = thumbnail.closest('.pic-container');
    const imageTitle = container.querySelector('.pic-text').textContent;
    imageCaption.textContent = imageTitle;

    thumbnail.classList.add("expanded");
    modal.style.display = "block";

    // Add animation class to body to prevent scrolling
    document.body.style.overflow = "hidden";

    // Animate the modal opening
    requestAnimationFrame(() => {
      modal.style.opacity = 1;
    });
  }

  // Function to close modal
  window.closeModal = function () {
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

  // Use Intersection Observer for lazy loading and animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target;
        // Add animation class with slight delay for staggered effect
        setTimeout(() => {
          container.classList.add("pic-container-animation");
          container.style.opacity = "1";
        }, Array.from(imageContainers).indexOf(container) % 6 * 150);

        // Stop observing after animation is applied
        imageObserver.unobserve(container);
      }
    });
  }, observerOptions);

  // Observe all containers
  imageContainers.forEach(container => {
    imageObserver.observe(container);
  });
});