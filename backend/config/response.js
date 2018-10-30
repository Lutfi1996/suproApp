'use strict';

module.exports = {
    send : (res, status, message) => {
        let resp = {};
        resp.status = status;
        resp.message = message;
        res.send(status, resp);
    }
}