import { Scale, Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-legal-dark text-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
               <img
  src="/logo_blanco.png"
  alt="Defensa Penal Protegida"
  className="max-h-44 w-auto object-contain"
/>

          
            </div>
            
            <p className="font-body text-gray-300 leading-relaxed mb-6 max-w-md">
              Estudio jurídico especializado en derecho penal chileno. Protegemos tu libertad 
              y derechos con profesionalismo, ética y experiencia comprobada.
            </p>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-legal-primary" />
                <span className="font-body text-gray-300">+56 9 9533 6140</span>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                <Mail  className="w-5 h-5 text-legal-primary" />
                 <span className="font-body text-gray-300">abogados@arteagayaldunate.cl</span>
                 </div>
             </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-legal-primary" />
                <span className="font-body text-gray-300">Bombero Salas 1369, of. 701, Santiago</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <nav className="space-y-3">
              {[
                { label: "Inicio", id: "inicio" },
                { label: "Servicios", id: "servicios" },
                { label: "Enfoque", id: "enfoque" },
                { label: "Equipo", id: "equipo" },
                { label: "Contacto", id: "contacto" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block font-body text-gray-300 hover:text-legal-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-legal-primary" />
                  <span className="font-body text-sm font-medium text-gray-200">Horarios</span>
                </div>
                <div className="font-body text-sm text-gray-300 space-y-1">
                  <p>Lun - Vie: 9:00 - 18:00</p>
                  <p className="text-legal-primary">Emergencias: 24/7</p>
                </div>
              </div>
              
              <div className="bg-legal-primary/10 p-4 rounded-lg">
                <h5 className="font-body text-sm font-bold text-legal-primary mb-2">
                  Atención de Emergencia
                </h5>
                <p className="font-body text-xs text-gray-300">
                  Si has sido detenido o citado, contáctanos inmediatamente por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-body text-sm text-gray-400">
              © {currentYear} Arteaga y Aldunate | Abogados & Asociados. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center space-x-6 font-body text-sm text-gray-400">
              <button className="hover:text-legal-primary transition-colors">
                Política de Privacidad
              </button>
              <button className="hover:text-legal-primary transition-colors">
                Términos de Servicio
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="font-body text-xs text-gray-500 text-center max-w-4xl mx-auto">
              <strong>Aviso Legal:</strong> La información contenida en este sitio web tiene carácter meramente informativo 
              y no constituye asesoramiento jurídico. Para obtener asesoramiento específico sobre su caso, 
              es necesario contactar directamente con nuestro estudio jurídico.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;