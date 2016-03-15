function RealTimeReport(reportConfig) {

    var _this = this;

    var defaults = {
        dataElementType: 'BasicTable',
        dataElement: '#data-table',
        refreshInterval: null,
        animateTotal: false
    };

    reportConfig = $.extend({}, defaults, reportConfig);

    this.run = function (reportRequest) {

        reportRequest = reportRequest || {};

        var eventName = _this.generateEventName();

        switch (reportConfig['dataElementType']) {
            case 'AnimatedTrendGraph':
                var trendGraph = new AnimatedTrendGraph(reportConfig['dataElement'], { width: 660, height: 200, delay: 60000});
                $( document ).on(eventName, function(event, report) {
                    // pull the minute totals for each minute
                    // formatted data is [100, 200, 300, ...] (newest data last)
                    var data = report.data.map(function(minute) {
                        return parseInt(minute.breakdownTotal[0]);
                    });

                    trendGraph.redrawGraph(data);
                });
                break;
            case 'BasicTable':
                var basicTable = new BasicTable(reportConfig['dataElement'], { columns: ["Page", "Page Views"] });
                $( document ).on(eventName, function(event, report) {
                    basicTable.update(report.pageTotals);
                });
                break;
        }

        if (reportConfig.hasOwnProperty('totalElement')) {
            $( document ).on(eventName, function(event, report) {
                // grab the total for this time period
                var total = report.totals[0];

                // add a comma every thousand numbers (i.e. 1000 => 1,000)
                var commaStep = $.animateNumber.numberStepFactories.separator(',');

                if (reportConfig.animateTotal === true) {
                    //Animate the number
                    $(reportConfig['totalElement']).animateNumber({
                        number: total,
                        numberStep: commaStep
                    }, 500);
                } else{
                    $(reportConfig['totalElement']).html(total.toString().commaSeparate());
                }
            });
        } else {
            $( document ).on(eventName, function(event, report) {
                $(reportConfig['totalElement']).html('');
            });
        }

        setTimeout(function() {
            _this.makeRealTimeRequest(reportRequest, eventName);

            if (reportConfig['refreshInterval'] > 0) {
                // set the refresh interval
                setInterval(function () {
                    _this.makeRealTimeRequest(reportRequest, eventName);
                }, reportConfig['refreshInterval'] * 1000);
            }
        }, 1500);
    };

    this.generateEventName = function () {
        var len = 24, chars  = "0123456789abcdef", eventName  = "";
        for (var i = 0; i < len; i++) {
            eventName += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return eventName;
    };

    this.setPageTotals = function(report) {
        // return the total count for each page
        // formatted data is [["PageName", 123], ["PageName 2", 456]]
        var totals = [];
        $(report.data).each(function(i, minute) {
            $(minute.breakdown).each(function (j, page) {
                total = parseInt(page.counts[0]) + (totals[j] ? totals[j][1] : 0);

                var trend = '';
                if (page.trend === 0.00) {
                    trend = null;
                } else if (page.trend.toString().indexOf('-') === -1) {
                    trend = '+';
                } else if (page.trend.toString().indexOf('-') === 0) {
                    trend = '-';
                }

                totals[j] = [page.name, total, trend];
            });
        });

        report.pageTotals = totals;
    };

    this.makeRealTimeRequest = function(params, eventName) {
        MarketingCloud.makeRequest(config.username, config.secret, 'Report.Run', params, config.endpoint, function(response) {
            if (response.status == 200) {
                var report = response.responseJSON.report;
                _this.setPageTotals(report);
                var event = jQuery.Event(eventName);
                $( document ).trigger(event, report);
            }
        });
    };
}
