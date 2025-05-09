// 구독자
function getSubscriber(count) {
    if (count >= 10000) {
      return `구독자 ${(count / 10000).toFixed(2)}만명`;
    } else {
      return `구독자 ${count}명`;
    }    
}
window.getSubscriber = getSubscriber;

// 좋아요 , 싫어요
function getLikeAndDislike(count) {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(2)}만`;
    } else {
      return `${count}`;
    }    
}
window.getLikeAndDislike = getLikeAndDislike;

// 조회수
function getViews(count) {
  if (count >= 10000) {
    return `조회수 ${(count / 10000).toFixed(2)}만회`;
  } else if(count < 10000) {
    return `조회수 ${(count / 1000).toFixed(2)}천회`;
  }    
  else {
    return `조회수 ${count}회`;
  }
}
window.getViews = getViews;

 // 날짜 차이 계산 함수
function getTimeAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffTime = now - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 30) return `${diffDays}일 전`;

    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months}개월 전`;

    const years = Math.floor(months / 12);
    return `${years}년 전`;
}
window.getTimeAgo = getTimeAgo;