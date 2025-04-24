// URL에서 쿼리값 가져오기
function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query");
}

// 현재는 가짜 데이터로 검색 결과 출력
// 나중에 이 부분을 실제 API 호출로 교체 가능
const dummyData = [
  { title: "고양이 영상 모음", channel: "냥이TV", views: "123만회", time: "1일 전" },
  { title: "귀여운 강아지 짤", channel: "댕댕이채널", views: "59만회", time: "3일 전" },
  { title: "고양이 밈 컴필레이션", channel: "CatMemez", views: "210만회", time: "1주 전" },
  { title: "영화 리뷰 - 파묘", channel: "무비토크", views: "47만회", time: "5일 전" }
];

// 검색어 기반 필터링 및 결과 출력
function displayResults(query) {
  const resultsContainer = document.getElementById("results");

  // 🔽 실제 API를 사용하려면 아래 코드처럼 fetch()로 대체하면 됩니다.
  /*
  fetch(`https://yourapi.com/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      const filtered = data.results; // 예시: API에서 받은 결과 배열
      if (filtered.length === 0) {
        resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
      } else {
        resultsContainer.innerHTML = filtered.map(item => `
          <div class="result-item">
            <h3>${item.title}</h3>
            <p>${item.channel} · ${item.views} · ${item.time}</p>
          </div>
        `).join("");
      }
    })
    .catch(error => {
      console.error("API 요청 실패:", error);
      resultsContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    });
  return;
  */

  // 현재는 로컬 더미 데이터로 필터링
  const filtered = dummyData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
  } else {
    resultsContainer.innerHTML = filtered.map(item => `
      <div class="result-item">
        <h3>${item.title}</h3>
        <p>${item.channel} · ${item.views} · ${item.time}</p>
      </div>
    `).join("");
  }
}

// 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  const query = getSearchQuery();
  if (query) {
    displayResults(query);
  } else {
    document.getElementById("results").innerHTML = "<p>검색어가 없습니다.</p>";
  }
});
