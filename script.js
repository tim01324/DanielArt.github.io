var images = document.querySelectorAll("#pic");
const expandedImage = document.getElementById("expandedImage");
const modal = document.getElementById("imageModal");
const imagesContainers = document.querySelectorAll(".pic-container");

// add event listener to each image for clikc event
images.forEach(image => {
  image.addEventListener("click", expandImage);
});

// function to expand image
function expandImage(event) {
  const thumbnail = event.target;
  expandedImage.src = thumbnail.src;
  thumbnail.classList.add("expanded");
  modal.style.display = "block";
}

// When the user clicks the expanded image, close it
expandedImage.onclick = function () {
  modal.style.display = "none";
}

// When the user scrolls the page, show images
function checkScroll() {
  imagesContainers.forEach(imagesContainer => {
    var imagePosition = imagesContainer.getBoundingClientRect().top;
    var windowHeight = window.innerHeight;

    if (imagePosition < windowHeight) {
      imagesContainer.classList.add("pic-container-animation");
    }
  });
}

// add event listener to window for scroll event
window.addEventListener("scroll", checkScroll);