
export function displayComments(postId) {
  let post = document.getElementById(`${postId}`);


  if (post) {
    if (post.classList.contains('active')) {
      post.classList.remove('active');
    } else {
      post.classList.add('active');
    }
  } 

  let commentsUl = post.querySelector('.news-comments__list');

  seeMoreComments(commentsUl.getAttribute('id'))
}


export function seeMoreComments(postListId) {
  let postList = document.getElementById(`${postListId}`)
  if (postList) {
    for (let comment of postList.querySelectorAll('.news-comments__item')) {
        comment.style.display = 'block'
    }

  }
}


