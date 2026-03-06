// First Input Delay polyfill (required for FID measurement)
!function (n, e) { var t, o, i, c = [], f = { passive: !0, capture: !0 }, r = new Date, a = "pointerup", u = "pointercancel"; function p(n, c) { t || (t = c, o = n, i = new Date, w(e), s()) } function s() { o >= 0 && o < i - r && (c.forEach(function (n) { n(o, t) }), c = []) } function l(t) { if (t.cancelable) { var o = (t.timeStamp || new Date) - r; o < 0 || (t.type == a ? p(o, t) : t.type == u && (o = -1, p(o, t))) } } function w(n) { ["click", "mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (e) { n(e, l, f) }) } w(n), self.perfMetrics = self.perfMetrics || {}, self.perfMetrics.onFID = function (n) { c.push(n) } }(document, document.addEventListener);

// Network monitoring wrapper
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
        // This will be set up by the analytics service
        window.networkMonitoringEnabled = true;
    });
}
