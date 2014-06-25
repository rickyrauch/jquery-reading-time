;(function ($, window, document, undefined) {
  
  var pluginName = "readingTime";

  var available_lang = new Array('en', 'fr');

  var text_lang = {
    'en' :
      {'min_left': ' minutes left',
      'thanks': 'Thanks for reading',
      'end_reading': 'Less than a minute'},
    'fr' :
      {'min_left': ' minutes restantes',
      'thanks': 'Merci d\'avoir lu mon article',
      'end_reading': 'Moins d\'une minute'}
  };

  var defaults = {
    bubble: '#scrollbubble',
    lang: 'en'
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
      $('<div id="scrollbubble"></div>').appendTo("body");
      $('<style>#scrollbubble{display:none;position:fixed;top:0;right:20px;z-index:500;background-color:#000;color:#fff;border-radius:3px;font-family:Georgia;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:3px 8px}#scrollbubble:after{content:" ";position:absolute;top:50%;right:-8px;height:0;width:0;margin-top:-4px;border:4px solid transparent;border-left-color:#000}</style>').appendTo('body');
    },
    updateTime: function () {
      var total_reading_time = 0,
        bubble = $(this.options.bubble),
        lang = ( -1 != $.inArray(this.options.lang, available_lang)) ? this.options.lang : available_lang[0],
        post_content = $(this.element);
      var viewportHeight = $(window).height(),
       scrollbarHeight = viewportHeight / $(document).height() * viewportHeight,
       progress = $(window).scrollTop() / ($(document).height() - viewportHeight),
       distance = progress * (viewportHeight - scrollbarHeight) + scrollbarHeight / 2 - bubble.height() / 2;
      var total_reading_time = this.calculate_total_time_words(post_content, this.element) / 60;
      var total_reading_time_remaining = Math.ceil(total_reading_time - (total_reading_time * progress));
      var text = '';

      if(total_reading_time_remaining > 1) {
        text = total_reading_time_remaining + text_lang[lang].min_left;
      } else if(progress >= 1) {
        text = text_lang[lang].thanks;
      } else if (total_reading_time_remaining <= 1) {
        text = text_lang[lang].end_reading;
      }

      bubble
        .css('top', distance)
        .text(text)
        .fadeIn(100);

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
