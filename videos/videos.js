document.addEventListener("DOMContentLoaded", function () {

  // 상단 바 불러오기
  loadHtml("header", "../home/상단바/header-top.html", () => {    

    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "../home/상단바/styles/header-top.css";
    document.head.appendChild(styleLink);   

    // 사이드바 불러오기  
    const menuButton = document.getElementById("menuButton");    
    const aside = document.querySelector("aside");   
    
    let sidebar = document.createElement("link");
    sidebar.rel = "stylesheet";
    sidebar.href = "../home/상단바/styles/header-top.css";
    document.head.appendChild(sidebar); 
    let cuurrentPage = 1;

    menuButton.addEventListener("click", () => {
      if(cuurrentPage == 1){        
        loadHtml("aside","../home/sidebar/aside.html", () => { 
          const sidebarSytle = document.querySelector(".sidebar");           
          sidebar.href = "../home/sidebar/style/aside.css";
          document.head.appendChild(sidebar);         
              
          aside.style.width = "70px";        
          aside.style.display = "flex";
          aside.style.justifyContent = "center";  
          sidebarSytle.style.backgroundColor = "#212121";    
          sidebarSytle.style.left = "0";    
          sidebarSytle.style.width = "190px";
          sidebarSytle.style.marginTop = "56px";
          
        });
        cuurrentPage = 2;
      }      
      else if (cuurrentPage == 2){
        aside.style.display = "none";
        cuurrentPage = 1;
      }    
    });
  
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


  // 채널 이름과 구독자 수 삽입
  
  // async function getChannelInfo(channelID) {
  //   try{
  //     const channelInfo = await channel.json();

  //     // 채널 이름과 구독자 수를 HTML에 삽입
  //     const channelName = document.querySelector(".channel-details h3");
  //     const subscribers = document.querySelector(".channel-details .subscribers");
  
  //     // 채널 이름과 구독자 수 업데이트
  //     channelName.innerHTML = `${channelInfo.channel_name} <br><span class="subscribers">${formatSubscribers(channelInfo.subscribers)}</span>`;
    
  
  //   // 구독자 수 포맷 함수 (예: 1.2M, 105K 형태로 변환)
  //   function formatSubscribers(subscribers) {
  //     if (subscribers >= 1000000) {
  //       return (subscribers / 1000000).toFixed(1) + "M";
  //     } else if (subscribers >= 1000) {
  //       return (subscribers / 1000).toFixed(1) + "K";
  //     } else {
  //       return subscribers;
  //     }
  //   }
  //   }catch(error){
  //     console.error("채널 정보를 불러오는 중 오류 발생:", error);
  //   }
    
  // }

  // getChannelInfo(channelId);


  const params = new URLSearchParams(window.location.search);
  const videoId = parseInt(params.get("video_id")); 
  const channelId = parseInt(params.get("channel_id"));

  async function loadVideo(videoId) {
    try {
      const videoInfo = await window.getVideoInfo(videoId);

      // video에 src 설정
      const video = document.getElementById("player");
      video.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`;
      

      // 제목 및 설명 등 정보 삽입
      document.querySelector(".video-title").textContent = videoInfo.title || "제목 없음";
      document.querySelector(".views").textContent = `조회수 ${videoInfo.views}회` || "조회수 없음";
      document.querySelector(".video-description").textContent = videoInfo.description || "설명 없음";
      document.querySelector(".like_count").textContent = videoInfo.likes || 0;
      document.querySelector(".dislike_count").textContent = videoInfo.dislikes || 0;
    } catch (error) {
      console.error("영상 정보를 불러오는 중 오류 발생:", error);
    }
  }

  // 페이지가 로드되면 videoId로 영상 불러오기
  loadVideo(videoId);
});