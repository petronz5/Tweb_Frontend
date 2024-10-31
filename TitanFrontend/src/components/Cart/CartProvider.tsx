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
    description: string;
    url_products: string;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: { quantity: number; price: number; name: string; id: number }) => void;
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

    const addToCart = (product: CartItem) => {
        // Verifica se il prodotto è già nel carrello
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                prevCart.push(product);
            }
            return [...prevCart];
        });

        // Invia la richiesta al backend per aggiungere o aggiornare il prodotto nel carrello
        const requestBody = {
            userId,                 // Aggiungi l'ID utente
            productId: product.id,  // Usa l'ID del prodotto
            quantity: product.quantity  // Usa la quantità dell'elemento
        };

        fetch(`http://localhost:8080/TitanCommerce/usercart?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),  // Invio dei dati al backend
            credentials: 'include',
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
                console.log(data);
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
