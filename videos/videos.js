document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));
  const description = document.getElementById("description");

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
    const description = document.getElementById("description");

    // 채널 프로필
    channelProfile.src = channel.channel_profile;
    // 비디오 영상
    video.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`;
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
    // 비디오 설명
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

    video.addEventListener("pause", () => {
      if (video.currentTime > 0 && !video.ended) { 
        playBtn.style.display = "block";
      }
    });

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

        // 조회수와 날짜 변환 함수 호출
        const formattedViews = getViews(video.views);  // 조회수 변환
        const formattedDate = getTimeAgo(video.created_dt);  // 날짜 변환

        const channelDiv = document.createElement("div");
        channelDiv.classList.add("related-video");
        channelDiv.innerHTML = `            
              <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
                <img src="${video.thumbnail}" loading="lazy" />
              </a>
              <div class="video-text">
                <h4>${video.title}</h4>
                <p>${channel_name}</p>
                <p>${formattedViews}</p>
                <p>${formattedDate}</p>
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
  
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");

   // 고정된 프로필 정보 (동물의 왕국)
  const profile = {
    name: "동물의 왕국",
    profileImage: "https://storage.googleapis.com/youtube-clone-video/channel_profile_1.png"  // 실제 프로필 이미지 URL을 넣으세요
  };

  let comments = [];

   // 댓글 렌더링 함수
  function renderComments() {
    commentList.innerHTML = "";  // 기존 댓글 초기화
    comments.forEach((comment) => {
      const li = document.createElement("li");  
      li.classList.add("comment-item");

      // 댓글 항목에 프로필 이미지와 작성자 이름, 댓글 내용 추가
      li.innerHTML = `
        <img src="${comment.profileImage}" alt="${comment.author}" class="profile-image" />
        <div class="author">${comment.author}</div>
        <div class="text">${comment.text}</div>
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
        author: profile.name,  
        text: text,  
        profileImage: profile.profileImage 
      };

      comments.push(newComment);  // 댓글 배열에 추가
      commentInput.value = "";  
      renderComments();        
    } else {
      alert("댓글을 입력해주세요.");
    }
  });

  
  // 초기 댓글 렌더링
  renderComments();  // 페이지 로드 시 초기 댓글 렌더링
  
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