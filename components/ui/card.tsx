import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`rounded-lg shadow-md bg-gray-800 text-white ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
