let defaultHeight = 0;

export function autoResize(event, id, target_id="") {
  const textField = document.getElementById(`${id}`);
  const dataText = textField.getAttribute('data-text');

  if (!textField.textContent) {
      defaultHeight = textField.style.height;
  }
  if (event.key === 'Enter') {
      event.preventDefault(); 
      if (id == 'add-note-field') {
          newNote(textField, dataText);
      }
      else if (id == 'new-dialog-message') {
        newChatMessage(textField, dataText, id, target_id);
      }
      else if (id == 'new-chat-message') {
        newChatMessage(textField, dataText, id, target_id);
      }
      else if (id.includes('new-comment-message')) {
        newPostComment(textField, dataText, id, target_id);
      }
  }
  if (textField.style.height.slice(0, -2) < textField.scrollHeight) {
    requestAnimationFrame(() => {
      textField.style.transition = 'height 0.3s ease';
      textField.style.height = (textField.scrollHeight + 5) + 'px'; 
  });
  }
 
}


function newNote(textField, dataText) {
  exportPublication('add-note-field', 'media-grid-upload-result');
  textField.textContent = '';
  textField.style.height = defaultHeight; 
  textField.setAttribute('data-text', dataText); 
  return;
}


function newChatMessage(textField, dataText, inputId, chat_id) {
  if (inputId == 'new-dialog-message') {
    exportMessage(inputId, 'media-grid-upload-result', 'dialog', chat_id);
    clearGrid('media-grid-upload-result', 'chat');
  }
  else {
    exportMessage(inputId, 'media-grid-upload-result', 'chat', chat_id);
    clearGrid('media-grid-upload-result', 'chat');
  }
  textField.textContent = '';
  textField.style.height = defaultHeight; 
  textField.setAttribute('data-text', dataText);

  return;
}


function newPostComment(textField, dataText, inputId, post_id) {
  exportPostComment(inputId, `media-grid-upload-result-${post_id}`, post_id);
  clearGrid(`media-grid-upload-result-${post_id}`, 'comment');
  textField.textContent = '';
  textField.style.height = defaultHeight; 
  textField.setAttribute('data-text', dataText);

  return;
}


export function sendMessageButton(id, target_id='') {
  const textField = document.getElementById(`${id}`);
  const dataText = textField.getAttribute('data-text');

  if (textField && target_id) {
    if (id == 'add-note-field') {
      newNote(textField, dataText);
    }
    else if (id == 'new-dialog-message' || id == 'new-chat-message') {
      newChatMessage(textField, dataText, id, target_id);
    }
    else if (id.includes('new-comment-message')) {
      newPostComment(textField, dataText, id, target_id)
    }
  }
}