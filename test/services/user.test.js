const mongoose = require("mongoose");
const UserService = require("../../src/services/user");
const { User } = require("../../src/schema/models");
const { errorNames } = require("../../src/config/errors");
const { invalidEmailAddresses, testUsers } = require("./mockData");

describe("User Service", function(){
    let mockUserOne = new User(testUsers[0]);
    let mockUserTwo = new User(testUsers[1]);

    beforeAll(async() => {
        await mongoose.connect(global.__MONGO_URI__,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
            error => {
                if (error) console.error(error);
            }
        );

        return Promise.all([
            mockUserOne.save(),
            mockUserTwo.save()
        ]).then(([
            mockUserOneResult,
            mockUserTwoResult
        ]) => {
            mockUserOne = mockUserOneResult;
            mockUserTwo = mockUserTwoResult;

            return;
        }).catch(error => {
            console.error(error);
        });
    });

    afterAll(async function(){
        return await mongoose.connection.close();
    });

    describe("editUser", () => {
        const invalidFields = [
            "followers",
            "following",
            "isDeleted",
            "_id",
            "createdAt",
            "updatedAt",
            "password"
        ];
        let editedUser = {
            firstName: "Jesse",
            lastName: "Pinkman"
        };

        it("successfully edits a user", () => {
            return UserService.editUser(mockUserOne._id, editedUser).then(response => {
                expect(response.firstName).toBe(editedUser.firstName);
                expect(response.lastName).toBe(editedUser.lastName);
                expect(response.firstName).not.toBe(mockUserOne.firstName);
                expect(response.lastName).not.toBe(mockUserOne.lastName);
            });
        });

        invalidFields.forEach(field => {
            it(`throws an error when attempting to edit ${field}`, async () => {
                let thrownError;
                editedUser[field] = "I am the danger!";

                try {
                    await UserService.editUser(mockUserOne._id, editedUser);
                } catch(error){
                    thrownError = error;
                }

                delete editedUser[field];

                expect(thrownError.message).toBeDefined();
                expect(thrownError.message).toEqual(errorNames.INVALID_FIELDS);
            });
        });

        ["email", "username"].forEach(field => {
            it(`throws an error when ${field} is already taken`, async () => {
                let thrownError;

                editedUser[field] = mockUserTwo[field];

                try {
                    await UserService.editUser(mockUserOne._id, editedUser);
                } catch(error){
                    thrownError = error;
                }

                delete editedUser[field];

                expect(thrownError.message).toBeDefined();
                expect(thrownError.message).toEqual(field === "email" ? errorNames.EMAIL_ALREADY_TAKEN : errorNames.USERNAME_ALREADY_TAKEN);
            });
        });

        it("throws an error when both email and username are already taken", async () => {
            let thrownError;

            ["email", "username"].forEach(field => {
                editedUser[field] = mockUserTwo[field];
            });

            try {
                await UserService.editUser(mockUserOne._id, editedUser);
            } catch(error){
                thrownError = error;
            }

            ["email", "username"].forEach(field => {
                delete editedUser[field];
            });

            expect(thrownError.message).toBeDefined();
            expect(thrownError.message).toEqual(errorNames.USERNAME_AND_EMAIL_TAKEN);
        });

        it("throws an error when the email is invalid", () => {
            let thrownError;

            invalidEmailAddresses.forEach(async invalidEmail => {
                editedUser.email = invalidEmail;

                try {
                    await UserService.editUser(mockUserOne._id, editedUser);
                } catch(error){
                    thrownError = error;
                }

                expect(thrownError.message).toBeDefined();
                expect(thrownError.message).toEqual(errorNames.INVALID_EMAIL);
            });
        });
    });

    describe("deleteUser", function(){

    });

    describe("getUsers", function(){

    });

    describe("getUserByID", function(){

    });

    describe("followUser", function(){

    });

    describe("unfollowUser", function(){

    });
});