import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightBox, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  // render title, desc, author, updatedAt
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  );

  // render hero image (imageUrl), edit page link
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    // show edit btn
    editPageLink.textContent = 'Edit Post';
  }
}

(async () => {
  try {
    registerLightBox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });
    // Get post id
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('No post with id');
      return;
    }

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('Fail to fetch post detail', error);
  }
})();
