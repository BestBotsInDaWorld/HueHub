function getDialogId(friendId) {
  const formData = new FormData();
  formData.append('dialogUserId', friendId);
  return fetch('/get_dialog', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    else {
      console.log('Something went wrong while getting dialog id')
    }
  })
  .then(data => {
    return data.dialogId;
  })
  .catch(error => {
    console.error('Error uploading photo:', error);
    return 0;
  });
} 


export async function toDialog(friendId) {
  let dialogId = await getDialogId(friendId);
  window.location.href = `/dialog/${dialogId}`;
}
