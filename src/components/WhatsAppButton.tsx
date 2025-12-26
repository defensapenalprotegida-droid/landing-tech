'use client';

import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phone = '+56995336140'; // Reemplaza con tu número de WhatsApp sin signos ni espacios
  const message = encodeURIComponent('Hola, necesito ayuda legal.'); // Mensaje predeterminado

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
    >
         {/* Ícono de WhatsApp */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.372 0 0 5.373 0 12a11.96 11.96 0 001.686 6.109L0 24l6.178-1.635A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.003a9.95 9.95 0 01-5.082-1.396l-.363-.214-3.67.97.984-3.579-.236-.367A9.938 9.938 0 012.003 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.155-7.152c-.282-.141-1.672-.825-1.931-.919-.26-.096-.45-.141-.639.14-.188.282-.733.918-.899 1.11-.165.188-.33.211-.611.07-.282-.141-1.192-.44-2.27-1.4-.839-.748-1.404-1.673-1.57-1.955-.165-.282-.018-.435.123-.576.127-.126.282-.33.423-.495.141-.165.188-.282.282-.47.094-.188.047-.353-.023-.495-.07-.141-.639-1.539-.875-2.11-.23-.552-.465-.478-.639-.478-.165 0-.353-.024-.541-.024-.188 0-.494.07-.752.353s-.99.968-.99 2.361c0 1.392 1.014 2.739 1.155 2.927.141.188 2 3.07 4.848 4.3.678.294 1.207.47 1.62.601.68.216 1.3.186 1.788.113.545-.08 1.672-.683 1.91-1.34.236-.66.236-1.225.165-1.34-.07-.117-.258-.188-.54-.33z" />
      </svg>

    </a>
  );
};

export default WhatsAppButton;
