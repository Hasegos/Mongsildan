// 검색어에 맞는 비디오 목록 필터링
async function searchVideos(query) {
  const videos = await getVideoList();   

  // 검색어로 필터링 (채널 이름, 비디오 제목, 키워드)
  const filteredVideos = videos.filter(video => {
    return video.title.toLowerCase().includes(query.toLowerCase()) || 
           video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
  });   

  displayResults(filteredVideos);  // 필터링된 결과 출력
}
window.searchVideos = searchVideos;

// 검색된 결과를 화면에 표시
function displayResults(videos) {
  const resultsContainer = document.getElementById('card-container');        
  resultsContainer.innerHTML = ''; // 기존 결과 지우기   
  
  if (videos.length === 0) {
    resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  const chunkSize = 4;  // 한 번에 렌더링할 개수
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

// 추가: 화면 크기에 따라 search-btn + header searchButton 이동
document.addEventListener("DOMContentLoaded", () => {
  const navSearchBtn = document.querySelector(".channel-nav .search-btn"); // 네비게이션 검색 버튼
  const headerSearchBtn = document.getElementById("searchButton");          // 헤더 검색 버튼

  function handleSearchButtonPosition() {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    
    if (navSearchBtn) {
      if (isMobile) {
        navSearchBtn.style.position = "absolute";
        navSearchBtn.style.left = "10px";
        navSearchBtn.style.top = "10px";
        navSearchBtn.style.zIndex = "1000";
      } else {
        navSearchBtn.style.position = "static";
        navSearchBtn.style.left = "";
        navSearchBtn.style.top = "";
        navSearchBtn.style.zIndex = "";
      }
    }

    if (headerSearchBtn) {
      if (isMobile) {
        headerSearchBtn.style.position = "absolute";
        headerSearchBtn.style.right = "10px";
        headerSearchBtn.style.top = "10px";
        headerSearchBtn.style.zIndex = "1000";
      } else {
        headerSearchBtn.style.position = "static";
        headerSearchBtn.style.right = "";
        headerSearchBtn.style.top = "";
        headerSearchBtn.style.zIndex = "";
      }
    }
  }

  handleSearchButtonPosition();
  window.addEventListener("resize", handleSearchButtonPosition);
});
