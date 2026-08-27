'use client';

import { MessageCircle, PhoneOff } from 'lucide-react';
import { useState } from 'react';

const WhatsAppButton = () => {
  const phone = '+56995336140';
  const message = encodeURIComponent('Hola, necesito ayuda legal.');
  const [showMenu, setShowMenu] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setShowMenu(false);
    }
  };

  return (
    <>
      {/* Menú flotante expandible */}
      {showMenu && (
        <div className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-lg border border-border p-4 sm:hidden">
          <div className="space-y-3">
            <button
              onClick={scrollToContact}
              className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
            >
              <PhoneOff className="w-5 h-5" />
              Enviar consulta
            </button>
            <a
              href={`https://wa.me/${phone}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Botón flotante principal */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Contacto"
        className="fixed bottom-6 right-6 z-50 bg-primary hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 hidden sm:flex sm:flex-col items-center justify-center md:flex"
        title="Contactar"
      >
        <PhoneOff className="w-6 h-6" />
      </button>

      {/* Botón flotante simple en mobile (muy pequeño) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {/* Botón de menú */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-primary hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all active:scale-95 pointer-events-auto"
          aria-label="Menú de contacto"
        >
          <PhoneOff className="w-5 h-5" />
        </button>

        {/* Botón de WhatsApp directo (siempre visible) */}
        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.372 0 0 5.373 0 12a11.96 11.96 0 001.686 6.109L0 24l6.178-1.635A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.003a9.95 9.95 0 01-5.082-1.396l-.363-.214-3.67.97.984-3.579-.236-.367A9.938 9.938 0 012.003 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.155-7.152c-.282-.141-1.672-.825-1.931-.919-.26-.096-.45-.141-.639.14-.188.282-.733.918-.899 1.11-.165.188-.33.211-.611.07-.282-.141-1.192-.44-2.27-1.4-.839-.748-1.404-1.673-1.57-1.955-.165-.282-.018-.435.123-.576.127-.126.282-.33.423-.495.141-.165.188-.282.282-.47.094-.188.047-.353-.023-.495-.07-.141-.639-1.539-.875-2.11-.23-.552-.465-.478-.639-.478-.165 0-.353-.024-.541-.024-.188 0-.494.07-.752.353s-.99.968-.99 2.361c0 1.392 1.014 2.739 1.155 2.927.141.188 2 3.07 4.848 4.3.678.294 1.207.47 1.62.601.68.216 1.3.186 1.788.113.545-.08 1.672-.683 1.91-1.34.236-.66.236-1.225.165-1.34-.07-.117-.258-.188-.54-.33z" />
          </svg>
        </a>
      </div>
    </>
  );
};

export default WhatsAppButton;
