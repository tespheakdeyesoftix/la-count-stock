const apiUrl="http://192.168.10.41:1213/"
const token = "f185af83e9c902a:44054fbd018e6f3"

export function getApi(apiEndpoint, params = Object){
    return new Promise((resolve, reject)=>{

        fetch(apiUrl + apiEndpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
            body: JSON.stringify(params)
        })
        .then(r => {
            resolve(r.json())
        })
        .catch((err)=>{
            reject(err)
        })

    })
}

export function postApi(apiEndpoint, params = Object){
    return new Promise((resolve, reject)=>{

        fetch(apiUrl + apiEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
            body: JSON.stringify(params)
        })
        .then(r => {
            resolve(r.json())
        })
        .catch((err)=>{
            reject(err)
        })

    })
}

