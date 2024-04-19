var $A =
{
    sqrt2PI: Math.sqrt(Math.PI * 2),
    sqrtPI: Math.sqrt(Math.PI),
    epsilon: 0.000000000000001,

    nd_densityf: function (p_x, mu, sigma) {
        // Fonction de densité d'une loi normale
        // fND_DF
        var d, exponent, m;
        m = (p_x - mu) / sigma;
        d = sigma * $A.sqrt2PI;
        exponent = (-0.5) * m * m;
        return Math.exp(exponent) / d;
    },

    erf: function (p_x) {
        // Piqué sur le web.
        // Fonction Erf : fonction d'erreur de Gauss
        // fERF

        var a, s, nu, z, m, x, rep;

        if (p_x < 0)
            x = -p_x;
        else
            x = p_x;

        //  erf(x) = 1- e^(x^2)/sqr(PI) )*( 1/x+|1/2/x+|1/x+|+3/2/x+|2/x+|..)
        //  +| = continued fraction

        a = Math.exp(-x * x) / $A.sqrtPI;
        if (x <= 2) {
            a = 2 * x * a;
            s = a;
            nu = 1 / 2;
            do {
                a = x * x * a / (nu + 1);
                s = s + a;
                nu = nu + 1;
            }
            while (a > $A.epsilon);
            rep = s;
        }
        else {
            m = 8;
            z = x;
            do {
                z = x + m / z;
                m = m - 1 / 2;
            }
            while (m > 0)
            rep = 1 - a / z;
        }
        if (p_x < 0) return -rep; else return rep;
    },

    nd_cdf: function (px, mu, sigma) {
        //
        // Fonction de répartition d'une loi normale dont la moyenne est mu et l'écart type sigma
        // fND_CDF
        return 0.5 * (1.0 + $A.erf((px - mu) / (Math.sqrt(2.0) * sigma)));
    },

    snd_inversecdf: function (p) {
        //  L'inverse d'une fonction de distribution d'une loi normale ... centrée et réduite.
        //  Adapted for Microsoft Visual Basic from Peter Acklam's
        //  "An algorithm for computing the inverse normal cumulative distribution function"
        //  (http://home.online.no/~pjacklam/notes/invnorm/)
        //  by John Herrero (3-Jan-03)
        // fND_InverseCDF

        // 'Define coefficients in rational approximations
        var a1 = -39.6968302866538;
        var a2 = 220.946098424521;
        var a3 = -275.928510446969;
        var a4 = 138.357751867269;
        var a5 = -30.6647980661472;
        var a6 = 2.50662827745924;

        var b1 = -54.4760987982241;
        var b2 = 161.585836858041;
        var b3 = -155.698979859887;
        var b4 = 66.8013118877197;
        var b5 = -13.2806815528857;

        var c1 = -7.78489400243029E-03;
        var c2 = -0.322396458041136;
        var c3 = -2.40075827716184;
        var c4 = -2.54973253934373;
        var c5 = 4.37466414146497;
        var c6 = 2.93816398269878;

        var d1 = 7.78469570904146E-03;
        var d2 = 0.32246712907004;
        var d3 = 2.445134137143;
        var d4 = 3.75440866190742;

        //Define break-points
        var p_low = 0.02425;
        var p_high = 1 - p_low;

        //Define work variables
        var q, r, rep;

        // If argument out of bounds, raise error
        if (p <= 0 || p >= 1) return {}; // Then Err.Raise 5

        if (p < p_low) {
            //Rational approximation for lower region
            q = Math.sqrt(-2 * Math.log(p));
            return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        else
            if (p <= p_high) {
                //Rational approximation for lower region
                q = p - 0.5;
                r = q * q;
                return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
            }
            else
                if (p < 1) {
                    //Rational approximation for upper region
                    q = Math.sqrt(-2 * Math.log(1 - p));
                    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
                }
    },


    nd_inversecdf: function (p, mu, sigma) {
        return mu + sigma * $A.snd_inversecdf(p)
    },

    getDHRAdjusted: function (pDHR0, pDuration, pSurface) {
        // on veut obtenir une valeur ajustée de R à partir de pDHR0, tiré de la bd, en fonction de pDuration et de pSurface
        // pDHR0 = DHR initial == DHR pour les 2 mains (840 cm²) et pour une durée de 8 heures (480 min).
        // pDuration : minutes
        // pSurfacee : cm2
        // fR
        return pDHR0 * pDuration * pSurface / (480.0 * 840.0);
    },


    getDHRMinMax: function (pDHR0, male) {
        // 
        // retourne un objet { min:v1 , max:v2 }

        var minSurface, maxSurface, minDuration, maxDuration;

        minSurface = 420; // 480 cm² == une main d'homme
        maxSurface = 16160; // 16160 cm² == une main d'homme

        minDuration = 1; // 1 minute
        maxDuration = 480; // 8 heures

        return { min: $A.getDHRAdjusted(pDHR0, minDuration, minSurface), max: $A.getDHRAdjusted(pDHR0, maxDuration, maxSurface) };
    }

};