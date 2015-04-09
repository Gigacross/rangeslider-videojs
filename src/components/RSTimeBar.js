    /**
     * Range Slider Time Bar
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @constructor
     */
    videojs.RSTimeBar = videojs.Component.extend({
        /** @constructor */
        init: function(player, options) {
            videojs.Component.call(this, player, options);
            //have to do this due to bugs with options_ being renamed when minified.
            this.addChild(new videojs.SeekRSBar(player, options));
        }
    });

    //this will not work with minified/uglified video.js
    videojs.RSTimeBar.prototype.init_ = function() {
        //this.rs = this.player_.rangeslider;
    };

    //this will not work with minified/uglified video.js
    videojs.RSTimeBar.prototype.options_ = {
        children: {
            'SeekRSBar': {}
        }
    };

    videojs.RSTimeBar.prototype.createEl = function() {
        return videojs.Component.prototype.createEl.call(this, 'div', {
            className: 'vjs-timebar-RS',
            innerHTML: ''
        });
    };

    //$('<div class="vjs-timebar-RS">')

    videojs.RSTimeBar.prototype.elEx = function(player, options) {
        var holder = new videojs.SeekRSBar(player, options);

        return $('<div class="vjs-timebar-RS">').append(holder.elEx());
    }