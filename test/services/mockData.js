const testUsers = [
    {
        firstName: "Walter",
        lastName: "White",
        username: "Heisenberg",
        email: "ww@gmail.com",
        password: "bettercallsaul",
        confirmPassword: "bettercallsaul"
    },
    {
        firstName: "Mike",
        lastName: "Ehrmantraut",
        username: "Fixxer",
        email: "a1acarwash@abq.com",
        password: "bettercallsaul",
        confirmPassword: "bettercallsaul"
    }
];

const invalidEmailAddresses = [
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Marie Shrader <email@example.com>",
    "email.example.com",
    "email@example@example.com",
    ".email@example.com",
    "email.@example.com",
    "email..email@example.com",
    "あいうえお@example.com",
    "email@example.com (Skylar White)",
    "email@example",
    "email@-example.com",
    "email@111.222.333.44444",
    "email@example..com",
    "Abc..123@example.com"
];

module.exports = {
    invalidEmailAddresses,
    testUsers
};
