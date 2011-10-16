(function () {

  var saveKeyword = function (keyword) {
    var keywords = Twis.getKeywords();

    if (keywords.indexOf(keyword) === -1) {
      keywords.push(keyword);
      localStorage['keywords'] = JSON.stringify(keywords);
    }
  };

  var appendKeyword = function (keyword) {
    $('ul#keywords').append(
      '<li>' +
        '<span class="delete mimic-links" data-keyword="' + keyword + '">' +
          'del' +
        '</span>' +
        keyword +
      '</li>'
    );
  };

  var deleteKeyword = function (keyword) {
    var keywords = Twis.getKeywords()
      , index = keywords.indexOf(keyword);

    keywords.splice(index, 1);
    localStorage['keywords'] = JSON.stringify(keywords);
  };
  
  // save
  $('form').delegate('button', 'click', function (e) {
    e.preventDefault();

    var keywordElm = $('#keyword')
      , keyword = keywordElm.val();

    keywordElm.val('');
    saveKeyword(keyword);
    appendKeyword(keyword);
  });

  // delete
  $('ul#keywords').delegate('span.delete', 'click', function (e) {
    var currentElm = $(e.currentTarget)
      , keyword = currentElm.attr('data-keyword');
    
    if (confirm('delete?')) {
      deleteKeyword(keyword);
      currentElm.parent().remove();
    }
  });

  // display
  var keywords = Twis.getKeywords().sort();

  $.each(keywords, function (index, value) {
    appendKeyword(value);
  });
})();
