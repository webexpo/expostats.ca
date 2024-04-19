/// <reference path="g.js" />
/// <reference path="a.js" />

$O =
{
    S_byId: [], // registres des substances par id. Possiblement inutile
    S_alpha: [],
    S_A: [], // tableau(0..n) des substances
    S_byCAS: [] // registes des substances par no cas
};

// Risk phrases
$O.RP = function (id, rText_en) {
    this._id = id;
    this.rText_en = rText_en;

};


// Catégorie aigue du GHS
$O.GHSAC = function (id, signal_en, statement_oral_en, statement_dermal_en, statement_inhalation_en) {

    this._id = id;
    this.signal_en = signal_en;
    this.statement_orl_en = statement_oral_en;
    this.statement_skn_en = statement_dermal_en;
    this.statement_inhalation_en = statement_inhalation_en;
};

// Catégorie chronique (repeated) du GHS
$O.GHSRE = function (id, signal_en, statement_oral_en, statement_dermal_en, statement_inhalation_en) {

    this._id = id;
    this.signal_en = signal_en;
    this.statement_orl_en = statement_oral_en;
    this.statement_skn_en = statement_dermal_en;
    this.statement_inhalation_en = statement_inhalation_en;
};

// Dame Béatrice de Magnusson ( Catégorie de pénétration du derme)
$O.SP = function (id, potentialText_en, note) {
    /// <summary>Objet : Skin permeation </summary>
    /// <param name="id" type="Number">Un entier identifiant l'objet</param>
    /// <field name="_id" type="Number">L'entier identifiant l'objet</field>
    /// <returns type="$O.SP">return type summary</returns>

    this._id = id;
    this.potentialText_en = potentialText_en;
    this.note = note;
};

// une substance
$O.S = function (id,
                cas,
                name_en,
                RP_status,
                RP_43,
                RP_irr,
                RP_sys,
                DE_sn,
                ACGIH_sn,
                DE_oel_basis_irr,
                ACGIH_oel_basis_irr,
                DHR,
                DHR_gsd,
                DHR_status,
                sp_cat,
                GHS_acute_orl,
                GHS_acute_skn,
                GHS_chronic_orl,
                GHS_chronic_skn,
                CMR_status,
                CMR_C,
                CMR_M,
                CMR_R,
                vp,
                physicalState,
                OEL_status,
                RTECS_irr
                ) {
    /// <summary>Objet : Substance </summary>
    /// <param name="id" type="Number">Un entier identifiant l'objet</param>
    /// <param name="cas" type="Number">Le no cas sous forme de nombre</param>
    /// <param name="name_en" type="String">Le nom anglais de la substance</param>
    /// <param name="RP_43" type="$O.RP">Risk phrase 43</param>
    /// <param name="RP_irr" type="$O.RP">Risk phrase sur l'irritation (27 || 66) (2 possibilité)</param>
    /// <param name="RP_sys" type="$O.RP">Risk phrase sur l'irritation (27 || 66) (2 possibilité)</param>
    /// <field name="_id" type="Number">L'entier identifiant l'objet</field>
    /// <returns type="$O.S">return type summary</returns>
    this._id = id;

    this.cas = cas;
    this.irritationBasedOEL = false;
    this.name_en = name_en;

    this.RP_status = RP_status;
    this.RP_43 = RP_43; // Objet RP
    this.RP_irr = RP_irr;  // Objet RP
    this.RP_sys = RP_sys; // Objet RP

    this.DE_sn = DE_sn; // Y = 1; N = 0; -1 = Ne s'applique pas
    this.ACGIH_sn = ACGIH_sn; // Y = 1; N = 0; -1 = Ne s'applique pas

    this.DE_oel_basis_irr = DE_oel_basis_irr; // Y = 1; N = 0; -1 = Ne s'applique pas
    this.ACGIH_oel_basis_irr = ACGIH_oel_basis_irr; // Y = 1; N = 0; -1 = Ne s'applique pas

    this.DHR = DHR; // double
    this.DHR_gsd = DHR_gsd; // double
    this.DHR_status = DHR_status,

    this.sp_cat = sp_cat; // objet SP.

    this.GHS_acute_orl = GHS_acute_orl;
    this.GHS_acute_skn = GHS_acute_skn;
    this.GHS_chronic_orl = GHS_chronic_orl;
    this.GHS_chronic_skn = GHS_chronic_skn;

    this.CMR_status = CMR_status;
    this.CMR_C = CMR_C;
    this.CMR_M = CMR_M;
    this.CMR_R = CMR_R;

    this.vp = vp;

    this.physicalState = physicalState;

    // On corrige un bug repéré en juin 2012 par un étudiant de Jérôme.

    // Par ailleurs notons que la surface du corps utilisé par Jérôme dans ses calculs est de 18000
    // alors que la somme de toutes les parties est de 16160.

    if(this.physicalState == 1) {
      this.DHR = this.DHR / 10.0;
    }

   

    this.OEL_status = OEL_status;

    this.RTECS_irr = RTECS_irr;

    $O.S_byId[id] = this;
    $O.S_byCAS.push(this);
    this.ndx = $O.S_A.length; // ajout
    $O.S_A[this.ndx] = this; // ajout
    this.getACGIH_sn = function () {
        if (this.ACGIH_sn == null) return "---";
        if (this.ACGIH_sn == 0) return "No";
        if (this.ACGIH_sn == 1) return "Yes";
    };
    this.getDE_oel_basis_irr = function () {
        if (this.DE_oel_basis_irr == null) return "---";
        if (this.DE_oel_basis_irr == 0) return "No";
        if (this.DE_oel_basis_irr == 1) return "Yes";
    };
    this.getACGIH_oel_basis_irr = function () {
        if (this.ACGIH_oel_basis_irr == null) return "---";
        if (this.ACGIH_oel_basis_irr == 0) return "No";
        if (this.ACGIH_oel_basis_irr == 1) return "Yes";
    };

    this.getDE_sn = function () {
        if (this.DE_sn == null) return "---";
        if (this.DE_sn == 0) return "No";
        if (this.DE_sn == 1) return "Yes";
    };
    this.getRP = function () {
        if (this.RP_status == null) {
            return "None";
        }
        if (!this.RP_status) {
            return "---";
        }
        var rep = [];
        if (this.RP_43 != null) rep.push(this.RP_43);
        if (this.RP_irr != null) rep.push(this.RP_irr);
        if (this.RP_sys != null) rep.push(this.RP_sys);
        rep.sort(function (a, b) { return a._id - b._id });
        for (var i in rep)
            rep[i] = "R" + rep[i]._id;

        return rep.join(", ");
    };

    this.getRP_long = function () {
        if (!this.RP_status) {
            return [];
        }
        else {
            if (this.RP_status == null) {
                return [];
            }
        }
        var rep = [];
        if (this.RP_43 != null) rep.push(this.RP_43);
        if (this.RP_irr != null) rep.push(this.RP_irr);
        if (this.RP_sys != null) rep.push(this.RP_sys);
        rep.sort(function (a, b) { return a._id - b._id });
        return rep;
    };

    this.getCMR = function () {
        if (this.CMR_status == null) {
            return "None";
        }
        if (!this.CMR_status) {
            return "---";
        }
        var rep = [];
        if (this.CMR_C != null) rep.push(CMR_C);
        if (this.CMR_M != null) rep.push(CMR_M);
        if (this.CMR_R != null) rep.push(CMR_R);

        rep.sort(function (a, b) { return a._id - b._id });
        return rep.join(", ");
    }
};
$O.setIrritionBasedOEL = function(id) {
    var s = $O.S_byId[id];
    if(s) {
        s.irritationBasedOEL = true;
    }
}
$O.S.prototype =
{

    _id: null,
    cas: null,
    name_en: null,
    RP_status: false,
    RP_43: {},
    RP_irr: {}, // Objet RP
    RP_sys: {}, // Objet RP
    DE_sn: null, // Y = 1; N = 0; -1 = Ne s'applique pas
    ACGIH_sn: null, // Y = 1; N = 0; -1 = Ne s'applique pas
    DE_oel_basis_irr: null, // Y = 1; N = 0; -1 = Ne s'applique pas
    ACGIH_oel_basis_irr: null, // Y = 1; N = 0; -1 = Ne s'applique pas
    DHR: -1, // double
    DHR_gsd: -1, // double
    sp_cat: null,
    GHS_acute_orl: null,
    GHS_acute_skn: null,
    GHS_chronic_orl: null,
    GHS_chronic_skn: null,
    vp: null,
    physicalState: -1,
    OEL_status: 'blank',
    RTECS_irr: false,


    toDebug: function () {

        var a = [];
        a.push("<ul>");
        a.push("<li>id: "); a.push(this._id); a.push("("); a.push(this.ndx); a.push(")")
        a.push("<li>cas: "); a.push(this.casStr); a.push("("); a.push(this.casNdx); a.push(")")
        a.push("<li>name_en: "); a.push(this.name_en);
        a.push("<li>RP: "); a.push("status=" + this.RP_status)
        a.push(", 43= " + (this.RP_43 == null ? "null" : this.RP_43._id));
        a.push(", irr= " + (this.RP_irr == null ? "null" : "R" + this.RP_irr._id));
        a.push(", sys= " + (this.RP_sys == null ? "null" : this.RP_sys._id));
        a.push("<li>DE_sn: "); a.push(this.getDE_sn());
        a.push("<li>ACGIH_sn: "); a.push(this.getACGIH_sn());
        a.push("<li>DE_oel_basis_irr: "); a.push(this.getDE_oel_basis_irr());
        a.push("<li>ACGIH_oel_basis_irr: "); a.push(this.getACGIH_oel_basis_irr());
        a.push("<li>sp_cat: "); a.push((this.sp_cat == null) ? 'null' : this.sp_cat._id + " - " + this.sp_cat.potentialText_en);
        a.push("<li>GHS: acu_skn= "); a.push(this.GHS_acute_skn.signal_en + " !" + this.GHS_acute_skn._id);
        a.push(", acu_orl= "); a.push(this.GHS_acute_orl.signal_en + " !" + this.GHS_acute_orl._id);
        a.push(", chr_skn= "); a.push(this.GHS_chronic_skn.signal_en + " !" + this.GHS_chronic_skn._id);
        a.push(", chr_orl= "); a.push(this.GHS_chronic_orl.signal_en + " !" + this.GHS_chronic_orl._id);
        a.push("<li>vp: "); a.push(this.vp);
        a.push("<li>OEL_status: "); a.push(this.OEL_status);
        a.push("<li>DHR_status: "); a.push(this.DHR_status);
        a.push("<li>DHR: "); a.push(this.DHR);
        a.push("<li>DHR_gsd: "); a.push(this.DHR_gsd);
        a.push("</ul>");
        return a.join("");
    },

    isVolatile: function () {
        return this.vp > 3.75;
    },
    isIrritating: function () {
        if ((this.RP_status) || (this.RP_status == null))
            return (this.RP_irr != null);
        else
            return this.RTECS_irr;
    },
    isGaseous: function () {
        return this.physicalState == 1;
    },
    isDHRspecial: function () {
        var a =
            (this.OEL_status == 'ld50ipr') ||
            (this.OEL_status == 'ld50iv') ||
            (this.OEL_status == 'ld50orl') ||
            (this.OEL_status == 'ld50scu') ||
            (this.OEL_status == 'ld50skn') ||
            (this.OEL_status == 'loaelorl') ||
            (this.OEL_status == 'loaelskin');
        return a;
    }
};
$O.getSById = function (id) {
    ///<returns type="$O.S">"$O.S"</returns>
    return $O.S_byId[id];
};

$O.head = 1180;
$O.trunk = 5690;
$O.larm = 1140;
$O.rarm = 1140;
$O.lhand = 420;
$O.rhand = 420;
$O.lleg = 2525;
$O.rleg = 2525;
$O.lfoot = 560;
$O.rfoot = 560;


$O.BPE = function (head, trunk, larm, rarm, lhand, rhand, lleg, rleg, lfoot, rfoot) {
    this.head = head ? $O.head : 0;
    this.trunk = trunk ? $O.trunk : 0;
    this.larm = larm ? $O.larm : 0;
    this.rarm = rarm ? $O.rarm : 0;
    this.lhand = lhand ? $O.lhand : 0;
    this.rhand = rhand ? $O.rhand : 0;
    this.lleg = lleg ? $O.lleg : 0;
    this.rleg = rleg ? $O.rleg : 0;
    this.lfoot = lfoot ? $O.lfoot : 0;
    this.rfoot = rfoot ? $O.rfoot : 0;
    this.surface = 0.000000001 + this.head + this.trunk + this.larm + this.rarm + this.lhand + this.rhand + this.lleg + this.rleg + this.lfoot + this.rfoot;
};

$O.BPE.prototype.toDebug = function () {
    var a = [];
    a.push("<ul>");

    a.push("<li>&nbsp;head : " + this.head);
    a.push("<li>&nbsp;trunk : " + this.trunk);
    a.push("<li>&nbsp;larm : " + this.larm);
    a.push("<li>&nbsp;rarm : " + this.rarm);
    a.push("<li>&nbsp;lhand : " + this.lhand);
    a.push("<li>&nbsp;rhand : " + this.rhand);
    a.push("<li>&nbsp;lleg : " + this.lleg);
    a.push("<li>&nbsp;rleg : " + this.rleg);
    a.push("<li>&nbsp;lfoot : " + this.lfoot);
    a.push("<li>&nbsp;rfoot : " + this.rfoot);
    a.push("<li>&nbsp;<b>TOTAL</b> : " + this.surface);
    a.push("</ul>");
    return a.join("");
};


$O.U = function (substance, duration, bodyPartsExposed, ssie) {
    this.substance = substance;
    this.duration = duration;
    this.BPE = bodyPartsExposed; // objet BPE
    this.ssie = ssie;

    this.sigma = $G.log10(substance.DHR_gsd);
    this.dGREEN = [];
    this.dORANGE = [];
    this.dRED = [];

    if (substance.DHR_status) {
        this.DHRAdjusted = $A.getDHRAdjusted(substance.DHR, duration, this.BPE.surface);
        this.mu = $G.log10(this.DHRAdjusted);
        this.fmu = $A.nd_densityf(this.mu, this.mu, this.sigma);
        this.pcGREEN = $A.nd_cdf(-1, this.mu, this.sigma);
        this.pcORANGE = $A.nd_cdf(0, this.mu, this.sigma) - $A.nd_cdf(-1, this.mu, this.sigma);
        this.pcRED = 1 - $A.nd_cdf(0, this.mu, this.sigma);

        this.DHRMinMax = $A.getDHRMinMax(substance.DHR, true);
        this.XAxisMinMax = {
            min: Math.min(-2, Math.round($A.nd_inversecdf(0.2, $G.log10(this.DHRMinMax.min), this.sigma))),
            max: Math.max(1, Math.round($A.nd_inversecdf(0.8, $G.log10(this.DHRMinMax.max), this.sigma)))
        };
        var x;
        var step;

        step = (-1 - this.XAxisMinMax.min) / 50;
        x = this.XAxisMinMax.min;
        for (var i = 0; i < 51; i++) {
            this.dGREEN.push([x, $A.nd_densityf(x, this.mu, this.sigma)]);
            x += step;
        }

        step = 0.05;
        x = -1;
        for (var l = 0; l < 21; l++) {
            this.dORANGE.push([x, $A.nd_densityf(x, this.mu, this.sigma)]);
            x += step;
        }

        step = this.XAxisMinMax.max / 50;
        x = 0;
        for (var j = 0; j < 51; j++) {
            this.dRED.push([x, $A.nd_densityf(x, this.mu, this.sigma)]);
            x += step;
        }
    }
    else {
        this.fmu = Number.NaN;
        this.DHRMinMax = {
            min: Number.NaN,
            max: Number.NaN
        };
        this.XAxisMinMax = {
            min: Number.NaN,
            max: Number.NaN
        };
    }
};

$O.U.prototype.toDebug = function () {
    var rep = [];
    rep.push('<p style="font-size:1.1em; font-size: 2em; font-variant:small-caps;">DEBUG</p>');
    rep.push('<p style="font-size:1.1em; font-variant:small-caps;">Substance</p>' + this.substance.toDebug());
    rep.push('<p style="font-size:1.1em; font-variant:small-caps;">Duration: ' + this.duration + '</p>');
    rep.push('<p style="font-size:1.1em; font-variant:small-caps;">Body parts</p>' + this.BPE.toDebug());
    rep.push('<p style="font-size:1.1em; font-variant:small-caps;">ssie: ' + this.ssie + '</p>');

    rep.push('<p style="font-size:1.1em; font-variant:small-caps;">Calc</p>');

    rep.push("<ul>");
    rep.push("<li>DHRAdjusted: "); rep.push(this.DHRAdjusted); rep.push(", minMax ["); rep.push(this.DHRMinMax.min); rep.push(", "); rep.push(this.DHRMinMax.max); rep.push("]");
    rep.push("<li>mu: "); rep.push(this.mu); rep.push(" -- f(mu): "); rep.push(this.fmu);
    rep.push("<li>sigma: "); rep.push(this.sigma);
    rep.push("<li>pcGREEN: "); rep.push(this.pcGREEN);
    rep.push("<li>pcORANGE: "); rep.push(this.pcORANGE);
    rep.push("<li>pcRED: "); rep.push(this.pcRED);
    rep.push("<li>XAxis minMax: ["); rep.push(this.XAxisMinMax.min); rep.push(", "); rep.push(this.XAxisMinMax.max); rep.push("]");


    return rep.join("");
};

$O.E = function (duration, bodyParts) {
    /// <summary>Objet : User data error </summary>
    /// <param name="duration" type="Boolean">Erreur dans la durée</param>
    /// <param name="bodyParts" type="Boolean">Aucune partie du corps sélectionné</param>
    /// <field name="duration" type="Boolean">Erreur dans la durée</field>
    /// <field name="bodyParts" type="Boolean">Aucune partie du corps sélectionné</field>
    /// <returns type="$O.E">return un objet Erreur</returns>
    this.duration = duration;
    this.bodyParts = bodyParts;
    this.get = function () {
        return this.duration || this.bodyParts;
        /// <summary>Objet : User data error </summary>
        /// <returns type="Boolean">duration || bodyParts</returns>
    };
};