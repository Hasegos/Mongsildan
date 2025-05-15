/* ============= AI api ============= */
async function compareTagsWithApi(firstWord, secondWord) {        

    const openApiURL = 'https://www.techfree-oreumi-api.ai.kr/WiseWWN/WordRel';    
    const access_key = "";

    const requestJson = {
        'argument': {
            'first_word': firstWord,
            'second_word': secondWord
        }
    };

    try{
        const response = await fetch(openApiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': access_key
            },
            body: JSON.stringify(requestJson)
        });
        
        if (!response.ok) {
            console.warn(`[API] 응답 실패 (${response.status}): ${firstWord}, ${secondWord}`);           
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {        
        alert("지금 API 사용하실수없는 상태입니다.")
        location.href = "../html/error.html";  
        return null;
    }
}

/* ============= 유사도 점수 계산기 ============= */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const similarityCache = new Map();

async function getTagSimilarity(tag1, tag2, retryCount = 15) {
    const [w1, w2] = [tag1, tag2].sort();
    // 중복 요청을 막기위해서 (ex '배' vs '과일' , '과일' vs '배')
    const key = `${w1}_${w2}`;
    
    if (similarityCache.has(key)) {
        return similarityCache.get(key);
    }
    try {
        const data = await compareTagsWithApi(tag1, tag2);  
        if (!data || data.result !== 0) {
            throw new Error("응답 없음");
        }   

        const distance = data?.return_object?.["WWN WordRelInfo"]?.WordRelInfo?.Distance;
        // 태그가 같은 경우
        if (tag1 === tag2) {
            similarityCache.set(key, 1);
            return 1;
        }      
        // 유사도 계산 (단 -1 즉, infinity 일경우 계산 x)
        if(typeof distance === "number" && distance >= 0){
            const similarityScore = 1 / (distance + 1);
            similarityCache.set(key, similarityScore);
            console.log(`[Distance] ${tag1} vs ${tag2} → 거리: ${distance}, 유사도: ${similarityScore.toFixed(4)}`);
            return similarityScore;          
        }    
        similarityCache.set(key, 0);
        return 0;      
    }
    // fallback, 백오프 방식으로 재시도
    catch (err) {
        if (retryCount > 0) {
            // console.warn(`[재시도] ${tag1} vs ${tag2} (${15 - retryCount + 1}회차)`);            
            await delay(500); // 실패 시에만 지연
            return await getTagSimilarity(tag1, tag2, retryCount - 1);
        }
        else {
            console.error(`[실패] ${tag1} vs ${tag2} → 최대 재시도 도달`);             
            similarityCache.set(key, 0);
            return 0;
        }
    }
}
window.getTagSimilarity = getTagSimilarity;