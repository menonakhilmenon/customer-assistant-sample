import * as Constants from './BackendConstants';
export async function requestItemsList(purpose: string) {
    console.log(`Searching for ${purpose}`);
    const fetchResponse = await fetch(Constants.BE_URL + Constants.SHOPPING_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            purpose: purpose
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    })
    return await fetchResponse.json();
}

export async function requestRecommendations(itemsList : Array<any>, sessionId : string) {
    console.log(`Requesting recommendation for items ${JSON.stringify(itemsList)} with sessionId ${sessionId}`)
    const fetchResponse = await fetch(Constants.BE_URL + Constants.SHOPPING_ENDPOINT + sessionId, {
        method: 'PUT',
        body: JSON.stringify({
            items: itemsList.filter(item => item.count > 0).map(item => item.type)
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    });
    return await fetchResponse.json();
    
}

export async function addProduct({description, type}) {
    return await fetch(Constants.BE_URL + Constants.PRODUCT_ADD_ENDPOINT, {
        method: 'PUT',
        body: JSON.stringify({
            productType: type,
            productDescription: description
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    })
}
