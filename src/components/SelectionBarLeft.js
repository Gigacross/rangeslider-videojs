    /**
     * This is the left arrow to select the RangeSlider
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.SelectionBarLeft = function() {};

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

    videojs.SelectionBarLeft.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-rangeslider-handle vjs-selectionbar-left-RS',
            innerHTML: '<div class="vjs-selectionbar-arrow-RS"></div><div class="vjs-selectionbar-line-RS"><span class="vjs-time-text">0:00</span></div>'
        });
    };

    videojs.SelectionBarLeft.prototype.onMouseDown = function(event) {
      
      var RSTBX, handleW, box;
       
        event.preventDefault();
        videojs.blockTextSelection();
        this.pressed = true;
        videojs.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        videojs.on(document, "touchend", videojs.bind(this, this.onMouseUp));
        videojs.on(document, "touchcancel", videojs.bind(this, this.onMouseUp));
        if (!this.rs.options.locked) {
            
            videojs.addClass(this.el_, 'active');

            // Adjusted X and Width, so handle doesn't go outside the bar         
          if (event.changedTouches === undefined) {
            handleW = this.rs.left.el_.offsetWidth; 
            RSTBX = videojs.findPosition(this.el_).left + (handleW / 2);
              this.rs.box.offsetX = event.pageX  - RSTBX;
            } else {
              box = this.el_.getBoundingClientRect();
              this.rs.box.offsetX = event.changedTouches[0].pageX - box.left;
 
            }
          this.rs.box.offsetX2 = this.rs.box.offsetX;  
          this.rs.box.debug_pause = this.player_.paused();
            this.rs.box.debug_pause_flag = true;

        } 
    };

    videojs.SelectionBarLeft.prototype.onMouseUp = function(event) {
        videojs.off(document, "mouseup", this.onMouseUp, false);
        videojs.off(document, "touchend", this.onMouseUp, false);
        videojs.off(document, "touchcancel", this.onMouseUp, false);
        videojs.removeClass(this.el_, 'active');
        this.pressed = false;
        if (this.rs.options.locked) {
            this.rs.playBetween(this.rs.start,this.rs.end);
        } 


        this.rs.box.offsetX = 0;
    };