;(function($) {
  var Matchum = function(elem, settings){
    var defaults = {
      containerWidth : 500,    // fixed (px)
      containerHeight : 200,   // fixed (px)
      gameTimer : 40,     // timer
      cardIDs: ['1up-0', '1up-1', 'flower-0', 'flower-1', 'coinTen-0', 'coinTen-1', 'coinTwenty-0', 'coinTwenty-1', 'star-0', 'star-1', 'mushroom-0', 'mushroom-1'], 
      cardBack: './images/n.png',
      startId: 'startBtn',
      errors: true
    },

    //settings
    config = $.extend({}, defaults, settings),

    //globals
    cards = elem.children('ul').children('li'),
    rows = elem.children('ul'),
    cols = elem.children('ul li:first');
    startBtn = elem.find($('#'+config.startId)),
    timeLeft = 0,
    timer = $('<p/>', {
    }).appendTo(elem),

    methods = {

      // start elem animation
      startGame : function() {
        if (core.playing) return;

        //shuffle and hide
        core.animCards();

        // start
        timeLeft = config.gameTimer;
        timer.text(timeLeft);
        core.playing = setInterval(function() {
          timeLeft--;
          timer.text(timeLeft);
          if(timeLeft<=0){
            methods.endGame();  
          }
        }, 1000);
      },

      // stop elem
      endGame : function(msg) {
        clearInterval(core.playing);
        core.playing = 0;
        core.previousCard = 'false';
        if(msg === 'win'){
          timer.text('You Win!');
        }else{
          timer.text('You Lose :(');
          core.flipUp();
        }
      },

      // destroy plugin instance
      destroy : function() {
        // stop autoplay
        methods.endGame();

        // remove
        cards
          .removeClass('found unfound')
          .children()
          .attr('src', '');

        elem
          .remove();
      }
    },

    core = {
      // holds interval counter
      playing : 0,
      //holds picked card
      previousCard : 'false',
      //wait for cards show/hide
      cardFlash : false,

      bindEvents : function() {
        cards.on('click', core.glimpseCard);
        cards.on('cardsMatched', core.cardsMatched);
        startBtn.on('click', methods.startGame);
      },

      createStyles : function() {
        elem
          .width(config.containerWidth)
          .height(config.containerHeight);
      },

      createClasses : function() {
        //give matching cards matching numbers
        cards.each(function(idx, li){
          var set = idx
          if(idx%2!==0){
            set--;
          }
          $(li).attr({
            class: set
          })
        });
      },

      storeImgs : function() {
        //store face img in data of img element
        cards.each(function(idx, li){
          var imgEl = $(li).children('img:first');
          imgEl.data({
            'face': imgEl.attr('src')
          });
        });
      },

      flipDown : function() {
        //hide card
        cards.children('img').attr('src', config.cardBack);
        cards.addClass('unfound').removeClass('found');
      },

      flipUp : function() {
        //show cards
        cards.each(function(){
          var imgEl = $(this).children('img:first');
          imgEl.attr('src', imgEl.data('face'));
        });
        cards.addClass('found').removeClass('unfound');
      },

      glimpseCard : function() {
        //glimpse card, check for match
        if(core.playing && !core.cardFlash){
          var currentCard = $(this);
          currentCard.children('img:first').attr('src', currentCard.children('img:first').data('face'));

          if(core.previousCard === 'false'){
            core.previousCard = currentCard.attr('class').split(' ')[0];
          }else if(core.previousCard === currentCard.attr('class').split(' ')[0]){
            currentCard.children('img:first').attr('src', currentCard.children('img:first').data('face'));
            core.cardsMatched(core.previousCard);
          }else{
            core.cardFlash = true;
            var second = setInterval(function() {
              $('.'+core.previousCard).children('img').attr('src', config.cardBack);
              $('.'+currentCard.attr('class').split(' ')[0]).children('img').attr('src', config.cardBack);
              core.previousCard = 'false';
              core.cardFlash = false;
              clearInterval(second);
            }, 800);
          }
        }  
      },

      cardsMatched : function(pairs) {
        //2 cards matched, check if none left
        cards.filter($('.'+pairs)).addClass('found').removeClass('unfound');
        if(cards.filter($('.unfound')).length === 0){
          methods.endGame('win');
        }
        core.previousCard = 'false';
      },

      shuffleCards : function() {
        //shuffle card elements, reset global cards var
        var tempDeck = cards.clone(true),
        getRandom = function(max) {
            return Math.floor(Math.random() * max);
          },
          shuffled = $.map(tempDeck, function(){
            var random = getRandom(tempDeck.length),
              randEl = $(tempDeck[random]).clone(true)[0];
            tempDeck.splice(random, 1);
            return randEl;
        });
 
        cards.each(function(i){
          $(this).replaceWith($(shuffled[i]));
          $(this).children('img:first').data({
            'face': $(shuffled[i]).children('img:first').data('face'),
          });
        });
        cards = elem.children('ul').children('li');
      },

      animCards : function() {
        //move cards to center of parent, flip, and move to orig. position
        var offset = elem.offset();
          width = elem.width(),
          height = elem.height(),
          centerX = offset.left + width / 2,
          centerY = offset.top + height / 2,
          cardWidth = cards.eq(0).width(),
          cardHeight = cards.eq(0).height();
          
        cards.each(function(){
          var $this = $(this),
            cardOffset = $this.offset(),
            cardX = cardOffset.left + cardWidth/2,
            cardY = cardOffset.top + cardHeight/2;

          //animate cards to center of parent, flip over, return to place, and shuffle
          //shuffle must be last as cards need to know original location to return too
          $this.stop().animate({'left': centerX-cardX, 'top': centerY-cardY}, 'slow', function(){
            core.flipDown();
          }).animate({'left': 0, 'top': 0}, 'slow', function(){
            core.shuffleCards();
          });
        });
        
      },

      init : function() {
        core.bindEvents();
        core.createStyles();
        core.storeImgs();
        core.createClasses();
      }
    };

    // init plugin
    core.init();

    // expose methods
    return methods;

  };

  $.fn.matchum = function(settings) { 
    var elem = this;
    new ImgMatch(elem, settings);
    return this;
  } 
})(jQuery);