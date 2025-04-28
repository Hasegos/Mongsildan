// 기존 검색어에 맞는 비디오 목록 필터링
async function searchVideos(query) {
  const videos = await getVideoList();   

  const filteredVideos = videos.filter(video => {
    return video.title.toLowerCase().includes(query.toLowerCase()) || 
           video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
  });   

  displayResults(filteredVideos);  // 필터링된 결과 출력
}
window.searchVideos = searchVideos;

// 기존 검색된 결과를 화면에 표시
function displayResults(videos) {
  const resultsContainer = document.getElementById('card-container');        
  resultsContainer.innerHTML = '';

  if (videos.length === 0) {
    resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  const chunkSize = 4;  
  let currentIndex = 0;      

  async function renderChunk() {
    const chunk = videos.slice(currentIndex, currentIndex + chunkSize);

    const channelInfos = await Promise.all(
      chunk.map(v => getChannelInfo(v.channel_id))
    );

    const fragment = document.createDocumentFragment();

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

    resultsContainer.appendChild(fragment);
    currentIndex += chunkSize;

    if (currentIndex < videos.length) {
      setTimeout(renderChunk, 1);
    }
  }

  renderChunk();
}

// 추가: searchInput, searchButton 반응형 이동 + 검색창 다시 보이게
document.addEventListener("DOMContentLoaded", () => {
  const navSearchBtn = document.querySelector(".channel-nav .search-btn"); 
  const headerSearchBtn = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput"); // 검색 input

  function adjustSearchUI() {
    const isMobile = window.innerWidth <= 485;

    if (navSearchBtn) {
      navSearchBtn.style.position = isMobile ? "absolute" : "relative";
      navSearchBtn.style.left = isMobile ? "10px" : "";
      navSearchBtn.style.top = isMobile ? "10px" : "";
      navSearchBtn.style.zIndex = isMobile ? "1000" : "";
    }

    if (headerSearchBtn) {
      headerSearchBtn.style.position = isMobile ? "absolute" : "relative";
      headerSearchBtn.style.right = isMobile ? "10px" : "";
      headerSearchBtn.style.top = isMobile ? "10px" : "";
      headerSearchBtn.style.zIndex = isMobile ? "1000" : "";
    }

    if (searchInput) {
      if (isMobile) {
        if (!searchInput.classList.contains("force-visible")) {
          searchInput.style.display = "none"; // 기본 모바일 상태에서는 숨김
        }
      } else {
        searchInput.style.display = "inline-block"; // 데스크탑에서는 항상 표시
        searchInput.classList.remove("force-visible"); // 강제 표시 클래스 제거
      }
    }
  }

  // 초기 실행
  adjustSearchUI();
  // 화면 리사이즈마다 실행
  window.addEventListener("resize", adjustSearchUI);

  // searchButton 클릭 시 숨겨진 searchInput 다시 표시
  if (headerSearchBtn && searchInput) {
    headerSearchBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 버튼 submit 방지
      const isMobile = window.innerWidth <= 485;
      if (isMobile) {
        searchInput.style.display = "inline-block"; // 검색창 다시 보이게
        searchInput.classList.add("force-visible"); // 강제 보이도록 클래스 추가
      }
    });
  }
});