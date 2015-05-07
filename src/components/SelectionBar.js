    /**
     * This is the bar with the selection of the RangeSlider
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.SelectionBar = function(player, options) {
        this.player = player;
        this.options = options;
        this.fired = false;
        this.suspend_fired = false;
    };

    //  videojs.Component.extend({
    //     /** @constructor */
    //     init: function(player, options) {
    //         videojs.Component.call(this, player, options);
    //         this.on('mouseup', this.onMouseUp);
    //         this.fired = false;
    //         this.suspend_fired = false;
    //     }
    // });

    // videojs.SelectionBar.prototype.createEl = function() {
    //     return videojs.Component.prototype.createEl.call(this, 'div', {
    //         className: 'vjs-selectionbar-RS'
    //     });
    // };

    videojs.SelectionBar.prototype.elEx = function() {
        this.$el = $('<div class="vjs-selectionbar-RS"></div>');

        return this.$el;
    };

    videojs.SelectionBar.prototype.onMouseUp = function() {
        var start = this.rs.left.el_.style.left.replace("%", ""),
            end = this.rs.right.el_.style.left.replace("%", ""),
            duration = this.player_.duration(),
            precision = this.rs.updatePrecision,
            segStart = videojs.round(start * duration / 100, precision),
            segEnd = videojs.round(end * duration / 100, precision);
        //this.player_.currentTime(segStart); // disabled for now, because each time clicked - was playing from "start_time"
        if ( this.rs.options.locked ) {
          this.player_.play();
        };
        this.rs.bar.activatePlay(segStart, segEnd);
    };

    videojs.SelectionBar.prototype.updateLeftEx = function(left, $leftEl, $rightEl, seekRSBar) {
        // console.log("selectionBar", this.$el);
        // console.log("this offset =", this.$el.offset().left);
        // console.log("$rightEl", $rightEl);
        // console.log("$rightEl.offset().left = ",$rightEl.offset().left);
        var seekRSBarOffset = this.$el.offset().left != '' ? this.$el.offset().left : 0;
        var rightLine = $rightEl.find(".vjs-selectionbar-line-RS").offset().left;
        // console.log($rightEl.style.cssText);
        // console.log("rightline = ", $rightEl.find(".vjs-selectionbar-arrow-RS"));
        var rightVal = $rightEl.offset().left != '' ? $rightEl.offset().left : 100;
        var seekBarWidth = this.$el.width();
        rightVal = ( rightLine - seekRSBarOffset ) / seekBarWidth;
        // var right = parseFloat(rightVal) / 100;
        // console.log(left);
        var right = parseFloat(rightVal)
        // console.log(right);
        seekRSBar.RightBarPosition = right - 0.00001;
        seekRSBar.LeftBarPosition = 0.00001;

        var width = videojs.round((right - left), 3); //round necessary for not get 0.6e-7 for example that it's not able for the html css width

        //(right+0.00001) is to fix the precision of the css in html
        if (left <= (right + 0.00001)) {
            //seekRSBar.$el.offset().left = (left * 100) + '%';
            seekRSBar.$el.css({ left: (left * 100) + '%' });
            seekRSBar.$el.width((width * 100) + '%');
            return true;
        }
        return false;
    };

    videojs.SelectionBar.prototype.updateRightEx = function(right, $leftEl, $rightEl, seekRSBar) {
        console.log("updateRightEx - seekRSBar.leftBarPosition",seekRSBar.LeftBarPosition);
        console.log("this.$el",this.$el);
        var seekRSBarOffset = this.$el.offset().left != '' ? this.$el.offset().left : 0;
        var leftLine = $leftEl.children(".vjs-selectionbar-line-RS").offset().left;
        var leftHandleBarWidth = $leftEl.children(".vjs-selectionbar-line-RS").outerWidth();
        console.log("$leftEl", $leftEl);
        var leftVal = $leftEl.offset().left != '' ? $leftEl.offset().left : 0;
        var seekBarWidth = this.$el.width();

        leftVal = (leftLine + leftHandleBarWidth - seekRSBarOffset) / seekBarWidth;

        // var left = parseFloat(leftVal) / 100;
        var left = parseFloat(leftVal);
        console.log("left value = ", left);
        console.log("right value = ", right);
        seekRSBar.LeftBarPosition = left + 0.00001;
        seekRSBar.RightBarPosition = 0.99999;

        var width = videojs.round((right - left), 3); //round necessary for not get 0.6e-7 for example that it's not able for the html css width

        //(right+0.00001) is to fix the precision of the css in html
        if ((right + 0.00001) >= left) {
            seekRSBar.$el.width((width * 100) + '%');
            seekRSBar.$el.css({ left: ((right - width) * 100) + '%' });

            return true;
        }
        return false;
    };

    videojs.SelectionBar.prototype.activatePlay = function(start, end) {
        this.timeStart = start;
        this.timeEnd = end;
        this.suspendPlay();

        this.player.on("timeupdate", videojs.bind(this, this._processPlay));
    };

    videojs.SelectionBar.prototype.suspendPlay = function() {
        this.fired = false;
        this.suspend_fired = false;

        this.player.off("timeupdate", videojs.bind(this, this._processPlay));
    };

    videojs.SelectionBar.prototype._processPlay = function() {
          
      var current_time, current_variable, current_actual;
        //Check if current time is between start and end
      //if (this.rs.options.isMobile) {
      var current_position = this.player.currentTime()
      if (!this.fired) { 
        current_variable = this.player.controlBar.currentTimeDisplay.current_time;
        current_position = this.player.currentTime();
        if ( (current_position < (current_variable - 1.0)) || ( current_position > (current_variable + 1.0))) {
          return;
        }
      } else
        current_position = this.player.currentTime();
        
      if (current_position < this.timeStart ) {
        this.fired = false; //Set fired flag to true
        return;
      }
        if (current_position >= this.timeStart && (this.timeEnd < 0 || current_position < this.timeEnd)) {
            if (this.fired) { //Do nothing if start has already been called
                return;
            }
            this.fired = true; //Set fired flag to true
        } else {
            if (!this.fired || this.suspend_fired) { //Do nothing if end has already been called
                return;
            }
            this.fired = false; //Set fired flat to false
            console.log("processPlay: PAUSING");
            this.player.pause(); //Call end function
            
            //if ( this.rs.options.locked) {
                this.player.currentTime(this.timeEnd);
            //}
            this.suspendPlay();
        }
    };

    videojs.SelectionBar.prototype.process_loop = function() {
        var player = this.player;

        if (player && this.looping ) {
            var current_time = player.currentTime();

            if (current_time < this.timeStart || this.timeEnd > 0 && this.timeEnd < current_time) {
                player.currentTime(this.timeStart);
            }
        }
    };