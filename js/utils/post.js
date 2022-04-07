import { setTextContent, truncateText } from './common.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // Update title, description, author
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(
    liElement,
    '[data-id="description"]',
    truncateText(post.description, 100)
  );
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(
    liElement,
    '[data-id="timeSpan"]',
    `- ${dayjs(post.updatedAt).fromNow()}`
  );

  const thumbnailEl = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailEl) {
    thumbnailEl.src = post.imageUrl;

    thumbnailEl.addEventListener('error', () => {
      thumbnailEl.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  // Post detail
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      // find menu -> ignore parent click (ignore bubbling)
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(e.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  // Add edit post
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  // Remove
  const removeButton = liElement.querySelector('[data-id="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      });

      removeButton.dispatchEvent(customEvent);
    });
  }

  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // Clear current list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
