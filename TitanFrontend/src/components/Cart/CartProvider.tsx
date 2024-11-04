import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

// Definisci le interfacce per il carrello
interface CartProviderProps {
    children: ReactNode;
}

interface CartItem {
    id: number;
    name: string;
    price: number | undefined; // Modifica: prezzo potrebbe essere undefined
    quantity: number;
    description: string;
    url_products: string;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    submitOrder: () => void;
    updateQuantity: (id: number, quantity: number) => void;
}

// Crea il contesto per il carrello
export const CartContext = createContext<CartContextProps | undefined>(undefined);

// Custom hook per accedere al contesto del carrello
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const userId = 1;  // Cambia con la gestione reale dell'utente

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                prevCart.push(product);
            }
            return [...prevCart];
        });

        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId: product.id, quantity: product.quantity }),
            credentials: 'include',
        }).catch(error => console.error("Errore nell'aggiornamento del carrello:", error));
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));

        fetch(`http://localhost:8080/TitanCommerce/usercart?userId=${userId}&productId=${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).catch(error => console.error("Errore nella rimozione del prodotto:", error));
    };

    const updateQuantity = (id: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );

        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId: id, quantity }),
            credentials: 'include',
        }).catch(error => console.error("Errore nell'aggiornamento della quantità:", error));
    };

    const clearCart = () => {
        setCart([]);

        fetch(`http://localhost:8080/TitanCommerce/usercart?userId=${userId}`, {
            method: 'DELETE',
            credentials: 'include',
        }).catch(error => console.error("Errore nel cancellare il carrello:", error));
    };

    const submitOrder = () => {
        const newOrder = {
            userId: userId,
            items: cart,
            status: 'pending'
        };

        fetch('http://localhost:8080/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                clearCart();
            } else {
                throw new Error("Errore nella creazione dell'ordine");
            }
        }).catch(error => console.error("Errore nella creazione dell'ordine:", error));
    };

    useEffect(() => {
        fetch(`http://localhost:8080/TitanCommerce/usercart?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: CartItem[]) => {
                console.log('Dati caricati:', data);
                const validData = data.map(item => ({
                    ...item,
                    price: item.price ?? 0, // Imposta un prezzo di default se `price` è undefined o null
                }));
                setCart(validData);
            })
            .catch(error => console.error("Errore nel caricamento del carrello:", error));
    }, [userId]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, submitOrder, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
