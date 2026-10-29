
    const botoes = document.querySelectorAll('.filtro');
    const imagens = document.querySelectorAll('.miniatura');
    const galeria = document.querySelector('.galeria');
    const total = document.querySelector('#totalImagens');

    const modal = document.querySelector('#modal');
    const fechar = document.querySelector('#fechar');
    const anterior = document.querySelector('#anterior');
    const proximo = document.querySelector('#proximo');

    const imagemModal = document.querySelector('#imagemModal');
    const contador = document.querySelector('#contador');
    const nome = document.querySelector('#nomeImagem');
    const descricao = document.querySelector('#descricaoImagem');
    const categoria = document.querySelector('#categoriaImagem');
    const local = document.querySelector('#localImagem');

    let visiveis = [];
    let indice = 0;

    const classes = [...imagens].map(img => ({
        destaque: img.classList.contains('destaque'),
        horizontal: img.classList.contains('horizontal'),
        vertical: img.classList.contains('vertical')
    }));

    function atualizar() {
        visiveis = [...imagens].filter(img => !img.classList.contains('oculta'));
        total.textContent = `Exibindo ${visiveis.length} de ${imagens.length} imagens`;
    }

    function filtrar(filtro) {
        fecharModal();

        galeria.classList.toggle('filtro-simples', filtro !== 'todas');

        imagens.forEach((img, i) => {
            img.classList.remove('destaque', 'horizontal', 'vertical');

            if (filtro === 'todas') {
                Object.keys(classes[i]).forEach(classe => {
                    if (classes[i][classe]) img.classList.add(classe);
                });
            }

            img.classList.toggle(
                'oculta',
                filtro !== 'todas' && img.dataset.categoria.toLowerCase() !== filtro
            );
            img.tabIndex = img.classList.contains('oculta') ? -1 : 0;
        });

        botoes.forEach(btn => btn.classList.toggle('ativo', btn.dataset.filtro === filtro));

        atualizar();
        indice = 0;
    }

    function mostrar(i) {
        if (!visiveis.length) return;

        indice = (i + visiveis.length) % visiveis.length;
        const img = visiveis[indice];

        imagemModal.src = img.src;
        imagemModal.alt = img.alt;
        nome.textContent = img.dataset.titulo || img.alt;
        descricao.textContent = img.dataset.descricao || 'Sem descrição.';
        categoria.textContent = img.dataset.categoria || 'Sem categoria';
        local.textContent = img.dataset.local || 'Não informado';
        contador.textContent = `${indice + 1} de ${visiveis.length}`;
    }

    function abrir(img) {
        atualizar();
        indice = visiveis.indexOf(img);
        if (indice < 0) return;

        mostrar(indice);
        modal.classList.add('ativo');
        modal.setAttribute('aria-hidden', 'false');
        fechar.focus();
    }

    function fecharModal() {
        modal.classList.remove('ativo');
        modal.setAttribute('aria-hidden', 'true');
    }

    botoes.forEach(btn =>
        btn.addEventListener('click', () => filtrar(btn.dataset.filtro))
    );

    imagens.forEach(img =>
        img.addEventListener('click', () => abrir(img))
    );

    fechar.addEventListener('click', fecharModal);
    anterior.addEventListener('click', () => mostrar(indice - 1));
    proximo.addEventListener('click', () => mostrar(indice + 1));

    modal.addEventListener('click', e => {
        if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('ativo')) return;

        if (e.key === 'Escape') fecharModal();
        if (e.key === 'ArrowLeft') mostrar(indice - 1);
        if (e.key === 'ArrowRight') mostrar(indice + 1);
    });

    filtrar('todas');
