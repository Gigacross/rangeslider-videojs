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