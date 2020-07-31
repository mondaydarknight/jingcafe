if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null)
            throw new TypeError('"this" is null or not defined');
        var length = this.length >>> 0;
        fromIndex = +fromIndex || 0;
        if (Math.abs(fromIndex) === Infinity)
            fromIndex = 0;
        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0)
                fromIndex = 0
        }
        for (; fromIndex < length; fromIndex++)
            if (this[fromIndex] === searchElement)
                return fromIndex;
        return -1
    };
(function Popunder(options) {
    var _parent, popunder, posX, posY, cookieName, cookie, browser, numberOfTimes, expires = -1,
        wrapping, url = "",
        size, frequency, mobilePopupDisabled = options.mobilePopupDisabled;
    if (this instanceof Popunder === false)
        return new Popunder(options);
    try {
        _parent = top != self && typeof top.document.location.toString() === "string" ? top : self
    } catch (e) {
        _parent = self
    }
    cookieName = "adk2_popunder";
    popunder = null;
    browser = function() {
        var n = navigator.userAgent.toLowerCase(),
            b = {
                webkit: /webkit/.test(n),
                mozilla: /mozilla/.test(n) && !/(compatible|webkit)/.test(n),
                chrome: /chrome/.test(n),
                msie: /msie/.test(n) && !/opera/.test(n),
                firefox: /firefox/.test(n),
                safari: /safari/.test(n) && !/chrome/.test(n),
                opera: /opera/.test(n)
            };
        b.version = b.safari ? (n.match(/.+(?:ri)[\/: ]([\d.]+)/) || [])[1] : (n.match(/.+(?:ox|me|ra|ie)[\/:]([\d.]+)/) || [])[1];
        return b
    }();

    
    initOptions(options);

    function initOptions(options) {
        options = options || {};
        if (options.wrapping)
            wrapping = options.wrapping;
        else {
            options.serverdomain = options.serverdomain || "ads.adk2.com";
            options.size = options.size || "800x600";
            options.ci = "3";
            var arr = [],
                excluded = ["serverdomain", "numOfTimes", "duration", "period"];
            for (var p in options)
                options.hasOwnProperty(p) && options[p].toString() && excluded.indexOf(p) === -1 && arr.push(p + "=" + encodeURIComponent(options[p]));
            url = "http://" + options.serverdomain + "/player.html?rt=popunder&" + arr.join("&")
        }
        if (options.size) {
            size = options.size.split("x");
            options.width = size[0];
            options.height = size[1]
        }
        if (options.frequency) {
            frequency = /([0-9]+)\/([0-9]+)(\w)/.exec(options.frequency);
            options.numOfTimes = +frequency[1];
            options.duration = +frequency[2];
            options.period = ({
                m: "minute",
                h: "hour",
                d: "day"
            })[frequency[3].toLowerCase()]
        }
        if (options.period)
            switch (options.period.toLowerCase()) {
                case "minute":
                    expires = options.duration * 60 * 1e3;
                    break;
                case "hour":
                    expires = options.duration * 60 * 60 * 1e3;
                    break;
                case "day":
                    expires = options.duration * 24 * 60 * 60 * 1e3
            }
        posX = typeof options.left != "undefined" ? options.left.toString() : window.screenX;
        posY = typeof options.top != "undefined" ? options.top.toString() : window.screenY;
        numberOfTimes = options.numOfTimes
    }

    function getCookie(name) {
        try {
            var parts = document.cookie.split(name + "=");
            if (parts.length == 2)
                return unescape(parts.pop().split(";").shift()).split("|")
        } catch (err) {}
    }

    function setCookie(value, expiresDate) {
        expiresDate = cookie[1] || expiresDate.toGMTString();
        document.cookie = cookieName + "=" + escape(value + "|" + expiresDate) + ";expires=" + expiresDate + ";path=/"
    }

    function addEvent(listenerEvent) {
        if (document.addEventListener)
            document.addEventListener("click", listenerEvent, false);
        else
            document.attachEvent("onclick", listenerEvent)
    }

    function removeEvent(listenerEvent) {
        if (document.removeEventListener)
            document.removeEventListener("click", listenerEvent, false);
        else
            document.detachEvent("onclick", listenerEvent)
    }

    function isCapped() {
        cookie = getCookie(cookieName) || [];
        return !!numberOfTimes && +numberOfTimes <= +cookie[0]
    }

    function pop() {
        var features = "type=fullWindow, fullscreen, scrollbars=yes",
            listenerEvent = function() {
                var now, next;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    if (mobilePopupDisabled)
                        return;
                if (isCapped())
                    return;
                if (browser.chrome && parseInt(browser.version.split(".")[0], 10) > 30 && adParams.openNewTab) {
                    now = new Date;
                    next = new Date(now.setTime(now.getTime() + expires));
                    setCookie((+cookie[0] || 0) + 1, next);
                    removeEvent(listenerEvent);
                    window.open("javascript:window.focus()", "_self", "");
                    simulateClick(url);
                    popunder = null
                } else
                    popunder = _parent.window.open(url, Math.random().toString(36).substring(7), features);
                if (wrapping) {
                    popunder.document.write("<html><head></head><body>" + unescape(wrapping || "") + "</body></html>");
                    popunder.document.body.style.margin = 0
                }
                if (popunder) {
                    now = new Date;
                    next = new Date(now.setTime(now.getTime() + expires));
                    setCookie((+cookie[0] || 0) + 1, next);
                    moveUnder();
                    removeEvent(listenerEvent)
                }
            };
        addEvent(listenerEvent)
    }
    var simulateClick = function(url) {
        var a = document.createElement("a"),
            u = !url ? "data:text/html,<script>window.close();<\/script>;" : url,
            evt = document.createEvent("MouseEvents");
        a.href = u;
        document.body.appendChild(a);
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
        a.dispatchEvent(evt);
        a.parentNode.removeChild(a)
    };

    function moveUnder() {
        try {
            popunder.blur();
            popunder.opener.window.focus();
            window.self.window.focus();
            window.focus();
            if (browser.firefox)
                openCloseWindow();
            else if (browser.webkit)
                openCloseTab();
            else
                browser.msie && setTimeout(function() {
                    popunder.blur();
                    popunder.opener.window.focus();
                    window.self.window.focus();
                    window.focus()
                }, 1e3)
        } catch (e) {}
    }

    function openCloseWindow() {
        var tmp = popunder.window.open("about:blank");
        tmp.focus();
        tmp.close();
        setTimeout(function() {
            try {
                tmp = popunder.window.open("about:blank");
                tmp.focus();
                tmp.close()
            } catch (e) {}
        }, 1)
    }

    function openCloseTab() {
        var ghost = document.createElement("a"),
            clk;
        document.getElementsByTagName("body")[0].appendChild(ghost);
        clk = document.createEvent("MouseEvents");
        clk.initMouseEvent("click", false, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
        ghost.dispatchEvent(clk);
        ghost.parentNode.removeChild(ghost);
        window.open("about:blank", "PopHelper").close()
    }
    pop()
})(adParams)