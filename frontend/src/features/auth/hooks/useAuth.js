import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { loginUser, registerUser, getUser, logoutUser } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error("Login failed:", err);
           
            return { success: false, error: err.response?.data?.error || "Login failed" };
        } finally {
            setLoading(false);
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await registerUser({ username, email, password });
            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error("Registration failed:", err);
            // Return error message for UI feedback
            return { success: false, error: err.response?.data?.error || "Registration failed" };
        } finally {
            setLoading(false);
        }
    }
    const handleLogout = async () => {
        setLoading(true);
        await logoutUser();
        setUser(null);
        setLoading(false);
    }
    

    useEffect(()=>{
        const getAndSetUser = async() =>{
           
            try {
                const data = await getUser();
                setUser(data.user);
            } catch (error) {
                
                console.log("Error fetching user:", error.message);
                
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();
    },[]) 

    return { user, loading, handleLogin, handleRegister, handleLogout }
}