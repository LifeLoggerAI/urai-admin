"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
function Login() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogin = () => {
        // In a real application, you would handle authentication with Firebase here.
        // For this example, we'll just simulate a login and redirect to the dashboard.
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Login"),
        react_1.default.createElement("button", { onClick: handleLogin }, "Log In")));
}
//# sourceMappingURL=Login.js.map