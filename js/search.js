document.getElementById('searchButton').addEventListener('click', searchLocalVideos);
document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // 폼 전송 방지
    searchLocalVideos();
  }
});

async function searchLocalVideos() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) return;

  const videoList = await getVideoList(); // 오르미 API 사용
  const filteredVideos = videoList.filter(video =>
    video.title.toLowerCase().includes(query)
  );

  displayResults(filteredVideos);
}

function displayResults(videos) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (videos.length === 0) {
    resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  videos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.innerHTML = `
      <a href="video.html?video_id=${video.video_id}">
        <img src="${video.thumbnail}" alt="${video.title}">
        <h3>${video.title}</h3>
      </a>
    `;
    resultsContainer.appendChild(videoElement);
  });
}
