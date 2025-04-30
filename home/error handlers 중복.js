// ---------------------------------------------------------홈 에러핸들러----------------
// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // API 요청 실패 처리
  export async function fetchWithErrorHandler(url, options = {}) {
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
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 비디오 로드 실패 처리
  export function setVideoErrorHandler(videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.onerror = () => {
        showError('비디오를 재생할 수 없습니다.');
      };
    } else {
      showError('비디오 요소를 찾을 수 없습니다.');
    }
  }
  
  // 전체 네트워크 오류 처리
  export function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
    });
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setImageErrorHandler();
    setVideoErrorHandler('video-player'); // 예시: 특정 비디오에 대한 에러 핸들링
    checkElementExistence('sidebar', '사이드바를 불러올 수 없습니다.'); // 예시: 특정 DOM 요소가 없을 경우 처리
  }
  

    // ------------------------------------------------------------채널 에러 핸들러-----------------
// errorHandlers.js

// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // API 요청 실패 처리
  export async function fetchWithErrorHandler(url, options = {}) {
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
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 비디오 로드 실패 처리
  export function setVideoErrorHandler(videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.onerror = () => {
        showError('비디오를 재생할 수 없습니다.');
      };
    } else {
      showError('비디오 요소를 찾을 수 없습니다.');
    }
  }
  
  // 구독 버튼 처리
  export function handleSubscribeButton(subscribeButtonId, bellIconId) {
    const subscribeButton = document.getElementById(subscribeButtonId);
    const bellIcon = document.getElementById(bellIconId);
  
    if (subscribeButton) {
      subscribeButton.addEventListener('click', () => {
        bellIcon.style.display = bellIcon.style.display === 'none' ? 'inline' : 'none';
        showError("구독 상태가 변경되었습니다.");
      });
    } else {
      showError("구독 버튼을 찾을 수 없습니다.");
    }
  }
  
  // 전역 네트워크 오류 처리
  export function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
    });
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setImageErrorHandler();
    setVideoErrorHandler('main-img'); // 예시: 비디오 썸네일 로딩 실패 처리
    checkElementExistence('banner-img', '배너 이미지를 불러올 수 없습니다.');
    checkElementExistence('profile-img', '프로필 이미지를 불러올 수 없습니다.');
    checkElementExistence('channel-name', '채널 이름을 불러올 수 없습니다.');
    handleSubscribeButton('subscribe-btn', 'bell-icon'); // 구독 버튼 에러 처리
  }
// -----------------------------------------------------------------------헤더 탑 에러핸들러--------------------------------------------------------

  // 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 검색 입력 필드 값이 비어 있을 경우 처리
  export function handleEmptySearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !searchInput.value.trim()) {
      showError("검색어를 입력하세요.");
      return false; // 검색을 수행하지 않도록 막기
    }
    return true;
  }
  
  // 뒤로가기 버튼 보이기/숨기기 (반응형)
  export function handleBackButtonVisibility() {
    const backButton = document.getElementById('backButton');
    const windowWidth = window.innerWidth;
    if (backButton) {
      backButton.style.display = windowWidth < 600 ? 'inline' : 'none';
    }
  }
  
  // 메뉴 버튼 클릭 처리
  export function handleMenuButton() {
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        // 메뉴 버튼 클릭 시 처리할 내용
        console.log("Menu Button Clicked");
      });
    } else {
      showError("메뉴 버튼을 찾을 수 없습니다.");
    }
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleBackButtonVisibility();
    setImageErrorHandler();
    checkElementExistence('menuButton', '메뉴 버튼을 찾을 수 없습니다.');
    checkElementExistence('searchInput', '검색 입력란을 찾을 수 없습니다.');
    checkElementExistence('searchButton', '검색 버튼을 찾을 수 없습니다.');
    checkElementExistence('backButton', '뒤로가기 버튼을 찾을 수 없습니다.');
    checkElementExistence('mic-button', '음성검색 버튼을 찾을 수 없습니다.');
    handleMenuButton();
  }
  

//  --------------------------------------------------- 헤더서브 에러 핸들러 ----------------------------
// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 버튼 클릭 시 필터 모달을 토글하는 함수
  export function toggleFilterModal() {
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const closeFilter = document.getElementById('closeFilter');
    
    if (!filterButton || !filterModal || !closeFilter) {
      showError("필터 버튼 또는 모달을 찾을 수 없습니다.");
      return;
    }
  
    filterButton.addEventListener('click', () => {
      filterModal.classList.toggle('show');
    });
  
    closeFilter.addEventListener('click', () => {
      filterModal.classList.remove('show');
    });
  
    document.addEventListener('click', (e) => {
      if (!filterModal.contains(e.target) && !filterButton.contains(e.target)) {
        filterModal.classList.remove('show');
      }
    });
  }
  
  // 스크롤 버튼 클릭 시 스크롤 기능 처리
  export function handleScrollButtons() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');
  
    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) {
      showError("스크롤 버튼 또는 컨테이너를 찾을 수 없습니다.");
      return;
    }
  
    function toggleScrollButtons() {
      const scrollLeft = scrollContainer.scrollLeft;
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  
      scrollLeftBtn.style.display = scrollLeft > 0 ? "flex" : "none";
      scrollRightBtn.style.display = scrollLeft < maxScroll - 1 ? "flex" : "none";
    }
  
    scrollContainer.addEventListener('scroll', toggleScrollButtons);
    scrollLeftBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });
  
    toggleScrollButtons();
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    setImageErrorHandler();
    handleScrollButtons();
    toggleFilterModal();
    checkElementExistence('scrollLeftBtn', '왼쪽 스크롤 버튼을 찾을 수 없습니다.');
    checkElementExistence('scrollRightBtn', '오른쪽 스크롤 버튼을 찾을 수 없습니다.');
    checkElementExistence('filterButton', '필터 버튼을 찾을 수 없습니다.');
    checkElementExistence('filterModal', '필터 모달을 찾을 수 없습니다.');
  }



//  ------------------------------------------------------------------------ 비디오 에러핸들러---------------------------------------
// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 비디오 로드 실패 처리
  export function setVideoErrorHandler(videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.onerror = () => {
        showError('비디오를 재생할 수 없습니다.');
      };
    } else {
      showError('비디오 요소를 찾을 수 없습니다.');
    }
  }
  
  // 댓글 입력 처리
  export function handleCommentSubmission() {
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
        // 댓글을 서버로 제출하는 코드
        console.log('댓글 제출:', commentText);
        commentInput.value = ''; // 입력창 초기화
      }
    });
  }
  
  // 전역 네트워크 오류 처리
  export function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
    });
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setImageErrorHandler();
    setVideoErrorHandler('video'); // 예시: 비디오 로딩 실패 처리
    checkElementExistence('video', '비디오 요소를 찾을 수 없습니다.');
    checkElementExistence('video-title', '비디오 제목을 찾을 수 없습니다.');
    checkElementExistence('channel-profile', '채널 프로필 이미지를 찾을 수 없습니다.');
    checkElementExistence('channel-name', '채널 이름을 찾을 수 없습니다.');
    checkElementExistence('subscribe-btn', '구독 버튼을 찾을 수 없습니다.');
    checkElementExistence('comment-input', '댓글 입력 필드를 찾을 수 없습니다.');
    handleCommentSubmission(); // 댓글 제출 처리
  }
// -----------------------------------------어사이드 에러 핸들러 ------------------------------------------------------------------------------------------------
// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // 이미지 로드 실패 처리
  export function setImageErrorHandler() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.onerror = () => {
        img.src = '/default-image.jpg'; // 기본 이미지로 대체
        showError('이미지를 로드할 수 없습니다.');
      };
    });
  }
  
  // 스크롤 버튼 클릭 시 스크롤 기능 처리
  export function handleScrollButtons() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');
  
    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) {
      showError("스크롤 버튼 또는 컨테이너를 찾을 수 없습니다.");
      return;
    }
  
    function toggleScrollButtons() {
      const scrollLeft = scrollContainer.scrollLeft;
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  
      scrollLeftBtn.style.display = scrollLeft > 0 ? "flex" : "none";
      scrollRightBtn.style.display = scrollLeft < maxScroll - 1 ? "flex" : "none";
    }
  
    scrollContainer.addEventListener('scroll', toggleScrollButtons);
    scrollLeftBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });
  
    toggleScrollButtons();
  }
  
  // 메뉴 항목 클릭 처리
  export function handleSidebarMenu() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();  // 링크가 없다면 페이지 이동을 방지
          showError('잘못된 링크가 클릭되었습니다.');
        }
      });
    });
  }
  
  // 전역 네트워크 오류 처리
  export function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
    });
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setImageErrorHandler();
    handleScrollButtons();
    handleSidebarMenu();
    checkElementExistence('sidebar', '사이드바를 찾을 수 없습니다.');
  }

//   --------------------------------------------------------------어사이드2 에러 핸들러 ---------------------------------------------------------------------------
// 에러 메시지를 페이지에 표시하는 함수
export function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.innerText = message;
    errorBox.className = 'error-message'; // CSS로 스타일링
    document.body.appendChild(errorBox);
  }
  
  // DOM 요소가 없는 경우 처리
  export function checkElementExistence(elementId, errorMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      showError(errorMessage);
      console.error(`Element with id ${elementId} not found.`);
    }
  }
  
  // SVG 아이콘 로드 실패 처리
  export function setSVGErrorHandler() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      if (!svg) {
        showError("SVG 아이콘을 로드할 수 없습니다.");
      }
    });
  }
  
  // 링크 클릭 시 페이지 이동 방지 (href="#" 처리)
  export function handleSidebarLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();  // 링크가 없다면 페이지 이동을 방지
          showError('잘못된 링크가 클릭되었습니다.');
        }
      });
    });
  }
  
  // 전역 네트워크 오류 처리
  export function handleNetworkError() {
    window.addEventListener('offline', () => {
      showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
    });
  }
  
  // 전역 에러 핸들링
  export function globalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global Error:', message);
      showError('알 수 없는 오류가 발생했습니다.');
      return true; // 에러를 더 이상 콘솔에 표시하지 않음
    };
  
    window.onunhandledrejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      showError('예기치 않은 오류가 발생했습니다.');
    };
  }
  
  // 초기화 함수: 모든 에러 핸들링을 초기화하는 함수
  export function initErrorHandlers() {
    globalErrorHandler();
    handleNetworkError();
    setSVGErrorHandler();
    handleSidebarLinks();
    checkElementExistence('sidebar', '사이드바를 찾을 수 없습니다.');
  }
  