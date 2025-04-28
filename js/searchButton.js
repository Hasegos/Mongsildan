/* 검색시 해당 페이지 확인 */
function initSearchButton() {

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    searchButton.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        const inputValue = keyword.replace(/\s/g, "");
        if (inputValue) {
            if (window.location.pathname.includes('home')) {                
                window.isSeraching = true;
                searchVideos(inputValue);
            }
            else {
                // home이 아니면 검색어를 가지고 home으로 이동
                window.location.href = `/home/home.html?search=${encodeURIComponent(inputValue)}`;
            }
        }
        else {
            alert('검색어를 입력하세요!');
        }
    });
}

window.initSearchButton = initSearchButton;