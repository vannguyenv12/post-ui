export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calc total pages
  const { _limit, _page, _totalRows } = pagination;

  const totalPages = Math.ceil(_totalRows / _limit);

  // Save page and total pages to Ul
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // Check to eneble/disable
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
  else ulPagination.firstElementChild.classList.remove('disabled');

  if (_page >= totalPages)
    ulPagination.lastElementChild.classList.add('disabled');
  else ulPagination.lastElementChild.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // Get pagination el
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // attach event for prev btn
  const prevLink = ulPagination.firstElementChild.firstElementChild;

  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('prev click');

      const page = Number.parseInt(ulPagination.dataset.page) || 1;

      if (page > 2) onChange?.(page - 1);
    });
  }

  // attach event for next btn
  const nextLink = ulPagination.lastElementChild.lastElementChild;

  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('next click');

      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages);
      console.log(page, totalPages);

      if (page < totalPages) onChange?.(page + 1);
    });
  }
}
