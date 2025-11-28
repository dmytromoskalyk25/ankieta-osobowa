import {
  defineComponents,
  DocumentReaderService,
} from "https://unpkg.com/@regulaforensics/vp-frontend-document-components@latest/dist/main.js";

// Ліцензія Regula (твій trial)
const REGULA_LICENSE_BASE64 = `
AAEAAE+4EQu5uk+zYBNqtwsXFjeVE5SZwhOePWImfVfsEYmYodIyAYAExYLFo30SwVplMZr4pVlGE571
kz1FrfkhxtyKUCXPr7FfqOrX6j1DbZtHJlrGkFHh1yxEGVwmquhY8gUh1SIdxqwXofNwa21rp/R7mox8
KY3yY3WnwErWtDA4wlvMM9Cb09lU9nEUJKdcDZloz5MvZlRWTbRu6IQQZlEDo7+2eQar/6MJRZFpwWib
//Mdzo6o7Wx/Rq/riGK0pskMzjO8mxVe58EVw5Mg5GsiTzJkE5LRcVvkFEksjYLsoy+rJcCvQPHzbW1h
Hjo9U2fZB0e+MrGKfsDJx9EQ+enkAAAAAAAAEGj+Az/G7rs74uOdT2WeiCB6f01VGwJcUwAEexAqHVkb
u5KtlAseeEg20eInQUCLwBwun9HHYlSgrONpEkXCM+AZWgJ7rWJZ0RK3OKh5oqUluVzZQAfjE1LKji8i
mTxjGzMODpQNXzGn74S8h+ZHNhbyrVGqnmk4Hhk2N53CN9UfmzuKljhVVuDq33sqqAIvFsVKlTm28rI0
epjCEkEDI+4S61vM52w3cBiy4kZZxfrdaOfL9fcQJkQnk0AImuNR/HiGCSozuLcJfTv8/eFzIKbeFKgc
3ryC2Tpt8ZgLD3TR
`.replace(/\s+/g, "");

let docSdk;
const scanBtn = document.getElementById("scanBtn");
const docReader = document.getElementById("docReader");

// 1. Ініціалізуємо Regula Web Components
defineComponents()
  .then(() => {
    docSdk = new DocumentReaderService();

    // Використовуємо сценарій MRZ (зчитування тільки нижніх 2 ліній)
    docSdk.recognizerProcessParam = {
      processParam: { scenario: "Mrz" },
    };

    return docSdk.initialize({
      license: REGULA_LICENSE_BASE64,
    });
  })
  .then(() => {
    console.log("Regula initialized OK");
  })
  .catch((err) => {
    console.error("Regula init error:", err);
    alert("Помилка ініціалізації Regula. Перевір Console.");
  });

// 2. Відкриття компонента сканера
scanBtn.addEventListener("click", () => {
  docReader.style.display = "block";
});

// 3. Обробка результату сканування
docReader.addEventListener("document-reader", (event) => {
  const detail = event.detail;

  if (detail.action === "CLOSE" || detail.action === "CAMERA_PROCESS_CLOSED") {
    docReader.style.display = "none";
    return;
  }

  if (detail.action === "PROCESS_FINISHED" && detail.data) {
    const response = detail.data.response;

    console.log("MRZ result →", response);

    alert("Скан успішний! Переглянь консоль (F12 → Console)");

    docReader.style.display = "none";
  }
});

