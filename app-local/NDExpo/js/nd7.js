/*ignore jslint start*/
(function () {

    /**
    * Decimal adjustment of a number.
    *
    * @param   {String}    type    The type of adjustment.
    * @param   {Number}    value   The number.
    * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
    * @returns {Number}            The adjusted value.
    */
    function decimalAdjust( type, value, exp ) {
        // If the exp is undefined or zero...
        if ( typeof exp === 'undefined' || +exp === 0 ) {
            return Math[type]( value );
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if ( isNaN( value ) || !( typeof exp === 'number' && exp % 1 === 0 ) ) {
            return NaN;
        }
        // Shift
        value = value.toString().split( 'e' );
        value = Math[type]( +( value[0] + 'e' + ( value[1] ? ( +value[1] - exp ) : -exp ) ) );
        // Shift back
        value = value.toString().split( 'e' );
        return +( value[0] + 'e' + ( value[1] ? ( +value[1] + exp ) : exp ) );
    }

    // Decimal round
    if ( !Math.round10 ) {
        Math.round10 = function ( value, exp ) {
            return decimalAdjust( 'round', value, exp );
        };
    }
    // Decimal floor
    if ( !Math.floor10 ) {
        Math.floor10 = function ( value, exp ) {
            return decimalAdjust( 'floor', value, exp );
        };
    }
    // Decimal ceil
    if ( !Math.ceil10 ) {
        Math.ceil10 = function ( value, exp ) {
            return decimalAdjust( 'ceil', value, exp );
        };
    }

} )();


$( document ).ready( function () {
    var 
        $u = zygotine.U,
        $nd = zygotine.ND;


    $( '#mnuMode' ).data( 'mode', 'NDExpo' );

    $u.setLanguage( 'en' );


    $( 'table.data-entry tfoot' ).hide();

    $u.updateUI4language();
    $u.clearCanvas();
    $( "#placeholder" ).bind( "plothover", function ( event, pos, item ) {
        //$( "#hover" ).html( "hover: x=" + pos.x.toFixed( 2 ) + ", y=" + pos.y.toFixed( 2 ) + " , x1=" + pos.x1.toFixed( 2 ) + ", y1=" + pos.y1.toFixed( 2 ) );
        if ( item ) {
            $( "#item" ).html( $u.round( $nd.global.per20 )( item.series.data[item.dataIndex][2] ) + " [" + item.series.label + "]" ).css( 'color', item.series.color );
        }
        else {
            $( "#item" ).html( "" );
        }

    } );

    $( '.tbl-bottom-mnu-entry' ).on( 'click', function ( e ) {
        e.preventDefault();
        var 
            btnId = $( this ).attr( 'id' );
        if ( btnId == 'add-row' ) {
            $u.addRow();
            $( '#data-entry-tbl-last-row td.vallt input' ).focus();
            return;
        }

        if ( btnId == 'new-dataset' ) {
            $u.removeAllRows();
            return;
        }

        if ( btnId == 'remove-empty-rows' ) {
            $u.removeEmptyRows();
            return;
        }

        if ( btnId == 'calculate' ) {
            $u.validateAllRows();
            if ( $( 'table.data-entry' ).prop( 'hasError' ) ) {
                window.alert( 'Errors in data table!' );
                return;
            }
            else {
                var 
                    dataSet,
                    datum,
                    iDatum,
                    position,
                    finalValue;
                $nd.reset();
                $( 'table.data-entry input[type="text"]' ).filter( function () { return $.trim( $( this ).val() ) != ''; } ).parent().parent().each( function ( i, v ) {
                    var 
                        row = $( v ),
                        no = +row.attr( 'no' ),
                        p = ".p" + no,
                        nd = +$( '.nd' + p ).html(),
                        limit = $( '.limit' + p ).html(),
                        value = $( '.value' + p ).html();

                    if ( nd === 1 ) {
                        value = +limit;
                    }
                    else {
                        value = +value;
                    }
                    $nd.addDatum( nd, value, no );
                } );

                //var start = Date.now();
                //for ( xxx_yyyy = 1; xxx_yyyy < 10000; xxx_yyyy++ ) {
                $nd.doCalc();
                //}
                //var end = Date.now();
                //var elapsed = end - start; // time in milliseconds
                $u.clearCanvas();
                if ( $nd.error !== 0 ) {
                    switch ( $nd.error ) {

                        /*

                        */ 

                        case $nd.ERR_TOOMANY_ND:
                            window.alert( $T.ERR_TOOMANY_ND[$u.language] );
                            return;
                        case $nd.ERR_GRTSTDL:
                            window.alert( $T.ERR_GRTSTDL[$u.language] );
                            return;
                        case $nd.ERR_NENGH_DATA:
                            window.alert( $T.ERR_NENGH_DATA[$u.language] );
                            return;
                        case $nd.ERR_NENGH_DET:
                            window.alert( $T.ERR_NENGH_DET[$u.language] );
                            return;
                        case $nd.WARN_NO_ND:
                            // on trace tout de même
                            window.alert( $T.WARN_NO_ND[$u.language] );
                            break;
                    }


                }

                dataSet = $nd.dataSet;
                var fnRound = $u.round( $nd.global.per20 );
                for ( iDatum = 0; iDatum < dataSet.length; iDatum++ ) {
                    datum = dataSet[iDatum];
                    $( '.final.p' + datum.position ).html( fnRound( datum.finalValue ) );
                    if ( datum.isNotDetected() ) {
                        $( '.limit.p' + datum.position ).html( fnRound( datum.getValue() ) );
                    }
                    else {
                        $( '.value.p' + datum.position ).html( fnRound( datum.getValue() ) );
                    }
                }
                $( '#tabs-out1 textarea' ).val( $u.toTSV2() );
                $( '#tabs-out2 textarea' ).val( $u.toTSV2( 'std2' ) );
                /* $( '#tabs' ).tabs( { active: 1 } );*/
                zygotine.G.plot();

            }
            return;
        }

        if ( btnId == 'import' ) {
            $u.removeAllRows();
            var 
                arr = $( '#tabs-in textarea' ).val().split( '\n' ),
                iEntry,
                input,
                p,
                val,
                hasError = false;
            for ( iEntry = 0; iEntry < arr.length; iEntry++ ) {
                if ( $.trim( arr[iEntry] ) === '' ) {
                    continue;
                }
                input = $( '#data-entry-tbl-last-row' ).children( '.vallt' ).children();
                input.val( arr[iEntry] );
                p = '.' + input.attr( 'p' );
                val = arr[iEntry];
                $u.validateLT( val, p, input );
                hasError = hasError || $( 'table.data-entry' ).prop( 'hasError' );
                $u.addRow();
            }

            $( 'table.data-entry' ).prop( 'hasError', hasError );
            $( '#tbl-container' ).scrollTop( 0 );
            return;
        }

        if ( btnId == 'mnuHelpFile' ) {

            window.open( './' + $T.mnuHelpFileName[$u.language], "_aide" );
            return;
        }

        if ( btnId == 'mnuAbout' ) {
             window.open( './' + $T.mnuAboutFileName[$u.language], "_apropos" );
             return;
        }

        if ( btnId == 'mnuLanguage' ) {

            $u.language = ( $u.language == 'en' ? 'fr' : 'en' );
            $u.updateUI4language();
            return;
        }

        if ( btnId == 'mnuMode' ) {
            var 
                nd = zygotine.ND,
                $mnuMode = $( '#mnuMode' ),
                mode;

            mode = $mnuMode.data( 'mode', $nd.grouping ? 'NADA' : 'NDExpo' ).data( 'mode' );

            $mnuMode.html( mode == 'NADA' ? $T.toNDExpo[$u.language] : $T.toNADA[$u.language] );

            $nd.grouping = $mnuMode.data( 'mode' ) == 'NDExpo';

            $u.clearCanvas();
            $u.validateAllRows(true);
            $( '#tabs-out1 textarea' ).val( '' );
            $( '#tabs-out2 textarea' ).val( '' );
        }
    } );

    $( '.data-entry' ).on( 'click', 'a.tbl-row-mnu-entry', function ( e ) {
        e.preventDefault();
        var 
            btn = $( this ),
            p = '.' + btn.attr( 'p' ),
            input = $( p + ' input[type="text"]' ),
            val = input.val();
        zygotine.U.validateLT( val, p, input );
    } );

    $( '.data-entry' ).on( 'change', 'input[type="text"]', function () {
        var 
            input = $( this ),
            p = '.' + input.attr( 'p' ),
            val = input.val(),
            rep,
            $u = zygotine.U;
        rep = $u.validateLT( val, p, input );

        if ( !rep.hasError && !rep.isEmpty && ( $( this ).parent().parent().attr( 'id' ) === 'data-entry-tbl-last-row' ) ) {
            $u.addRow();
            $( '#data-entry-tbl-last-row td.vallt input' ).focus();
        }


    } );



} );


var zygotine = {};

zygotine.ND = {

    reset: function () { // 
        this.dataSet = [];
        this.detectionLimitArray = [];
        this.count.nd = 0;
        this.count.total = 0;
        this.error = 0; // no error
    },

    grouping: true,

    compareValue: function ( datum1, datum2 ) {

        var test = datum1.getValue() - datum2.getValue();
        if ( test !== 0 ) {
            return test;
        }
        return datum2.isND - datum1.isND;
    },

    compareFinalValue: function ( datum1, datum2 ) {
        return datum1.finalValue - datum2.finalValue;
    },

    comparePosition: function ( datum1, datum2 ) { // restore initial order
        return datum1.position - datum2.position;
    },

    count: {
        nd: 0,
        total: 0
    },

    ERR_TOOMANY_ND: 1,
    ERR_GRTSTDL: 2,
    ERR_NENGH_DATA: 3,
    WARN_NO_ND: 4,
    ERR_NENGH_DET: 5,
    error: 0,  /*       0 === no error
                        1 === too many nd values ( <80%)
                        2 === no data greater than greatest detection limit 
                        3 === not enough data (at least 3 datum)
                        4 === no ND, calculation not needed
                        */


    addDatum: function ( isND, value, position ) {
        var 
            datum = new this.datum( isND, value );
        datum.position = ( typeof position !== 'undefined' ) ? position : this.dataSet.length;
        this.dataSet.push( datum );
        this.count.total++;
        if ( isND === 1 ) {
            this.count.nd++;
        }
    },

    datum: function ( isND, value ) {
        this.isND = isND; // 1 if not detected, 0 otherwise
        if ( this.isND === 1 ) {
            this.detectionLimitValue = value;
        }
        else {
            this.value = value;
        }
        this.dlGroup = null;
        this.position = -1; // from 0 to n-1, where n is the size of the dataset ($nd.dataSet)
        this.index = -1;
        this.plottingPosition = -1;
        this.score = -1;
        this.predicted = -1;
        this.finalValue = -1;
    },

    dataSet: [], // an array of datum

    sortDataSet: function () {
        this.dataSet.sort( this.compareValue );
    },

    DetectionLimit: function ( value ) {
        this.value = value; // the value of the limit
        this.A = 0; // number of detected > this.value 
        this.B = 0; // number of datum where datum.getValue() < this.value
        this.C = 0; // number of datum such than datum.isNotDetected() && (datum.detectionLimitValue = thid.value)
        this.overProbability = 0; // probability that a value is over the limit
        this.nextOverProbability = 0;
        this.previousValues = [];

    },

    detectionLimitArray: [],

    global: {},

    GlobalValues: function ( dataSet ) {

        var 
            dataSet,
            datum,
            iDatum,
            x,
            y;

        this.sumX = 0;
        this.sumY = 0;
        this.sumXY = 0;
        this.sumXX = 0;
        this.slope;
        this.intercept;
        this.count = 0;



        //dataSet = $nd.dataSet;

        this.per20 = -1; // undefined
        
        for ( iDatum = 0; iDatum < dataSet.length; iDatum++ ) {
            datum = dataSet[iDatum];



            if ( !datum.isNotDetected() ) {

                y = Math.log( datum.value );
                x = datum.score;
                this.sumX += x;
                this.sumY += y;
                this.sumXX += ( x * x );
                this.sumXY += ( x * y );
                this.count++;
            }
        }

        this.slope = ( ( this.count * this.sumXY ) - ( this.sumX * this.sumY ) ) / ( ( this.count * this.sumXX ) - ( this.sumX * this.sumX ) );
        this.intercept = ( ( this.sumXX * this.sumY ) - ( this.sumX * this.sumXY ) ) / ( ( this.count * this.sumXX ) - ( this.sumX * this.sumX ) );
    },

    doCalc: function () {
        var 
            currentLimit,
            iDatum,
            iLimit,
            datum,
            prevDatum,
            previousIsND,
            currentPosition, // current position within group
            nextProb;
        this.dataSet.sort( this.compareValue );

        if ( this.count.total < 5 ) {
            this.error = this.ERR_NENGH_DATA;
            return;
        }

        if ( ( this.count.total - this.count.nd ) < 3 ) {
            this.error = this.ERR_NENGH_DET;
            return;
        }

        if ( this.count.nd > Math.floor( .8 * this.count.total ) ) {
            this.error = this.ERR_TOOMANY_ND;
            return;
        }

        if ( this.dataSet[this.dataSet.length - 1].isNotDetected() ) {
            this.error = this.ERR_GRTSTDL;
            return;
        }
        if ( this.count.nd === 0 ) {
            this.error = this.WARN_NO_ND;
        }
        this.detectionLimitArray = [];



        currentLimit = new this.DetectionLimit( 0 );
        this.detectionLimitArray.push( currentLimit );

        datum = this.dataSet[0];
        if ( datum.isND ) {
            currentLimit = new this.DetectionLimit( datum.detectionLimitValue );
            currentLimit.C++;
            this.detectionLimitArray.push( currentLimit );
        }
        else {
            currentLimit.A++;
            previousIsND = 0;
        }
        currentPosition = 1;
        datum.index = 1;
        datum.dlGroup = currentLimit;

        for ( iDatum = 1; iDatum < this.dataSet.length; iDatum++ ) {
            datum = this.dataSet[iDatum];
            prevDatum = this.dataSet[iDatum - 1];
            if ( prevDatum.isND != datum.isND ) {
                if ( datum.isND ) {
                    currentLimit = new this.DetectionLimit( datum.detectionLimitValue );
                    this.detectionLimitArray.push( currentLimit );
                }
                currentPosition = 0;
            }
            else {
                if ( datum.isND && ( prevDatum.detectionLimitValue != datum.detectionLimitValue ) ) {
                    if ( this.grouping ) {
                        currentLimit.previousValues.push( currentLimit.value );
                        currentLimit.value = datum.detectionLimitValue;
                    }
                    else {
                        currentLimit = new this.DetectionLimit( datum.detectionLimitValue );
                        this.detectionLimitArray.push( currentLimit );
                        currentPosition = 0;
                    }

                }
            }

            currentPosition++;
            datum.index = currentPosition;
            datum.dlGroup = currentLimit;
            if ( datum.isND ) {
                currentLimit.C++;
            }
            else {
                currentLimit.A++;
            }

        }

        currentLimit = new this.DetectionLimit( this.dataSet[this.dataSet.length - 1].value + 1 );
        this.detectionLimitArray.push( currentLimit );

        for ( iLimit = 1; iLimit < this.detectionLimitArray.length; iLimit++ ) {
            this.detectionLimitArray[iLimit].B = this.detectionLimitArray[iLimit].C + this.detectionLimitArray[iLimit - 1].B + this.detectionLimitArray[iLimit - 1].A
        }


        for ( iLimit = this.detectionLimitArray.length - 2; iLimit >= 0; iLimit-- ) {
            currentLimit = this.detectionLimitArray[iLimit];
            nextProb = this.detectionLimitArray[iLimit + 1].overProbability;
            currentLimit.nextOverProbability = nextProb;
            currentLimit.overProbability = nextProb + ( ( 1 - nextProb ) * ( currentLimit.A / ( currentLimit.A + currentLimit.B ) ) );
        }

        this.detectionLimitArray[0].overProbability = 1; // this way, no rounding error

        for ( iDatum = 0; iDatum < this.dataSet.length; iDatum++ ) {
            datum = this.dataSet[iDatum];
            datum.plottingPosition = datum.dlGroup.getPlottingPosition( datum );
            datum.score = this.inverseNormalcdf( datum.plottingPosition );
        }

        this.global = new this.GlobalValues( this.dataSet );

        for ( iDatum = 0; iDatum < this.dataSet.length; iDatum++ ) {
            datum = this.dataSet[iDatum];
            if ( datum.isNotDetected() ) {
                datum.predicted = ( datum.score * this.global.slope ) + this.global.intercept;
                datum.finalValue = Math.exp( datum.predicted );
            }
            else {
                datum.finalValue = datum.value;
            }
        }
        this.dataSet.sort( this.compareFinalValue );
        this.global.per20 = this.global.getPercentile( 20, this.dataSet );
        
        this.dataSet.sort( this.comparePosition );
    },

    inverseNormalcdf: function ( p ) {
        //  L'inverse d'une fonction de distribution d'une loi normale ... centrée et réduite.
        //  Adapted for Microsoft Visual Basic from Peter Acklam's
        //  "An algorithm for computing the inverse normal cumulative distribution function"
        //  (http://home.online.no/~pjacklam/notes/invnorm/)
        //  by John Herrero (3-Jan-03)
        //  
        //  to javascript // zygotine@hotmail.com

        // 'Define coefficients in rational approximations
        var 
            a1 = -39.6968302866538,
            a2 = 220.946098424521,
            a3 = -275.928510446969,
            a4 = 138.357751867269,
            a5 = -30.6647980661472,
            a6 = 2.50662827745924,

            b1 = -54.4760987982241,
            b2 = 161.585836858041,
            b3 = -155.698979859887,
            b4 = 66.8013118877197,
            b5 = -13.2806815528857,

            c1 = -7.78489400243029E-03,
            c2 = -0.322396458041136,
            c3 = -2.40075827716184,
            c4 = -2.54973253934373,
            c5 = 4.37466414146497,
            c6 = 2.93816398269878,

            d1 = 7.78469570904146E-03,
            d2 = 0.32246712907004,
            d3 = 2.445134137143,
            d4 = 3.75440866190742,

        //Define break-points
            p_low = 0.02425,
            p_high = 1 - p_low,

        //Define work variables
            q,
            r,
            rep;

        // If argument out of bounds, raise error
        if ( p <= 0 || p >= 1 ) return {}; // Then Err.Raise 5

        if ( p < p_low ) {
            //Rational approximation for lower region
            q = Math.sqrt( -2 * Math.log( p ) );
            return ( ( ( ( ( c1 * q + c2 ) * q + c3 ) * q + c4 ) * q + c5 ) * q + c6 ) / ( ( ( ( d1 * q + d2 ) * q + d3 ) * q + d4 ) * q + 1 );
        }
        else
            if ( p <= p_high ) {
                //Rational approximation for lower region
                q = p - 0.5;
                r = q * q;
                return ( ( ( ( ( a1 * r + a2 ) * r + a3 ) * r + a4 ) * r + a5 ) * r + a6 ) * q / ( ( ( ( ( b1 * r + b2 ) * r + b3 ) * r + b4 ) * r + b5 ) * r + 1 );
            }
            else
                if ( p < 1 ) {
                    //Rational approximation for upper region
                    q = Math.sqrt( -2 * Math.log( 1 - p ) );
                    return -( ( ( ( ( c1 * q + c2 ) * q + c3 ) * q + c4 ) * q + c5 ) * q + c6 ) / ( ( ( ( d1 * q + d2 ) * q + d3 ) * q + d4 ) * q + 1 );
                }
    },

    whoami: 'zygotine@gmail.com'
};

zygotine.ND.datum.prototype =
{
    getValue: function () {
        if ( this.isNotDetected() ) return this.detectionLimitValue; else return this.value;
    },

    toString: function () {
        return this.position + " : " + ( this.isNotDetected() ? '<' : '' ) + this.getValue() + ' : ' + this.index + ' : ' + this.plottingPosition + ' : ' + this.score + ' : ' + this.finalValue;
    },

    isNotDetected: function () {
        return this.isND === 1;
    }
};

zygotine.ND.DetectionLimit.prototype =
{
    toString: function () {
        return this.value + ' : A=' + this.A + ' : B=' + this.B + ' : C=' + this.C + ' : prob=' + this.overProbability;
    },

    getPlottingPosition: function ( datum ) {
        if ( datum.isNotDetected() ) {
            return datum.index * ( 1 - this.overProbability ) / ( this.C + 1 )
        }
        else {
            return ( 1 - this.overProbability ) + ( datum.index * ( ( this.overProbability - this.nextOverProbability ) / ( this.A + 1 ) ) );
        }
    }
};


zygotine.ND.GlobalValues.prototype.getPercentile = function ( pNTH, dataSet ) {
    var 
        pStep,
        position,
        pMin = pStep * .5,
        pMax = pMin + ( dataSet.length - 1 ) * pStep,
        v = dataSet[0].finalValue;


    pStep = dataSet.length / 100;

    if ( pNTH < 1 ) {
        pNTH = 1;
    }

    position = Math.round( pNTH * pStep ) - 1;

    if ( position < 0 ) {
        position = 0;
    }
    else {
        if ( position >= dataSet.length ) {
            position = dataSet.length - 1;
        }
    }

    return dataSet[position].finalValue;

};


zygotine.U = {

    language: 'fr',
    canvasVisible: false,
    lastPlot: null,

    setLanguage: function ( language ) {
        this.language = language;
    },


    updateUI4language: function () {

        var 
            language = this.language,
            visible = this.canvasVisible,
            container = $( '#placeholder' );

        $( '.vallt.header' ).html( $T.col1_raw[language] );
        $( '.limit.header' ).html( $T.col2_censoring[language] );
        $( '.value.header' ).html( $T.col3_detected[language] );
        $( '.final.header' ).html( $T.col4_final[language] );
        //$( 'title' ).html( $T.documentTitle[language] );
        $( 'h2.title' ).html( $T.title[language] );
        $( 'a[href="#tabs-in"]' ).html( $T._import[language] );
        $( 'a[href="#tabs-out1"]' ).html( $T.exportShort[language] );
        $( 'a[href="#tabs-out2"]' ).html( $T.exportVerbose[language] );
        $( '#add-row' ).html( $T.btnAddRow[language] );
        $( '#new-dataset' ).html( $T.btnNewDataSet[language] );
        $( '#remove-empty-rows' ).html( $T.btnRemoveEmpty[language] );
        $( '#calculate' ).html( $T.btnCalc[language] );
        $( '#import' ).html( $T.btnImport[language] );


        $( '#mnuAbout' ).html( $T.mnuAbout[language] );
        $( '#mnuHelpFile' ).html( $T.mnuHelpFile[language] );
        $( '#mnuLanguage' ).html( $T.mnuLanguage[language] );
        $( 'td.type[entrytype="val"]' ).html( $T.detected[language] );
        $( 'td.type[entrytype="nd"]' ).html( $T.nd[language] );

        $( '#canvasYAxisLabel' )
                .text( $T.yAxisLbl[language] );
        $( '#canvasXAxisLabel' )
                .text( visible ? $T.xAxisLbl[language] : "" );
        $( '#canvasTitle' )
                .text( visible ? $T.plotTitle[language] : $T.plotTitleAlt[language] );


        $( '#mnuMode' ).html( $( '#mnuMode' ).data( 'mode' ) == 'NADA' ? $T.toNDExpo[language] : $T.toNADA[language] );
        // la légende

        var 
            legend = $( '.legendLabel' ),
            iLegend,
            iSeries,
            series,
            obj,
            html,
            label;

        var a = new String( "aaak" );
        for ( iLegend = 0; iLegend < legend.length; iLegend++ ) {
            obj = $( $( '.legendLabel' )[iLegend] );
            html = obj.html();
            if ( html.indexOf( $T.seriesDetected.key ) > -1 ) {
                obj.html( $T.seriesDetected[language] );
                continue;
            }
            if ( html.indexOf( $T.seriesPredicted.key ) > -1 ) {
                obj.html( $T.seriesPredicted[language] );
                continue;
            }
            if ( html.indexOf( $T.seriesRegress.key ) > -1 ) {
                obj.html( $T.seriesRegress[language] );
                continue;
            }
        }
        if ( this.lastPlot != null ) {

            series = this.lastPlot.getData();

            for ( iSeries = 0; iSeries < series.length; iSeries++ ) {
                obj = series[iSeries];
                label = obj.label;
                if ( label.indexOf( $T.seriesDetected.key ) > -1 ) {
                    obj.label = $T.seriesDetected[language];
                    continue;
                }
                if ( label.indexOf( $T.seriesPredicted.key ) > -1 ) {
                    obj.label = $T.seriesPredicted[language];
                    continue;
                }
                if ( label.indexOf( $T.seriesRegress.key ) > -1 ) {
                    obj.label = $T.seriesRegress[language];
                    continue;
                }
            }
        }

    },

    clearCanvas: function () {

        var 
            language = this.language,
            container = $( '#placeholder' );


        // on trace le vide, ce qui nous assure que les divs ajoutés (étiquettes d'axe, ...) disparaissent
        this.lastPlot = $.plot( container, [], {} );

        $( '<div id="canvasTitle" class="axisLabel plotTitle"></div>' )
                .text( $T.plotTitleAlt[language] )
                .appendTo( container );
        this.canvasVisible = false;
        $( "#flot-footer" ).html( "Flot " + $.plot.version + " &ndash; " + new Date().toLocaleString() );
    },

    validateLT: function ( val, p, input, clearFinal ) {
        var 
            str = $.trim( val ),
            x = str.split( '<' ),

            $type = $( p + '.type' ),
            $limit = $( p + '.limit' ),
            $value = $( p + '.value' ),
            $nd_ = $( p + '.nd' ),

            rep = {
                isEmpty: false,
                num: Number.NaN,
                isLim: false,
                hasError: false
            };
        if ( clearFinal ) {
             input.closest('tr').find('.final').html('');
        }

        if ( str == '' ) {
            rep.isEmpty = true;
        } else {
            if ( x.length == 2 ) {
                rep.num = +x[1];
                rep.isLim = true;
            }
            else {
                if ( x.length == 1 ) {
                    rep.num = +x[0];

                    rep.isLim = false;
                }
            }
        }

        if ( ( rep && ( !rep.isEmpty ) ) && ( isNaN( rep.num ) || ( rep.num == 0 ) ) ) {
            rep.hasError = true;
        }

        if ( !rep.hasError ) {
            $( p + ' .error' ).removeClass( 'error' );

            if ( !rep.isEmpty ) {
                if ( rep.isLim ) {
                    input.val( '<' + rep.num );
                    $type.html( $T.nd[this.language] ).attr( 'entrytype', 'nd' );
                    $limit.html( rep.num );
                    $value.html( '' );
                    $nd_.html( '1' );
                }
                else {
                    input.val( rep.num );
                    $type.html( $T.detected[this.language] ).attr( 'entrytype', 'val' );
                    $limit.html( '' );
                    $value.html( rep.num );
                    $nd_.html( '0' );
                }
            }
            else {
                input.val( '' );
                $type.html( '' ).attr( 'entrytype', '' );
                $limit.html( '' );
                $value.html( '' );
                $nd_.html( '0' );
            }
        }
        else {
            $type.html( '' ).attr( 'entrytype', '' );
            $limit.html( '' );
            $value.html( '' );
            $nd_.html( '0' );
            input.addClass( 'error' );
        }
        if ( rep.hasError ) {
            $( 'table.data-entry' ).prop( 'hasError', true );
        }
        return rep;
    },

    format: function ( fmt, args ) {
        var tmp = fmt;
        if ( arguments.length == 0 ) return "";
        if ( arguments.length == 1 ) return fmt;

        for ( var i = 1; i < arguments.length; i++ ) {
            var re = new RegExp( "\\{" + ( i - 1 ) + "\\}", "g" );
            tmp = tmp.replace( re, arguments[i] );
        }
        return tmp;
    },

    toTSV2: function ( outFmt ) {
        var 
            dataSet,
            datum,
            iDatum,
            rep = [],
            $nd = zygotine.ND;

        dataSet = $nd.dataSet;

        var 
            fnFormat = this.getTSVFormat( outFmt );
        //headers
        if ( outFmt === 'std2' ) {
            rep.push( fnFormat() );
        }

        for ( iDatum = 0; iDatum < dataSet.length; iDatum++ ) {
            datum = dataSet[iDatum];
            rep.push( fnFormat( datum ) );
        }

        if ( outFmt === 'lng' ) {
            rep.push( '' );
            fnFormat = this.getTSVFormat( 'global' );
            rep.push( fnFormat() );
            rep.push( fnFormat( $nd.global ) );
            rep.push( '' );
            fnFormat = this.getTSVFormat( 'dl' );
            rep.push( fnFormat() );
            var 
                group,
                iGroup;
            for ( iGroup = 0; iGroup < $nd.detectionLimitArray.length; iGroup++ ) {
                rep.push( fnFormat( $nd.detectionLimitArray[iGroup] ) );
            }

        }
        return rep.join( '\r\n' );
    },

    getTSVFormat: function ( outFmt ) {
        if ( !outFmt || outFmt === 'std' ) {
            return function ( datum ) {
                return datum.finalValue;
            };
        }

        if ( outFmt === 'std2' ) {
            return function ( datum ) {
                var 
                    decPlaces = 6;
                if ( datum ) {
                    return ( datum.isNotDetected() ? ( '<' + Math.round10( datum.detectionLimitValue, -decPlaces ) ) : datum.value ) + '\t' + Math.round10( datum.plottingPosition, -decPlaces ) + '\t' + Math.round10( datum.score, -decPlaces ) + '\t' + Math.round10( datum.finalValue, -decPlaces );
                }
                else {
                    return $T.xportLabels2;
                }

            };
        }



        if ( outFmt === 'lng' ) {
            return function ( datum ) {
                if ( datum ) {
                    return datum.isND + '\t' + ( datum.isNotDetected() ? '' : datum.value ) + '\t' + ( datum.isNotDetected() ? datum.detectionLimitValue : '' ) + '\t' + datum.plottingPosition + '\t' + datum.score + '\t' + datum.predicted + '\t' + datum.finalValue;
                }
                else {
                    return 'ND' + '\t' + 'value' + '\t' + 'detectionLimitValue' + '\t' + 'plottingPosition' + '\t' + 'score' + '\t' + 'predicted' + '\t' + 'finalValue';
                }

            };
        }






        if ( outFmt === 'global' ) {
            return function ( glbl ) {
                if ( glbl ) {
                    return glbl.sumX + '\t' + glbl.sumX + '\t' + glbl.sumY + '\t' + glbl.sumXY + '\t' + glbl.sumXX + '\t' + glbl.slope + '\t' + glbl.intercept + '\t' + glbl.count;
                }
                else {
                    return 'sumX' + '\t' + 'sumX' + '\t' + 'sumY' + '\t' + 'sumXY' + '\t' + 'sumXX' + '\t' + 'slope' + '\t' + 'intercept' + '\t' + 'count';
                }
            };
        }

        if ( outFmt === 'dl' ) {
            return function ( dlGroup ) {
                if ( dlGroup ) {
                    return dlGroup.value + '\t' + dlGroup.A + '\t' + dlGroup.B + '\t' + dlGroup.C + '\t' + dlGroup.overProbability;
                }
                else {
                    return 'value' + '\t' + 'A' + '\t' + 'B' + '\t' + 'C' + '\t' + 'overProbability';
                }
            };
        }

    },

    validateAllRows: function ( clearFinal ) {

        var 
            hasError = false,
            rep,
            input,
            val,
            p;

        $( 'table.data-entry input[type="text"]' ).each( function ( i, v ) {
            input = $( v );
            val = input.val();
            p = '.' + input.attr( 'p' );
            rep = zygotine.U.validateLT( val, p, input, clearFinal );
            hasError = hasError || rep.hasError;
        } );

        $( 'table.data-entry' ).prop( 'hasError', hasError );

    },

    row: '<tr no="{0}" id="data-entry-tbl-last-row" class="position"><td class="position">{0}</td><td class="nd p{0}">0</td><td class="vallt p{0}"><input type="text" p="p{0}"/></td><td class="type p{0}"></td><td class="limit p{0}"></td><td class="value p{0}"></td><td class="final p{0}"></td></tr>',

    addRow: function ( no ) {
        var row;
        $( '#data-entry-tbl-last-row' ).removeAttr( 'id' );
        if ( typeof no !== "undefined" ) {
            $( 'table.data-entry tbody' ).append( this.format( this.row, no ) );
            var scrollHeight = $( '#tbl-container' )[0].scrollHeight;
            if ( scrollHeight > $( '#tbl-container' ).height() ) {
                $( 'table.data-entry tfoot' ).show();
            }
            else {
                $( 'table.data-entry tfoot' ).hide();
            }

            $( '#tbl-container' ).scrollTop( $( '#tbl-container' )[0].scrollHeight );
            return $( '#data-entry-tbl-last-row' );
        }
        if ( $( 'table.data-entry tbody tr' ).length == 0 ) {
            return this.addRow( 0 );
        }
        else {
            var n;
            n = +$( '.data-entry tbody tr:last-child' ).attr( 'no' );
            return this.addRow( n + 1 );
        }
    },

    removeAllRows: function () {
        $( 'table.data-entry tbody tr' ).remove();
        this.addRow();
        $( 'table.data-entry' ).prop( 'hasError', false );
        $( '#data-entry-tbl-last-row td.vallt input' ).focus();
    },

    removeEmptyRows: function ( no ) {
        $( 'table.data-entry input[type="text"]' ).filter( function () { return $.trim( $( this ).val() ) == ''; } ).parent().parent().remove();
        this.addRow();
        this.validateAllRows();
    },

    round: function ( keyValue ) {
        var 
            decimalCount;
        decimalCount = Math.min( -2, Math.round( Math.log( keyValue ) / Math.LN10 ) - 3 );

        return function ( value ) {
            return Math.round10( value, decimalCount );
        }

    }

}

zygotine.G = {};

var a = ( function () {
    zygotine.G.plot = function () {

        var 
        container = $( "#placeholder" ),
         $u = zygotine.U,
         $nd = zygotine.ND,
        language = $u.language;

        $u.clearCanvas();


        var 
        plotData = new this.GraphData( $nd );

        plotData.getDataForChart();

        var det = plotData.detected;

        var nd = plotData.nd;

        var reg = plotData.regression;

        var deltaX = plotData.maxX - plotData.minX
        var deltaY = plotData.maxY - plotData.minY;
        var data = [];

        data.push( { data: reg, shadowSize: 0, points: { show: false }, color: 'black', label: $T.seriesRegress[$u.language], lines: { lineWidth: 1, show: true, shadowSize: 0 }
        } );
        if ( nd.length != 0 ) {
            data.push( { data: nd, points: { symbol: "circle" }, color: "#A0522D", label: $T.seriesPredicted[$u.language] } );
        }
        data.push( {
            data: det,
            points: {
                symbol: function cross( ctx, x, y, radius, shadow ) {
                    var size = ( radius + 2 ) * Math.sqrt( Math.PI ) / 2;
                    ctx.moveTo( x - size, y - size );
                    ctx.lineTo( x + size, y + size );
                    ctx.moveTo( x - size, y + size );
                    ctx.lineTo( x + size, y - size );
                }
            },
            color: "red", label: $T.seriesDetected[$u.language]
        } );



        $u.lastPlot = $.plot( container, data, {
            series: {
                points: {
                    show: true,
                    radius: 3
                }
            },
            grid: {
                borderWidth: 1,
                minBorderMargin: 20,
                labelMargin: 10,
                backgroundColor: {
                    colors: ["#fff", "rgba(255, 248, 220, .25)"] //#e4f4f4
                },
                margin: {
                    top: 8,
                    bottom: 20,
                    left: 20
                },
                hoverable: true
            },
            xaxis: {
                min: plotData.minX - .03 * deltaX,
                max: plotData.maxX + .03 * deltaX
            },
            yaxis: {
                min: plotData.minY - .05 * deltaY,
                max: plotData.maxY + .05 * deltaY
            },
            legend: {
                show: true,
                position: 'nw',
                sorted: 'reverse'
            }


        } );

        $( '<div id="canvasYAxisLabel" class="axisLabel yaxisLabel"></div>' )
                .text( $T.yAxisLbl[language] )
                .appendTo( container );
        $( '<div id="canvasXAxisLabel" class="axisLabel xaxisLabel"></div>' )
                .text( $T.xAxisLbl[language] )
                .appendTo( container );
        $( '<div id="canvasTitle" class="axisLabel plotTitle"></div>' )
                .text( $T.plotTitle[language] )
                .appendTo( container );
        $u.canvasVisible = true;
        // Add the Flot version string to the footer
    };

    zygotine.G.GraphData = function ( ndObject ) {
        this.ndObject = ndObject;
        this.nd = [];
        this.regression = [];
        this.detected = [],
        this.minX = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.minXDet = Number.POSITIVE_INFINITY;
        this.maxXDet = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
    };

    zygotine.G.GraphData.prototype.getDataForChart = function () {

        var 
        data = this.ndObject.dataSet,
        iDatum,
        datum,
        y,
        xyPoint;

        for ( iDatum = 0; iDatum < data.length; iDatum++ ) {
            datum = data[iDatum];
            y = Math.log( datum.finalValue );

            xyPoint = [datum.score, y, datum.finalValue];
            this.minX = Math.min( this.minX, xyPoint[0] );
            this.maxX = Math.max( this.maxX, xyPoint[0] );
            this.minY = Math.min( this.minY, y );
            this.maxY = Math.max( this.maxY, y );

            if ( datum.isNotDetected() ) {
                this.nd.push( xyPoint );
            }
            // le else est inutile. On trace la droite pour tous les points
            else {
                this.detected.push( xyPoint );
                this.minXDet = Math.min( this.minXDet, xyPoint[0] );
                this.maxXDet = Math.max( this.maxXDet, xyPoint[0] );
            }
        }
        // On utilisait 'minXDet et maxXDet
        y = this.ndObject.global.slope * this.minX + this.ndObject.global.intercept;
        this.regression.push( [this.minX, y, Math.exp( y )] );
        y = this.ndObject.global.slope * this.maxX + this.ndObject.global.intercept;
        this.regression.push( [this.maxX, y, Math.exp( y )] );
        this.minY = Math.min( this.minY, this.regression[0][1] );
        this.maxY = Math.max( this.maxY, this.regression[1][1] );


    };

    return null;
} )();


$T = {

    xportLabels2: 'raw\tpp\tns\tfinal',
    toNADA: { en: 'Switch to NADA mode', fr: 'Passer en mode NADA' },
    toNDExpo: { en: 'Switch to NDExpo mode', fr: 'Passer en mode NDExpo' },
    title: { en: "NDExpo – Treatment of non-detects in industrial hygiene samples", fr: "NDExpo – Traitement des valeurs non détectées d’hygiène industrielle" },
    documentTitle: { en: "uMontreal - jLavoue - NDExpo", fr: "uMontreal - jLavoue - NDExpo" },
    detected: { en: "detected", fr: "détecté" },
    nd: { en: 'ND', fr: 'ND' },
    mnuHelpFile: { en: "Help file", fr: "Fichier d'aide" },
    mnuHelpFileName: { en: "aide_en.htm", fr: "aide_fr.htm" },
    mnuAbout: { en: "About", fr: "À propos" },
    mnuAboutFileName: { en: "apropos_en.htm", fr: "apropos_fr.htm" },
    mnuLanguage: { en: "Passer au français", fr: "Switch to English" },
    col1_raw: { en: "Raw data", fr: "Données<br/>brutes" },
    col2_censoring: { en: "Censoring<br/>point", fr: "Limite<br/>de détection" },
    col3_detected: { en: "Detected value", fr: "Valeur détectée" },
    col4_final: { en: "Final value", fr: "Valeur finale" },
    _import: { en: "import", fr: "entrée" },
    exportVerbose: { en: "export (verbose)", fr: "sortie détaillée" },
    exportShort: { en: "export (final only)", fr: "sortie brève" },
    btnAddRow: { en: "Add<br/>row", fr: "Ajout<br/> d'une ligne" },
    btnNewDataSet: { en: "New<br/>dataset", fr: "Nouveau jeu<br>de données" },
    btnRemoveEmpty: { en: "Remove<br/> empty rows", fr: "Suppression<br/>des lignes vides" },
    btnCalc: { en: "Calculate", fr: "Calcul" },
    btnImport: { en: "Import", fr: "Importer" },
    plotTitle: { en: "Goodness of fit to the lognormal model :  Q-Q plot", fr: "Ajustement au modèle lognormal : Graphe Q-Q" },
    plotTitleAlt: { en: "No graph available at this time", fr: "Le graphique n'est pas disponible pour l'instant" },
    seriesDetected: { en: "Detected values", fr: "Valeurs détectées", key: 'tect' },
    seriesPredicted: { en: "Censored (predicted) values", fr: "Valeurs censurées (prédites)", key: 'ens' },
    seriesRegress: { en: "Q-Q regression line", fr: "Droite de régression Q-Q", key: 'Q-Q' },
    pointTIp: { en: "Concentration of selected point", fr: "Concentration du point sélectionné" },
    xAxisLbl: { en: "Value from the standard normal distribution", fr: "Valeur de la distribution normale" },
    yAxisLbl: { en: "Observed value (ln)", fr: "Valeur observée (ln)" },
    ERR_TOOMANY_ND: { en: "The proportion of non detects cannot be greater than 80%", fr: "La proportion de valeurs censurées ne" },
    ERR_GRTSTDL: { en: "The highest limit of detection cannot be higher than the highest detected value", fr: "La limite de détection la plus élevées ne peut dépasser la valeur détectée la plus élevée" },
    ERR_NENGH_DATA: { en: "The procedure require at least 5 observations", fr: "La procédure requiert au moins 5 observations" },
    WARN_NO_ND: { en: "No censored value, calculation is not necessary", fr: "Pas de valeur non détectée, le calcul n’est  pas nécessaire" },
    ERR_NENGH_DET: { en: "The procedure require at least 3 detected observations.", fr: "La procédure requiert au moins 3 observations détectées" },
    invalidData: { en: "Errors in data table", fr: "Les données fournies contiennent des erreurs." }
};


