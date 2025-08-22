  function abrirFormulario(especialidade) {
            // Esconder página home
            document.getElementById('home-page').style.display = 'none';
            
            // Mostrar página do formulário específico
            document.getElementById(especialidade).classList.add('active');
            
            // Scroll para o topo
            window.scrollTo(0, 0);
        }

        function voltarHome() {
            // Esconder todas as páginas de formulário
            const formPages = document.querySelectorAll('.form-page');
            formPages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Mostrar página home
            document.getElementById('home-page').style.display = 'block';
            
            // Scroll para o topo
            window.scrollTo(0, 0);
        }

        function enviarFormulario(event, especialidade) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const dados = Object.fromEntries(formData);
            
            // Aqui você pode implementar o envio real dos dados
            alert(`Obrigado pelo seu interesse em ${especialidade}!\n\nSeus dados foram recebidos e entraremos em contato em breve.\n\nDados enviados:\nNome: ${dados.nome}\nEmail: ${dados.email}\nTelefone: ${dados.telefone}`);
            
            // Limpar formulário
            event.target.reset();
            
            // Voltar para home
            voltarHome();
        }

        function enviarContato(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const dados = Object.fromEntries(formData);
            
            alert(`Obrigado pelo seu contato!\n\nSua mensagem foi recebida e responderemos em breve.\n\nDados enviados:\nNome: ${dados.nome}\nEmail: ${dados.email}\nAssunto: ${dados.assunto}`);
            
            // Limpar formulário
            event.target.reset();
        }

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
   