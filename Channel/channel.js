document.addEventListener("DOMContentLoaded", () => {    

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id")); 
  
  // 좋아요, 타이틀 , 조회수, 날짜
  let like = 0, videoMainDescription, view, date; 

  // 최상단바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => {  
    let headerstyle = document.createElement("link");
    headerstyle.rel = "stylesheet";
    headerstyle.href = "../top/style/header-top.css";
    document.head.appendChild(headerstyle); 

    document.getElementById("searchButton").addEventListener("click", function () {
      const keyword = document.getElementById("searchInput").value.trim();
      if (keyword) {
        alert("검색어: " + keyword);
      } else {
        alert("검색어를 입력하세요!");
      }
    });     
  });

  // 사이드바 불러오기
  let currentPage = 1, check = 1;
  loadHtml("aside", "../sidebar/html/aside.html", () => {      
    menuButton(currentPage, check);
    handleResponsiveSidebar(); // 사이드바 로딩 끝나고 반응형 적용
  });

  /* channel-title */
  loadHtml(".header", "./html/channel-title.html", () => {
    let channelTitle = document.createElement("link");
    channelTitle.rel = "stylesheet";
    channelTitle.href = "./styles/channel-title.css";
    document.head.appendChild(channelTitle); 

    const subscribeBtn = document.getElementById('subscribe-btn');
    let subscribed = false;

    subscribeBtn.addEventListener('click', () => {
      subscribed = !subscribed;
      subscribeBtn.textContent = subscribed ? 'SUBSCRIBED' : 'SUBSCRIBES';
      subscribeBtn.style.backgroundColor = subscribed ? 'gray' : 'red';
    });
  });

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
      video.setAttribute("controls", true);
    });
  });

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

  /* 채널 정보 세팅 */
  async function title() { 
    const videos = await getChannelInfo(channelId);        

    const bannerImg = document.getElementById("banner-img");
    bannerImg.src = videos.channel_banner;

    const profileImg = document.getElementById("profile-img");
    profileImg.src = videos.channel_profile;

    const channelName = document.getElementById("channel-name");
    channelName.textContent = videos.channel_name;   

    const subscribers = document.getElementById("subscribers");
    subscribers.textContent = getSubscriber(videos.subscribers);
  }

  /* 대표 영상 세팅 */
  async function smallvideo(like, videoMainDescription, views, date) {
    const mainImg = document.getElementById("main-img");
    const videoDescription = document.getElementById("video-description");
    const viewText = document.getElementById("viewText");
    const beforeDay = document.getElementById("date");

    viewText.textContent = views;
    mainImg.src = like;      
    beforeDay.textContent = date;
    videoDescription.textContent = videoMainDescription;
  }

  /* 채널 내 재생목록 세팅 */
  async function playlist() {   
    const videos = await getChannelVideoList(channelId);     
    const Div = document.querySelector(".playlist-grid");

    const chunkSize = 4;
    let currentIndex = 0;

    async function renderChunk() {
      const fragment = document.createDocumentFragment();
      const chunk = videos.slice(currentIndex, currentIndex + chunkSize);

      chunk.forEach((video) => {
        if (like < video.likes) {
          like = video.thumbnail; 
          videoMainDescription = video.title;       
          view = video.views;
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
      } else {
        smallvideo(like, videoMainDescription, view, getTimeAgo(date));
      }
    }
    renderChunk();
  }

  playlist();
  title();

  /* === 사이드바 관련 === */

  function switchSidebar(state) {
    const sidebar = document.getElementById("sidebar");
    const mainWrapper = document.querySelector(".main-wrapper");

    if (!sidebar || !mainWrapper) return;

    if (state === 1) {
      sidebar.classList.remove("collapsed");
      mainWrapper.classList.remove("collapsed");
    } else if (state === 2) {
      sidebar.classList.add("collapsed");
      mainWrapper.classList.add("collapsed");
    }
  }

  let currentSidebarPage = null;

  function handleResponsiveSidebar() {
    const mediaQuery = window.matchMedia("(max-width: 1315px)");
    if (mediaQuery.matches && currentSidebarPage !== 2) {      
      switchSidebar(2);
      currentSidebarPage = 2;
    } else if (!mediaQuery.matches && currentSidebarPage !== 1) {
      switchSidebar(1);
      currentSidebarPage = 1;
    }
  }

  // ★ 페이지 처음 로드될 때도 바로 반응형 체크
  handleResponsiveSidebar();

  window.addEventListener("resize", handleResponsiveSidebar);
});
