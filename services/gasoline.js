const request = require('request');

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const STATES = process.env.STATES.split(',');
const STATES_FULL = process.env.STATES_FULL.split(',');

function getUrl(api_key, state){
    return `https://api.eia.gov/series/?api_key=${api_key}&series_id=PET.EMM_EPMR_PTE_S${state}_DPG.W`;
}

function makeUrls(api_key, states){
    var calls_list = [];
    states.forEach(element => {
        url = getUrl(api_key, element);
        calls_list.push(url);
    });

    return calls_list;
}

function makeDateString(date){
    var year = date.slice(0, 4);
    var month = date.slice(4, 6);
    var day = date.slice(6, 8);

    return month + '/' + day + '/' + year;
}


function stripPriceAndDate(json){
    var data = json.series[0].data[0];
    var state_code = json.series[0].geography.slice(-2);

    return {
        'state': STATES_FULL[STATES.indexOf(state_code)],
        'date': makeDateString(data[0]),
        'price': data[1]
    };
}

function getStatePrice(url){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);
        request.get(url, (err, res, body) => {
            if(err){
                reject(err);
            }
            else{
                resolve(stripPriceAndDate(JSON.parse(body)));
            }
        });
    });
}

function createPriceObjects(calls_list){
    var promises = [];

    calls_list.forEach(url => {
        promises.push(getStatePrice(url));
    })

    return Promise.all(promises);
}

function getPrices(){
    return createPriceObjects(makeUrls(API_KEY, STATES));
}

module.exports.getPrices = getPrices;