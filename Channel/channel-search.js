// 총 영상 정보
async function getVideoList() {
    try {
        const response = await fetch('http://techfree-oreumi-api.kro.kr:5000/video/getVideoList');
        if (!response.ok) {
            throw new Error('Failed to fetch video list');
        }
        const videos = await response.json();
        return videos;
    } catch (error) {
        console.error('Error fetching videos:', error);
        alert('비디오 목록을 불러오는 데 실패했습니다.');
        return [];
    }
}

// 검색어에 맞는 비디오 목록 필터링
async function searchVideos(query) {
    const videos = await getVideoList();

    // 검색어로 필터링
    const filteredVideos = videos.filter(video => {
        return video.title.toLowerCase().includes(query.toLowerCase()) || 
               video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    });

    displayResults(filteredVideos);  // 필터링된 결과 출력
}

// 검색된 결과를 화면에 표시
function displayResults(videos) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // 기존 결과 지우기

    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
    } else {
        videos.forEach(video => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result-card');

            resultElement.innerHTML = `
                <div class="result-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" />
                </div>
                <div class="result-info">
                    <h3><a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">${video.title}</a></h3>
                    <p>${video.tags.join(', ')}</p>
                    <p>조회수: ${video.views} | 좋아요: ${video.likes}</p>
                </div>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }
}

// 검색 버튼 클릭 시 실행
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (query) {
        document.getElementById('searchQuery').innerText = query;  // 검색어 표시
        searchVideos(query);  // 검색 실행
    } else {
        alert("검색어를 입력하세요!");
    }
});

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', () => {
    const query = new URLSearchParams(window.location.search).get('query');
    if (query) {
        document.getElementById('searchQuery').innerText = query;
        searchVideos(query);  // 검색 결과 로딩
    }

    // 헤더와 서브헤더 동적 불러오기
    loadHtml("#header-top-container", "../top/html/header-top.html");
    loadHtml("#header-sub-container", "../top/html/header-sub.html");

    // 사이드바 동적 불러오기
    loadHtml("#sidebar", "../sidebar/html/aside.html", () => {
        menuButton(1, 1); // 사이드바 메뉴 활성화
    });

    // 필터 버튼 및 모달
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const closeFilterButton = document.getElementById('closeFilter');

    // 필터 버튼 클릭 시 모달 열기
    filterButton.addEventListener('click', function () {
        filterModal.classList.add('show');  // 모달 열기
    });

    // 모달 닫기 버튼 클릭 시 모달 닫기
    closeFilterButton.addEventListener('click', function () {
        filterModal.classList.remove('show');  // 모달 닫기
    });

    // 모달 외부 클릭 시 모달 닫기
    document.addEventListener('click', function (event) {
        if (!filterModal.contains(event.target) && !filterButton.contains(event.target)) {
            filterModal.classList.remove('show');  // 모달 닫기
        }
    });
});

// 외부 HTML 파일을 불러오는 함수
function loadHtml(selector, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector(selector).innerHTML = html;
            if (callback) callback();
        })
        .catch(err => {
            console.warn('Failed to load HTML:', err);
        });
}