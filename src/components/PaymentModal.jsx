import React from 'react';
import Icon from './Icon';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, courseTitle, price, itemType = 'Course' }) => {
    if (!isOpen) return null;

    const [selectedMethod, setSelectedMethod] = React.useState('card');
    const [processing, setProcessing] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    // Form states
    const [cardDetails, setCardDetails] = React.useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = React.useState('');
    const [selectedBank, setSelectedBank] = React.useState('');

    const handleConfirm = () => {
        setProcessing(true);
        // Mock payment processing
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
                // Reset states
                setSuccess(false);
                setProcessing(false);
            }, 2000);
        }, 2000);
    };

    const paymentMethods = [
        { id: 'card', name: 'Debit / Credit Card', icon: 'credit-card' },
        { id: 'upi', name: 'UPI', icon: 'smartphone' },
        { id: 'netbanking', name: 'Net Banking', icon: 'globe' }
    ];

    const renderPaymentForm = () => {
        switch (selectedMethod) {
            case 'card':
                return (
                    <div className="payment-form fade-in">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        />
                        <div className="form-row">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="CVV"
                                maxLength="3"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            />
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Cardholder Name"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        />
                    </div>
                );
            case 'upi':
                return (
                    <div className="payment-form fade-in">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter UPI ID (e.g. user@bank)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                        <p className="form-hint">A payment request will be sent to your UPI app.</p>
                    </div>
                );
            case 'netbanking':
                return (
                    <div className="payment-form fade-in">
                        <select
                            className="form-select"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                        >
                            <option value="">Select your Bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                {!success && !processing && (
                    <button className="close-btn" onClick={onClose}>
                        <Icon name="times" size={20} />
                    </button>
                )}

                {success ? (
                    <div className="payment-success-view">
                        <div className="success-icon-container">
                            <Icon name="check" size={40} color="#fff" />
                        </div>
                        <h2>Payment Successful!</h2>
                        <p>You have successfully paid for {courseTitle}.</p>
                        <p className="redirect-msg">Redirecting...</p>
                    </div>
                ) : processing ? (
                    <div className="payment-processing-view">
                        <div className="spinner"></div>
                        <h3>Processing Payment</h3>
                        <p>Please do not close this window...</p>
                    </div>
                ) : (
                    <>
                        <div className="payment-header">
                            <div className="icon-container">
                                <Icon name="lock-open" size={24} color="#fff" />
                            </div>
                            <h2>Unlock Full Access</h2>
                            <p>Get unlimited access to all modules and features</p>
                        </div>

                        <div className="order-summary">
                            <div className="summary-item">
                                <span>{itemType}</span>
                                <strong>{courseTitle}</strong>
                            </div>
                            <div className="summary-item total">
                                <span>Total Price</span>
                                <div className="price-tag">
                                    <span className="currency">₹</span>
                                    <span className="amount">{price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="payment-methods">
                            <h3>Select Payment Method</h3>
                            <div className="methods-grid">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.id}
                                        className={`method-item ${selectedMethod === method.id ? 'active' : ''}`}
                                        onClick={() => setSelectedMethod(method.id)}
                                    >
                                        <Icon name={method.icon} size={20} />
                                        <span>{method.name}</span>
                                        {selectedMethod === method.id && <Icon name="check-circle" className="check-icon" size={16} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {renderPaymentForm()}

                        <button className="confirm-pay-btn" onClick={handleConfirm}>
                            Proceed to Payment
                        </button>

                        <p className="secure-badge">
                            <Icon name="lock" size={12} /> Secure Payment
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
