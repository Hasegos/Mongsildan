document.addEventListener("DOMContentLoaded", () => {
    
    // 최상단바 추가
    loadHtml("header", "../home/상단바/header-top.html", () => {

        let styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "../home/상단바/styles/header-top.css";
        document.head.appendChild(styleLink); 

         // 사이드바 불러오기
    loadHtml("aside", "../home/sidebar/aside.html", () => {
        const menuButton = document.getElementById("menuButton");
        // width 넓이 수정을위해서
        const aside = document.querySelector("aside");
        let cuurrentPage = 1;
        let sidebarStyle = document.createElement("link");
        sidebarStyle.rel = "stylesheet";

    menuButton.addEventListener("click", () => {
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
          if(link.href.includes("aside")) {
              link.remove();
          }
        })

      if(cuurrentPage == 1){        
        loadHtml("aside","./sidebar/aside2.html", () => {            
            sidebarStyle.href = "./sidebar/style/aside2.css";
          document.head.appendChild(sidebarStyle);         
              
          aside.style.width = "70px";        
          aside.style.display = "flex";
          aside.style.justifyContent = "center";          
          
        });
        cuurrentPage = 2;
      }      
      else if (cuurrentPage == 2){
        loadHtml("aside","./sidebar/aside.html",() =>{          
            sidebarStyle.href = "./sidebar/style/aside.css";
          document.head.appendChild(sidebarStyle); 
          cuurrentPage = 1;     
          aside.style.width = "240px";
          aside.style.display = "";
          aside.style.justifyContent = "";          
        });        
      }      
    });
  });   




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

})