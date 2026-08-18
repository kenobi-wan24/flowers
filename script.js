const INTRO_DURATION_MS = 6000;

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("container");
    const intro = document.getElementById("introMessage");
    if (intro) intro.remove(); // drop the overlay from the DOM once it's done
  }, INTRO_DURATION_MS);
});

document.addEventListener("visibilitychange", () => {
  if (document.getElementById("introMessage")) return;
  document.body.classList.toggle("container", document.hidden);
});