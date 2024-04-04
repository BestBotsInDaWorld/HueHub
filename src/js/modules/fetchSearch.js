export function displaySearchResults(users) {
  const searchResults = document.getElementById('search-results-id');
  searchResults.innerHTML = '';
  //  profileAvatarsDir в head.html
  users.forEach(user => {
      const searchItem = document.createElement('li');
      searchItem.className = "search-results__item border-bottom";
      const searchTemplate = `
      <a class="search-results__info" href="${profilePath}/${user.id}">
        <img src="${profileAvatarsDir}/${user.img}" alt="" class="search-results__photo">
        <div class="search-results__contact">
          <div class="search-results__fio">
            <span class="search-results__name">${user.name}</span>
            <span class="search-results__surname">${user.surname}</span>
          </div>
          <div class="search-results__other-info">Профессионал своего дела</div>
        </div>
      </a>
      <div class="search-results__activity">
        <button class="search-results__button _icon-messages" data-add-friend="${user.status == "None" ? true : false}"
        data-send-message="${user.status == "Friends" ? true : false}"></button>
      </div>
    `;
    searchItem.innerHTML = searchTemplate
    searchResults.appendChild(searchItem);
    
  });
}