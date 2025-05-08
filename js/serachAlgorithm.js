// 키워드에 맞는 비디오 목록 필터링
function matchIncludes(source, query) {
    return source.toLowerCase().includes(query.toLowerCase());
}
async function searchVideos(query) {
    // 전체목록
    const videos = await getVideoList();

    // 채널명 캐시
    const channelCache = {};
    const getChannelName = async (channelId) => {
        if (!channelCache[channelId]) {
            const channelInfo = await getChannelInfo(channelId);
            channelCache[channelId] = channelInfo.channel_name;
        }
        return channelCache[channelId];
    };

    // 채널명 병렬 로딩
    const channelNames = await Promise.all(
        videos.map(video => getChannelName(video.channel_id))
    );
    // 검색 결과
    const results = [];  

    // 검색어로 필터링
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const channelName = channelNames[i];   
        const queryLower = query.toLowerCase();    

        // 특정 단어가 포함된경우
        if (
            matchIncludes(video.title, query) ||
            matchIncludes(channelName, query) ||
            video.tags.some(tag => matchIncludes(tag, query))
        ) {
            // 유사도 1
            results.push({ video, score: 1 }); 
            continue;
        }
        // 특정 단어 포함 X , 유사도 계산 
        const scores = [];

        // 제목 유사도
        const titleScore = await getTagSimilarity(query, video.title);
        scores.push(titleScore);

        // 채널명 유사도
        const channelScore = await getTagSimilarity(query, channelName);
        scores.push(channelScore);

        // 태그 중 최고 유사도
        let bestTagScore = 0;
        for (let tag of video.tags) {
            const score = await getTagSimilarity(query, tag);
            if (score > bestTagScore) bestTagScore = score;
        }
        scores.push(bestTagScore);

        // 평균 유사도 계산 (모든 점수를 더하고 더한 개수만큼 나누기)        
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        results.push({ video, score: avgScore });
    }

    // 유사도 높은 순 오름차순 정렬
    results.sort((a, b) => b.score - a.score);

    // 일정 기준 이상만 필터링 (유사도 0.2 이상)
    const filtered = results.filter(r => r.score >= 0.2).map(r => r.video);    
    displayResults(filtered);
}
window.searchVideos = searchVideos;

// 검색된 결과를 화면에 표시
async function displayResults(videos) {
    const resultsContainer = document.getElementById('card-container');        
    resultsContainer.innerHTML = ''; // 기존 결과 지우기   
    
    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return
    }
    const chunkSize = 4;  // 한 번에 렌더링할 개수
    let currentIndex = 0;      
    
    async function renderChunk() {
    // 현재 인덱스부터 chunkSize만큼 슬라이스
        const chunk = videos.slice(currentIndex, currentIndex + chunkSize);

        // 채널 정보 병렬 가져오기
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
            `;
            fragment.appendChild(channelDiv);
        });

        resultsContainer.appendChild(fragment);
        currentIndex += chunkSize;
        
        if (currentIndex < videos.length) {
            setTimeout(renderChunk, 1);
        }
    }
    // 청크 로딩 시작
    renderChunk();    
}