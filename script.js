document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // 1. Перемикач мов
  // ==========================
  const langRadios = document.querySelectorAll('input[name="lang"]');
  const i18nElems = document.querySelectorAll("[data-pl]");

  function applyLang(lang) {
    i18nElems.forEach((el) => {
      const text = el.getAttribute("data-" + lang);
      if (text) el.textContent = text;
    });
  }

  applyLang("pl"); // стартова мова

  langRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const current = document.querySelector('input[name="lang"]:checked').value;
      applyLang(current);
    });
  });

  // ==========================
  // 2. Відправка форми в Make Webhook
  // ==========================

  const form = document.getElementById("ankietaForm");

  if (!form) {
    console.error("❌ FORM NOT FOUND (#ankietaForm)");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lang = document.querySelector('input[name="lang"]:checked').value;

    // Збираємо ВСІ поля автоматично
    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
      payload[key] = value;
    });

    payload["lang"] = lang;
    payload["submitted_at"] = new Date().toISOString();

    const WEBHOOK_URL =
      "https://hook.eu1.make.com/vf8v0v7cuat7wddevp4hf4yf6xop4jrt";

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors", // ВАЖЛИВО: блокує CORS-помилки
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert(
        "Анкету успішно відправлено.\nДані отримані Make.com і будуть перенаправлені далі (Google Sheets / email / Trafitt)."
      );

      form.reset();
      applyLang(lang); // після reset лишаємо вибрану мову
    } catch (err) {
      console.error("Помилка відправки:", err);
      alert(
        "Помилка при відправці анкети. Спробуйте ще раз або скажіть рекрутеру."
      );
    }
  });
});


