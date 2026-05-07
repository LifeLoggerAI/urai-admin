'use client';
import { createContext, useContext } from 'react';
var AuthContext = createContext({ user: null, loading: true });
export var useAuth = function () { return useContext(AuthContext); };
export { AuthContext };
