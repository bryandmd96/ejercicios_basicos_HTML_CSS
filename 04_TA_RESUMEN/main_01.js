// 1

var bool = true;
let nombre = "BRYAN";
const edad = 28;

// 2
console.log("-------DIFERENTES TIPOS DE VARIABLES EN JS-------");
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
console.log("-------OPERACIONES ARITMETICAS-------");
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

console.log("-------EVALUADOR DE EDAD-------");
console.log(evaluarEdad(15));
console.log(evaluarEdad(30));
console.log(evaluarEdad(70));

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

console.log("-------SALUDAR A PERSONAS EN ARRAY-------");
for (const nombre of nombres) {
  console.log(`Hola, ${nombre}`);
}

// 6
function procesarNumeros(numeros) {
  return numeros
    .filter(num => num % 2 === 0) // Filtramos los pares
    .map(num => num * 2);         // Multiplicamos cada uno por 2
}

const numerosOriginales = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const resultado = procesarNumeros(numerosOriginales);

console.log("-------MULTIPLICADOR DE PARES POR DOS-------");
console.log(resultado); // [4, 8, 12, 16, 20]

// 7
function obtenerDivisores(numero) {
  const divisores = [];

  for (let i = 1; i <= numero; i++) {
    if (numero % i === 0) {
      divisores.push(i);
    }
  }

  return divisores;
}

console.log("-------OBTENEDOR DE DIVISORES-------");
console.log(obtenerDivisores(12)); // [1, 2, 3, 4, 6, 12]


// 8
function verificarAcceso(rol, estado) {
  if (rol === "admin") {
    if (estado === "activo") {
      return "Acceso total";
    } else {
      return "Acceso denegado";
    }
  } else if (rol === "editor") {
    if (estado === "activo") {
      return "Acceso parcial";
    } else {
      return "Acceso denegado";
    }
  } else if (rol === "usuario") {
    if (estado === "activo") {
      return "Acceso limitado";
    } else {
      return "Acceso denegado";
    }
  } else {
    return "Acceso denegado";
  }
}
console.log("-------EVALUADOR DE ESTADO DEL USUARIO-------");
console.log(`El usuario <admin> activo tiene : ${verificarAcceso("admin", "activo")}`);
console.log(`El usuario <admin> inactivo tiene : ${verificarAcceso("admin", "inactivo")}`);
console.log(`El usuario <editor> activo tiene : ${verificarAcceso("editor", "activo")}`);
console.log(`El usuario <editor> inactivo tiene : ${verificarAcceso("editor", "inactivo")}`);
console.log(`El usuario <usuario> activo tiene : ${verificarAcceso("usuario", "activo")}`); 
console.log(`El usuario <usuario> inactivo tiene : ${verificarAcceso("usuario", "inactivo")}`); 
console.log(`Este usuario <cualquiera> tiene: ${verificarAcceso("invitado", "activo")}`); 

//9 
function evaluarPermisos(edad, saldo, rol) {
  return (rol === "admin" || saldo > 1000)
    ? "Acceso total"
    : (edad > 18 && saldo > 100)
    ? "Acceso limitado"
    : "Acceso denegado";
}
console.log("-------EVALUADOR DE PREMISOS-------");
console.log(evaluarPermisos(25, 100, "admin")); // Acceso total
console.log(evaluarPermisos(25, 2000, "editor")); // Acceso total
console.log(evaluarPermisos(20, 150, "usuario")); // Acceso limitado
console.log(evaluarPermisos(16, 50, "invitado")); // Acceso denegado

// 10
function crearContadorDesde(x) {
  return function () {
    return x++;
  };
}

const contador = crearContadorDesde(5);

console.log("-------CONTADOR DE USO DE FUNCIÓN-------");
console.log(contador()); // 5
console.log(contador()); // 6
console.log(contador()); // 7

