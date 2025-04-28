document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));

  // 상단 바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => { 
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../top/style/header-top.css";
    document.head.appendChild(styleLink);   
      // 검색기능
      document.getElementById("searchButton")
      .addEventListener("click", function () {
        const keyword = document.getElementById("searchInput").value.trim();
        if (keyword) {
          alert("검색어: " + keyword);
        } else {
          alert("검색어를 입력하세요!");
        }
      });
  });  
  
  // 사이드바 불러오기
  let cuurrentPage = 3 , check = 2;
  loadHtml("aside", "../sidebar/html/aside.html",() => {
    const aside = document.querySelector("aside");    
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../sidebar/style/aside.css";
    document.head.appendChild(styleLink);    

    // 초기에 안보이게 설정
    aside.style.display = "none";     
    menuButton(cuurrentPage, check);
  });  

  // 비디오 내용 불러오기
  async function video() {   
    
    const videos = await getVideoInfo(videoId);     
    const channel = await getChannelInfo(channelId);

    const video = document.getElementById("video");
    const channelProfile = document.getElementById("channel-profile");
    const videoTitle = document.getElementById("video-title");
    const channelName = document.getElementById("channel-name");
    const subscribers = document.getElementById("subscribers");
    const like = document.getElementById("like");
    const dislike = document.getElementById("dislike");
    const views = document.getElementById("views");
    const date = document.getElementById("date");

    // 채널 프로필
    channelProfile.src = channel.channel_profile;
    // 비디오 영상
    video.src = videos.thumbnail;
    // 영상 제목
    videoTitle.textContent = videos.title;    
    // 채널 주인 이름
    channelName.textContent = channel.channel_name;
    // 구독자 수
    subscribers.textContent = getSubscriber(channel.subscribers);
    // 좋아요    
    like.textContent = getLikeAndDislike(videos.likes);
    // 싫어요
    dislike.textContent = getLikeAndDislike(videos.dislikes);
    // 조회수
    views.textContent = getViews(videos.views);    
    // 업로드 날짜
    date.textContent = getTimeAgo(videos.created_dt);
  }
  video();

  async function relatedVidos(){
    const getVideos = await getVideoList();
    
    const Div = document.querySelector(".related-videos1");

    const chunkSize = 4;
    let currentIndex = 0;

    async function renderChunk() {
      const fragment = document.createDocumentFragment();
      const chunk = getVideos.slice(currentIndex, currentIndex + chunkSize);

      const channelInfos = await Promise.all(
        chunk.map((video) => getChannelInfo(video.channel_id))        
      );
      

      chunk.forEach((video, index) => {
        const { channel_name, channel_profile } = channelInfos[index];   
        console.log(channelInfos[index]);

        const channelDiv = document.createElement("div");
        channelDiv.classList.add("related-video");
        channelDiv.innerHTML = `            
              <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
                <img src="${video.thumbnail}" loading="lazy" />
              </a>
              <div class="video-text">
                <h4>제목2</h4>
                <p>텍스트2</p>
              </div>
          `;
        fragment.appendChild(channelDiv);
      });

      Div.appendChild(fragment);
      currentIndex += chunkSize;
      if (currentIndex < getVideos.length) {
        setTimeout(renderChunk, 1);
      }
    }
    renderChunk();
  }
// 댓글 작성시 프로필+작성자명 보이게
  relatedVidos();
  
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");

  let comments = [];

  function renderComments() {
    commentList.innerHTML = "";
    comments.forEach((text, index) => {
      const li = document.createElement("li");
      li.textContent = text;
      commentList.appendChild(li);
    });
    commentCount.textContent = comments.length;
  }

  submitBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      comments.push(text);
      commentInput.value = "";
      renderComments();
    } else {
      alert("댓글을 입력해주세요.");
    }
  });    
});