import React, { useState, useRef, useEffect } from 'react';
import { featureTooltips } from '../../services/mockData';
import './FeatureTooltip.css';

const FeatureTooltip = ({ 
    children, 
    featureKey, 
    placement = 'top',
    disabled = false,
    showOnHover = true,
    showOnClick = false 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    const tooltipData = featureTooltips[featureKey];

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top, left;

            switch (placement) {
                case 'top':
                    top = triggerRect.top - tooltipRect.height - 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = triggerRect.bottom + 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + 8;
                    break;
                default:
                    top = triggerRect.top - tooltipRect.height - 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            }

            // Adjust for viewport boundaries
            if (left < 8) left = 8;
            if (left + tooltipRect.width > viewportWidth - 8) {
                left = viewportWidth - tooltipRect.width - 8;
            }
            if (top < 8) top = triggerRect.bottom + 8;
            if (top + tooltipRect.height > viewportHeight - 8) {
                top = triggerRect.top - tooltipRect.height - 8;
            }

            setPosition({ top, left });
        }
    }, [isVisible, placement]);

    const handleMouseEnter = () => {
        if (showOnHover && !disabled) {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (showOnHover && !disabled) {
            setIsVisible(false);
        }
    };

    const handleClick = () => {
        if (showOnClick && !disabled) {
            setIsVisible(!isVisible);
        }
    };

    const handleClickOutside = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
            triggerRef.current && !triggerRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        if (showOnClick && isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showOnClick, isVisible]);

    if (!tooltipData) {
        return children;
    }

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                className="feature-tooltip-trigger"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`feature-tooltip feature-tooltip-${placement}`}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 9999,
                    }}
                >
                    <div className="feature-tooltip-content">
                        <h4 className="feature-tooltip-title">
                            {tooltipData.title}
                        </h4>
                        <p className="feature-tooltip-description">
                            {tooltipData.description}
                        </p>
                    </div>
                    <div className={`feature-tooltip-arrow feature-tooltip-arrow-${placement}`} />
                </div>
            )}
        </>
    );
};

export default FeatureTooltip;