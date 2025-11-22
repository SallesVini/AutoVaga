document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const form = document.querySelector("#cadastroVeiculoModal form");
    const tempoInput = document.getElementById("tempo");
    const valorInput = document.getElementById("valor");
    const modalEl = document.getElementById("cadastroVeiculoModal");

    // Função para resetar campos do modal
    function resetModal() {
        tempoInput.value = "00:00";  // tempo zerado
        valorInput.value = "00,00";  // valor zerado na exibição
        form.querySelectorAll("input").forEach(input => {
            if (!["tempo", "valor"].includes(input.id)) {
                input.value = "";
            }
        });
    }

    // Resetar campos quando o modal abrir
    modalEl.addEventListener('show.bs.modal', resetModal);

    // Buscar endereço pelo CEP
    cepInput.addEventListener("blur", () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) return;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) return;
                document.getElementById("endereco").value = data.logradouro ?? "";
                document.getElementById("bairroCidade").value = `${data.bairro ?? ""} / ${data.localidade ?? ""}`;
            })
            .catch(err => console.error("Erro ao buscar CEP:", err));
    });

    // Enviar dados para o backend
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const numeroVaga = parseInt(form.querySelector("#vaga").value) || 0;
        const valor = parseFloat(valorInput.value.replace(",", ".")) || 0;
        const dataEntrada = form.querySelector("#entrada").value || new Date().toISOString();

        // Monta dados do veículo
        const veiculoData = {
            placa: form.querySelector("#placa").value.trim(),
            modelo: form.querySelector("#modelo").value.trim(),
            cor: form.querySelector("#cor").value.trim(),
            numero_vaga: numeroVaga,
            data_entrada: dataEntrada,
            data_saida: form.querySelector("#saida").value || null,
            tempo_estimado: tempoInput.value || "00:00",  // envia 00:00 se vazio
            valor: valor,                                // envia 0 se vazio
            responsavel: form.querySelector("#responsavel").value.trim() || "Não informado"
        };

        // Monta dados do endereço
        const enderecoData = {
            cep: form.querySelector("#cep").value.trim(),
            logradouro: form.querySelector("#endereco").value.trim(),
            bairro_cidade: form.querySelector("#bairroCidade").value.trim()
        };

        try {
            // Criar Endereço
            const enderecoRes = await fetch("http://127.0.0.1:8000/enderecos/criar/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enderecoData)
            });
            const endereco = await enderecoRes.json();
            if (!endereco.sucesso) throw new Error(endereco.mensagem);

            // Criar Veículo
            veiculoData.endereco = endereco.id;
            const veiculoRes = await fetch("http://127.0.0.1:8000/veiculos/criar/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(veiculoData)
            });
            const veiculo = await veiculoRes.json();
            if (!veiculo.sucesso) throw new Error(veiculo.mensagem);

            // Fechar modal e atualizar tabela
            alert("Veículo cadastrado com sucesso!");
            form.reset();
            resetModal();
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            carregarVeiculos();
        } catch (err) {
            console.error("Erro ao salvar veículo:", err);
            alert(`Erro ao salvar veículo: ${err.message}`);
        }
    });
});
