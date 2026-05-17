import axios from 'axios';

const api = axios.create({
    baseURL:"https://intervu-az8j.onrender.com/api",
    withCredentials:true
})

export const registerUser = async ({username,email,password}) => {
    try{
        const response = await api.post("/auth/register",
            {username,email,password}
        );
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
    
}
export const loginUser = async ({email,password}) => {
    try{
        const response = await api.post("/auth/login",
            {email,password}
        );
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        
    }
    
}
export const logoutUser = async () => {
    try{
        const response = await api.get("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
    
}

export const getUser = async () => {
    try{
        const response = await api.get("/auth/getme");
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        
    }
    
}

