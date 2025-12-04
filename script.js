// ========= НАЛАШТУВАННЯ =========
// Сюди встав СВІЙ webhook з Make.com
const WEBHOOK_URL = "https://hook.eu1.make.com/vf8v0v7cuat7wddevp4hf4yf6xop4jrt";
// ================================

// Поточна мова (PL за замовчуванням)
let currentLang = "pl";

// ====== МОВИ (перемикач PL / UA / RU) ======
function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll(".i18n").forEach((el) => {
    const text = el.dataset[lang];
    if (text) {
      el.textContent = text;
    }
  });
}

// слухаємо перемикачі мов (радіо-кнопки з name="lang")
document.addEventListener("DOMContentLoaded", () => {
  const langRadios = document.querySelectorAll('input[name="lang"]');
  if (langRadios.length) {
    langRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          updateLanguage(radio.value);
        }
      });
    });

    // виставити стартову мову
    const checked = document.querySelector('input[name="lang"]:checked');
    updateLanguage(checked ? checked.value : "pl");
  } else {
    updateLanguage("pl");
  }
});

// ====== ВІДПРАВКА ФОРМИ В MAKE ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ankieta-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
    }

    try {
      // Забираємо ВСІ поля з форми (усі input/textarea/select, де є name="")
      const formData = new FormData(form);

      // додаємо службові поля
      formData.append("lang", currentLang);
      formData.append("submitted_at", new Date().toISOString());

      // перетворюємо FormData -> звичайний обʼєкт
      const payload = Object.fromEntries(formData.entries());

      // Відправка в Make
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Повідомлення після успішної відправки
      let msg =
        "Анкету відправлено. Дані надійшли в Make.com (далі ми їх поведемо в Google Sheets / e-mail / Trafitt).";
      if (currentLang === "pl") {
        msg =
          "Ankieta została wysłana. Dane trafiły do Make.com (dalej wyślemy je do Google Sheets / e-mail / Trafitt).";
      } else if (currentLang === "ru") {
        msg =
          "Анкета отправлена. Данные попали в Make.com (дальше мы отправим их в Google Sheets / e-mail / Trafitt).";
      }

      alert(msg);
      form.reset(); // очищаємо форму після відправки
    } catch (err) {
      console.error(err);
      let msg =
        "Сталася помилка при відправці анкети. Спробуйте ще раз або скажіть рекрутеру.";
      if (currentLang === "pl") {
        msg =
          "Wystąpił błąd podczas wysyłania ankiety. Spróbuj ponownie lub poinformuj rekrutera.";
      } else if (currentLang === "ru") {
        msg =
          "Произошла ошибка при отправке анкеты. Попробуйте ещё раз или скажите рекрутеру.";
      }
      alert(msg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      }
    }
  });
});



