/// <reference path="o.js" />
/// <reference path="dat.js" />
/// <reference path="t.js" />
/// <reference path="g.js" />
/// <reference path="c.js" />

String.prototype.trim = function () {
    ///	<summary>
    ///		Enlève les blancs en début et fin d'une chaîne
    ///	</summary>
    ///	<returns type="String" />

    return this.replace( /^\s+|\s+$/g, "" );
};
var $F = {};

$F.formatDHR = function ( dhr ) {
    ///	<summary>
    ///		Formatage du DHR sous la forme du chaine HTML
    ///	</summary>
    ///	<returns type="String" />
    ///	<param name="dhr" type="Number">
    ///	</param>

    var l;
    var fFormatDHR;
    var x;
    l = Math.round( $G.log10( dhr ) );
    x = dhr * Math.pow( 10, -l );
    while ( x < 1 ) {
        x *= 10;
        l--;
    };

    while ( x > 10 ) {
        x /= 10;
        l++;
    };

    return "DHR = " + x.toFixed( 1 ) + '<span style="font-size:smaller"> x </span>10<sup >' + l + '</sup>';
    if ( ( l <= -2 ) || ( l >= 2 ) )
        fFormatDHR = x.toFixed( 1 ) + "x10<sup>" + l + "</sup>";
    else if ( ( l <= -1 ) || ( l >= 1 ) )
        fFormatDHR = ( x * 10 ).toFixed( 0 );
    else
        fFormatDHR = x.toFixed( 2 );
    return "DHR=" + fFormatDHR;
};

$F.formatError = function ( err, el ) {
    /// <summary>Formattage des erreurs</summary>
    /// <param name="err" type="$O.E">Objet erreur</param>
    /// <param name="el" type="document.documentElement">Objet documentElement</param>
    if ( err.get() ) {
        var s = "";
        if ( err.duration ) {
            s += $T.e_duration;
        }
        if ( err.bodyParts ) {
            s += $T.e_bodyParts;
        }

        el.innerHTML = s;
        el.className = el.className.replace( new RegExp( 'hide', "g" ), 'show' );
        var o;
        o = $G.byId( "resInterpretation" );
        o.className = o.className.replace( new RegExp( 'show', "g" ), 'hide' );


    }
    else {
        el.innerHTML = "";
        el.className = el.className.replace( new RegExp( 'show', "g" ), 'hide' );
        var o;
        o = $G.byId( "resInterpretation" );
        o.className = o.className.replace( new RegExp( 'hide', "g" ), 'show' );
        o = $G.byId( "t_warnings" );
        o.className = o.className.replace( new RegExp( 'hide', "g" ), 'show' );
    }
};

$F.getSubstanceList = function () {
    var rep = "";
    var sb = new Array();
    for ( var i in $O.S_A ) {
        $T.opt_fA[1] = $O.S_A[i]._id;
        $T.opt_fA[3] = $O.S_A[i].name_en;
        sb.push( $T.opt_fA.join( "" ) );
    }
    rep = sb.join( "\n" );
    $T.sel_SL_fA[1] = rep;
    return $T.sel_SL_fA.join( "" );
    return rep;
};

$F.getSearchResult = function ( A ) {
    var sb = new Array();

    for ( var i in A ) {
        $T.srch_selFA[1] = A[i]._id;
        $T.srch_selFA[3] = A[i].name_en;
        sb.push( $T.srch_selFA.join( "" ) );
    }
    return sb.join( "" );
};

$F.getCASList = function () {
    var rep = $T.E;
    var sb = new Array();
    for ( var i in $O.S_byCAS ) {
        $T.opt_fA[1] = $O.S_byCAS[i]._id;
        $T.opt_fA[3] = $O.S_byCAS[i].casStr;
        sb.push( $T.opt_fA.join( "" ) );
    }
    rep = sb.join( "" );
    $T.sel_CASL_fA[1] = rep;
    return $T.sel_CASL_fA.join( "" );
};

$F.fA = {};
$F.fA.BPObjectNamesA = [
"cb_head",
"cb_trunk",
"cb_larm",
"cb_rarm",
"cb_lhand",
"cb_rhand",
"cb_lleg",
"cb_rleg",
"cb_lfoot",
"cb_rfoot"
];

$F.fA.setSubstanceField = function ( s ) {

    document.getElementById( "t_cas" ).innerHTML = s.casStr;
    document.getElementById( "t_ACGIH_sn" ).innerHTML = s.getACGIH_sn();
    document.getElementById( "t_DE_sn" ).innerHTML = s.getDE_sn();
    document.getElementById( "t_sp_cat" ).innerHTML = s.sp_cat.potentialText_en;
    document.getElementById( "t_sp_cat_txt" ).innerHTML = s.sp_cat.note;
    document.getElementById( "t_CMR" ).innerHTML = s.getCMR();
    document.getElementById( "t_GHS_acute_skn" ).innerHTML = s.GHS_acute_skn.signal_en;
    document.getElementById( "t_GHS_acute_skn_txt" ).innerHTML = s.GHS_acute_skn.statement_skn_en;

    document.getElementById( "t_GHS_acute_orl" ).innerHTML = s.GHS_acute_orl.signal_en;
    document.getElementById( "t_GHS_acute_orl_txt" ).innerHTML = s.GHS_acute_orl.statement_orl_en;

    document.getElementById( "t_GHS_chronic_skn" ).innerHTML = s.GHS_chronic_skn.signal_en;
    document.getElementById( "t_GHS_chronic_skn_txt" ).innerHTML = s.GHS_chronic_skn.statement_skn_en;

    document.getElementById( "t_GHS_chronic_orl" ).innerHTML = s.GHS_chronic_orl.signal_en;
    document.getElementById( "t_GHS_chronic_orl_txt" ).innerHTML = s.GHS_chronic_orl.statement_orl_en;

    document.getElementById( "t_RP" ).innerHTML = s.getRP(); ;




};

$F.fA.setWarnings = function ( substance ) {


    var warningDHR = false;
    var warningOELBasedOnIrritation = ( substance.ACGIH_oel_basis_irr == 1 ) || ( substance.DE_oel_basis_irr == 1 ); // OEL déterminée sur la base de l'irritation
    var warningOELBasedOnIrritation2 = substance.irritationBasedOEL; // Modif 2015
    var warningIrr = substance.isIrritating(); // substance irritante
    var warningVolatility = substance.isVolatile() && ( !substance.isGaseous() ); //la volatilité de la substance peut en modifier la nocivité du moins au niveau du derme
    var warningCM = ( substance.CMR_C != null ) || ( substance.CMR_M != null );
    var warning_RP43_Sensitization = substance.RP_43 == RP43;

    var warningsMsg = '';
    var message = [];
    if ( substance.DHR_status ) {


        if ( warningCM ) {
            message.push( $T.w_CM );
        }

        if ( substance.isDHRspecial() )
            message.push( $G.format( $T.w_DHR_gsdSpecial_f, $T.w_DHR_gsdSpecialValue[substance.OEL_status] ) );

        if ( warning_RP43_Sensitization ) {
            message.push( $T.w_RP43_sensitization );
        }

        if ( warningOELBasedOnIrritation )
            message.push( $T.w_irrBasedOEL );

        if ( warningOELBasedOnIrritation2 )
            message.push( $T.w_irrBasedOEL2 );

        if ( warningIrr ) {
            if ( substance.RP_irr != null ) {
                message.push( $G.format( $T.w_irr_RP_f, substance.RP_irr._id ) );
            }
            else {
                message.push( $T.w_irr_RTECS );
            }
        }
        if ( warningVolatility )
            message.push( $T.w_volatility );
    }
    else {
        if ( warningCM ) {
            message.push( $T.w_CM );
        }

        if ( warningIrr ) {
            if ( substance.RP_irr != null ) {

                message.push( $G.format( $T.w_irr_RP_f, substance.RP_irr._id ) );
            }
            else {
                message.push( $T.w_irr_RTECS );
            }
        }

    }

    if ( message.length > 0 ) {
        $T.w_warnings_fA[1] = message.join( "" );
        warningsMsg = $T.w_warnings_fA.join( "" );
    }

    var rp = substance.getRP_long();
    var rpMsg = "";
    if ( rp.length > 0 ) {
        var message = [];
        for ( var i in rp )
            message.push( $G.format( $T.rp_li_f, rp[i]._id, rp[i].rText_en ) );
        $T.rp_text_fA[1] = message.join( "" );
        rpMsg = $T.rp_text_fA.join( "" );
    }

    document.getElementById( "t_warnings" ).innerHTML = warningsMsg + rpMsg;

};

$F.fA.hideGas = function () {
    document.getElementById( "t_generalWarnings" ).innerHTML = "";
    for ( var i in $F.fA.BPObjectNamesA ) {
        document.getElementById( $F.fA.BPObjectNamesA[i] ).disabled = false;
    }
};

$F.fA.showHideGas = function ( substance ) {
    if ( substance.isGaseous() ) {

        for ( var i in $F.fA.BPObjectNamesA ) {
            document.getElementById( $F.fA.BPObjectNamesA[i] ).disabled = true;
            document.getElementById( $F.fA.BPObjectNamesA[i] ).checked = true;
        }
        //  $G.hide(document.getElementById("bodyPartsTbl"));
        document.getElementById( "cb_head" ).disabled = true;
        document.getElementById( "cb_head" ).checked = true;

        document.getElementById( "t_generalWarnings" ).innerHTML = $T.w_gas_text;
    }
    else {
        $F.fA.hideGas();
    }
};

$F.fA.showHideDHR = function ( substance ) {
    if ( substance.DHR_status ) {
        document.getElementById( "t_riskAssessment" ).innerHTML = "";
    } else {
        if ( substance.OEL_status == 'blank' ) {
            document.getElementById( "t_riskAssessment" ).innerHTML = $T.w_noDHR_noOEL;
        }
        else {
            document.getElementById( "t_riskAssessment" ).innerHTML = $T.w_noDHR_outsideModel;
        }
    }
};

$F.fA.setRiskAssessment = function ( u ) {


    if ( u.ssie ) {
        if ( u.mu < -1 )
            rep = $G.format( $T.r_airSkinExposure_DHR_LT_10_f, $G.fmtPC( u.pcGREEN ) );
        else
            rep = $G.format( $T.r_airSkinExposure_DHR_GE_10_f, $G.fmtPC( u.pcORANGE + u.pcRED ) );
    }
    else {
        if ( u.mu < 0 )
            rep = $G.format( $T.r_skinOnlyExposure_DHR_LT_100_f, $G.fmtPC( u.pcORANGE + u.pcGREEN ) );
        else
            rep = $G.format( $T.r_skinOnlyExposure_DHR_GE_100_f, $G.fmtPC( u.pcRED ) );
    }
    document.getElementById( "t_riskAssessment" ).innerHTML = rep;


};


$F.fA.format4NoDHR = function () {
    document.getElementById( "t_dhrCalc" ).innerHTML = "DHR = ?";
    document.getElementById( "t_pcRED" ).innerHTML = "";
    document.getElementById( "t_pcORANGE" ).innerHTML = "";
    document.getElementById( "t_pcGREEN" ).innerHTML = ""
};







