const switchViewportContent = () => {
  const DEVICE_WIDTH = 375;
  const metaViewportContent =
    window.outerWidth < DEVICE_WIDTH
      ? `width=${DEVICE_WIDTH}`
      : "width=device-width, initial-scale=1";
  const metaViewport = document.querySelector('meta[name="viewport"]');

  if (metaViewport) {
    metaViewport.setAttribute("content", metaViewportContent);
  }
};

export const switchViewport = () => {
  window.addEventListener("resize", () => {
    switchViewportContent();
  });
  switchViewportContent();
};
