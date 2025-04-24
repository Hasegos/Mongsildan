document.addEventListener("DOMContentLoaded", function () {

  // 상단 바 불러오기
  loadHtml("header", "../home/상단바/header-top.html", () => {    

    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../home/상단바/styles/header-top.css";
    document.head.appendChild(styleLink);   

    // 사이드바 불러오기  
    const menuButton = document.getElementById("menuButton");    
    const aside = document.querySelector("aside");   
    
    let sidebar = document.createElement("link");
    sidebar.rel = "stylesheet";
    sidebar.href = "../home/상단바/styles/header-top.css";
    document.head.appendChild(sidebar); 
    let cuurrentPage = 1;

    menuButton.addEventListener("click", () => {
      if(cuurrentPage == 1){        
        loadHtml("aside","../home/sidebar/aside.html", () => { 
          const sidebarSytle = document.querySelector(".sidebar");           
          sidebar.href = "../home/sidebar/style/aside.css";
          document.head.appendChild(sidebar);         
              
          aside.style.width = "70px";        
          aside.style.display = "flex";
          aside.style.justifyContent = "center";  
          sidebarSytle.style.backgroundColor = "#212121";    
          sidebarSytle.style.left = "0";    
          sidebarSytle.style.width = "190px";
          sidebarSytle.style.marginTop = "56px";
          
        });
        cuurrentPage = 2;
      }      
      else if (cuurrentPage == 2){
        aside.style.display = "none";
        cuurrentPage = 1;
      }    
    });
  
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