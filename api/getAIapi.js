var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
var access_key = 'b5824ea9-9807-4035-a747-d81d32b6df46';
var firstWord = '';
var secondWord = '';

var requestJson = {
    'argument': {
        'first_word': firstWord,        
        'second_word': secondWord       
    }
};

fetch(openApiURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': access_key
    },
    body: JSON.stringify(requestJson)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => console.error(error));  