document.addEventListener('DOMContentLoaded', () => {

    const languageButtons = document.querySelectorAll('.lang-btn');

    function changeLanguage(lang) {
        // Actualiza todos los elementos que tengan el atributo data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Actualiza el estilo de los botones
        languageButtons.forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                // Estilos para el botón ACTIVO
                button.classList.remove('text-slate-400', 'dark:text-slate-400');
                button.classList.add('text-blue-600', 'dark:text-blue-500', 'font-bold');
            } else {
                // Estilos para los botones INACTIVOS
                button.classList.add('text-slate-400', 'dark:text-white');
                button.classList.remove('text-blue-600', 'dark:text-blue-500', 'font-bold');
            }
        });

        // --- Lógica nueva para el enlace de WhatsApp ---
        const baseWhatsAppURL = "https://wa.me/+5553999763097"; // Usa tu número aquí
        const rawMessage = translations[lang].whatsappMessage;
        const encodedMessage = encodeURIComponent(rawMessage); // Codifica el mensaje para la URL
        
        const finalWhatsAppURL = `${baseWhatsAppURL}?text=${encodedMessage}`;

        // Actualiza el 'href' del botón
        const whatsappButton = document.querySelector('#whatsapp-btn');
        if (whatsappButton) {
            whatsappButton.href = finalWhatsAppURL;
        }
    }

    // Asigna el evento de clic a cada botón
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });

    // Establece un idioma por defecto al cargar la página
    changeLanguage('pt');

});

// Iconos
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Comprobar el tema guardado en localStorage o el preferido por el sistema
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');
} else {
    document.documentElement.classList.remove('dark');
    themeToggleLightIcon.classList.add('hidden');
    themeToggleDarkIcon.classList.remove('hidden');
}

const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {
    // Alternar iconos
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // Si el tema ya está guardado, lo cambiamos. Si no, lo guardamos por primera vez
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});