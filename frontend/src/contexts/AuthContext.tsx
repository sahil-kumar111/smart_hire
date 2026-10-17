import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";

import {
    login as loginService,
    getCurrentUser,
} from "../services/authService";

import type { LoginData } from "../services/authService";

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (data: LoginData) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider(
    {
        children,
    }: {
        children: ReactNode;
    }
) {

    const [user, setUser] = useState<User | null>(null);

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    async function login(data: LoginData) {
        const response = await loginService(data);
        const accessToken = response.access_token;
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
        const currentUser = await getCurrentUser(accessToken);
        setUser(currentUser);
        return currentUser; 
    }

    function logout() {

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);
    }

    useEffect(() => {

        async function loadUser() {

            if (!token) {

                setLoading(false);

                return;
            }

            try {

                const currentUser =
                    await getCurrentUser(token);

                setUser(currentUser);

            }

            catch {

                logout();

            }

            finally {

                setLoading(false);

            }

        }

        loadUser();

    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;

}