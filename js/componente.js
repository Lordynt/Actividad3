/**
 * ============================================================
 * LIBRERÍA DE COMPONENTES VISUALES
 * ============================================================
 * Archivo: componente.js
 * Descripción: Lógica de los componentes interactivos.
 * 
 * NOTA SOBRE EL COMPONENTE 1 (MENÚ DROPDOWN):
 * Este componente no requiere JavaScript. Su funcionamiento
 * se basa puramente en CSS mediante la pseudo-clase :hover,
 * por lo que no se incluye lógica en este archivo.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // COMPONENTE 2: CARRUSEL + PANEL DE INFORMACIÓN
    // ==========================================

    /**
     * Clase Carrusel
     * Gestiona un carrusel de imágenes reutilizable y configurable
     * desde el HTML mediante el atributo data-visible.
     * 
     * Además, permite abrir un panel de información al hacer clic
     * sobre cualquiera de las imágenes, mostrando el texto definido
     * en el atributo data-info de cada una.
     */
    class Carrusel {
        
        /**
         * Constructor del carrusel.
         * @param {string} contenedorId - El ID del elemento HTML que contiene el carrusel.
         */
        constructor(contenedorId) {
            // Elemento principal que envuelve todo el carrusel
            this.contenedor = document.getElementById(contenedorId);
            
            // Elementos internos del carrusel
            this.track = this.contenedor.querySelector('.carrusel-track');
            this.btnPrev = this.contenedor.querySelector('.prev');
            this.btnNext = this.contenedor.querySelector('.next');
            
            // Configuración: cuántas imágenes se muestran a la vez (leído desde data-visible en el HTML)
            this.visibles = parseInt(this.contenedor.dataset.visible) || 1;
            
            // Obtener todas las imágenes del track y contar cuántas hay
            this.imagenes = Array.from(this.track.querySelectorAll('img'));
            this.totalImagenes = this.imagenes.length;
            
            // Índice de la primera imagen visible (posición actual del carrusel)
            this.index = 0;
            
            // Referencias a los elementos del Panel de Información
            this.panel = document.getElementById('panelInfo');
            this.panelTitulo = document.getElementById('panelTitulo');
            this.panelTexto = document.getElementById('panelTexto');
            this.btnCerrarPanel = document.getElementById('btnCerrarPanel');
            
            // Inicializar el componente
            this.init();
        }

        /**
         * Inicializa el carrusel: ajusta tamaños, registra eventos
         * de navegación y configura la apertura/cierre del panel.
         */
        init() {
            // Ajustar el ancho de las imágenes según la cantidad visible
            this.ajustarTamaño();
            
            // --- Eventos de navegación del carrusel ---
            this.btnNext.addEventListener('click', () => this.siguiente());
            this.btnPrev.addEventListener('click', () => this.anterior());
            
            // Recalcular tamaños si la ventana cambia de tamaño
            window.addEventListener('resize', () => this.ajustarTamaño());

            // --- Evento: Clic en una imagen para abrir el panel ---
            this.imagenes.forEach((img, index) => {
                img.addEventListener('click', () => {
                    // Obtener el texto desde data-info o usar un mensaje por defecto
                    const textoInfo = img.dataset.info || 'Sin información disponible.';
                    // Usar el alt de la imagen como título, o un texto genérico
                    const altText = img.alt || 'Imagen ' + (index + 1);
                    
                    // Inyectar el contenido en el panel
                    this.panelTitulo.textContent = altText;
                    this.panelTexto.textContent = textoInfo;
                    
                    // Mostrar el panel (quitando la clase que lo oculta)
                    this.panel.classList.remove('oculto');
                });
            });

            // --- Evento: Cerrar panel con el botón "X" ---
            this.btnCerrarPanel.addEventListener('click', () => {
                this.panel.classList.add('oculto');
            });

            // --- Evento: Cerrar panel haciendo clic fuera del contenido ---
            this.panel.addEventListener('click', (e) => {
                // Si el clic fue directamente en el fondo oscuro (no en el contenido), cerrar
                if (e.target === this.panel) {
                    this.panel.classList.add('oculto');
                }
            });
        }

        /**
         * Calcula y asigna el ancho de cada imagen para que quepan
         * exactamente 'visibles' imágenes en el viewport del carrusel.
         */
        ajustarTamaño() {
            const gap = 10; // Separación entre imágenes (debe coincidir con el CSS)
            const anchoPorcentaje = (100 / this.visibles);
            
            this.imagenes.forEach(img => {
                // Se resta el gap proporcional para evitar desbordamiento
                img.style.width = `calc(${anchoPorcentaje}% - ${gap}px)`;
            });
        }

        /**
         * Aplica la transformación CSS necesaria para desplazar el track
         * y mostrar la imagen correspondiente al índice actual.
         */
        actualizarVista() {
            // Ancho de una imagen + el gap
            const anchoImagen = this.imagenes[0].getBoundingClientRect().width + 10;
            // Desplazamiento negativo hacia la izquierda
            const desplazamiento = -(this.index * anchoImagen);
            
            this.track.style.transform = `translateX(${desplazamiento}px)`;
        }

        /**
         * Avanza el carrusel una posición hacia la derecha,
         * respetando el límite para no mostrar espacio vacío.
         */
        siguiente() {
            // El índice máximo es totalImagenes - visibles
            const maxIndex = this.totalImagenes - this.visibles;
            if (this.index < maxIndex) {
                this.index++;
                this.actualizarVista();
            }
        }

        /**
         * Retrocede el carrusel una posición hacia la izquierda,
         * sin permitir índices negativos.
         */
        anterior() {
            if (this.index > 0) {
                this.index--;
                this.actualizarVista();
            }
        }
    }

    // ==========================================
    // INICIALIZACIÓN DEL CARRUSEL
    // ==========================================
    // Se crea una instancia del carrusel pasando el ID del contenedor.
    // El usuario no necesita modificar esta línea para cambiar las imágenes;
    // solo debe editar el HTML dentro del contenedor con id="miCarrusel".
    const miCarrusel = new Carrusel('miCarrusel');

});