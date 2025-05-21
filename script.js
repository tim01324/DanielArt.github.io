// Use DOMContentLoaded to ensure DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const picGrid = document.getElementById("pic-grid");
  const expandedImage = document.getElementById("expandedImage");
  const modal = document.getElementById("imageModal");
  const imageCaption = document.querySelector(".image-caption");

  // Function to create and append artwork elements
  function displayArtwork(artwork) {
    const picContainer = document.createElement("div");
    picContainer.classList.add("pic-container");

    const artworkImgContainer = document.createElement("div");
    artworkImgContainer.classList.add("artwork-img-container");

    const img = document.createElement("img");
    img.src = `pics/${artwork.filename}`;
    img.alt = `${artwork.title} artwork`;
    img.classList.add("artwork-img");
    img.loading = "lazy"; // Native lazy loading

    artworkImgContainer.appendChild(img);

    const picText = document.createElement("p");
    picText.classList.add("pic-text");
    picText.textContent = artwork.title;

    if (artwork.sold) {
      const soldTag = document.createElement("span");
      soldTag.classList.add("sold-tag");
      soldTag.textContent = "Sold";
      picText.appendChild(soldTag);
    } else if (artwork.price) { // Display price if not sold and price exists
      const priceTag = document.createElement("span");
      priceTag.classList.add("price-tag"); // You'll need to style this class in style.css
      priceTag.textContent = `$${artwork.price}`;
      picText.appendChild(priceTag);
    }

    picContainer.appendChild(artworkImgContainer);
    picContainer.appendChild(picText);
    picGrid.appendChild(picContainer);
  }

  // Fetch artwork data and populate the grid
  async function loadGallery() {
    try {
      const response = await fetch("/DanielArt.github.io/gallery-data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText} for ${response.url}`);
      }
      const artworks = await response.json();
      artworks.forEach(displayArtwork);

      // Re-initialize observers and event listeners after dynamic content is loaded
      initializeInteractions();

    } catch (error) {
      console.error("Could not load gallery data:", error);
      picGrid.innerHTML = "<p>Error loading gallery. Please try again later.</p>";
    }
  }

  function initializeInteractions() {
    // Get all dynamically loaded images and containers
    const images = document.querySelectorAll(".artwork-img");
    const imageContainers = document.querySelectorAll(".pic-container");

    // Event listener for image clicks (delegated to pic-grid)
    picGrid.addEventListener("click", function (event) {
      const target = event.target;
      if (target.classList.contains("artwork-img")) {
        expandImage(event);
      }
    });

    // Intersection Observer for lazy loading and animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          setTimeout(() => {
            container.classList.add("pic-container-animation");
            container.style.opacity = "1";
          }, Array.from(imageContainers).indexOf(container) % 6 * 150);
          imageObserver.unobserve(container);
        }
      });
    }, observerOptions);

    imageContainers.forEach(container => {
      imageObserver.observe(container);
    });
  }


  // Function to expand image
  function expandImage(event) {
    const thumbnail = event.target;
    expandedImage.src = thumbnail.src;

    const container = thumbnail.closest('.pic-container');
    // Extract title text only, excluding sold/price tags
    const titleNode = container.querySelector('.pic-text').firstChild;
    const imageTitle = titleNode ? titleNode.textContent.trim() : "Artwork";
    imageCaption.textContent = imageTitle;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      modal.style.opacity = 1;
    });
  }

  // Function to close modal
  window.closeModal = function () {
    modal.style.opacity = 0;
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
  }

  // When the user clicks the expanded image, close it
  expandedImage.onclick = function (event) {
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

  // Load the gallery
  loadGallery();
});