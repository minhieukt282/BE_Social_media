"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const accountRepo_1 = require("../repo/accountRepo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const random_1 = require("./random");
class LoginService {
    constructor() {
        this.register = async (data) => {
            let findAccount = await this.accountRepo.findByUsername(data.username);
            if (findAccount[0] != undefined) {
                return {
                    code: 409,
                    message: "Account already exists"
                };
            }
            else {
                data.password = await bcrypt_1.default.hash(data.password, 10);
                data.accountId = this.random.randomNumber();
                data.img = '../../public/storage/images.jpg';
                data.birthday = this.random.randomTime();
                const account = await this.accountRepo.create(data);
                return {
                    code: 201,
                    message: "Register done",
                    data: account
                };
            }
        };
        this.login = async (account) => {
            let findAccount = await this.accountRepo.findByUsername(account.username);
            if (findAccount[0] == null) {
                return {
                    code: 404,
                    message: "Account is not defined"
                };
            }
            else {
                let comparePassword = await bcrypt_1.default.compare(account.password, findAccount[0].password);
                if (comparePassword) {
                    await this.accountRepo.update(findAccount[0].username, true);
                    let payload = {
                        accountId: findAccount[0].accountId,
                        username: findAccount[0].username,
                        status: findAccount[0].status
                    };
                    let token = jsonwebtoken_1.default.sign(payload, auth_1.SECRET, {
                        expiresIn: 7 * 24 * 60 * 60 * 1000
                    });
                    return {
                        code: 200,
                        message: 'success',
                        data: {
                            token: token,
                            accountId: findAccount[0].accountId,
                            displayName: findAccount[0].displayName
                        }
                    };
                }
                else {
                    return {
                        code: 200,
                        message: "Wrong password"
                    };
                }
            }
        };
        this.logout = async (data) => {
            let findAccount = await this.accountRepo.findByUsername(data.username);
            await this.accountRepo.update(findAccount[0].username, false);
            return {
                code: 200,
                message: "Logout success"
            };
        };
        this.accountRepo = new accountRepo_1.AccountRepo();
        this.random = new random_1.Random();
    }
}
exports.LoginService = LoginService;
//# sourceMappingURL=login-service.js.map