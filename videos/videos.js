document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));
  const description = document.getElementById("description");

  // 채널 주인, 채널 이름  
  let currentChannelProfile = "";
  let currentChannelName = "";

  // 상단 바 불러오기
  loadHtml("header", "../top/html/header-top.html", () => { 
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../top/style/header-top.css";
    document.head.appendChild(styleLink);   
    
    /* 상단 600px 일때 */   
    topLoad600px(); 
    /* 초기 검색시 */
    searching(); 
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

    // 채널 프로필 및 채널명 저장 (댓글용)
    currentChannelProfile = channel.channel_profile;
    currentChannelName = channel.channel_name;

    // 채널 프로필
    channelProfile.src = channel.channel_profile;
    // 비디오 영상
    video.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`
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
    // 더보기
    description.textContent = videos.tags.join(", ");

     //플레이 버튼
    const playBtn = document.getElementById("play-button");

    playBtn.addEventListener("click", () => {
        if (video.readyState >= 2) {
            video.setAttribute("controls", true);
            video.play().then(() => {
              playBtn.style.display = "none";
            }).catch(error => {
              console.error('비디오 재생 실패:', error);
          });
        }
    });
    /* 비디오 멈춤시 버튼 */
    video.addEventListener("pause", () => {
      if (video.currentTime > 0 && !video.ended) { 
        playBtn.style.display = "block";
      }
    });
    /* 비디오 재생시 버튼 숨김 */
    video.addEventListener("play", () => {
      playBtn.style.display = "none";
    });
  }
  video();
  
  async function renderRelatedVideos(selector){
    
    const getVideos = await getVideoList();    
    const Div = document.querySelector(selector);

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
            
        // 조회수
        const viewsText = (video.views!= null) ? getViews(video.views) : "죄회수가 없습니다.";
        // 업로드 날짜
        const dateText = (video.created_dt) ? getTimeAgo(video.created_dt) : "잘못된 영상입니다.";             

        const channelDiv = document.createElement("div");
        channelDiv.classList.add("related-video");
        channelDiv.innerHTML = `            
              <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
                <img src="${video.thumbnail}" loading="lazy" />
              </a>
              <div class="video-text">
                <h4>${video.title}</h4>
                <p>${channel_name}</p>
                <p>${viewsText}</p>
                <p>${dateText}</p>
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

  // 관련 영상 1과 2 호출
  renderRelatedVideos(".related-videos1");
  renderRelatedVideos(".related-videos2");  

  /* 댓글 시간 */
  function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  }
  

  /* 댓글 기능  */
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");  
  

  let comments = [];

   // 댓글 렌더링 함수
  function renderComments() {
    commentList.innerHTML = "";  // 기존 댓글 초기화
    comments.forEach(({author, text, profileImage, timestamp}) => {
      const li = document.createElement("li");  
      li.classList.add("comment-item");

      // 댓글 항목에 프로필 이미지와 작성자 이름, 댓글 내용 추가
      li.innerHTML = `
        <div style="display: flex;">
          <img src="${profileImage}" alt="${author}" class="profile-image" />
          <div>
            <span class="author">${author}</span><span class="date">${formatTimeAgo(timestamp)}</span>
            <p class="text">${text}</p>
          </div>
        </div>              
      `;

      commentList.appendChild(li);
    });

    // 댓글 개수 갱신
    commentCount.textContent = comments.length;
  }


  // 댓글 작성 버튼 클릭 시 댓글 추가
  submitBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();

    if (text) {
      // 새 댓글 객체 생성 (작성자 이름과 프로필 이미지 추가)
      const newComment = {
        author: currentChannelName,  
        text: text,  
        profileImage:currentChannelProfile,
        timestamp : Date.now()
      };

      comments.push(newComment);  // 댓글 배열에 추가
      commentInput.value = "";  
      renderComments();        
    } else {
      alert("댓글을 입력해주세요.");
    }
  });
  
  // 초기 댓글 렌더링
  renderComments();  
  
  
  /* 구독 버튼 */
  const subscribeBtn = document.getElementById('subscribe-btn');
  const subscribeIcon = document.getElementById('subscribe-icon');
  const subscribeText = document.getElementById('subscribe-text');
  let subscribed = false;

  subscribeBtn.addEventListener('click', () => {
    subscribed = !subscribed;
    subscribeBtn.style.backgroundColor = subscribed ? '#3f3e3e' : 'white';
    subscribeText.textContent = subscribed ? '구독중' : '구독';
    subscribeText.style.color = subscribed ? 'white' : '#3f3e3e';
    subscribeIcon.style.display = subscribed ? 'block' : 'none';   
  });

});