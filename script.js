/* ======================================================
   SCRIPT.JS v18.1 (Corrigido para Marcelino)
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
    // ======================================================
    
    // ATENÇÃO: Se estiver rodando localmente, mude para http://localhost:4000/api
    const API_LOGIN_URL = 'https://api.hltech.org/api/login';
    const API_BASE_URL = 'https://api.hltech.org/api'; 

    // Variáveis de Estado
    let authToken = null;
    let listaOrdens = []; 
    let listaTecnicos = [];
    let listaClientes = []; 

    // Instâncias dos Gráficos (Chart.js)
    let statusChart = null;
    let faturamentoChart = null;
    let tecnicoChart = null;
    let dispositivosChart = null; 

    // Instância da Assinatura (SignaturePad)
    let signaturePad = null; 


    // ======================================================
    // 2. SELETORES DE ELEMENTOS DO DOM
    // ======================================================
    
    // Fundo Animado
    const canvas = document.getElementById('backgroundCanvas');
    
    // Containers Principais
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    
    // Formulário de Login
    const formLogin = document.getElementById('form-login');
    const btnSubmitLogin = document.getElementById('btn-submit-login');
    const messageAreaLogin = document.getElementById('message-area-login');
    const btnLogout = document.getElementById('btn-logout');

    // Navegação
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const contentPages = document.querySelectorAll('.page-content');

    // Busca Global
    const globalSearchInput = document.getElementById('global-search-input');
    const searchResultsDropdown = document.getElementById('search-results-dropdown');

    // --- PÁGINA CLIENTES ---
    const formCliente = document.getElementById('form-cliente');
    const btnSubmitCliente = document.getElementById('btn-submit-cliente');
    const messageAreaCliente = document.getElementById('message-area-cliente');
    const btnRefreshClientes = document.getElementById('btn-refresh-clientes');
    const clientTableBody = document.getElementById('client-table-body');
    
    // Campos de Endereço
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    
    // --- PÁGINA DISPOSITIVOS ---
    const formDispositivo = document.getElementById('form-dispositivo');
    const btnSubmitDispositivo = document.getElementById('btn-submit-dispositivo');
    const messageAreaDispositivo = document.getElementById('message-area-dispositivo');
    const selectClienteDispositivo = document.getElementById('select-cliente-dispositivo'); 
    const btnRefreshDispositivos = document.getElementById('btn-refresh-dispositivos');
    const dispositivoTableBody = document.getElementById('dispositivo-table-body'); 
    
    // --- PÁGINA ORDENS DE SERVIÇO ---
    const btnShowOsModal = document.getElementById('btn-show-os-modal');
    const btnRefreshOS = document.getElementById('btn-refresh-os');
    const osTableBody = document.getElementById('os-table-body');
    
    // Filtros da O.S.
    const formFiltrosOS = document.getElementById('form-filtros-os');
    const filtroCliente = document.getElementById('filtro-cliente');
    const filtroTecnico = document.getElementById('filtro-tecnico');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
    
    // --- PÁGINA EQUIPE (Técnicos) ---
    const formTecnico = document.getElementById('form-tecnico');
    const messageAreaTecnico = document.getElementById('message-area-tecnico');
    const tecnicosTableBody = document.getElementById('tecnicos-table-body');
    const btnRefreshTecnicos = document.getElementById('btn-refresh-tecnicos');

    // --- PÁGINA FINANCEIRO ---
    const formDespesa = document.getElementById('form-despesa');
    const messageAreaFinanceiro = document.getElementById('message-area-financeiro');
    const despesasTableBody = document.getElementById('despesas-table-body');
    const btnRefreshFinanceiro = document.getElementById('btn-refresh-financeiro');
    const displayEntradas = document.getElementById('fin-entradas');
    const displaySaidas = document.getElementById('fin-saidas');
    const displayLucro = document.getElementById('fin-lucro');

    // --- PÁGINA DASHBOARD ---
    const btnRefreshDashboard = document.getElementById('btn-refresh-dashboard');
    const ctxStatus = document.getElementById('chart-status');
    const ctxFaturamento = document.getElementById('chart-faturamento');
    const ctxTecnicos = document.getElementById('chart-tecnicos');
    const ctxDispositivos = document.getElementById('chart-dispositivos');

    // --- MODAL: CRIAR NOVA O.S. ---
    const createOsModalBackdrop = document.getElementById('create-os-modal-backdrop');
    const btnModalCloseOs = document.getElementById('btn-modal-close-os');
    const formOS = document.getElementById('form-os');
    const btnSubmitOS = document.getElementById('btn-submit-os');
    const messageAreaOS = document.getElementById('message-area-os');
    const osSelectCliente = document.getElementById('os-select-cliente'); 
    const osSelectDispositivo = document.getElementById('os-select-dispositivo');
    const osDisplayDefeito = document.getElementById('os-display-defeito');
    const osSelectTecnico = document.getElementById('os-select-tecnico'); 

    // --- MODAL: GERENCIADOR DE O.S. ---
    const modalBackdrop = document.getElementById('gerenciador-modal-backdrop');
    const modalOsIdSpan = document.getElementById('modal-os-id');
    const btnModalClose = document.getElementById('btn-modal-close');
    
    // Abas e Status
    const modalTabsContainer = document.querySelector('.modal-tabs');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.modal-tab-content');
    const modalOsStatusSelect = document.getElementById('modal-os-status-select');
    const btnUpdateStatus = document.getElementById('btn-update-status');
    const messageAreaStatus = document.getElementById('message-area-status');
    
    // Aba: Itens
    const formAddItem = document.getElementById('form-add-item');
    const itemOsIdHidden = document.getElementById('item-os-id-hidden');
    const itensTableBody = document.getElementById('itens-table-body');
    
    // Aba: Detalhes
    const formOsDetalhes = document.getElementById('form-os-detalhes');
    const detalhesOsIdHidden = document.getElementById('detalhes-os-id-hidden');
    const detalhesLaudo = document.getElementById('detalhes-laudo');
    const detalhesAcessorios = document.getElementById('detalhes-acessorios');
    const detalhesTecnicoSelect = document.getElementById('detalhes-tecnico-select');
    const detalhesGarantia = document.getElementById('detalhes-garantia');
    const detalhesDesconto = document.getElementById('detalhes-desconto');
    const messageAreaDetalhes = document.getElementById('message-area-detalhes');
    
    // Aba: Imagens
    const formUpload = document.getElementById('form-upload');
    const uploadOsIdHidden = document.getElementById('upload-os-id-hidden');
    const existingImagesList = document.getElementById('existing-images-list');

    // Aba: Histórico
    const osHistoryList = document.getElementById('os-history-list');

    // Aba: Assinatura
    const signatureCanvas = document.getElementById('signature-canvas');
    const btnClearSignature = document.getElementById('btn-clear-signature');
    const btnSaveSignature = document.getElementById('btn-save-signature');
    const messageAreaAssinatura = document.getElementById('message-area-assinatura');

    // --- MODAL DE ALERTA/CONFIRMAÇÃO ---
    const alertModalBackdrop = document.getElementById('alert-modal-backdrop');
    const alertModalTitle = document.getElementById('alert-modal-title');
    const alertModalMessage = document.getElementById('alert-modal-message');
    const alertModalBtnConfirm = document.getElementById('alert-modal-btn-confirm');
    const alertModalBtnCancel = document.getElementById('alert-modal-btn-cancel');


    // ======================================================
    // 3. FUNÇÕES UTILITÁRIAS
    // ======================================================

    function showMessage(area, type, text) {
        if(area) {
            area.textContent = text;
            area.className = `message-area ${type}`;
            if (type === 'success') {
                setTimeout(() => {
                    area.textContent = '';
                    area.className = 'message-area';
                }, 3000);
            }
        }
    }

    function getAuthHeaders(includeContentType = true) {
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };
        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    // Animação de Fundo (Canvas)
    let animationFrameId; 
    function startBackgroundAnimation() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createParticles = () => {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000); 
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    dx: (Math.random() - 0.5) * 0.5, 
                    dy: (Math.random() - 0.5) * 0.5 
                });
            }
        };
        
        const drawParticles = () => {
            if (!animationFrameId) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                
                p.x += p.dx;
                p.y += p.dy;
                
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                
                ctx.strokeStyle = 'rgba(158, 70, 255, 0.15)'; 
                ctx.lineWidth = 0.5;
                
                for (let i = 0; i < particles.length; i++) {
                    const p2 = particles[i];
                    const distance = Math.sqrt((p.x - p2.x) * (p.x - p2.x) + (p.y - p2.y) * (p.y - p2.y));
                    const maxDistance = 120;
                    
                    if (distance < maxDistance) {
                        ctx.globalAlpha = 1 - (distance / maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1;
            });
            animationFrameId = requestAnimationFrame(drawParticles);
        };
        
        canvas.style.display = 'block';
        resizeCanvas();
        createParticles();
        animationFrameId = requestAnimationFrame(drawParticles);
        
        window.onresize = () => {
            if (animationFrameId) {
                resizeCanvas();
                createParticles();
            }
        };
    }

    function stopBackgroundAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
        window.onresize = null;
    }
    
    // Lógica dos Modais de Confirmação e Alerta
    let resolveConfirm; 
    
    function showCustomAlert(title, message) {
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        alertModalBtnConfirm.textContent = 'OK';
        alertModalBtnConfirm.style.backgroundColor = 'var(--cor-destaque)';
        alertModalBtnCancel.classList.add('hidden');
        alertModalBackdrop.classList.remove('hidden');
        
        alertModalBtnConfirm.onclick = () => {
            alertModalBackdrop.classList.add('hidden');
        };
    }

    function showCustomConfirm(title, message) {
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        alertModalBtnConfirm.textContent = 'Confirmar';
        alertModalBtnCancel.classList.remove('hidden');
        alertModalBackdrop.classList.remove('hidden');
        
        if (title.toLowerCase().includes('excluir') || 
            title.toLowerCase().includes('apagar') || 
            title.toLowerCase().includes('remover')) {
             alertModalBtnConfirm.style.backgroundColor = 'var(--cor-delete)';
        } else {
             alertModalBtnConfirm.style.backgroundColor = 'var(--cor-destaque)';
        }
        
        return new Promise((resolve) => {
            resolveConfirm = resolve;
        });
    }

    alertModalBtnConfirm.addEventListener('click', () => {
        alertModalBackdrop.classList.add('hidden');
        if (resolveConfirm) resolveConfirm(true);
    });
    
    alertModalBtnCancel.addEventListener('click', () => {
        alertModalBackdrop.classList.add('hidden');
        if (resolveConfirm) resolveConfirm(false);
    });
    
    alertModalBackdrop.addEventListener('click', (event) => {
         if (event.target === alertModalBackdrop) {
            alertModalBackdrop.classList.add('hidden');
            if (resolveConfirm) resolveConfirm(false);
         }
    });


    // ======================================================
    // 4. SISTEMA DE AUTENTICAÇÃO
    // ======================================================

    function checkLoginStatus() {
        const token = localStorage.getItem('hltech_token');
        
        if (token) {
            authToken = token;
            appContainer.classList.remove('hidden');
            loginContainer.classList.add('hidden');
            stopBackgroundAnimation();
            
            // Inicializa os dados
            fetchClientes();
            fetchOrdens(); 
            fetchDispositivos();
            fetchTecnicos(); 
            fetchDashboardData();
            
            if (document.getElementById('page-financeiro') && document.getElementById('page-financeiro').classList.contains('active')) {
                fetchFinanceiro();
            }

            if (document.getElementById('data-despesa')) {
                document.getElementById('data-despesa').valueAsDate = new Date();
            }
            
        } else {
            appContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            startBackgroundAnimation();
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        showMessage(messageAreaLogin, 'loading', 'Autenticando...');
        btnSubmitLogin.disabled = true;
        
        const formData = new FormData(formLogin);
        const dados = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const resultado = await response.json();
            
            if (response.ok) {
                showMessage(messageAreaLogin, 'success', resultado.message);
                localStorage.setItem('hltech_token', resultado.token);
                
                setTimeout(() => {
                    stopBackgroundAnimation();
                    checkLoginStatus();
                }, 1000);
            } else {
                showMessage(messageAreaLogin, 'error', `Erro: ${resultado.error}`);
            }
        } catch (error) {
            showMessage(messageAreaLogin, 'error', 'Erro de conexão com o servidor.');
        } finally {
            btnSubmitLogin.disabled = false;
        }
    }

    async function handleLogout() {
        const confirmado = await showCustomConfirm('Sair do Sistema', 'Tem certeza que deseja sair?');
        if (confirmado) {
            localStorage.removeItem('hltech_token');
            authToken = null;
            appContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            startBackgroundAnimation();
        }
    }

    // ======================================================
    // 5. NAVEGAÇÃO ENTRE PÁGINAS (CORREÇÃO AQUI!)
    // ======================================================
    
    function handleNavClick(event) {
        event.preventDefault();
        const targetLink = event.currentTarget;
        const pageId = targetLink.dataset.page; 
        
        // CORREÇÃO: Se o link não tiver 'data-page', não faz nada de navegação (ex: botão Tema ou Sair)
        if (!pageId) return;
        
        // Verifica se a página destino realmente existe no HTML
        const targetPageElement = document.getElementById(pageId);
        if (!targetPageElement) {
            console.error(`Página com ID "${pageId}" não encontrada.`);
            return;
        }

        // Carregamento Lazy de dados
        if (pageId === 'page-dashboard') fetchDashboardData();
        if (pageId === 'page-equipe') fetchTecnicos();
        if (pageId === 'page-financeiro') fetchFinanceiro(); 
        
        // Atualiza classes ativas nos links
        sidebarLinks.forEach(link => link.classList.remove('active'));
        targetLink.classList.add('active');

        // Atualiza classes ativas nas páginas (telas)
        contentPages.forEach(page => page.classList.remove('active'));
        targetPageElement.classList.add('active');
    }


    // ======================================================
    // 6. INTEGRAÇÃO VIA CEP
    // ======================================================
    
    async function handleCepBlur(event) {
        const cep = event.target.value.replace(/\D/g, ''); 
        if (cep.length !== 8) return;

        logradouroInput.value = "Buscando...";
        bairroInput.value = "Buscando...";
        cidadeInput.value = "Buscando...";
        ufInput.value = "Buscando...";

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const resultado = await response.json();

            if (resultado.erro) {
                logradouroInput.value = "";
                bairroInput.value = "";
                cidadeInput.value = "";
                ufInput.value = "";
                event.target.value = "CEP Inválido";
            } else {
                logradouroInput.value = resultado.logradouro;
                bairroInput.value = resultado.bairro;
                cidadeInput.value = resultado.localidade;
                ufInput.value = resultado.uf;
            }
        } catch (error) {
            console.error("Erro ViaCEP:", error);
            logradouroInput.value = "Erro na busca";
        }
    }


    // ======================================================
    // 7. MODAL "CRIAR NOVA O.S."
    // ======================================================
    
    function openCreateOsModal() {
        formOS.reset();
        
        document.getElementById('status').value = 'Orçamento';
        document.getElementById('descricao_servico').value = 'Serviços Gerais';
        document.getElementById('valor_servico').value = '0.00';
        showMessage(messageAreaOS, '', '');
        
        osSelectDispositivo.innerHTML = '<option value="">2º Selecione o Dispositivo...</option>';
        osSelectDispositivo.disabled = true;
        osSelectCliente.value = ""; 
        osDisplayDefeito.textContent = "Selecione um dispositivo para ver o defeito.";
        btnSubmitOS.disabled = true;
        
        let defaultId = "";
        if (listaTecnicos.length > 0) {
            const marcelino = listaTecnicos.find(t => t.nome_completo.toLowerCase().includes('marcelino'));
            defaultId = marcelino ? marcelino.id : listaTecnicos[0].id;
        }
        renderTecnicosSelect(osSelectTecnico, defaultId);
        
        createOsModalBackdrop.classList.remove('hidden');
    }

    function closeCreateOsModal() { 
        createOsModalBackdrop.classList.add('hidden'); 
    }


    // ======================================================
    // 8. CRUD: CLIENTES
    // ======================================================

    async function fetchClientes() {
        if(clientTableBody) clientTableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, { headers: getAuthHeaders(false) });
            listaClientes = await response.json(); 
            
            renderClientesTabela(listaClientes);
            renderClientesSelects(listaClientes);
            renderClientesSelect(filtroCliente, listaClientes, "Todos os Clientes"); 
        } catch (error) { 
            if(clientTableBody) clientTableBody.innerHTML = '<tr><td colspan="3">Erro ao carregar clientes.</td></tr>'; 
        }
    }

    function renderClientesTabela(clientes) {
        if(!clientTableBody) return;
        clientTableBody.innerHTML = ''; 
        if (clientes.length === 0) { 
            clientTableBody.innerHTML = '<tr><td colspan="3">Nenhum cliente cadastrado.</td></tr>'; 
            return; 
        }
        clientes.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${c.nome_completo}</td>
                <td>${c.telefone}</td>
                <td class="coluna-acoes">
                    <button class="btn-acao btn-delete btn-delete-cliente" data-cliente-id="${c.id}">Excluir</button>
                </td>`;
            clientTableBody.appendChild(row);
        });
    }

    function renderClientesSelect(selectElement, clientes, defaultText = "Selecione...") {
        if (!selectElement) return;
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        clientes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.nome_completo} (${c.telefone})`;
            selectElement.appendChild(opt);
        });
    }

    function renderClientesSelects(clientes) {
        renderClientesSelect(selectClienteDispositivo, clientes, "Selecione...");
        renderClientesSelect(osSelectCliente, clientes, "Selecione...");
    }

    async function handleClienteSubmit(event) {
        event.preventDefault(); 
        showMessage(messageAreaCliente, 'loading', 'Cadastrando...');
        btnSubmitCliente.disabled = true;
        
        const formData = new FormData(formCliente);
        const data = Object.fromEntries(formData.entries());
        data.endereco = `${data.logradouro||''}, ${data.bairro||''} - ${data.cidade||''}`;
        
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, { 
                method: 'POST', 
                headers: getAuthHeaders(), 
                body: JSON.stringify(data) 
            });
            if (response.ok) { 
                showMessage(messageAreaCliente, 'success', 'Cliente cadastrado com sucesso!'); 
                formCliente.reset(); 
                fetchClientes(); 
            } else { 
                const erro = await response.json();
                showMessage(messageAreaCliente, 'error', erro.error || 'Erro ao cadastrar.'); 
            }
        } catch (e) { 
            showMessage(messageAreaCliente, 'error', 'Erro de conexão.'); 
        } finally {
            btnSubmitCliente.disabled = false;
        }
    }


    // ======================================================
    // 9. CRUD: DISPOSITIVOS
    // ======================================================

    async function fetchDispositivos() {
        if(dispositivoTableBody) dispositivoTableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
        try {
            const response = await fetch(`${API_BASE_URL}/dispositivos`, { headers: getAuthHeaders(false) });
            const dispositivos = await response.json();
            
            if(dispositivoTableBody) {
                dispositivoTableBody.innerHTML = ''; 
                if (dispositivos.length === 0) {
                    dispositivoTableBody.innerHTML = '<tr><td colspan="4">Nenhum dispositivo.</td></tr>';
                    return;
                }

                dispositivos.forEach(d => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${d.tipo}</td>
                        <td>${d.cliente_nome}</td>
                        <td>${d.defeito_relatado}</td>
                        <td class="coluna-acoes">
                            <button class="btn-acao btn-delete btn-delete-dispositivo" data-dispositivo-id="${d.id}">Excluir</button>
                        </td>`;
                    dispositivoTableBody.appendChild(row);
                });
            }
        } catch (error) {
             if(dispositivoTableBody) dispositivoTableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar.</td></tr>';
        }
    }

    async function fetchDispositivosParaOS(clienteId) {
        osSelectDispositivo.innerHTML = '<option value="">Carregando...</option>';
        osSelectDispositivo.disabled = true;
        
        if (!clienteId) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/dispositivos?cliente_id=${clienteId}`, { headers: getAuthHeaders(false) });
            const dispositivos = await response.json();
            
            osSelectDispositivo.innerHTML = '<option value="" disabled selected>Selecione...</option>';
            osSelectDispositivo.disabled = false;
            
            dispositivos.forEach(d => {
                const option = document.createElement('option');
                option.value = d.id;
                option.textContent = `${d.tipo} (${d.marca_modelo || 'N/A'})`;
                option.dataset.defeito = d.defeito_relatado;
                osSelectDispositivo.appendChild(option);
            });
        } catch (error) { 
            osSelectDispositivo.innerHTML = '<option>Erro ao carregar</option>'; 
        }
    }

    async function handleDispositivoSubmit(event) {
        event.preventDefault(); 
        showMessage(messageAreaDispositivo, 'loading', 'Salvando...');
        btnSubmitDispositivo.disabled = true;
        
        try {
            const data = Object.fromEntries(new FormData(formDispositivo));
            const response = await fetch(`${API_BASE_URL}/dispositivos`, { 
                method: 'POST', 
                headers: getAuthHeaders(), 
                body: JSON.stringify(data) 
            });
            
            if (response.ok) { 
                showMessage(messageAreaDispositivo, 'success', 'Dispositivo cadastrado!'); 
                formDispositivo.reset(); 
                fetchDispositivos(); 
            } else { 
                const erro = await response.json();
                showMessage(messageAreaDispositivo, 'error', erro.error); 
            }
        } catch (e) { 
            showMessage(messageAreaDispositivo, 'error', 'Erro de conexão.'); 
        } finally {
            btnSubmitDispositivo.disabled = false;
        }
    }


    // ======================================================
    // 10. CRUD: ORDENS DE SERVIÇO
    // ======================================================

    async function fetchOrdens(filtros = {}) {
        if(osTableBody) osTableBody.innerHTML = '<tr><td colspan="8">Carregando O.S....</td></tr>';
        
        const url = new URL(`${API_BASE_URL}/ordens`);
        for (const [key, value] of Object.entries(filtros)) { 
            if (value) url.searchParams.append(key, value); 
        }

        try {
            const response = await fetch(url.toString(), { headers: getAuthHeaders(false) });
            listaOrdens = await response.json();
            
            if(osTableBody) {
                osTableBody.innerHTML = ''; 
                if (listaOrdens.length === 0) { 
                    osTableBody.innerHTML = '<tr><td colspan="8">Nenhuma O.S. encontrada.</td></tr>'; 
                    return; 
                }
                
                listaOrdens.forEach(os => {
                    const statusClass = os.status ? os.status.toLowerCase().replace(' ', '-') : 'padrao'; 
                    
                    const telefoneLimpo = os.cliente_telefone ? os.cliente_telefone.replace(/\D/g, '') : '';
                    const btnWhatsapp = telefoneLimpo 
                        ? `<button class="btn-acao btn-whatsapp" data-os-id="${os.id}" data-telefone="${telefoneLimpo}" title="Enviar WhatsApp">&#128242;</button>`
                        : '';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${os.id}</td> 
                        <td>${os.nome_completo}</td> 
                        <td><span class="status status-${statusClass}">${os.status || 'N/A'}</span></td> 
                        <td>R$ ${parseFloat(os.valor_total).toFixed(2)}</td> 
                        <td>${new Date(os.data_entrada).toLocaleDateString('pt-BR')}</td> 
                        <td class="coluna-acoes"> 
                            <button class="btn-acao btn-upload" data-os-id="${os.id}">Gerenciar</button> 
                            <button class="btn-acao btn-delete btn-delete-os" data-os-id="${os.id}">Excluir</button> 
                        </td> 
                        <td class="coluna-acoes"><button class="btn-acao btn-doc" data-os-id="${os.id}">PDF</button></td>
                        <td class="coluna-acoes">${btnWhatsapp}</td>
                    `;
                    osTableBody.appendChild(row);
                });
            }
        } catch (error) { 
            if(osTableBody) osTableBody.innerHTML = '<tr><td colspan="8">Erro ao carregar dados.</td></tr>'; 
        }
    }

    async function handleOsSubmit(event) {
        event.preventDefault(); 
        showMessage(messageAreaOS, 'loading', 'Criando Ordem...');
        btnSubmitOS.disabled = true;
        
        const formData = new FormData(formOS);
        const data = Object.fromEntries(formData.entries());
        
        const valServ = data.valor_servico; 
        const descServ = data.descricao_servico;
        delete data.valor_servico; 
        delete data.descricao_servico;
        
        try {
            const response = await fetch(`${API_BASE_URL}/ordens`, { 
                method: 'POST', 
                headers: getAuthHeaders(), 
                body: JSON.stringify(data) 
            });
            const json = await response.json();
            
            if (response.ok) { 
                if(parseFloat(valServ) > 0) {
                    await fetch(`${API_BASE_URL}/ordens/${json.id}/itens`, { 
                        method:'POST', 
                        headers:getAuthHeaders(), 
                        body:JSON.stringify({
                            tipo:'SERVICO', 
                            descricao:descServ, 
                            garantia:data.termo_garantia, 
                            quantidade:1, 
                            valor_unitario:valServ
                        }) 
                    });
                }
                
                showMessage(messageAreaOS, 'success', `O.S. #${json.id} criada com sucesso!`); 
                fetchOrdens(); 
                setTimeout(closeCreateOsModal, 1500);
            } else { 
                throw new Error(json.error); 
            }
        } catch (e) { 
            showMessage(messageAreaOS, 'error', e.message); 
        } finally {
            btnSubmitOS.disabled = false;
        }
    }


    // ======================================================
    // 11. CRUD: EQUIPE TÉCNICA
    // ======================================================

    async function fetchTecnicos() {
        try {
            const response = await fetch(`${API_BASE_URL}/tecnicos`, { headers: getAuthHeaders(false) });
            listaTecnicos = await response.json();
            
            renderTecnicosSelect(osSelectTecnico);
            renderTecnicosSelect(detalhesTecnicoSelect);
            renderTecnicosSelect(filtroTecnico, "Todos os Técnicos");
            
            if(tecnicosTableBody) renderTecnicosTabela(listaTecnicos);
        } catch (error) { 
            console.error("Erro ao buscar técnicos:", error); 
        }
    }

    function renderTecnicosSelect(selectElement, selectedId = "") {
        if (!selectElement) return; 
        const isFilter = selectElement.id.startsWith('filtro-');
        
        selectElement.innerHTML = `<option value="">${isFilter ? "Todos" : "Selecione..."}</option>`;
        
        listaTecnicos.forEach(t => {
            const opt = document.createElement('option'); 
            opt.value = t.id; 
            opt.textContent = t.nome_completo;
            if(t.id == selectedId) opt.selected = true;
            selectElement.appendChild(opt);
        });
    }

    function renderTecnicosTabela(tecnicos) {
        if(!tecnicosTableBody) return;
        tecnicosTableBody.innerHTML = '';
        if (tecnicos.length === 0) { 
            tecnicosTableBody.innerHTML = '<tr><td colspan="3">Nenhum técnico ativo.</td></tr>'; 
            return; 
        }
        tecnicos.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${t.nome_completo}</td>
                <td>${t.email || '-'}</td>
                <td class="coluna-acoes">
                    <button class="btn-acao btn-delete btn-delete-tecnico" data-id="${t.id}">Remover</button>
                </td>`;
            tecnicosTableBody.appendChild(row);
        });
    }


    // ======================================================
    // 12. MÓDULO FINANCEIRO
    // ======================================================

    async function fetchFinanceiro() {
        try {
            const hoje = new Date();
            
            const resResumo = await fetch(`${API_BASE_URL}/financeiro/resumo?mes=${hoje.getMonth()+1}&ano=${hoje.getFullYear()}`, { headers: getAuthHeaders(false) });
            const dResumo = await resResumo.json();
            
            if(displayEntradas) {
                displayEntradas.textContent = `R$ ${dResumo.entradas.toFixed(2)}`;
                displaySaidas.textContent = `R$ ${dResumo.saidas.toFixed(2)}`;
                displayLucro.textContent = `R$ ${dResumo.lucro.toFixed(2)}`;
                displayLucro.style.color = dResumo.lucro >= 0 ? '#28a745' : '#dc3545';
            }
            
            const resDespesas = await fetch(`${API_BASE_URL}/financeiro/despesas`, { headers: getAuthHeaders(false) });
            const despesas = await resDespesas.json();
            
            if(despesasTableBody) {
                despesasTableBody.innerHTML = '';
                if (despesas.length === 0) {
                    despesasTableBody.innerHTML = '<tr><td colspan="4">Nenhuma despesa registrada.</td></tr>';
                } else {
                    despesas.forEach(x => {
                        despesasTableBody.innerHTML += `
                        <tr>
                            <td>${new Date(x.data_despesa).toLocaleDateString('pt-BR')}</td>
                            <td>${x.descricao}<br><small style="color:#888">${x.categoria}</small></td>
                            <td style="color:#dc3545; font-weight:bold;">R$ -${parseFloat(x.valor).toFixed(2)}</td>
                            <td><button class="btn-acao btn-delete btn-delete-despesa" data-id="${x.id}">&times;</button></td>
                        </tr>`;
                    });
                }
            }
        } catch(e) { 
            console.error("Erro Financeiro:", e); 
        }
    }


    // ======================================================
    // 13. DASHBOARD INTELIGENTE
    // ======================================================
    
    Chart.defaults.color = '#cccccc';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    async function fetchDashboardData() {
        if (!authToken) return; 
        
        if (statusChart) statusChart.destroy();
        if (faturamentoChart) faturamentoChart.destroy();
        if (tecnicoChart) tecnicoChart.destroy();
        if (dispositivosChart) dispositivosChart.destroy();

        // Se os elementos do DOM não existirem (ex: em outra página), não tenta renderizar
        if (!ctxStatus || !ctxFaturamento || !ctxTecnicos || !ctxDispositivos) return;

        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/estatisticas`, { headers: getAuthHeaders(false) });
            const data = await response.json();

            if(ctxStatus) statusChart = new Chart(ctxStatus, {
                type: 'doughnut', 
                data: {
                    labels: data.osPorStatus.map(i=>i.status),
                    datasets: [{ 
                        data: data.osPorStatus.map(i=>i.contagem), 
                        backgroundColor: ['#ffc107','#007bff','#28a745','#dc3545','#9e46ff','#fd7e14'], 
                        borderWidth: 0 
                    }]
                },
                options: { plugins: { legend: { position: 'right' } } }
            });

            if(ctxFaturamento) faturamentoChart = new Chart(ctxFaturamento, {
                type: 'line',
                data: {
                    labels: data.faturamento7Dias.map(i=> new Date(i.data).toLocaleDateString('pt-BR').slice(0,5)),
                    datasets: [{ 
                        label: 'Receita (R$)', 
                        data: data.faturamento7Dias.map(i=>i.faturamento), 
                        borderColor: '#9e46ff', 
                        tension: 0.3, 
                        fill: true, 
                        backgroundColor: 'rgba(158, 70, 255, 0.2)' 
                    }]
                },
                options: { 
                    plugins: { legend: { display: false } }, 
                    scales: { y: { beginAtZero: true } } 
                }
            });

            if(ctxTecnicos) tecnicoChart = new Chart(ctxTecnicos, {
                type: 'bar',
                data: {
                    labels: data.tecnicoPerformance.map(i=>i.nome_completo),
                    datasets: [{ 
                        label: 'OS Concluídas', 
                        data: data.tecnicoPerformance.map(i=>i.contagem), 
                        backgroundColor: '#007bff' 
                    }]
                },
                options: { indexAxis: 'y', plugins: { legend: { display: false } } }
            });
            
            if(ctxDispositivos) dispositivosChart = new Chart(ctxDispositivos, {
                type: 'bar',
                data: {
                    labels: data.topDispositivos.map(i=>i.tipo),
                    datasets: [{ 
                        label: 'Recebidos', 
                        data: data.topDispositivos.map(i=>i.contagem), 
                        backgroundColor: '#9e46ff' 
                    }]
                },
                options: { indexAxis: 'y', plugins: { legend: { display: false } } }
            });

        } catch (error) { console.error("Erro Dashboard", error); }
    }


    // ======================================================
    // 14. MODAL GERENCIADOR (DETALHES DA O.S.)
    // ======================================================

    function openGerenciadorModal(id) {
        const os = listaOrdens.find(o => o.id == id);
        if (!os) return;

        modalOsIdSpan.textContent = id;
        modalOsStatusSelect.value = os.status || 'Orçamento';
        
        detalhesOsIdHidden.value = id;
        detalhesLaudo.value = os.laudo_tecnico || '';
        detalhesAcessorios.value = os.acessorios || '';
        detalhesGarantia.value = os.termo_garantia || '';
        detalhesDesconto.value = parseFloat(os.valor_desconto || 0).toFixed(2);
        detalhesTecnicoSelect.value = os.id_tecnico || '';
        
        itemOsIdHidden.value = id;
        uploadOsIdHidden.value = id;

        if(!signaturePad) signaturePad = new SignaturePad(signatureCanvas);
        signaturePad.clear();
        
        fetchItens(id); 
        fetchImagens(id); 
        fetchHistorico(id);
        
        modalBackdrop.classList.remove('hidden');
        
        // Reseta para primeira aba
        const tabItens = document.querySelector('[data-tab="tab-itens"]');
        if(tabItens) tabItens.click();
    }

    // Fetch Itens
    async function fetchItens(id) {
        itensTableBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
        const res = await fetch(`${API_BASE_URL}/ordens/${id}/itens`, { headers:getAuthHeaders(false) });
        const itens = await res.json();
        itensTableBody.innerHTML = '';
        
        if (itens.length === 0) {
            itensTableBody.innerHTML = '<tr><td colspan="6">Nenhum item.</td></tr>';
        } else {
            itens.forEach(i => {
                itensTableBody.innerHTML += `
                    <tr>
                        <td>${i.tipo}</td>
                        <td>${i.descricao}</td>
                        <td>${i.quantidade}</td>
                        <td>R$ ${parseFloat(i.valor_unitario).toFixed(2)}</td>
                        <td>R$ ${parseFloat(i.valor_total).toFixed(2)}</td>
                        <td><button class="btn-delete-item" data-id="${i.id}" style="color:red;border:none;background:none;cursor:pointer;">&times;</button></td>
                    </tr>`;
            });
        }
    }

    // Fetch Imagens
    async function fetchImagens(id) {
        existingImagesList.innerHTML = 'Carregando...';
        const res = await fetch(`${API_BASE_URL}/ordens/${id}/imagens`, { headers:getAuthHeaders(false) });
        const imgs = await res.json();
        existingImagesList.innerHTML = '';
        
        if (imgs.length === 0) {
            existingImagesList.innerHTML = '<p>Sem imagens.</p>';
        } else {
            imgs.forEach(i => {
                existingImagesList.innerHTML += `<a href="${i.url_publica}" target="_blank" class="thumbnail-link"><img src="${i.url_publica}" class="thumbnail-img"></a>`;
            });
        }
    }

    // Fetch Histórico
    async function fetchHistorico(id) {
        osHistoryList.innerHTML = '<li>Carregando...</li>';
        const res = await fetch(`${API_BASE_URL}/ordens/${id}/historico`, { headers:getAuthHeaders(false) });
        const hist = await res.json();
        osHistoryList.innerHTML = '';
        
        if (hist.length === 0) {
            osHistoryList.innerHTML = '<li>Sem histórico.</li>';
        } else {
            hist.forEach(h => {
                osHistoryList.innerHTML += `<li>${h.acao} <span class="history-meta">Em ${new Date(h.data_acao).toLocaleString()} por <strong>${h.tecnico_nome||'Sistema'}</strong></span></li>`;
            });
        }
    }

    function resizeSignatureCanvas() {
        if (!signaturePad) return;
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);
        signatureCanvas.width = signatureCanvas.offsetWidth * ratio;
        signatureCanvas.height = signatureCanvas.offsetHeight * ratio;
        signatureCanvas.getContext("2d").scale(ratio, ratio);
        signaturePad.fromDataURL(signaturePad.toDataURL());
    }


    // ======================================================
    // 15. TODOS OS EVENT LISTENERS (BOTÕES E AÇÕES)
    // ======================================================

    formLogin.addEventListener('submit', handleLoginSubmit);
    btnLogout.addEventListener('click', handleLogout);
    
    // IMPORTANTE: A correção do erro de navegação é aplicada aqui
    sidebarLinks.forEach(link => link.addEventListener('click', handleNavClick));

    formCliente.addEventListener('submit', handleClienteSubmit);
    formDispositivo.addEventListener('submit', handleDispositivoSubmit);
    formOS.addEventListener('submit', handleOsSubmit); 
    
    btnRefreshClientes.addEventListener('click', fetchClientes);
    btnRefreshOS.addEventListener('click', () => fetchOrdens());
    btnRefreshDispositivos.addEventListener('click', fetchDispositivos); 
    if(btnRefreshDashboard) btnRefreshDashboard.addEventListener('click', fetchDashboardData);
    if(btnRefreshFinanceiro) btnRefreshFinanceiro.addEventListener('click', fetchFinanceiro);
    if(btnRefreshTecnicos) btnRefreshTecnicos.addEventListener('click', fetchTecnicos);

    if (btnShowOsModal) btnShowOsModal.addEventListener('click', openCreateOsModal);
    if (btnModalCloseOs) btnModalCloseOs.addEventListener('click', closeCreateOsModal);

    // Filtros
    formFiltrosOS.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        fetchOrdens(Object.fromEntries(new FormData(formFiltrosOS))); 
    });
    btnLimparFiltros.addEventListener('click', () => { formFiltrosOS.reset(); fetchOrdens(); });

    osSelectCliente.addEventListener('change', (e) => fetchDispositivosParaOS(e.target.value));
    osSelectDispositivo.addEventListener('change', (e) => { 
        if(e.target.value) { 
            osDisplayDefeito.textContent = e.target.options[e.target.selectedIndex].dataset.defeito; 
            btnSubmitOS.disabled = false; 
        }
    });
    
    if(cepInput) cepInput.addEventListener('blur', handleCepBlur);

    osTableBody.addEventListener('click', async (e) => {
        const t = e.target.closest('button');
        if(!t) return;
        
        const id = t.dataset.osId;
        
        if(t.classList.contains('btn-upload')) openGerenciadorModal(id);
        
        if(t.classList.contains('btn-delete-os')) handleDeleteOS(id);
        
        if(t.classList.contains('btn-doc')) {
            t.textContent = '...';
            t.disabled = true;
            try {
                const r = await fetch(`${API_BASE_URL}/ordens/${id}/gerar-documento`, { headers: getAuthHeaders(false) });
                if(r.ok) window.open(window.URL.createObjectURL(await r.blob()));
            } catch (err) { showMessage(null, 'error', 'Erro PDF'); }
            t.textContent = 'PDF';
            t.disabled = false;
        }
        
        if(t.classList.contains('btn-whatsapp')) {
            const tel = t.dataset.telefone;
            const os = listaOrdens.find(o => o.id == id);
            const msg = `Olá ${os.nome_completo}! HL Tech informa: Sua OS #${id} está com status: *${os.status}*. Valor Total: R$ ${parseFloat(os.valor_total).toFixed(2)}.`;
            window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`);
        }
    });

    if(clientTableBody) clientTableBody.addEventListener('click', (e) => { 
        if(e.target.classList.contains('btn-delete-cliente')) handleDeleteCliente(e.target.dataset.clienteId); 
    });
    if(dispositivoTableBody) dispositivoTableBody.addEventListener('click', (e) => { 
        if(e.target.classList.contains('btn-delete-dispositivo')) handleDeleteDispositivo(e.target.dataset.dispositivoId); 
    });

    async function handleDeleteOS(id) {
        if(await showCustomConfirm('Excluir OS', 'Essa ação é irreversível.')) {
            await fetch(`${API_BASE_URL}/ordens/${id}`, { method: 'DELETE', headers: getAuthHeaders(false) });
            fetchOrdens();
        }
    }
    async function handleDeleteCliente(id) {
        if(await showCustomConfirm('Excluir Cliente', 'Confirma a exclusão?')) {
            await fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE', headers: getAuthHeaders(false) });
            fetchClientes();
        }
    }
    async function handleDeleteDispositivo(id) {
        if(await showCustomConfirm('Excluir Dispositivo', 'Confirma a exclusão?')) {
            await fetch(`${API_BASE_URL}/dispositivos/${id}`, { method: 'DELETE', headers: getAuthHeaders(false) });
            fetchDispositivos();
        }
    }


    // ======================================================
    // 16. LISTENERS DO MODAL GERENCIADOR
    // ======================================================

    btnModalClose.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
    
    btnUpdateStatus.addEventListener('click', async () => {
        await fetch(`${API_BASE_URL}/ordens/${modalOsIdSpan.textContent}/status`, { 
            method:'PUT', headers:getAuthHeaders(), 
            body:JSON.stringify({status:modalOsStatusSelect.value}) 
        });
        showMessage(messageAreaStatus, 'success', 'Status Atualizado!'); 
        fetchOrdens(); 
        fetchHistorico(modalOsIdSpan.textContent);
    });
    
    formOsDetalhes.addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE_URL}/ordens/${detalhesOsIdHidden.value}/detalhes`, { 
            method:'PUT', headers:getAuthHeaders(), 
            body:JSON.stringify(Object.fromEntries(new FormData(formOsDetalhes))) 
        });
        showMessage(messageAreaDetalhes, 'success', 'Detalhes Salvos!'); 
        fetchOrdens();
    });

    modalTabsContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('tab-button')) {
            tabButtons.forEach(b=>b.classList.remove('active')); 
            tabContents.forEach(c=>c.classList.remove('active'));
            e.target.classList.add('active'); 
            document.getElementById(e.target.dataset.tab).classList.add('active');
            
            if(e.target.dataset.tab === 'tab-assinatura') resizeSignatureCanvas();
        }
    });

    formUpload.addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE_URL}/ordens/${uploadOsIdHidden.value}/upload`, { 
            method:'POST', headers:{'Authorization':`Bearer ${authToken}`}, 
            body:new FormData(formUpload) 
        });
        fetchImagens(uploadOsIdHidden.value); 
        fetchHistorico(uploadOsIdHidden.value); 
        formUpload.reset();
    });
    
    formAddItem.addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE_URL}/ordens/${itemOsIdHidden.value}/itens`, { 
            method:'POST', headers:getAuthHeaders(), 
            body:JSON.stringify(Object.fromEntries(new FormData(formAddItem))) 
        });
        fetchItens(itemOsIdHidden.value); 
        fetchOrdens(); 
        fetchHistorico(itemOsIdHidden.value); 
        formAddItem.reset();
    });
    
    itensTableBody.addEventListener('click', async (e) => {
        if(e.target.classList.contains('btn-delete-item')) {
            if(await showCustomConfirm('Remover Item', 'Confirma?')) {
                await fetch(`${API_BASE_URL}/ordens/itens/${e.target.dataset.id}`, { method:'DELETE', headers:getAuthHeaders(false) });
                fetchItens(itemOsIdHidden.value); 
                fetchOrdens();
            }
        }
    });
    
    btnSaveSignature.addEventListener('click', async () => {
        if(signaturePad.isEmpty()) return showMessage(messageAreaAssinatura, 'error', 'Assinatura vazia.');
        
        showMessage(messageAreaAssinatura, 'loading', 'Salvando...');
        await fetch(`${API_BASE_URL}/ordens/${modalOsIdSpan.textContent}/salvar-assinatura`, { 
            method:'POST', headers:getAuthHeaders(), 
            body:JSON.stringify({ assinaturaBase64: signaturePad.toDataURL() }) 
        });
        
        showMessage(messageAreaAssinatura, 'success', 'Assinatura Salva!'); 
        fetchHistorico(modalOsIdSpan.textContent);
    });
    
    btnClearSignature.addEventListener('click', () => signaturePad.clear());
    window.addEventListener('resize', resizeSignatureCanvas);


    // ======================================================
    // 17. LISTENERS EXTRAS (Busca, Equipe, Financeiro)
    // ======================================================

    let searchTimeout;
    if(globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const termo = e.target.value;
            
            if(termo.length < 3) { searchResultsDropdown.classList.add('hidden'); return; }
            
            searchTimeout = setTimeout(async () => {
                searchResultsDropdown.classList.remove('hidden'); 
                searchResultsDropdown.innerHTML='<div class="search-result-item">Buscando...</div>';
                
                try {
                    const r = await fetch(`${API_BASE_URL}/busca-global?termo=${termo}`, { headers:getAuthHeaders(false) });
                    const d = await r.json();
                    
                    searchResultsDropdown.innerHTML='';
                    if(!d.ordens.length && !d.clientes.length && !d.dispositivos.length) {
                        searchResultsDropdown.innerHTML='<div class="search-result-item">Nada encontrado.</div>';
                        return;
                    }
                    
                    const add = (txt, fn) => { 
                        const el = document.createElement('div'); 
                        el.className = 'search-result-item'; 
                        el.innerHTML = txt; 
                        el.onclick = fn; 
                        searchResultsDropdown.appendChild(el); 
                    };
                    
                    if(d.ordens.length) d.ordens.forEach(o => add(`<b>OS #${o.id}</b> - ${o.nome_completo}`, () => { openGerenciadorModal(o.id); searchResultsDropdown.classList.add('hidden'); globalSearchInput.value=''; }));
                    if(d.clientes.length) d.clientes.forEach(c => add(`<b>Cli:</b> ${c.nome_completo}`, () => { document.querySelector('[data-page="page-clientes"]').click(); searchResultsDropdown.classList.add('hidden'); globalSearchInput.value=''; }));
                    if(d.dispositivos.length) d.dispositivos.forEach(dev => add(`<b>Dev:</b> ${dev.marca_modelo}`, () => { document.querySelector('[data-page="page-dispositivos"]').click(); searchResultsDropdown.classList.add('hidden'); globalSearchInput.value=''; }));
                
                } catch(err) { searchResultsDropdown.innerHTML='<div class="search-result-item">Erro na busca.</div>'; }
            }, 500);
        });
        
        document.addEventListener('click', (e) => { 
            if(!globalSearchInput.contains(e.target)) searchResultsDropdown.classList.add('hidden'); 
        });
    }

    if(formTecnico) {
        formTecnico.addEventListener('submit', async (e) => {
            e.preventDefault();
            await fetch(`${API_BASE_URL}/tecnicos`, { method:'POST', headers:getAuthHeaders(), body:JSON.stringify(Object.fromEntries(new FormData(formTecnico))) });
            formTecnico.reset(); fetchTecnicos();
            showMessage(messageAreaTecnico, 'success', 'Técnico Salvo!');
        });
    }
    
    if(formDespesa) {
        formDespesa.addEventListener('submit', async (e) => {
            e.preventDefault();
            await fetch(`${API_BASE_URL}/financeiro/despesas`, { method:'POST', headers:getAuthHeaders(), body:JSON.stringify(Object.fromEntries(new FormData(formDespesa))) });
            formDespesa.reset(); 
            document.getElementById('data-despesa').valueAsDate = new Date();
            fetchFinanceiro();
            showMessage(messageAreaFinanceiro, 'success', 'Despesa Salva!');
        });
    }

    if(despesasTableBody) {
        despesasTableBody.addEventListener('click', async (e) => {
            if(e.target.classList.contains('btn-delete-despesa')) {
                if(await showCustomConfirm('Apagar Despesa?', 'Isso afetará o cálculo de lucro.')) {
                    await fetch(`${API_BASE_URL}/financeiro/despesas/${e.target.dataset.id}`, { method:'DELETE', headers:getAuthHeaders(false) });
                    fetchFinanceiro();
                }
            }
        });
    }


    // ======================================================
    // 18. TEMA CLARO / ESCURO
    // ======================================================
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const loginLogo = document.getElementById('login-logo');
    const sidebarLogo = document.getElementById('sidebar-logo');

    const logoDark = 'logo-navbar.svg'; 
    const logoLight = 'logo-navbar-light.svg'; 

    if (localStorage.getItem('hltech_theme') === 'light') {
        document.body.classList.add('light-mode');
        atualizarCoresGraficos(true); 
        if (loginLogo) loginLogo.src = logoLight;
        if (sidebarLogo) sidebarLogo.src = logoLight;
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            
            localStorage.setItem('hltech_theme', isLight ? 'light' : 'dark');
            
            if (loginLogo) loginLogo.src = isLight ? logoLight : logoDark;
            if (sidebarLogo) sidebarLogo.src = isLight ? logoLight : logoDark;
            
            atualizarCoresGraficos(isLight);
        });
    }

    function atualizarCoresGraficos(isLight) {
        const corTexto = isLight ? '#333333' : '#cccccc';
        const corBorda = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        
        Chart.defaults.color = corTexto;
        Chart.defaults.borderColor = corBorda;
        
        if (typeof statusChart !== 'undefined' && statusChart) statusChart.update();
        if (typeof faturamentoChart !== 'undefined' && faturamentoChart) faturamentoChart.update();
        if (typeof tecnicoChart !== 'undefined' && tecnicoChart) tecnicoChart.update();
        if (typeof dispositivosChart !== 'undefined' && dispositivosChart) dispositivosChart.update();
    }

    // ======================================================
    // 19. INICIALIZAÇÃO
    // ======================================================
    checkLoginStatus();

});