'use strict';

/* 
RangeSlider v1.0 (https://github.com/danielcebrian/rangeslider-videojs)
Copyright (C) 2014 Daniel CebriĂĄn Robles
License: https://github.com/danielcebrian/rangeslider-videojs/blob/master/License.rst

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
var $ = require('jquery');

//----------------Load Plugin----------------//
(function() {
    
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

  //Lock the Slider bar and it will not be possible to change the arrow positions
    videojs.Player.prototype.showControlBar = function() {
        return this.rangeslider.player.controlBar.show();
    };
        
  //Show the Slider Bar Component
    videojs.Player.prototype.showPlayToggle = function() {
        return this.rangeslider.player.controlBar.playToggle.el().style.visibility = 'visible';
    };

    //Hide the Slider Bar Component
    videojs.Player.prototype.hidePlayToggle = function() {
      return this.rangeslider.player.controlBar.playToggle.el().style.visibility = 'hidden';
    };
        
    //Lock the Slider bar and it will not be possible to change the arrow positions
    videojs.Player.prototype.lockSlider = function() {
        return this.rangeslider.lock();
    };

    //Unlock the Slider bar and it will be possible to change the arrow positions
    videojs.Player.prototype.unlockSlider = function() {
        return this.rangeslider.unlock();
    };

    //Show the Slider Bar Component
    videojs.Player.prototype.showSlider = function() {
        return this.rangeslider.show();
    };

    //Hide the Slider Bar Component
    videojs.Player.prototype.hideSlider = function() {
        return this.rangeslider.hide();
    };

    //Show the Panel with the seconds of the selection
    videojs.Player.prototype.showSliderPanel = function() {
        return this.rangeslider.showPanel();
    };

    //Hide the Panel with the seconds of the selection
    videojs.Player.prototype.hideSliderPanel = function() {
        return this.rangeslider.hidePanel();
    };


    //Show the control Time to edit the position of the arrows
    videojs.Player.prototype.showControlTime = function() {
        return this.rangeslider.showcontrolTime();
    };

    //Hide the control Time to edit the position of the arrows
    videojs.Player.prototype.hideControlTime = function() {
        return this.rangeslider.hidecontrolTime();
    };

    //Set a Value in second for both arrows
    videojs.Player.prototype.setValueSlider = function(start, end) {
        
        
        return this.rangeslider.setValues(start, end);
    };

    //The video will be played in a selected section
    videojs.Player.prototype.playBetween = function(start, end) {
        return this.rangeslider.playBetween(start, end);
    };
    
    
 //The video will be ready to start play at a certain time point
    videojs.Player.prototype.setStartTime = function(start) {
      return this.rangeslider.player.currentTime(start);
    };  
    
  //The video will be ready to play in a selected section
    videojs.Player.prototype.setupEndTime = function() {

      var duration = this.player_.duration();
        var precision = this.rangeslider.updatePrecision;
      var end = this.rangeslider.right.el_.style.left.replace("%", "");
        var segEnd = videojs.round(end * duration / 100, precision);
      this.rangeslider.bar.activatePlay(0, segEnd);
      
    };

    //The video will loop between to values
    videojs.Player.prototype.loopBetween = function(start, end) {
        return this.rangeslider.loop(start, end);
    };

    //Set a Value in second for the arrows
    videojs.Player.prototype.getValueSlider = function() {
        return this.rangeslider.getValues();
    };
    /**
     * Range Slider Time Bar
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.RSTimeBar = function(player, options, rangeSlider) {
        this.SeekRSBar = new videojs.SeekRSBar(player, options, rangeSlider);
    };

    videojs.RSTimeBar.prototype.show = function() {
        //todo
    };

    // //this will not work with minified/uglified video.js
    // videojs.RSTimeBar.prototype.init_ = function() {
    //     //this.rs = this.player_.rangeslider;
    // };

    // //this will not work with minified/uglified video.js
    // videojs.RSTimeBar.prototype.options_ = {
    //     children: {
    //         'SeekRSBar': {}
    //     }
    // };

    videojs.RSTimeBar.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timebar-RS',
            innerHTML: ''
        });
    };

    videojs.RSTimeBar.prototype.elEx = function(player, options) {
        return $('<div class="vjs-timebar-RS">').append(this.SeekRSBar.elEx(player, options));
    }
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
        var rightVal = $rightEl.offset().left != '' ? $rightEl.offset().left : 100;
        var right = parseFloat(rightVal) / 100;
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
        var leftVal = $leftEl.offset().left != '' ? $leftEl.offset().left : 0;

        var left = parseFloat(leftVal) / 100;
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

      return this.$el;
    };

    videojs.SelectionBarLeft.prototype.setLocation = function(locationDetails) {
      this.$el.css({ left: locationDetails.left });

      this.$timeText.text(locationDetails.text);
    };

    videojs.SelectionBarLeft.prototype.onMouseDown = function(event) {
      
      var RSTBX, handleW, box;
       
        event.preventDefault();
        //videojs.blockTextSelection();
        this.pressed = true;
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
        videojs.removeClass(this.el_, 'active');
        this.pressed = false;
        if (this.rs.options.locked) {
            this.rs.playBetween(this.rs.start,this.rs.end);
        } 


        this.rs.box.offsetX = 0;
    };
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

      this.$el.on('mousedown', function(event) { that.onMouseDown(event); });

      return this.$el;
    };

    videojs.SelectionBarRight.prototype.setLocation = function(locationDetails) {
      this.$el.css({ left: locationDetails.left });

      this.$timeText.text(locationDetails.text);
    };

    videojs.SelectionBarRight.prototype.onMouseDown = function(event) {

      var RSTBX, handleW, box;

        event.preventDefault();
        videojs.blockTextSelection();
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

    /**
     * This is the time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.TimePanel = function() {};

    // videojs.Component.extend({
    //     /** @constructor */
    //     init: function(player, options) {
    //         var timePanelLeft, timePanelRight;

    //         videojs.Component.call(this, player, options);

    //         timePanelLeft = new videojs.TimePanelLeft(player, options);
    //         this.addChild(timePanelLeft);
    //         this.TimePanelLeft = timePanelLeft;

    //         timePanelRight = new videojs.TimePanelRight(player, options);
    //         this.addChild(timePanelRight);
    //         this.TimePanelRight = timePanelRight;
    //     }
    // });

    videojs.TimePanel.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    videojs.TimePanel.prototype.options_ = {
        children: {
            'TimePanelLeft': {},
            'TimePanelRight': {},
        }
    };

    videojs.TimePanel.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timepanel-RS'
        });
    };

    videojs.TimePanel.prototype.elEx = function() {
        this.$el = $('<div class="vjs-timepanel-RS"></div>');
                    
        var $timePanelLeft = $('<div class="vjs-timepanel-left-RS"><span class="vjs-time-text">00:00</span></div>');
        var $timePanelRight = $('<div class=""><span class="vjs-time-text">00:00</span></div>');

        this.$TimePanelLeft = $timePanelLeft;
        this.$TimePanelRight = $timePanelRight;

        this.$el.append($timePanelLeft);
        this.$el.append($timePanelRight);

        return this.$el;
    };

    videojs.TimePanel.prototype.leftLength = function() {
        return this.$TimePanelLeft
                    .find('.vjs-time-text')[0]
                        .innerHTML
                            .length;
        //tpl.find('.') .children[0].innerHTML.length;
    };

    videojs.TimePanel.prototype.setLeftPanel = function(settings) {
        this.$TimePanelLeft.css({ left: settings.left });
        this.$TimePanelLeft.find('.vjs-time-text')[0]
                        .innerHTML = settings.text;
    // if ((tpr.style.left.replace("%", "") - tpl.style.left.replace("%", "")) <= MaxDisP)
    //     tpl.style.left = Math.max(MinP, Math.min(MaxP, tpr.style.left.replace("%", "") - MaxDisP)) + '%';
    // tpl.children[0].innerHTML = TimeText;
    };

    videojs.TimePanel.prototype.setRightPanel = function(settings) {
        // tpr.style.left = Math.max(MinP, Math.min(MaxP, (left * 100 - MaxDisP / 2))) + '%';

                    // if (((tpr.style.left.replace("%", "") || 100) - tpl.style.left.replace("%", "")) <= MaxDisP)
                    //     tpr.style.left = Math.max(MinP, Math.min(MaxP, tpl.style.left.replace("%", "") - 0 + MaxDisP)) + '%';
                    //     tpr.children[0].innerHTML =  TimeText;
    };
    /**
     * This is the left time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.TimePanelLeft = function() {};

    // videojs.Component.extend({
    //     /** @constructor */
    //     init: function(player, options) {
    //         videojs.Component.call(this, player, options);
    //     }
    // });

    videojs.TimePanelLeft.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    videojs.TimePanelLeft.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timepanel-left-RS',
            innerHTML: '<span class="vjs-time-text">00:00</span>'
        });
    };

    videojs.TimePanelLeft.prototype.elEx = function() {
        this.$el = $('<div class="vjs-timepanel-left-RS">')
                        .append('<span class="vjs-time-text">00:00</span>');

        return this.$el;
    };
    /**
     * This is the right time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.TimePanelRight = function() {};

    // videojs.Component.extend({
    //     /** @constructor */
    //     init: function(player, options) {
    //         videojs.Component.call(this, player, options);
    //     }
    // });

    videojs.TimePanelRight.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    videojs.TimePanelRight.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timepanel-right-RS',
            innerHTML: '<span class="vjs-time-text">00:00</span>'
        });
    };
    /**
     * This is the control time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.ControlTimePanel = videojs.Component.extend({
        /** @constructor */
        init: function(player, options) {
            var controlTimePanelLeft, controlTimePanelRight;

            videojs.Component.call(this, player, options);

            controlTimePanelLeft = new videojs.ControlTimePanelLeft(player, options);
            this.addChild(controlTimePanelLeft);
            this.ControlTimePanelLeft = controlTimePanelLeft;

            controlTimePanelRight = new videojs.ControlTimePanelRight(player, options);
            this.addChild(controlTimePanelRight);
            this.ControlTimePanelRight = controlTimePanelRight;
        }
    });

    videojs.ControlTimePanel.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };


    videojs.ControlTimePanel.prototype.options_ = {
        children: {
            'ControlTimePanelLeft': {},
            'ControlTimePanelRight': {},
        }
    };

    videojs.ControlTimePanel.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-controltimepanel-RS vjs-control',
        });
    };

    videojs.ControlTimePanel.prototype.enable = function(enable) {
        var enable = typeof enable != 'undefined' ? enable : true;
        this.rs.ctpl.el().children[0].disabled = enable ? "" : "disabled";
        this.rs.ctpl.el().children[1].disabled = enable ? "" : "disabled";
        this.rs.ctpl.el().children[2].disabled = enable ? "" : "disabled";
        this.rs.ctpr.el().children[0].disabled = enable ? "" : "disabled";
        this.rs.ctpr.el().children[1].disabled = enable ? "" : "disabled";
        this.rs.ctpr.el().children[2].disabled = enable ? "" : "disabled";
    };
    /**
     * This is the control left time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.ControlTimePanelLeft = videojs.Component.extend({
        /** @constructor */
        init: function(player, options) {
            videojs.Component.call(this, player, options);
            this.on('keyup', this.onKeyUp);
            this.on('keydown', this.onKeyDown);
        }
    });

    videojs.ControlTimePanelLeft.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
        this.timeOld = {};
    };

    videojs.ControlTimePanelLeft.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-controltimepanel-left-RS',
            innerHTML: 'Start: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>'
        });
    };

    videojs.ControlTimePanelLeft.prototype.onKeyDown = function(event) {
        this.timeOld[0] = this.el_.children[0].value;
        this.timeOld[1] = this.el_.children[1].value;
        this.timeOld[2] = this.el_.children[2].value;
    };

    videojs.ControlTimePanelLeft.prototype.onKeyUp = function(event) {
        this.rs._checkControlTime(0, this.el_.children, this.timeOld);
    };
   /**
     * This is the control right time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.ControlTimePanelRight = videojs.Component.extend({
        /** @constructor */
        init: function(player, options) {
            videojs.Component.call(this, player, options);
            this.on('keyup', this.onKeyUp);
            this.on('keydown', this.onKeyDown);
        }
    });

    videojs.ControlTimePanelRight.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
        this.timeOld = {};
    };

    videojs.ControlTimePanelRight.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-controltimepanel-right-RS',
            innerHTML: 'End: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>'
        });
    };

    videojs.ControlTimePanelRight.prototype.onKeyDown = function(event) {
        this.timeOld[0] = this.el_.children[0].value;
        this.timeOld[1] = this.el_.children[1].value;
        this.timeOld[2] = this.el_.children[2].value;
    };

    videojs.ControlTimePanelRight.prototype.onKeyUp = function(event) {
        this.rs._checkControlTime(1, this.el_.children, this.timeOld);
    };
})();