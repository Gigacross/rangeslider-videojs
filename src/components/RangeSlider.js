    //-- Load RangeSlider plugin in videojs
    function RangeSlider_(options) {
        var player = this;

        player.rangeslider = new RangeSlider(player, options);
        
        player.tabs_initialised = false;
        player.video_start_initialised = false;
        
        //When the DOM and the video media is loaded
         function initialVideoFinished(event) {
            var plugin = player.rangeslider;
            
            if ( !plugin.options.showControlBar) {

              //All components will be initialize after they have been loaded by videojoptionss
              for (var index in plugin.components) {
                  plugin.components[index].init_(plugin);
              }            
  
              if (plugin.options.hidden)
                 plugin.hide(); //Hide the Range Slider
                          
              if (plugin.options.locked)
                  plugin.lock(); //Lock the Range Slider
  
              if (plugin.options.panel == false)
                  plugin.hidePanel(); //Hide the second Panel
  
              if (plugin.options.controlTime == false)
                  plugin.hidecontrolTime(); //Hide the control time panel
                          
            }

            //plugin._reset();
            player.trigger('loadedRangeSlider'); //Let know if the Range Slider DOM is ready
        }
        // if (player.techName == 'Youtube') {
            //Detect youtube problems
            player.one('error', function(e) {
                switch (player.error) {
                    case 2:
                        alert("The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
                    case 5:
                        alert("The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.");
                    case 100:
                        alert("The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.");
                        break;
                    case 101:
                        alert("The owner of the requested video does not allow it to be played in embedded players.");
                        break;
                    case 150:
                        alert("The owner of the requested video does not allow it to be played in embedded players.");
                        break;
                    default:
                        alert("Unknown Error");
                        break;
                }
            });
            
            if (player.rangeslider.options.showControlBar) {
              
                var plugin = player.rangeslider;
               
                if (plugin.options.hidden)
                   plugin.hide(); //Hide the Range Slider
                                
                if (plugin.options.locked)
                    plugin.lock(); //Lock the Range Slider

                plugin.showEx();
            } 

            //loadstart
            player.on('firstplay', initialVideoFinished);


        console.log("Loaded Plugin RangeSlider");
    }
    videojs.plugin('rangeslider', RangeSlider_);

    //-- Plugin

    function RangeSlider(player, options) {
        var videoWrapper = $(player.el());

        var timeBar = new videojs.RSTimeBar(player, options, this);

        videoWrapper.find('.vjs-progress-holder')
                        .append(timeBar.elEx(player, options));       

        this.rstb = timeBar;

        var controlTimePanel = new videojs.ControlTimePanel(player, options);
        var controlTimePanelEl = $('<div class="vjs-controltimepanel-RS vjs-control"></div>');
        var controlTimePanelLeft = $('<div class="vjs-controltimepanel-left-RS">Start: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/></div>');
        controlTimePanelEl.append(controlTimePanelLeft);
        var controlTimePanelRight= $('<div class="vjs-controltimepanel-right-RS">End: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/></div>');
        controlTimePanelEl.append(controlTimePanelRight);

        this.ctp = controlTimePanel;

        videoWrapper.find('.vjs-control-bar').append(controlTimePanelEl);

        var player = player || this;

        this.player = player;

        options = options || {}; // plugin options

        if (!options.hasOwnProperty('locked'))
            options.locked = false; // lock slider handles

        if (!options.hasOwnProperty('hidden'))
            options.hidden = true; // hide slider handles

        if (!options.hasOwnProperty('panel'))
            options.panel = true; // Show Second Panel

        if (!options.hasOwnProperty('controlTime'))
            options.controlTime = true; // Show Control Time to set the arrows in the edition
        
        if (!options.hasOwnProperty('showControlBar'))
            options.showControlBar = true; // Show Control Bar
                
        if (!options.hasOwnProperty('isMobile'))
            options.isMobile = false; // Not in mobile phone mode

        this.options = options;

        this.init();
    }

    //-- Methods
    RangeSlider.prototype = {
        /*Constructor*/
        init: function() {
            var player = this.player || {};

            this.updatePrecision = 3;

            //position in second of the arrows
            this.start = 0;
            this.end = 0;
        },
        lock: function() {
            this.options.locked = true;

            if (typeof this.rstb.SeekRSBar != 'undefined') {
                this.rstb.SeekRSBar.lock();
            }
            
            //this.ctp.enable(false);
            // if (typeof this.box != 'undefined')
            //     videojs.addClass(this.box.el_, 'locked');
        },
        unlock: function() {
            this.options.locked = false;
            //this.ctp.enable();

            if (typeof this.rstb.SeekRSBar != 'undefined') {
                this.rstb.SeekRSBar.unLock();
            }
        },
        show: function() {
            this.options.hidden = false;
            if (typeof this.rstb != 'undefined') {
                this.rstb.show();
                if (this.options.controlTime)
                    this.showcontrolTime();
            }
        },
        showEx: function() {

            this.rstb.SeekRSBar.SelectionBarLeft.show();
            this.rstb.SeekRSBar.SelectionBarRight.show();
            this.show();
            this.player.controlBar.show();
        },
        hide: function() {
            this.options.hidden = true;
            if (typeof this.rstb != 'undefined') {
                this.rstb.hide();
                this.ctp.hide();
            }
        },
        showPanel: function() {
            this.options.panel = true;
            if (typeof this.tp != 'undefined')
                videojs.removeClass(this.tp.el_, 'disable');
        },
        hidePanel: function() {
            this.options.panel = false;
            if (typeof this.tp != 'undefined')
                videojs.addClass(this.tp.el_, 'disable');
        },
        showcontrolTime: function() {
            this.options.controlTime = true;
            if (typeof this.ctp != 'undefined')
                this.ctp.show();
        },
        hidecontrolTime: function() {
            this.options.controlTime = false;
            if (typeof this.ctp != 'undefined')
                this.ctp.hide();
        },
        setValue: function(index, seconds, writeControlTime) {
            console.log ('setvalue - ' + index);

            //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
            var writeControlTime = typeof writeControlTime != 'undefined' ? writeControlTime : true;

            var percent = this._percent(seconds);
            console.log ('seconds ' + seconds + ' to percentage - ' + percent);
            var isValidIndex = (index === 0 || index === 1);
            var isChangeable = !this.locked;
            if (isChangeable && isValidIndex) {
                this.rstb.SeekRSBar.setPosition(index, percent, writeControlTime);
            }
        },
        setValues: function(start, end, writeControlTime) {
            console.log('setting values - ' + start);
            //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
            var writeControlTime = typeof writeControlTime != 'undefined' ? writeControlTime : true;
            console.log('reset');
            //this._reset();
            console.log('_setValuesLocked');
            this._setValuesLocked(start, end, writeControlTime);
        },
        getValues: function() { //get values in seconds
            var values = {}, start, end;
            start = this.start || this._getArrowValue(0);
            end = this.end || this._getArrowValue(1);
            return {
                start: start,
                end: end
            };
        },
        playBetween: function(start, end, showRS) {
            showRS = typeof showRS == 'undefined' ? true : showRS;
            this.player.currentTime(start);
            
            //if ( this.player_.paused() ){
              this.player.play();
            //}
            
            // if (showRS) {
            //     this.show();
            //     this._reset();
            // } else {
            //     this.hide();
            // }
            this._setValuesLocked(start, end);

            //this.bar.activatePlay(start, end);
            this.rstb.SeekRSBar.SelectionBar.activatePlay(start, end);
            // hide spinner
            this.player.loadingSpinner.hide();

        },
        loop: function(start, end, show) {
            var player = this.player;

            if (player) {
                player.on("pause", videojs.bind(this, function() {
                    this.looping = false;
                }));

                show = typeof show === 'undefined' ? true : show;

                if (show) {
                    this.show();
                    this._reset();
                } else {
                    this.hide();
                }
                this._setValuesLocked(start, end);

                this.timeStart = start;
                this.timeEnd = end;
                this.looping = true;

                this.player.currentTime(start);
                this.player.play();

                this.player.on("timeupdate", videojs.bind(this, this.bar.process_loop));
            }
        },
        _getArrowValue: function(index) {
            var index = index || 0;
            var duration = this._duration();

            duration = typeof duration == 'undefined' ? 0 : duration;

            var percentage = this[index === 0 ? "left" : "right"].el_.style.left.replace("%", "");
            if (percentage == "")
                percentage = index === 0 ? 0 : 100;

            return videojs.round(this._seconds(percentage / 100), this.updatePrecision - 1);
        },
        _percent: function(seconds) {
            var duration = this._duration();
            if (isNaN(duration)) {
                return 0;
            }
            return Math.min(1, Math.max(0, seconds / duration));
        },
        _seconds: function(percent) {
            var duration = this._duration();
            if (isNaN(duration) || duration === 0) {
                return 0;
            }
            return Math.min(duration, Math.max(0, percent * duration));
        },
        _reset: function() {
            var duration = this._duration();
            this.rstb.SeekRSBar.SelectionBarLeft.$el.css('left', '0%');
            this.rstb.SeekRSBar.SelectionBarRight.$el.css('left', '100%');
            this._setValuesLocked(0, duration);
        },
        _setValuesLocked: function(start, end, writeControlTime) {
            var triggerSliderChange = typeof writeControlTime != 'undefined';
            var writeControlTime = typeof writeControlTime != 'undefined' ? writeControlTime : true;
            if (this.options.locked) {
                this.unlock(); //It is unlocked to change the bar position. In the end it will return the value.
                this.setValue(0, start, writeControlTime);
                this.setValue(1, end, writeControlTime);
                this.lock();
            } else {
                this.setValue(0, start, writeControlTime);
                this.setValue(1, end, writeControlTime);
            }

            // Trigger slider change
            if (triggerSliderChange) {
                this._triggerSliderChange();
           }
        },
        _checkControlTime: function(index, TextInput, timeOld) {
            var h = TextInput[0],
                m = TextInput[1],
                s = TextInput[2],
                newHour = h.value,
                newMin = m.value,
                newSec = s.value,
                obj, objNew, objOld;
            index = index || 0;

            if (newHour != timeOld[0]) {
                obj = h;
                objNew = newHour;
                objOld = timeOld[0];
            } else if (newMin != timeOld[1]) {
                obj = m;
                objNew = newMin;
                objOld = timeOld[1];
            } else if (newSec != timeOld[2]) {
                obj = s;
                objNew = newSec;
                objOld = timeOld[2];
            } else {
                return false;
            }

            var duration = this._duration() || 0,
                durationSel;

            var intRegex = /^\d+$/; //check if the objNew is an integer
            if (!intRegex.test(objNew) || objNew > 60) {
                objNew = objNew == "" ? "" : objOld;
            }

            newHour = newHour == "" ? 0 : newHour;
            newMin = newMin == "" ? 0 : newMin;
            newSec = newSec == "" ? 0 : newSec;

            durationSel = videojs.TextTrack.prototype.parseCueTime(newHour + ":" + newMin + ":" + newSec);
            if (durationSel > duration) {
                obj.value = objOld;
                obj.style.border = "1px solid red";
            } else {
                obj.value = objNew;
                h.style.border = m.style.border = s.style.border = "1px solid transparent";
                this.setValue(index, durationSel, false);

                // Trigger slider change
                this._triggerSliderChange();
            }
            if (index === 1) {
                var oldTimeLeft = this.ctpl.el_.children,
                    durationSelLeft = videojs.TextTrack.prototype.parseCueTime(oldTimeLeft[0].value + ":" + oldTimeLeft[1].value + ":" + oldTimeLeft[2].value);
                if (durationSel < durationSelLeft) {
                    obj.style.border = "1px solid red";
                }
            } else {

                var oldTimeRight = this.ctpr.el_.children,
                    durationSelRight = videojs.TextTrack.prototype.parseCueTime(oldTimeRight[0].value + ":" + oldTimeRight[1].value + ":" + oldTimeRight[2].value);
                if (durationSel > durationSelRight) {
                    obj.style.border = "1px solid red";
                }
            }
        },
        _triggerSliderChange: function() {
            this.player.trigger("sliderchange");
            
            $('.vjs-selectionbar-left-RS .vjs-time-text').html( $('.vjs-timepanel-left-RS .vjs-time-text').html() );
            $('.vjs-selectionbar-right-RS .vjs-time-text').html( $('.vjs-timepanel-right-RS .vjs-time-text').html() );
        },
        _duration: function() {
            if (!isNaN(this.options.duration)) {
                return this.options.duration;
            }
            
            return this.player.duration();
        }
    };
