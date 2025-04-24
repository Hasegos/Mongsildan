// 영상 정보
async function getVideoInfo(channelID) {
    const channel = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${channelID}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });
    const channelInfo = await channel.json();  
    return channelInfo;
}

window.getVideoInfo = getVideoInfo;