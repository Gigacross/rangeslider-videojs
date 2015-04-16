    /**
     * This is the right arrow to select the RangeSlider
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.SelectionBarRight = function() {
      this.pressed = false;
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

    videojs.SelectionBarRight.prototype.show = function() {
      //todo
    };

    videojs.SelectionBarRight.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    videojs.SelectionBarRight.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-rangeslider-handle vjs-selectionbar-right-RS',
            innerHTML: '<div class="vjs-selectionbar-arrow-RS"></div><div class="vjs-selectionbar-line-RS"><span class="vjs-time-text">0:00</span></div>'
        });
    };

    videojs.SelectionBarRight.prototype.elEx = function() {
      this.$timeText = $('<span class="vjs-time-text">0:00</span>');

      this.$el = $('<div class="vjs-rangeslider-handle vjs-selectionbar-right-RS"></div>')
                                        .append('<div class="vjs-selectionbar-arrow-RS"></div>')
                                        .append($('<div class="vjs-selectionbar-line-RS">')
                                                    .append(this.$timeText));
      var that = this;

      //this.$el.on('mousedown', function(event) { that.onMouseDown(event); });

      return this.$el;
    };

    videojs.SelectionBarRight.prototype.setLocation = function(locationDetails) {
      this.$el.css({ left: locationDetails.left });

      this.$timeText.text(locationDetails.text);
    };

    videojs.SelectionBarRight.prototype.onMouseDown = function(event) {

      var RSTBX, handleW, box;

        event.preventDefault();
        //videojs.blockTextSelection();
        this.pressed = true;
        videojs.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        videojs.on(document, "touchend", videojs.bind(this, this.onMouseUp));
        videojs.on(document, "touchcancel", videojs.bind(this, this.onMouseUp));
        if (!this.rs.options.locked) {
            
            videojs.addClass(this.el_, 'active');
          
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

    videojs.SelectionBarRight.prototype.onMouseUp = function(event) {
        videojs.off(document, "mouseup", this.onMouseUp, false);
        videojs.off(document, "touchend", this.onMouseUp, false);
        videojs.off(document, "touchcancel", this.onMouseUp, false);
        videojs.removeClass(this.el_, 'active');
        this.pressed = false;
        //this.rs.box.offsetX = 0;
 
    };
