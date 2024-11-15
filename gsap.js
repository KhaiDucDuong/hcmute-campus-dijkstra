const header = document.querySelector("header");
const canvasContainer = document.querySelector(".drawing-area");

// Timeline for animation
const tl = new TimelineMax();

tl.fromTo(
  canvasContainer,
  1,
  { height: "0vh" },
  { height: "100vh", ease: Power2.easeInOut }
)
  .fromTo(
    header,
    1.5,
    { y: "-800%", opacity: "0" },
    { y: "0%", opacity: "1", ease: Power2.easeInOut }
  )
  .add(() => {
    // Call a function to draw the image on the canvas after animation completes
    loadAndDrawImage();
  });
