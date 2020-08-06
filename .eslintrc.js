module.exports = {
    "env": {
        "es2020": true,
        "node": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "error",
                    "info"
                ]
            }
        ],
        "no-trailing-spaces": 2
    }
};
