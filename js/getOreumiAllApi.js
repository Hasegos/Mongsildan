/* ============ 채널 아이디에 해당 내용 ============ */
async function getChannelInfo(channelID) {
    try {
        const channel = await fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channelID}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        });

        if(!channel.ok){
            throw new Error(`HTTP 오류 ${channel.status}`);
        }

        const channelInfo = await channel.json();  
        return channelInfo;
    }
    catch(error){        
        if(!window.location.href.includes("error.html")){                      
            location.href = "../html/error.html";      
        }
        return null;
    }
}

/* ============ 채널 아이디에 대한 채널 리스트 ============ */
async function getChannelVideoList(channelID) {
    try{
        const channel = await fetch(`https://www.techfree-oreumi-api.ai.kr/video/getChannelVideoList?channel_id=${channelID}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        });

        if(!channel.ok){
            throw new Error(`HTTP 오류 ${channel.status}`);
        }
        const channelInfo = await channel.json();  
        return channelInfo;
    }
    catch(error){        
        if(!window.location.href.includes("error.html")){            
            location.href = "../html/error.html";      
        }
        return null;
    }    
}

/* ============ 영상 정보 ============ */
async function getVideoInfo(videoID) {
    try{
        const video = await fetch(`https://www.techfree-oreumi-api.ai.kr/video/getVideoInfo?video_id=${videoID}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        });

        if(!video.status){
            throw new Error(`HTTP 오류 ${video.status}`);
        }

        const videoInfo = await video.json();  
        return videoInfo;
    }
    catch(error){        
        if(!window.location.href.includes("error.html")){                      
            location.href = "../html/error.html";      
        }
        return null;
    }
}

/* ============ 총 영상 정보 ============ */
async function getVideoList() {
    try{
        const videoList = await fetch(`https://www.techfree-oreumi-api.ai.kr/video/getVideoList`);  
        
        if(!videoList.ok){
            throw new Error(`HTTP 오류 ${videoList.status}`);
        }

        const videoListInfo = await videoList.json();  
        return videoListInfo;
    }
    catch(error){
        if(!window.location.href.includes("error.html")){                      
            location.href = "../html/error.html";      
        }        
        return null;
    }
}

window.getChannelInfo = getChannelInfo;
window.getChannelVideoList = getChannelVideoList;
window.getVideoInfo = getVideoInfo;
window.getVideoList = getVideoList;