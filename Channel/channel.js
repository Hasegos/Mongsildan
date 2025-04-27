document.addEventListener("DOMContentLoaded", () => {
  const params    = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id"), 10);

  // 좋아요, 타이틀, 조회수, 날짜 변수
  let like = 0, videoMainDescription, view, date;

  // ──────────────────────────────────────
  // 1) 최상단바 불러오기 & 검색창 토글 기능 설정
  // ──────────────────────────────────────
  loadHtml("header", "../top/html/header-top.html", () => {
    // 헤더 CSS 추가
    const headerstyle = document.createElement("link");
    headerstyle.rel  = "stylesheet";
    headerstyle.href = "../top/style/header-top.css";
    document.head.appendChild(headerstyle);

    // 요소 참조
    const searchInput  = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const rightGroup   = document.querySelector(".right");
    const mq           = window.matchMedia("(max-width: 600px)");
    let isExpanded     = true; // 큰 화면이거나 한번이라도 펼쳐진 상태

    // 원래 너비와 패딩 저장
    const origWidth   = `${searchInput.getBoundingClientRect().width}px`;
    const origPadding = getComputedStyle(searchInput).padding;

    // 트랜지션 추가
    searchInput.style.transition   = "width 0.2s ease, padding 0.2s ease, opacity 0.2s ease";
    rightGroup.style.transition    = "transform 0.2s ease";
    searchButton.style.transition  = "transform 0.2s ease";

    // 검색창 접기 함수
    function collapseSearch() {
      searchInput.style.width   = "0";
      searchInput.style.padding = "0";
      searchInput.style.opacity = "0";
      const shift = `-${origWidth}`;
      rightGroup.style.transform  = `translateX(${shift})`;
      searchButton.style.transform = `translateX(${shift})`;
      isExpanded = false;
    }

    // 검색창 펼치기 함수
    function expandSearch() {
      searchInput.style.width   = origWidth;
      searchInput.style.padding = origPadding;
      searchInput.style.opacity = "1";
      rightGroup.style.transform  = "translateX(0)";
      searchButton.style.transform = "translateX(0)";
      isExpanded = true;
      searchInput.focus();
    }

    // 화면 크기 변화 시 자동 적용
    function updateSearchVisibility() {
      if (mq.matches) {
        // 모바일: 기본은 접힌 상태
        if (!isExpanded) collapseSearch();
        else             collapseSearch(), isExpanded = false; // 접힌 상태 유지
      } else {
        // 데스크탑: 항상 펼쳐둠
        expandSearch();
      }
    }

    // 초기화 & 리스너
    updateSearchVisibility();
    if (mq.addEventListener) mq.addEventListener("change", updateSearchVisibility);
    else mq.addListener(updateSearchVisibility);

    // 돋보기 클릭 시
    searchButton.addEventListener("click", e => {
      if (mq.matches) {
        e.preventDefault();
        if (isExpanded) collapseSearch();
        else            expandSearch();
      } else {
        // 큰 화면: 기존 검색 로직
        const keyword = searchInput.value.trim();
        if (keyword) alert("검색어: " + keyword);
        else         alert("검색어를 입력하세요!");
      }
    });
  });

  // ──────────────────────────────────────
  // 2) 사이드바 불러오기
  // ──────────────────────────────────────
  let currentPage = 1, check = 1;
  loadHtml("aside", "../sidebar/html/aside.html", () => {
    menuButton(currentPage, check);
    handleResponsiveSidebar();
  });

  /* channel-title */
  loadHtml(".header", "./html/channel-title.html", () => {
    const channelTitle = document.createElement("link");
    channelTitle.rel  = "stylesheet";
    channelTitle.href = "./styles/channel-title.css";
    document.head.appendChild(channelTitle);

    const subscribeBtn = document.getElementById("subscribe-btn");
    let subscribed = false;
    subscribeBtn.addEventListener("click", () => {
      subscribed = !subscribed;
      subscribeBtn.textContent = subscribed ? "SUBSCRIBED" : "SUBSCRIBES";
      subscribeBtn.style.backgroundColor = subscribed ? "gray" : "red";
    });
  });

  /* channel-smallvideo */
  loadHtml(".main", "./html/channel-smallvideo.html", () => {
    const smallvideo = document.createElement("link");
    smallvideo.rel  = "stylesheet";
    smallvideo.href = "./styles/channel-smallvideo.css";
    document.head.appendChild(smallvideo);

    const video   = document.getElementById("main-video");
    const playBtn = document.getElementById("play-button");
    playBtn.addEventListener("click", () => {
      video.play();
      playBtn.style.display    = "none";
      video.setAttribute("controls", true);
    });
  });

  /* channel-playlist */
  loadHtml(".footer", "./html/channel-playlist.html", () => {
    const playlist = document.createElement("link");
    playlist.rel  = "stylesheet";
    playlist.href = "./styles/channel-playlist.css";
    document.head.appendChild(playlist);

    const subscribeBtn = document.getElementById("subscribe-btn");
    let subscribed = false;
    subscribeBtn.addEventListener("click", () => {
      subscribed = !subscribed;
      subscribeBtn.textContent = subscribed ? "SUBSCRIBED" : "SUBSCRIBES";
      subscribeBtn.style.backgroundColor = subscribed ? "gray" : "red";
    });
  });

  /* 채널 정보 세팅 */
  async function title() {
    const videos = await getChannelInfo(channelId);
    document.getElementById("banner-img").src     = videos.channel_banner;
    document.getElementById("profile-img").src    = videos.channel_profile;
    document.getElementById("channel-name").textContent = videos.channel_name;
    document.getElementById("subscribers").textContent = getSubscriber(videos.subscribers);
  }

  /* 대표 영상 세팅 */
  async function smallvideo(like, videoMainDescription, views, date) {
    document.getElementById("main-img").src           = like;
    document.getElementById("video-description").textContent = videoMainDescription;
    document.getElementById("viewText").textContent           = views;
    document.getElementById("date").textContent               = getTimeAgo(date);
  }

  /* 채널 내 재생목록 세팅 */
  async function playlist() {
    const videos    = await getChannelVideoList(channelId);
    const grid      = document.querySelector(".playlist-grid");
    const chunkSize = 4;
    let idx = 0;
    let like = 0, videoMainDescription, view, date;

    async function renderChunk() {
      const frag = document.createDocumentFragment();
      videos.slice(idx, idx + chunkSize).forEach(video => {
        if (like < video.likes) {
          like = video.thumbnail;
          videoMainDescription = video.title;
          view = video.views;
          date = video.created_dt;
        }
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
          <a href="#" class="playlist-card" target="_blank">
            <div class="video-preview">
              <img src="${video.thumbnail}" class="thumb-img"/>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="playlist-text"><p>${video.title}</p></div>
          </a>`;
        frag.appendChild(div);
      });
      grid.appendChild(frag);
      idx += chunkSize;
      if (idx < videos.length) setTimeout(renderChunk, 1);
      else smallvideo(like, videoMainDescription, view, date);
    }

    renderChunk();
  }

  playlist();
  title();

  /* === 사이드바 토글 & 반응형 === */
  function switchSidebar(state) {
    const sidebar     = document.getElementById("sidebar");
    const mainWrapper = document.querySelector(".main-wrapper");
    if (!sidebar || !mainWrapper) return;
    if (state === 1) {
      sidebar.classList.remove("collapsed");
      mainWrapper.classList.remove("collapsed");
    } else {
      sidebar.classList.add("collapsed");
      mainWrapper.classList.add("collapsed");
    }
  }

  let currentSidebarPage = null;
  function handleResponsiveSidebar() {
    const mq2 = window.matchMedia("(max-width: 1315px)");
    if (mq2.matches && currentSidebarPage !== 2) {
      switchSidebar(2);
      currentSidebarPage = 2;
    } else if (!mq2.matches && currentSidebarPage !== 1) {
      switchSidebar(1);
      currentSidebarPage = 1;
    }
  }

  handleResponsiveSidebar();
  window.addEventListener("resize", handleResponsiveSidebar);
});
