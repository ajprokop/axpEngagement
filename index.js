const axios = require("axios");
const functions = require('@google-cloud/functions-framework');

/*
 * HTTP function that supports CORS requests.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('getEngagement', (req, res) => {
    var jsonResponse = {
        session_info: {
            parameters: {
                callingNumber: null,
                dialedNumber: null
            }
        }
    };
    
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
        const CCAAS_TOKEN =  req.body.sessionInfo.parameters["CCAAS_TOKEN"];
        const CCAAS_ACCOUNT =  req.body.sessionInfo.parameters["CCAAS_ACCOUNT"];
        const CCAAS_ENGAGEMENT_ID  = req.body.sessionInfo.parameters["CCAAS_ENGAGEMENT_ID"];
        const BASE_URL = req.body.sessionInfo.parameters["CCAAS_URL"];
        
        const CCAAS_GET_JOURNEY_ENGAGEMENT = `api/journey/v1beta/accounts/${CCAAS_ACCOUNT}/engagements/`;

       callAXP(res, `${BASE_URL}${CCAAS_GET_JOURNEY_ENGAGEMENT}${CCAAS_ENGAGEMENT_ID}`, CCAAS_TOKEN)
    }

});   

async function callAXP(res, url, token) {
    res.set('Content-Type', 'application/json');
	var options = {
		method: 'get',
		url: url,
		headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Axios 1.1.3'
		}
	};

    var jsonResponse = {
        session_info: {
            parameters: {
                callingNumber: null,
                dialledNumber: null
            }
        }
    };

	try {
		const getEngagementResponse = await axios(options);
        try {
            jsonResponse.session_info.parameters.callingNumber = getEngagementResponse.data.participants[0].callingNumber;
            jsonResponse.session_info.parameters.dialledNumber = getEngagementResponse.data.participants[0].dialledNumber;
        } catch {
            console.log("Could not Parse response")
        }
        res.status(200).send(JSON.stringify(jsonResponse));
	} catch (e) {
		console.log(`Get Engagement Exception : ${e}`);
        res.status(200).send(JSON.stringify(jsonResponse));
	}   

}