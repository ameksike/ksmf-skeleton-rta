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

const ProxyPeverse = require('./service/ProxyPeverse');

class AppModule extends KsMf.app.Module {
    async initApp() {
        const app = this.helper.get('app').web;
        //... add support for ForestAdmin, Angular and React Js Router options 

        app.use(ProxyPeverse.middleware(this.helper.get('app')));

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