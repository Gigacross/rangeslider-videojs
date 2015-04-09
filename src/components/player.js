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