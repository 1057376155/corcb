import axios from 'axios'

function getFN(o){
    return new Promise((resolve,reject)=>{
        request({type:'GET',url:o.url}).then((r)=>{  
            resolve(r)
        })
    })
    
}

function request(o){
    // axios()
    return new Promise((resolve,reject)=>{
        var obj={
            method:o.type,
            url:o.url,
        }
        axios(obj).then((r)=>{
            resolve(r)
        })
    })
}
var http={
    getFN:getFN
}
export default http;