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
        console.log(this.$TimePanelLeft);
        this.$TimePanelLeft.css({ left: '30%' });
       // this.$TimePanelLeft.css('left', settings.left);
        this.$TimePanelLeft.find('.vjs-time-text')[0]
                        .innerHTML = settings.text;
    // if ((tpr.style.left.replace("%", "") - tpl.style.left.replace("%", "")) <= MaxDisP)
    //     tpl.style.left = Math.max(MinP, Math.min(MaxP, tpr.style.left.replace("%", "") - MaxDisP)) + '%';
    // tpl.children[0].innerHTML = TimeText;
    };