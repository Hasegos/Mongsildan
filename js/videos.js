document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const channelId = parseInt(params.get("channel_id")); 
  const videoId = parseInt(params.get("video_id"));    

  // 채널 주인, 채널 이름  
  let currentChannelProfile = "";
  let currentChannelName = "";

  /* ============ 최상단바 불러오기 ============ */
  try {    
    loadHtml("header", "../html/header-global.html", () => {       
        let styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "../css/header-global.css";
        document.head.appendChild(styleLink);   
        const menuButtonId = document.getElementById("menuButton");
        /* 상단 600px 일때 */   
        topLoad600px(); 
        /* 초기 검색시 */
        searching();       
      
        const aside = document.querySelector("aside");        
        let isOpen = false;     

        /* ============  사이드바 불러오기 ============ */         
        function loadSidebar() {          

          document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            if (/sidebar-(collapsed|expanded)\.css$/.test(link.href)) {
              link.remove();
            }
          });
          
          /* ============ 구독 이벤트 유지 ============ */
          if (!isOpen) {
            loadHtml("aside", "../html/sidebar-expanded.html", () => {
              const link = document.createElement("link");
              link.rel  = "stylesheet";
              link.href = "../css/sidebar-expanded.css";
              document.head.appendChild(link);
            });            
            aside.style.display = "none";            
            return;           
          }
          /* 펼친 상태 */
          else {
            const htmlPath = "../html/sidebar-expanded.html";
            const cssPath =  "../css/sidebar-expanded.css";

            loadHtml("aside", htmlPath, () => {
              const link = document.createElement("link");
              link.rel  = "stylesheet";
              link.href = cssPath;
              document.head.appendChild(link);

              aside.style.display      = "";
              renderSavedSubscriptions(aside);                           
            });
          }          
        }  
        /* ============ 사이드바 버튼 ============ */
        menuButtonId.addEventListener("click", () => {
          isOpen = !isOpen;          
          loadSidebar();         
        });

        /* ============ 사이드바 최초 불러오기 ============ */
        loadSidebar();        
    });  
  }
  catch (error) {
    location.href = "../error/error.html";
    alert("상단바 불러오기 중 오류 발생");
  }

  /* ============ 비디오 페이지 불러오기 ============ */  
  try {  
    async function video() {  
      
      let videos, channel;
      try {
        videos = await getVideoInfo(videoId);
        channel = await getChannelInfo(channelId);
      } catch (error) {        
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
      
      // 채널 프로필 및 채널명 저장 (댓글용)
      currentChannelProfile = channel.channel_profile;
      currentChannelName = channel.channel_name;

      document.title = videos.title;      
      channelProfile.src = channel.channel_profile;      
      channelLink.href = `../html/channel.html?id=${channelId}`;            
      video.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`      
      videoTitle.textContent = videos.title;          
      channelName.textContent = channel.channel_name;      
      subscribers.textContent = getSubscriber(channel.subscribers);      
      views.textContent = getViews(videos.views);          
      date.textContent = getTimeAgo(videos.created_dt);      
      description.textContent = videos.tags.join(", ");

      //플레이 버튼
      const playBtn = document.getElementById("play-button");

      playBtn.addEventListener("click", () => {
          if (video.readyState >= 2) {
              video.setAttribute("controls", true);
              video.play().then(() => {
                playBtn.style.display = "none";
              }).catch(error => {
                location.reload()                
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
      let isLiked = false;    
      let isDisliked = false; 

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

        if (!isLiked) { 
          currentLikes++;
          isLiked = true;
          likeBtn.classList.add('active'); 

          // 애니메이션 실행
          if (likeSvg) { 
            likeSvg.classList.add('like-animation');            
            likeSvg.addEventListener('animationend', () => {
                likeSvg.classList.remove('like-animation');
            }, { 
              once: true
            });
          }
          if (isDisliked) { 
            currentDislikes--;
            isDisliked = false;
            dislikeBtn.classList.remove('active');
          }
        } else { 
          currentLikes--;
          isLiked = false;
          likeBtn.classList.remove('active');
        }
        updateCountsDisplay(); 
      });

      // 싫어요 버튼 클릭 이벤트
      dislikeBtn.addEventListener('click', () => {
        if (!isDisliked) { 
          currentDislikes++;
          isDisliked = true;
          dislikeBtn.classList.add('active');

          if (isLiked) { 
            currentLikes--;
            isLiked = false;
            likeBtn.classList.remove('active');
          }
        } else { 
          currentDislikes--;
          isDisliked = false;
          dislikeBtn.classList.remove('active');
        }
        updateCountsDisplay(); 
      });

      const allVideos = await getVideoList();

      /*
        ===================================
          AI 유사도 계산 호출 (API키 배포 X)
        ===================================

        // const candidateVideos = allVideos.filter(v => v.id !== videos.id);      
        // const currentVideoTag = videos.tags || [];

        // 대표 태그 계산      
        // const tagAverage = await Promise.all(
        //   currentVideoTag.map(async tag => {
        //     const sim =  await Promise.all(
        //       currentVideoTag.filter(t => t !== tag).map(t =>getTagSimilarity(tag, t))
        //       );
        //       return {tag, avg : sim.reduce((a,b) => a + b, 0) / sim.length};            
        //   })          
        // );
      
        // // 대표 영상 태그 점수 비교
        // const bestTagObj = tagAverage.reduce((best, cur) => cur.avg > best.avg ? cur : best, {tag: null, avg: -1});
        // // 대표 영상 태그
        // const baseTag = bestTagObj.tag;         

        // // 유사도 캐시 설정
        // const simCache = new Map();
        // async function getChacheSim(a, b) {
        //   const key = `${a}_${b}`;
        //   if(simCache.has(key)){
        //     return simCache.get(key);
        //   }
        //   const score = await getTagSimilarity(a, b);
        //   simCache.set(key, score);
        //   return score;        
        // }

        // // 대표 태그랑 태그 유사도 계산
        
        //   const simResults = await Promise.all(
        //     candidateVideos.map(async vid => {
        //       const scores = await Promise.all(
        //         vid.tags.map(async tag => getChacheSim(baseTag, tag))
        //       )
        //       const avgScore = scores.reduce((sum, v) => sum + v , 0) / scores.length;                 
        //     return { video: vid , score : avgScore};          
        //     })
        //   );      

        // const recommend =  simResults
        //   .filter(r => r.score >= 0.3)
        //   .sort((a,b) => b.score - a.score)
        //   .map(r => r.video);   
        //
      */
    
      // 채널 정보 캐싱
      const uniqueChannelIds = [...new Set(allVideos.map(video => video.channel_id))];
      const  recChannelCache = {};
      await Promise.all(
        uniqueChannelIds.map(async id => {          
          recChannelCache[id] = await getChannelInfo(id);
        })
      )     

      /* ============ 화면 출력 ============ */
      async function renderRelatedVideos(selector) {      
        const container = document.querySelector(selector);
        container.innerHTML = '';  
        allVideos.forEach(video =>{     
            const ch = recChannelCache[video.channel_id] ;            

            const el = document.createElement("div");
            el.classList.add("video-page__related-video");
            el.innerHTML = `
                <a href="../html/videos.html?channel_id=${video.channel_id}&video_id=${video.id}">
                    <img src="${video.thumbnail}" loading="lazy" class="video-page__related-video-img"/>
                </a>
                <div class="video-text">
                    <h4>${video.title}</h4>
                    <p>${ch.channel_name}</p>
                    <p>${video.views ? getViews(video.views) : "조회수가 없습니다."}</p>
                    <p>${video.created_dt ? getTimeAgo(video.created_dt) : "잘못된 영상입니다."}</p>
                </div>
            `;
            container.appendChild(el);
        });
      }
      renderRelatedVideos(".video-page__related-videos1");
      renderRelatedVideos(".video-page__related-videos2");

       /* ============ 구독 버튼 ============ */  
      initSubscribeButton(channelId, currentChannelName, currentChannelProfile);
    }  
    video();
  }
  catch (error) {
    location.href = "../html/error.html";
    alert("채널 페이지 오류");    
  }
  
  /* ============ 댓글 시간 ============ */
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

  /* ============ 댓글 기능   ============ */
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitBtn = document.getElementById("submit-comment");
  const commentCount = document.getElementById("comment-count");  

  let comments = [];

  /* ============ 댓글 렌더링 함수 ============ */
  try {    
    function renderComments() {
      commentList.innerHTML = "";  
      comments.forEach(({author, text, profileImage, timestamp}) => {
        const li = document.createElement("li");  
        li.classList.add("video-page__comment-item");
        
        li.innerHTML = `
          <div style="display: flex;">
            <img src="${profileImage}" alt="${author}" class="video-page__comment-profile-img" />
            <div>
              <span class="video-page__comment-author">${author}</span><span class="video-page__comment-date">${formatTimeAgo(timestamp)}</span>
              <p class="video-page__comment-content">${text}</p>
            </div>
          </div>              
        `;
        commentList.appendChild(li);
      });      
      commentCount.textContent = comments.length;
    }
    
    submitBtn.addEventListener("click", () => {
      const text = commentInput.value.trim();

      if (text) {
        // 새 댓글 객체 생성 
        const newComment = {
          author: currentChannelName,  
          text: text,  
          profileImage:currentChannelProfile,
          timestamp : Date.now()
        };

        comments.push(newComment);  
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
});