(function () {
  var Twis = window.Twis = {};

  Twis.getKeywords = function () {
    var keywordsStr = localStorage['keywords'] || '[]'
      , keywords = JSON.parse(keywordsStr);

    return keywords;
  };
})();
