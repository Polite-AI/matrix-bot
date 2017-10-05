// For help getting USERNAME and ACCESSTOKEN, see this article: https://reeve.xyz/getting-started-with-matrix-bots-on-nodejs/

const config = {
    "production": {
        "personalityServer": {
            "host": "localhost",
            "port": "8000",
            "version": "1"
        },
        "bots": [{
            "baseUrl": "https://matrix.org",
            "userId": "@USERNAMEHERE:matrix.org",
            "accessToken": "ACCESSTOKENHERE",
            "language": "english",
            "personality": "standard"
        }]
    },
    "development": {
        "personalityServer": {
            "host": "localhost",
            "port": "8000",
            "version": "1"
        },
        "bots": [{
            "baseUrl": "https://matrix.org",
            "userId": "@USERNAMEHERE:matrix.org",
            "accessToken": "ACCESSTOKENHERE",
            "language": "english",
            "personality": "standard"
        }]
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];