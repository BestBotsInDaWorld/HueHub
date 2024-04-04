export function showPreloader(parent) {

  console.log('its show')
  const preloaderElement = document.querySelector(`#${parent}-preloader`);
  if (preloaderElement) {
    preloaderElement.style.display = 'block';
    console.log('block')
  } else {
    console.error(`Could not find preloader element with ID #${parent}-preloader`);
  }
}

export function hidePreloader(parent) {
  let preloader = document.querySelector(`#${parent}-preloader`);
  console.log('its hide')
  if (preloader) {
    preloader.style.display = 'none';
  }
}