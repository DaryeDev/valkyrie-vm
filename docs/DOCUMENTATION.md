# Documentation

## Arquitectura del proyecto

```bash
valkyrie-vm
├───.vscode
├───docs
│   └───imgs
├───prev
├───src
│   └───components
│       └───buttons
└───tests
```

Este bloque de código representa la arquitectura del proyecto, en donde se encuentra:

- `.vscode`: contiene archivos de configuración para el proyecto
- `docs`: mantiene documentos relevantes para el mantenimiento y uso
  - `imgs`: carpeta de imágenes general
  <!-- TODO: Cambiar nombre y ruta de la carpeta prev/ -->
- `.prev`: destino de los archivos backend
- `.src`: ruta de los archivos frontend
  <!-- Más o menos los componentes... -->
  - `components`: partes funcionales para el front
    <!-- No se muy bien qué poner en buttons -->
    - `buttons`: ... accionadores del front...
- `tests`: archivos de test

## Funcionamiento de la VM

Valkyrie-vm es una Máquina Virtual (VM) que funciona con una estrutura de datos de tipo pila. Para lograr que funcione se utilizan los siguientes archivos

### stack.js - Implementación de una pila

Este archivo define la estructura de la pila mediante la clase _Stack_. Las operaciones que implementa son:

- `push(elemento)`: Agrega un elemento a la pila
- `pop()`: Elimina el último elemento de la pila y lo retorna. Si la pila está vacía, devuelve Underflow"
- `peek()`: Retorna el último elemento de la pila sin eliminarlo. Si la pila está vacía, devuelve "No elements in Stack"
- `isEmpty()`: Verifica si la pila está vacía
- `length()`: Devuelve la cantidad de elementos en la pila​

### vm.js - Implementación de ValkyrieVM

Mediante la clase ValkyrieVM, que representa la VM, se definen un conjunto de operaciones. Las características clave son:

- Pilas: La VM tiene múltiples pilas ($1, $2, $3, ..., $7, $B) que se pueden manipular con instrucciones. Además de una pila de Buffer de ayuda para las operaciones más complejas.

Instrucciones soportadas:

#### PUSH "𖤍"

Agrega un valor a una pila.

```valkyrie-vm
PUSH {to} {value}
```

- to: pila destino
- value: valor a enviar

#### POP "♅"

Elimina el valor de la cima de una pila

```valkyrie-vm
POP {to}
```

- to: pila destino

#### ADD "↟"

Suma dos valores y almacena el resultado en la pila

```valkyrie-vm
ADD {to & value1} {value2}
ADD {to} {value1} {value2}
```

- to: pila destino
- value1: primer valor de suma
- value2: segundo valor de suma

#### SUB "↡"

Resta dos valores

```valkyrie-vm
SUB {to & value1} {value2}
SUB {to} {value1} {value2}
```

- to: pila destino
- value1: primer valor de resta
- value2: segundo valor de resta

#### DIV "↞"

Realiza división entre dos valores

```valkyrie-vm
DIV {to & value} {divisor}
DIV {to} {value} {divisor}
```

- to: pila destino
- value: dividendo
- divisor: divisor

#### DIVINT "↞↞"

División entera

```valkyrie-vm
DIVINT {to & value} {divisor}
DIVINT {to} {value} {divisor}
```

- to: pila destino
- value: dividendo
- divisor: divisor

#### MOD "↡↞"

Calcula el módulo de dos valores

```valkyrie-vm
MOD {to} {value1} {divisor}
```

- to: pila destino
- value: dividendo
- divisor: divisor

#### MUL "↠"

Multiplica dos valores

```valkyrie-vm
DIVINT {to & value} {múltiplo}
MUL {to} {value1} {múltiplo}
```

- to: pila destino
- value: valor a multiplicar
- múltiplo: valor de multiplicación

#### EXP "↠↠"

Eleva un valor a una potencia

```valkyrie-vm
EXP {to} {value} {exponente}
```

- to: pila destino
- value: base
- exponente: exponente

#### SWAP "↡↟"

Intercambia los valores entre dos pilas

```valkyrie-vm
SWAP {stack1} {stack2}
```

- stack1: dirección de pila 1
- stack2: dirección de pila 2

#### PRINT "♅♅"

Imprime el valor de una pila

```valkyrie-vm
PRINT {value}
```

- value: valor a imprimir

#### CLEAR

Vacía una pila

```valkyrie-vm
CLEAR {stack}
```

- stack: stack a vaciar

#### COMPACT "🕈"

Combina los valores de una pila en un solo valor (suma de elementos)

```valkyrie-vm
COMPACT {stack}
```

- stack: stack a combinar

#### RANDINT "𖤓☽"

Genera un número entero aleatorio dentro de un rango y lo almacena en una pila

```valkyrie-vm
RANDINT {stack} {min} {max}
```

- stack: stack destino
- min: valor mínimo de rango
- max: valor máximo de rango

#### EMPTY "☽"

Limpia una pila

```valkyrie-vm
EMPTY {stack}
```

- stack: stack para limpiar

#### CLEARALL "NUKE" "RAGNAROK" "☽☽"

Limpia todas las pilas

```valkyrie-vm
CLEARALL
```

## Ejecución

Estas instrucciones pueden ser ejecutadas desde archivos .val o desde la línea de comandos​ (vm).

Funciones destacadas:

- `getValue(arg, pop = false)`: Retorna el valor correspondiente a un argumento. Si es un número, lo convierte; si es una cadena entre comillas, la procesa; si es una referencia a una pila, devuelve el valor superior de la pila (usando pop o peek).
- `execute(instruction)`: Ejecuta una instrucción, dividida en la operación y sus argumentos.
- `run(filePath)`: Lee y ejecuta todas las instrucciones de un archivo de texto​(vm).
