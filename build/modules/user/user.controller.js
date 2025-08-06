"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("../../core/base-controller"));
const types_1 = require("../../core/types");
class UserController extends base_controller_1.default {
    constructor() {
        super(...arguments);
        this.path = 'users';
        this.routes = [
            {
                path: '/',
                method: types_1.HTTP_METHODS.GET,
                handler: this.getUsers,
                localMiddleware: [],
            },
            {
                path: '/',
                method: types_1.HTTP_METHODS.POST,
                handler: this.createUser,
                localMiddleware: [],
            },
        ];
    }
    getUsers(req, res) {
        res.send('List of users ');
    }
    createUser(req, res) {
        res.send('User Created');
    }
}
exports.default = UserController;
