        /**
         * Seek Range Slider Bar and holder for the selection bars
         * @param {videojs.Player|Object} player
         * @param {Object=} options
         * @constructor
         */
        videojs.SeekRSBar = function(player, options, rangeSlider) {
            this.player = player;
            this.options = options;
            this.rs = rangeSlider;
        };

        // videojs.Component.extend({
        //     /** @constructor */
        //     init: function(player, options) {
        //         videojs.Component.call(this, player, options);
        //         this.on('mousedown', this.onMouseDown);
        //         this.on('touchstart', this.onMouseDown);          
        //         this.offsetX = 0;
        //         this.offsetX2 = 0;
        //         this.debug_handlel = 0;
        //         this.debug_handler = 0;
        //         this.debug_pause = false;
        //         this.debug_pause_flag = false;
        //         this.RightBarPosition = .9999;
        //         this.LeftBarPosition = 0.00001;

                
        //     }
        // });

        videojs.SeekRSBar.prototype.createEl = function() {
            return videojs.Component.prototype.createEl.call(this, 'div', {
                className: 'vjs-rangeslider-holder'
            });
        };

        videojs.SeekRSBar.prototype.elEx = function(player, options) {
            var holder = $('<div class="vjs-rangeslider-holder"></div>');

            var selectionBar = new videojs.SelectionBar(player, options);
            this.SelectionBar = selectionBar;

            var selectionBarLeft = new videojs.SelectionBarLeft(player, options);
            this.SelectionBarLeft = selectionBarLeft;

            var selectionBarRight = new videojs.SelectionBarRight(player, options);
            this.SelectionBarRight = selectionBarRight;

            var timePanel = new videojs.TimePanel(player, options);
            this.TimePanel = timePanel;

            holder.append(selectionBar.elEx());
            holder.append(selectionBarLeft.elEx());
            holder.append(selectionBarRight.elEx());
            holder.append(timePanel.elEx());

            this.$el = holder;

            return holder;
        };

        videojs.SeekRSBar.prototype.lock = function() {
            this.$el.addClass('locked');
        };

        videojs.SeekRSBar.prototype.unLock = function() {
            this.$el.removeClass('locked');
        };

        videojs.SeekRSBar.prototype.onMouseDown = function(event) {

            event.preventDefault();
            videojs.blockTextSelection();

            if (!this.rs.options.locked) {
                videojs.on(document, "mousemove", videojs.bind(this, this.onMouseMove));
                videojs.on(document, "touchmove", videojs.bind(this, this.onMouseMove));
                videojs.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
                videojs.on(document, "touchend", videojs.bind(this, this.onMouseUp));
                videojs.on(document, "touchcancel", videojs.bind(this, this.onMouseUp));

            } //else {
            //  videojs.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
             //   videojs.on(document, "touchend", videojs.bind(this, this.onMouseUp));
             //   videojs.on(document, "touchcancel", videojs.bind(this, this.onMouseUp));

           // }
        };

        videojs.SeekRSBar.prototype.onMouseUp = function(event) {

            videojs.off(document, "mousemove", this.onMouseMove, false);
            videojs.off(document, "touchmove", this.onMouseMove, false);
            videojs.off(document, "mouseup", this.onMouseUp, false);
            videojs.off(document, "touchend", this.onMouseUp, false);
            videojs.off(document, "touchcancel", this.onMouseUp, false);

        };

        videojs.SeekRSBar.prototype.onMouseMove = function(event) {

            var left = this.calculateDistance(event);


            if (this.rs.left.pressed) 
                this.setPosition(0, left);
            else if (this.rs.right.pressed) 
                this.setPosition(1, left);

            //Fix a problem with the presition in the display time
    //        var currentTimeDisplay = this.player_.controlBar.currentTimeDisplay.content;
    //        currentTimeDisplay.innerHTML = '<span class="vjs-control-text">Current Time </span>' + vjs.formatTime(this.rs._seconds(left), this.player_.duration());

            // Trigger slider change
            if (this.rs.left.pressed || this.rs.right.pressed) {
                this.rs._triggerSliderChange();
            }
        };

        videojs.SeekRSBar.prototype._isFullscreen = function() {
            return this.player.isFullscreen();
        };

        videojs.SeekRSBar.prototype.setPosition = function(index, left, writeControlTime) {
            var writeControlTime = typeof writeControlTime != 'undefined' ? writeControlTime : true;
            //index = 0 for left side, index = 1 for right side
            var index = index || 0;

            // Position shouldn't change when handle is locked
            if (this.player.rangeslider.options.locked)
                return false;

            // Check for invalid position
            if (isNaN(left))
                return false;

            // Check index between 0 and 1
            if (!(index === 0 || index === 1))
                return false;

            var ObjLeft = this.SelectionBarLeft.$el, 
                ObjRight = this.SelectionBarRight.$el, 
                tpr = this.$TimePanelRight,
                tpl = this.$TimePanelLeft,
                bar = this.SelectionBar;
                

            var movingSelectionBar;

            if (index === 0) {
                movingSelectionBar = this.SelectionBarLeft;
            } else {
                movingSelectionBar = this.SelectionBarRight;
            }

            //Check if left arrow is passing the right arrow
            if ((index === 0 ? bar.updateLeftEx(left, ObjLeft, ObjRight, this) : bar.updateRightEx(left, ObjLeft, ObjRight, this))) {
                var TimeText = this.formatTime(this.rs._seconds(left));
                
                movingSelectionBar.setLocation({
                    left: (left * 100) + '%',
                    text: TimeText
                });

                index === 0 ? bar.updateLeftEx(left, ObjLeft, ObjRight, this) : bar.updateRightEx(left, ObjLeft, ObjRight, this);

                //this.rs[index === 0 ? 'start' : 'end'] = this.rs._seconds(left);

                //Fix the problem  when you press the button and the two arrow are underhand
                //left.zIndex = 10 and right.zIndex=20. This is always less in this case:
                if (index === 0) {
                    if ((left) >= 0.9)
                        ObjLeft.css({'z-index' : '25'}); 
                    else
                        ObjLeft.css({'z-index' : '10'}); 
                }

                //Fix for BUG #120. Realign margin-left for left tab
                if (index === 0) {
                  if (TimeText.length <= 4) {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left", "-3.4em" );
                  } else if (TimeText.length <= 5) {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left", "-3.95em" );
                  } else {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left" , "-4.75em" );
                  }
                }

                //this._updateTimePanel();
           
            }
            return true;
        };

    videojs.SeekRSBar.prototype._updateTimePanel = function(index) {
        //var ctp = this.rs[index === 0 ? 'ctpl' : 'ctpr'].el_;

        //-- Panel
        var tplTextLegth = this.TimePanel.leftLength();

        var MaxP, MinP, MaxDisP;
        if (tplTextLegth <= 4) //0:00
            MaxDisP = this._isFullscreen ? 3.25 : 6.5;
        else if (tplTextLegth <= 5) //00:00
            MaxDisP = this._isFullscreen ? 4 : 8;
        else //0:00:00
            MaxDisP = this._isFullscreen ? 5 : 10;
        if (TimeText.length <= 4) { //0:00
            MaxP = this._isFullscreen ? 97 : 93;
            MinP = this._isFullscreen ? 0.1 : 0.5;
        } else if (TimeText.length <= 5) { //00:00
            MaxP = this._isFullscreen ? 96 : 92;
            MinP = this._isFullscreen ? 0.1 : 0.5;
        } else { //0:00:00
            MaxP = this._isFullscreen ? 95 : 91;
            MinP = this._isFullscreen ? 0.1 : 0.5;
        }
        
        if (index === 0) {
            this.TimePanel.setLeftPanel({
                left: Math.max(MinP, Math.min(MaxP, (left * 100 - MaxDisP / 2))) + '%',
                text: TimeText
            });
        } else {
            this.TimePanel.setRightPanel({

            });
        }
        //-- Control Time
        if (writeControlTime) {
            var time = TimeText.split(":"),
                h, m, s;
            if (time.length == 2) {
                h = 0;
                m = time[0];
                s = time[1];
            } else {
                h = time[0];
                m = time[1];
                s = time[2];
            }
        // ctp.children[0].value = h;
        // ctp.children[1].value = m;
        // ctp.children[2].value = s;
        }
        
    };

    videojs.SeekRSBar.prototype.formatTime = function(seconds, guide) {
      // Default to using seconds as guide
      guide = guide || seconds;
      var s = Math.floor(seconds % 60),
          m = Math.floor(seconds / 60 % 60),
          h = Math.floor(seconds / 3600),
          gm = Math.floor(guide / 60 % 60),
          gh = Math.floor(guide / 3600);

      // handle invalid times
      if (isNaN(seconds) || seconds === Infinity) {
        // '-' is false for all relational operators (e.g. <, >=) so this setting
        // will add the minimum number of fields specified by the guide
        h = m = s = '-';
      }

      // Check if we need to show hours
      h = (h > 0 || gh > 0) ? h + ':' : '';

      // If hours are showing, we may need to add a leading zero.
      // Always show at least one digit of minutes.
      m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':';

      // Check if leading zero is need for seconds
      s = (s < 10) ? '0' + s : s;

      return h + m + s;
    };

    videojs.SeekRSBar.prototype.calculateDistance = function(event) {
        var rstbX = this.getRSTBX();
        var rstbW = this.getRSTBWidth();
        var handleW = this.getWidth();
        var cursorPosition;
        var left;

        //getRSTBX videojs.findPosition(this.el_).left;
        
        // Adjusted X and Width, so handle doesn't go outside the bar
        rstbX = rstbX + (handleW / 2);
        rstbW = rstbW - handleW;
        
        cursorPosition = event.pageX - this.offsetX;
        this.debug_handlel = rstbX;
        this.debug_handler = rstbW;
        left = Math.max(0, Math.min(1, (cursorPosition - rstbX) / rstbW)); 
              
        // Percent that the click is through the adjusted area
        
        return left;
    };

    videojs.SeekRSBar.prototype.getRSTBWidth = function() {
        return this.el_.offsetWidth;
    };
    videojs.SeekRSBar.prototype.getRSTBX = function() {
        return videojs.findPosition(this.el_).left;
    };
    videojs.SeekRSBar.prototype.getWidth = function() {
        return this.rs.left.el_.offsetWidth; //does not matter left or right
    };