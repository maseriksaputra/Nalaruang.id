import React from 'react';

export const PaymentProviders = {
    BANK: [
        { id: 'bca', name: 'BCA' },
        { id: 'mandiri', name: 'Mandiri' },
        { id: 'bni', name: 'BNI' },
        { id: 'bri', name: 'BRI' },
        { id: 'bsi', name: 'BSI' },
        { id: 'cimb', name: 'CIMB Niaga' },
        { id: 'permata', name: 'Permata' },
        { id: 'jenius', name: 'Jenius' },
        { id: 'seabank', name: 'SeaBank' },
        { id: 'jago', name: 'Bank Jago' }
    ],
    EWALLET: [
        { id: 'dana', name: 'DANA' },
        { id: 'ovo', name: 'OVO' },
        { id: 'gopay', name: 'GoPay' },
        { id: 'shopeepay', name: 'ShopeePay' },
        { id: 'linkaja', name: 'LinkAja' }
    ]
};

export const PaymentLogo = ({ provider, className = "h-6" }) => {
    const p = (provider || '').toLowerCase();
    
    // Fallback if not matched
    const Fallback = () => (
        <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="20" fontSize="18" fontWeight="bold" fill="currentColor" textAnchor="middle">{provider || 'BANK'}</text>
        </svg>
    );

    switch(p) {
        case 'bca':
            return (
                <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10 C 25 10, 25 20, 15 20 Z" fill="#003399"/>
                    <path d="M15 20 C 5 20, 5 30, 15 30 Z" fill="#FF9900"/>
                    <text x="35" y="28" fontSize="28" fontWeight="900" fontStyle="italic" fill="#003399" fontFamily="Arial, sans-serif">BCA</text>
                </svg>
            );
        case 'mandiri':
            return (
                <svg className={className} viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="10" width="8" height="20" fill="#FFB700" />
                    <rect x="18" y="10" width="8" height="20" fill="#003D79" />
                    <text x="35" y="28" fontSize="24" fontWeight="bold" fill="#003D79" fontFamily="Arial, sans-serif">mandiri</text>
                </svg>
            );
        case 'bni':
            return (
                <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="28" fontSize="28" fontWeight="900" fontStyle="italic" fill="#005E6A" fontFamily="Arial, sans-serif">BNI</text>
                    <path d="M55 30 L 95 30 L 85 34 L 45 34 Z" fill="#F15A24"/>
                </svg>
            );
        case 'bri':
            return (
                <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="28" fontSize="28" fontWeight="900" fill="#00529C" fontFamily="Arial, sans-serif">BRI</text>
                    <path d="M5 32 Q 50 40 95 32" fill="none" stroke="#F37021" strokeWidth="3"/>
                </svg>
            );
        case 'bsi':
            return (
                <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="30" y="28" fontSize="24" fontWeight="bold" fill="#00A29C" fontFamily="Arial, sans-serif">BSI</text>
                    <circle cx="15" cy="20" r="10" fill="#F37021" />
                    <circle cx="15" cy="20" r="6" fill="#FFFFFF" />
                </svg>
            );
        case 'cimb':
        case 'cimb niaga':
            return (
                <svg className={className} viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="28" fontSize="22" fontWeight="900" fill="#7A0026" fontFamily="Arial, sans-serif">CIMB NIAGA</text>
                </svg>
            );
        case 'dana':
            return (
                <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="15" fill="#118EEA" />
                    <path d="M14 12 L 20 12 C 25 12, 28 15, 28 20 C 28 25, 25 28, 20 28 L 14 28 Z" fill="white" />
                    <path d="M18 16 L 20 16 C 22 16, 24 17, 24 20 C 24 23, 22 24, 20 24 L 18 24 Z" fill="#118EEA" />
                    <text x="45" y="28" fontSize="26" fontWeight="bold" fill="#118EEA" fontFamily="Arial, sans-serif">DANA</text>
                </svg>
            );
        case 'ovo':
            return (
                <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="30" fontSize="28" fontWeight="900" fill="#4C3494" fontFamily="Arial, sans-serif">OVO</text>
                </svg>
            );
        case 'gopay':
            return (
                <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="12" fill="#00AED6" />
                    <text x="40" y="28" fontSize="24" fontWeight="bold" fill="#00AED6" fontFamily="Arial, sans-serif">gopay</text>
                </svg>
            );
        case 'shopeepay':
            return (
                <svg className={className} viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="28" fontSize="24" fontWeight="bold" fill="#EE4D2D" fontFamily="Arial, sans-serif">ShopeePay</text>
                </svg>
            );
        case 'linkaja':
            return (
                <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="10" width="20" height="20" rx="4" fill="#E31837" />
                    <text x="35" y="28" fontSize="24" fontWeight="900" fill="#E31837" fontFamily="Arial, sans-serif">LinkAja</text>
                </svg>
            );
        default:
            return <Fallback />;
    }
};

export const ChipIcon = ({ className = "w-10 h-8" }) => (
    <svg className={className} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="30" rx="4" fill="#EAB308"/>
        <path d="M 10 0 L 10 30 M 20 0 L 20 30 M 30 0 L 30 30" stroke="#CA8A04" strokeWidth="1"/>
        <path d="M 0 10 L 40 10 M 0 20 L 40 20" stroke="#CA8A04" strokeWidth="1"/>
        <rect x="12" y="8" width="16" height="14" rx="2" fill="#FEF08A"/>
    </svg>
);
