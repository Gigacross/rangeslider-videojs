    /**
     * This is the right time panel
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.TimePanelRight = videojs.Component.extend({
        /** @constructor */
        init: function(player, options) {
            videojs.Component.call(this, player, options);
        }
    });

    videojs.TimePanelRight.prototype.init_ = function(rangeslider) {
        this.rs = rangeslider;
    };

    videojs.TimePanelRight.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timepanel-right-RS',
            innerHTML: '<span class="vjs-time-text">00:00</span>'
        });
    };