if (typeof window !== 'undefined') {
    window.perfMetrics = window.perfMetrics || {};
    window.perfMetrics.onFID = function () {};

    window.addEventListener('DOMContentLoaded', function () {
        window.networkMonitoringEnabled = true;
    });
}
