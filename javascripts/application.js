(function () {

  window.Twis = {};

  /**
   * Tweet
   */

  var Tweet = function () {};

  Tweet.search = function (keywords, tweets, callback) {
    if (typeof tweets === 'function') {
      callback = tweets;
      tweets = [];
    }

    if (keywords.length === 0) {
      callback(tweets);
    } else {
      $.ajax({
        url: 'https://twitter.com/phoenix_search.phoenix',
        headers: { 'X-Phx': true },
        data: { q: keywords[0], mode: 'relevance' },
        success: function (data) {
          $.each(data.statuses, function (index, tweet) {
            tweets.push(tweet);
          });
          keywords.shift();
          Tweet.search(keywords, tweets, callback);
        }
      });
    }
  };

  Tweet.filter = function (tweets) {
    var readTweets = JSON.parse(localStorage['readTweets'] || '[]')
      , filteredTweets = [];

    $.each(tweets, function (index, tweet) {
      if (readTweets.indexOf(tweet.id) === -1) {
        filteredTweets.push(tweet);
        readTweets.push(tweet.id);
        localStorage['readTweets'] = JSON.stringify(readTweets);
      }
    });

    return filteredTweets;
  };
  
  Tweet.append = function (tweet) {
    $('ul#tweets').append(
      '<li>' +
        '<div class="profile-image">' +
          '<img src="' + tweet.user.profile_image_url + '" height="48" width="48">' +
        '</div>' +
        '<div class="content">' +
          '<div class="name">' +
            '<span class="screen-name">' +
              '<a href="https://twitter.com/#!/' + tweet.user.screen_name + '" target="_blank">' +
                tweet.user.screen_name +
              '</a>' +
            '</span>' +
            '<span class="name">' + tweet.user.name + '</span>' +
          '</div>' +
          '<p>' + tweet.text + '</p>' +
          '<div class="info">' +
            '<a href="https://twitter.com/#!/' + tweet.user.screen_name + '/status/' + tweet.id_str + '" target="_blank">' +
              tweet.created_at +
            '</a>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  };

  Tweet.displayAll = function () {
    var keywords = Keyword.getAll()
      , options = {
          lines: 12,
          length: 7,
          width: 4,
          radius: 10,
          color: '#000',
          speed: 1,
          trail: 60,
          shadow: false
        };
    
    new Spinner(options).spin(document.getElementById('loading'));

    Tweet.search(keywords, function (tweetsObj) {
      var tweets = Tweet.filter(tweetsObj);

      $('#loading').remove();

      if (tweets.length === 0) {
        $('ul#tweets').append(
          '<li>no unread tweets.</li>'
        );
      } else {
        $.each(tweets, function (index, value) {
          Tweet.append(value);
        });
      }
    });
  };

  /**
   * Keyword
   */

  var Keyword = function (keywordStr) {
    this.keywordStr = keywordStr;
  };

  Keyword.getAll = function () {
    var keywordsStr = localStorage['keywords'] || '[]'
      , keywordsAry = JSON.parse(keywordsStr).sort();

    return keywordsAry;
  };

  Keyword.getAllObjects = function () {
    var keywords = Keyword.getAll()
      , keywordsObj = [];

    $.each(keywords, function (index, value) {
      keywordsObj.push(new Keyword(value));
    });

    return keywordsObj;
  };

  Keyword.displayAll = function () {
    var keywordsObj = Keyword.getAllObjects();

    $.each(keywordsObj, function (index, value) {
      value.append();
    });
  };

  Keyword.prototype.save = function () {
    var keywords = Keyword.getAll();

    if (keywords.indexOf(this.keywordStr) === -1) {
      keywords.push(this.keywordStr);
      localStorage['keywords'] = JSON.stringify(keywords);
    }
  };

  Keyword.prototype.append = function () {
    $('ul#keywords').append(
      '<li>' +
        '<span class="delete mimic-links" data-keyword="' + this.keywordStr + '">' +
          'del' +
        '</span>' +
        this.keywordStr +
      '</li>'
    );
  };

  Keyword.prototype.delete = function () {
    var keywords = Keyword.getAll()
      , index = keywords.indexOf(this.keywordStr);

    keywords.splice(index, 1);
    localStorage['keywords'] = JSON.stringify(keywords);
  };
  
  // save
  $('form').delegate('button', 'click', function (e) {
    e.preventDefault();

    var keywordElm = $('#keyword')
      , keywordStr = keywordElm.val();

    keywordElm.val('');

    var keyword = new Keyword(keywordStr);
    keyword.save();
    keyword.append();
  });

  // delete
  $('ul#keywords').delegate('span.delete', 'click', function (e) {
    var currentElm = $(e.currentTarget)
      , keywordStr = currentElm.attr('data-keyword');
    
    if (confirm('delete?')) {
      var keyword = new Keyword(keywordStr);
      keyword.delete();
      currentElm.parent().remove();
    }
  });


  Twis.Tweet = Tweet;
  Twis.Keyword = Keyword;
})();
