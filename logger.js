function getHumanDate() {
    return (new Date()).toISOString();
}

function log(...args) {
    console.log(getHumanDate(), ...args);
}

function error(...args) {
    console.error(getHumanDate(), ...args);
}

function warn(...args) {
    console.warn(getHumanDate(), ...args);
}

function info(...args) {
    console.info(getHumanDate(), ...args);
}

module.exports = {
    log,
    error,
    warn,
    info
};