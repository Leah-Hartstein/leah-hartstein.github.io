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
    "mother/sshame.PNG",
    "mother/pplwardobe.PNG",
    "mother/sewlution.PNG",
    "mother/decisionmatrix.png",



  ];
  
  const captions = [
    "[1] My proposed concept for 'SSHAME', an app that challenges users to justify their fashion purchases. In this initial sketch, I hadn't figured out the actual incentive to do so, so they app gave you discounts on future purchases.",
    "[2] My groupmate Gabriel's concept for 'The Peoples' Wardrobe', a combination app and service",
    "[3] My groupmate Kira's concept for 'Sewlution', a platform for requesting repairs to clothes, with lockers to drop them off in.",
    "[4] Our final decision matrix, where we compared our three ideas according to the needs of the user. Ultimately, 'SSHAME' won out because of it was simply more feasible to implement both within the real world and as a university assignment, compared to the other two concepts that required a combination of software and physical services.",
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