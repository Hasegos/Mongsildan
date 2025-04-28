document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));

  let currentChannelProfile = "";
  let currentChannelName = "";

  // 상단 바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => { 
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../top/style/header-top.css";
    document.head.appendChild(styleLink);   

    // 검색 기능
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
  let cuurrentPage = 3, check = 2;
  loadHtml("aside", "../sidebar/html/aside.html", () => {
    const aside = document.querySelector("aside");    
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../sidebar/style/aside.css";
    document.head.appendChild(styleLink);    

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

    // 채널 프로필 및 채널명 저장 (댓글용)
    currentChannelProfile = channel.channel_profile;
    currentChannelName = channel.channel_name;

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

  // 관련 비디오 불러오기
  async function relatedVidos() {
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
  relatedVidos();

  // 댓글 작성 관련
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");

  let comments = []; // [{ text: "", timestamp: Date.now() }, {...}]

  function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / 60000); // 1분 = 60,000ms

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  }

  function renderComments() {
    commentList.innerHTML = "";
    comments.forEach(({ text, timestamp }) => {
      const li = document.createElement("li");

      const img = document.createElement("img");
      img.src = currentChannelProfile;
      img.alt = "Channel Profile";
      img.style.width = "30px";
      img.style.height = "30px";
      img.style.borderRadius = "50%";
      img.style.marginRight = "8px";
      img.style.verticalAlign = "middle";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = currentChannelName;
      nameSpan.style.fontWeight = "bold";
      nameSpan.style.marginRight = "6px";

      const textNode = document.createTextNode(text);

      const timeSpan = document.createElement("span");
      timeSpan.textContent = " • " + formatTimeAgo(timestamp);
      timeSpan.style.color = "gray";
      timeSpan.style.fontSize = "12px";
      timeSpan.style.marginLeft = "8px";

      li.appendChild(img);
      li.appendChild(nameSpan);
      li.appendChild(textNode);
      li.appendChild(timeSpan);

      commentList.appendChild(li);
    });
    commentCount.textContent = comments.length;
  }

  function submitComment() {
    const text = commentInput.value.trim();
    if (text) {
      comments.push({ text: text, timestamp: Date.now() });
      commentInput.value = "";
      renderComments();
    } else {
      alert("댓글을 입력해주세요.");
    }
  }

  submitBtn.addEventListener("click", submitComment);

  commentInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  })})