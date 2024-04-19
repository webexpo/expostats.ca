/// <reference path="o.js" />
/// <reference path="f.js" />
/// <reference path="t.js" />
/// <reference path="position.js" />
/// <reference path="x.js" />


$C =
{
    DEBUG : false,
    uDataHasError: new $O.E(false, false),
    userData: {}, // objet $O.U

    $T:
    {
        za: 'applet',
        zd: 'debug'
    },


    getApplet: function () {

        return document.getElementById($C.$T.za);
    },
    getDebug: function () {
        return document.getElementById($C.$T.zd);
    },



    recalcDisplay: function () {

        var substance = $O.S_A[document.getElementById("SL").selectedIndex];

        var errel = document.getElementById("t_error");
        $F.fA.hideGas();
        // qu'il y ait ou non des erreurs on formate la zone
        $F.formatError($C.uDataHasError, errel);


        $F.fA.setSubstanceField(substance);

        $F.fA.setWarnings(substance);
        var duration = document.getElementById("t_duration").value;
        var ssie = document.getElementById("cb_SSIE").checked;
        var bpe;
        bpe = new $O.BPE(
                document.getElementById("cb_head").checked,
                document.getElementById("cb_trunk").checked,
                document.getElementById("cb_larm").checked,
                document.getElementById("cb_rarm").checked,
                document.getElementById("cb_lhand").checked,
                document.getElementById("cb_rhand").checked,
                document.getElementById("cb_lleg").checked,
                document.getElementById("cb_rleg").checked,
                document.getElementById("cb_lfoot").checked,
                document.getElementById("cb_rfoot").checked);

        if (substance.DHR_status) {
            $F.fA.showHideGas(substance);
            if (substance.isGaseous()) {
                bpe = new $O.BPE(true, true, true, true, true, true, true, true, true, true);
            }
            $C.userData = new $O.U(substance, duration, bpe, ssie);
            $F.fA.showHideDHR(substance);

            if (!$C.uDataHasError.get()) {

                document.getElementById("t_dhrCalc").innerHTML = $F.formatDHR($C.userData.DHRAdjusted);
                document.getElementById("t_pcRED").innerHTML = $G.fmtPC($C.userData.pcRED);
                document.getElementById("t_pcORANGE").innerHTML = $G.fmtPC($C.userData.pcORANGE);
                document.getElementById("t_pcGREEN").innerHTML = $G.fmtPC($C.userData.pcGREEN);
                $F.fA.setRiskAssessment($C.userData);
                $X.plot2($C.userData.dGREEN, $C.userData.dORANGE, $C.userData.dRED, $C.userData.mu, $C.userData.fmu, $C.userData.XAxisMinMax.min, $C.userData.XAxisMinMax.max);
            }
            else {
                $F.fA.setWarnings(substance);
                $X.plotEmpty();
            }
        } else {
            $F.fA.showHideDHR(substance);
            $F.fA.format4NoDHR();
            $X.plotEmpty();
            $C.userData = new $O.U(substance, duration, bpe, ssie);
        }
        if($C.DEBUG) $C.getDebug().innerHTML = $C.userData.toDebug();
    },


    substanceChanged: function (sender) {
        var substance = $O.S_byId[sender.options[sender.selectedIndex].attributes.sid.value];
        if (sender.id == "SL") {
            document.getElementById("CASL").selectedIndex = substance.casNdx;
        }
        else {
            document.getElementById("SL").selectedIndex = substance.ndx;
        }
        $C.recalcDisplay();
    },

 
    init: function () {

        $O.S_byCAS.sort(function (a, b) { return a.cas - b.cas; });
        var tmp = "";
        var l;
        for (var i in $O.S_byCAS) {
            $O.S_byCAS[i].casNdx = i;
            tmp = $O.S_byCAS[i].cas.toString();
            l = tmp.length;
            var sb = [];
            sb.push(tmp.substr(0, l - 3));
            sb.push(tmp.substr(l - 2 - 1, 2));
            sb.push(tmp.substr(l - 1, 1));
            $O.S_byCAS[i].casStr = sb.join("-");
        }


        var rep;
        rep = $F.getSubstanceList();
        document.getElementById("td_SL").innerHTML = rep;

        rep = $F.getCASList();
        document.getElementById("td_CASL").innerHTML = rep;
        document.getElementById("contents").className = document.getElementById("contents").className.replace(new RegExp('hide', 'g'), 'show');
        $C.reset();
    },



    selectSubstance: function (substance_id) {
        var o = document.getElementById("SL");
        o.selectedIndex = $O.S_byId[substance_id].ndx;
        $C.substanceChanged(o);
        $C.SRCH.closeSrchWin();
    },


    surfaceExposedChange: function (sender) {

        if (
            $G.byId("cb_head").checked ||
            $G.byId("cb_trunk").checked ||
            $G.byId("cb_larm").checked ||
            $G.byId("cb_rarm").checked ||
            $G.byId("cb_lhand").checked ||
            $G.byId("cb_rhand").checked ||
            $G.byId("cb_lleg").checked ||
            $G.byId("cb_rleg").checked ||
            $G.byId("cb_lfoot").checked ||
            $G.byId("cb_rfoot").checked) {
            $C.uDataHasError.bodyParts = false;
            $G.byId("t_bodyParts").style.color = 'rgb(0,0,0)';

        } else {
            $G.byId("t_bodyParts").style.color = 'rgb(255,127,0)';
            $C.uDataHasError.bodyParts = true;
        }
        $C.recalcDisplay();
    },

    durationChange: function (sender) {
        var d = parseInt(sender.value.trim(), 10);
        if (isNaN(d) || (d < 1) || d > 480) {
            sender.style.backgroundColor = 'rgb(255,127,0)';
            if (!$C.uDataHasError.duration) {
                var f = function () { sender.focus(); sender.select(); };
                window.setTimeout(f, 20);
                $C.uDataHasError.duration = true;
            }
        }
        else {
            sender.style.backgroundColor = 'rgb(255,255,255)';
            $C.uDataHasError.duration = false;
            if (d.toString() != sender.value) {
                sender.value = d.toString();
            }
        }
        $C.recalcDisplay();
    },
    durationChange_: function (event) {
        // pour IE
        if (event.keyCode == 13) {
            var target = event.target || event.srcElement;
            $C.durationChange(target);
        }
    },

    getSSIE: function (sender) {
        $C.recalcDisplay();
    },

    reset: function () {
        document.getElementById("cb_head").checked = false;
        document.getElementById("cb_trunk").checked = false;
        document.getElementById("cb_larm").checked = false;
        document.getElementById("cb_rarm").checked = false;
        document.getElementById("cb_lhand").checked = true;
        document.getElementById("cb_rhand").checked = true;
        document.getElementById("cb_lleg").checked = false;
        document.getElementById("cb_rleg").checked = false;
        document.getElementById("cb_lfoot").checked = false;
        document.getElementById("cb_rfoot").checked = false;

        document.getElementById("t_duration").value = "10";
        var o = document.getElementById("SL");
        o.selectedIndex = 0;
        $C.substanceChanged(o);
        document.getElementById("CASI").value = "";
        document.getElementById("t_name").value = "";
        document.getElementById("srchRes").innerHTML = "";

    }
};

$C.SRCH =
{
    srchRes_A: [],
    srchResPrev_A: null,

    opnSrchWin: function () {

        var srchWin = document.getElementById("srchWin");
        var srchWin_s = srchWin.style;

        if (srchWin_s.visibility == 'visible') {
            srchWin_s.visibility = 'hidden';
            srchWin_s.display = 'none';
            return;
        }

        var appletTbl = document.getElementById("appletTbl");
        var appletTbl_p = Position.get(appletTbl);


        // position de la liste select
        var SL_p = Position.get(document.getElementById("SL"));

        Position.set(srchWin, appletTbl_p.left + 15, SL_p.top + SL_p.height + 18);

        srchWin_s.width = (appletTbl_p.width - 55) + "px";
        srchWin_s.display = "block";
        srchWin_s.visibility = "visible";

    },

    closeSrchWin: function () {
        var srchWin_s = document.getElementById("srchWin").style;
        srchWin_s.display = "none";
        srchWin_s.visibility = "hidden";
    },
    doSearch: function (str, previous) {
        var param = document.getElementById(str).value;
        var rep;
        if (previous) {
            if ($C.SRCH.srchRes_A.length === 0) {
                alert("Previous result set is empty!");
                return;
            }
            else {
                $C.SRCH.srchResPrev_A = $C.SRCH.srchRes_A.slice();
            }
        }
        else {
            $C.SRCH.srchResPrev_A = $O.S_A.slice();
        }

        document.getElementById("recCount").innerHTML = "&nbsp";
        rep = $C.SRCH.searchForSubstance(param);
        if (rep === null) {
            alert('An empty string in not accepted as a search criteria!');
            return;
        }

        document.getElementById("recCount").innerHTML = rep.length > 1 ? rep.length + " matches." : (rep.length == 1 ? "1 match." : "No match.");

        var srchRes = document.getElementById("srchRes");
        var papa = srchRes.parentNode;
        papa.removeChild(srchRes);
        var el = document.createElement("div");
        el.setAttribute("id", "srchRes");
        el.innerHTML = $F.getSearchResult(rep);
        papa.appendChild(el);

    },

    searchForSubstance: function (str) {

        if (str == '') {
            return null;
        }
        // On désactive les expressions régulières.
        str = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        var re = new RegExp(str, 'i');
        $C.SRCH.srchRes_A = [];

        for (var i = 0; i < $C.SRCH.srchResPrev_A.length; i++) {
            if (re.test($C.SRCH.srchResPrev_A[i].name_en)) {
                $C.SRCH.srchRes_A.push($C.SRCH.srchResPrev_A[i]);
            }
        }
        return $C.SRCH.srchRes_A;
    },
    locateCAS: function () {

        $C.SRCH.closeSrchWin();
        var reg = new RegExp("[- ]", "g");
        var orig = document.getElementById("CASI").value.trim();
        var tmp = orig.replace(reg, "");

        if (tmp.length === 0) {
            alert("Please enter a CAS number!");
            return;
        }
        var tmpNum = parseInt(tmp, 10);
        if (isNaN(tmpNum)) {
            alert('"' + orig + '" is not a valid CAS number!');
            return;
        }


        var high = $O.S_byCAS.length - 1;
        var low = 0;
        var element;
        var substance;
        while (low <= high) {
            mid = parseInt((low + high) / 2, 10);
            substance = $O.S_byCAS[mid];
            element = $O.S_byCAS[mid].cas;
            if (element > tmpNum) {
                high = mid - 1;
            } else if (element < tmpNum) {
                low = mid + 1;
            } else {
                break;
            }
        }

        if (substance.cas != tmpNum) {
            alert("CAS " + orig + " not found!");
            return;
        }


        var o = document.getElementById("SL");
        o.selectedIndex = substance.ndx;
        $C.substanceChanged(o);


    }
};
