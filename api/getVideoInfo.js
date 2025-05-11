// 영상 정보
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
            alert("영상 정보를 불러오는데 실패했습니다. 새로고침해주세요.");   
            location.href = "../error/error.html";      
        }
        return null;
    }
}
window.getVideoInfo = getVideoInfo;