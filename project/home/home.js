document.addEventListener("DOMContentLoaded", () => {
  fetch("./상단바/header-sub.html")
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

  fetch("./사이드바/aside.html")
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
      document.querySelector("aside").innerHTML = bodyContent;
    })
    .catch((err) => {
      console.error("fetch 실패:", err);
    });

  fetch("./상단바/header-top.html")
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
      document.querySelector("header").innerHTML = bodyContent;

      document
        .getElementById("searchButton")
        .addEventListener("click", function () {
          const keyword = document.getElementById("searchInput").value.trim();
          if (keyword) {
            alert("검색어: " + keyword);
          } else {
            alert("검색어를 입력하세요!");
          }
        });
    })
    .catch((err) => {
      console.error("fetch 실패:", err);
    });

  // 카드 생성
  function creatDiv() {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="./img/다운로드.png" />
      <div class="card-content">
        <p class="card-title">올린 사람</p>
        <div class="card-description">
          <p class="card-text1">이미지 내용?</p>
          <p class="card-text2">이미지 내용?</p>
        </div>
      </div>
      `;
    return div;
  }
  // 내용 추가
  for (let i = 0; i < 10; i++) {
    const Div = document.querySelector("section");
    Div.appendChild(creatDiv());
  }
});