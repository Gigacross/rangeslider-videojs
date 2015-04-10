    /**
     * Range Slider Time Bar
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.RSTimeBar = function(player, options) {
        this.SeekRSBar = new videojs.SeekRSBar(player, options);
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