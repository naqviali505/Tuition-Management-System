import { useReducer,createContext,useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// initial state
const initialState = {
    user: null,
};
// create context
const Context = createContext();
// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        default:
            return state;
    }
};
// context provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const router = useRouter();
    useEffect(() => {
        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem("user")),
        });
    }, []);
    axios.interceptors.response.use(function (response) 
    {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error)
    {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        let res=error.response;
        
        if(res && res.status===401 && res.cofig && !res.cofig.__isRetryRequest)
        {
            return new Promise((resolve,reject)=>
            {
                axios.get("/api/logout")
                .then((data)=>
                {
                    console.log("/401 error > logout");
                    dispatch({type:"LOGOUT"});
                    window.localStorage.removeItem("user");
                    router.push("/login");
                    resolve(data)
                    
                })
                .catch((err)=>
                {
                    console.log("AXIOS INTERCEPTORS ERR",err);
                    reject(error);
                }
                );
            });
        }

        return Promise.reject(error);
    });
    
    useEffect(() => 
    {
        const getCsrfToken = async () => 
        {
            const { data } = await axios.get("/api/csrf-token");
            //console.log("CSRF", data);
            axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
        };
        getCsrfToken();
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
}
// export
export { Context, Provider };
