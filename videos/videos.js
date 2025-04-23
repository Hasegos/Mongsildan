document.addEventListener("DOMContentLoaded", function () {
  fetch("../상단바/header-top.html")
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

    document.getElementById("searchButton")
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
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");

  let comments = [];

  function renderComments() {
    commentList.innerHTML = "";
    comments.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;
      commentList.appendChild(li);
    });
    commentCount.textContent = comments.length;
  }

  submitBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      comments.push(text);
      commentInput.value = "";
      renderComments();
    } else {
      alert("댓글을 입력해주세요.");
    }
  });
  
});