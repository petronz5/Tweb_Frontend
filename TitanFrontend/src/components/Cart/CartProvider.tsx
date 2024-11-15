// CartProvider.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';

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
    addToCart: (product: CartItem) => Promise<void>;
    removeFromCart: (product_id: number) => Promise<void>;
    clearCart: () => Promise<void>;
    updateQuantity: (product_id: number, quantity: number) => Promise<void>;
    loggedIn: boolean; // Aggiunto
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
    const [loggedIn, setLoggedIn] = useState<boolean>(false); // Aggiunto
    //const navigate = useNavigate();

    const addToCart = async (product: CartItem) => {
        if (!loggedIn) {
            alert("Devi effettuare il login prima di aggiungere oggetti al carrello.");
            return;
        }

        console.log("Prodotto aggiunto al carrello:", product);

        try {
            // Aggiorna lo stato locale del carrello
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

            const response = await fetch(`http://localhost:8080/TitanCommerce/usercart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: product.id, quantity: product.quantity }),
                credentials: 'include',
            });

            if (response.status === 401 || response.status === 405) { // Gestione 405 come 401
                alert('Sessione scaduta o metodo non consentito. Per favore, effettua nuovamente il login.');
                setLoggedIn(false);
                // navigate('/login');
                return;
            } else if (!response.ok) {
                const errorText = await response.text();
                console.error(`Errore durante l'aggiunta del prodotto al carrello: ${errorText}`);
                throw new Error(`Errore durante l'aggiunta del prodotto al carrello: ${response.status}`);
            }

            console.log("Prodotto aggiunto al carrello con successo nel backend.");

        } catch (error) {
            console.error("Errore nell'aggiornamento del carrello:", error);
            throw error;
        }
    };

    const removeFromCart = async (product_id: number) => {
        if (!loggedIn) {
            alert("Devi effettuare il login prima di rimuovere oggetti dal carrello.");
            return;
        }

        console.log("Rimozione prodotto dal carrello con product_id:", product_id);

        try {
            const response = await fetch(`http://localhost:8080/TitanCommerce/usercart?product_id=${product_id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.status === 401 || response.status === 405) { // Gestione 405 come 401
                alert('Sessione scaduta o metodo non consentito. Per favore, effettua nuovamente il login.');
                setLoggedIn(false);
                //navigate('/login');
                return;
            } else if (response.status === 404) {
                alert('Articolo non trovato nel carrello.');
                return;
            } else if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore durante la rimozione del prodotto: ${errorText}`);
            }

            // Aggiorna lo stato locale del carrello
            setCart((prevCart) => prevCart.filter((item) => item.product_id !== product_id));

            console.log("Prodotto rimosso dal carrello con successo.");
        } catch (error) {
            console.error("Errore nella rimozione del prodotto:", error);
            throw error;
        }
    };

    const updateQuantity = async (product_id: number, quantity: number) => {
        if (!loggedIn) {
            alert("Devi effettuare il login prima di aggiornare la quantità degli oggetti nel carrello.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/TitanCommerce/usercart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id, quantity }),
                credentials: 'include',
            });

            if (response.status === 401 || response.status === 405) { // Gestione 405 come 401
                alert('Sessione scaduta o metodo non consentito. Per favore, effettua nuovamente il login.');
                setLoggedIn(false);
                //navigate('/login');
                return;
            } else if (response.status === 404) {
                alert('Articolo non trovato nel carrello.');
                return;
            } else if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore nell'aggiornamento della quantità: ${errorText}`);
            }

            // Aggiorna lo stato locale del carrello
            setCart((prevCart) =>
                prevCart.map((item) => (item.product_id === product_id ? { ...item, quantity } : item))
            );

            console.log("Quantità aggiornata con successo.");
        } catch (error) {
            console.error("Errore nell'aggiornamento della quantità:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        if (!loggedIn) {
            alert("Devi effettuare il login prima di svuotare il carrello.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/TitanCommerce/usercart`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.status === 401 || response.status === 405) { // Gestione 405 come 401
                alert('Sessione scaduta o metodo non consentito. Per favore, effettua nuovamente il login.');
                setLoggedIn(false);
                //navigate('/login');
                return;
            } else if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore nel cancellare il carrello: ${errorText}`);
            }

            setCart([]); // Cancella il carrello solo se il backend risponde con successo

            console.log("Carrello svuotato con successo.");
        } catch (error) {
            console.error("Errore nel cancellare il carrello:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:8080/TitanCommerce/usercart`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.status === 401 || response.status === 405) { // Gestione 405 come 401
                    alert('Sessione scaduta o metodo non consentito. Per favore, effettua nuovamente il login.');
                    setLoggedIn(false);
                    return;
                } else if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Errore nel caricamento del carrello: ${errorText}`);
                }

                const data: CartItem[] = await response.json();

                console.log("Dati caricati dal backend:", data);

                const validData = data.map(item => ({
                    ...item,
                    quantity: item.quantity ?? 1, // Assicurati che la quantità sia sempre definita
                    // price: item.productPrice ?? 0, // Rimuovi se non necessario
                    // name: item.productName ?? "Prodotto Sconosciuto", // Rimuovi se non necessario
                    // url_products: item.url_products ?? "", // Rimuovi se non necessario
                    // description: item.description ?? "" // Rimuovi se non necessario
                }));

                setCart(validData);
                setLoggedIn(true); // Utente autenticato
            } catch (error) {
                console.error("Errore nel caricamento del carrello:", error);
                // Puoi gestire l'errore qui se necessario
            }
        };

        fetchCart(); // Errore in chiamata da Home da gestire
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, loggedIn }}>
            {children}
        </CartContext.Provider>
    );
};
