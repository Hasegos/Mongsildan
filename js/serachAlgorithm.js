/* ============ 키워드에 맞는 비디오 목록 필터링  ============ */
function matchIncludes(source, query) {
    return source.toLowerCase().includes(query.toLowerCase());
}

/* ============ 병렬 요청 수 제한 유틸  ============ */
async function limitedMap(array, limit, asyncFn) {
    const results = [];
    const executing = [];
    for (const item of array) {
        const p = Promise.resolve().then(() => asyncFn(item))
        .then(result => {
            executing.splice(executing.indexOf(p), 1); 
            return result; 
        })

        results.push(p);
        executing.push(p);

        if (executing.length >= limit) {
            await Promise.race(executing);           
        }
    }
    return Promise.all(results);
}

async function searchVideos(query) {

    try{
        const videos = await getVideoList();

        if(!videos || videos.length == 0){
            alert("영상 목록 불러오는데 실패했습니다.")
            return;
        }

        // 채널 정보 캐싱
        const uniqueChannelIds = [...new Set(videos.map(video => video.channel_id))];
        const channelInfo = {};
        await Promise.all(
            uniqueChannelIds.map(async id => {                
                    const info = await getChannelInfo(id);
                    channelInfo[id] = info;                
            })
        );

        
        /* ============= 태그 유사도 캐싱 ============= */
        /*
            =======================================
                AI 유사도 계산 호출 (API키 배포 X)
            =======================================

            // const SimilarityCache = new Map();
            // async function getCachedSimilarity(text) {
            //     const key = `${query}_${text}`;
            //     if(SimilarityCache.has(key)){
            //         return SimilarityCache.get(key);
            //     }
            //     const score = await getTagSimilarity(query, text);
            //     SimilarityCache.set(key, score);
            //     return score;
            // }
        */
        const results = await limitedMap(videos, 10, async (video) => {   
        
            const { channel_name, channel_profile } = channelInfo[video.channel_id];

            if (
                matchIncludes(video.title, query) ||
                matchIncludes(channel_name, query) ||
                video.tags.some(tag => matchIncludes(tag, query))
            ) {
                return { video, score: 1 };           
            }
            else {
                return {video, score: 0};
            }

            /* ============= 태그 유사도 계산 =============  */
            /*
                =======================================
                    AI 유사도 계산 호출 (API키 배포 X)
                =======================================

                // const [titleScore, channelScore] = await Promise.all([
                //     getCachedSimilarity(video.title),
                //     getCachedSimilarity(channel_name)
                // ]);

                // // 태그 일부만 추출
                // const tagSubset = video.tags.slice(0, 2);
                // const tagScores = await Promise.all(
                //     tagSubset.map(tag => getCachedSimilarity(tag))
                // );
                // const bestTagScore = tagScores.length ? Math.max(...tagScores) : 0;

                // const avgScore = (titleScore + channelScore + bestTagScore) / 3;
                // return { video, score: avgScore };
            */
        });

        results.sort((a, b) => b.score - a.score);

        /* ============= 유사도 계산이후 0.2 이상만  ============= */
        /*
            // const filtered = results
            //     .filter(r => r.score >= 0.2)
            //     .map(r => ({
            //         ...r.video,
            //         channelInfo: channelInfo[r.video.channel_id]
            //     }));
        */

        const filtered = results 
        .filter(r => r.score > 0)           
        .map(r => ({
            ...r.video,
            channelInfo: channelInfo[r.video.channel_id]
        }));

        displayResults(filtered);
    }
    catch(error){                        
        location.reload();            
    }
}
window.searchVideos = searchVideos;

/* =========== 검색된 결과를 화면에 표시 ============ */
async function displayResults(videos) {
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
        const fragment = document.createDocumentFragment();

        chunk.forEach(video => {
            const { channel_name, channel_profile } = video.channelInfo;
            const channelDiv = document.createElement("div");
            channelDiv.classList.add("card");
            channelDiv.innerHTML = `
                <a href="../html/videos.html?channel_id=${video.channel_id}&video_id=${video.id}">
                    <img src="${video.thumbnail}" loading="lazy" class="index__card-img"/>
                </a>
                <div class="index__card-content">
                    <a href="../html/channel.html?id=${video.channel_id}">
                        <p class="index__card-title">
                            <img src="${channel_profile}" style="width:90px; height:90px; object-fit:cover;">
                        </p>
                    </a>
                    <div class="index__card-description">
                        <p class="index__card-text1">${video.title}</p>
                        <span class="index__card-text2">${channel_name}</span>
                        <span>${video.views ? getViews(video.views) + " · " : "조회수가 없습니다."}
                        ${video.created_dt ? getTimeAgo(video.created_dt) : "잘못된 영상입니다."}</span>
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