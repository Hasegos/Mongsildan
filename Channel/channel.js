document.addEventListener("DOMContentLoaded", () => {
    
    // 최상단바 추가
  loadHtml("header", "../home/상단바/header-top.html", () => {  
      let headerstyle = document.createElement("link");
      headerstyle.rel = "stylesheet";
      headerstyle.href = "../home/상단바/styles/header-top.css";
      document.head.appendChild(headerstyle); 
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

    // 사이드바 불러오기
  loadHtml("aside", "../home/sidebar/aside.html", () => {
      const menuButton = document.getElementById("menuButton");
      // width 넓이 수정을위해서
      const aside = document.querySelector("aside");
      let cuurrentPage = 1;
      let sidebarStyle = document.createElement("link");
      sidebarStyle.rel = "stylesheet";
      sidebarStyle.href = "../home/sidebar/style/aside.css";
      document.head.appendChild(sidebarStyle); 
      aside.style.width = "190px";

      menuButton.addEventListener("click", () => {  
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
          if(link.href.includes("aside")) {
              link.remove();
          }
        })   
        if(cuurrentPage == 1){        
          loadHtml("aside","../home/sidebar/aside2.html", () => {            
            sidebarStyle.href = "../home/sidebar/style/aside2.css";
            document.head.appendChild(sidebarStyle);                        
            aside.style.width = "70px";        
            aside.style.display = "flex";
            aside.style.justifyContent = "center"; 

          });
          cuurrentPage = 2;
        }      
        else if (cuurrentPage == 2){
          loadHtml("aside","../home/sidebar/aside.html",() =>{          
              sidebarStyle.href = "../home/sidebar/style/aside.css";
            document.head.appendChild(sidebarStyle); 
            cuurrentPage = 1;     
            aside.style.width = "190px";
            aside.style.display = "";
            aside.style.justifyContent = "";          
          });        
        }      
      });      
  });
  /* channel-title */
  loadHtml(".header", "./html/channel-title.html", () => {

    let channelTitle = document.createElement("link");
    channelTitle.rel = "stylesheet";
    channelTitle.href = "./styles/channel-title.css";
    document.head.appendChild(channelTitle); 

    document.addEventListener('DOMContentLoaded', () => {
      const subscribeBtn = document.getElementById('subscribe-btn');
      let subscribed = false;
  
      subscribeBtn.addEventListener('click', () => {
        subscribed = !subscribed;
        subscribeBtn.textContent = subscribed ? 'SUBSCRIBED' : 'SUBSCRIBES';
        subscribeBtn.style.backgroundColor = subscribed ? 'gray' : 'red';
      });
    });
  })

  /* channel-smallvideo */
  loadHtml(".main", "./html/channel-smallvideo.html", () => {
    let smallvideo = document.createElement("link");
    smallvideo.rel = "stylesheet";
    smallvideo.href = "./styles/channel-smallvideo.css";
    document.head.appendChild(smallvideo); 
    
    const video = document.getElementById("main-video");
    const playBtn = document.getElementById("play-button");

    playBtn.addEventListener("click", () => {
      video.play();
      playBtn.style.display = "none";
      video.setAttribute("controls", true); // 재생 후 controls 표시
    });          
  })

  /* channel-playlist */
  loadHtml(".footer", "./html/channel-playlist.html", () => {
    let playlist = document.createElement("link");
    playlist.rel = "stylesheet";
    playlist.href = "./styles/channel-playlist.css";
    document.head.appendChild(playlist); 
    
    const subscribeBtn = document.getElementById('subscribe-btn');
    let subscribed = false;

    subscribeBtn.addEventListener('click', () => {
      subscribed = !subscribed;
      subscribeBtn.textContent = subscribed ? 'SUBSCRIBED' : 'SUBSCRIBES';
      subscribeBtn.style.backgroundColor = subscribed ? 'gray' : 'red';
    });
  });

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