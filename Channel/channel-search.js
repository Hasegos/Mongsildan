// // channel-search.js
// document.addEventListener('DOMContentLoaded', () => {
//     const input = document.getElementById('search-input');
//     const suggestions = document.getElementById('suggestions');
  
//     // 예시용 정적 데이터; 실제로는 api/… 경로로 fetch해도 됩니다.
//     const termList = [
//       '유튜브', '유튜브 프리미엄', '유튜브 뮤직',
//       '유튜브 광고', '유튜브 수익화', '유튜브 Shorts',
//       '유튜브 다운로드', '유튜브 채널 만들기'
//     ];
  
//     input.addEventListener('input', () => {
//       const q = input.value.trim().toLowerCase();
//       suggestions.innerHTML = '';
//       if (!q) return;
  
//       // 최대 5개까지
//       const matches = termList
//         .filter(term => term.toLowerCase().includes(q))
//         .slice(0, 5);
  
//       matches.forEach(term => {
//         const li = document.createElement('li');
//         li.textContent = term;
//         li.addEventListener('click', () => {
//           input.value = term;
//           suggestions.innerHTML = '';
//           // 여기에 검색 실행 로직 추가 가능
//         });
//         suggestions.appendChild(li);
//       });
//     });
  
//     // 바깥 클릭 시 닫기
//     document.addEventListener('click', e => {
//       if (!e.target.closest('.search-container')) {
//         suggestions.innerHTML = '';
//       }
//     });
//   });
  