document.addEventListener("DOMContentLoaded", () => {
  const params    = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("id"), 10);

  // 1) 헤더 로드 + 검색창 토글 설정
  loadHtml("header", "../top/html/header-top.html", () => {
    const headerstyle    = document.createElement("link");
    headerstyle.rel      = "stylesheet";
    headerstyle.href     = "../top/style/header-top.css";
    document.head.appendChild(headerstyle);

    const searchInput     = document.getElementById("searchInput");
    const headerSearchBtn = document.getElementById("searchButton");
    const rightGroup      = document.querySelector(".right");
    const mq              = window.matchMedia("(max-width:600px)");
    let isExpanded        = false;
    const origW           = `${searchInput.getBoundingClientRect().width}px`;
    const origP           = getComputedStyle(searchInput).padding;

    searchInput.style.transition     = "width 0.2s ease,padding 0.2s ease,opacity 0.2s ease";
    rightGroup.style.transition      = "transform 0.2s ease";
    headerSearchBtn.style.transition = "transform 0.2s ease";

    function collapseSearch() {
      searchInput.style.width   = "0";
      searchInput.style.padding = "0";
      searchInput.style.opacity = "0";
      const shift = `-${origW}`;
      rightGroup.style.transform      = `translateX(${shift})`;
      headerSearchBtn.style.transform = `translateX(${shift})`;
      isExpanded = false;
    }
    function expandSearch() {
      searchInput.style.width   = origW;
      searchInput.style.padding = origP;
      searchInput.style.opacity = "1";
      rightGroup.style.transform      = "translateX(0)";
      headerSearchBtn.style.transform = "translateX(0)";
      isExpanded = true;
      searchInput.focus();
    }
    // 전역으로 보관
    window.expandSearch = expandSearch;

    function update() {
      if (mq.matches) collapseSearch();
      else            expandSearch();
    }
    update();
    mq.addEventListener
      ? mq.addEventListener("change", update)
      : mq.addListener(update);

    headerSearchBtn.addEventListener("click", e => {
      if (mq.matches) {
        e.preventDefault();
        isExpanded ? collapseSearch() : expandSearch();
      } else {
        const kw = searchInput.value.trim();
        if (kw) alert("검색어: " + kw);
        else   alert("검색어를 입력하세요!");
      }
    });
  });

  // 2) 사이드바
  loadHtml("aside", "../sidebar/html/aside.html", () => {
    menuButton(1,1);
    handleResponsiveSidebar();
  });

  // 3) 채널 헤더(네비)
  loadHtml(".channel-header", "./html/channel-title.html", () => {
    const channelCss = document.createElement("link");
    channelCss.rel  = "stylesheet";
    channelCss.href = "./styles/channel-title.css";
    document.head.appendChild(channelCss);

    const subBtn = document.getElementById("subscribe-btn");
    let sub = false;
    subBtn.addEventListener("click", () => {
      sub = !sub;
      subBtn.textContent = sub ? "SUBSCRIBED" : "SUBSCRIBES";
      subBtn.style.backgroundColor = sub ? "gray" : "red";
    });
  });

  // 4) 소형 비디오
  loadHtml(".main", "./html/channel-smallvideo.html", () => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "./styles/channel-smallvideo.css";
    document.head.appendChild(l);

    const v = document.getElementById("main-video");
    const b = document.getElementById("play-button");
    b.addEventListener("click", () => {
      v.play();
      b.style.display = "none";
      v.setAttribute("controls", true);
    });
  });

  // 5) 플레이리스트
  loadHtml(".footer", "./html/channel-playlist.html", () => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "./styles/channel-playlist.css";
    document.head.appendChild(l);

    const subBtn = document.getElementById("subscribe-btn");
    let sub = false;
    subBtn.addEventListener("click", () => {
      sub = !sub;
      subBtn.textContent = sub ? "SUBSCRIBED" : "SUBSCRIBES";
      subBtn.style.backgroundColor = sub ? "gray" : "red";
    });
  });

  // 6) 채널 정보 세팅
  async function title() {
    const c = await getChannelInfo(channelId);
    document.getElementById("banner-img").src            = c.channel_banner;
    document.getElementById("profile-img").src           = c.channel_profile;
    document.getElementById("channel-name").textContent  = c.channel_name;
    document.getElementById("subscribers").textContent   = getSubscriber(c.subscribers);
  }

  // 7) 대표 영상 세팅
  async function smallvideo(l,d,v,dt) {
    document.getElementById("main-img").src              = l;
    document.getElementById("video-description").textContent = d;
    document.getElementById("viewText").textContent          = v;
    document.getElementById("date").textContent              = getTimeAgo(dt);
  }

  // 8) 재생목록 세팅
  async function playlist() {
    const vids = await getChannelVideoList(channelId);
    const grid = document.querySelector(".playlist-grid");
    let idx = 0;
    let best = { thumb:0, desc:"", views:0, dt:"" };

    async function render() {
      const frag = document.createDocumentFragment();
      vids.slice(idx, idx+4).forEach(x => {
        if (x.views > best.views) {
          best = { thumb:x.thumbnail, desc:x.title, views:x.views, dt:x.created_dt };
        }
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
          <a href="#" class="playlist-card">
            <div class="video-preview">
              <img src="${x.thumbnail}" class="thumb-img"/>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="playlist-text"><p>${x.title}</p></div>
          </a>`;
        frag.appendChild(div);
      });
      grid.appendChild(frag);
      idx += 4;
      if (idx < vids.length) setTimeout(render, 1);
      else smallvideo(best.thumb, best.desc, best.views, best.dt);
    }
    render();
  }

  playlist();
  title();

  // 9) 네비 돋보기 → 헤더 돋보기 호출 (맨 끝에)
  const navSearch = document.querySelector(".search-item .search-btn");
  const headerBtn = document.getElementById("searchButton");
  if (navSearch && headerBtn) {
    navSearch.addEventListener("click", e => {
      e.preventDefault();
      headerBtn.click();
    });
  }

  // 10) 사이드바 반응형
  function switchSidebar(s) {
    const sb = document.getElementById("sidebar"),
          mw = document.querySelector(".main-wrapper");
    if (!sb||!mw) return;
    sb.classList.toggle("collapsed", s!==1);
    mw.classList.toggle("collapsed", s!==1);
  }
  let cur = null;
  function handleResponsiveSidebar() {
    const m2 = window.matchMedia("(max-width:1315px)");
    if (m2.matches && cur!==2) { switchSidebar(2); cur=2; }
    else if (!m2.matches && cur!==1) { switchSidebar(1); cur=1; }
  }
  handleResponsiveSidebar();
  window.addEventListener("resize", handleResponsiveSidebar);
});

document.addEventListener("DOMContentLoaded", () => {
  // ... (앞에 있던 기존 코드들 생략) ...

  // 9) 사이드바 반응형 (기존 코드)
  function switchSidebar(s) {
    const sb = document.getElementById("sidebar");
    const mw = document.querySelector(".main-wrapper");
    if (!sb || !mw) return;
    sb.classList.toggle("collapsed", s !== 1);
    mw.classList.toggle("collapsed", s !== 1);
  }
  let cur = null;
  function handleResponsiveSidebar() {
    const m2 = window.matchMedia("(max-width:1315px)");
    if (m2.matches && cur !== 2) { switchSidebar(2); cur = 2; }
    else if (!m2.matches && cur !== 1) { switchSidebar(1); cur = 1; }
  }
  handleResponsiveSidebar();
  window.addEventListener("resize", handleResponsiveSidebar);

  // ★ 추가: 네비게이션 돋보기도 헤더 돋보기 트리거
  document.body.addEventListener("click", e => {
    // channel-nav 내부의 .search-btn 클릭 시
    const navBtn = e.target.closest(".channel-nav .search-btn");
    if (navBtn) {
      e.preventDefault();
      // 헤더 돋보기 버튼 클릭 이벤트 강제 발생
      const headerBtn = document.getElementById("searchButton");
      if (headerBtn) headerBtn.click();
    }
  });
});
