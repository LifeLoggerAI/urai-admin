"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = useToast;
exports.toast = toast;
var React = require("react");
var TOAST_LIMIT = 1;
var TOAST_REMOVE_DELAY = 1000000;
var reducer = function (state, action) { switch (action.type) {
    case "ADD_TOAST": return __assign(__assign({}, state), { toasts: __spreadArray([action.toast], state.toasts, true).slice(0, TOAST_LIMIT) });
    case "UPDATE_TOAST": return __assign(__assign({}, state), { toasts: state.toasts.map(function (t) { return t.id === action.toast.id ? __assign(__assign({}, t), action.toast) : t; }) });
    case "DISMISS_TOAST": {
        var toastId_1 = action.toastId;
        if (toastId_1) {
            return __assign(__assign({}, state), { toasts: state.toasts.map(function (t) { return t.id === toastId_1 ? __assign(__assign({}, t), { open: false }) : t; }) });
        }
        else {
            return __assign(__assign({}, state), { toasts: state.toasts.map(function (t) { return (__assign(__assign({}, t), { open: false })); }) });
        }
    }
    case "REMOVE_TOAST": if (action.toastId) {
        return __assign(__assign({}, state), { toasts: state.toasts.filter(function (t) { return t.id !== action.toastId; }) });
    }
    else {
        return __assign(__assign({}, state), { toasts: [] });
    }
    default: return state;
} };
var listeners = [];
var memoryState = { toasts: [], options: { limit: TOAST_LIMIT, removeDelay: TOAST_REMOVE_DELAY } };
function dispatch(action) { memoryState = reducer(memoryState, action); listeners.forEach(function (listener) { listener(memoryState); }); }
function toast(props) { var id = Math.random().toString(36).substr(2, 9); var update = function (props) { return dispatch({ type: "UPDATE_TOAST", toast: __assign(__assign({}, props), { id: id }) }); }; var dismiss = function () { return dispatch({ type: "DISMISS_TOAST", toastId: id }); }; dispatch({ type: "ADD_TOAST", toast: __assign(__assign({}, props), { id: id, open: true, onOpenChange: function (open) { if (!open)
            dismiss(); } }) }); return { id: id, dismiss: dismiss, update: update }; }
function useToast() { var _a = React.useState(memoryState), state = _a[0], setState = _a[1]; React.useEffect(function () { listeners.push(setState); return function () { var index = listeners.indexOf(setState); if (index > -1) {
    listeners.splice(index, 1);
} }; }, [state]); return __assign(__assign({}, state), { toast: toast, dismiss: function (toastId) { return dispatch({ type: "DISMISS_TOAST", toastId: toastId }); } }); }
