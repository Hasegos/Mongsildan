document.addEventListener("DOMContentLoaded", () => {
  fetch("../상단바/header-sub.html")
    .then((res) => {
      if (!res.ok) {
        throw new Error("파일을 불러오지 못했습니다.");
      }
      return res.text();
    })
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const bodyContent = doc.body.innerHTML;
      document.querySelector(".nav").innerHTML = bodyContent;

      const scrollContainer = document.getElementById("scrollContainer");
      const scrollBtn = document.getElementById("scrollRightBtn");

      scrollBtn.addEventListener("click", () => {
        scrollContainer.scrollBy({
          left: 200,
          behavior: "smooth",
        });
      });
    })
    .catch((err) => {
      console.error("fetch 실패:", err);
    });
});
