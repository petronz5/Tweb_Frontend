import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

interface PaymentMethod {
    id: number;
    metodo_pagamento: string;
    importo: number;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const totalAmount = location.state?.totalAmount || 0;
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Per gestire l'invio del pagamento

    useEffect(() => {
        // Funzione per caricare i metodi di pagamento dal backend
        const fetchPaymentMethods = async () => {
            try {
                const response = await fetch(`http://localhost:8080/payment`, {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'no-cors',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const methods = await response.json();
                    setPaymentMethods(methods);
                } else {
                    console.error("Errore nel caricamento dei metodi di pagamento.");
                }
            } catch (error) {
                console.error("Errore nella richiesta:", error);
            }
        };
        fetchPaymentMethods();
    }, []);

    const handleSubmitPayment = async () => {
        if (!selectedMethod) {
            alert("Seleziona un metodo di pagamento.");
            return;
        }

        if (selectedMethod.importo < totalAmount) {
            alert("Saldo insufficiente per completare l'ordine.");
            return;
        }

        setIsSubmitting(true); // Disabilita il bottone durante l'invio della richiesta

        try {
            const response = await fetch(`http://localhost:8080/payment`, {
                method: 'PUT',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ metodo_pagamento: selectedMethod.metodo_pagamento, importo: totalAmount }),
                credentials: 'include',
            });

            if (response.ok) {
                alert("Pagamento effettuato con successo!");
                navigate('/'); // Reindirizza alla homepage o alla pagina degli ordini completati
            } else {
                console.error("Errore nel salvataggio del pagamento.");
                alert("Errore durante il pagamento. Riprova.");
            }
        } catch (error) {
            console.error("Errore nella richiesta di pagamento:", error);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsSubmitting(false); // Riabilita il bottone dopo la richiesta
        }
    };

    const handleCancel = () => {
        if (window.confirm("Sei sicuro di voler annullare il pagamento?")) {
            navigate(-1); // Torna alla pagina precedente
        }
    };

    return (
        <div className="payment-page">
            <h2>Pagamento</h2>
            <h3>Totale da pagare: €{totalAmount.toFixed(2)}</h3>
            <label>Seleziona il metodo di pagamento:</label>
            <div className="payment-options">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="payment-option">
                        <input
                            type="radio"
                            id={`method-${method.id}`}
                            name="paymentMethod"
                            value={method.metodo_pagamento}
                            onChange={() => setSelectedMethod(method)}
                            disabled={isSubmitting} // Disabilita i campi durante l'invio
                        />
                        <label htmlFor={`method-${method.id}`}>
                            {method.metodo_pagamento} - Importo disponibile: €{method.importo.toFixed(2)}
                        </label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmitPayment}
                disabled={!selectedMethod || isSubmitting} // Disabilita il bottone se non è selezionato un metodo o se è in invio
                className="confirm-button"
            >
                {isSubmitting ? "Elaborazione..." : "Conferma Pagamento"}
            </button>
            <button onClick={handleCancel} className="cancel-button">
                Annulla
            </button>
        </div>
    );
};

export default PaymentPage;
