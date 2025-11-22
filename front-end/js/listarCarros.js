document.addEventListener("DOMContentLoaded", () => {
    carregarVeiculos();
});

function carregarVeiculos() {
    fetch("http://127.0.0.1:8000/veiculos/")
        .then(response => response.json())
        .then(veiculos => {
            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = "";

            veiculos.forEach(v => {
                const placa = v.placa ?? "000-000";
                const vaga = v.numero_vaga ?? 0;

                const entrada = v.data_entrada ? formatarDataBanco(v.data_entrada) : "00/00/0000 00:00";
                const saida = v.data_saida ? formatarDataBanco(v.data_saida) : "00/00/0000 00:00";

                const tempo = (v.data_entrada && v.data_saida) 
                    ? calcularTempo(v.data_entrada, v.data_saida) 
                    : "0 hr";

                const valor = v.valor !== null && v.valor !== undefined 
                    ? `R$ ${Number(v.valor).toFixed(2).replace(".", ",")}` 
                    : "R$ 00,00";

                const tr = `
                    <tr>
                        <td>${placa}</td>
                        <td>${vaga}</td>
                        <td>${entrada}</td>
                        <td>${saida}</td>
                        <td>${tempo}</td>
                        <td>${valor}</td>
                        <td>
                            <button class="btn btn-warning btn-sm"><i class="bi-pencil-square"></i></button>
                            <button class="btn btn-success btn-sm"><i class="bi bi-check2-circle"></i></button>
                        </td>
                    </tr>
                `;

                tbody.innerHTML += tr;
            });
        })
        .catch(err => console.error("Erro ao carregar veículos:", err));
}

// Formata data exatamente como está no banco (ignora fuso)
function formatarDataBanco(utcString) {
    if (!utcString) return "00/00/0000 00:00";

    const [date, time] = utcString.split("T"); // "2025-11-21T20:06:00Z" => ["2025-11-21", "20:06:00Z"]
    const [ano, mes, dia] = date.split("-");
    const [hora, minuto] = time.split(":");
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// Calcula diferença de horas (saída - entrada)
function calcularTempo(entrada, saida) {
    const dt1 = new Date(entrada);
    const dt2 = new Date(saida);

    if (isNaN(dt1) || isNaN(dt2)) return "0 hr";

    const diffHoras = (dt2 - dt1) / 1000 / 60 / 60;
    return `${diffHoras.toFixed(1)} hr`;
}
