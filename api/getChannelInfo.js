// 채널 아이디에 해당 내용
async function getChannelInfo(channelID) {
    try {
        const channel = await fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelID}`, {
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
            alert("채널 정보를 불러오는데 실패했습니다. 새로고침해주세요.");       
            location.href = "../error/error.html";     
        }
        return null;
    }
}
window.getChannelInfo = getChannelInfo;