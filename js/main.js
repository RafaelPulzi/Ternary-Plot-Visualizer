const rawData = [{
        R: 1.73E+01,
        Mr: 5.11E+00,
        Sr: 1.84E+01,
        N: 7.30E-01,
        Mn: 4.85E+00,
        Sn: 7.29E+00,
        label: "ArcoIris"
    },
    {
        R: 4.00E+00,
        Mr: 5.00E+00,
        Sr: 6.00E+00,
        N: 2.00E+00,
        Mn: 3.00E+00,
        Sn: 3.00E+00,
        label: "Polo Camiseta"
    },
    {
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
    ctx.fillText("R+Mr+Sr", startPoint.x, startPoint.y - labelOffset);
    ctx.fillText("N", apex1.x, apex1.y + labelOffset);
    ctx.fillText("Mn+Sn", apex2.x, apex2.y + labelOffset);


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
        };

        // Normaliza os valores  
        const x = (2 * normalizedPoint.J + normalizedPoint.H - 1) / Math.sqrt(3);
        const y = normalizedPoint.H

        var pixel = convertToPixel(x, y);

        // Desenha os pontos
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, 5, 0, 2 * Math.PI);
        ctx.fill();
     
        // Adiciona um rótulo numerado
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        if (point.label === "Simergy") {
            ctx.fillText("Simergy", pixel.x + 10, pixel.y + 6);
        } else {
            ctx.fillText(counter, pixel.x + 10, pixel.y + 6);
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

// Função para adicionar pontos dinamicamente
function adicionarPontos() {
    const pointsContainer = document.getElementById('points-container');

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
        checkbox.id = `checkbox-${index} `;
        checkbox.checked = true; 
        pointDiv.appendChild(checkbox);

        // Adicionar um ouvinte de evento para monitorar as mudanças na checkbox
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                // Se estiver marcada, desenhar o ponto no gráfico
                desenharPontoNoGrafico(point);
            } else {
                // Se não estiver marcada, ocultar o ponto do gráfico
                ocultarPontoNoGrafico(point);
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

// Função para desenhar um ponto no gráfico
function desenharPontoNoGrafico(point) {
    // Normalizar os dados do ponto
    const normalizedPoint = {
        x: (2 * point.F + point.H - 1) / Math.sqrt(3),
        y: point.H
    };

    // Converter coordenadas normalizadas para pixels no canvas
    const pixel = convertToPixel(normalizedPoint.x, normalizedPoint.y);

    // Desenhar o ponto no canvas
    ctx.beginPath();
    ctx.arc(pixel.x, pixel.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
}

// Função para ocultar um ponto do gráfico
function ocultarPontoNoGrafico(point) {
    // Normalizar os dados do ponto
    const normalizedPoint = {
        x: (2 * point.F + point.H - 1) / Math.sqrt(3),
        y: point.H
    };

    // Converter coordenadas normalizadas para pixels no canvas
    const pixel = convertToPixel(normalizedPoint.x, normalizedPoint.y);

    // Limpar a área do ponto no canvas
    ctx.clearRect(pixel.x - 5, pixel.y - 5, 10, 10);
}

// Chamada da função para adicionar os pontos ao carregar a página
adicionarPontos();




/*
ABERTURA DE POPUPS- INFORMATION
*/

let informationPopUp = document.getElementById('popup-information')

function abraInformation() {
    informationPopUp.classList.add("open-popup");
}


function fecheInformation() {
    informationPopUp.classList.remove("open-popup");
}



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

    // Mostra o conjunto de conteúdo específico
    document.getElementById(contentId).classList.remove('hidden');
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

        for (var i = 0; i < numsRegiosFirstLine.length; i++) {
            var pixel = convertToPixel(numsRegiosFirstLine[i], Y_valuesFisrtDiagonalLine_invertidos[i]);
            ctx.lineTo(pixel.x, pixel.y);
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

        for (var i = 0; i < numsRegiosSecondLine.length; i++) {
            var pixel = convertToPixel(numsRegiosSecondLine[i], Y_valuesSecondDiagonalLine_invertidos[i]);
            ctx.lineTo(pixel.x, pixel.y);
        }
        // Define a cor da linha
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();



        
    }

    //---------------------------------------------------------------------------------------------------------------------



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
let pontoMedioAtivo = false;
let pontoMedioData = null;

function calcularPontoMedio(data) {
    const numberOfPoints = data.length;

    if (numberOfPoints === 0) {
        return null;
    }

    let sumR = 0,
        sumMr = 0,
        sumSr = 0,
        sumN = 0,
        sumMn = 0,
        sumSn = 0;

    for (const point of data) {
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


function togglePontoMedio() {
    pontoMedioAtivo = !pontoMedioAtivo;

    if (pontoMedioAtivo) {
        pontoMedioData = calcularPontoMedio(rawData);
        rawData.push(pontoMedioData);

    } else {
        rawData.pop();
        pontoMedioData = null;
        desenharGraficoTernario();
    }

    if (pontoMedioAtivo) {
        desenharGraficoTernario();

    }
}



/*

MOSTRAR AS LINHAS NO GRÁFICO


*/

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


function ShowSimmergLineN() {
    mostrarSourceLinesN()
    requestAnimationFrame(ShowSimmergLineN);
}

function ShowSimmergLineMn_Sn() {
    mostrarSourceLinesMn_Sn()
    requestAnimationFrame(ShowSimmergLineMn_Sn);
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

function ShowLines() {
    ShowSimmetryLines();
    ShowRegions();
    animate();
    ShowSourceLinesMn_Sn();
    ShowSourceLinesN();
    ShowLinhasSensibilidadeR_Mr_Sr();
    ShowLinhasSensibilidadeN()
    ShowLinhasSensibilidade_Mn_Sn()
    ShowSimmergLineN();
    ShowSimmergLineMn_Sn();
    ShowSustainableLine_ESI_K1();
    ShowSustainableLine_ESI_K2();
    ShowSustainableLine_ESI_K3();

}

ShowLines()


/*===========PRINT AND EXPORT===========*/

function exportCanvas() {
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



//Função que faz o fundo recortado 
/*
function exportCanvas() {
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
}*/

// https://pt.stackoverflow.com/questions/266191/como-transformar-imagem-canvas-em-png




/*
====================================================================
FALTA ADICIONAR A FUNÇÃO DE INPORTAR OS DADOS. FAZER POSTERIORMENTE
====================================================================
*/


// Chama a função para desenhar o gráfico ternário
desenharGraficoTernario();
