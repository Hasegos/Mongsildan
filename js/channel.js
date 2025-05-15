document.addEventListener("DOMContentLoaded", () => {    
  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id")); 

  /* ============ 최상단바 불러오기 ============ */
  try{ 
    loadHtml("header", "../html/header-global.html", () => {  
        let headerstyle = document.createElement("link");
        headerstyle.rel = "stylesheet";
        headerstyle.href = "../css/header-global.css";
        document.head.appendChild(headerstyle); 

        const menuButtonId = document.getElementById("menuButton");
        const aside = document.querySelector("aside");
        let currentPage = null;      

        /* ============ 상단 600px 일때 ============ */
        topLoad600px(); 

        /* ============ 초기 검색시 ============ */
        searching(); 
        
        /* ============ 사이드바 불러오기 ============ */
        function loadSidebar(page) {

          currentPage = page;       
          
          document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            if (/sidebar-(collapsed|expanded)\.css$/.test(link.href)) {
              link.remove();
            }
          });
          
          /* ============ 구독 이벤트 유지 ============ */
          if (page === 3) {
            loadHtml("aside", "../html/sidebar-expanded.html", () => {
              const link = document.createElement("link");
              link.rel  = "stylesheet";
              link.href = "../css/sidebar-expanded.css";
              document.head.appendChild(link);
            });
            
            aside.style.display = "none";            
            return;
          }

          const htmlPath = page === 1
            ? "../html/sidebar-expanded.html"
            : "../html/sidebar-collapsed.html";

          const cssPath = page === 1
            ? "../css/sidebar-expanded.css"
            : "../css/sidebar-collapsed.css";

          loadHtml("aside", htmlPath, () => {
            const link = document.createElement("link");
            link.rel  = "stylesheet";
            link.href = cssPath;
            document.head.appendChild(link);

            if(page === 1) {
              renderSavedSubscriptions(aside);
            }

            aside.style.display      = "";
            if(window.innerWidth >= 625) {              
              aside.classList.remove("mobile-open");   
            }            
          });
        }

     /* ============  사이드바 반응형 ============ */
      function initSidebar() {              
        const w = window.innerWidth;
        let page;
        if (w > 1315)      page = 1;
        else if (w >= 626)  page = 2;
        else               page = 3;
        if (page !== currentPage) {
          loadSidebar(page);
        }
      }

      /* ============ 사이드바 버튼 ============ */
      menuButtonId.addEventListener("click", () => {        
        const w = window.innerWidth;
        let page;

        if(w <= 625){
          page = (currentPage === 1 ? 3 : 1);
          if(page === 1){
            aside.classList.add("mobile-open");            
          }
          else {
            aside.classList.remove("mobile-open");
          }
        }  
        else{
          if (currentPage === 1) page = 2;
          else if (currentPage === 2) page = 1;
          else page = 1; 
        }
        if (page === 1 && window.innerWidth <= 625) {
          aside.classList.add("mobile-open");
        }
        loadSidebar(page);       
      });

      /* ============ 사이드바 최초 불러오기 + resize ============ */      
      initSidebar();
      window.addEventListener("resize", initSidebar);
      });    
  }
  catch(error){
    location.href = "../html/error.html";
    alert("최상단바 불러오기 중 오류 발생");
  }

  try{
    /* ============ channel title ============ */
    async function title() {             
      const videos = await getChannelInfo(channelId); 
      
      document.title = videos.channel_name;

      const bannerImg = document.getElementById("banner-img");
      bannerImg.src = videos.channel_banner;

      const profileImg = document.getElementById("profile-img");
      profileImg.src = videos.channel_profile;
      currentChannelProfile = videos.channel_profile;

      const channelName = document.getElementById("channel-name");
      channelName.textContent = videos.channel_name; 
      currentChannelName = videos.channel_name;   

      const subscribers = document.getElementById("subscribers");
      subscribers.textContent = getSubscriber(videos.subscribers);

      // 구독 버튼
      initSubscribeButton(channelId, currentChannelName, currentChannelProfile);
    }   

     /* ============ channel smallvideo ============ */  
    async function smallvideo(videoMainDescription,views,date, linkvideoId, linkChannelId,smallmainImg){
      /* 가장 추천수가 많은 페이지 띄우기 */
      const smallVideoLink = document.getElementById("video-link");
      const mainImg = document.getElementById("main-img");
      const videoDescription = document.getElementById("video-description");
      const viewText = document.getElementById("viewText");
      const beforeDay = document.getElementById("date");
      
      smallVideoLink.href = `../html/videos.html?channel_id=${linkChannelId}&video_id=${linkvideoId}`;
      viewText.textContent = views +  " · ";
      mainImg.src = smallmainImg;      
      beforeDay.textContent = date
      videoDescription.textContent = videoMainDescription;        
    }

    /* ============ channel playlist-grid ============ */  
    async function playlist() {   

      let like = 0;  
      let videoMainDescription = ""; 
      let view = 0;  
      let date = ""; 
      let linkvideoId = 0;  
      let linkChannelId = 0; 
      let smallmainImg = "";
      
      const videos = await getChannelVideoList(channelId);     
      const Div = document.querySelector(".channel-playlist__playlist-grid");

      const chunkSize = 4;
      let currentIndex = 0;

      async function renderChunk() {
        const fragment = document.createDocumentFragment();
        const chunk = videos.slice(currentIndex, currentIndex + chunkSize);
      
        chunk.forEach((video) => {

          if(like < video.likes){
            smallmainImg = video.thumbnail;
            like = video.likes; 
            videoMainDescription = video.title;       
            view =  video.views;
            date = video.created_dt;
            linkvideoId = video.id;
            linkChannelId = video.channel_id;
          }
          const channelDiv = document.createElement("div");
          channelDiv.classList.add("card");
          channelDiv.innerHTML = `
            <a href="../html/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="channel-playlist__playlist-card">
              <div class="channel-playlist__video-preview">              
                  <img src="${video.thumbnail} " alt="썸네일" class="channel-playlist__thumb-img" />
                  <div class="channel-playlist__play-icon-overlay">▶</div>              
              </div>
              <div class="channel-playlist__playlist-text">
                <p>${video.title}</p>      
                <span>${video.views ? getViews(video.views) + " · " : "조회수가 없습니다."}</span>
                <span>${video.created_dt ? getTimeAgo(video.created_dt) : "잘못된 영상입니다."}</span>
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
        smallvideo(videoMainDescription,getViews(view),getTimeAgo(date), linkvideoId, linkChannelId,smallmainImg);
      }
      renderChunk();
    }
    title();
    playlist();        
  }
  catch(error){        
    location.href = "../html/error.html";
    alert("채널 페이지 오류");
  }   
});