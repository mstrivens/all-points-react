
import axios from 'axios';

// const CHARGE_POINT_URL = 'https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json'

export async function makeRequest(url) {
    const response = await axios.get(url, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    return response.data
}
