        /**
         * Seek Range Slider Bar and holder for the selection bars
         * @param {videojs.Player|Object} player
         * @param {Object=} options
         * @constructor
         */
        videojs.SeekRSBar = videojs.Component.extend({
            /** @constructor */
            init: function(player, options) {
                videojs.Component.call(this, player, options);
                this.on('mousedown', this.onMouseDown);
                this.on('touchstart', this.onMouseDown);          
                this.offsetX = 0;
                this.offsetX2 = 0;
                this.debug_handlel = 0;
                this.debug_handler = 0;
                this.debug_pause = false;
                this.debug_pause_flag = false;
                this.RightBarPosition = .9999;
                this.LeftBarPosition = 0.00001;

                
            }
        });

        // videojs.SeekRSBar.prototype.init_ = function(rangeslider) {
        //     this.rs = rangeslider;
        // };

        // videojs.SeekRSBar.prototype.options_ = {
        //     children: {
        //         'SelectionBar': {},
        //         'SelectionBarLeft': {},
        //         'SelectionBarRight': {},
        //         'TimePanel': {},
        //     }
        // };

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
            this.addChild(timePanel);
            this.TimePanel = timePanel;

            var selectionBar = $('<div class="vjs-selectionbar-RS"></div>');
            var selectionBarLeft = $('<div class="vjs-rangeslider-handle vjs-selectionbar-left-RS"></div>')
                                        .append('<div class="vjs-selectionbar-arrow-RS"></div><div class="vjs-selectionbar-line-RS"><span class="vjs-time-text">0:00</span></div>');

            selectionBarLeft.on('click', function() { alert('blah - kenneth'); });

            var selectionBarRight = $('<div class="vjs-rangeslider-handle vjs-selectionbar-right-RS"></div>')
                                        .append('<div class="vjs-selectionbar-arrow-RS"></div><div class="vjs-selectionbar-line-RS"><span class="vjs-time-text">0:00</span></div>');


            var timePanel = $('<div class="vjs-timepanel-RS"></div>');

            var timePanelLeft = $('<div class="vjs-timepanel-left-RS"><span class="vjs-time-text">00:00</span></div>');
            var timePanelRight = $('<div class=""><span class="vjs-time-text">00:00</span></div>');

            timePanel.append(timePanelLeft);
            timePanel.append(timePanelRight);

            holder.append(selectionBar);
            holder.append(selectionBarLeft);
            holder.append(selectionBarRight);
            holder.append(timePanel);

            this.$el = holder;

            return holder;
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

        videojs.SeekRSBar.prototype.setPosition = function(index, left, writeControlTime) {
            var writeControlTime = typeof writeControlTime != 'undefined' ? writeControlTime : true;
            //index = 0 for left side, index = 1 for right side
            var index = index || 0;

            // Position shouldn't change when handle is locked
            if (this.rs.options.locked)
                return false;

            // Check for invalid position
            if (isNaN(left))
                return false;

            // Check index between 0 and 1
            if (!(index === 0 || index === 1))
                return false;

            // Alias
            var ObjLeft = this.rs.left.el_,
                ObjRight = this.rs.right.el_,
                Obj = this.rs[index === 0 ? 'left' : 'right'].el_,
                tpr = this.rs.tpr.el_,
                tpl = this.rs.tpl.el_,
                bar = this.rs.bar,
                ctp = this.rs[index === 0 ? 'ctpl' : 'ctpr'].el_;

            //Check if left arrow is passing the right arrow
            if ((index === 0 ? bar.updateLeft(left) : bar.updateRight(left))) {
                Obj.style.left = (left * 100) + '%';
                index === 0 ? bar.updateLeft(left) : bar.updateRight(left);

                this.rs[index === 0 ? 'start' : 'end'] = this.rs._seconds(left);

                //Fix the problem  when you press the button and the two arrow are underhand
                //left.zIndex = 10 and right.zIndex=20. This is always less in this case:
                if (index === 0) {
                    if ((left) >= 0.9)
                        ObjLeft.style.zIndex = 25;
                    else
                        ObjLeft.style.zIndex = 10;
                }

                //-- Panel
                var TimeText = videojs.formatTime(this.rs._seconds(left)),
                    tplTextLegth = tpl.children[0].innerHTML.length;
                var MaxP, MinP, MaxDisP;
                if (tplTextLegth <= 4) //0:00
                    MaxDisP = this.player_.isFullScreen ? 3.25 : 6.5;
                else if (tplTextLegth <= 5) //00:00
                    MaxDisP = this.player_.isFullScreen ? 4 : 8;
                else //0:00:00
                    MaxDisP = this.player_.isFullScreen ? 5 : 10;
                if (TimeText.length <= 4) { //0:00
                    MaxP = this.player_.isFullScreen ? 97 : 93;
                    MinP = this.player_.isFullScreen ? 0.1 : 0.5;
                } else if (TimeText.length <= 5) { //00:00
                    MaxP = this.player_.isFullScreen ? 96 : 92;
                    MinP = this.player_.isFullScreen ? 0.1 : 0.5;
                } else { //0:00:00
                    MaxP = this.player_.isFullScreen ? 95 : 91;
                    MinP = this.player_.isFullScreen ? 0.1 : 0.5;
                }
                
                //Fix for BUG #120. Realign margin-left for left tab
                //TODO - put this back without jquery
                if (index === 0) {
                  if (TimeText.length <= 4) {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left", "-3.4em" );
                  } else if (TimeText.length <= 5) {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left", "-3.95em" );
                  } else {
                    $('.vjs-selectionbar-left-RS div.vjs-selectionbar-line-RS').css("margin-left" , "-4.75em" );
                  }
                }

                if (index === 0) {
                    tpl.style.left = Math.max(MinP, Math.min(MaxP, (left * 100 - MaxDisP / 2))) + '%';

                    if ((tpr.style.left.replace("%", "") - tpl.style.left.replace("%", "")) <= MaxDisP)
                        tpl.style.left = Math.max(MinP, Math.min(MaxP, tpr.style.left.replace("%", "") - MaxDisP)) + '%';
                    tpl.children[0].innerHTML = TimeText;
                } else {
                    tpr.style.left = Math.max(MinP, Math.min(MaxP, (left * 100 - MaxDisP / 2))) + '%';

                    if (((tpr.style.left.replace("%", "") || 100) - tpl.style.left.replace("%", "")) <= MaxDisP)
                        tpr.style.left = Math.max(MinP, Math.min(MaxP, tpl.style.left.replace("%", "") - 0 + MaxDisP)) + '%';
                        tpr.children[0].innerHTML =  TimeText;
                    

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
                ctp.children[0].value = h;
                ctp.children[1].value = m;
                ctp.children[2].value = s;
            }
        }
        return true;
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
        
        return left; //Math.max(0, Math.min(1, (cursorPosition - rstbX) / rstbW)); 
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