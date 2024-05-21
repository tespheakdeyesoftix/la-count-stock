const apiUrl="http://154.197.83.232:28565/"
// const token = "f185af83e9c902a:44054fbd018e6f3"
const token = "efd0402becd8401:42e806ec6addead" //LA TOKEN


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
 
          
      
          
        fetch(apiUrl + apiEndpoint + "?" + queryString, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
            
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
                        console.log(server_message)
                    }
                    throw new Error(JSON.stringify( errorData));
                  });
            }
            resolve (response.json())
          })
           
          .catch(err => {
        
            reject(err)
        })

    })
}

