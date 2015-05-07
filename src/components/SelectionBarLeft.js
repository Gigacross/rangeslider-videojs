    /**
     * This is the left arrow to select the RangeSlider
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.SelectionBarLeft = function(player, options) {

      this.player = player;

      this.options = options;
    };

    videojs.SelectionBarLeft.prototype.show = function() {
      //todo
    };

    // videojs.Component.extend({
    //     /** @constructor */
    //     init: function(player, options) {
    //         videojs.Component.call(this, player, options);
    //         this.on('mousedown', this.onMouseDown);
    //         this.on('touchstart', this.onMouseDown);
    //         this.pressed = false;
    //     }
    // });

    videojs.SelectionBarLeft.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    // videojs.SelectionBarLeft.prototype.createEl = function() {
    //     return videojs.Component.prototype.createEl.call(this, 'div', {
    //         className: 'vjs-rangeslider-handle vjs-selectionbar-left-RS',
    //         innerHTML: '<div class="vjs-selectionbar-arrow-RS"></div><div class="vjs-selectionbar-line-RS"><span class="vjs-time-text">0:00</span></div>'
    //     });
    // };

    videojs.SelectionBarLeft.prototype.elEx = function() {
      this.$timeText = $('<span class="vjs-time-text">0:00</span>');

      this.$el = $('<div class="vjs-rangeslider-handle vjs-selectionbar-left-RS"></div>')
                    .append('<div class="vjs-selectionbar-arrow-RS"></div>')
                    .append($('<div class="vjs-selectionbar-line-RS">').append(this.$timeText));
      var that = this;

      this.$el.on('mousedown', function(event) { that.onMouseDown(event); });
      this.$el.on('mouseup', function(event){ that.onMouseUp(event); })
      return this.$el;
    };

    videojs.SelectionBarLeft.prototype.setLocation = function(locationDetails) {
      this.$el.css({ left: locationDetails.left });

      this.$timeText.text(locationDetails.text);
    };

    videojs.SelectionBarLeft.prototype.onMouseDown = function(event) {
      console.log('SelectionBarLeft - onMouseDown');
      
      var RSTBX, handleW, box;
       
        event.preventDefault();
        //videojs.blockTextSelection();
        this.pressed = true;
        console.log(this);
        console.log(this.pressed);
        // videojs.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        // videojs.on(document, "touchend", videojs.bind(this, this.onMouseUp));
        // videojs.on(document, "touchcancel", videojs.bind(this, this.onMouseUp));
        if (!this.player.rangeslider.options.locked) {
            
           // videojs.addClass(this.el_, 'active');

            // Adjusted X and Width, so handle doesn't go outside the bar         
          if (event.changedTouches === undefined) {
            handleW = this.$el.width(); 
            RSTBX = this.$el.offset().left + (handleW / 2);
              this.player.rangeslider.rstb.SeekRSBar.offsetX = event.pageX  - RSTBX;
            } else {
              box = this.$el.getBoundingClientRect();
              this.player.rangeslider.rstb.SeekRSBar.offsetX = event.changedTouches[0].pageX - box.left;
 
            }
          this.player.rangeslider.rstb.SeekRSBar.offsetX2 = this.player.rangeslider.rstb.SeekRSBar.offsetX;  

          this.player.rangeslider.rstb.SeekRSBar.debug_pause = this.player.paused();
          this.player.rangeslider.rstb.SeekRSBar.debug_pause_flag = true;

        }
    };

    videojs.SelectionBarLeft.prototype.onMouseUp = function(event) {
        // videojs.off(document, "mouseup", this.onMouseUp, false);
        // videojs.off(document, "touchend", this.onMouseUp, false);
        // videojs.off(document, "touchcancel", this.onMouseUp, false);
        console.log("selectionBarLeft onMouseUp")
        console.log("this.pressed = ", this.pressed)
        // videojs.removeClass(this.el_, 'active');
        this.pressed = false;
        // if (this.rs.options.locked) {
        //     this.rs.playBetween(this.rs.start,this.rs.end);
        // } 


        this.rs.box.offsetX = 0;
    };