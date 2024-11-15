import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './PaymentPage.css';

interface PaymentMethod {
    id: number;
    metodo_pagamento: string;
    importo: number;
    image_payment: string;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const totalAmount = location.state?.totalAmount || 0;
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await fetch(`http://localhost:8080/TitanCommerce/payment`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const methods = await response.json();
                    setPaymentMethods(methods);
                } else if (response.status === 401) {
                    alert("Sessione scaduta. Per favore, effettua nuovamente il login.");
                    navigate('/login');
                } else if (response.status === 404) {
                    alert("Metodi di pagamento non trovati.");
                } else {
                    console.error("Errore nel caricamento dei metodi di pagamento.");
                    alert("Errore nel caricamento dei metodi di pagamento. Riprova più tardi.");
                }
            } catch (error) {
                console.error("Errore nella richiesta:", error);
                alert("Errore di connessione. Riprova.");
            }
        };
        fetchPaymentMethods();
    }, [navigate]);

    const handleSubmitPayment = async () => {
        if (!selectedMethod) {
            alert("Seleziona un metodo di pagamento.");
            return;
        }

        if (selectedMethod.importo < totalAmount) {
            alert("Saldo insufficiente per completare l'ordine.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Aggiorna il saldo del metodo di pagamento
            const paymentResponse = await fetch(`http://localhost:8080/TitanCommerce/payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metodo_pagamento: selectedMethod.metodo_pagamento,
                    importo: selectedMethod.importo - totalAmount
                }),
                credentials: 'include',
            });

            if (paymentResponse.ok) {
                // Creazione di un nuovo ordine
                const orderResponse = await fetch('http://localhost:8080/TitanCommerce/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        total: totalAmount,
                        status: 'pending'
                    })
                });

                if (orderResponse.ok) {
                    alert("Pagamento effettuato e ordine creato con successo!");
                    navigate('/orders'); // Reindirizza alla pagina degli ordini
                } else {
                    alert("Errore durante la creazione dell'ordine. Riprova.");
                }
            } else {
                alert("Errore durante il pagamento. Riprova.");
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="payment-screen">
            <h3 className="payment-title">Totale da pagare: €{totalAmount.toFixed(2)}</h3>
            <div className="payment-container">
                <div className="payment-options">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className="payment-option"
                            onClick={() => setSelectedMethod(method)}
                            style={{
                                border: selectedMethod?.id === method.id ? '2px solid #FFA500' : '1px solid #ccc',
                            }}
                        >
                            <img src={method.image_payment} alt={method.metodo_pagamento} className="payment-icon" />
                            <label>
                                {method.metodo_pagamento} - Importo disponibile: €{method.importo.toFixed(2)}
                            </label>
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmitPayment} disabled={!selectedMethod || isSubmitting} className="confirm-button">
                    {isSubmitting ? "Elaborazione..." : "Conferma"}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
