document.addEventListener("DOMContentLoaded", function () {

  // 상단 바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => { 
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../top/style/header-top.css";
    document.head.appendChild(styleLink);   
      // 검색기능
      document.getElementById("searchButton")
      .addEventListener("click", function () {
        const keyword = document.getElementById("searchInput").value.trim();
        if (keyword) {
          alert("검색어: " + keyword);
        } else {
          alert("검색어를 입력하세요!");
        }
      });
  });
  // 사이드바 불러오기
  let cuurrentPage = 3 , check = 2;
  loadHtml("aside", "/sidebar/html/aside.html",() => {
    let headerStyle  = document.createElement("link");
    headerStyle.rel = "stylesheet";
    headerStyle.href = "/sidebar/style/aside.css";
    document.head.appendChild(headerStyle);        
    
    menuButton(cuurrentPage, check);
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