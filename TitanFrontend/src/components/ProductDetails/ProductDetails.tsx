import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

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
    product: Product;
    onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
    const [userRole, setUserRole] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);

    // Calcolo del prezzo scontato
    const prezzoScontato = product.sconto > 0
        ? product.price - (product.price * product.sconto / 100)
        : product.price;

    useEffect(() => {
        setEditedProduct(product);

        // Recupera il ruolo dell'utente
        fetch('http://localhost:8080/TitanCommerce/profile', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data: UserDetails) => {
                setUserRole(data.role);
            })
            .catch(error => console.error('Errore nel recupero del ruolo utente:', error));
    }, [product]);

    const handleAddToCart = () => {
        alert(`${product.name} è stato aggiunto al carrello!`);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedProduct) {
            const { name, value } = e.target;
            setEditedProduct({
                ...editedProduct,
                [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
            });
        }
    };

    const handleSaveChanges = () => {
        if (editedProduct) {
            fetch(`http://localhost:8080/TitanCommerce/products`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editedProduct),
            })
                .then(response => response.json())
                .then(() => {
                    alert('Prodotto aggiornato con successo!');
                    setIsEditing(false);
                })
                .catch(error => console.error('Errore nell\'aggiornamento del prodotto:', error));
        }
    };

    const handleDeleteProduct = () => {
        if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
            fetch(`http://localhost:8080/TitanCommerce/products?id=${product.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nell\'eliminazione del prodotto');
                    }
                    alert('Prodotto eliminato con successo!');
                    onBack();
                })
                .catch(error => console.error('Errore nell\'eliminazione del prodotto:', error));
        }
    };

    return (
        <div className="product-details-container">
            <button className="back-button" onClick={onBack}>
                Torna alla lista
            </button>
            <div className="product-details">
                <div className="left-column">
                    <img src={product.url_products} alt={product.name} className="product-image" />
                </div>
                <div className="right-column">
                    {isEditing && editedProduct ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={editedProduct.name}
                                onChange={handleInputChange}
                                className="edit-input product-title"
                            />
                            <input
                                type="number"
                                name="price"
                                value={editedProduct.price}
                                onChange={handleInputChange}
                                className="edit-input product-price"
                            />
                            <input
                                type="number"
                                name="sconto"
                                value={editedProduct.sconto}
                                onChange={handleInputChange}
                                className="edit-input product-sconto-input"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={editedProduct.stock}
                                onChange={handleInputChange}
                                className="edit-input product-stock-input"
                            />
                            <textarea
                                name="description"
                                value={editedProduct.description}
                                onChange={handleInputChange}
                                className="edit-textarea product-description"
                            />
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
                                disabled={product.stock === 0}
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
