// ===== НАЛАШТУВАННЯ =====
const WEBHOOK_URL = "https://hook.eu1.make.com/vf8v0v7cuat7wddevp4hf4yf6xop4jrt";

// Ключ для збереження мови в localStorage
const LANG_KEY = "ankieta_lang";

// ===== ДОПОМОЖНІ ФУНКЦІЇ =====

// Визначаємо поточну мову (за radio)
function getCurrentLang() {
  const langRadio = document.querySelector('input[name="lang"]:checked');
  return langRadio ? langRadio.value : "pl";
}

// Оновлення текстів за data-pl / data-ua / data-ru
function updateLanguage(lang) {
  const elements = document.querySelectorAll("[data-pl], [data-ua], [data-ru]");

  elements.forEach((el) => {
    const attr = `data-${lang}`;
    const text = el.getAttribute(attr);
    if (!text) return;

    if (
      el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.tagName === "SELECT"
    ) {
      // якщо є placeholder – оновлюємо його
      if (el.hasAttribute("placeholder")) {
        el.placeholder = text;
      } else {
        el.value = text;
      }
    } else {
      el.textContent = text;
    }
  });
}

// Показати alert з повідомленням на поточній мові
function showAlert(type, lang) {
  const messages = {
    success: {
      pl: "Ankieta została wysłana. Dane trafiły do Make.com (a stamtąd do Google Sheets / e-mail / Trafitt).",
      ua: "Анкету відправлено. Дані надійшли в Make.com (далі ми їх повеземо в Google Sheets / e-mail / Trafitt).",
      ru: "Анкета отправлена. Данные отправлены в Make.com (далее в Google Sheets / e-mail / Trafitt).",
    },
    error: {
      pl: "Wystąpił błąd podczas wysyłania ankiety. Spróbuj ponownie lub skontaktuj się z rekruterem.",
      ua: "Сталася помилка при відправці анкети. Спробуйте ще раз або скажіть рекрутеру.",
      ru: "Произошла ошибка при отправке анкеты. Попробуйте ещё раз или сообщите рекрутеру.",
    },
  };

  const msg = messages[type][lang] || messages[type].pl;
  alert(msg);
}

// Збираємо ВСІ дані форми в об’єкт
function collectFormData(form) {
  const payload = {};

  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    if (!field.id && !field.name) return; // пропускаємо без id та name
    if (["button", "submit", "reset"].includes(field.type)) return;

    const key = field.name || field.id;
    let value;

    if (field.type === "checkbox") {
      value = field.checked;
    } else if (field.type === "radio") {
      if (!field.checked) return; // тільки обране значення
      value = field.value;
    } else {
      value = field.value != null ? field.value.trim() : "";
    }

    // якщо такий ключ вже є (наприклад, кілька чекбоксів з однаковим name) – робимо масив
    if (key in payload) {
      if (Array.isArray(payload[key])) {
        payload[key].push(value);
      } else {
        payload[key] = [payload[key], value];
      }
    } else {
      payload[key] = value;
    }
  });

  // Додаткові службові поля
  payload.lang = getCurrentLang();
  payload.submitted_at = new Date().toISOString();

  return payload;
}

// Відправка даних у Make
async function sendToMake(payload) {
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

  return response.json().catch(() => null); // якщо відповіді немає – не ламаємось
}

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form"); // головна форма
  const langRadios = document.querySelectorAll('input[name="lang"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Відновлюємо мову з localStorage
  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang) {
    const radio = document.querySelector(
      `input[name="lang"][value="${savedLang}"]`
    );
    if (radio) {
      radio.checked = true;
      updateLanguage(savedLang);
    }
  } else {
    updateLanguage(getCurrentLang());
  }

  // Слухаємо переключення мови
  langRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const lang = getCurrentLang();
      localStorage.setItem(LANG_KEY, lang);
      updateLanguage(lang);
    });
  });

  // Обробка відправки форми
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lang = getCurrentLang();

    // Блокуємо кнопку, щоб не клікнули кілька разів
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading"); // якщо у тебе є такий стиль – буде красиво
    }

    try {
      const payload = collectFormData(form);
      await sendToMake(payload);
      showAlert("success", lang);

      // за потреби можна очистити форму:
      // form.reset();
      // updateLanguage(lang); // щоб після reset зберегти поточну мову в полях
    } catch (err) {
      console.error("Form submit error:", err);
      showAlert("error", lang);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      }
    }
  });
});




