var rawData = [{
        id: 1,

        R: 1.73E+01,
        Mr: 5.11E+00,
        Sr: 1.84E+01,
        N: 7.30E-01,
        Mn: 4.85E+00,
        Sn: 7.29E+00,
        label: "ArcoIris"
    },
    {
        id: 2,

        R: 4.00E+00,
        Mr: 5.00E+00,
        Sr: 6.00E+00,
        N: 2.00E+00,
        Mn: 3.00E+00,
        Sn: 3.00E+00,
        label: "Polo Camiseta"
    },
    {
        id: 3,

        R: 1.73E+01,
        Mr: 1.40E-01,
        Sr: 9.50E+00,
        N: 1.70E+00,
        Mn: 2.61E+01,
        Sn: 2.55E+01,

        label: "Circulus"
    },
];

// Y: R + Mr + Sr + N + Mn + Sn, Ró: (R + Mr + Sr)/Y, Eta: N/Y, Fi: (Mn + Sn)/Y

/*
"EYR=Y/(Mn+Sn)"               CORREÇÃO: EYR = 1 / |(MN+SN)
"EIR=(Mr+Mn+Sr+Sn)/(R+N)"               EIR = f / (n + (r + mr + sr))
"ELR=(N+Mn+Sn)/(R+Mr+Sr)"               ELR = (1 - |(R+MR+SR)) / |(R+MR+SR)
"ESI=EYR/ELR"                           SI = eyr / elr
"%R=(R+Mr+Sr)/Y"

----------------------------

'|N = N/Y
'|(MN + SN) = (MN+SN)/Y
'|(R+MR+SR) = (R+MR+SR)/Y
'|Y = Y/Y = 1

*/



const canvas = document.getElementById('ternaryChart');
const ctx = canvas.getContext('2d');
ctx.globalAlpha = 1;

let checkRenovabilidadeParcial_Ativado = true; // Defina como true por padrão

const checkRenovabilidadeParcial = document.getElementById('flexSwitchCheckChecked');
checkRenovabilidadeParcial.addEventListener('change', () => {
    checkRenovabilidadeParcial_Ativado = checkRenovabilidadeParcial.checked;
    desenharGraficoTernario(); // Redesenha o gráfico quando o checkbox é alterado
});


// Função para converter coordenadas para pixels no canvas
function convertToPixel(x, y) {
    // Defina os valores mínimos e máximos para X e Y
    var minX = -0.58;
    var maxX = 0.58;
    var minY = 0;
    var maxY = 1;

    // Largura da borda interna
    var innerBorderWidth = 70;

    var canvasX = (x - minX) / (maxX - minX) * (canvas.width - 2 * innerBorderWidth) + innerBorderWidth;
    var canvasY = canvas.height - 130 - (y - minY) / (maxY - minY) * (canvas.height - 2 * innerBorderWidth) + innerBorderWidth; //Este valor 130 não pode ser alterado pois ele que está alinhando o ternário
    return {
        x: canvasX,
        y: canvasY
    };
}


function clearAllData(){
    rawData = []
    // Selecione o tbody dentro da tabela com id 'resume'
    const tbody = document.querySelector('#resume tbody');

    // Remova todo o conteúdo do tbody
    tbody.innerHTML = '';
    
}

/*                                                 
                             x   ,   y                       
                  R+Mr+Sr = (0   ,   1)                                  
                     N    = (-0,58 , 0)                           
                  Mn + Sn = (0.58  , 0)                                                                       
                                                    */


function desenharGraficoTernario() {
    var counter = 1; 

    // Define os vértices do triângulo
    var startPoint = convertToPixel(0, 1);
    var apex1 = convertToPixel(-0.58, 0);
    var apex2 = convertToPixel(0.58, 0);

    // Desenha as linhas do triângulo
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(apex1.x, apex1.y);
    ctx.lineTo(apex2.x, apex2.y);
    ctx.closePath();
    ctx.stroke();

    
    const labelOffset = 20; // Ajuste para definir a distância dos Labels em relação às extremidades do triângulo

    ctx.font = "18px Arial";

    // Label para cada extremidade do triângulo 

    if (checkRenovabilidadeParcial_Ativado) {
        ctx.fillText("R+Mr+Sr", startPoint.x, startPoint.y - labelOffset);
        ctx.fillText("N", apex1.x, apex1.y + labelOffset);
        ctx.fillText("Mn+Sn", apex2.x, apex2.y + labelOffset);
    } else {
        ctx.fillText("R", startPoint.x, startPoint.y - labelOffset);
        ctx.fillText("N", apex1.x, apex1.y + labelOffset);
        ctx.fillText("F", apex2.x, apex2.y + labelOffset);
    }
    
    // Função para converter HSL para RGB
    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // A escala de cinza, sem saturação
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // Desenha os pontos no gráfico ternário
    rawData.forEach((point) => {
        // Normaliza os dados para a escala do gráfico ternário (0 a 1)
        

        const normalizedPoint = {
            A: point.R / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            B: point.Mr / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            C: point.Sr / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            D: point.N / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            E: point.Mn / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            F: point.Sn / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
            G: point.Y = point.R + point.Mr + point.Sr + point.N + point.Mn + point.Sn,
            H: point.Ró = (point.R + point.Mr + point.Sr) / point.Y,
            I: point.Eta = point.N / point.Y,
            J: point.Fi = (point.Mn + point.Sn) / point.Y,
            K: point.F = point.Mn + point.Sn + point.Mr + point.Sr,
            L: point.EYR = 1 / (point.Mn + point.Sn),
            M: point.EIR = point.F / (point.N + (point.R + point.Mr + point.Sr)),
            N: point.ELR = (point.N + point.Mn + point.Sn) / (point.R + point.Mr + point.Sr),
            O: point.SI = point.EYR / point.EIR,
            P: point.PorcentageR = (point.R + point.Mr + point.Sr) / point.Y,
            Q: point.PorcentageRR = (point.R + point.Mr + point.Sr) / point.Y,
            R: point.porcentageN = (point.N) / point.Y,
            S: point.porcentageF = (point.Mn + point.Sn) / point.Y,
            T: point.porcentageMr = (point.Mr) / point.Y,
            U: point.porcentageSr = (point.Sr) / point.Y,
            V: point.porcentageMn = (point.Mn) / point.Y,
            W: point.porcentageSn = (point.Sn) / point.Y,
            X: point.id
        };

        // Normaliza os valores  
        const x = (2 * normalizedPoint.J + normalizedPoint.H - 1) / Math.sqrt(3);
        const y = normalizedPoint.H

        var pixel = convertToPixel(x, y);

        // Define uma cor baseada no índice do ponto
        var hue = (point.id * 137.508) % 360; // Use um número primo para garantir variação
        var [r, g, b] = hslToRgb(hue / 360, 0.5, 0.5);

        

        // Desenha os pontos
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b})`;
        ctx.fill();
     
        // Adiciona um rótulo numerado
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        if (point.label === "Simergy") {
            ctx.fillText("Simergy", pixel.x + 10, pixel.y + 6);

            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(pixel.x - 3, pixel.y - 3);
            ctx.lineTo(pixel.x + 3, pixel.y + 3);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(pixel.x + 3, pixel.y - 3);
            ctx.lineTo(pixel.x - 3, pixel.y + 3);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            // Desenha linhas conectando o ponto Simergy aos outros pontos
            ctx.beginPath();
            ctx.moveTo(pixel.x, pixel.y); // Move o cursor para o ponto Simergy

             // Desenha linhas conectando o ponto Simergy aos outros pontos ativados
            const pontosAtivados = obterPontosAtivados();
            pontosAtivados.forEach((index) => {
                const otherPoint = rawData[index];
                if (otherPoint.label !== "Simergy") {
                    const otherX = (2 * otherPoint.Fi + otherPoint.Ró - 1) / Math.sqrt(3);
                    const otherY = otherPoint.Ró;
                    const otherPixel = convertToPixel(otherX, otherY);
                    ctx.beginPath();
                    ctx.moveTo(pixel.x, pixel.y); // Move o cursor para o ponto Simergy
                    ctx.lineTo(otherPixel.x, otherPixel.y);
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            });
        } else {
            ctx.fillText(point.id, pixel.x + 10, pixel.y + 6);
        }

        // Adiciona um evento de mouseover para exibir o rótulo quando o mouse passar sobre o ponto
        canvas.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;

            if (mouseX > x - 10 && mouseX < x + 10 && mouseY > y - 10 && mouseY < y + 10) {
                exibirRotulo(point.Ró, x, y);
            }
        });
        

        counter++;
    });

}

/*

    CRIAR RESUMO 

*/

function criarTabela(rawData) {
    const table = document.createElement('table');
    table.classList.add('table');

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        'Point',
        'Name',
        'Origin of input Source',
        'Emergy in sej/Unit',
        'Emergy in sej/sej or %',
        '',
        'Emergy indices with partial renewabilities'
    ];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    
    
    const emptyColumnData = [
        'EYR=Y/(Mn+Sn)',
        'EIR=(Mr+Mn+Sr+Sn)/(R+N)',
        'ELR=(N+Mn+Sn)/(R+Mr+Sr)',
        'ESI=EYR/ELR',
        '%R=(R+Mr+Sr)/Y'
    ];
    
    // Repetir para cada ponto fornecido
    rawData.forEach((data, index) => {
        for (let i = 0; i < 8; i++) { 
            const row = document.createElement('tr');
            let emergyData;
            let percentageData;
            let emergyIndices;

            const totalY = data.R + data.N + data.Mr + data.Mn + data.Sr + data.Sn;
            percentageData = [
                ((data.R) / totalY * 100).toFixed(2) + '%',
                ((data.N) / totalY * 100).toFixed(2) + '%',
                ((data.Mr) / totalY * 100).toFixed(2) + '%',
                ((data.Mn) / totalY * 100).toFixed(2) + '%',
                ((data.Sr) / totalY * 100).toFixed(2) + '%',
                ((data.Sn) / totalY * 100).toFixed(2) + '%',
                ((data.Mr + data.Mn + data.Sr + data.Sn) / totalY * 100).toFixed(2) + '%',
                ((data.R + data.N + data.Mr + data.Mn + data.Sr + data.Sn) / totalY * 100).toFixed(2) + '%',
            ];
            emergyData = [
                data.R.toExponential(2),
                data.N.toExponential(2),
                data.Mr.toExponential(2),
                data.Mn.toExponential(2),
                data.Sr.toExponential(2),
                data.Sn.toExponential(2),
                (data.Mr + data.Sr + data.Mn + data.Sn).toExponential(2),
                (data.R + data.Mr + data.Sr + data.N + data.Mn + data.Sn).toExponential(2)
            ];

            // Calcular os valores para Emergy indices with partial renewabilities
            const MnSn = data.Mn + data.Sn;
            const RN = data.R + data.N;
            const RMrSrSn = data.R + data.Mr + data.Sr + data.Sn;
            const EYR = (1 / MnSn)
            const ELR = ((data.N + data.Mn + data.Sn) / (data.R + data.Mr + data.Sr))

            emergyIndices = [
                (1 / MnSn).toFixed(2), //Conta com o Y estava dando NaN
                ((data.Mr + data.Mn + data.Sr + data.Sn) / RN).toFixed(2),
                ((data.N + data.Mn + data.Sn) / (data.R + data.Mr + data.Sr)).toFixed(2),
                (EYR/ELR).toFixed(2),
                (((data.R + data.Mr + data.Sr) / totalY)*100).toFixed(2),
                '',
                '',
                '',
            ];
 


            const rowData = [
                index + 1, // Número do ponto
                data.label, // Nome do ponto
                i < 8 ? ['R', 'N', 'Mr', 'Mn', 'Sr', 'Sn', 'F=Mr+Sr+Mn+Sn', 'Total emergy (Y)'][i] : '', // Origem da fonte de entrada
                emergyData[i], // Emergy in sej/Unit
                percentageData[i], // Emergy in sej/sej or %
                i < emptyColumnData.length ? emptyColumnData[i] : '', // Conteúdo da coluna vazia
                emergyIndices[i], // Emergy indices with partial renewabilities
            ];
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        }

        // Adiciona as linhas vazias ao final do loop
        for (let i = 0; i < 2; i++) {
            const emptyRow = document.createElement('tr');
            for (let j = 0; j < headers.length; j++) {
                const emptyTh = document.createElement('th');
                const emptyTd = document.createElement('td');
                emptyRow.appendChild(emptyTh);
                emptyRow.appendChild(emptyTd);
            }
            tbody.appendChild(emptyRow);
        }
    
    });

    
    // Adiciona o corpo à tabela
    table.appendChild(tbody);

    return table;
}


const tabela = criarTabela(rawData);
// Adiciona a tabela ao elemento desejado do DOM
document.getElementById('resume').appendChild(tabela);


/*
============================================================================================
============================================================================================
AQUI A BAIXO ESTÂO ALGUMAS OUTRAS FUNCIONALIDADES DO GRAFICO, ESTOU APRENDENTO A MODULARIZAR    
============================================================================================
============================================================================================
*/


/*
DATA INPUT 
*/

let dataInputPopUp = document.getElementById('popup-dataInput')

function abraDataInput() {
    dataInputPopUp.classList.add("open-popup");
}


function fecheDataInput() {
    dataInputPopUp.classList.remove("open-popup");
}



// Função para enviar dados
function enviarDados() {
    // Obtenha os valores dos campos de entrada
    var name = document.getElementById('dataInput_Name').value;

    // Se os campos estiverem preenchidos
    if (name.trim() !== '') {
        var R = parseFloat(document.getElementById('dataInput_R').value);
        var Mr = parseFloat(document.getElementById('dataInput_Mr').value);
        var Sr = parseFloat(document.getElementById('dataInput_Sr').value);
        var N = parseFloat(document.getElementById('dataInput_N').value);
        var Mn = parseFloat(document.getElementById('dataInput_Mn').value);
        var Sn = parseFloat(document.getElementById('dataInput_Sn').value);

        // Determine o próximo ID
        var nextID = rawData.filter(point => point.label !== "Simergy").length + 1;

        // Adicione os dados à variável rawData
        rawData.push({
            id: nextID, // Determine o próximo ID
            R: R,
            Mr: Mr,
            Sr: Sr,
            N: N,
            Mn: Mn,
            Sn: Sn,
            label: name // Use o nome fornecido como rótulo
        });

        // Limpe os campos de entrada após o envio
        limparCamposDataInput();

        // Atualize o labelSelect com os novos rótulos
        atualizarLabelSelect();

        // Limpe o conteúdo atual da tabela
        const table = document.getElementById('resume');
        table.innerHTML = '';
        const tabela = criarTabela(rawData);
        // Adiciona a tabela ao elemento desejado do DOM
        document.getElementById('resume').appendChild(tabela);

        const pointsContainer = document.getElementById('points-container');
        pointsContainer.innerHTML = '';
        adicionarPontos();

        


        desenharGraficoTernario();
    } else {
        alert('Por favor, preencha todos os campos de entrada.');
    }
}

function limparCamposDataInput() {
    // Limpe todos os campos de entrada
    document.getElementById('dataInput_Name').value = '';
    document.getElementById('dataInput_R').value = '';
    document.getElementById('dataInput_Mr').value = '';
    document.getElementById('dataInput_Sr').value = '';
    document.getElementById('dataInput_N').value = '';
    document.getElementById('dataInput_Mn').value = '';
    document.getElementById('dataInput_Sn').value = '';
}


/*
POINTS
*/



let pointsPopUp = document.getElementById('popup-points')

function abraPoints() {
    pointsPopUp.classList.add("open-popup");
}


function fechePoints() {
    pointsPopUp.classList.remove("open-popup");
}


// Crie uma cópia imutável dos dados originais
var originalDataArray = [...rawData];

function adicionarPontos() {
    const pointsContainer = document.getElementById('points-container');

    rawData.sort((a, b) => a.id - b.id);

    // Iterar sobre os dados brutos e adicionar os pontos
    rawData.forEach((point, index) => {
        // Criar um elemento de div para o ponto
        const pointDiv = document.createElement('div');
        pointDiv.classList.add('point');

        // Adicionar o número do ponto
        const pointNumber = document.createElement('span');
        pointNumber.textContent = `${index + 1} `;
        pointDiv.appendChild(pointNumber);

        // Criar uma checkbox para ativar/desativar o ponto
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${point.id}`;
        checkbox.checked = true; // Definir como marcado por padrão
        checkbox.dataset.pointId = point.id; // Adicionar o ID do ponto como um atributo de dados
        checkbox.addEventListener('change', function() {
            if (!this.checked) {
                // Se a checkbox for marcada, remova o ponto correspondente dos dados brutos
                const pointId = parseInt(this.dataset.pointId);
                const pointIndex = rawData.findIndex(p => p.id === pointId);
                if (pointIndex !== -1) {
                    rawData.splice(pointIndex, 1);
                }
                
            } else {
                // Se a checkbox for desmarcada, adicione o ponto correspondente de volta aos dados originais
                const pointId = parseInt(this.dataset.pointId);
                const originalPoint = originalDataArray.find(p => p.id === pointId);
                if (originalPoint) {
                    rawData.push({ ...originalPoint });
                }
            }
        });
        pointDiv.appendChild(checkbox);

        // Criar um input desativado para mostrar o nome do ponto
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.value = point.label;
        inputName.disabled = true;
        pointDiv.appendChild(inputName);

        // Adicionar o ponto à div de contêiner de pontos
        pointsContainer.appendChild(pointDiv);
    });
}



// Chamada da função para adicionar os pontos ao carregar a página
adicionarPontos();




/*
ABERTURA DE POPUPS- INFORMATION
*/


const labelSelect = document.getElementById('labelSelect');
const inputR = document.getElementById('inputR');
const inputMr = document.getElementById('inputMr');
const inputSr = document.getElementById('inputSr');
const inputN = document.getElementById('inputN');
const inputMn = document.getElementById('inputMn');
const inputSn = document.getElementById('inputSn');
const inputF = document.getElementById('inputF');
const inputY = document.getElementById('inputY');
const inputEYR = document.getElementById('inputEYR');
const inputEIR = document.getElementById('inputEIR');
const inputELR = document.getElementById('inputELR');
const inputSI = document.getElementById('inputSI');
const inputPorcentageR = document.getElementById('inputPorcentageR');
const porcentageR = document.getElementById('porcentageR');
const porcentageN = document.getElementById('porcentageN');
const porcentageF = document.getElementById('porcentageF');


// Preencher a lista de rótulos
rawData.forEach(point => {
    const option = document.createElement('option');
    option.value = point.label;
    option.textContent = point.label;
    labelSelect.appendChild(option);
});

// Função para carregar dados com base no rótulo selecionado
function carregarDados() {
    const selectedLabel = labelSelect.value;

    // Encontrar o ponto correspondente aos dados brutos
    const selectedPoint = rawData.find(point => point.label === selectedLabel);

    // Preencher os campos de entrada com os dados do ponto selecionado
    if (selectedPoint) {
        inputR.value = selectedPoint.R.toExponential(2);
        inputMr.value = selectedPoint.Mr.toExponential(2);
        inputSr.value = selectedPoint.Sr.toExponential(2);
        inputN.value = selectedPoint.N.toExponential(2);
        inputMn.value = selectedPoint.Mn.toExponential(2);
        inputSn.value = selectedPoint.Sn.toExponential(2);
        inputF.value = selectedPoint.F.toExponential(2);
        inputY.value = selectedPoint.Y.toExponential(2);
        inputEYR.value = selectedPoint.EYR.toExponential(2);
        inputEIR.value = selectedPoint.EIR.toExponential(2);
        inputELR.value = selectedPoint.ELR.toExponential(2);
        inputSI.value = selectedPoint.SI.toExponential(2);
        inputPorcentageR.value = selectedPoint.PorcentageR.toFixed(2);
        porcentageR.value = selectedPoint.PorcentageRR.toFixed(2);
        porcentageN.value = selectedPoint.porcentageN.toFixed(2);
        porcentageF.value = selectedPoint.porcentageF.toFixed(2);
    } else {
        // Limpar os campos se nenhum ponto for selecionado
        limparCampos();
    }
}

// Função para limpar os campos de entrada
function limparCampos() {
    inputR.value = '';
    inputMr.value = '';
    inputSr.value = '';
    inputN.value = '';
    inputMn.value = '';
    inputSn.value = '';
    inputF.value = '';
    inputY.value = '';
    inputEYR.value = '';
    inputEIR.value = '';
    inputELR.value = '';
    inputSI.value = '';
    inputPorcentageR.value = '';
    porcentageR.value = '';
    porcentageN.value = '';
    porcentageF.value = '';
}

function mostrarConteudoLines(contentId) {
    // Esconde todos os conjuntos de conteúdo
    document.getElementById('sourcesContent').classList.add('hidden');
    document.getElementById('sustainableContent').classList.add('hidden');
    document.getElementById('sensibilityContent').classList.add('hidden');
    document.getElementById('simmergyContent').classList.add('hidden');

    // Mostra o conjunto de conteúdo específico
    document.getElementById(contentId).classList.remove('hidden');
}

// Função para atualizar o labelSelect com novos rótulos
function atualizarLabelSelect() {
    // Limpe todos os rótulos existentes no labelSelect
    labelSelect.innerHTML = '';

    // Adicione a opção "Selecione..."
    const optionSelecione = document.createElement('option');
    optionSelecione.value = ""; // Valor vazio
    optionSelecione.textContent = "Selecione...";
    labelSelect.appendChild(optionSelecione);

    // Adicione os novos rótulos ao labelSelect
    rawData.forEach(point => {
        const option = document.createElement('option');
        option.value = point.label;
        option.textContent = point.label;
        labelSelect.appendChild(option);
    });
}

/*

====================================================================
                            LINES 
====================================================================

*/

let linesPopUp = document.getElementById('popup-lines')

function abraLines() {
    linesPopUp.classList.add("open-popup");
}


function fecheLines() {
    linesPopUp.classList.remove("open-popup");
}

function toggleActiveButton(button) {
    // Remove a classe ativa de todos os botões
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    // Adiciona a classe ativa apenas ao botão clicado
    button.classList.add('active');
}



/*===========SOURCES LINES===========*/


// Adiciona um ouvinte ao eventos changes das checkboxs
var checkbox = document.getElementById("sourceR_Mr_Sr");
checkbox.addEventListener("change", mostrarSourceLinesR_Mr_Sr);

var checkboxN = document.getElementById("sourceN");
checkboxN.addEventListener("change", mostrarSourceLinesN);

var checkboxMn_Sn = document.getElementById("sourceMn_Sn");
checkboxMn_Sn.addEventListener("change", mostrarSourceLinesMn_Sn);

var checkboxSimmergyLines = document.getElementById("Active_Simmergy_Lines");
checkboxSimmergyLines.addEventListener("change", mostrarLinesOfSimmetry);

//             R+MR+SR
function mostrarSourceLinesR_Mr_Sr() {
    var checkbox = document.getElementById("sourceR_Mr_Sr");
    var sourceR_Mr_Sr_Visivel = checkbox.checked;
    var valueSourceR_Mr_Sr = document.getElementById("valueSourceR_Mr_Sr").value;


    var apex1 = convertToPixel(-0.58, valueSourceR_Mr_Sr / 100);
    var apex2 = convertToPixel(0.58, valueSourceR_Mr_Sr / 100);

    if (sourceR_Mr_Sr_Visivel) {
        ctx.beginPath();
        ctx.moveTo(apex1.x, apex1.y);
        ctx.lineTo(apex2.x, apex2.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

        // Adicione um rótulo ao ponto apex1
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText("R+Mr+Sr = " + (valueSourceR_Mr_Sr / 100).toFixed(2), apex1.x - 50, apex1.y - 10);
    }

}

nums_CalculosSource_MN_SN = [(-1 / Math.sqrt(3)), (-1 / Math.sqrt(3) + 1 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 2 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 3 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 4 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 5 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 6 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 7 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 8 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 9 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 10 * (1 / Math.sqrt(3) / 10)), (1/Math.sqrt(3) - 9 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 8 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 7 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 6 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 5 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 4 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 3 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 2 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 1 * (1/Math.sqrt(3))/10), (1 / Math.sqrt(3))]

// Tanto em uma linha quanto a outra para pegar a porcentagem será feito o input x 2 / 100

//Essa é a função que mostra o Mn+Sn
function mostrarSourceLinesN() {
    var checkboxN = document.getElementById("sourceN");
    var sourceN_Visivel = checkboxN.checked;
    var valueSourceN = document.getElementById("valueSourceN").value;

    var porcentagemN = (valueSourceN * 2) / 100

    if (sourceN_Visivel) {
        var Y_values = [];

        

        for (var i = 0; i < nums_CalculosSource_MN_SN.length; i++) {
            var calculoLinhaN = 1 - porcentagemN - Math.sqrt(3) * (nums_CalculosSource_MN_SN[i]);


            if (calculoLinhaN > 1) {
                calculoLinhaN = 1;
            }
            else if (calculoLinhaN >= 0) {
                // Arredonda para uma casa decimal se for maior ou igual a 0
                calculoLinhaN = calculoLinhaN.toFixed(2);
            }
            Y_values.push(calculoLinhaN);
        }

        // Invertendo os valores de Y_values
        var Y_values_invertidos = Y_values.slice().reverse();


        ctx.beginPath();
        var startPoint1 = convertToPixel(nums_CalculosSource_MN_SN[21], Y_values[21]);
        ctx.moveTo(startPoint1.x, startPoint1.y);

        for (var i = 0; i < nums_CalculosSource_MN_SN.length; i++) {
            var pixel = convertToPixel(nums_CalculosSource_MN_SN[i], Y_values_invertidos[i]);
            ctx.lineTo(pixel.x, pixel.y);
        }
        // Define a cor da linha
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();


        
        var labelCordinates = convertToPixel(nums_CalculosSource_MN_SN[0], Y_values[0])


        // Adicione um rótulo ao ponto apex1
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText("Mn+Sn = " + (valueSourceN / 100).toFixed(2), labelCordinates.x + 350, labelCordinates.y - 10);
    } else {
        var Y_values = [];
    }

}

//Essa é a função que mostra o N
function mostrarSourceLinesMn_Sn() {
    var checkboxMn_Sn = document.getElementById("sourceMn_Sn");
    var sourceMn_Sn_Visivel = checkboxMn_Sn.checked;
    var valueSourceMn_Sn = document.getElementById("valueSourceMn_Sn").value;

    var porcentagemMn_Sn = (valueSourceMn_Sn * 2) / 100

    

    if (sourceMn_Sn_Visivel) {
        var Y_values = [];

        

        for (var i = 0; i < nums_CalculosSource_MN_SN.length; i++) {
            var calculoLinhaMn_Sn = 1 - porcentagemMn_Sn - Math.sqrt(3) * (nums_CalculosSource_MN_SN[i]);
            
            // Se o valor for maior que 1, atribua 1, senão, atribua o valor calculado
            if (calculoLinhaMn_Sn > 1) {
                calculoLinhaMn_Sn = 1;
            }
            else if (calculoLinhaMn_Sn >= 0) {
                // Arredonda para uma casa decimal se for maior ou igual a 0
                calculoLinhaMn_Sn = calculoLinhaMn_Sn.toFixed(2);
            }
            Y_values.push(parseFloat(calculoLinhaMn_Sn)); // convertendo de string para número
        }


        //alert("Valores de Y_values: " + Y_values);


        ctx.beginPath();
        var startPoint = convertToPixel(nums_CalculosSource_MN_SN[0], Y_values[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        for (var i = 0; i < nums_CalculosSource_MN_SN.length; i++) {
            var pixel = convertToPixel(nums_CalculosSource_MN_SN[i], Y_values[i]);
            ctx.lineTo(pixel.x, pixel.y);
        }
        // Define a cor da linha
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

        var labelCordinates = convertToPixel(nums_CalculosSource_MN_SN[0], Y_values[0])


        // Adicione um rótulo ao ponto apex1
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText("N = " + (valueSourceMn_Sn / 100).toFixed(2), labelCordinates.x, labelCordinates.y - 10);
    } else {
        Y_values = [];
    }
}

function drawDashedLine(pattern, startPoint, endPoint) {
    ctx.beginPath();
    ctx.setLineDash(pattern);
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function mostrarLinesOfSimmetry() {
    var checkboxSimmergyLines = document.getElementById("Active_Simmergy_Lines");
    var Active_Simmergy_Lines_Visivel = checkboxSimmergyLines.checked;

    var apex1Horizontal = convertToPixel(-0.58, 0.5);
    var apex2Horizontal = convertToPixel(0.58, 0.5);
    var apex1Vertical = convertToPixel(0, 1);
    var apex2Vertical = convertToPixel(0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";

    desenharGraficoTernario();
    
    if (Active_Simmergy_Lines_Visivel) {
        // Define o estilo de linha pontilhada apenas para as linhas de simetria
        ctx.beginPath();
        drawDashedLine([15, 3, 3, 3], apex1Horizontal, apex2Horizontal); // 5 pixels sólidos seguidos por 3 pixels transparentes
        ctx.moveTo(apex1Horizontal.x, apex1Horizontal.y);
        ctx.lineTo(apex2Horizontal.x, apex2Horizontal.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        drawDashedLine([15, 3, 3, 3], apex1Horizontal, apex2Horizontal);  // 5 pixels sólidos seguidos por 3 pixels transparentes
        ctx.moveTo(apex1Vertical.x, apex1Vertical.y + 0.05);
        ctx.lineTo(apex2Vertical.x, apex2Vertical.y + 0.05);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }
    ctx.setLineDash([]);
}

function mostrarRegios() {
    var checkboxRegions = document.getElementById("Active_Regions");
    var activeRegios_Visivel = checkboxRegions.checked;

    // ====================== FIRST SET OF LINES (HORIZONTAL) ===================

    var apex1HorizontalFirstLine = convertToPixel(-0.53, 0.09);
    var apex2HorizontalFirstLine = convertToPixel(0.53, 0.09);

    var apex1HorizontalSecondLine = convertToPixel(-0.39, 0.33);
    var apex2HorizontalSecondLine = convertToPixel(0.39, 0.33);

    //======================== SECOND SET OF LINES (DIAGONAL)  ===================================

    numsRegiosFirstLine= [(-1 / Math.sqrt(3) + 5 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 6 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 7 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 8 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 9 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 10 * (1 / Math.sqrt(3) / 10)), (1/Math.sqrt(3) - 9 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 8 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 7 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 6 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 5 * (1/Math.sqrt(3))/10)]

    numsRegiosSecondLine = [(-1 / Math.sqrt(3) + 4 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 5 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 6 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 7 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 8 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 9 * (1 / Math.sqrt(3) / 10)), (-1 / Math.sqrt(3) + 10 * (1 / Math.sqrt(3) / 10)), (1/Math.sqrt(3) - 9 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 8 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 7 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 6 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 5 * (1/Math.sqrt(3))/10), (1/Math.sqrt(3) - 4 * (1/Math.sqrt(3))/10)]


    var porcentagemFisrtDiagonalLine = (50 * 2) / 100

    var porcentagemSecondDiagonalLine = (20 * 2) / 100

    //======================== THIRD SET OF LINES (SUSTAINABLE)  ===================================

    primeiro_calculoRegionsFirstLine = (2 * 5 + 1 - Math.sqrt(4 * 5 + 1)) / (5 * 2) //Ultimo valor de Y

    segundo_calculoRegionsFirstLine = primeiro_calculoRegionsFirstLine / 18

    primeiro_calculoRegionsSecondLine = (2 * 5 + 1 - Math.sqrt(4 * 5 + 1)) / (5 * 2) //Ultimo valor de Y

    segundo_calculoRegionsSecondLine = primeiro_calculoRegionsSecondLine / 18

    

    if (activeRegios_Visivel) {

        ctx.beginPath();
        ctx.moveTo(apex1HorizontalFirstLine.x, apex1HorizontalFirstLine.y);
        ctx.lineTo(apex2HorizontalFirstLine.x, apex2HorizontalFirstLine.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(apex1HorizontalSecondLine.x, apex1HorizontalSecondLine.y);
        ctx.lineTo(apex2HorizontalSecondLine.x, apex2HorizontalSecondLine.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        //------------------------------------------------------------------

        var Y_valuesFisrtDiagonalLine = [];

        var Y_valuesSecondDiagonalLine = [];

        

        for (var i = 0; i < numsRegiosFirstLine.length; i++) {
            var calculoFisrtDiagonalLine = 1 - porcentagemFisrtDiagonalLine - Math.sqrt(3) * (numsRegiosFirstLine[i]);


            if (calculoFisrtDiagonalLine > 1) {
                calculoFisrtDiagonalLine = 1;
            }
            else if (calculoFisrtDiagonalLine >= 0) {
                // Arredonda para uma casa decimal se for maior ou igual a 0
                calculoFisrtDiagonalLine = calculoFisrtDiagonalLine.toFixed(2);
            }
            Y_valuesFisrtDiagonalLine.push(calculoFisrtDiagonalLine);
        }

        // Invertendo os valores de Y_valuesFisrtDiagonalLine
        var Y_valuesFisrtDiagonalLine_invertidos = Y_valuesFisrtDiagonalLine.slice().reverse();


        ctx.beginPath();
        var startPoint1 = convertToPixel(numsRegiosFirstLine[21], Y_valuesFisrtDiagonalLine[21]);
        ctx.moveTo(startPoint1.x, startPoint1.y);
        

        for (var i = numsRegiosFirstLine.length - 1; i >= numsRegiosFirstLine.length - 11; i--) {
            var pixel = convertToPixel(numsRegiosFirstLine[i], Y_valuesFisrtDiagonalLine_invertidos[i]);
            ctx.lineTo(pixel.x, pixel.y);

            // Verifica se o ponto é (0, 0) e, se for, encerra o loop
            if (pixel.x === 0 && pixel.y === 0) {
                break;
            }
        }
        // Define a cor da linha
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();



        //                         SEGUNDA LINHA DIAGONAL 

        for (var i = 0; i < numsRegiosSecondLine.length; i++) {
            var calculoSecondDiagonalLine = 1 - porcentagemSecondDiagonalLine - Math.sqrt(3) * (numsRegiosSecondLine[i]);


            if (calculoSecondDiagonalLine > 1) {
                calculoSecondDiagonalLine = 1;
            }
            else if (calculoSecondDiagonalLine >= 0) {
                // Arredonda para uma casa decimal se for maior ou igual a 0
                calculoSecondDiagonalLine = calculoSecondDiagonalLine.toFixed(2);
            }
            Y_valuesSecondDiagonalLine.push(calculoSecondDiagonalLine);
        }

        // Invertendo os valores de Y_valuesSecondDiagonalLine
        var Y_valuesSecondDiagonalLine_invertidos = Y_valuesSecondDiagonalLine.slice().reverse();


        ctx.beginPath();
        var startPoint1 = convertToPixel(numsRegiosSecondLine[21], Y_valuesSecondDiagonalLine[21]);
        ctx.moveTo(startPoint1.x, startPoint1.y);

        for (var i = 0; i < 9; i++) {
            var pixel = convertToPixel(numsRegiosSecondLine[i], Y_valuesSecondDiagonalLine_invertidos[i]);
            ctx.lineTo(pixel.x, pixel.y);

                    
        }
        // Define a cor da linha
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

    //---------------------------------------------------------------------------------------------------------------------

        var X_valuesFirstLine = [];
        var Y_valuesFirstLine = [];

        Y_valuesFirstLine.push(0);

        // Primeiro calculo = (2*input + 1 - Math.sqrt(4*input + 1))/(input * 2)
        var primeiro_calculoRegionsFirstLine = (2 * 5 + 1 - Math.sqrt(4 * 5 + 1)) / (5 * 2);

        // Segundo calculoRegionsFirstLine = Primeiro calculoRegionsFirstLine / 18
        var segundo_calculoRegionsFirstLine = primeiro_calculoRegionsFirstLine / 18;

        // Terceiro CalculoRegionsFirstLine = Segundo CalculoRegionsFirstLine * 1... 2... 3... 17
        for (var i = 1; i <= 17; i++) {
            Y_valuesFirstLine.push(segundo_calculoRegionsFirstLine * i);
        }

        Y_valuesFirstLine.push(primeiro_calculoRegionsFirstLine);

        // Quarto CalculoRegionsFirstLine = (1/Math.sqrt(3)) * (((2*Yrespectivo)/(input*(1-Yrespectivo))) + Yrespectivo - 1);
        for (var j = 0; j <= 19; j++) {
            var quarto_calculoRegionsFirstLine = (1 / Math.sqrt(3)) * (((2 * Y_valuesFirstLine[j]) / (5 * (1 - Y_valuesFirstLine[j]))) + Y_valuesFirstLine[j] - 1);
            X_valuesFirstLine.push(quarto_calculoRegionsFirstLine);
        }


        // Desenha a linha 
        ctx.beginPath();
        // Move para o primeiro ponto
        var startPoint = convertToPixel(X_valuesFirstLine[0], Y_valuesFirstLine[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        // Desenha a linha entre os pontos restantes
        for (var j = 0; j <= 19; j++) {
            var pixel = convertToPixel(X_valuesFirstLine[j], Y_valuesFirstLine[j]);
            ctx.lineTo(pixel.x, pixel.y);


        }
        // Define a cor da linha
        ctx.strokeStyle = "Black";
        ctx.stroke();
        ctx.closePath();

        var X_valuesSecondLine = [];
        var Y_valuesSecondLine = [];

        Y_valuesSecondLine.push(0);

        // Primeiro calculo = (2*input + 1 - Math.sqrt(4*input + 1))/(input * 2)
        var primeiro_calculoRegionsSecondLine = (2 * 1 + 1 - Math.sqrt(4 * 1 + 1)) / (1 * 2);

        // Segundo calculoRegionsSecondLine = Primeiro calculoRegionsSecondLine / 18
        var segundo_calculoRegionsSecondLine = primeiro_calculoRegionsSecondLine / 18;

        // Terceiro CalculoRegionsSecondLine = Segundo CalculoRegionsSecondLine * 1... 2... 3... 17
        for (var i = 1; i <= 17; i++) {
            Y_valuesSecondLine.push(segundo_calculoRegionsSecondLine * i);
        }

        Y_valuesSecondLine.push(primeiro_calculoRegionsSecondLine);

        // Quarto CalculoRegionsSecondLine = (1/Math.sqrt(3)) * (((2*Yrespectivo)/(input*(1-Yrespectivo))) + Yrespectivo - 1);
        for (var j = 0; j <= 19; j++) {
            var quarto_calculoRegionsSecondLine = (1 / Math.sqrt(3)) * (((2 * Y_valuesSecondLine[j]) / (1 * (1 - Y_valuesSecondLine[j]))) + Y_valuesSecondLine[j] - 1);
            X_valuesSecondLine.push(quarto_calculoRegionsSecondLine);
        }

        // Desenha a linha 
        ctx.beginPath();
        // Move para o primeiro ponto
        var startPoint = convertToPixel(X_valuesSecondLine[0], Y_valuesSecondLine[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        // Desenha a linha entre os pontos restantes
        for (var j = 0; j <= 19; j++) {
            var pixel = convertToPixel(X_valuesSecondLine[j], Y_valuesSecondLine[j]);
            ctx.lineTo(pixel.x, pixel.y);

        }
        // Define a cor da linha
        ctx.strokeStyle = "Black";
        ctx.stroke();
        ctx.closePath();
  
    }

}


/*===========SUSTAINABLE LINES===========*/

/*
OBS1: Toda vez o Y = 0 e X - -0,577 para eles começarem no ponto extremo esquerdo do gráfico ternário

OBS2: input é o dado que o usuário estara escolhendo para mexer na linha de SI 
*/

var checkbox_ESI_K1 = document.getElementById("ESI_K1");
checkbox_ESI_K1.addEventListener("change", mostrarSustainableLine_ESI_K1);

var checkbox_ESI_K2 = document.getElementById("ESI_K2");
checkbox_ESI_K2.addEventListener("change", mostrarSustainableLine_ESI_K2);

var checkbox_ESI_K3 = document.getElementById("ESI_K3");
checkbox_ESI_K3.addEventListener("change", mostrarSustainableLine_ESI_K3);

function mostrarSustainableLine_ESI_K1() {
    var checkbox_ESI_K1 = document.getElementById("ESI_K1");
    var sustainableLine_ESI_K1_Visible = checkbox_ESI_K1.checked;
    var valueSustainable_ESI_K1 = document.getElementById("valueESI_K1").value;

    primeiro_calculo = (2 * valueSustainable_ESI_K1 + 1 - Math.sqrt(4 * valueSustainable_ESI_K1 + 1)) / (valueSustainable_ESI_K1 * 2) //Ultimo valor de Y

    segundo_calculo = primeiro_calculo / 18

    if (sustainableLine_ESI_K1_Visible) {
        var X_values = [];
        var Y_values = [];

        Y_values.push(0);

        // Primeiro calculo = (2*input + 1 - Math.sqrt(4*input + 1))/(input * 2)
        var primeiro_calculo = (2 * valueSustainable_ESI_K1 + 1 - Math.sqrt(4 * valueSustainable_ESI_K1 + 1)) / (valueSustainable_ESI_K1 * 2);

        // Segundo calculo = Primeiro calculo / 18
        var segundo_calculo = primeiro_calculo / 18;

        // Terceiro Calculo = Segundo Calculo * 1... 2... 3... 17
        for (var i = 1; i <= 17; i++) {
            Y_values.push(segundo_calculo * i);
        }

        Y_values.push(primeiro_calculo);

        // Quarto Calculo = (1/Math.sqrt(3)) * (((2*Yrespectivo)/(input*(1-Yrespectivo))) + Yrespectivo - 1);
        for (var j = 0; j <= 19; j++) {
            var quarto_calculo = (1 / Math.sqrt(3)) * (((2 * Y_values[j]) / (valueSustainable_ESI_K1 * (1 - Y_values[j]))) + Y_values[j] - 1);
            X_values.push(quarto_calculo);
        }


        // Desenha a linha 
        ctx.beginPath();
        // Move para o primeiro ponto
        var startPoint = convertToPixel(X_values[0], Y_values[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        // Desenha a linha entre os pontos restantes
        for (var j = 0; j <= 19; j++) {
            var pixel = convertToPixel(X_values[j], Y_values[j]);
            ctx.lineTo(pixel.x, pixel.y);

            // Adiciona um label no último ponto
            if (j === 18) {
                ctx.fillStyle = "black";
                ctx.font = "14px Arial";
                ctx.fillText("ESI = " + valueSustainable_ESI_K1, pixel.x, pixel.y - 10); // Ajuste a posição do label conforme necessário
            }
        }
        // Define a cor da linha
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    } 
}

function mostrarSustainableLine_ESI_K2() {
    var checkbox_ESI_K2 = document.getElementById("ESI_K2");
    var sustainableLine_ESI_K2_Visible = checkbox_ESI_K2.checked;
    var valueSustainable_ESI_K2 = document.getElementById("valueESI_K2").value;

    primeiro_calculo = (2 * valueSustainable_ESI_K2 + 1 - Math.sqrt(4 * valueSustainable_ESI_K2 + 1)) / (valueSustainable_ESI_K2 * 2) 

    segundo_calculo = primeiro_calculo / 18

    if (sustainableLine_ESI_K2_Visible) {
        var X_values = [];
        var Y_values = [];

        Y_values.push(0);

        var primeiro_calculo = (2 * valueSustainable_ESI_K2 + 1 - Math.sqrt(4 * valueSustainable_ESI_K2 + 1)) / (valueSustainable_ESI_K2 * 2);

        var segundo_calculo = primeiro_calculo / 18;

        for (var i = 1; i <= 17; i++) {
            Y_values.push(segundo_calculo * i);
        }

        Y_values.push(primeiro_calculo);

        for (var j = 0; j <= 19; j++) {
            var quarto_calculo = (1 / Math.sqrt(3)) * (((2 * Y_values[j]) / (valueSustainable_ESI_K2 * (1 - Y_values[j]))) + Y_values[j] - 1);
            X_values.push(quarto_calculo);
        }


        ctx.beginPath();

        var startPoint = convertToPixel(X_values[0], Y_values[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        for (var j = 0; j <= 19; j++) {
            var pixel = convertToPixel(X_values[j], Y_values[j]);
            ctx.lineTo(pixel.x, pixel.y);

            if (j === 18) {
                ctx.fillStyle = "black";
                ctx.font = "14px Arial";
                ctx.fillText("ESI = " + valueSustainable_ESI_K2, pixel.x, pixel.y - 10); // Ajuste a posição do label conforme necessário
            }
        }

        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    } else {
        X_values = [];
        Y_values = [];
    }
}

function mostrarSustainableLine_ESI_K3() {
    var checkbox_ESI_K3 = document.getElementById("ESI_K3");
    var sustainableLine_ESI_K3_Visible = checkbox_ESI_K3.checked;
    var valueSustainable_ESI_K3 = document.getElementById("valueESI_K3").value;

    primeiro_calculo = (2 * valueSustainable_ESI_K3 + 1 - Math.sqrt(4 * valueSustainable_ESI_K3 + 1)) / (valueSustainable_ESI_K3 * 2) 

    segundo_calculo = primeiro_calculo / 18

    if (sustainableLine_ESI_K3_Visible) {
        var X_values = [];
        var Y_values = [];

        Y_values.push(0);

        var primeiro_calculo = (2 * valueSustainable_ESI_K3 + 1 - Math.sqrt(4 * valueSustainable_ESI_K3 + 1)) / (valueSustainable_ESI_K3 * 2);

        var segundo_calculo = primeiro_calculo / 18;

        for (var i = 1; i <= 17; i++) {
            Y_values.push(segundo_calculo * i);
        }

        Y_values.push(primeiro_calculo);

        for (var j = 0; j <= 19; j++) {
            var quarto_calculo = (1 / Math.sqrt(3)) * (((2 * Y_values[j]) / (valueSustainable_ESI_K3 * (1 - Y_values[j]))) + Y_values[j] - 1);
            X_values.push(quarto_calculo);
        }

        ctx.beginPath();
        var startPoint = convertToPixel(X_values[0], Y_values[0]);
        ctx.moveTo(startPoint.x, startPoint.y);

        for (var j = 0; j <= 19; j++) {
            var pixel = convertToPixel(X_values[j], Y_values[j]);
            ctx.lineTo(pixel.x, pixel.y);

            if (j === 18) {
                ctx.fillStyle = "black";
                ctx.font = "14px Arial";
                ctx.fillText("ESI = " + valueSustainable_ESI_K3, pixel.x, pixel.y - 10); // Ajuste a posição do label conforme necessário
            }
        }

        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    } else {
        X_values = [];
        Y_values = [];
    }
}

var quantityInputs = document.getElementsByClassName('acrecimo');

for (var i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener('change', function() {
        var quantityValue = parseInt(this.value);

        if (quantityValue >= 1 && quantityValue < 10) {
            quantityInputs.value = 0
            this.step = 0.1; 
        } else if (quantityValue >= 10) {
            quantityInputs.value = 0
            this.step = 1; // Altera o step para 2 se a quantidade estiver entre 10 e 19
        } else if (quantityValue <= 1){
            quantityInputs.value = 0.99
            this.step = 0.01;
        }
    });
}

/*===========SENSIBILITY LINES===========*/

// Obtém a referência para os datalists
const valueSelectPointR_MR_SR = document.getElementById("valueSelectPointR_MR_SR");
const valueSelectPointN = document.getElementById("valueSelectPointN");
const valueSelectPointMN_SN = document.getElementById("valueSelectPointMN_SN");


rawData.forEach(point => {
    const optionR_MR_SR = document.createElement('option');
    const optionN = document.createElement("option");
    const optionMN_SN = document.createElement("option");
    optionR_MR_SR.value = point.label;
    optionN.value = point.label;
    optionMN_SN.value = point.label;
    optionR_MR_SR.textContent = point.label;
    optionN.textContent = point.label;
    optionMN_SN.textContent = point.label;
    valueSelectPointR_MR_SR.appendChild(optionR_MR_SR);
    valueSelectPointN.appendChild(optionN);
    valueSelectPointMN_SN.appendChild(optionMN_SN);
});

function carregarDadosSensibilityR_MR_SR() {
    const SelectValuePointR_MR_SR = valueSelectPointR_MR_SR.value;

    const selectedPointR_MR_SR = rawData.find(point => point.label === SelectValuePointR_MR_SR);

    // Verifica se o ponto selecionado foi encontrado
    if (selectedPointR_MR_SR) {
        // Normaliza os dados do ponto selecionado para a escala do gráfico ternário (0 a 1)
        const normalizedPoint = {
            A: selectedPointR_MR_SR.R / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            B: selectedPointR_MR_SR.Mr / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            C: selectedPointR_MR_SR.Sr / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            D: selectedPointR_MR_SR.N / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            E: selectedPointR_MR_SR.Mn / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            F: selectedPointR_MR_SR.Sn / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            G: selectedPointR_MR_SR.Y = selectedPointR_MR_SR.R + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr + selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn,
            H: selectedPointR_MR_SR.Ró = (selectedPointR_MR_SR.R + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr) / selectedPointR_MR_SR.Y,
            I: selectedPointR_MR_SR.Eta = selectedPointR_MR_SR.N / selectedPointR_MR_SR.Y,
            J: selectedPointR_MR_SR.Fi = (selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn) / selectedPointR_MR_SR.Y,
            K: selectedPointR_MR_SR.F = selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr,
            L: selectedPointR_MR_SR.EYR = 1 / (selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn),
            M: selectedPointR_MR_SR.EIR = selectedPointR_MR_SR.F / (selectedPointR_MR_SR.N + (selectedPointR_MR_SR.R + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr)),
            N: selectedPointR_MR_SR.ELR = (selectedPointR_MR_SR.N + selectedPointR_MR_SR.Mn + selectedPointR_MR_SR.Sn) / (selectedPointR_MR_SR.R + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr),
            O: selectedPointR_MR_SR.SI = selectedPointR_MR_SR.EYR / selectedPointR_MR_SR.EIR,
            P: selectedPointR_MR_SR.PorcentageR = (selectedPointR_MR_SR.R + selectedPointR_MR_SR.Mr + selectedPointR_MR_SR.Sr) / selectedPointR_MR_SR.Y,
        };

        // Normaliza os valores  
        const x = (2 * normalizedPoint.J + normalizedPoint.H - 1) / Math.sqrt(3);
        const y = normalizedPoint.H;

        var pixel = convertToPixel(x, y);
        var startPoint = convertToPixel(0, 1);

        // Desenha a linha entre o ponto selecionado e o ponto de origem
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(pixel.x, pixel.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    }
}

function carregarDadosSensibilityN() {
    const SelectValuePointN = valueSelectPointN.value;

    const selectedPointN = rawData.find(point => point.label === SelectValuePointN);

    // Verifica se o ponto selecionado foi encontrado
    if (selectedPointN) {
        // Normaliza os dados do ponto selecionado para a escala do gráfico ternário (0 a 1)
        const normalizedPoint = {
            A: selectedPointN.R / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            B: selectedPointN.Mr / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            C: selectedPointN.Sr / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            D: selectedPointN.N / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            E: selectedPointN.Mn / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            F: selectedPointN.Sn / (selectedPointN.R + selectedPointN.N + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.Mn + selectedPointN.Sn),
            G: selectedPointN.Y = selectedPointN.R + selectedPointN.Mr + selectedPointN.Sr + selectedPointN.N + selectedPointN.Mn + selectedPointN.Sn,
            H: selectedPointN.Ró = (selectedPointN.R + selectedPointN.Mr + selectedPointN.Sr) / selectedPointN.Y,
            I: selectedPointN.Eta = selectedPointN.N / selectedPointN.Y,
            J: selectedPointN.Fi = (selectedPointN.Mn + selectedPointN.Sn) / selectedPointN.Y,
            K: selectedPointN.F = selectedPointN.Mn + selectedPointN.Sn + selectedPointN.Mr + selectedPointN.Sr,
            L: selectedPointN.EYR = 1 / (selectedPointN.Mn + selectedPointN.Sn),
            M: selectedPointN.EIR = selectedPointN.F / (selectedPointN.N + (selectedPointN.R + selectedPointN.Mr + selectedPointN.Sr)),
            N: selectedPointN.ELR = (selectedPointN.N + selectedPointN.Mn + selectedPointN.Sn) / (selectedPointN.R + selectedPointN.Mr + selectedPointN.Sr),
            O: selectedPointN.SI = selectedPointN.EYR / selectedPointN.EIR,
            P: selectedPointN.PorcentageR = (selectedPointN.R + selectedPointN.Mr + selectedPointN.Sr) / selectedPointN.Y,
        };

        // Normaliza os valores  
        const x = (2 * normalizedPoint.J + normalizedPoint.H - 1) / Math.sqrt(3);
        const y = normalizedPoint.H;

        var pixel = convertToPixel(x, y);
        var startPoint = convertToPixel(-0.58, 0);

        // Desenha a linha entre o ponto selecionado e o ponto de origem
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(pixel.x, pixel.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    }
}

function carregarDadosSensibility_Mn_Sn() {
    const SelectValuePoint_Mn_Sn = valueSelectPointMN_SN.value;

    const selectedPoint_Mn_Sn = rawData.find(point => point.label === SelectValuePoint_Mn_Sn);

    // Verifica se o ponto selecionado foi encontrado
    if (selectedPoint_Mn_Sn) {
        // Normaliza os dados do ponto selecionado para a escala do gráfico ternário (0 a 1)
        const normalizedPoint = {
            A: selectedPoint_Mn_Sn.R / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            B: selectedPoint_Mn_Sn.Mr / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            C: selectedPoint_Mn_Sn.Sr / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            D: selectedPoint_Mn_Sn.N / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            E: selectedPoint_Mn_Sn.Mn / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            F: selectedPoint_Mn_Sn.Sn / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            G: selectedPoint_Mn_Sn.Y = selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr + selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn,
            H: selectedPoint_Mn_Sn.Ró = (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr) / selectedPoint_Mn_Sn.Y,
            I: selectedPoint_Mn_Sn.Eta = selectedPoint_Mn_Sn.N / selectedPoint_Mn_Sn.Y,
            J: selectedPoint_Mn_Sn.Fi = (selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn) / selectedPoint_Mn_Sn.Y,
            K: selectedPoint_Mn_Sn.F = selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr,
            L: selectedPoint_Mn_Sn.EYR = 1 / (selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn),
            M: selectedPoint_Mn_Sn.EIR = selectedPoint_Mn_Sn.F / (selectedPoint_Mn_Sn.N + (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr)),
            N: selectedPoint_Mn_Sn.ELR = (selectedPoint_Mn_Sn.N + selectedPoint_Mn_Sn.Mn + selectedPoint_Mn_Sn.Sn) / (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr),
            O: selectedPoint_Mn_Sn.SI = selectedPoint_Mn_Sn.EYR / selectedPoint_Mn_Sn.EIR,
            P: selectedPoint_Mn_Sn.PorcentageR = (selectedPoint_Mn_Sn.R + selectedPoint_Mn_Sn.Mr + selectedPoint_Mn_Sn.Sr) / selectedPoint_Mn_Sn.Y,
        };

        // Normaliza os valores  
        const x = (2 * normalizedPoint.J + normalizedPoint.H - 1) / Math.sqrt(3);
        const y = normalizedPoint.H;

        var pixel = convertToPixel(x, y);
        var startPoint = convertToPixel(0.58, 0);

        // Desenha a linha entre o ponto selecionado e o ponto de origem
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(pixel.x, pixel.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

    }
}








/*===========SIMERGY LINES===========*/

const simergyButton = document.getElementById('bt_simergy');
const checkboxPontoMedio = document.getElementById('toggleSimmergy');
checkboxPontoMedio.addEventListener("change", togglePontoMedio);
let pontoMedioAtivo = false;
let pontoMedioData = null;

function calcularPontoMedio(data, pontosAtivados) {
    const numberOfPoints = pontosAtivados.length;

    if (numberOfPoints === 0) {
        return null;
    }

    let sumR = 0,
        sumMr = 0,
        sumSr = 0,
        sumN = 0,
        sumMn = 0,
        sumSn = 0;

    for (const pointIndex of pontosAtivados) {
        const point = data[pointIndex];
        sumR += point.R;
        sumMr += point.Mr;
        sumSr += point.Sr;
        sumN += point.N;
        sumMn += point.Mn;
        sumSn += point.Sn;
    }

    const averageR = sumR / numberOfPoints;
    const averageMr = sumMr / numberOfPoints;
    const averageSr = sumSr / numberOfPoints;
    const averageN = sumN / numberOfPoints;
    const averageMn = sumMn / numberOfPoints;
    const averageSn = sumSn / numberOfPoints;

    return {
        R: averageR,
        Mr: averageMr,
        Sr: averageSr,
        N: averageN,
        Mn: averageMn,
        Sn: averageSn,
        label: "Simergy"
    };
}

let pontoMedioAdicionado = false;

function togglePontoMedio() {
    const checkboxPontoMedio = document.getElementById('toggleSimmergy');
    const simergyPoint_Visivel = checkboxPontoMedio.checked;

    // Obter os pontos ativados
    const pontosAtivados = obterPontosAtivados();

    if (simergyPoint_Visivel && !pontoMedioAdicionado) {
        pontoMedioData = calcularPontoMedio(rawData, pontosAtivados);
        if (pontoMedioData) {
            rawData.push(pontoMedioData);
            pontoMedioAdicionado = true;
        }
    } else if (!simergyPoint_Visivel && pontoMedioAdicionado) {
        const indexToRemove = rawData.findIndex(ponto => ponto.label === "Simergy");
        if (indexToRemove !== -1) {
            rawData.splice(indexToRemove, 1);
            pontoMedioAdicionado = false;
        }
        pontoMedioData = null;
    }

    // Após realizar as operações, verifique se há alterações nos pontos de Simergy
    verificarAlteracaoPontoSimergy();
    atualizarLabelSelect();
}

// Função para obter os pontos ativados
function obterPontosAtivados() {
    const pontosAtivados = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="checkbox-simmergy-"]');

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            pontosAtivados.push(index);
        }
    });

    return pontosAtivados;
}

// Verifique se houve alguma alteração nos valores dos pontos de Simergy
function verificarAlteracaoPontoSimergy() {
    const checkboxPontoMedio = document.getElementById('toggleSimmergy');
    const simergyPoint_Visivel = checkboxPontoMedio.checked;

    if (simergyPoint_Visivel) {
        // Simule a desativação e reativação do checkbox sem alterar a interface do usuário
        checkboxPontoMedio.checked = false;
        checkboxPontoMedio.checked = true;

        // Atualize os dados do ponto médio se necessário
        if (pontoMedioAdicionado) {
            const indexToRemove = rawData.findIndex(ponto => ponto.label === "Simergy");
            if (indexToRemove !== -1) {
                rawData.splice(indexToRemove, 1);
            }
            const pontosAtivados = obterPontosAtivados();
            pontoMedioData = calcularPontoMedio(rawData, pontosAtivados);
            if (pontoMedioData) {
                rawData.push(pontoMedioData);
            }
        }
    }
}

function adicionarPontosSimmergy() {
    const pointsContainer = document.getElementById('selectionShowLinesSimmergy');

    rawData.sort((a, b) => a.id - b.id);

    // Iterar sobre os dados brutos e adicionar os pontos
    rawData.forEach((point, index) => {
        // Criar um elemento de div para o ponto
        const pointDiv = document.createElement('div');
        pointDiv.classList.add('point');

        // Adicionar o número do ponto
        const pointNumber = document.createElement('span');
        pointNumber.textContent = `${index + 1} `;
        pointDiv.appendChild(pointNumber);

        // Criar uma checkbox para ativar/desativar o ponto
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-simmergy-${point.id}`;
        checkbox.checked = true; // Definir como marcado por padrão
        checkbox.dataset.pointId = point.id; // Adicionar o ID do ponto como um atributo de dados
        pointDiv.appendChild(checkbox);
        checkbox.addEventListener('change', function() {
            const isChecked = checkbox.checked;

            // Verificar se o checkbox está marcado ou não
            if (!isChecked) {
                // Desenha as linhas conectando o ponto Simergy aos outros pontos
                apagarLinhasSimmergy(point);
            } 
        });

        // Criar um input desativado para mostrar o nome do ponto
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.value = point.label;
        inputName.disabled = true;
        pointDiv.appendChild(inputName);

        // Adicionar o ponto à div de contêiner de pontos
        pointsContainer.appendChild(pointDiv);
    });
    
}

// Função para apagar linhas conectando o ponto Simergy aos outros pontos
function apagarLinhasSimmergy(point) {
    const pixel = convertToPixel(point);
    const otherPoints = rawData.filter(otherPoint => otherPoint.label !== "Simergy");

    // Apaga linhas conectando o ponto Simergy a cada outro ponto
    otherPoints.forEach(otherPoint => {
        const otherX = (2 * otherPoint.Fi + otherPoint.Ró - 1) / Math.sqrt(3);
        const otherY = otherPoint.Ró;
        const otherPixel = convertToPixel({ x: otherX, y: otherY });

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        desenharGraficoTernario(); // Redesenha o gráfico ternário
    });
}

adicionarPontosSimmergy();





/*


            APPERANCE 


*/

let apperencePopUp = document.getElementById('popup-apperance')

function abraApperance() {
    apperencePopUp.classList.add("open-popup");
}


function fecheApperance() {
    apperencePopUp.classList.remove("open-popup");
}


/*

        PRINT AND EXPORT 

*/


let printAndExportPopUp = document.getElementById('popup-PrintAndExport')

function abraPrintAndExport() {
    printAndExportPopUp.classList.add("open-popup");
}


function fechePrintAndExport() {
    printAndExportPopUp.classList.remove("open-popup");
}


function exportCanvasPNG() {
    var canvas = document.getElementById('ternaryChart');
    var dataURL = canvas.toDataURL(); // Obtém a URL de dados do canvas

    // Cria um novo canvas para a imagem em branco
    var blankCanvas = document.createElement('canvas');
    var ctx = blankCanvas.getContext('2d');

    // Define as dimensões do novo canvas igual ao canvas original
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;

    // Desenha a imagem em branco no novo canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);

    // Desenha a imagem recortada do canvas original na frente da imagem em branco
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0); // Desenha a imagem recortada do canvas original
        // Exporta o novo canvas contendo ambas as imagens
        var dataURL = blankCanvas.toDataURL();
        var downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'ternaryChart.png'; // Nome do arquivo a ser baixado
        // Adiciona o link ao corpo do documento e simula um clique
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // Remove o link temporário do corpo do documento
        document.body.removeChild(downloadLink);
    };
    img.src = dataURL;
}

function exportTableInPDF() {
    const resumeDiv = document.getElementById("resume");

    html2canvas(resumeDiv)
        .then((canvas) => {
            const canvasData = canvas.toDataURL("image/png", 1.0);
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const pdf = new jsPDF("", "pt", "a4");
            pdf.addImage(canvasData, "PNG", 0, 0, canvasWidth, canvasHeight, "", "FAST");
            pdf.save("resume.pdf");
        });
}








// Função para exportar o canvas para PDF
function exportCanvasPDF() {
    var canvas = document.getElementById('ternaryChart');
    var dataURL = canvas.toDataURL(); // Obtém a URL de dados do canvas
   

    // Cria um novo objeto jsPDF
    var pdf = new jsPDF();

    // Adiciona a imagem do canvas ao PDF centralizada
    pdf.addImage(dataURL, 'PNG', 15, 40, 180, 180);

    // Salva o PDF com o nome desejado
    pdf.save('ternaryChart.pdf');
}



//Função que faz o fundo recortado 

function exportCanvasCroppedBackground() {
    var canvas = document.getElementById('ternaryChart');
    var dataURL = canvas.toDataURL(); // Obtém a URL de dados do canvas

    // Cria um link temporário para download
    var downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'ternaryChart.png'; // Nome do arquivo a ser baixado

    // Adiciona o link ao corpo do documento e simula um clique
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove o link temporário do corpo do documento
    document.body.removeChild(downloadLink);
}

/*

ATUALIZAÇÕES NO FRONT CASO OPTE POR IR SEM RENOVABILIDADE PARCIAL

*/

const divLabelsInputs = document.getElementById('divLabelsInputs');
const switchRenovabilidadeParcial = document.getElementById('flexSwitchCheckChecked');

switchRenovabilidadeParcial.addEventListener('change', () => {
    if (switchRenovabilidadeParcial.checked) {
        // Se o switch estiver ativado, exiba todos os labels e inputs
        divLabelsInputs.innerHTML = `
        <label for="Name">Name: </label>
        <input type="text" class="form-control" id="dataInput_Name">
        <label for="R">R: </label>
        <input type="number" class="form-control" id="dataInput_R">
        <label for="Mr">Mr: </label>
        <input type="number" class="form-control" id="dataInput_Mr">
        <label for="Sr">Sr: </label>
        <input type="number" class="form-control" id="dataInput_Sr">
        <label for="N">N: </label>
        <input type="number" class="form-control" id="dataInput_N">
        <label for="Mn">Mn: </label>
        <input type="number" class="form-control" id="dataInput_Mn">
        <label for="Sn">Sn: </label>
        <input type="number" class="form-control" id="dataInput_Sn">
  
        <button class="btn btn-primary" onclick="enviarDados()">Enviar</button>
        `;
    } else {
        // Se o switch estiver desativado, exiba apenas R:, N:, F:
        divLabelsInputs.innerHTML = `
        <label for="Name">Name: </label>
        <input type="text" class="form-control" id="dataInput_Name">
        <label for="R">R: </label>
        <input type="number" class="form-control" id="dataInput_R">
        <label for="N">N: </label>
        <input type="number" class="form-control" id="dataInput_N">
        <label for="F">F: </label>
        <input type="number" class="form-control" id="dataInput_F">

        <button class="btn btn-primary" onclick="enviarDados()">Enviar</button>
        `;
    }
});




/*

MOSTRAR AS LINHAS NO GRÁFICO


*/

function mostrarNovosPontos() {
    enviarDados();
    requestAnimationFrame(mostrarNovosPontos);
}

//faz a linha se mover
function animate() {
    mostrarSourceLinesR_Mr_Sr();
    requestAnimationFrame(animate);
}

function ShowSimmetryLines() {
    mostrarLinesOfSimmetry();
    requestAnimationFrame(ShowSimmetryLines);
}




function ShowRegions() {
    mostrarRegios();
    requestAnimationFrame(ShowRegions);
}


function ShowSourceLineN() {
    mostrarSourceLinesN()
    requestAnimationFrame(ShowSourceLineN);
}

function ShowSourceLineMn_Sn() {
    mostrarSourceLinesMn_Sn()
    requestAnimationFrame(ShowSourceLineMn_Sn);
}

function ShowLinhasSensibilidadeR_Mr_Sr() {
    carregarDadosSensibilityR_MR_SR();
    requestAnimationFrame(ShowLinhasSensibilidadeR_Mr_Sr);
}

function ShowLinhasSensibilidadeN() {
    carregarDadosSensibilityN();
    requestAnimationFrame(ShowLinhasSensibilidadeN);
}



function ShowLinhasSensibilidade_Mn_Sn() {
    carregarDadosSensibility_Mn_Sn();
    requestAnimationFrame( ShowLinhasSensibilidade_Mn_Sn);
}

function ShowSustainableLine_ESI_K1() {
    mostrarSustainableLine_ESI_K1();
    requestAnimationFrame(ShowSustainableLine_ESI_K1);
}


function ShowSustainableLine_ESI_K2() {
    mostrarSustainableLine_ESI_K2();
    requestAnimationFrame(ShowSustainableLine_ESI_K2);
}

function ShowSustainableLine_ESI_K3() {
    mostrarSustainableLine_ESI_K3();
    requestAnimationFrame(ShowSustainableLine_ESI_K3);
}


function ShowSourceLinesN() {
    mostrarSourceLinesN();
    requestAnimationFrame(ShowSourceLinesN);
}

function ShowSourceLinesMn_Sn() {
    mostrarSourceLinesMn_Sn();
    requestAnimationFrame(ShowSourceLinesMn_Sn);
}


function ShowHidePoints() {
    adicionarPontos();
    requestAnimationFrame(ShowHidePoints);
}

function ShowPontoMedio() {
    togglePontoMedio();
    requestAnimationFrame(ShowPontoMedio);
}



function ShowLines() {
    ShowSimmetryLines();
    //mostrarNovosPontos();
    ShowRegions();
    animate();
    ShowSourceLinesMn_Sn();
    ShowSourceLinesN();
    ShowLinhasSensibilidadeR_Mr_Sr();
    ShowLinhasSensibilidadeN()
    ShowLinhasSensibilidade_Mn_Sn()
    ShowSourceLineN();
    ShowSourceLineMn_Sn();
    ShowSustainableLine_ESI_K1();
    ShowSustainableLine_ESI_K2();
    ShowSustainableLine_ESI_K3();
    ShowPontoMedio();

}

ShowLines()

desenharGraficoTernario();


// https://pt.stackoverflow.com/questions/266191/como-transformar-imagem-canvas-em-png







