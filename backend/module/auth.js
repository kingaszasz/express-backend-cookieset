const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, './token.json');

const checkCookie = (req, callback) => {
    fs.readFile(
        tokenPath,
        'utf8',
        (err, tokens) => {
            tokens = JSON.parse(tokens);
            if (tokens.indexOf(req.cookies.api) > -1) {
                callback(null); // midleware

            } else {
                callback({
                    error: 'user'
                });
            }
        }
    );

}

const startLogin = (req, res, next) => {
    let cookie = 'user' + Math.round(Math.random()*10000);
    let tokens = fs.readFileSync(tokenPath, 'utf8');

    tokens = JSON.parse(tokens);
    tokens.push(cookie);
    fs.writeFileSync(tokenPath, JSON.stringify(tokens), 'utf8');
    res.cookie('api', cookie); // h aegyszer beállítom, ezt a server oldalon állítom be
    //ez állítja be api néven a sütit
    // olyan headert küld vissza a cliensnek, az meg eltárolja a sütit
    // majd míg le nem jár minden requesthez hozzá teszi a cookiet a headerben
    res.sendStatus(202);

}
module.exports = (req, res, next) => {

    if (req.url == '/login') {
        return startLogin(req, res, next);
    }
    // ha loginról jön a request akkor még nincs cookie, elengedem a bejeletkezéshez
    
checkCookie(req, (err) => {
    if (err) {
        return res.sendStatus(403);
    } else {
        next();
    }
});

}