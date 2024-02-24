"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestEnvironment = void 0;
const isTestEnvironment = () => {
    if (typeof window !== 'undefined' && typeof window === 'object') {
        return false;
    }
    else {
        return true;
    }
};
exports.isTestEnvironment = isTestEnvironment;
