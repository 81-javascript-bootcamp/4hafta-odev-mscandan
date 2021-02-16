import data from './data.js';
import { searchMovieByTitle, makeBgActive, createButton } from './helpers.js';

class MoviesApp {
  constructor(options) {
    const {
      root,
      searchInput,
      searchForm,
      yearHandler,
      yearSubmitterId,
      filterByYearBox,
      filterByGenreBox,
      genreSubmitterId,
      genreHandler,
    } = options;

    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector('tbody');

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);

    this.$yearFilterContainer = document.getElementById(filterByYearBox);
    this.yearHandler = yearHandler;
    this.yearSubmitterId = yearSubmitterId;
    this.differentYears = [];
    this.differentYearCounts = [];

    this.$genreFilterContainer = document.getElementById(filterByGenreBox);
    this.genreHandler = genreHandler;
    this.differentGenres = [];
    this.differentGenreCounts = [];
    this.genreSubmitterId = genreSubmitterId;
  }

  // Genre Section Started
  getDifferentMovieGenres() {
    data.forEach((film) => {
      if (!this.differentGenres.includes(film.genre)) {
        this.differentGenres.push(film.genre);
      }
    });
    this.getGenreCounts();
  }

  getGenreCounts() {
    this.differentGenres.forEach((genre) => {
      let count = 0;
      data.forEach((film) => {
        if (genre === film.genre) {
          count++;
        }
      });
      this.differentGenreCounts.push(count);
    });
  }

  createGenreFilterElement(genre, index) {
    return `
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="genre"
                value="${genre}"
                id="${genre}"
              />
              <label class="form-check-label" for="flexCheckDefault">
                ${genre} (${this.differentGenreCounts[index]})
              </label>
            </div>`;
  }

  fillGenreFilter() {
    this.differentGenres.forEach((genre, index) => {
      this.$genreFilterContainer.innerHTML += this.createGenreFilterElement(
        genre,
        index
      );
    });
    const $genreFilterBtn = createButton(
      this.genreSubmitterId,
      'submit',
      ['btn', 'btn-primary'],
      'Filter'
    );
    this.$genreFilterContainer.append($genreFilterBtn);
  }
  // Genre Section Ended

  // Year Section Started
  getDifferentMovieYears() {
    data.forEach((movie) => {
      if (!this.differentYears.includes(movie.year)) {
        this.differentYears.push(movie.year);
      }
    });
    this.differentYears.sort();
    this.getYearCounts();
  }

  getYearCounts() {
    this.differentYears.forEach((year) => {
      let count = 0;
      data.forEach((film) => {
        if (year === film.year) {
          count++;
        }
      });
      this.differentYearCounts.push(count);
    });
  }

  createYearFilterElement(year, index) {
    return `<div class='form-check'>
              <input
                class="form-check-input"
                type="radio"
                name="year"
                id="${year}-${index}"
                value="${year}"
              />
              <label class="form-check-label" for="${year}-${index}"> ${year} (${this.differentYearCounts[index]}) </label>
            </div>`;
  }

  fillYearFilter() {
    this.differentYears.forEach((year, index) => {
      this.$yearFilterContainer.innerHTML += this.createYearFilterElement(
        year,
        index
      );
    });
    const $yearFilterBtn = createButton(
      this.yearSubmitterId,
      'submit',
      ['btn', 'btn-primary'],
      'Filter'
    );
    this.$yearFilterContainer.append($yearFilterBtn);
  }
  // Year Section Ended

  // Movie Table Section Started
  createMovieEl(movie) {
    const { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }

  fillTable() {
    const moviesArr = data
      .map((movie) => {
        return this.createMovieEl(movie);
      })
      .join('');
    this.$tbodyEl.innerHTML = moviesArr;
  }

  reset() {
    this.$tbodyEl.querySelectorAll('tr').forEach((item) => {
      item.style.background = 'transparent';
    });
  }
  // Movie Table Section Ended

  // Submit Handlers Section Started
  handleSearch() {
    this.$searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.reset();
      const searchValue = this.$searchInput.value;
      if (searchValue) {
        data
          .filter((movie) => {
            return searchMovieByTitle(movie, searchValue);
          })
          .forEach(makeBgActive);
        this.$searchInput.value = '';
      }
    });
  }

  handleYearFilter() {
    this.$yearSubmitter = document.getElementById(this.yearSubmitterId);
    this.$yearSubmitter.addEventListener('click', () => {
      this.reset();
      const selectedYear = document.querySelector(
        `input[name='${this.yearHandler}']:checked`
      ).value;
      data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  handleGenreFilter() {
    this.$genreSubmitter = document.getElementById(this.genreSubmitterId);
    this.$genreSubmitter.addEventListener('click', () => {
      this.reset();
      const $checkedGenres = document.querySelectorAll(
        `input[name='${this.genreHandler}']:checked`
      );
      if ($checkedGenres) {
        $checkedGenres.forEach((genreEl) => {
          data
            .filter((movie) => {
              return genreEl.value === movie.genre;
            })
            .forEach(makeBgActive);
        });
      }
    });
  }
  // Submit Handlers Section Ended

  init() {
    this.getDifferentMovieYears();
    this.fillYearFilter();
    this.getDifferentMovieGenres();
    this.fillGenreFilter();
    this.fillTable();
    this.handleSearch();
    this.handleYearFilter();
    this.handleGenreFilter();
  }
}

let myMoviesApp = new MoviesApp({
  root: 'movies-table',
  searchInput: 'searchInput',
  searchForm: 'searchForm',
  yearHandler: 'year',
  yearSubmitterId: 'yearSubmitter',
  filterByYearBox: 'filterByYearBox',
  genreSubmitterId: 'genreSubmitter',
  filterByGenreBox: 'filterByGenreBox',
  genreHandler: 'genre',
});

myMoviesApp.init();
