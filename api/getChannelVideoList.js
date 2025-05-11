// 채널 아이디에 대한 채널 리스트
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
            alert("채널 목록 데이터를 불러오는데 실패했습니다. 새로고침해주세요.");
            location.href = "../error/error.html";
        }
        return null;
    }    
}
window.getChannelVideoList = getChannelVideoList;