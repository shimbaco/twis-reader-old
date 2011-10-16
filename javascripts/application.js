(function () {

  var searchTweets = function (keywords, tweets, callback) {
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
          searchTweets(keywords, tweets, callback);
        }
      });
    }
  };

  var getUnreadTweets = function (tweets) {
    var readTweets = JSON.parse(localStorage['readTweets'] || '[]')
      , unreadTweets = [];

    $.each(tweets, function (index, tweet) {
      if (readTweets.indexOf(tweet.id) === -1) {
        unreadTweets.push(tweet);
        readTweets.push(tweet.id);
        localStorage['readTweets'] = JSON.stringify(readTweets);
      }
    });
    return unreadTweets;
  };

  var showTweets = function (callback) {
    var keywords = Twis.getKeywords()
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

    searchTweets(keywords, function (tweets) {
      $('#loading').remove();
      callback(getUnreadTweets(tweets));
    });
  };
  
  showTweets(function (tweets) {
    if (tweets.length === 0) {
      $('ul#tweets').append(
        '<li>no unread tweets.</li>'
      );
    } else {
      $.each(tweets, function (index, tweet) {
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
      });
    }
  });
})();
