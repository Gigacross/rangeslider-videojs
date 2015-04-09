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