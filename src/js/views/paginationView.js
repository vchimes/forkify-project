import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const pageCountMarkup = `
      <span class="pagination__page-count">${curPage} / ${numPages}</span>
    `;

    // Hides prevButton if not on page 1
    const prevButton = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev ${
      curPage === 1 && numPages > 1 ? 'hidden' : ''
    }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;

    // Hides nextButton if on last page
    const nextButton = `
    <button data-goto="${
      curPage + 1
    }"class="btn--inline pagination__btn--next ${
      curPage === numPages && numPages > 1 ? 'hidden' : ''
    }">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
    // Hides both buttons if only ONE page
    if (numPages === 1) return pageCountMarkup;

    // Return results based on ternary operation above
    return prevButton + pageCountMarkup + nextButton;

    // Jonas' pagination checks combined with my own pagination-refactor
    // // Page 1, and there are other pages
    // if (curPage === 1 && numPages > 1) {
    //   return pageCountMarkup + nextButton;
    // }
    // // Last Page
    // if (curPage === numPages && numPages > 1) {
    //   return prevButton + pageCountMarkup;
    // }
    // // Other page
    // if (curPage < numPages) {
    //   return prevButton + pageCountMarkup + nextButton;
    // }
    // // Page 1, and there are NO other pages
    // return '';
  }
}

export default new PaginationView();
