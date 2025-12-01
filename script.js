// Запускаємо код тільки після завантаження всієї сторінки
document.addEventListener("DOMContentLoaded", () => {
  const langRadios = document.querySelectorAll('input[name="lang"]');
  // Беремо всі елементи, де є data-pl / data-ua / data-ru
  const i18nElems = document.querySelectorAll("[data-pl]");

  function applyLang(lang) {
    i18nElems.forEach((el) => {
      // читаємо атрибут data-pl / data-ua / data-ru
      const text = el.getAttribute("data-" + lang);
      if (text) {
        el.textContent = text;
      }
    });
  }

  // стартова мова – польська
  applyLang("pl");

  // реагуємо на зміну радіо-кнопок
  langRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const current = document.querySelector(
        'input[name="lang"]:checked'
      ).value;
      applyLang(current);
    });
  });

  // Тестова відправка форми – щоб дані нікуди не летіли
  const form = document.getElementById("ankietaForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Анкету заповнено.\nЗараз це тестовий режим – дані ніде не зберігаються."
      );
    });
  }
});


