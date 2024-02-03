"use strict";

var rawData = [{
  R: 1.00E+00,
  Mr: 3.00E+00,
  Sr: 3.00E+00,
  N: 2.00E+00,
  Mn: 3.00E+00,
  Sn: 3.00E+00,
  label: "point 1"
}, {
  R: 4.00E+00,
  Mr: 5.00E+00,
  Sr: 6.00E+00,
  N: 2.00E+00,
  Mn: 3.00E+00,
  Sn: 3.00E+00,
  label: "point 2"
}, {
  R: 1.00E+00,
  Mr: 1.00E+00,
  Sr: 1.00E+00,
  N: 1.00E+00,
  Mn: 1.00E+00,
  Sn: 1.00E+00,
  label: "point 3"
}];
var canvas = document.getElementById('ternaryChart');
var ctx = canvas.getContext('2d'); // Função para desenhar o gráfico ternário

function desenharGraficoTernario() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var alturaTriangulo = Math.sqrt(3) * (canvas.width / 2); // Define os vértices do triângulo

  var vertices = [{
    x: 0,
    y: alturaTriangulo
  }, {
    x: canvas.width,
    y: alturaTriangulo
  }, {
    x: canvas.width / 2,
    y: 0
  }]; // Desenha as linhas do triângulo

  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[1].x, vertices[1].y);
  ctx.lineTo(vertices[2].x, vertices[2].y);
  ctx.closePath();
  ctx.stroke(); // Desenha os pontos no gráfico ternário

  rawData.forEach(function (point) {
    // Normaliza os dados para a escala do gráfico ternário (0 a 1)
    var normalizedPoint = {
      A: point.R / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
      B: point.Mr / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
      C: point.Sr / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
      D: point.N / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
      E: point.Mn / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn),
      F: point.Sn / (point.R + point.N + point.Mr + point.Sr + point.Mn + point.Sn)
    };
    var x = normalizedPoint.A * vertices[0].x + normalizedPoint.B * vertices[0].x + normalizedPoint.C * vertices[0].x + normalizedPoint.D * vertices[1].x + normalizedPoint.E * vertices[2].x + normalizedPoint.F * vertices[2].x;
    var y = normalizedPoint.A * vertices[0].y + normalizedPoint.B * vertices[0].y + normalizedPoint.C * vertices[0].y + normalizedPoint.D * vertices[1].y + normalizedPoint.E * vertices[2].y + normalizedPoint.F * vertices[2].y; // Desenha os pontos

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill(); // Adiciona um evento de mouseover para exibir o rótulo quando o mouse passar sobre o ponto

    canvas.addEventListener('mousemove', function (event) {
      var mouseX = event.clientX - canvas.getBoundingClientRect().left;
      var mouseY = event.clientY - canvas.getBoundingClientRect().top;

      if (mouseX > x - 10 && mouseX < x + 10 && mouseY > y - 10 && mouseY < y + 10) {
        exibirRotulo(point.label, x, y);
      }
    });
  });
} // Função auxiliar para exibir o rótulo


function exibirRotulo(label, x, y) {
  ctx.fillStyle = 'black';
  ctx.fillText(label, x + 10, y - 10);
} // Chama a função para desenhar o gráfico ternário


desenharGraficoTernario();
/*

=========================================================


FUNÇÃO PARA DETERMINAR O GRÁFICO EM RNF 


=========================================================


const rawData = [
    { R: 1.00E+00, N: 2.00E+00, F: 3.00E+00, label: "point 1" },
    { R: 4.00E+00, N: 5.00E+00, F: 6.00E+00, label: "point 2" },
    { R: 1.00E+00, N: 1.00E+00, F: 1.00E+00, label: "point 3" },
];

const canvas = document.getElementById('ternaryChart');
const ctx = canvas.getContext('2d');

// Função para desenhar o gráfico ternário
function desenharGraficoTernario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const alturaTriangulo = Math.sqrt(3) * (canvas.width / 2);

    // Define os vértices do triângulo       [Definir alturas do triangulos como for necessário, contudo fazer elas serem resposivas, basta mudas o X e Y abaixo]
    const vertices = [
        { x: 0, y: alturaTriangulo },
        { x: canvas.width, y: alturaTriangulo },
        { x: canvas.width / 2, y: 0 },
    ];


    // Desenha as linhas do triângulo
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.closePath();
    ctx.stroke();

    // Desenha os pontos no gráfico ternário
    rawData.forEach((point) => {
        // Normaliza os dados para a escala do gráfico ternário (0 a 1)
        const normalizedPoint = {
            A: point.R / (point.R + point.N + point.F),
            B: point.N / (point.R + point.N + point.F),
            C: point.F / (point.R + point.N + point.F),
        };

        const x = normalizedPoint.A * vertices[0].x + normalizedPoint.B * vertices[1].x + normalizedPoint.C * vertices[2].x;
        const y = normalizedPoint.A * vertices[0].y + normalizedPoint.B * vertices[1].y + normalizedPoint.C * vertices[2].y;

        // Desenha os pontos
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Adiciona um evento de mouseover para exibir o rótulo quando o mouse passar sobre o ponto
        canvas.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;

            if (mouseX > x - 10 && mouseX < x + 10 && mouseY > y - 10 && mouseY < y + 10) {
                exibirRotulo(point.label, x, y);
            }
        });
    });
}

// Função auxiliar para exibir o rótulo
function exibirRotulo(label, x, y) {
    ctx.fillStyle = 'black';
    ctx.fillText(label, x + 10, y - 10);
}

// Chama a função para desenhar o gráfico ternário
desenharGraficoTernario();

*/