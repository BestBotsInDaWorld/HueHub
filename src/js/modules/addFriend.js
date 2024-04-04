export function addFriend(userId, friendId) {
  return fetch('/send_friend_request', {
    method: 'POST',
    body: JSON.stringify({friendId: friendId}),
  })
  .then(response => {
    if (response.ok) {
      console.log('Friend invite sent successfully');
    } else {
      console.error('Failed to sent invite');
    }
  })
  .catch(error => {
    console.error('There was a problem with adding friend:', error);
  });
}


export function denyInvite(userId, friendId) {
  return fetch('/deny_friend_request', {
    method: 'POST',
    body: JSON.stringify({userId: userId, friendId: friendId}),
  }) 
  .then(response => {
    if (response.ok) {
      console.log('Friend invite denied successfully');
    } else {
      console.error('Failed to deny invite');
    }
  })
  .catch(error => {
    console.error('There was a problem with denying invite:', error);
  });
}

export function acceptInvite(userId, friendId) {
  return fetch('/accept_friend_request', {
    method: 'POST',
    body: JSON.stringify({friendId: friendId}),
  })
  .then(response => {
    if (response.ok) {
      console.log('Friend invite accepted successfully');
    } else {
      console.error('Failed to accept invite');
    }
  })
  .catch(error => {
    console.error('There was a problem with accepting invite:', error);
  });
}


export function deleteFriend(userId, friendId) {
  return fetch('/delete_friend', {
    method: 'POST',
    body: JSON.stringify({userId: userId, friendId: friendId}),
  })
  .then(response => {
    if (response.ok) {
      console.log('Friend deleted successfully');
    } else {
      console.error('Failed to delete friend');
    }
  })
  .catch(error => {
    console.error('There was a problem with deleting friend:', error);
  });
}


export function changeProfileUI(elementId, request, userId, profileUserId) {
  const friendDiv = document.getElementById(elementId);
  friendDiv.innerHTML = '';
  if (request == "deny" || request == "delete") {
    friendDiv.innerHTML = `
      <button class="profile__button-add" onclick="addFriend('${userId}', '${profileUserId}'); 
      changeProfileUI('friend-action-id', 'send', '${userId}', '${profileUserId}')">Добавить в друзья</button>
    `
  }
  else if (request == "send") {
    friendDiv.innerHTML = `
      <button class="profile__button-add" onclick="denyInvite('${userId}', '${profileUserId}');
      changeProfileUI('friend-action-id', 'deny', '${userId}', '${profileUserId}')">Отклонить свою заявку</button>
    `
  }
  else if (request == "accept") {
    friendDiv.innerHTML = `
      <button class="profile__button-add" onclick="deleteFriend('${userId}', '${profileUserId}');
      changeProfileUI('friend-action-id', 'delete', '${userId}', '${profileUserId}')">Удалить из друзей</button>
      <button class="profile__button-message _icon-messages" onclick="toDialog('${result.id}')"></button>
    ` 
  }
}


function fetchAndChangeFriendUI(userId, listId, listType) {
  fetch(`/get_user_friends/${listType}`)
  .then(response => {
    if (response.ok) {
      console.log('Friend list retrieved successfully');
    }
    else {
      console.log('Friend list retrieving went wrong');
    }
    return response.json();
  })
  .then(data => {
    if (data.message == 'Success') {
      changeFriendUI(data, userId, listId, listType);
    }
  })

}


function changeFriendUI(data, userId, listId, listType) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  data.results.forEach(result => { 
    const resultItem = document.createElement('li');
    resultItem.classList.add('dialog__item');
    let actionTemplate;
    if (listType == 'received') {
      actionTemplate = `
        <span class="search-results__button _icon-check" role="button"
        onclick="handleFriendChange('${userId}', '${result.id}', 'accept', 'received-requests-list-id', 'friends-list-id', 'received')"></span>
        <span class="search-results__button _icon-close" role="button"
        onclick="handleFriendChange('${result.id}', '${userId}', 'deny', 'received-requests-list-id', 'friends-list-id', 'received')"></span>
      `
    }
    else if (listType == 'sent') {
      actionTemplate = `
        <span class="search-results__button _icon-close" role="button"
        onclick="handleFriendChange('${userId}', '${result.id}', 'deny', 'sent-requests-list-id', 'friends-list-id', 'sent')"></span>
      `
    }
    else {
      actionTemplate = `
      <span class="search-results__button _icon-messages" role="button" onclick="toDialog('${result.id}')"></span>
      <span class="search-results__button _icon-trash" role="button"
      onclick="handleFriendChange('${userId}', '${result.id}', 'delete', 'friends-list-id', 'friends-list-id', 'friends')"></span>
    `
    }
    const resultTemplate = `
      <div class="dialog__block">
        <div class="dialog__photo">
          <img src="${profileAvatarsDir}/${result.img}" alt="">
        </div>
        <div class="dialog__content">
          <div class="dialog__title">
              <a class="dialog__title text vertical-centered" href="${profilePath}/${result.id}">${result.fullname}</a>
              <div>
                ${actionTemplate}
              </div>
          </div>
        </div>
      </div>
    `;  
    resultItem.innerHTML = resultTemplate;

    list.appendChild(resultItem);
  });
}


export function handleFriendChange(userId, friendId, friendAction, listId, friendlistId, listType) {
  let friendFunc;
  if (friendAction == 'add') friendFunc = addFriend;
  else if (friendAction == 'accept') friendFunc = acceptInvite;
  else if (friendAction == 'deny') friendFunc = denyInvite;
  else friendFunc = deleteFriend;
  friendFunc(userId, friendId)
  .then(data => {
    fetchAndChangeFriendUI(userId, listId, listType);
    if (friendAction == 'accept') fetchAndChangeFriendUI(userId, friendlistId, 'friends');
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
}