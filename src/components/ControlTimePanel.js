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