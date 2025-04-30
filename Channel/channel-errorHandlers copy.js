// channelErrorHandlers.js
function showError(message, reload = false) {
    console.log("showError 실행됨:", message);
    alert(message); // 시스템 팝업
    if (reload) {
      setTimeout(() => location.reload(), 3000);
    }
  }
  
  function checkElementExistence(elementId, errorMessage, reload = false) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage, reload);
      console.error(`Element with id "${elementId}" not found.`);
      return false;
    }
    return true;
  }
  
  function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg';
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  function setSVGImageErrorHandler() {
    const svgImages = document.querySelectorAll('img[src$=".svg"]');
    svgImages.forEach(img => {
      img.onerror = () => {
        img.src = '/default-icon.svg';
        showError('SVG 아이콘을 불러올 수 없습니다.');
      };
    });
  }
  
  function setVideoErrorHandler(videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.onerror = () => {
        showError('비디오를 재생할 수 없습니다.', true);
      };
    }
  }
  
  async function fetchWithErrorHandler(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      showError("데이터를 불러오는 데 실패했습니다.", true);
    }
  }
  
  function handleSubscribeButton(subscribeButtonId, bellIconId) {
    const subscribeButton = document.getElementById(subscribeButtonId);
    const bellIcon = document.getElementById(bellIconId);
    if (subscribeButton) {
      subscribeButton.addEventListener('click', () => {
        if (bellIcon) {
          bellIcon.style.display = bellIcon.style.display === 'none' ? 'inline' : 'none';
          showError("구독 상태가 변경되었습니다.");
        }
      });
    } else {
      showError("구독 버튼을 찾을 수 없습니다.");
    }
  }
  
  function handleSidebarLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          showError('잘못된 링크가 클릭되었습니다.');
        }
      });
    });
  }
  
  function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크를 확인해주세요.');
    });
  }
  
  function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true;
    };
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  function initChannelErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setImageErrorHandler();
    setSVGImageErrorHandler();
  
    // 비디오 요소가 있을 때만 에러 핸들러 등록
    if (checkElementExistence('main-img', '대표 영상을 불러올 수 없습니다.', true)) {
      setVideoErrorHandler('main-img');
    }
  
    handleSidebarLinks();
    handleSubscribeButton('subscribe-btn', 'bell-icon');
  
    // 나머지 필수 요소 체크
    checkElementExistence('banner-img', '채널 배너를 불러올 수 없습니다.', true);
    checkElementExistence('profile-img', '프로필 이미지를 불러올 수 없습니다.', true);
    checkElementExistence('channel-name', '채널 이름을 불러올 수 없습니다.', true);
    checkElementExistence('subscribers', '구독자 수를 불러올 수 없습니다.');
    checkElementExistence('video-description', '대표 영상 설명이 없습니다.');
    checkElementExistence('viewText', '조회수 정보가 없습니다.');
    checkElementExistence('date', '날짜 정보가 없습니다.');
  }
  
  // 전역 함수 등록
  window.initChannelErrorHandlers = initChannelErrorHandlers;
  window.showError = showError;
  window.checkElementExistence = checkElementExistence;
  window.setImageErrorHandler = setImageErrorHandler;
  window.setSVGImageErrorHandler = setSVGImageErrorHandler;
  window.setVideoErrorHandler = setVideoErrorHandler;
  window.fetchWithErrorHandler = fetchWithErrorHandler;
  window.handleSubscribeButton = handleSubscribeButton;
  window.handleSidebarLinks = handleSidebarLinks;
  window.handleNetworkError = handleNetworkError;
  window.globalErrorHandler = globalErrorHandler;
  window.checkChannelElements = () => {}; // 다른 JS 파일에서 호출 시 에러 방지