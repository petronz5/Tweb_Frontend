import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

// Definisci le interfacce per il carrello
interface CartProviderProps {
    children: ReactNode;
}

interface CartItem {
    id: number;
    product_id: number;
    productName: string;
    productPrice: number;
    quantity: number;
    description: string;
    url_products: string;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (product_id: number) => void;
    clearCart: () => void;
    submitOrder: () => void;
    updateQuantity: (product_id: number, quantity: number) => void;
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

    const addToCart = (product: CartItem) => {
        console.log("Prodotto aggiunto al carrello:", product);

        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            } else {
                return [...prevCart, product];
            }
        });

        console.log("Dati inviati al server per aggiornare il carrello:", { productId: product.id, quantity: product.quantity });

        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: product.id, quantity: product.quantity }),
            credentials: 'include',
        }).catch(error => console.error("Errore nell'aggiornamento del carrello:", error));
    };

    const removeFromCart = (product_id: number) => {
        console.log("Rimozione prodotto dal carrello con product_id:", product_id);

        setCart((prevCart) => prevCart.filter((item) => item.product_id !== product_id));

        fetch(`http://localhost:8080/TitanCommerce/usercart?product_id=${product_id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Errore durante la rimozione del prodotto con product_id: ${product_id} - Status: ${response.status}`);
                }
                console.log("Prodotto rimosso dal carrello con successo.");
            })
            .catch(error => console.error("Errore nella rimozione del prodotto:", error));
    };

    const updateQuantity = (product_id: number, quantity: number) => {
        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id, quantity }),
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    // Aggiorna immediatamente lo stato del carrello in React
                    setCart((prevCart) =>
                        prevCart.map((item) => (item.product_id === product_id ? { ...item, quantity } : item))
                    );
                } else {
                    console.error("Errore nell'aggiornamento della quantità sul server.");
                }
            })
            .catch(error => console.error("Errore nell'aggiornamento della quantità:", error));
    };


    const clearCart = () => {
        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    setCart([]); // Cancella il carrello solo se il backend risponde con successo
                } else {
                    throw new Error("Errore nel cancellare il carrello");
                }
            })
            .catch(error => console.error("Errore nel cancellare il carrello:", error));
    };

    const submitOrder = () => {
        const newOrder = {
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
        fetch(`http://localhost:8080/TitanCommerce/usercart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: CartItem[]) => {
                console.log("Dati caricati dal backend:", data);
                const validData = data.map(item => ({
                    ...item,
                    quantity: item.quantity ?? 1, // Assicurati che la quantità sia sempre definita
                    price: item.productPrice ?? 0,
                    name: item.productName ?? "Prodotto Sconosciuto"
                }));
                setCart(validData);
            })
            .catch(error => console.error("Errore nel caricamento del carrello:", error));
    }, []);


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, submitOrder, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
