import React from 'react';

const Avatar = ({ src, alt = "Avatar", role = 'professional', size = 48, className = '', style = {}, ...props }) => {

    const getShapeClass = (role) => {
        switch (role?.toLowerCase()) {
            case 'company':
                return 'avatar-square';
            case 'professor':
                return 'avatar-hexagon';
            case 'professional':
            default:
                return 'avatar-round';
        }
    };

    const shapeClass = getShapeClass(role);

    // Default styles for the image itself
    const baseStyle = {
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        display: 'block', // Removes bottom spacing in some contexts
        ...style
    };

    return (
        <img
            src={src || "https://via.placeholder.com/150"}
            alt={alt}
            className={`avatar ${shapeClass} ${className}`}
            style={baseStyle}
            {...props}
        />
    );
};

export default Avatar;
