document.addEventListener('DOMContentLoaded', () => {

    const languageButtons = document.querySelectorAll('.lang-btn');

    function changeLanguage(lang) {
        // 1. Actualiza todos los textos de la página
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // 2. Actualiza el enlace de WhatsApp dinámicamente
        const baseWhatsAppURL = "https://wa.me/TUNUMEROINTERNACIONAL"; // Usa tu número aquí
        const rawMessage = translations[lang].whatsappMessage;
        const encodedMessage = encodeURIComponent(rawMessage);
        const finalWhatsAppURL = `${baseWhatsAppURL}?text=${encodedMessage}`;
        const whatsappButton = document.querySelector('#whatsapp-btn');
        if (whatsappButton) {
            whatsappButton.href = finalWhatsAppURL;
        }

        // 3. Actualiza el estilo de los botones de idioma (LA PARTE CORREGIDA)
        const languageButtons = document.querySelectorAll('.lang-btn');
        languageButtons.forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                // Estilos para el botón ACTIVO (ahora incluye dark:)
                button.classList.remove('text-slate-400', 'dark:text-slate-400', 'dark:text-white');
                button.classList.add('text-blue-600', 'dark:text-blue-500', 'font-bold');
            } else {
                // Estilos para los botones INACTIVOS (ahora incluye dark:)
                button.classList.add('text-slate-400', 'dark:text-slate-400', 'dark:text-white');
                button.classList.remove('text-blue-600', 'dark:text-blue-500', 'font-bold');
            }
        });
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