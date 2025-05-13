document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');

  window.isSearching = false;


   // 총 영상 정보 찍어주기
  try{    
    async function loadVideos() {    
      const videos = await getVideoList();  

      // 필터 업로드날짜 기준
      let currentFilter = null;    
      const allowed = new Set(['today', 'this-week', 'this-month', 'this-year']);
      
      const Div = document.querySelector("section");
      const chunkSize = 4;
      let currentIndex = 0; 

      document.querySelectorAll(".filter-option").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const f = e.currentTarget.dataset.filter; // 걸래내기위해
          if(!allowed.has(f)) return; // 업로드날짜 아니면 거르기

          currentFilter = f;
          currentIndex = 0;
          Div.innerHTML = "";
          renderChunk();
        });
      });

      async function renderChunk() {
        if(window.isSearching) return;

        const now = new Date(); // 오늘 날짜
        let startDate = null;
        if(currentFilter === "today"){          
          // 오늘 날짜
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        }
        else if(currentFilter === "this-week"){
          // 일주일 전
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 6);
          startDate.setHours(0, 0, 0, 0);
        }
        else if(currentFilter === "this-month"){
          // 한달전
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
        }
        else if(currentFilter === "this-year"){
          // 1년전
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 365);
          startDate.setHours(0, 0, 0, 0);          
        }        

        let listToRender = videos;
        if(startDate){
          listToRender = videos.filter((video) => {            
            const videoDate = new Date(video.created_dt);
            return videoDate >= startDate && videoDate <= now;
          });
        }      

        if(startDate && listToRender.length === 0){
          Div.innerHTML = '<p>해당 기간에 업로드된 영상이 없습니다.</p>';
          return;
        }

        const fragment = document.createDocumentFragment();
        const chunk = listToRender.slice(currentIndex, currentIndex + chunkSize);          

        // 채널 아이디만 미리 뽑기
        const uniqueChannelIds = [...new Set(
          listToRender.map(video => video.channel_id)
        )];
        
        // 채널 정보 가져오기
        const channelInfo = {};
        await Promise.all(
          uniqueChannelIds.map(async id => {        
            channelInfo[id] = await getChannelInfo(id);
          })
        )     
        
        chunk.forEach((video) => {
          const { channel_name, channel_profile } = channelInfo[video.channel_id];       
          // 조회수
          const viewsText = (video.views!= null) ? getViews(video.views) : "죄회수가 없습니다.";
          // 업로드 날짜
          const dateText = (video.created_dt) ? getTimeAgo(video.created_dt) : "";

          const channelDiv = document.createElement("div");
          channelDiv.classList.add("card");
          channelDiv.innerHTML = `
            <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
              <img src="${video.thumbnail}" loading="lazy" class="card-image" />
            </a>
            <div class="card-content">
              <a href="../Channel/channel.html?id=${video.channel_id}">
                <p class="card-title">
                  <img src="${channel_profile}" style="width:90px; height:90px; object-fit:cover; border-radius:50%;">
                </p>
              </a>
              <div class="card-description">
                <p class="card-text1">${video.title}</p>
                <span class="card-text2">${channel_name}</span>
                <p class="card-text3">${viewsText} · ${dateText}</p>
              </div>
            </div>
          `;
          fragment.appendChild(channelDiv);
        });

        Div.appendChild(fragment);
        currentIndex += chunkSize;
        if (currentIndex < videos.length) {
          setTimeout(renderChunk, 1);
        }
      }
      renderChunk();
    }
    
    window.loadVideos = loadVideos;
  }
  catch(error){    
    location.href = "../error/error.html";
    alert("총 영상 정보 찍어주기 중 오류 발생");
  }

  // 최상단바 불러오기
  try{    
      loadHtml("header", "../top/html/header-top.html", () => {

      let styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = "../top/style/header-top.css";
      document.head.appendChild(styleLink); 

      /* 상단 600px 일때 */   
      topLoad600px(); 
      /* 초기 검색시 */
      searching();   
      
      if(searchQuery) {  
        window.isSearching = true;
        searchVideos(searchQuery);         
        history.replaceState(null, "", window.location.pathname);
      }
    });
  }
  catch(error){
    location.href = "../error/error.html";
    alert("최상단바 불러오기 중 오류 발생");   
  }

  // 헤더 서브바 불러오기
  try{    
    loadHtml(".nav", "../top/html/header-sub.html", () => { 

      // 헤더 서브 css 불러오기
      let styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = "../top/style/header-sub.css";
      document.head.appendChild(styleLink);

      const scrollContainer = document.getElementById("scrollContainer");
      const scrollRightBtn = document.getElementById("scrollRightBtn");
      const scrollLeftBtn = document.getElementById("scrollLeftBtn");
      const filterBtn = document.getElementById("filterButton");
      const filterModal = document.getElementById("filterModal");
      const closeBtn = document.getElementById("closeFilter");
      const tabs = document.querySelectorAll(".tab-item");


      // 토글 버튼
      function toggleScrollButtons() {
        const scrollLeft = scrollContainer.scrollLeft;
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        let isScrolled = scrollLeft > 0
        scrollLeftBtn.style.display = isScrolled ? "flex" : "none";      

        scrollRightBtn.style.display = scrollLeft < maxScroll - 1 ? "flex" : "none";      
      }

      scrollContainer.addEventListener("scroll", toggleScrollButtons);
      window.addEventListener("resize", toggleScrollButtons);
      toggleScrollButtons();

      scrollRightBtn.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
      });

      scrollLeftBtn.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
      });

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const category = tab.getAttribute("data-category");
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          window.location.href = `/filtered.html?tag=${category}`;
        });
      });

      filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        filterModal.classList.toggle("show");
      });

      closeBtn.addEventListener("click", () => {
        filterModal.classList.remove("show");
      });

      document.addEventListener("click", (e) => {
        if (!filterModal.contains(e.target) && !filterBtn.contains(e.target)) {
          filterModal.classList.remove("show");
        }
      });     
      loadVideos()
    });
    
  }
  catch(error){
    location.href = "../error/error.html";
    alert("헤더 서브바 불러오기 중 오류 발생");   
  }
  // 사이드바 불러오기
  try{    
    let cuurrentPage = 1 , check = 1;
    loadHtml("aside", "../sidebar/html/aside.html",() => {
      const aside = document.querySelector("aside");
      renderSavedSubscriptions(aside);
      
      if(window.innerWidth > 625){
        aside.classList.remove("mobile-open");
      }
    
      menuButton(cuurrentPage,check);
      window.addEventListener("resize", () => {
        if (window.innerWidth > 625) {
          aside.classList.remove("mobile-open");
        }
      });    
    });   
  }
  catch(error){
    location.href = "../error/error.html";
    alert("사이드바 불러오기 중 오류 발생");
  }

 

  /* 1315px 미만 반응형 */
  try{    
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
  }
  catch(error){
    location.reload();
    alert("1315px 미만 반응형 중 오류 발생");
  }
});

