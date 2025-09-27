// 1. Configuración del cliente de Supabase
const translations = {
    es: { demoTitle: "Demo: CRUD con Supabase", demoSubtitle: "Gestiona los registros de la tabla de personas.", addPersonBtn: "Agregar Persona", colName: "Nombre", colSurname: "Apellido", colEmail: "Email", colBirthdate: "Fecha Nacimiento", colActions: "Acciones", modalAddTitle: "Agregar Persona", modalEditTitle: "Editar Persona", formName: "Nombre:", formSurname: "Apellido:", formEmail: "Email:", formBirthdate: "Fecha de Nacimiento:", btnCancel: "Cancelar", btnSave: "Guardar", confirmDeleteTitle: "¿Estás seguro?", confirmDeleteText: "¡No podrás revertir esto!", btnConfirmDelete: "Sí, ¡bórralo!", btnCancelDelete: "Cancelar",swalErrorTitle: "¡Error!", swalErrorText: "No se pudo eliminar el registro.", swalDeletedTitle: "¡Eliminado!", swalDeletedText: "El registro ha sido eliminado.", },
    pt: { demoTitle: "Demo: CRUD com Supabase", demoSubtitle: "Gerencie os registros na tabela de pessoas.", addPersonBtn: "Adicionar Pessoa", colName: "Nome", colSurname: "Sobrenome", colEmail: "E-mail", colBirthdate: "Data de Nascimento", colActions: "Ações", modalAddTitle: "Adicionar Pessoa", modalEditTitle: "Editar Pessoa", formName: "Nome:", formSurname: "Sobrenome:", formEmail: "E-mail:", formBirthdate: "Data de Nascimento:", btnCancel: "Cancelar", btnSave: "Salvar", confirmDeleteTitle: "Você tem certeza?", confirmDeleteText: "Você не podrás reverter isso!", btnConfirmDelete: "Sim, apague!", btnCancelDelete: "Cancelar", swalErrorTitle: "Erro!", swalErrorText: "Não foi possível excluir o registro.", swalDeletedTitle: "Excluído!", swalDeletedText: "O registro foi excluído com sucesso.", },
    en: { demoTitle: "Demo: CRUD with Supabase", demoSubtitle: "Manage the records in the people table.", addPersonBtn: "Add Person", colName: "Name", colSurname: "Surname", colEmail: "Email", colBirthdate: "Birthdate", colActions: "Actions", modalAddTitle: "Add Person", modalEditTitle: "Edit Person", formName: "Name:", formSurname: "Surname:", formEmail: "Email:", formBirthdate: "Birthdate:", btnCancel: "Cancel", btnSave: "Save", confirmDeleteTitle: "Are you sure?", confirmDeleteText: "You won't be able to revert this!", btnConfirmDelete: "Yes, delete it!", btnCancelDelete: "Cancel", swalErrorTitle: "Error!", swalErrorText: "The record could not be deleted.", swalDeletedTitle: "Deleted!", swalDeletedText: "The record has been deleted.", }
};

// === LÓGICA DE LA MODAL CORREGIDA ===
const modal             = document.getElementById('personaModal');
const openModalBtn      = document.getElementById('openModalBtn');
const closeModalBtns    = document.querySelectorAll('.modal-close');
const modalOverlay      = document.querySelector('.modal-overlay');

// Lo añadimos dentro del listener que ya tienes para que no haya conflictos
document.addEventListener('DOMContentLoaded', () => {
    // Aquí ya están tus otras funciones de traducción, tema oscuro, etc.
    // Carga inicial
    loadPersonas();

    // Evento para ABRIR la modal
    document.getElementById('openModalBtn').addEventListener('click', () => {
        // Resetea el formulario para asegurar que esté limpio
        document.getElementById('personaForm').reset();
        document.getElementById('personaId').value = ''; // Limpia el ID oculto
        
        // Muestra la modal
        modal.classList.add('modal-active');
        modal.classList.remove('opacity-0');
        modal.classList.remove('pointer-events-none');
    });

    // funcion para CERRAR la modal
    function closeModal() {
        modal.classList.add('opacity-0');
        modal.classList.add('pointer-events-none');
        modal.classList.remove('modal-active');
    }

    // Asigna el evento de cierre a todos los botones y al overlay
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    // modalOverlay.addEventListener('click', closeModal);


    // === CÓDIGO PARA GUARDAR LOS DATOS (CREAR/ACTUALIZAR) ===
    document.getElementById('personaForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Previene que la página se recargue

        // Recopila los datos del formulario
        const id = document.getElementById('personaId').value;
        const formData = { 
            name: document.getElementById('name').value, 
            surname: document.getElementById('surname').value, 
            email: document.getElementById('email').value, 
            birthdate: document.getElementById('birthdate').value 
        };

        // Si hay un 'id', actualiza (UPDATE). Si no, inserta (CREATE).
        const { data, error } = id 
            ? await supabaseClient.from('personas').update(formData).eq('id', id) 
            : await supabaseClient.from('personas').insert([formData]);

        console.log('Respuesta de Supabase:', { data, error });
        
        if (error) {
            console.error(error);
            // Opcional: Mostrar una alerta de error al usuario
            Swal.fire('Error', 'No se pudo guardar el registro.', 'error');
        } else { 
            closeModal(); 
            loadPersonas(); 
        }
    });

});

let dataTableInstance;

// Lógica del CRUD y DataTables
async function loadPersonas() {
    // const { data, error } = await supabaseClient.from('personas').select('*').order('created_at', { ascending: false });
    const { data, error } = await supabaseClient.from('personas').select('*').is('deleted_at', null) .order('created_at', { ascending: false });
    if (error) { console.error(error); return; }
    if (dataTableInstance) dataTableInstance.destroy();
    dataTableInstance = $('#personasTable').DataTable({
        data: data,
        columns: [{ data: 'name' }, { data: 'surname' }, { data: 'email' }, 
        // { data: 'birthdate' }, 
        { 
            data: 'birthdate',
            render: function(data, type, row) {
                // Para ORDENAR (sort) o filtrar, devuelve el dato original (YYYY-MM-DD)
                // que es naturalmente ordenable.
                if (type === 'sort' || type === 'filter') {
                    return data;
                }

                // Para MOSTRAR (display), formatea la fecha como DD/MM/YYYY
                if (data) {
                    const date = new Date(data + 'T00:00:00');
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
                return '';
            }
        },
        { data: null, defaultContent: '', orderable: false, render: (data, type, row) => `<button onclick="window.editPersona(${row.id})" class="text-blue-500 hover:text-blue-700 mr-2"><i class="fas fa-edit"></i></button><button onclick="window.deletePersona(${row.id})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>`}],
        language: { url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json' },
        responsive: true,
        tailwindcss: true,
        // dom: '<"top">rt<"bottom"ip><"clear">',
    });
}

// === FUNCIÓN DE BORRADO CON SWEETALERT2 ===
window.deletePersona = async (id) => {
    const trans = translations[currentLanguage];
    
    Swal.fire({
        title: trans.confirmDeleteTitle,
        text: trans.confirmDeleteText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: trans.btnConfirmDelete,
        cancelButtonText: trans.btnCancelDelete,
        background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { error } = await supabaseClient
                .from('personas')
                .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Error en el borrado lógico:', error);
                Swal.fire(trans.swalErrorTitle, trans.swalErrorText, 'error');
            } else {
                Swal.fire(trans.swalDeletedTitle, trans.swalDeletedText, 'success');
                loadPersonas();
            }
        }
    });
};

window.editPersona = async (id) => {
    const { data, error } = await supabaseClient.from('personas').select('*').eq('id', id).single();
    if(error) { console.error(error); return; }
    document.getElementById('personaId').value = data.id;
    document.getElementById('name').value = data.name;
    document.getElementById('surname').value = data.surname;
    document.getElementById('email').value = data.email;
    document.getElementById('birthdate').value = data.birthdate;
    document.getElementById('modalTitle').setAttribute('data-translate', 'modalEditTitle');
    modal.classList.add('modal-active');
    modal.classList.remove('opacity-0');
    modal.classList.remove('pointer-events-none');
};


let revertirRegistros = async () => {
    const { error } = await supabaseClient
    .from('personas')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .not('deleted_at', 'is', null);
}