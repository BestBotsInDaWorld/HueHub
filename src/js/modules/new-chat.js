export function addPerson(user) {
  if (user.classList.contains("radio-btn-active")) {
    user.classList.remove('radio-btn-active');
    user.classList.add("radio-btn");
  } else {
    user.classList.remove("radio-btn");
    user.classList.add("radio-btn-active");
  }
}


export function toggleUserList() {
  let userList = document.querySelector('#users-list-id');
  let userItems = document.querySelector('#users-items-id');
  let chatList = document.querySelector('#chat-list-id');
  let newChatButton = document.querySelector('#new-chat');

  if (userList && chatList && newChatButton) {
    if (userList.style.display === 'block') {
      // Плавное скрытие userList и плавное отображение dialogsList
      userList.style.opacity = '0';
      userList.style.transition = 'opacity 0.3s ease';

      userItems.style.opacity = '0';
      userItems.style.transition = 'opacity 0.3s ease';

      chatList.style.opacity = '0';
      chatList.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        userList.style.display = 'none';
        userItems.style.display = 'none';
        chatList.style.display = 'block';
        setTimeout(() => {
          chatList.style.opacity = '1';
        }, 50);
      }, 300);
      
      // Удаление блока dialogs__new-dialog
      let newDialogBlock = document.querySelector('.dialogs__new-dialog');
      if (newDialogBlock) {
        newDialogBlock.remove();
      }
      
      // Вставка блока search__new-chat после input с id="dialog-search-field"
      let dialogSearchField = document.querySelector('#dialog-search-field');
      if (dialogSearchField) {
        let newChatButton = document.createElement('div');
        newChatButton.classList.add('search__new-chat');
        newChatButton.classList.add('_icon-plus');
        newChatButton.id = 'new-chat';
        newChatButton.setAttribute('onclick', 'toggleUserList()');
        dialogSearchField.parentNode.insertBefore(newChatButton, dialogSearchField.nextSibling);
      }
    } else {
      // Удаление блока search__new-chat, если он существует
      let searchNewChat = document.querySelector('.search__new-chat');
      if (searchNewChat) {
        searchNewChat.remove();
      }
      
      let newDialogBlock = document.createElement('div');
      newDialogBlock.classList.add('dialogs__new-dialog');
      
      // Создание заголовка и иконки в один ряд
      let titleText = document.createElement('h2');
      titleText.textContent = 'Создание чата';
      let iconDiv = document.createElement('div');
      iconDiv.classList.add('fa');
      iconDiv.classList.add('_icon-close');
      iconDiv.id = 'new-chat';
      iconDiv.setAttribute('onclick', 'toggleUserList()');
      
      // Добавление заголовка и иконки в блок newDialogBlock
      newDialogBlock.appendChild(titleText);
      newDialogBlock.innerHTML += ' '; // Добавляем пробел в HTML разметку
      newDialogBlock.appendChild(iconDiv); // Добавляем иконку после пробела
      
      // Вставка блока newDialogBlock перед dialogs__search
      let dialogsSearch = document.querySelector('.dialogs__search');
      if (dialogsSearch) {
        dialogsSearch.parentNode.insertBefore(newDialogBlock, dialogsSearch);
      }
      
      // Плавное отображение userList и плавное скрытие dialogsList
      userList.style.opacity = '0';
      userList.style.transition = 'opacity 0.3s ease';

      userItems.style.opacity = '0';
      userItems.style.transition = 'opacity 0.3s ease';

      chatList.style.opacity = '0';
      chatList.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        userList.style.display = 'block';
        userItems.style.display = 'block';
        chatList.style.display = 'none';
        setTimeout(() => {
          userList.style.opacity = '1';
          userItems.style.opacity = '1';
        }, 50);
      }, 300);
    }
  }
}


export function createChatList(chats) {
  const chatList = document.getElementById('chat-list-id');
  chatList.innerHTML = ''; // Очистка существующего списка 
  //  groupAvatarsDir в head.html
  chats.forEach(chat => {  // подставляем инфу о чатах в шаблоны 
    const chatItem = document.createElement('li');
    const chatTemplate = `
      <a class="dialog__block" href="${chat.chat_url }/${ chat.id }">
        <div class="dialog__photo">
            <img src="${chat.avatar_dir}/${chat.img}" alt="">
        </div>
        <div class="dialog__content">
            <div class="dialog__title">
                <span class="dialog__title text">${chat.title}</span>
                <div class="date__subtitle"><time class="date__date" time="${chat.last_update}">${makeCorrectDate(chat.last_update)}</time></div>
            </div>
            <div class="dialog__preview unread">
                <span class="dialog__preview text">${chat.last_message_user}${chat.last_message}</span>
            </div>
        </div>
      </a>
    `;  
    chatItem.innerHTML = chatTemplate;

    chatList.appendChild(chatItem);
  });
};


export function loadChatList(){
  fetch('/get_chats', {
    method: 'GET'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
    createChatList(data);
  })
}