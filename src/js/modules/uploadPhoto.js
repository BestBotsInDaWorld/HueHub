export function uploadPhoto(from, to) {
  let insert = document.querySelector(`#${to}`);
  if (insert) {
    insert.src = URL.createObjectURL(from.files[0]);
  }
}

export function exportProfilePhoto(from) {
  let preview = document.querySelector(`#${from}`);
  if (preview && preview.src) {
    const imageUrl = preview.src;
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('photo', blob);
        fetch('/export_profile_photo', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            console.log('Photo uploaded successfully');
            setTimeout(function() {
              location.reload();
            }, 1000);
          } else {
            console.error('Failed to upload photo');
          }
        })
        .catch(error => {
          console.error('Error uploading photo:', error);
        });
      })
      .catch(error => {
        console.error('Error fetching blob data:', error);
      });
  } else {
    console.error('Preview element not found or empty');
  }
} 
