;(function ($, window, document, undefined) {
  var pluginName = "readingTime";
  var defaults = {
    bubble: '#scrollbubble',
    post_content: 'article.post'
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this.scroll_timer = null;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      $(window).scroll($.proxy(this.updateTime, this));
    },
    updateTime: function () {
      var total_reading_time = 0,
        bubble = $(this.options.bubble),
        post_content = $(this.options.post_content);
      var viewportHeight = $(window).height(),
       scrollbarHeight = viewportHeight / $(document).height() * viewportHeight,
       progress = $(window).scrollTop() / ($(document).height() - viewportHeight),
       distance = progress * (viewportHeight - scrollbarHeight) + scrollbarHeight / 2 - bubble.height() / 2;
      var total_reading_time = this.calculate_total_time_words(post_content, this.element) / 60;
      var total_reading_time_remaining = total_reading_time - (total_reading_time * progress);

      bubble
        .css('top', distance)
        .text( Math.round(total_reading_time_remaining) + ' minutes left')
        .fadeIn(100)  ;

      // Fade out the annotation after 1 second of no scrolling.
      if (this.scroll_timer !== null) {
        clearTimeout(this.scroll_timer);
      }

      this.scroll_timer = setTimeout(function() {
        bubble.fadeOut();
      }, 1000);
    },
    calculate_total_time_words: function(post_content, element){
      var total = 0;
      post_content.each(function() {
        total += Math.round(60*$(element).text().split(' ').length/200); // 200 = number of words per minute
      });

      return total;
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);