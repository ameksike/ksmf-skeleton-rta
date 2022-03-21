/*
 * @author		Antonio Membrides Espinosa
 * @email		tonykssa@gmail.com
 * @date		20/08/2021
 * @copyright  	Copyright (c) 2020-2030
 * @license    	GPL
 * @version    	1.0
 * */
const KsMf = require('ksmf');
const path = require('path');
const fs = require('fs');

class AppModule extends KsMf.app.Module {
    async initApp() {
        const app = this.helper.get('app').web;
        //... define channels 
        this.channels = [
            {
                "route": "chat:delete",
                "controller": "DefaultController",
                "action": "delete"
            }
        ]
        //... add support for ForestAdmin, Angular and React Js Router options 
        app.get(/\/((?!(api|forest)).)*/, (req, res) => {
            const index = path.join(__dirname, '../../' + this.opt.srv.public, 'index.html');
            try {
                if (fs.existsSync(path)) {
                    res.sendFile(index);
                } else {
                    res.end('API v1.0.0');
                }
            } catch (err) {
                console.error(err)
                res.end('API v1.0.0');
            }
        });
    }
}
module.exports = AppModule;