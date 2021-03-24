const moment = require('moment')

function formatMessage_client (username, text) {
    return {
        username,
        text,
        time: moment().format('LT')
    }
}

module.exports = formatMessage_client