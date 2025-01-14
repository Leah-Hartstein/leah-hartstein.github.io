// document.addEventListener("DOMContentLoaded", function() {
//     const image = document.querySelector('.heroimg');
//     const observer = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           image.classList.add('in-view');
//         } else {
//           image.classList.remove('in-view');
//         }
//       });
//     });

//     observer.observe(image);
//   });

document.addEventListener("DOMContentLoaded", () => {
  const heroImg = document.querySelector('.heroimg');
  const viewClasses = ['in-viewhome', 'in-view', 'in-view2', 'in-view3', 'in-view4', 'in-view5'];
  let currentIndex = 0;

  // Function to update the view class
  function updateView() {
    // Remove all view classes
    viewClasses.forEach(cls => heroImg.classList.remove(cls));

    // Add the current class
    heroImg.classList.add(viewClasses[currentIndex]);

    // Move to the next class
    currentIndex = (currentIndex + 1) % viewClasses.length;
  }

  // Start the loop
  updateView(); // Initialize with the first class
  setInterval(updateView, 8000); // Adjust interval time as needed (10 seconds here)
});

const images = [
  "chart1.png",
  "chart2.png",
  "chart3.png",
  "chart4.png",
  "chart5.png",
  "chart6.png"
];

const captions = [
  "[1] Thefts of Kia and Hyundai Model cars. Sourced from Police Data via journalistic coverage.",
  "[2] Sales of Kia and Hyundai model cars without immobilisers, which later caused them to be denied insurance coverage. Sourced from carfacts.org.",
  "[3] The main interactive choropleth chart of the visualisation, showing car theft data but broken down by state, with a timeline that plays through as an animation.",
  "[4] Arrests for car theft in Wisconsin, the epicentre of the theft wave, users can toggle between stacked and distribution charts, and see that the relative portion of young men being arrested did not actually increase.",
  "[5] Google trend data for the 'Kia Challenge', showing that interest in the phenomena correlates much more strongly to media coverage than any kind of viral spread.",
  "[6] Google trend data for the Sea Shanty craze of the early 2020s, showing it to be a similar media creation."
];

let currentIndex = 0;

const imageElement = document.querySelector('.carousel-image img');
const captionElement = document.querySelector('.carousel-caption'); // New caption element
const dots = document.querySelectorAll('.carousel-dots .dot');

// Function to update the carousel
function updateCarousel() {
  // Update the image
  imageElement.src = images[currentIndex];

  // Update the caption
  captionElement.textContent = captions[currentIndex];

  // Update the active dot
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

// Handle previous button click
document.getElementById('prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
});

// Handle next button click
document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
});

// Handle dot click
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateCarousel();
  });
});

// Initialize the carousel


const slideImages = [
  "slide1.png",
  "slide2.png",
  "diagram.png",
  "choropleth.png",
  "trendchart.png",
];

let slideIndex = 0;

const slideshowImage = document.querySelector('.slideshow-image img');

// Function to update the slideshow
function updateSlideshow() {
  // Set the current image
  slideshowImage.src = slideImages[slideIndex];

  // Add the active class for fade-in
  slideshowImage.classList.add('active');

  // Remove the active class after the transition to fade out
  setTimeout(() => {
    slideshowImage.classList.remove('active');
  }, 3000); // 3 seconds display time matches the interval
}

// Function to cycle through images
function startSlideshow() {
  setInterval(() => {
    slideIndex = (slideIndex + 1) % slideImages.length;
    updateSlideshow();
  }, 4000); // 4 seconds interval (3 seconds display + 1 second fade)
}

// Initialize the slideshow
updateCarousel();

updateSlideshow();
startSlideshow();