document.addEventListener("DOMContentLoaded", () => {    

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id"));   
  let menuButtonId = "";

  // 최상단바 불러오기
  try{ 
    loadHtml("header", "../top/html/header-top.html", () => {  
      let headerstyle = document.createElement("link");
      headerstyle.rel = "stylesheet";
      headerstyle.href = "../top/style/header-top.css";
      document.head.appendChild(headerstyle); 
      menuButtonId = document.getElementById("menuButton");

      /* 상단 600px 일때 */   
      topLoad600px(); 
      /* 초기 검색시 */
      searching();      
      
      
            // 사이드바 불러오기
      let cuurrentPage = 1 , check = 3;
      try{
        loadHtml("aside", "../sidebar/html/aside.html",() => {      
          const aside = document.querySelector("aside");    
          
          renderSavedSubscriptions(aside);
          if(window.innerWidth > 625){
            aside.classList.remove("mobile-open");
          }
          
          menuButton(cuurrentPage,check,aside,menuButtonId);
          window.addEventListener("resize", () => {
            if (window.innerWidth > 625) {
              aside.classList.remove("mobile-open");
            }
          })      
        }); 
      }
      catch(error){
        location.href = "../error/error.html";
        alert("사이드바 불러오기 중 오류 발생");
      }
    }); 
  }    
  catch(error){
    location.href = "../error/error.html";
    alert("최상단바 불러오기 중 오류 발생");
  }



 /* title */
  try{
    async function title() {       
      const aside = document.querySelector("aside");
      const videos = await getChannelInfo(channelId);        

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
      initSubscribeButton(channelId, currentChannelName, currentChannelProfile,aside);
    }   

  /* smallVideo */  
    async function smallvideo(videoMainDescription,views,date, linkvideoId, linkChannelId,smallmainImg){
        /* 가장 추천수가 많은 페이지 띄우기 */
        const smallVideoLink = document.getElementById("video-link");
        const mainImg = document.getElementById("main-img");
        const videoDescription = document.getElementById("video-description");
        const viewText = document.getElementById("viewText");
        const beforeDay = document.getElementById("date");
        
        smallVideoLink.href = `../videos/videos.html?channel_id=${linkChannelId}&video_id=${linkvideoId}`;
        viewText.textContent = views +  " · ";
        mainImg.src = smallmainImg;      
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
      let smallmainImg = "";
      
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
            <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="playlist-card">
              <div class="video-preview">              
                  <img src="${video.thumbnail} " alt="썸네일" class="thumb-img" />
                  <div class="play-icon-overlay">▶</div>              
              </div>
              <div class="playlist-text">
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
        // smallvideo
        smallvideo(videoMainDescription,getViews(view),getTimeAgo(date), linkvideoId, linkChannelId,smallmainImg);
      }
      renderChunk();
    }
    playlist();    
    title();
  }
  catch(error){        
    location.href = "../error/error.html";
    alert("채널 페이지 오류");
  } 


  /* 구독 버튼 */
  

    /* 1315px 미만 반응형 */
  try{  
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
  }
  catch(error){
    location.reload();
    alert("1315px 미만 반응형 중 오류 발생");
  }  
});