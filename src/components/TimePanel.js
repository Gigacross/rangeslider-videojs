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