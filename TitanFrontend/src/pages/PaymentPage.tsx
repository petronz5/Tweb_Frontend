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
                    // Gestione dell'errore 401 Unauthorized
                    alert("Sessione scaduta. Per favore, effettua nuovamente il login.");
                    navigate('/login');
                } else if (response.status === 404) {
                    // Gestione dell'errore 404 Not Found
                    alert("Metodi di pagamento non trovati.");
                } else {
                    // Gestione di altri errori
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
            const response = await fetch(`http://localhost:8080/TitanCommerce/payment`, {
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

            if (response.ok) {
                alert("Pagamento effettuato con successo!");
                navigate('/');
            } else if (response.status === 401) {
                // Gestione dell'errore 401 Unauthorized
                alert("Sessione scaduta. Per favore, effettua nuovamente il login.");
                navigate('/login');
            } else if (response.status === 404) {
                // Gestione dell'errore 404 Not Found
                alert("Metodo di pagamento non trovato o saldo insufficiente.");
            } else {
                // Gestione di altri errori
                alert("Errore durante il pagamento. Riprova.");
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReloadAmount = async () => {
        if (!selectedMethod) {
            alert("Seleziona un metodo di pagamento da ricaricare.");
            return;
        }

        const reloadAmount = parseFloat(prompt("Inserisci l'importo da ricaricare:") || '0');
        if (reloadAmount <= 0) {
            alert("Importo non valido.");
            return;
        }

        try {
            await fetch(`http://localhost:8080/TitanCommerce/payment/reload`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metodo_pagamento: selectedMethod.metodo_pagamento,
                    importo: selectedMethod.importo + reloadAmount
                }),
                credentials: 'include',
            });

            alert("Ricarica effettuata con successo!");
            setSelectedMethod({ ...selectedMethod, importo: selectedMethod.importo + reloadAmount });
        } catch (error) {
            alert("Errore durante la ricarica. Riprova.");
        }
    };

    const handleCancel = () => {
        if (window.confirm("Sei sicuro di voler annullare il pagamento?")) {
            navigate(-1);
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
                <div className="payment-buttons">
                    <button onClick={handleSubmitPayment} disabled={!selectedMethod || isSubmitting} className="confirm-button">
                        {isSubmitting ? "Elaborazione..." : "Conferma"}
                    </button>
                    <button onClick={handleReloadAmount} disabled={!selectedMethod} className="reload-button">
                        Ricarica
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
