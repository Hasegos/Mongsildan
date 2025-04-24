// 채널 아이디에 대한 채널 리스트
async function getChannelVideoList(channelID) {
    const channel = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${channelID}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });
    const channelInfo = await channel.json();  
    return channelInfo;
}

window.getChannelVideoList = getChannelVideoList;