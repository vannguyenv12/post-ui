function showModal(modalElement) {
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({
  modalId,
  imgSelector,
  prevSelector,
  nextSelector,
}) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // Check modal is registered or not
  if (modalElement.dataset.registered) return;

  const imgElement = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);
  if (!imgElement || !prevButton || !nextButton) return;

  console.log(prevButton, nextButton);

  // Variables
  let imgList = [];
  let currentIndex = 0;

  // functions

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // find list img of album
    imgList = document.querySelectorAll(
      `img[data-album=${target.dataset.album}]`
    );
    currentIndex = [...imgList].findIndex((x) => x === target);
    // console.log('album', { target, currentIndex, imgList });

    // Show image and modal
    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  // mark modal is registerd
  modalElement.dataset.registerd = 'true';
}
