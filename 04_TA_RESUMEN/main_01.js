// 1

var bool = true;
let nombre = "BRYAN";
const edad = 28;

// 2

let nombre_apellido = "BRYAN MUÑOZ";
console.log(`la variable nombre_apellido es : ${typeof nombre}`);

const number = 5;
console.log(`la variable number es : ${typeof number}`);

var boolean = false;
console.log(`la variable boolean es : ${typeof boolean}`);

var hola;
console.log(`la variable hola es : ${typeof hola}`);

let mami = null;
console.log(`la variable mami es : ${typeof mami}`);

const symbol = Symbol("Holis");
console.log(`la variable symbol es : ${typeof symbol}`);

const numerito = 571852158545814635134496n;
console.log(`la variable numerito es : ${typeof numerito}`);

// 3
const a = 5;
const b = 7;

console.log(`La suma de ${a} y ${b} es: ${a + b}`);
console.log(`La resta de ${a} y ${b} es: ${a - b}`);
console.log(`La multiplicación de ${a} y ${b} es: ${a * b}`);
console.log(`La division de ${a} y ${b} es con decimal: ${a / b}`);
console.log(`el modulo de ${b} con respecto a ${a} es: ${b % a}`);
console.log(`el elevado de ${b} ^ ${a} es: ${b ** a}`);

// 4
function evaluarEdad(edad) {
  if (edad < 18) {
    return "Menor de edad";
  } else if (edad <= 65) {
    return "Mayor de edad";
  } else {
    return "Tercera edad";
  }
}

console.log(evaluarEdad(15)); // Menor de edad
console.log(evaluarEdad(30)); // Mayor de edad
console.log(evaluarEdad(70)); // Tercera edad

// 5
const nombres = [
  "Lucía",
  "Mateo",
  "Sofía",
  "Hugo",
  "Valentina",
  "Leo",
  "Martina",
  "Daniel",
  "Emma",
  "Pablo",
  "Julia",
  "Lucas",
  "Isabella",
  "Diego",
  "Camila",
  "Alejandro",
  "Renata",
  "Carlos",
  "Mía",
  "Andrés"
];

for (const nombre of nombres) {
  console.log(`Hola, ${nombre}`);
}

// 6
function procesarNumeros(numeros) {
  return numeros
    .filter(num => num % 2 === 0) // Filtramos los pares
    .map(num => num * 2);         // Multiplicamos cada uno por 2
}

// Ejemplo de uso
const numerosOriginales = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const resultado = procesarNumeros(numerosOriginales);

console.log(resultado); // [4, 8, 12, 16, 20]
