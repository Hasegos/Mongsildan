// errorHandlers.js

function showError(message) {
  const errorBox = document.createElement('div');
  errorBox.innerText = message;
  errorBox.className = 'error-message'; // CSS 필요
  document.body.appendChild(errorBox);
}

function checkElementExistence(elementId, errorMessage) {
  const element = document.getElementById(elementId);
  if (!element) {
    showError(errorMessage);
    console.error(`Element with id ${elementId} not found.`);
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

function setSVGErrorHandler() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg) {
      showError("SVG 아이콘을 로드할 수 없습니다.");
    }
  });
}

function setVideoErrorHandler(videoElementId) {
  const videoElement = document.getElementById(videoElementId);
  if (videoElement) {
    videoElement.onerror = () => {
      showError('비디오를 재생할 수 없습니다.');
    };
  } else {
    showError('비디오 요소를 찾을 수 없습니다.');
  }
}

async function fetchWithErrorHandler(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    showError("데이터를 불러오는 데 실패했습니다.");
  }
}

function handleCommentSubmission() {
  const commentInput = document.getElementById('comment-input');
  const submitComment = document.getElementById('submit-comment');

  if (!commentInput || !submitComment) {
    showError('댓글 입력 필드를 찾을 수 없습니다.');
    return;
  }

  submitComment.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (!commentText) {
      showError("댓글을 입력해주세요.");
    } else {
      console.log('댓글 제출:', commentText);
      commentInput.value = '';
    }
  });
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

function handleEmptySearchInput() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput && !searchInput.value.trim()) {
    showError("검색어를 입력하세요.");
    return false;
  }
  return true;
}

function handleBackButtonVisibility() {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.style.display = window.innerWidth < 600 ? 'inline' : 'none';
  }
}

function handleNetworkError() {
  window.addEventListener('offline', () => {
    showError('인터넷 연결이 끊어졌습니다.');
  });
}

function handleMenuButton() {
  const menuButton = document.getElementById('menuButton');
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      console.log("Menu Button Clicked");
    });
  } else {
    showError("메뉴 버튼을 찾을 수 없습니다.");
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

function initErrorHandlers() {
  globalErrorHandler();
  handleNetworkError();
  setImageErrorHandler();
  setSVGErrorHandler();
  setVideoErrorHandler('video');
  handleSidebarLinks();
  handleCommentSubmission();
  handleEmptySearchInput();
  handleBackButtonVisibility();
  handleMenuButton();
  handleSubscribeButton('subscribe-btn', 'bell-icon');

  checkElementExistence('sidebar', '사이드바를 찾을 수 없습니다.');
  checkElementExistence('searchInput', '검색 입력란을 찾을 수 없습니다.');
  checkElementExistence('searchButton', '검색 버튼을 찾을 수 없습니다.');
  checkElementExistence('backButton', '뒤로가기 버튼을 찾을 수 없습니다.');
  checkElementExistence('mic-button', '음성검색 버튼을 찾을 수 없습니다.');
}

window.initErrorHandlers = initErrorHandlers;