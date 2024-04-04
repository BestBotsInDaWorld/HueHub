import { toggleLike } from './modules/like.js';
import { toDialog } from "./modules/dialog.js";
import { autoResize } from "./modules/input-fields.js";
import { addPerson, toggleUserList, loadChatList } from "./modules/new-chat.js";
import { searchAll } from "./modules/search-all.js";
import { targetSearch, hideSearchResults } from './modules/targetSearch.js';
import { displaySearchResults } from './modules/fetchSearch.js';
import { openModal, closeModal } from './modules/triggerModal.js';
import { uploadPhoto, exportProfilePhoto } from './modules/uploadPhoto.js';
import { addFriend, acceptInvite, denyInvite, deleteFriend, changeProfileUI, handleFriendChange} from './modules/addFriend.js';
import { deletePhoto, uploadPhotos, populateFromUpload, exportPublication, exportMessage, clearGrid, exportPostComment } from './modules/uploadPublication.js';
import { hidePreloader, showPreloader } from './modules/preloader.js';
import { updateMessagesByUrl, updateChatListByUrl } from './modules/schedules.js';
import { makeCorrectDate } from './modules/makeCorrectDate.js';
import { sendMessageButton } from './modules/input-fields.js'; 
import { displayComments, seeMoreComments } from './modules/comment.js';

window.hidePreloader = hidePreloader;
window.showPreloader = showPreloader;


document.addEventListener("DOMContentLoaded", function() {
  window.toggleLike = toggleLike;
  window.toDialog = toDialog;
  window.autoResize = autoResize;
  window.addPerson = addPerson;
  window.toggleUserList = toggleUserList;
  window.searchAll = searchAll;
  window.targetSearch = targetSearch;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.uploadPhoto = uploadPhoto;
  window.exportProfilePhoto = exportProfilePhoto;
  window.uploadPhotos = uploadPhotos;
  window.deletePhoto = deletePhoto;
  window.addFriend = addFriend;
  window.acceptInvite = acceptInvite;
  window.denyInvite = denyInvite;
  window.deleteFriend = deleteFriend;
  window.changeProfileUI = changeProfileUI;
  window.handleFriendChange = handleFriendChange;
  window.populateFromUpload = populateFromUpload;
  window.exportPublication = exportPublication;
  window.exportMessage = exportMessage;
  window.updateMessagesByUrl = updateMessagesByUrl;
  window.makeCorrectDate = makeCorrectDate;
  window.clearGrid = clearGrid;
  window.loadChatList = loadChatList;
  window.updateChatListByUrl = updateChatListByUrl;
  window.displayComments = displayComments;
  window.seeMoreComments = seeMoreComments;
  window.sendMessageButton = sendMessageButton;
  window.exportPostComment = exportPostComment;

  const body = document.body;
  body.minHeight = window.offsetHeight;
  

  const dialogsList = document.querySelector('.dialogs__list');
  if (dialogsList) {
    window.addEventListener('scroll', () => {
      const dialogsRect = dialogsList.getBoundingClientRect();
      if (dialogsRect.top < 0) {
        dialogsList.style.position = 'fixed';
        dialogsList.style.top = '2';
      } else {
        dialogsList.style.position = 'static';
      }
    });
  }
  

  var timeDivs = document.querySelectorAll('.date__subtitle');
  timeDivs.forEach(function(timeDiv) {
      var timeElement = timeDiv.querySelector('.date__date');
      
      if (timeElement) {
          timeElement.textContent = makeCorrectDate(timeElement.getAttribute('time'));
      }
  });
  
  // добавление последних сообщений 
  setInterval(updateMessagesByUrl, 3000);
  // затратная функция
  setInterval(updateChatListByUrl, 10000);

});


const dialogsList = document.querySelector('.dialogs__list');
if (dialogsList) {
  window.addEventListener('scroll', () => {
    const dialogsRect = dialogsList.getBoundingClientRect();
    if (dialogsRect.top < 0) {
      dialogsList.style.position = 'fixed';
      dialogsList.style.top = '2';
    } else {
      dialogsList.style.position = 'static';
    }
  });
}


document.addEventListener('click', function(event) {
  var searchResults = document.querySelector('.nav__search-results');
  var input = document.getElementById('search-all');
  
  // Если клик был не на input и не внутри .nav__search-results, то скрываем список
  if (!input.contains(event.target) && !searchResults.contains(event.target)) {
      hideSearchResults();
  }
});



let newChatForm = document.getElementById('new-chat-form')

if (newChatForm) {
  newChatForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    let checkedSpans = document.querySelectorAll('.dialog__title.radio-btn-active');
    let title = document.querySelector('.chat__title')
    let description = document.querySelector('.chat__description')
    let checkedFriendIds = [];
    checkedSpans.forEach(function(span) {
        checkedFriendIds.push(span.getAttribute('friend-id'));
    });

    fetch('/create_chat', {
        method: 'POST',
        body: JSON.stringify({ checkedFriends: checkedFriendIds, title: title.value, description: description.value}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      if (data.message == 'Success') {
        loadChatList();
        toggleUserList();
      }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

});
}
 
let searchTimeoutId;

let search = document.getElementById('search-all');
if (search) {
  search.addEventListener('input', function(event) {
  
    clearTimeout(searchTimeoutId);
    let searchResults = document.getElementById('search-results-id');
    if (searchResults.innerHTML.includes('search-results__info')) {
      searchResults.innerHTML = `
      <div class="loader">
      <div class="inner one"></div>
      <div class="inner two"></div>
      <div class="inner three"></div>
      </div>
      `
    }

    const searchText = this.value.trim();
    
    if (searchText.length > 0) {
        searchTimeoutId = setTimeout(function() {
          fetch(`/get_users_by_fullname/${searchText}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(users => {
            displaySearchResults(users);
          })
          .catch(error => {
              console.error('Error fetching users:', error);
          });
          ;
        }, 2000);
    }
});
}
