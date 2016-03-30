/// <reference path="typings/tsd.d.ts" />

declare var Notification: any;

type feedResult = {
    author: string;
    categories: string[];
    content: string;
    contentSnippet: string;
    link: string;
    publishedDate: string;
    title: string;
}

class freezersTransferNotificatr {
    public static instance: freezersTransferNotificatr = null;

    /**
     * the feed URLs to check for
     */
    private feeds = ['http://www.eliteprospects.com/rss_confirmed-transfers.php', 'http://www.eliteprospects.com/rss_rumours.php'];

    /**
     * Notification constructor allows to define an icon which shall be displayed next to the actual notification
     */
    public notificationIcon = 'images/maske.jpg';

    /**
     * tdetermines when we last checked for updates
     */
    private _lastChecked: Date = null;
    private get lastChecked() {
        return this._lastChecked;
    }
    private set lastChecked(value) {
        this._lastChecked = value;
    }

    /**
     * the interval which defines how often we check for news
     * we hold a reference to be able to clear the interval using window.clearInterval(interval: number)
     */
    public interval: number;

    /**
     * user must grant notification permissions first to allow us sending notifications
     */
    public get isGranted() {
        return Notification.permission === 'granted';
    }

    constructor() {
        if (freezersTransferNotificatr.instance) {
            // opt out if we already have an instance of freezersTransferNotificatr
            return;
        }

        // save instance statically and start notification service
        freezersTransferNotificatr.instance = this;
        this.startNotificationService();
    }

    /**
     * starts the notification service by asking the user to grant permissions for the Notification API
     */
    public startNotificationService() {
        Notification.requestPermission().then(x => {
            if (this.isGranted) {
                this._createNotificationInterval();
            } else {
                alert('Must grant notification permissions!');
            }
        });
    }

    /**
     * creates the actual notification interval
     */
    private _createNotificationInterval() {
        new Notification('Notification service started!', {
            icon: this.notificationIcon,
            body: 'Waiting for new transfers....'
        });

        // initially check for news
        this._checkForNews();

        // then re-check every hour
        this.interval = window.setInterval(this._checkForNews.bind(this), 60000 * 60);
    }

    /**
     * download feeds and check for updates
     */
    private _checkForNews() {
        // log that we're looking for news to avoid errors (e.g. wrong interval etc.) with date/time
        console.log(`[${(new Date()).toLocaleTimeString()}] Checking for news...`);

        const feeds = this.feeds
        let result = [],
            xhr: JQueryPromise<any>[] = [];

        // iterate feeds to create XHR for every one (makes things more generic)
        for (var i = 0; i < feeds.length; i++) {
            xhr.push($.ajax({
                url      : `${document.location.protocol}//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=?&q=${encodeURIComponent(feeds[i])}`,
                dataType : 'json'
            }).done(data => data.responseData.feed && data.responseData.feed.entries && Array.prototype.push.apply(result, data.responseData.feed.entries)));
        }

        // create bundled promise for all calls by using apply
        $.when.apply($, xhr).done(() => {
            // filter result for transfers we're interested in (the ones concerning the Hamburg Freezers)
            let freezers = result.filter(x => /hamburg freezers/i.test(x.title));

            // check if we have news and send notifications if that's the case
            if (freezers.length > 0) {
                this._sendNotifications(freezers);
            }

            // update lastChecked timestamp (it's now, obviously)
            this.lastChecked = new Date();
        });
    }

    /**
     * sends notifications for every new transfer
     * @param result  feedResult[] the transfers to send notifications for
     */
    private _sendNotifications(result: feedResult[]) {
        const lastChecked = this.lastChecked;

        result.forEach(x => {
            if (lastChecked && (<DateStatic><any>Date).create(x.publishedDate) < lastChecked) {
                // opt-out if we already sent a notification for that transfer
                return;
            }

            // send notification, open provided link on click (refers to the source of the transfer)
            (new Notification('New transfer!', {
                icon: this.notificationIcon,
                body: x.title,
            })).onclick = window.open.bind(window, x.link);
        })
    }
}
