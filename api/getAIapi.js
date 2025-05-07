async function compareTagsWithApi(firstWord, secondWord) {
  const openApiURL = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
  const access_key = 'b5824ea9-9807-4035-a747-d81d32b6df46';

  const requestJson = {
      'argument': {
          'first_word': firstWord,
          'second_word': secondWord
      }
  };

  const response = await fetch(openApiURL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': access_key
      },
      body: JSON.stringify(requestJson)
  });

  const data = await response.json();
  return data; // 유사도 정보가 포함된 데이터 반환
}

// 예시로 두 단어의 유사도를 계산하는 함수
async function getTagSimilarity(tag1, tag2) {
  const data = await compareTagsWithApi(tag1, tag2);
  
  // 예시로 유사도 정보를 활용 (ETRI API에서 제공하는 유사도 값 사용)
  const similarityScore = data.result.scores;  // 유사도 점수 (API 응답에 따라 다를 수 있음)
  return similarityScore;
} 