const KsMf = require('ksmf');

class DefaultController extends KsMf.app.Controller {

    list(req, res) {
        res.emit('chat:notify', req.body);
    }

    delete(req, res) {
        console.log('delete', req.body);
    }
}

module.exports = DefaultController;