document.addEventListener("DOMContentLoaded", () => {

  window.isSeraching = false;
   // 최상단바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => {

    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../top/style/header-top.css";
    document.head.appendChild(styleLink);

    document
      .getElementById("searchButton")
      .addEventListener("click", function () {
        const keyword = document.getElementById("searchInput").value;
        const inputValue = keyword.replace(/\s/g, "");
        if (keyword) {
          alert("검색어: " + inputValue);
          window.isSeraching = true;
          searchVideos(inputValue);  // 검색 실행
        } else {
          alert("검색어를 입력하세요!");
        }
      });     
  });    

  // 헤더 서브바 불러오기
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

    document.querySelectorAll(".filter-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filterValue = e.target.dataset.filter;
        window.location.href = `/filtered.html?filter=${filterValue}`;
      });
    });      
  });

  // 사이드바 불러오기
  let cuurrentPage = 1 , check = 1;
  loadHtml("aside", "../sidebar/html/aside.html",() => {
    menuButton(cuurrentPage, check);
  });   

  // 총 영상 정보 찍어주기
  async function URL() {    
    const videos = await getVideoList();  
    
    const Div = document.querySelector("section");
    const chunkSize = 4;
    let currentIndex = 0;

    async function renderChunk() {
      if(window.isSeraching) return;
      const fragment = document.createDocumentFragment();
      const chunk = videos.slice(currentIndex, currentIndex + chunkSize);

      const channelInfos = await Promise.all(
        chunk.map((video) => getChannelInfo(video.channel_id))
      );

      chunk.forEach((video, index) => {
        const { channel_name, channel_profile } = channelInfos[index];       

        const channelDiv = document.createElement("div");
        channelDiv.classList.add("card");
        channelDiv.innerHTML = `
          <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
            <img src="${video.thumbnail}" loading="lazy" />
          </a>
          <div class="card-content">
            <a href="../Channel/channel.html?id=${video.channel_id}">
              <p class="card-title">
                <img src="${channel_profile}" style="width:90px; height:90px; object-fit:cover;">
              </p>
            </a>
            <div class="card-description">
              <p class="card-text1">${video.title}</p>
              <p class="card-text2">${channel_name}</p>
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
  URL()

  /* 1315px 미만일때 */
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
