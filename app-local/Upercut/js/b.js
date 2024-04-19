/// <reference path="vs/vs.js" />




var $B =
{
    calc: function(substance, duration, bpe, ssie) {

        var uData = new $O.U(substance, duration, bpe, ssie);

        var dGREEN = [];
        var dORANGE = [];
        var dRED = [];

        var x;
        var step;

        step = (-1 - uData.XAxisMinMax.min) / 50;
        x = uData.XAxisMinMax.min;
        for (var i = 0; i < 51; i++) {
            dGREEN.push([x, $A.nd_densityf(x, uData.mu, uData.sigma)]);
            x += step;
        }

        step = 0.05;
        x = -1;
        for (var l = 0; l < 21; l++) {
            dORANGE.push([x, $A.nd_densityf(x, uData.mu, uData.sigma)]);
            x += step;
        }

        step = uData.XAxisMinMax.max / 50;
        x = 0;
        for (var j = 0; j < 51; j++) {
            dRED.push([x, $A.nd_densityf(x, uData.mu, uData.sigma)]);
            x += step;
        }

        // ce qui suit ne devrait pas y être

        //      alert(($F.formatDHR(uData.DHRAdjusted) + " --- " + uData.DHRAdjusted));
        
        document.getElementById("t_dhrCalc").innerHTML = $F.formatDHR(uData.DHRAdjusted);
        document.getElementById("t_pcRED").innerHTML = $G.fmtPC(uData.pcRED);
        document.getElementById("t_pcORANGE").innerHTML = $G.fmtPC(uData.pcORANGE);
        document.getElementById("t_pcGREEN").innerHTML = $G.fmtPC(uData.pcGREEN);
        $F.fA.setRiskAssessment(uData);
        $X.plot2(dGREEN, dORANGE, dRED, uData.mu, uData.fmu, uData.XAxisMinMax.min, uData.XAxisMinMax.max);
    }


};