"use client";
// src/shared/components/PerformanceWrapper.jsx
import { useEffect } from 'react';
import { startPerformanceTrace, stopPerformanceTrace } from '../../core/services/analytics';

export const PerformanceWrapper = ({ name, children }) => {
    useEffect(() => {
        const trace = startPerformanceTrace(`component_${name}`);
        
        return () => {
            if (trace) {
                stopPerformanceTrace(trace, {
                    component: name,
                    render_complete: 'true'
                });
            }
        };
    }, [name]);
    
    return children;
};

export default PerformanceWrapper;