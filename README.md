###matchum

matchum is an image matching game for jQuery.

***

###Markup Example
    <style>
      #gameid li{
        position:relative;
      }
    </style>

    <div id="gameId">
      <ul>
        <li><img src="yoursourcepic1"/></li>
        <li><img src="yoursourcepic1"/></li>
        <li><img src="yoursourcepic2"/></li>
        <li><img src="yoursourcepic2"/></li>
      </ul>
      <ul>
        <li><img src="yoursourcepic3"/></li>
        <li><img src="yoursourcepic3"/></li>
        <li><img src="yoursourcepic4"/></li>
        <li><img src="yoursourcepic4"/></li>
      </ul>
      <button id="startBtn">Start</button>
    </div>

Here is a basic example of the HTML markup that you would need.  Organize the main container (div#gameid in this case)
and the ul's and li's however you like for as many pictures as you have/want. Matching pictures MUST appear
next to each other in the list as this is how matches are determined.
Only css restriction is that <li> tags must be position:relative for animations to work.

***

###Javascript Example

    $(function(){
      $('#gameId').matchum();
      $('#startBtn').click(function(){
        $('#matchGame').matchum('start');
      });
    });

***

###Options

These are the default settings for the matchum plugin:

    containerWidth : 500,       // fixed (px)
    containerHeight : 200,      // fixed (px)
    gameTimer : 40,             // timer
    cardBack: './images/n.png', // image for the back of cards
  
***

###Methods

These are the public methods

    start                       // trigger start of new game
    end                         // force end of a game
    time                        // returns time left in current game *not being used yet but leaving for future enhancements
    debug                       // returns config object for tinkering
    destroy                     // remove the matchum game, destroying entire game element

***

**v1.0** - 11/07/2013

- First release
