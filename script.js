document.addEventListener("DOMContentLoaded", () => {
  const langRadios = document.querySelectorAll('input[name="lang"]');
  const i18nElems = document.querySelectorAll("[data-pl]");
  const form = document.getElementById("ankietaForm");

  // ===== 1. Перемикач мов (PL / UA / RU) =====
  function applyLang(lang) {
    i18nElems.forEach((el) => {
      const text = el.getAttribute("data-" + lang);
      if (text) el.textContent = text;
    });
  }

  // стартуємо з польської
  applyLang("pl");

  langRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const current = document.querySelector(
        'input[name="lang"]:checked'
      ).value;
      applyLang(current);
    });
  });

  // ===== 2. ВІДПРАВКА ФОРМИ В MAKE (WEBHOOK) =====
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const lang = document.querySelector('input[name="lang"]:checked').value;

      // те, що відправляємо в Make
      const payload = {
        full_name: form.full_name?.value || "",
        passport_number: form.passport_number?.value || "",
        phone_pl: form.phone_pl?.value || "",
        email: form.email?.value || "",
        emergency_phones: form.emergency_phones?.value || "",
        home_country: form.home_country?.value || "",
        pl_city: form.pl_city?.value || "",
        bank_account: form.bank_account?.value || "",
        lang,
        submitted_at: new Date().toISOString(),
      };

      const WEBHOOK_URL =
        "https://hook.eu1.make.com/vf8v0v7cuat7wddevp4hf4yf6xop4jrt";

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        alert(
          "Анкету відправлено.\nДані надійшли в Make.com (далі ми їх поведемо в Google Sheets / e-mail / Trafitt)."
        );

        form.reset();
        applyLang(lang); // лишаємо ту саму мову після reset
      } catch (err) {
        console.error("Помилка відправки в Webhook:", err);
        alert(
          "Сталася помилка при відправці анкети. Спробуйте ще раз або скажіть рекрутеру."
        );
      }
    });
  }
});

