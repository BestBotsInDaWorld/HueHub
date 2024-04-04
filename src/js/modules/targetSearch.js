export function targetSearch() {
  let listSearch = document.querySelector('.nav__search-results');
  if (listSearch.style.opacity == '0' || listSearch.style.display === 'none') {
      listSearch.style.display = 'block';
      setTimeout(() => {
          listSearch.style.opacity = '1';
      }, 10); // Добавляем небольшую задержку для запуска анимации
  }
}

export function hideSearchResults() {
  let listSearch = document.querySelector('.nav__search-results');
  listSearch.style.opacity = '0';
  setTimeout(() => {
      listSearch.style.display = 'none';
  }, 300); // Длительность анимации в миллисекундах
}
