// 검색어에 맞는 비디오 목록 필터링
async function searchVideos(query) {
    // 비디오 목록
    const videos = await getVideoList();   
    
    // 채널 캐시 
    const channelCache = {};
    const getChannelName = async (channelId) => {
        if (!channelCache[channelId]) {
            const channelInfo = await getChannelInfo(channelId);
            channelCache[channelId] = channelInfo.channel_name;
        }
        return channelCache[channelId];
    }
    /* 비디오 내용 */
    const channelNamePromise = videos.map(video => getChannelName(video.channel_id));
    const channelNames = await Promise.all(channelNamePromise);   

    const mathchedChannelIds = [];
    channelNames.forEach((channelInfo, index) => {        
        if (channelInfo.toLowerCase() === query.toLowerCase()) {
            mathchedChannelIds.push(videos[index].channel_id);
        }
    });

    let filteredVideos;
    // 검색어로 필터링 <- 채널 이름, 비디오 제목, 키워드

    // 채널명이 완전일치
    if(mathchedChannelIds.length > 0){
        filteredVideos = videos.filter(video => mathchedChannelIds.includes(video.channel_id));
    }
    else{ // 다를 경우
        filteredVideos = videos.filter((video,index) => {                   
        // 제목
        const titleWords = video.title.replace(/\s/g,"");
        // 제목 기준
        const titleMatches = titleWords.toLowerCase().includes(query.toLowerCase());
        // 태그 기준
        const tagMatches = video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));  
        // 
        const channelNameMatches = channelNames[index].toLowerCase().includes(query.toLowerCase());
    
        // 태그와 제목 기준 포함되어있을때
        return titleMatches || tagMatches || channelNameMatches;
        });
    }
    
    displayResults(filteredVideos);  // 필터링된 결과 출력
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