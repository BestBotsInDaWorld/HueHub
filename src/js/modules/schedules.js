export function updateMessagesByUrl() {
  const currentURL = window.location.href;
  let chat_id = currentURL.substring(currentURL.lastIndexOf('/') + 1);
  if (currentURL.includes('/dialog/')) {
    updateChat("dialog", chat_id);
  }
  else if (currentURL.includes('/chat/')) {
    updateChat("group", chat_id);
  }
  else if (chat_id === '' || currentURL.includes('/profile')) {
    updateComments();
  }
}


export function updateChatListByUrl() {
  const currentURL = window.location.href;
  if (currentURL.includes('/chats')) {
    loadChatList();
  }
}



export function updateChat(chatType, chatId) {
  const messageList = (chatType === "dialog" ? document.getElementById("dialog-messages-id") : document.getElementById("chat-messages-id"));
  const lastMessage = messageList.firstElementChild;
  let lastMessageId;
  if (lastMessage) {
    lastMessageId = lastMessage.id;
  }
  else {
    lastMessageId = (chatType === "dialog" ? "dialog-0" : "chat-0");
  }
  lastMessageId = lastMessageId.substring(lastMessageId.lastIndexOf('-') + 1);
  const url = (chatType === "dialog" ? '/get_last_dialog_messages' : '/get_last_chat_messages');
  const form = new FormData();
  if (chatType === "dialog") form.append('dialogId', chatId);
  else form.append('chatId', chatId);
  form.append('lastMessageId', lastMessageId);
  const imageDir = (chatType === "dialog" ? dialogImagesDir : chatImagesDir);
  fetch(url, {
    method: 'POST',
    body: form,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to get messages');
    }
  })
  .then(data => {
    
    data.messages.forEach(message => {
      const imageList = document.createElement('ul');
      imageList.className = `messages-take media-grid items-${(message.images.length !== 0 ? message.images.length : '')}`
      message.images.forEach(image => {
        const newImage = document.createElement('li');
        newImage.className = 'media-grid item';
        newImage.innerHTML = `<img src="${imageDir}/${image}" alt="" class="media-grid__img">`
        imageList.appendChild(newImage);
      });
      if (chatType == "dialog") {

        const dialogMessage = document.createElement('li');
        dialogMessage.className = 'dialog-with__item';
        dialogMessage.id = `dialog-${message.id}`
        dialogMessage.innerHTML = `
          <div class="item-content">  
            <img class="dialog-with__photo" src="${profileAvatarsDir}/${message.userImg}" alt="">
            <div class="dialog-with__message-info">
                <div class="dialog-with__sender">
                    <a href="${profilePath}/${message.userId}" class="dialog-with__from-whom">${message.userFullname}</a>
                    <div class="date__subtitle"><time class="date__date" time="${message.createdDate}">${makeCorrectDate(message.createdDate)}</time></div>
                </div>
                <div class="dialog-with__text">${message.content}</div>
            </div>
          </div>
        `

        dialogMessage.appendChild(imageList);
        messageList.insertBefore(dialogMessage, messageList.firstChild);
      }
      else {
        const chatMessage = document.createElement('li');
        chatMessage.className = 'dialog-with__item';
        chatMessage.id = `chat-${message.id}`
        chatMessage.innerHTML = `
          <div class="item-content">  
            <img class="dialog-with__photo" src="${profileAvatarsDir}/${message.userImg}" alt="">
            <div class="dialog-with__message-info">
                <div class="dialog-with__sender">
                    <a href="${profilePath}/${message.userId}" class="dialog-with__from-whom">${message.userFullname}</a>
                    <div class="date__subtitle"><time class="date__date" time="${message.createdDate}">${makeCorrectDate(message.createdDate)}</time></div>
                </div>
                <div class="dialog-with__text">${message.content}</div>
            </div>
          </div>
        `
        chatMessage.appendChild(imageList);
        messageList.insertBefore(chatMessage, messageList.firstChild);
      }
    });
  })
  .catch(error => {
    console.error('An error occured while getting last messages:', error);
  });
}




export function updateComments() {
  const allComments = document.querySelectorAll(".news-comments.active");

  const form = new FormData();
  allComments.forEach(commentHolder => {
    let postId = commentHolder.id;
    postId = postId.substring(postId.lastIndexOf('-') + 1);
    const commentList = commentHolder.querySelector(".news-comments__list");
    const lastComment = commentList.lastElementChild;
    let lastCommentId;
    if (lastComment) {
      lastCommentId = lastComment.id;
    }
    else {
      lastCommentId = "comment-0";
    }
    lastCommentId = lastCommentId.substring(lastCommentId.lastIndexOf('-') + 1);
    form.append(postId, `${postId} ${lastCommentId}`);
  });
  fetch('/get_post_comments', {
    method: 'POST',
    body: form,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to get new comments');
    }
  })
  .then(data => {
    data.commentLists.forEach(commentList => {
      commentList.forEach(comment => {
        const imageList = document.createElement('ul');
        imageList.className = `messages-take media-grid items-${(comment.images.length !== 0 ? comment.images.length : '')}`
        comment.images.forEach(image => {
          const newImage = document.createElement('li');
          newImage.className = 'media-grid item';
          newImage.innerHTML = `<img src="${postCommentImagesDir}/${image}" alt="" class="media-grid__img">`
          imageList.appendChild(newImage);
        });
        const commentItem = document.createElement('li');
        commentItem.style.display = 'block';
        commentItem.className = 'news-comments__item';
        commentItem.id = `comment-${comment.id}`;
        
        commentItem.innerHTML = `
          <div class="news-comments__content">
            <img src="${profileAvatarsDir}/${comment.userImg}" alt="" class="news-comments__photo">
            <div class="news-comments__text-content">
                <a href="${profilePath}/${comment.userId}" class="news-comments__sender">${comment.userFullname}</a>
                <div class="news-comments__text">${comment.content}</div>
                <div class="date__subtitle"><time class="date__date" time="${comment.createdDate}">${makeCorrectDate(comment.createdDate)}</time></div>            
            </div>
          </div>
        `
        commentItem.appendChild(imageList);
        const populatingList = document.getElementById(`comments-list-${comment.postId}`);
        populatingList.appendChild(commentItem);
      })

    });
  })
  .catch(error => {
    console.error('An error occured while getting last comments:', error);
  });
}