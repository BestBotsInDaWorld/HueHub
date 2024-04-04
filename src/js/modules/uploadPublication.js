export function uploadPhotos(input, targetElementId) {
  const files = input.files;
  const targetElement = document.querySelector(`#${targetElementId}`)
  let currLength = targetElement.classList[1];
  if (currLength === "items-") {
    targetElement.classList.replace(currLength, `items-${files.length}`);
  } else {
    currLength = targetElement.children.length;
    if (targetElement.classList.contains(`items-${currLength}`)) {
      targetElement.classList.replace(`items-${currLength}`, `items-${files.length + currLength}`)
    }
  }

  if (currLength == 'items-') {
    currLength = 0;
  }

  if (currLength + files.length < 10) {
    for (let i = 1; i <= files.length; i++) {
      let li = document.createElement('li');
      li.classList.add('media-grid', 'item');
      li.setAttribute('id', `media-grid-item-${currLength + i}`)

      let labelDelete = document.createElement('label');
      labelDelete.setAttribute('onclick', `deletePhoto('${targetElementId}', '${li.getAttribute('id')}', 'media-grid-item')`)
      labelDelete.classList.add('media-grid__delete', '_icon-close');
      labelDelete.setAttribute('for', `media-grid-item-${currLength + i}`)

      let insert = document.createElement('img');
      insert.classList.add('media-grid__img');
      li.append(labelDelete, insert);
      targetElement.append(li);
      insert.src = URL.createObjectURL(files[i - 1]);
    }
  }
}

export function deletePhoto(grid, from, itemName) {
  document.querySelector(`#${from}`).remove()
  updateMediaGrid(grid, itemName)
} 


export function clearGrid(gridId, type='') {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  grid.className = (type === 'chat' || type === 'comment' ? 'media-grid items- messages-send' : 'media-grid items-');
} 


export function updateMediaGrid(id, itemName) {
  let grid = document.querySelector(`#${id}`)
  let currLength = grid.children.length;
  if (!currLength) grid.classList.replace(`items-${currLength + 1}`, `items-`)
  else grid.classList.replace(`items-${currLength + 1}`, `items-${currLength}`)
  let gridElements = grid.querySelectorAll('li');
  for (let i = 1; i <= currLength; i++) {
    const li = gridElements[i - 1];
    const labelDelete = li.querySelector(`label[for="${li.getAttribute('id')}"]`)
    li.setAttribute('id',  `${itemName}-${i}`);
    labelDelete.setAttribute('onclick', `deletePhoto('${id}', '${itemName}-${i}', '${itemName}')`);
    labelDelete.setAttribute('for', `${itemName}-${i}`);
  }
}

export function populateFromUpload(uploadId, targetId="", fromData="") {
  if (fromData) targetId = document.querySelector(`#${fromData}`).getAttribute('data-upload-id');
  const uploadElement = document.querySelector(`#${uploadId}`)
  const targetElement = document.querySelector(`#${targetId}`)
  let uploadClass = uploadElement.classList[1];
  let targetClass = targetElement.classList[1];
  if (uploadClass === "items-") return;
  let uploadLength = parseInt(uploadClass.charAt(uploadClass.length - 1), 10);
  let targetLength = 0;
  if (targetClass === "items-") targetElement.classList.replace(targetClass, `items-${uploadLength}`);
  else {
    targetLength = parseInt(targetClass.charAt(targetClass.length - 1), 10);
    targetElement.classList.replace(targetClass, `items-${uploadLength + targetLength}`);
  }

  let uploadElements = uploadElement.querySelectorAll('li');
  for (let i = 1; i <= uploadLength; i++) {
    let li = document.createElement('li');
    li.classList.add('media-grid', 'item');
    li.setAttribute('id', `media-grid-result-item-${targetLength + i}`)

    let labelDelete = document.createElement('label');
    labelDelete.setAttribute('onclick', `deletePhoto('${targetId}', '${li.getAttribute('id')}', 'media-grid-result-item')`)
    labelDelete.classList.add('media-grid__delete', '_icon-close');
    labelDelete.setAttribute('for', `media-grid-result-item-${targetLength + i}`)

    let insert = document.createElement('img');
    insert.classList.add('media-grid__img');
    li.append(labelDelete, insert);
    targetElement.append(li);
    insert.src = uploadElements[i - 1].querySelector('img').getAttribute('src');
  }
  uploadElement.innerHTML = '';
  uploadElement.classList.replace(uploadClass, `items-`);
}




function fetchPublication(formData, url, imgItems, publication_type) {
  let promises = [];
  if (imgItems.length) {
    for (let i = 1; i <= imgItems.length; ++i) {
      let imgItem = imgItems[i - 1];
      let imgSrc = imgItem.querySelector('img').getAttribute('src');
      let promise = fetch(imgSrc)
          .then(response => response.blob())
          .then(blob => {
              formData.append(`photo_${i}`, blob);
          })
          .catch(error => {
              console.error('Error occurred while fetching photo:', error);
          });

      promises.push(promise);
    }
    Promise.all(promises)
    .then(() => {
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log(`${publication_type} uploaded successfully`);
                if (publication_type == 'post') {
                  setTimeout(function() {
                    location.reload();
                  }, 2000);
                }

            } else {
                console.error(`Failed to upload ${publication_type}`);
            }
        })
        .catch(error => {
            console.error(`Error occurred while uploading ${publication_type}:`, error);
        });
    })
    .catch(error => {
        console.error('Error occurred while fetching images:', error);
    });
  }

  else {
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        console.log(`${publication_type} uploaded successfully`);
        if (publication_type === 'post') {
          setTimeout(function() {
            location.reload();
          }, 2000);
        }

      } else {
        console.error(`Failed to upload ${publication_type}`);
      }
    })
    .catch(error => {
      console.error(`Error occured while uploading ${publication_type}:`, error);
    });
  }
}


export function exportPublication(textInputId, imgListId) {
  let textInput = document.getElementById(textInputId);
  let imgList = document.getElementById(imgListId);
  let imgItems = imgList.querySelectorAll('li');
  if (textInput) {
    const formData = new FormData();
    formData.append('text', textInput.innerText);
    formData.append('img_count', imgItems.length);
    fetchPublication(formData, '/upload_post', imgItems, 'post');
  }
} 


export function exportMessage(textInputId, imgListId, chat_type, chat_id) {
  let url = (chat_type === "dialog" ? '/upload_dialog_message' : '/upload_chat_message');
  let textInput = document.getElementById(textInputId);
  let imgList = document.getElementById(imgListId);
  let imgItems = imgList.querySelectorAll('li');
  if (textInput) {
    const formData = new FormData();
    formData.append('text', textInput.innerText);
    formData.append('img_count', imgItems.length);
    formData.append('chat_id', chat_id);
    fetchPublication(formData, url, imgItems, 'message');
  }
} 


export function exportPostComment(textInputId, imgListId, post_id) {
  let textInput = document.getElementById(textInputId);
  let imgList = document.getElementById(imgListId);
  let imgItems = imgList.querySelectorAll('li');
  if (textInput) {
    const formData = new FormData();
    formData.append('text', textInput.innerText);
    formData.append('img_count', imgItems.length);
    formData.append('post_id', post_id);
    fetchPublication(formData, '/upload_post_comment', imgItems, 'comment');
  }
}