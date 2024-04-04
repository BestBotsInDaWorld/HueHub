export function openModal(modal, resultId="") {
  
  let modalOpen = document.getElementById(modal);
  if (resultId) modalOpen.setAttribute("data-upload-id", resultId);
  if (modalOpen.style.display == "none") {
    let overlay = document.querySelector(`.overlay`)
    overlay.style.opacity = "1";
    overlay.style.display = "block";
    modalOpen.style.display = 'block';
  } 
}

export function closeModal(modal) {
  let modalOpen = document.querySelector(`#${modal}`);
  modalOpen.setAttribute("data-upload-id", "");
  if (modalOpen.style.display == "block") {
    document.querySelector(`.overlay`).style.display = 'none';
    modalOpen.style.display = 'none';
  } 
}