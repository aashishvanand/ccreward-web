// Microsoft Clarity loader.
//
// Gated by the analytics consent choice (opt-out): when the visitor declined,
// nothing loads — no Clarity script, no session, no network request to
// clarity.ms. The consent banner is answered before this lazyOnload script
// runs in almost all cases; a decline after Clarity started cannot un-send
// that session (the choice applies from the next visit on).
(function (c, l, a, r, i, t, y) {
    try {
        if (localStorage.getItem("analytics-consent") === "denied") return;
    } catch (e) { /* storage blocked — proceed as before */ }
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "ngsrwjccm4");
