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