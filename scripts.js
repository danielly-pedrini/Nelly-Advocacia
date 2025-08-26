document.addEventListener('DOMContentLoaded', function () {
  inicializarSistema();
});

// INICIALIZAÇÃO DO SISTEMA

function inicializarSistema() {
  criarContainerNotificacoes();
  inicializarNavegacao();
  inicializarValidacao();
  configurarScrollSuave();
  animarCards();
}

// SISTEMA DE NOTIFICAÇÕES

function criarContainerNotificacoes() {
  if (!document.getElementById('notification-container')) {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
}

function mostrarNotificacao(
  titulo,
  mensagem,
  tipo = 'success',
  duracao = 2000
) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;

  notification.innerHTML = `
        <button class="notification-close" onclick="fecharNotificacao(this)">&times;</button>
        <div class="notification-title">${titulo}</div>
        <div class="notification-message">${mensagem}</div>
    `;

  container.appendChild(notification);

  // Auto-remover após duração especificada
  setTimeout(() => {
    if (notification.parentNode) {
      fecharNotificacao(notification.querySelector('.notification-close'));
    }
  }, duracao);

  return notification;
}

function fecharNotificacao(botao) {
  const notification = botao.closest('.notification');
  if (notification) {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }
}

// NAVEGAÇÃO E MENU MOBILE

function inicializarNavegacao() {
  // Criar menu hambúrguer se não existir
  criarMenuHamburger();

  // Event listeners para navegação
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Fechar menu mobile ao clicar em link
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      fecharMobileMenu();
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', e => {
    if (
      !e.target.closest('nav') &&
      mobileMenu &&
      mobileMenu.classList.contains('active')
    ) {
      fecharMobileMenu();
    }
  });
}

function criarMenuHamburger() {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');

  if (!nav || !navLinks) return;

  // Verificar se já existe
  if (document.querySelector('.hamburger')) return;

  // Criar hamburger
  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  // Criar menu mobile
  const mobileMenu = document.createElement('ul');
  mobileMenu.className = 'mobile-menu';

  // Copiar links para menu mobile
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    li.appendChild(a);
    mobileMenu.appendChild(li);
  });

  nav.appendChild(hamburger);
  nav.appendChild(mobileMenu);
}

function toggleMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  }
}

function fecharMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
}

// SISTEMA DE VALIDAÇÃO EM TEMPO REAL

function inicializarValidacao() {
  // Validação em tempo real para todos os inputs
  document.addEventListener('input', function (e) {
    if (e.target.matches('input, textarea, select')) {
      validarCampo(e.target);
    }
  });

  // Formatação automática para telefone
  document.addEventListener('input', function (e) {
    if (e.target.type === 'tel') {
      formatarTelefone(e.target);
    }
  });
}

function validarCampo(campo) {
  const formGroup = campo.closest('.form-group');
  if (!formGroup) return;

  let isValid = true;
  let mensagemErro = '';

  // Remover classes anteriores
  formGroup.classList.remove('valid', 'invalid');

  // Validações específicas por tipo
  switch (campo.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(campo.value);
      mensagemErro = 'Por favor, insira um email válido.';
      break;

    case 'tel':
      const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      isValid = telefoneRegex.test(campo.value) && campo.value.length >= 14;
      mensagemErro = 'Formato: (11) 99999-9999';
      break;

    case 'text':
      if (campo.name === 'nome') {
        isValid =
          campo.value.trim().length >= 3 &&
          /^[a-zA-ZÀ-ÿ\s]+$/.test(campo.value);
        mensagemErro = 'Nome deve ter pelo menos 3 caracteres (apenas letras).';
      } else {
        isValid = campo.value.trim().length > 0;
        mensagemErro = 'Este campo é obrigatório.';
      }
      break;

    default:
      if (campo.tagName.toLowerCase() === 'textarea') {
        isValid = campo.value.trim().length >= 10;
        mensagemErro = 'Mensagem deve ter pelo menos 10 caracteres.';
      } else if (campo.tagName.toLowerCase() === 'select') {
        isValid = campo.value !== '';
        mensagemErro = 'Por favor, selecione uma opção.';
      } else if (campo.required) {
        isValid = campo.value.trim().length > 0;
        mensagemErro = 'Este campo é obrigatório.';
      }
  }

  // Aplicar resultado da validação
  if (isValid && campo.value.trim() !== '') {
    formGroup.classList.add('valid');
  } else if (campo.value.trim() !== '') {
    formGroup.classList.add('invalid');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = mensagemErro;
    }
  }

  return isValid;
}

function formatarTelefone(input) {
  let valor = input.value.replace(/\D/g, '');

  if (valor.length <= 11) {
    if (valor.length <= 2) {
      valor = valor.replace(/(\d{0,2})/, '($1');
    } else if (valor.length <= 6) {
      valor = valor.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  }

  input.value = valor;
}

function validarFormulario(form) {
  const campos = form.querySelectorAll(
    'input[required], textarea[required], select[required]'
  );
  let formularioValido = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      formularioValido = false;
    }
  });

  return formularioValido;
}

// ENVIO DO FORMULÁRIO DE CONTATO

function enviarContato(event) {
  event.preventDefault();

  const form = event.target;
  const botao = form.querySelector('.btn');

  // Validar formulário
  if (!validarFormulario(form)) {
    mostrarNotificacao(
      'Erro na Validação',
      'Por favor, preencha todos os campos obrigatórios corretamente.',
      'error'
    );
    return;
  }

  // Estado de loading
  botao.classList.add('loading');
  botao.disabled = true;

  // Simular envio (aqui você integraria com seu backend)
  setTimeout(() => {
    const dados = new FormData(form);
    const dadosObj = Object.fromEntries(dados.entries());

    console.log('Dados do contato:', dadosObj);

    // Resetar estado do botão
    botao.classList.remove('loading');
    botao.disabled = false;

    // Mostrar sucesso
    mostrarNotificacao(
      'Mensagem Enviada!',
      'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.',
      'success',
      5000
    );

    // Resetar formulário
    form.reset();
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('valid', 'invalid');
    });
  }, 1500); // Simular tempo de processamento
}

// INTERAÇÃO COM CARDS DE ESPECIALIDADES

function abrirFormulario(especialidadeId) {
  // Scroll para o formulário de contato
  const contatoSection = document.getElementById('contato');
  if (contatoSection) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = contatoSection.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    // Mostrar mensagem informativa
    setTimeout(() => {
      const especialidades = {
        'direito-civil': 'Direito Civil',
        'direito-trabalhista': 'Direito Trabalhista',
        'direito-penal': 'Direito Penal',
        'direito-familia': 'Direito de Família',
        'direito-empresarial': 'Direito Empresarial',
        'direito-imobiliario': 'Direito Imobiliário',
      };

      const especialidade =
        especialidades[especialidadeId] || 'esta especialidade';

      mostrarNotificacao(
        `${especialidade}`,
        `Preencha o formulário abaixo para consulta sobre ${especialidade.toLowerCase()}.`,
        'success',
        3000
      );

      // Pré-selecionar o assunto sempre
      const assuntoField = document.getElementById('assunto-contato');
      if (assuntoField) {
        // Mapear o ID da especialidade para o valor do select
        const mapeamentoEspecialidades = {
          'direito-civil': 'Direito Civil',
          'direito-trabalhista': 'Direito Trabalhista',
          'direito-penal': 'Direito Penal',
          'direito-familia': 'Direito de Família',
          'direito-empresarial': 'Direito Empresarial',
          'direito-imobiliario': 'Direito Imobiliário',
        };

        const valorSelect = mapeamentoEspecialidades[especialidadeId];
        if (valorSelect) {
          assuntoField.value = valorSelect;
          validarCampo(assuntoField);
        }
      }
    }, 800);
  }
}

// NAVEGAÇÃO SUAVE

function configurarScrollSuave() {
  document.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();

      const targetId = e.target.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Fechar menu mobile se estiver aberto
        fecharMobileMenu();

        // Scroll suave
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }
  });
}

// ANIMAÇÕES E EFEITOS ESPECIAIS

function animarCards() {
  const cards = document.querySelectorAll('.especialidade-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = `slideInUp 0.6s ease forwards`;
          entry.target.style.opacity = '1';
        }, index * 100);
      }
    });
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  });
}

// UTILITÁRIOS

function isMobile() {
  return window.innerWidth <= 768;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Otimizar redimensionamento da tela
window.addEventListener(
  'resize',
  debounce(() => {
    if (!isMobile()) {
      fecharMobileMenu();
    }
  }, 250)
);

// TRATAMENTO DE ERROS GLOBAL

window.addEventListener('error', function (e) {
  console.error('Erro JavaScript:', e.error);
  mostrarNotificacao(
    'Erro Técnico',
    'Ocorreu um erro inesperado. Por favor, recarregue a página.',
    'error'
  );
});

// FUNÇÕES EXPORTADAS (para uso no HTML)

window.abrirFormulario = abrirFormulario;
window.enviarContato = enviarContato;
window.mostrarNotificacao = mostrarNotificacao;
window.fecharNotificacao = fecharNotificacao;
