document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
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

  fetch("../aside/aside.html")
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
=======

   // 최상단바 불러오기
  loadHtml("header", "./상단바/header-top.html", () => {
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
  });    

  // 헤더 서브바 불러오기
  loadHtml(".nav", "./상단바/header-sub.html", () => {
    const scrollContainer = document.getElementById("scrollContainer");
    const scrollBtn = document.getElementById("scrollRightBtn");

    scrollBtn.addEventListener("click", () => {      
      scrollContainer.scrollBy({
        left: 200,
        behavior: "smooth",
      });      
    });
  });

  // 사이드바 불러오기
  loadHtml("aside", "./sidebar/aside.html", () => {
    const menuButton = document.getElementById("menuButton");
    // width 넓이 수정을위해서
    const aside = document.querySelector("aside");
    let cuurrentPage = 1;
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";

    menuButton.addEventListener("click", () => {
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
          if(link.href.includes("aside")) {
              link.remove();
          }
        })

      if(cuurrentPage == 1){        
        loadHtml("aside","./sidebar/aside2.html", () => {            
          styleLink.href = "./sidebar/style/aside2.css";
          document.head.appendChild(styleLink);         
              
          aside.style.width = "70px";        
          aside.style.display = "flex";
          aside.style.justifyContent = "center";          
          
        });
        cuurrentPage = 2;
      }      
      else if (cuurrentPage == 2){
        loadHtml("aside","./sidebar/aside.html",() =>{          
          styleLink.href = "./sidebar/style/aside.css";
          document.head.appendChild(styleLink); 
          cuurrentPage = 1;     
          aside.style.width = "240px";
          aside.style.display = "";
          aside.style.justifyContent = "";          
        });        
      }      
    });
  });   
>>>>>>> suho

  // 카드 생성
  function creatDiv() {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
<<<<<<< HEAD
      <img src="./img/다운로드.png" />
      <div class="card-content">
        <p class="card-title">올린 사람</p>
        <div class="card-description">
          <p class="card-text1">이미지 내용?</p>
          <p class="card-text2">이미지 내용?</p>
        </div>
      </div>
=======
      <a href="../videos/videos.html" class="card-link">
        <img src="../img/다운로드.png" />
        <div class="card-content">
          <p class="card-title">올린 사람</p>
          <div class="card-description">
            <p class="card-text1">이미지 내용?</p>
            <p class="card-text2">이미지 내용?</p>
          </div>
        </div>
      </a>
>>>>>>> suho
      `;
    return div;
  }
  // 내용 추가
  for (let i = 0; i < 10; i++) {
    const Div = document.querySelector("section");
    Div.appendChild(creatDiv());
<<<<<<< HEAD
  }
});
=======
  } 
  let cuurrentSidebarPage = null;
  function handleResponsiveSidebar() {
    const meideaQuery = window.matchMedia("(max-width: 1315px)");
    if(meideaQuery.matches && cuurrentSidebarPage !==2){      
      switchSidebar(2);
      cuurrentSidebarPage = 2;
    }
    else if(!meideaQuery.matches && cuurrentSidebarPage !==1){
      switchSidebar(1);
      cuurrentSidebarPage = 1;
    }
  }
    
  handleResponsiveSidebar();
  window.addEventListener("resize", handleResponsiveSidebar);
});
>>>>>>> suho
