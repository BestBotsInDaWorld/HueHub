export function toggleLike(likeButton, postId) {
  let likeIcon = likeButton.querySelector('.like-active');
  let action;
  if (likeIcon) {

    if (likeButton.classList.contains('btn-active')) {
      let likeCount = parseInt(likeButton.querySelector('.count').textContent) - 1;
      likeButton.querySelector('.count').textContent = likeCount;
      likeButton.classList.replace('btn-active', 'btn')
      likeIcon.classList.remove('like-active');
      action = "delete";
    }
  } else {
    let likeCount = parseInt(likeButton.querySelector('.count').textContent) + 1;
    likeButton.querySelector('.count').textContent = likeCount;
    likeIcon = likeButton.querySelector('._icon-like');
    if (likeIcon) {
      likeIcon.classList.add('like-active');
      likeButton.classList.replace('btn', 'btn-active')
      action = "add";
    }

  }
  const form = new FormData();
  form.append('postId', postId);
  form.append('action', action);
  fetch('/switch_post_like', {
    method : "Post",
    body: form,
  })
  .then(response => {
    if (response.ok) {
      console.log("Like successfully toggled")
    }
    else {
      console.log("Something went wrong")
    }
  })
  .catch(error => {
    console.error("An error occured", error)
  })
}
