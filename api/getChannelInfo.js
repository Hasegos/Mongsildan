// 채널 아이디에 해당 내용
async function getChannelInfo(channelID) {
    const channel = await fetch(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelID}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });
    const channelInfo = await channel.json();  
    return channelInfo;
}

window.getChannelInfo = getChannelInfo;