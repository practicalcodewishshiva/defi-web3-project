import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { food_list as staticFoodList } from "../../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token,setToken] = useState("");

    const [food_list, setFoodList] = useState(staticFoodList);

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const current = prev || {};
            const currentQty = current[itemId] || 0;
            return { ...current, [itemId]: currentQty + 1 };
        });
        if(token){
            await axios.post(url+'/api/cart/add',{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const current = prev || {};
            const currentQty = current[itemId] || 0;
            return { ...current, [itemId]: Math.max(currentQty - 1, 0) };
        });
        if(token){
            await axios.post(url+'/api/cart/remove',{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        if (!cartItems || !food_list || food_list.length === 0) return 0;

        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    }

    const fetchFoodList = async () =>{
        try{
            const response = await axios.get(url+"/api/food/list");
            if(response.data && response.data.success && Array.isArray(response.data.data)){
                setFoodList(response.data.data);
            }else{
                setFoodList(staticFoodList);
            }
        }catch(err){
            console.log(err);
            setFoodList(staticFoodList);
        }
    }

    const loadCartData = async (token) =>{
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            if (response.data && response.data.success && response.data.cartData) {
                setCartItems(response.data.cartData);
            } else {
                setCartItems({});
            }
        } catch (error) {
            console.log(error);
            setCartItems({});
        }
    }

    useEffect(()=>{
        
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;