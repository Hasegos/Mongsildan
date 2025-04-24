// 총 영상 정보
async function getVideoList() {
    const channel = await fetch(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`);       
    const channelInfo = await channel.json();  
    return channelInfo;
}
window.getVideoList = getVideoList;