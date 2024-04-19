
var $T = {
    E: '',


    sel_CASL_fA: [
        '<select onchange="$C.substanceChanged(this)" id="CASL">',
        '',
        '</select>'],
    sel_SL_fA: [
        '<select onchange="$C.substanceChanged(this)" id="SL" style="width:550px">',
        '',
        '</select>'],

    opt_fA: [
        '<option sid="', '', '">',
        '',
        '</option>'], //1 = sid, 3 = cas ou name_en

    srch_selFA: [
        '<a class="srchSel" href="javascript:$C.selectSubstance(',
        '<!--substance id-->', //1
        ')">',
        '<!--substance name_en-->', //3
        '</a>\n'],

    banner: '',

    version: 'v1.1FR. UdeM 2008.',

    w_bullet: '- ',

    w_warnings_fA: [
        '<ul id="warningMessages"><span>Warnings</span>',
        '', // les li
        '</ul>'],

    rp_li_f: '<li><strong>R{0}</strong> - {1}</li>',

    w_gas_text: '<span style="font-weight:bold">Exposure to a gas: </span> In this scenario, as the substance is gaseous,<br />we considered that all body parts are exposed.',
    w_noDHR_noOEL: '<span style="color:Maroon">No reference dose (from occupational exposure limit or animal toxicological data) is available : DHR cannot be calculated.</span>',
    w_noDHR_outsideModel: '<span style="color:Maroon">Molecular weight and / or LogKow outside of QSAR model bounds : DHR cannot be calculated.</span>',
    rp_text_fA: [
        '<ul id="riskPhrases"><span>Risk Phrases</span>',
        '', // les li
        '</ul>'],

    w_CM : '<li>The selected agent has been flagged as either possibly carcinogenic or mutagenic by the European community. For such agents it is uncertain whether a practical threshold exists for harmful effect. Minimizing exposure should be a priority notwithstanding the actual DHR value.</li>',
    w_irrBasedOEL: '<li>OEL is based on irritation. The reference value used to calculate de dermal hazard ratio comes from an OEL not relevant to systemic toxicity: Risk is overestimated to an unknown extent.</li>',
    w_irrBasedOEL2: '<li>There is no evidence of systemic toxicity from animal data but a DHR was calculated because an OEL exists or was predicted. The DHR might indicate skin penetration but might not reflect an actual health risk.</li>',

    w_irr_RP_f: '<li>Dermal penetration might be increased due to skin damage (see Risk phrase R{0}).</li>',
    w_irr_RTECS: '<li>Dermal penetration might be increased due to skin damage (positive Draize test).</li>',
    w_RP43_sensitization : '<li>Agent is classified as a sensitizer, the model used in UPERCUT does not allow assessment of risk of sensitization.</li>',
    w_volatility: '<li>Chemical is volatile, DHR might be overestimated if cutaneous contact is intermittent (i.e. there is potential for evaporation of the dose applied to the skin before penetration occurs).</li>',

    w_DHR_gsdSpecial_f: '<li>Inhalation reference dose was derived from an {0} in mammals. Additional uncertainty was added around the estimation of DHR.</li>',
    w_DHR_gsdSpecialValue: {
        'ld50ipr': 'acute intra-peritoneal LD50',
        'ld50iv': 'acute intravenous LD50',
        'ld50orl': 'acute oral LD50',
        'ld50scu': 'acute sub-cutaneous LD50',
        'ld50skn': 'acute cutaneous LD50',
        'loaelorl': 'chronic oral LOAEL',
        'loael.skin': 'chronic cutaneous LOEAL'
    },

    w_pcLessThanOEL_f: 'There is a {0} probability that cutaneous dose is less than a dose equivalent to 8h at OEL.',
    w_pcGreaterThan10pc_f: 'There is a {0} probability that cutaneous dose is greater than 10% of the inhaled dose.',

    w_riskPhrases: 'Risk phrases',

    r_airSkinExposure_DHR_LT_10_f: 'Because inhalation exposure is present, the relevant risk threshold is taken as 10% of the maximal allowed inhalation dose. For the selected scenario, there is a {0} probability that the potential cutaneous dose is less than this threshold.',
    r_airSkinExposure_DHR_GE_10_f: 'Because inhalation exposure is present, the relevant risk threshold is taken as 10% of the maximal allowed inhalation dose. For the selected scenario, there is a {0} probability that the potential cutaneous dose is greater than this threshold.',
    r_skinOnlyExposure_DHR_LT_100_f: 'Because inhalation exposure is absent, the relevant risk threshold is taken as 100% of the maximal allowed inhalation dose. For the selected scenario, there is a {0} probability that the potential cutaneous dose is less than this threshold.',
    r_skinOnlyExposure_DHR_GE_100_f: 'Because inhalation exposure is absent, the relevant risk threshold is taken as 100% of the maximal allowed inhalation dose. For the selected scenario, there is a {0} probability that the potential cutaneous dose is greater than this threshold.',

    e_bodyParts: "Please select at least <b>one</b> body part. ",
    e_duration: " A valid duration is <b>a whole number greater than 0 and less or equal to 480</b>. "

};
