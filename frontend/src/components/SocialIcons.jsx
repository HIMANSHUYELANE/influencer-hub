import React from 'react';

export const Instagram = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export const Youtube = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6 3.8 3.7 4.8 3.7 5.2 3.6 8.5 3.4 12 3.4 12 3.4s3.5 0 6.8.2c.5.1 1.4.1 2.2 1 .7.8.5 2.5.5 2.5s.2 2 .2 3.9v1.6c0 1.9-.2 3.9-.2 3.9s-.2 1.7-.9 2.5c-.8.8-1.9.8-2.4.9-3.6.3-7 .3-7 .3s-3.5 0-6.8-.2c-.4-.1-1.4-.1-2.2-1-.7-.8-.5-2.5-.5-2.5s-.2-2-.2-3.9v-1.6c0-1.9.2-3.9.2-3.9z"></path>
    <polygon points="9.7 15.5 15.7 12 9.7 8.5 9.7 15.5"></polygon>
  </svg>
);

export const Twitter = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
