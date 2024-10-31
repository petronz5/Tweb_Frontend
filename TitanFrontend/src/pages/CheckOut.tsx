import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout: React.FC = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const navigate = useNavigate();

    // Lista dei metodi di pagamento disponibili con icone
    const paymentMethods = [
        { id: 'creditCard', label: 'Carta di Credito/Debito', icon: 'far fa-credit-card' },
        { id: 'paypal', label: 'PayPal', icon: 'fab fa-paypal' },
        { id: 'bankTransfer', label: 'Bonifico Bancario', icon: 'fas fa-university' },
        { id: 'cashOnDelivery', label: 'Contrassegno', icon: 'fas fa-truck' },
    ];

    // Gestisce la selezione del metodo di pagamento
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(e.target.value);
    };

    // Gestisce il clic sul pulsante di pagamento
    const handlePaymentClick = () => {
        if (selectedPaymentMethod) {
            // Logica per processare il pagamento (se necessario)
            console.log('Metodo di pagamento selezionato:', selectedPaymentMethod);
            // Reindirizza alla home page
            navigate('/');
        } else {
            alert('Per favore, seleziona un metodo di pagamento.');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Completa il tuo acquisto</h2>
            <div className="checkout-content">
                {/* Sezione Riepilogo Ordine */}
                <div className="order-summary">
                    <h3>Riepilogo Ordine</h3>
                    {/* Qui puoi inserire il riepilogo dinamico degli articoli */}
                    <div className="order-items">
                        <div className="item">
                            <span>Prodotto 1</span>
                            <span>€50,00</span>
                        </div>
                        <div className="item">
                            <span>Prodotto 2</span>
                            <span>€30,00</span>
                        </div>
                        <div className="item total">
                            <strong>Totale</strong>
                            <strong>€80,00</strong>
                        </div>
                    </div>
                </div>

                {/* Sezione Metodo di Pagamento */}
                <div className="payment-section">
                    <div className="payment-methods">
                        <h3>Metodo di Pagamento</h3>
                        <form>
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="payment-option">
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={selectedPaymentMethod === method.id}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        <span className="radio-custom">
                                            <i className={method.icon}></i>
                                        </span>
                                        {method.label}
                                    </label>
                                </div>
                            ))}
                        </form>
                    </div>
                    <button className="pay-button" onClick={handlePaymentClick}>
                        Conferma e Paga
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
