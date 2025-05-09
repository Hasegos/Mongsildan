document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));
  const description = document.getElementById("description");

  // 채널 주인, 채널 이름  
  let currentChannelProfile = "";
  let currentChannelName = "";

  // 상단 바 불러오기
  try {    
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
  }
  catch (error) {
    location.href = "../error/error.html";
    alert("상단바 불러오기 중 오류 발생");
  }
  
  // 사이드바 불러오기
  let cuurrentPage = 3 , check = 2;

  try { 
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
  }
  catch (error) {
    location.href = "../error/error.html";
    alert("사이드바 불러오기 중 오류 발생");
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // 비디오 내용 불러오기
  try {  
    async function video() {  
      
      let videos, channel;
      try {
        videos = await getVideoInfo(videoId);
        channel = await getChannelInfo(channelId);
      } catch (error) {
        console.error("영상 또는 채널 정보를 불러오는 중 오류 발생:", error);
        alert("영상을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const video = document.getElementById("video");
      const channelProfile = document.getElementById("channel-profile");
      const videoTitle = document.getElementById("video-title");
      const channelName = document.getElementById("channel-name");
      const subscribers = document.getElementById("subscribers");
      const like = document.getElementById("like");    
      const dislike = document.getElementById("dislike");
      const likeBtn = document.getElementById('like-button');
      const dislikeBtn = document.getElementById('dislike-button');
      const views = document.getElementById("views");
      const date = document.getElementById("date");
      const channelLink = document.getElementById("channel-link");
      const description = document.getElementById("description");
      const allVideos = await getVideoList();
      // 현재 영상 태그 (목록들)
      const currentVideoTags = videos.tags || [];

      // 채널 프로필 및 채널명 저장 (댓글용)
      currentChannelProfile = channel.channel_profile;
      currentChannelName = channel.channel_name;

      // 채널 프로필
      channelProfile.src = channel.channel_profile;
      // 채널 프로필 링크
      channelLink.href = `../Channel/channel.html?id=${channelId}`;
      channelLink.href = `../Channel/channel.html?id=${channelId}`;
      // 비디오 영상
      video.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`
      // 영상 제목
      videoTitle.textContent = videos.title;    
      // 채널 주인 이름
      channelName.textContent = channel.channel_name;
      // 구독자 수
      subscribers.textContent = getSubscriber(channel.subscribers);
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

      
      // 좋아요 싫어요 로직
      let currentLikes = videos.likes;
      let currentDislikes = videos.dislikes;
      let isLiked = false;    // 현재 좋아요 버튼 상태
      let isDisliked = false; // 현재 싫어요 버튼 상태

      function formatCount(count) {
        return getLikeAndDislike(count);
      }

      function updateCountsDisplay() {
        like.textContent = formatCount(currentLikes);
        dislike.textContent = formatCount(currentDislikes);
      }

      updateCountsDisplay();

      // 좋아요 버튼 클릭 이벤트
      likeBtn.addEventListener('click', () => {
        const likeSvg = likeBtn.querySelector('svg'); 

        if (!isLiked) { // 1. 좋아요를 누르지 않은 상태 -> 좋아요 활성화
          currentLikes++;
          isLiked = true;
          likeBtn.classList.add('active'); // 버튼에 active 클래스 추가 (색상 변경 등)

          // 애니메이션 실행
          if (likeSvg) { // SVG 요소가 있는지 확인
            likeSvg.classList.add('like-animation');

            // 애니메이션이 끝나면 클래스를 제거하는 이벤트 리스너 추가
            // { once: true } 옵션으로 이벤트가 한 번 실행된 후 자동으로 제거되도록 함
            likeSvg.addEventListener('animationend', () => {
                likeSvg.classList.remove('like-animation');
            }, { 
              once: true
            });
          }
          if (isDisliked) { // 만약 싫어요가 눌려있었다면 -> 싫어요 비활성화
            currentDislikes--;
            isDisliked = false;
            dislikeBtn.classList.remove('active');
          }
        } else { // 2. 이미 좋아요를 누른 상태 -> 좋아요 비활성화
          currentLikes--;
          isLiked = false;
          likeBtn.classList.remove('active');
        }
        updateCountsDisplay(); // 화면 업데이트
      });

      // 싫어요 버튼 클릭 이벤트
      dislikeBtn.addEventListener('click', () => {
        if (!isDisliked) { // 1. 싫어요를 누르지 않은 상태 -> 싫어요 활성화
          currentDislikes++;
          isDisliked = true;
          dislikeBtn.classList.add('active');

          if (isLiked) { // 만약 좋아요가 눌려있었다면 -> 좋아요 비활성화
            currentLikes--;
            isLiked = false;
            likeBtn.classList.remove('active');
          }
        } else { // 2. 이미 싫어요를 누른 상태 -> 싫어요 비활성화
          currentDislikes--;
          isDisliked = false;
          dislikeBtn.classList.remove('active');
        }
        updateCountsDisplay(); // 화면 업데이트
      });
      
      // 현재 영상의 대표 태그 뽑기
      async function findBestTag(tags) {
        let bestTag = null;
        let bestScore = -1;
      
        for (let i = 0; i < tags.length; i++) {
          let total = 0;
          for (let j = 0; j < tags.length; j++) {
            // 자기 자신은 제외
            if (i === j){
              continue;                
            } 
            total += await getTagSimilarity(tags[i], tags[j]);
          }
          const avg = total / (tags.length - 1);
          if (avg > bestScore) {
            bestScore = avg;
            bestTag = tags[i];
          }
        }    
        return bestTag;
      }
    
      // 비디오 유사도 계산
      async function calculateSimilarities(allVideos, currentVideoTags) {
        const similarityResults = [];
        const baseTag = await findBestTag(currentVideoTags); // 대표 태그 1개만 사용
      
        for (let video of allVideos) {
          let total = 0;      
          for (let tag of video.tags) {        
            total += await getTagSimilarity(baseTag, tag);
          }    
          const averageScore = total / video.tags.length;
          similarityResults.push({ video, averageScore });
        }
      
        similarityResults.sort((a, b) => b.averageScore - a.averageScore);
        return similarityResults;
      }
      
      // 추천 실행
      async function recommendVideos() {
        const similarityResults = await calculateSimilarities(allVideos, currentVideoTags);
      
        const filteredResults = similarityResults.filter(
          result => result.averageScore >= 0.3
        );      
        renderRelatedVideos(filteredResults.map(result => result.video),".related-videos1");
        renderRelatedVideos(filteredResults.map(result => result.video),".related-videos2");
      }    
      recommendVideos();

      async function renderRelatedVideos(sortedVideos,selector) {      
        const relatedVideosContainer = document.querySelector(selector);
        relatedVideosContainer.innerHTML = '';  // 기존 관련 비디오 초기화
        for(const video of sortedVideos){     
            const channelInfo =  await getChannelInfo(video.channel_id) ;
            const channelName = channelInfo.channel_name;

            const relatedVideoElement = document.createElement("div");
            relatedVideoElement.classList.add("related-video");
            relatedVideoElement.innerHTML = `
                <a href="../videos/videos.html?channel_id=${video.channel_id}&video_id=${video.id}" class="card-link">
                    <img src="${video.thumbnail}" loading="lazy" />
                </a>
                <div class="video-text">
                    <h4>${video.title}</h4>
                    <p>${channelName}</p>
                    <p>${video.views ? getViews(video.views) : "조회수가 없습니다."}</p>
                    <p>${video.created_dt ? getTimeAgo(video.created_dt) : "잘못된 영상입니다."}</p>
                </div>
            `;
            relatedVideosContainer.appendChild(relatedVideoElement);
        };
      }
    }  
    video();
  }
  catch (error) {
    location.href = "../error/error.html";
    alert("채널 페이지 오류");    
  }
  
  /* 댓글 시간 */
  try {      
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
  }
  catch(error) {
    alert("댓글시간 계산 중 오류 발생");
    location.reload();    
  }

  /* 댓글 기능  */
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");  

  let comments = [];

  // 댓글 렌더링 함수
  try {    
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
  } 
  catch(error){
    alert("댓글 작성중 오류 발생");
    location.reload();
  }

  /* 구독 버튼 */
  try{    
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscribeText = document.getElementById('subscribe-text');
    const bellIcon = document.getElementById('bell-icon');
    let subscribed = false;

    subscribeBtn.addEventListener('click', () => {
      subscribed = !subscribed;
      if (subscribed) {
        subscribeText.textContent = '구독중';
        subscribeBtn.style.backgroundColor = '#515353'; // 구독중 배경
        bellIcon.style.display = 'inline';
        bellIcon.classList.add('bell-shake');
    
        bellIcon.addEventListener('animationend', () => {
          bellIcon.classList.remove('bell-shake');
        }, { once: true });
    
      } else {
        subscribeText.textContent = '구독';
        subscribeBtn.style.backgroundColor = 'white'; // 구독전 배경
        bellIcon.style.display = 'none';
      }  
    });   
  }
  catch(error){
    alert("구독 버튼 오류 발생");
    location.reload();
  }
});