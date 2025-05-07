document.addEventListener("DOMContentLoaded", () => {    

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id"));   

   // 최상단바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => {  
    let headerstyle = document.createElement("link");
    headerstyle.rel = "stylesheet";
    headerstyle.href = "../top/style/header-top.css";
    document.head.appendChild(headerstyle); 

    /* 상단 600px 일때 */   
    topLoad600px(); 
    /* 초기 검색시 */
    searching();          
  });     
  // 사이드바 불러오기
  let cuurrentPage = 1 , check = 3;
  loadHtml("aside", "../sidebar/html/aside.html",() => {      
    const aside = document.querySelector("aside");
    
    if(window.innerWidth > 625){
      aside.classList.remove("mobile-open");
    }
  
    menuButton(cuurrentPage,check);
    window.addEventListener("resize", () => {
      if (window.innerWidth > 625) {
        aside.classList.remove("mobile-open");
      }
    }),// 에러가 발생시
    (err) => {

    }
  }); 
  
  /* 구독 버튼 */
  const subscribeBtn = document.getElementById('subscribe-btn');
  const subscribeText = document.getElementById('subscribe-text');
  const bellIcon = document.getElementById('bell-icon');
  let subscribed = false;

  subscribeBtn.addEventListener('click', () => {
    subscribed = !subscribed;
    if (subscribed) {
      subscribeText.textContent = '구독중';
      subscribeBtn.style.backgroundColor = '#515353'; // 구독중 배경
      bellIcon.style.display = 'inline';
      bellIcon.classList.add('bell-shake');
  
      bellIcon.addEventListener('animationend', () => {
        bellIcon.classList.remove('bell-shake');
      }, { once: true });
  
    } else {
      subscribeText.textContent = '구독';
      subscribeBtn.style.backgroundColor = 'white'; // 구독전 배경
      bellIcon.style.display = 'none';
    }  
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

    const subscribers = document.getElementById("subscribers");
    subscribers.textContent = getSubscriber(videos.subscribers);
  }  
  /* smallVideo */
  async function smallvideo(like,videoMainDescription,views,date, linkvideoId, linkChannelId){
      /* 가장 추천수가 많은 페이지 띄우기 */
      const smallVideoLink = document.getElementById("video-link");
      const mainImg = document.getElementById("main-img");
      const videoDescription = document.getElementById("video-description");
      const viewText = document.getElementById("viewText");
      const beforeDay = document.getElementById("date");
      
      smallVideoLink.href = `../videos/videos.html?channel_id=${linkChannelId}&video_id=${linkvideoId}`;
      viewText.textContent = views;
      mainImg.src = like;      
      beforeDay.textContent = date
      videoDescription.textContent = videoMainDescription;  

       // 2) 에러 핸들러 등록 (한 번만)
      mainImg.addEventListener("error", () => {
        // 이미지 로드 실패했을 때만 실행
        smallVideoLink.removeAttribute("href");
      })       
  }

  /* playlist-grid */
  async function playlist() {   

    let like = 0  /* 좋아요 */
    let videoMainDescription = "" /* 영상 제목 */
    let view = 0  /* 조회수 */
    let date = "" /* 업로드 날짜 */
    let linkvideoId = 0  /* 영상 id */
    let linkChannelId = 0; /* 채널 id */
    
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
          linkvideoId = video.id;
          linkChannelId = video.channel_id;
        }
        const channelDiv = document.createElement("div");
        channelDiv.classList.add("card");
        channelDiv.innerHTML = `
          <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="playlist-card">
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
      smallvideo(like,videoMainDescription,view,getTimeAgo(date), linkvideoId, linkChannelId);
    }
    renderChunk();
  }
  playlist();
  title();
  
  /* 1315px 미만일때 작동 */
  let currentSidebarPage = null;
  function handleResponsiveSidebar() {
    const mediaQuery = window.matchMedia("(max-width: 1315px)");
    if(mediaQuery.matches && currentSidebarPage !==2){      
      switchSidebar(2);
      currentSidebarPage = 2;
    }
    else if(!mediaQuery.matches && currentSidebarPage !==1){
      switchSidebar(1);
      currentSidebarPage = 1;
    }
  }    
  handleResponsiveSidebar();
  window.addEventListener("resize", handleResponsiveSidebar);


   /* 비디오 재생 */   
  function replayVideo() {  
    const video = document.getElementById("main-video"); 
    const playBtn = document.getElementById("play-button");

    playBtn.addEventListener("click", () => {
      video.play();
      playBtn.style.display = "none";
      video.setAttribute("controls", true); // 재생 후 controls 표시
    });   
  }
});