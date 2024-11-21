import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../Cart/CartProvider.tsx';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    url_products: string;
    sconto: number;
}

interface UserDetails {
    role: string;
}

interface ProductDetailsProps {
    productId: number;
    onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack }) => {
    const isAuthenticated = !!sessionStorage.getItem('username');
    const [product, setProduct] = useState<Product | null>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate(); // Usa useNavigate per il reindirizzamento

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/TitanCommerce/products?id=${productId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 404) {
                    setError('Prodotto non trovato.');
                    return;
                } else if (response.status === 403) {
                    alert('Non sei autorizzato a visualizzare questo prodotto.');
                    navigate('/login'); // Reindirizza alla pagina di login
                    return;
                } else if (!response.ok) {
                    throw new Error(`Errore nel caricamento del prodotto: ${response.statusText}`);
                }

                const data: Product = await response.json();
                setProduct(data);
                setEditedProduct(data);
            } catch (err) {
                console.error('Errore nel caricamento del prodotto:', err);
                setError('Si è verificato un errore nel caricamento del prodotto.');
            }
        };

        fetchProduct();

        const isAuthenticated = !!sessionStorage.getItem('username');
        if (isAuthenticated) {
            // Recupera il ruolo dell'utente
            fetch('http://localhost:8080/TitanCommerce/profile', {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => {
                    if (response.status === 403) {
                        alert('Non sei autorizzato a visualizzare il profilo.');
                        navigate('/login');
                        return;
                    } else if (!response.ok) {
                        throw new Error(`Errore nel recupero del ruolo utente: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data: UserDetails) => {
                    if (data) {
                        setUserRole(data.role);
                    }
                })
                .catch(error => {
                    console.error('Errore nel recupero del ruolo utente:', error);
                    setUserRole('');
                });
        }
    }, [productId, navigate]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('Devi essere loggato per aggiungere al carrello');
            return;
        }

        if (product) {
            try {
                const cartItem = {
                    id: product.id,
                    product_id: product.id,
                    productName: product.name,
                    productPrice: product.price,
                    quantity: 1, // Puoi permettere all'utente di selezionare la quantità se necessario
                    description: product.description,
                    url_products: product.url_products,
                };

                await addToCart(cartItem);

                alert(`${product.name} è stato aggiunto al carrello!`);
            } catch (error) {
                console.error("Errore nell'aggiunta al carrello:", error);
                alert('Errore nell\'aggiunta al carrello.');
            }
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedProduct) {
            const { name, value } = e.target;
            setEditedProduct({
                ...editedProduct,
                [name]: name === 'price' || name === 'stock' || name === 'sconto' ? parseFloat(value) : value,
            });
        }
    };

    const handleSaveChanges = async () => {
        if (editedProduct) {
            try {
                const response = await fetch(`http://localhost:8080/TitanCommerce/products`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(editedProduct),
                });

                if (response.status === 403) {
                    alert('Non sei autorizzato ad aggiornare questo prodotto.');
                    navigate('/login');
                    return;
                } else if (response.status === 404) {
                    alert('Prodotto non trovato.');
                    return;
                } else if (!response.ok) {
                    throw new Error('Errore nell\'aggiornamento del prodotto.');
                }

                const updatedProduct: Product = await response.json();
                alert('Prodotto aggiornato con successo!');
                setIsEditing(false);
                setProduct(updatedProduct);
                setEditedProduct(updatedProduct);
            } catch (error) {
                console.error('Errore nell\'aggiornamento del prodotto:', error);
                alert('Errore nell\'aggiornamento del prodotto.');
            }
        }
    };

    const handleDeleteProduct = async () => {
        if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
            try {
                const response = await fetch(`http://localhost:8080/TitanCommerce/products?id=${productId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.status === 403) {
                    alert('Non sei autorizzato a eliminare questo prodotto.');
                    navigate('/login');
                    return;
                } else if (response.status === 404) {
                    alert('Prodotto non trovato.');
                    return;
                } else if (!response.ok) {
                    throw new Error('Errore nell\'eliminazione del prodotto');
                }

                alert('Prodotto eliminato con successo!');
                onBack();
            } catch (error) {
                console.error('Errore nell\'eliminazione del prodotto:', error);
                alert('Errore nell\'eliminazione del prodotto.');
            }
        }
    };

    if (error) {
        return (
            <div className="product-details-container">
                <button className="back-button" onClick={onBack}>
                    Torna alla lista
                </button>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-container">
                <button className="back-button" onClick={onBack}>
                    Torna alla lista
                </button>
                <p>Caricamento del prodotto...</p>
            </div>
        );
    }

    // Calcolo del prezzo scontato
    const prezzoScontato = product.sconto > 0
        ? product.price - (product.price * product.sconto / 100)
        : product.price;

    return (
        <div className="product-details-container">
            <button className="back-button" onClick={onBack}>
                Torna alla lista
            </button>
            <div className="product-details">
                <div className="left-column">
                    <img src={product.url_products} alt={product.name} className="product-image-details" />
                </div>
                <div className="right-column">
                    {isEditing && editedProduct ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Nome:</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={editedProduct.name}
                                    onChange={handleInputChange}
                                    className="edit-input product-title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Prezzo:</label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={editedProduct.price}
                                    onChange={handleInputChange}
                                    className="edit-input product-price"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sconto">Sconto:</label>
                                <input
                                    id="sconto"
                                    type="number"
                                    name="sconto"
                                    value={editedProduct.sconto}
                                    onChange={handleInputChange}
                                    className="edit-input product-sconto-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock">Quantità:</label>
                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    value={editedProduct.stock}
                                    onChange={handleInputChange}
                                    className="edit-input product-stock-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Descrizione:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editedProduct.description}
                                    onChange={handleInputChange}
                                    className="edit-textarea product-description"
                                />
                            </div>
                            <button className="save-button" onClick={handleSaveChanges}>
                                Salva Modifiche
                            </button>
                            <button className="cancel-button" onClick={handleEditToggle}>
                                Annulla
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-price">
                                {product.sconto > 0 ? (
                                    <>
                                        <span className="prezzo-originale">€ {product.price.toFixed(2)}</span>
                                        <span className="prezzo-scontato">€ {prezzoScontato.toFixed(2)}</span>
                                        <span className="sconto-etichetta">Sconto {product.sconto}%</span>
                                    </>
                                ) : (
                                    <span>€ {product.price.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="product-stock">
                                Unità disponibili: {product.stock}
                            </div>
                            <button
                                className="add-to-cart-button"
                                onClick={handleAddToCart}
                                disabled={!isAuthenticated || product.stock === 0}
                                title={!isAuthenticated ? 'Devi essere loggato per aggiungere al carrello' : ''}
                            >
                                Aggiungi al carrello
                                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                            </button>
                            <div className="product-description">
                                <h2>Descrizione</h2>
                                <p>{product.description}</p>
                            </div>
                            {userRole === 'admin' && (
                                <div className="admin-buttons">
                                    <button className="edit-button" onClick={handleEditToggle}>
                                        <FontAwesomeIcon icon={faPencilAlt} className="icon-left" />
                                        Modifica Prodotto
                                    </button>
                                    <button className="delete-button" onClick={handleDeleteProduct}>
                                        <FontAwesomeIcon icon={faTrash} className="icon-left" />
                                        Elimina Prodotto
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
