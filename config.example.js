// For help getting USERNAME and ACCESSTOKEN, see this article: https://reeve.xyz/getting-started-with-matrix-bots-on-nodejs/

const config = {
    "production": {
        "api": {
            "version": "1.0"
        },
        "postgres": {
            "host": "HOST",
            "user": "USER",
            "password": "PASSWORD",
            "database": "DATABASE"
        },
        "bots": [{
            "baseUrl": "https://matrix.org",
            "userId": "@USERNAMEHERE:matrix.org",
            "accessToken": "ACCESSTOKENHERE",
            "language": "english"
        }]
    },
    "development": {
        "api": {
            "version": "1.0"
        },
        "postgres": {
            "host": "HOST",
            "user": "USER",
            "password": "PASSWORD",
            "database": "DATABASE"
        },
        "bots": [{
            "baseUrl": "https://matrix.org",
            "userId": "@USERNAMEHERE:matrix.org",
            "accessToken": "ACCESSTOKENHERE",
            "language": "english"
        }]
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];