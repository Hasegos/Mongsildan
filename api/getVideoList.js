// 총 영상 정보
async function getVideoList() {
    try{
        const videoList = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`);  
        
        if(!videoList.ok){
            throw new Error(`HTTP 오류 ${videoList.status}`);
        }

        const videoListInfo = await videoList.json();  
        return videoListInfo;
    }
    catch(error){
        if(!window.location.href.includes("error.html")){
            alert("비디오 목록 데이터를 불러오는데 실패했습니다. 새로고침해주세요");
            location.href = "../error/error.html";            
        }        
        return null;
    }
}
window.getVideoList = getVideoList;