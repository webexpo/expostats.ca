/// <reference path="vs/vs.js" />


var $G =
{
    byId: function (s) {
        /// <summary> ~document.getElementById()</summary>
        /// <param name="s" type="String">l'id de l'élément</param>
        /// <returns type="document.documentElement">return un objet élément du document</returns>

        return document.getElementById(s);
    },
    log10: function (x) {
        return Math.log(x) / Math.LN10;
    },

    format: function (fmt, args) {
        if (arguments.length == 0) return "";
        if (arguments.length == 1) return fmt;

        var tmp = fmt;
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp("\\{" + (i - 1) + "\\}", "g");
            tmp = tmp.replace(re, arguments[i]);
        }
        return tmp;
    },

    fmtBool: function (tst) {
        return tst ? 'oui' : 'non';
    },
    formatM: function (fmt, args) {
        if (arguments.length == 0) return "";
        if (arguments.length == 1) return fmt;
        if (!args.length) return "";
        var tmp = fmt;
        for (var i = 0; i < args.length; i++) {
            var re = new RegExp("\\{" + (i) + "\\}", "g");
            tmp = tmp.replace(re, args[i]);
        }
        return tmp;
    },

    fmtPC: function (n) {
        var tmp;
        return isNaN(n) ? "?" : (Math.round(n * 100)) + "%";
    },

    pad: function (number, length) {
        var str = '' + number;
        while (str.length < length)
            str = '0' + str;
        return str;
    },

    breakString: function (iString, len) {
        var reg = new RegExp("[ ]+", "g");
        var words = iString.split(reg);
        var rep = "";
        var tmp = "";
        for (var i = 0; i < words.length; i++) {
            if ((tmp.length + words[i].length) > len) {
                rep += ((rep != "") ? "<br/>" : "") + tmp;
                tmp = "";
            }
            if (tmp != "")
                tmp += " ";
            tmp += words[i];
        }
        if (tmp != "") rep += ((rep != "") ? "<br/>" : "") + tmp;
        return rep;
    },

    hideOrShow: function (obj) {
        if (obj.style.visibility == 'visible') {
            hide(obj);
        }
        else {
            show(obj);
        }
    },

    show: function (obj) {
        obj.style.visibility = 'visible';
        //obj.style.position = 'relative';
    },

    hide: function (obj) {
        obj.style.visibility = 'hidden';
        //obj.style.position = 'absolute';
    }
};




