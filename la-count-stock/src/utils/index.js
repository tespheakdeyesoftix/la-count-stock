import axios from "axios"
const apiUrl="https://dcmssl.lasievphov.com:445/"
let token = "" //LA TOKEN
let authentication = undefined
let current_user = undefined
if (localStorage.getItem("_authentication")){
    authentication = JSON.parse(localStorage.getItem("_authentication"))
    const str_user_decoded = JSON.stringify(atob(authentication.message))
    current_user = JSON.parse(str_user_decoded.replace(/'/g, '"').replace("\"{","{").replace("}\"","}"))
    token = current_user.api_key + ":" + current_user.api_secret
}

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response.statusText == "FORBIDDEN"){
        localStorage.removeItem('_authentication')
        window.location.reload()
    }
    
    return Promise.reject(error);
  });

export function getApi(apiEndpoint, params = Object){
    
    return new Promise((resolve, reject)=>{
        // Construct query string from the object
        const queryString = Object.entries(params)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
            // If the value is an array, convert it to a string
            return `${key}=${JSON.stringify(value)}`;
            } else {
            return `${key}=${value}`;
            }
        })
        .join("&");
 
        axios.get(apiEndpoint + "?" + queryString,{
            method: 'GET',
            baseURL:apiUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
        }).then((r)=>{
            resolve(r.data)
        }).catch((err)=>{
            reject(err)
        })


    })
}

export function postApi(apiEndpoint, params = Object){
    return new Promise((resolve, reject)=>{

        axios.post(apiUrl+apiEndpoint,JSON.stringify(params),{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
            
        }).then((r)=>{
            if (r.status == 200){
                resolve (r.data)
            }else{
                window.postMessage({message: r.data})
                resolve (r.data)
            }
            
        }).catch((err)=>{
            window.postMessage({message: JSON.parse(JSON.parse(err.response.data['_server_messages'])[0]).message})
            reject(JSON.parse(JSON.parse(err.response.data['_server_messages'])[0]).message)
            
        })
    })
}

export function loginApi(apiEndpoint, params = Object){
    return new Promise((resolve, reject)=>{

        fetch(apiUrl + apiEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })
        .then(async response => {
             
            if (!response.ok) {
                return response.json().then(errorData => {
                    let server_message = (errorData._server_messages)
                    if (server_message){
                        server_message = JSON.parse(server_message)
                        if (server_message){
                            server_message.forEach(s => {
                                 
                                let message =  JSON.parse(s)
                               window.postMessage({message:message.message})
                            });
                        }
                        
                    }
                    reject(errorData.message.message)
                  });
            }
            resolve (response.json())
          })
           
          .catch(err => {
            
            reject(err)
        })

    })
}


export default class CountProduct {
    constructor() {   
        this.stockReconcil={}
    }

    

}

