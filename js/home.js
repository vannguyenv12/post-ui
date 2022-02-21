import postApi from './api/postApi.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import {
  renderPostList,
  renderPagination,
  initPagination,
  initSearch,
  toast,
} from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    // reset page when needed
    if (filterName === 'title_like') {
      url.searchParams.set('_page', 1);
    }

    history.pushState({}, '', url);

    // Fetch API

    // Re-render
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('fail to fetch post list', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    try {
      const post = e.detail;
      console.log('post', post);
      const message = `Are you sure to remove post "${post.title}"?`;
      if (window.confirm(message)) {
        await postApi.remove(post.id);
        await handleFilterChange();

        toast.success('Remove successfully!');
      }
    } catch (error) {
      console.log('fail to delete', error);
      toast.error(error.message);
    }
  });
}

(async () => {
  try {
    const url = new URL(window.location);

    // Update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const query = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: query,
      onChange: (page) => {
        handleFilterChange('_page', page);
      },
    });
    initSearch({
      elementId: 'searchInput',
      defaultParams: query,
      onChange: (value) => {
        handleFilterChange('title_like', value);
      },
    });
    registerPostDeleteEvent();

    // set default URL
    // const query = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(query);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('Get all fail', error);
  }
})();
