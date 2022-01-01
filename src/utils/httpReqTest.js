//  (characterName, numOfCards)
const httpReq = (url) => {
    if(base url){
        return fetch(buildURL())
        .then((response) => response.json())
        .then((allCharacters) => allCharacters.info.count);
    }else if ("comma seperated list"){
        return fetch(buildURL(`${characterIds.join(",")}`))
        .then((response) => response.json())
        .then((characters) => {
          return getCardModels(characters);
         
        });
    }else if (has params name and page){
    return fetch(buildURL(`page=${page}&name=${characterName}`));
    })
    .then((response) => response.json())
    .then((data) => {
      const characterIds = uniqueNumbers(numOfCards, data.results.length);
      const cards = getCardModels(data.results, characterIds);
      return { cards, page };
    });
    }
    else if (has params name){
    return fetch(buildURL(`name=${characterName}`))
    .then((response) => {
      return response.json();
    })
    .then((character) => {
      page = Math.floor(Math.random() * character.info.pages) + 1;
      return page;
    }

     
};
