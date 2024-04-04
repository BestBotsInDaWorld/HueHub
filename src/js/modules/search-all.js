let timerId;

export async function searchAll(field) {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    let fieldValue = field.value;
    field.setAttribute('value', fieldValue); // Исправленная строка
  }, 500);
}