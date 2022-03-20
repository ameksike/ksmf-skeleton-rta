
const http = require('http');
const net = require('net')
const url = require('url')

function pipe(req, clientSocket, srv, url) {
    const { port, hostname } = url;
    if (hostname && port) {
        const serverSocket = net.connect(port, hostname);
        srv.app.emit('onPipe', 'ksmf', [req, clientSocket, serverSocket]);
        const serverErrorHandler = (err) => {
            srv.app.setError(err, req, clientSocket);
            srv.app.helper.get('http').send(clientSocket, 'custom', err.message);
        }
        const serverEndHandler = () => {
            srv.app.setError('External Server End', req, clientSocket);
            srv.app.helper.get('http').send(clientSocket, 500);
        }
        const clientErrorHandler = (err) => {
            srv.app.setError(err, req, clientSocket);
            srv.app.helper.get('http').send(clientSocket, 'custom', err.message);
        }
        const clientEndHandler = () => {
            srv.app.setError('client End Handler', req, clientSocket);
            srv.app.helper.get('http').send(clientSocket, 'custom', 'client_end');
        }
        clientSocket.on('error', clientErrorHandler);
        clientSocket.on('end', clientEndHandler);
        serverSocket.on('error', serverErrorHandler);
        serverSocket.on('end', serverEndHandler);
        serverSocket.on('connect', () => {
            srv.app.helper.get('http').send(clientSocket, 200);
            serverSocket.pipe(clientSocket, { end: false });
            clientSocket.pipe(serverSocket, { end: false });
        })
    } else {
        srv.app.setError('Bad Request', req, clientSocket);
        srv.app.helper.get('http').send(clientSocket, 400);
    }
}

function getRoute(req, routes) {

    console.log('>>>>>>>>>>', req.url, req.method, req.path)

    let target = routes[req.path];

    function isValid(target, req) {
        if (target && (!target.method || (target.method && target.method.toUpperCase() === req.method.toUpperCase()))) {
            return true;
        }
        return false;
    }

    if (isValid(target, req)) {
        return target;
    }

    for (let i in routes) {
        const route = routes[i];
        const rex = new RegExp(route.pattern);
        if (rex && rex.test(req.url)) {
            if (isValid(route, req)) {
                return route;
            }
        }
    }

    return target;
}

function middleware(app) {
    const cfg = app.cfg.srv.reverse;

    return async (req, res, next) => {
        const route = getRoute(req, cfg.route);
        if (route) {
            pipe(req, res, { app }, url);
            //res.end('REVERSE');
        } else {
            next();
        }
    }
}

module.exports = {
    middleware
} 