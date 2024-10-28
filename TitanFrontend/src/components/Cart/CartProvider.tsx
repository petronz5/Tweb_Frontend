import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

// Definisci le interfacce per il carrello
interface CartProviderProps {
    children: ReactNode;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    submitOrder: () => void;  // Aggiungi funzione per inviare l'ordine
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

    // Recupera l'ID utente (lo supponiamo già presente, ad esempio in sessione o tramite login)
    const userId = 1;  // Cambia con la gestione reale dell'utente

    // Funzione per aggiungere un prodotto al carrello
    const addToCart = (product: CartItem) => {
        // Aggiungi il prodotto al carrello locale
        setCart((prevCart) => [...prevCart, product]);

        // Invia la richiesta al backend per aggiungere il prodotto al carrello
        fetch(`http://localhost:8080/usercart?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
            credentials: 'include',  // Se stai usando sessioni
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nell'aggiornamento del carrello");
                }
            })
            .catch(error => {
                console.error("Errore nell'aggiornamento del carrello:", error);
            });
    };

    // Funzione per rimuovere un prodotto dal carrello
    const removeFromCart = (id: number) => {
        // Rimuovi il prodotto dal carrello locale
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));

        // Invia la richiesta al backend per rimuovere il prodotto dal carrello
        fetch(`http://localhost:8080/usercart?userId=${userId}&productId=${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nella rimozione del prodotto");
                }
            })
            .catch(error => {
                console.error("Errore nella rimozione del prodotto:", error);
            });
    };

    // Funzione per svuotare il carrello
    const clearCart = () => {
        // Svuota il carrello locale
        setCart([]);

        // Potresti voler inviare una richiesta per rimuovere tutti i prodotti
        // (Implementa la logica di backend per gestire questo caso, se necessario)
    };

    // Funzione per inviare l'ordine
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
        })
            .then(response => {
                if (response.ok) {
                    clearCart();  // Svuota il carrello dopo l'ordine
                } else {
                    throw new Error("Errore nella creazione dell'ordine");
                }
            })
            .catch(error => {
                console.error("Errore nella creazione dell'ordine:", error);
            });
    };

    // Funzione per caricare il carrello dell'utente dal backend al caricamento della pagina
    useEffect(() => {
        fetch(`http://localhost:8080/usercart?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: CartItem[]) => {
                setCart(data);
            })
            .catch(error => {
                console.error("Errore nel caricamento del carrello:", error);
            });
    }, [userId]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, submitOrder }}>
            {children}
        </CartContext.Provider>
    );
};
