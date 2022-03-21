const expressJwt = require('express-jwt')

function authJwt() {
    return expressJwt({
        secret:process.env.SECRET_KEY,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/, methods:['GET','OPTIONS']},
            {url:/\/products(.*)/, methods:['GET','OPTIONS']}
            ,{url:/\/Categories(.*)/, methods:['GET','OPTIONS']},
            `/users/login/`,
            `/users/register/`
            
        ] 
    }) 
} 
async function isRevoked(req, payload,done) {
    if(!payload.isAdmin){
        done(null,true)
    }
    else{
        done();
    }
}
module.exports=authJwt 
