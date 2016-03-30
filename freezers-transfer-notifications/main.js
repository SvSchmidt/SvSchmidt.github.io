var freezersTransferNotificatr = (function () {
    function freezersTransferNotificatr() {
        this.feeds = ['http://www.eliteprospects.com/rss_confirmed-transfers.php', 'http://www.eliteprospects.com/rss_rumours.php'];
        this._lastChecked = null;
        if (freezersTransferNotificatr.instance) {
            return;
        }
        freezersTransferNotificatr.instance = this;
        this.startNotificationService();
    }
    Object.defineProperty(freezersTransferNotificatr.prototype, "lastChecked", {
        get: function () {
            return this._lastChecked;
        },
        set: function (value) {
            this._lastChecked = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(freezersTransferNotificatr.prototype, "isGranted", {
        get: function () {
            return Notification.permission === 'granted';
        },
        enumerable: true,
        configurable: true
    });
    freezersTransferNotificatr.prototype.startNotificationService = function () {
        var _this = this;
        Notification.requestPermission().then(function (x) {
            if (_this.isGranted) {
                _this._createNotificationInterval();
            }
            else {
                alert('Must grant notification permissions!');
            }
        });
    };
    freezersTransferNotificatr.prototype._createNotificationInterval = function () {
        new Notification('Notification service started!', {
            body: 'Waiting for new transfers....'
        });
        this._checkForNews();
        this.interval = window.setInterval(this._checkForNews.bind(this), 60000 * 60);
    };
    freezersTransferNotificatr.prototype._checkForNews = function () {
        var _this = this;
        console.log("[" + (new Date()).toLocaleTimeString() + "] Checking for news...");
        var feeds = this.feeds;
        var result = [], xhr = [];
        for (var i = 0; i < feeds.length; i++) {
            xhr.push($.ajax({
                url: document.location.protocol + "//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=?&q=" + encodeURIComponent(feeds[i]),
                dataType: 'json'
            }).done(function (data) { return data.responseData.feed && data.responseData.feed.entries && Array.prototype.push.apply(result, data.responseData.feed.entries); }));
        }
        $.when.apply($, xhr).done(function () {
            var freezers = result.filter(function (x) { return /hamburg freezers/i.test(x.title); });
            if (freezers.length > 0) {
                _this._sendNotifications(freezers);
            }
            _this.lastChecked = new Date();
        });
    };
    freezersTransferNotificatr.prototype._sendNotifications = function (result) {
        var lastChecked = this.lastChecked;
        result.forEach(function (x) {
            if (lastChecked && Date.create(x.publishedDate) < lastChecked) {
                return;
            }
            (new Notification('New transfer!', {
                body: x.title,
            })).onclick = window.open.bind(window, x.link);
        });
    };
    freezersTransferNotificatr.instance = null;
    return freezersTransferNotificatr;
})();
