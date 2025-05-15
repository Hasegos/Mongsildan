document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');  
  window.isSearching = false;

  /* ============  최상단바 불러오기 ============ */
  try{    
      loadHtml("header", "../html/header-global.html", () => {

        let styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "../css/header-global.css";
        document.head.appendChild(styleLink); 
        const menuButtonId = document.getElementById("menuButton");

        /* ============ 상단 600px 일때 ============ */   
        topLoad600px(); 

        /* ============ 초기 검색시 ============ */
        searching();   
        
        if(searchQuery) {  
          window.isSearching = true;
          searchVideos(searchQuery);         
          history.replaceState(null, "", window.location.pathname);
        }

        const aside = document.querySelector("aside");
        let currentPage = null;      

        /* ============  사이드바 불러오기 ============ */         
        function loadSidebar(page) {

          currentPage = page;         

          document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            if (/sidebar-(collapsed|expanded)\.css$/.test(link.href)) {
              link.remove();
            }
          });
          
          if (page === 3) {
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
            if(window.innerWidth >= 625){
              aside.classList.remove("mobile-open"); 
            }
          });
        }

     /* ============  사이드바 반응형 ============ */
      function initSidebar() {
        const w = window.innerWidth;
        let page;
        if (w > 1315)      page = 1;
        else if (w > 625)  page = 2;
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
        else {       
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

  /* =========== 서브바 불러오기 =========== */
  try{    
    loadHtml(".nav", "../html/header-nav.html", () => { 
      
      let styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = "../css/header-nav.css";
      document.head.appendChild(styleLink);

      const scrollContainer = document.getElementById("scrollContainer");
      const scrollRightBtn = document.getElementById("scrollRightBtn");
      const scrollLeftBtn = document.getElementById("scrollLeftBtn");
      const filterBtn = document.getElementById("filterButton");
      const filterModal = document.getElementById("filterModal");
      const closeBtn = document.getElementById("closeFilter");
      const tabs = document.querySelectorAll(".header-nav__scroll-tab-item");

      /* =========== 토글 버튼 =========== */
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
    location.href = "../html/error.html";
    alert("헤더 서브바 불러오기 중 오류 발생");   
  }

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

      document.querySelectorAll(".header-nav__filter-option").forEach((btn) => {
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

        const now = new Date(); 
        let startDate = null;
        if(currentFilter === "today"){                    
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        }
        else if(currentFilter === "this-week"){          
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 6);
          startDate.setHours(0, 0, 0, 0);
        }
        else if(currentFilter === "this-month"){          
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
        }
        else if(currentFilter === "this-year"){          
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
        
        const uniqueChannelIds = [...new Set(
          listToRender.map(video => video.channel_id)
        )];
                
        const channelInfo = {};
        await Promise.all(
          uniqueChannelIds.map(async id => {        
            channelInfo[id] = await getChannelInfo(id);
          })
        )     
        
        chunk.forEach((video) => {
          const { channel_name, channel_profile } = channelInfo[video.channel_id];                 
          const viewsText = (video.views!= null) ? getViews(video.views) : "죄회수가 없습니다.";
          
          const dateText = (video.created_dt) ? getTimeAgo(video.created_dt) : "";

          const channelDiv = document.createElement("div");
          channelDiv.classList.add("index__card");
          channelDiv.innerHTML = `
            <a href="../html/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
              <img src="${video.thumbnail}" loading="lazy" class="index__card-img" />
            </a>
            <div class="index__card-content">
              <a href="../html/channel.html?id=${video.channel_id}">
                <p class="index__card-title">
                  <img src="${channel_profile}" style="width:90px; height:90px; object-fit:cover; border-radius:50%;">
                </p>
              </a>
              <div class="index__card-description">
                <p class="index__card-text1">${video.title}</p>
                <span class="index__card-text2">${channel_name}</span>
                <p class="index__card-text3">${viewsText} · ${dateText}</p>
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
    location.href = "../html/error.html";
    alert("총 영상 정보 찍어주기 중 오류 발생");
  } 
});