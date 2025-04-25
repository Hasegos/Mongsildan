document.addEventListener("DOMContentLoaded", () => {    

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id")); 
  
  // 좋아요, 타이틀 , 조회수, 날짜
  let like = 0 , videoMainDescription, view,date; 

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


 /* title */
  async function title() { 
    
  const videos = await getChannelInfo(channelId);        

  const bannerImg = document.getElementById("banner-img");
  bannerImg.src = videos.channel_banner;

  const profileImg = document.getElementById("profile-img");
  profileImg.src = videos.channel_profile;

  const channelName = document.getElementById("channel-name");
  channelName.textContent = videos.channel_name;   
  }  
  /* smallVideo */
  async function smallvideo(like,videoMainDescription,views,date){
      /* 가장 추천수가 많은 페이지 띄우기 */
      const mainImg = document.getElementById("main-img");
      const videoDescription = document.getElementById("video-description");
      const viewText = document.getElementById("viewText");
      const beforeDay = document.getElementById("date");
      
      viewText.textContent = views;
      mainImg.src = like;      
      beforeDay.textContent = date
      videoDescription.textContent = videoMainDescription;  
  }

  /* playlist-grid */
  async function playlist() {   
    
    const videos = await getChannelVideoList(channelId);     
    const Div = document.querySelector(".playlist-grid");

    const chunkSize = 4;
    let currentIndex = 0;

    async function renderChunk() {
      const fragment = document.createDocumentFragment();
      const chunk = videos.slice(currentIndex, currentIndex + chunkSize);

      const channelInfos = await Promise.all(
        chunk.map((video) => getChannelVideoList(channelId))
      );

      chunk.forEach((video) => {

        if(like < video.likes){
          like = video.thumbnail; 
          videoMainDescription = video.title;       
          view =  video.views;
          date = video.created_dt;
        }
        const channelDiv = document.createElement("div");
        channelDiv.classList.add("card");
        channelDiv.innerHTML = `
          <a href="#" class="playlist-card" target="_blank">
            <div class="video-preview">
              <img src="${video.thumbnail}" alt="썸네일" class="thumb-img" />
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="playlist-text">
              <p>${video.title}</p>              
            </div>
          </a>
        `;
        fragment.appendChild(channelDiv);
      });      

      Div.appendChild(fragment);
      currentIndex += chunkSize;
      if (currentIndex < videos.length) {
        setTimeout(renderChunk, 1);        
      }
      // smallvideo
      smallvideo(like,videoMainDescription,view,getTimeAgo(date));
    }
    renderChunk();
  }
  playlist();
  title();

  // 날짜 차이 계산 함수
  function getTimeAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffTime = now - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 30) return `${diffDays}일 전`;

    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months}개월 전`;

    const years = Math.floor(months / 12);
    return `${years}년 전`;
  }

  /* 1315px 미만일때 작동 */
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