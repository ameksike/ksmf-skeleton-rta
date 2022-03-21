const KsMf = require('ksmf');

class ChatModule extends KsMf.app.Module {

    initConfig() {
        this.routes.push({ route: this.prefix + '/register', controller: 'RegisterController' });
        // ... for use DefaultController
        super.initConfig(); 
    }

}
module.exports = ChatModule;