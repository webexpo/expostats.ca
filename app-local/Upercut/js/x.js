/// <reference path="g.js" />

var $X =
{
    dGREENArea: new Array(),
    dGREENLine: [],
    dORANGEArea: [],
    dREDLine: [],
    dREDArea: [],
    dDHRLine: [],
    dDHRPoint: [],
    dXAXIS: [],
    xAxisMin: -5,
    xAxisMax: 5,
    yAxisMax: .4,
    yAxisTicks_dot: [
        [0.025, ""],
        [0.050, ""],
        [0.075, ""],
        [0.1, ""],
        [0.125, ""],
        [0.15, ""],
        [0.175, ""],
        [0.2, ""],
        [0.225, ""],
        [0.25, ""],
        [0.275, ""],
        [0.3, ""],
        [0.325, ""],
        [0.35, ""],
        [0.375, ""],
        [0.40, ""],
        [0.425, ""], 
        [0.45, ""]],
    yAxisTicks: [],

    baseData:
                [
                { //0
                    data: [], // $X.dGREENArea,
                    color: "rgb(0,200,0)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: true,
                            fillColor: "rgba(0, 255, 0, .4)"
                        }
                },
                { //1
                    data: [], // $X.dGREENLine,
                    //label: "10% of inhaled permissible dose",
                    color: "rgb(0, 200, 0)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: false
                        }
                },
                { //2
                    data: [], // $X.dORANGEArea,
                    color: "rgba(255,153,51,1)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: true,
                            fillColor: "rgba(255,153,51,.4)"
                        }
                },
                { //3
                    name: "redLine",
                    data: [], // $X.dREDLine,
                    //label: "100% inh",
                    color: "rgb(200,0,0)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: false
                        }
                },
                { //4
                    data: [], // $X.dREDArea,
                    color: "rgba(255,0,0,1)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: true,
                            fillColor: "rgba(255,0,0,.4)"
                        }
                },
                { //5
                    data: [], // $X.dDHRLine,
                    color: "rgb(0,0,255)",
                    lines:
                        {
                            show: true,
                            lineWidth: 0.7

                        },
                    points:
                        {
                            show: false
                        }
                },

                { //6
                    data: [], // $X.dDHRPoint,
                    //label: "DHR",
                    color: "rgb(0,0,255)",
                    lines:
                        {
                            show: false
                        },
                    points:
                        {
                            show: true,
                            radius: 4,
                            fill: true,
                            fillcolor: "rgb(255,0,0)"
                        }
                },

                { // 7
                    data: [],
                    color: "rgba(0,0,0,1)",
                    lines:
                        {
                            show: true,
                            lineWidth: .5,
                            fill: true,
                            fillColor: "rgba(0, 0, 0, .9)"
                        },
                    points:
                        {
                            show: false
                        }
                }
            ],

    options:
         {
             legend:
             {
                 noColumns: 3,
                 position: "nw"
             },
             series:
                {
                    points: { show: false }
                },
             xaxis:
                {
                    min: -2,
                    max: 5,
                    ticks:
                        function piTickGenerator(axis) {
                            var res = [];
                            var i = axis.min + 1;

                            for (i = axis.min + 1; i < axis.max; i++) {
                                var v = i;
                                res.push([v, '<span>10<sup>' + i + '</sup></span>']);
                            };
                            return res;
                        }
                },
             yaxis:
                {
                    min: 0.0,
                    max: 12, // $X.yAxisMax,
                    ticks: [] // $X.yAxisTicks
                },
             grid:
                {
                    backgroundColor: "rgba(255,255,255,0)",
                    color: "rgba(0,0,0,1)",
                    borderColor: "#aaa",
                    borderWidth: 1
                }
         },





    legendData:
                [

                { //0
                    data: [[11, 57], [30, 57]], // $X.dGREENLine,
                    color: "rgb(0, 200, 0)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: false
                        }
                },
                { //1
                    name: "redLine",
                    data: [[11, 37], [30, 37]], // $X.dREDLine,
                    color: "rgb(200,0,0)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: false
                        }
                },
                { //2
                    data: [[23, 17], [23, 17]], // DHR
                    color: "rgb(0,0,255)",
                    lines:
                        {
                            show: true,
                            lineWidth: 1,
                            fill: false
                        }
                }
            ],
    legendOptions:
         {
             series:
                {
                    points: { show: false }
                },
             xaxis:
                {
                    min: 0,
                    max: 140,
                    ticks: [] // $X.yAxisTicks

                },
             yaxis:
                {
                    min: 0,
                    max: 70, // $X.yAxisMax,
                    ticks: [] // $X.yAxisTicks
                }
         },






    plot2: function (dGREEN, dORANGE, dRED, mu, fmu, XAxisMin, XAxisMax) {

        var dGREENLine = [];
        var dREDLine = [];
        var dDHRPoint = [];
        var dDHRLine = [];
        var dXAXIS = [];

        dGREENLine.push([-1, -1]);
        dGREENLine.push([-1, 2]);


        dREDLine.push([0.00, -1]);
        dREDLine.push([0.00, 2]);

        //
        dDHRLine.push([mu, -1]);
        dDHRLine.push([mu, 2]);

        //
        dDHRPoint.push([mu, fmu]);

        //
        dXAXIS.push([-12, 0]);
        dXAXIS.push([8.936968193, 0.0]);
        dXAXIS.push([8, 0.002]);

        $X.baseData[0].data = dGREEN;
        $X.baseData[1].data = dGREENLine;
        $X.baseData[2].data = dORANGE;
        $X.baseData[3].data = dREDLine;
        $X.baseData[4].data = dRED;
        $X.baseData[5].data = []; //dDHRLine;
        $X.baseData[6].data = [];  //dDHRPoint;
        $X.baseData[7].data = dXAXIS;

        if (fmu < 0.29) {
            $X.options.yaxis.max = 0.3;
        }
        else {
            if (fmu < 0.39) {
                $X.options.yaxis.max = 0.4;
            }
            else {
                $X.options.yaxis.max = 0.5;
            }
        }
        $X.options.yaxis.ticks = $X.yAxisTicks_dot;

        $X.options.yaxis.max = Math.ceil((fmu + (fmu / 40.0)) * 100) / 100;
        $X.options.xaxis.min = XAxisMin;
        $X.options.xaxis.max = XAxisMax;


        var flot_graph = $.plot($("#FLOT_graph"), $X.baseData, $X.options);
        var flot_div = $("#FLOT_graph");


        var pa_offset = flot_graph.offset();
        var pa_width = flot_graph.width();
        var pa_height = flot_graph.height();



        var availR = (XAxisMax - mu) / (XAxisMax - XAxisMin);
        var availL = (mu - XAxisMin) / (XAxisMax - XAxisMin);

        var legendP = "ne";
        if (availR < 0.25) {
            legendP = "nw";
            if (availL < 0.25) legendP = "n";
        }
        //        alert($G.format('{0} -- ({1}, {2})', legendP, availL, availR));


        var o;


        $X.options.yaxis.max


        //        o = flot_graph.pointOffset({ x: dRED[0][0], y: dRED[0][1] });


        var ctx = flot_graph.getCanvas().getContext("2d");

        var lTop, lLeft;
        if (legendP == "ne") {
            // north east
            o = flot_graph.pointOffset({ x: XAxisMax, y: $X.options.yaxis.max - ($X.options.yaxis.max / 30) });
            lLeft = parseFloat(o.left) - 135 - 6; // pour north east = -150 (ca)
        } else
            if (legendP == "nw") {
                // north west
                o = flot_graph.pointOffset({ x: XAxisMin + ((XAxisMax - XAxisMin) / 400), y: $X.options.yaxis.max - ($X.options.yaxis.max / 30) });
                lLeft = parseFloat(o.left) + 8;
            } else {
                // north
                o = flot_graph.pointOffset({ x: XAxisMin + ((XAxisMax - XAxisMin) / 2), y: $X.options.yaxis.max - ($X.options.yaxis.max / 30) });
                lLeft = parseFloat(o.left) - 62; // 
            }
        lTop = parseFloat(o.top) + 3;

        // le rectangle pour la légende
        ctx.lineWidth = 1;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(lLeft - 3, lTop - 12, 135 + 4, 2 * 34);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(lLeft - 3, lTop - 12, 135 + 4, 2 * 34);

        ctx.lineWidth = 1;
        // GREEN line
        //

        ctx.beginPath();
        ctx.strokeStyle = "#00C800";
        ctx.beginPath();
        ctx.moveTo(lLeft, lTop);
        ctx.lineTo(lLeft + 34, lTop);
        ctx.stroke();
        flot_div.append('<div style="position:absolute;left:' + (lLeft + 40) + 'px;top:' + (lTop - 8) + 'px;color:rgb(0,200,0);font-size:smaller"> : 10% inhaled</div>');

        // RED line
        //
        lTop += 20;
        ctx.beginPath();
        ctx.strokeStyle = "#C80000";
        ctx.moveTo(lLeft, lTop);
        ctx.lineTo(lLeft + 34, lTop);
        ctx.stroke();
        flot_div.append('<div style="position:absolute;left:' + (lLeft + 40) + 'px;top:' + (lTop - 8) + 'px;color:rgb(200,0,0);font-size:smaller"> : 100% inhaled</div>');

        // Star
        //
        var starB = 11;
        var starBShort = starB * Math.cos(Math.PI / 4);
        var starLeft = lLeft + 34 - starB;
        lTop += 20;
        ctx.beginPath();
        ctx.strokeStyle = "#0000FF";

        ctx.moveTo(starLeft - starBShort, lTop - starBShort);
        ctx.lineTo(starLeft + starBShort, lTop + starBShort);

        ctx.moveTo(starLeft + starBShort, lTop - starBShort);
        ctx.lineTo(starLeft - starBShort, lTop + starBShort);

        ctx.moveTo(starLeft, lTop - starB);
        ctx.lineTo(starLeft, lTop + starB);

        ctx.moveTo(starLeft - starB, lTop);
        ctx.lineTo(starLeft + starB, lTop);

        ctx.stroke();
        flot_div.append('<div style="position:absolute;left:' + (lLeft + 40) + 'px;top:' + (lTop - 8) + 'px;color:rgb(0,0,255);font-size:smaller"> : DHR</div>');



        // x axis arrow.
        o = flot_graph.pointOffset({ x: dRED[50][0], y: 0 });

        o.top += 4;
        o.left -= 12;

        ctx.beginPath();
        ctx.moveTo(o.left, o.top);
        ctx.lineTo(o.left, o.top - 8);
        ctx.lineTo(o.left + 12, o.top - 4);
        ctx.lineTo(o.left, o.top);
        ctx.lineWidth = 1;
        ctx.fillStyle = "#000";
        ctx.fill();

        // DHR dotted line
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "#000";

        o = flot_graph.pointOffset({ x: dDHRPoint[0][0], y: 0 });
        var y = o.top;
        var cx = o.left + 1;
        o = flot_graph.pointOffset({ x: dDHRPoint[0][0], y: $X.options.yaxis.max });
        var minY = o.top + 1;
        var stepY = 3;
        do {
            ctx.moveTo(cx, y);
            y -= stepY;
            if (y < minY) y = minY;
            ctx.lineTo(cx, y);
            y -= 2 * stepY;

        } while (y > minY);

        ctx.stroke();

        // subdivision line

        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "#000";
        var subA = [];
        var subFirst = Math.pow(10, Math.ceil(mu) - 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#00F";
        for (var is = 0; is < 10; is++) {
            subA.push($G.log10(subFirst + (is * subFirst)));
            var x = $G.log10(subFirst + (is * subFirst));
            o = flot_graph.pointOffset({ x: x, y: 0 });
            y = o.top;
            x = o.left + .5;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 5);
        };
        ctx.stroke();
        // alert(subA.join());


        // DHR star
        o = flot_graph.pointOffset({ x: dDHRPoint[0][0], y: dDHRPoint[0][1] });
        o.left++;
        o.top++;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#0000FF";

        ctx.moveTo(o.left - starBShort, o.top - starBShort);
        ctx.lineTo(o.left + starBShort, o.top + starBShort);

        ctx.moveTo(o.left + starBShort, o.top - starBShort);
        ctx.lineTo(o.left - starBShort, o.top + starBShort);

        ctx.moveTo(o.left, o.top - starB);
        ctx.lineTo(o.left, o.top + starB);

        ctx.moveTo(o.left - starB, o.top);
        ctx.lineTo(o.left + starB, o.top);

        ctx.stroke();



    },

    plotEmpty: function () {


        //

        $X.baseData[0].data = [];
        $X.baseData[1].data = [];
        $X.baseData[2].data = [];
        $X.baseData[3].data = [];
        $X.baseData[4].data = [];
        $X.baseData[5].data = []; //dDHRLine;
        $X.baseData[6].data = [];  //dDHRPoint;
        $X.baseData[7].data = [];

        $X.options.xaxis.min = .2;
        $X.options.xaxis.max = .3;
        $X.options.yaxis.ticks = [];

        var flot_graph = $.plot($("#FLOT_graph"), $X.baseData, $X.options);

    }

}