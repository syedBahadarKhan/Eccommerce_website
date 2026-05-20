import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '03429166926'; // Change this to the client's actual phone number
  const message = encodeURIComponent('Hello Elegant Fashion! I have a query about your products.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat on WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.02 14.07 1 11.999 1c-5.437 0-9.862 4.372-9.866 9.802-.001 1.761.485 3.479 1.408 5.014l-.995 3.636 3.75-1.027zM17.486 14.4c-.3-.15-1.774-.875-2.05-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.025-.512-1.85-.937-2.587-1.575-.575-.5-1.125-1.1-1.325-1.45-.2-.35-.025-.537.125-.687.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.588-.492-.507-.675-.516-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8 1.05-.275.975-1.05 3.1-1.05 3.225s.125.625.325.875c.2.25 2.125 3.25 5.15 4.562.725.312 1.288.5 1.725.638.725.23 1.385.197 1.91.12.587-.087 1.774-.725 2.025-1.425.25-.7.25-1.3 0-1.425-.075-.075-.3-.225-.6-.375z" />
      </svg>
      <span className="tooltip">Chat Support</span>
    </a>
  );
};

export default WhatsAppButton;
