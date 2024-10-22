# Comandos

## PUSH TO VALUE

    Empujar un valor original o el valor inmediato de VALUE a la pila TO

## POP FROM

    Eliminar un valor de la pila FROM

## ADD OGVALUE&TO DELTA / ADD TO OGVALUE DELTA

    Suma dos valores.

    En el caso de dar dos parámetros, se guardará el resultado en la dirección del primer parámetro, en el caso de dar 3, el resultado se guardará en la pila del primer parametro, y se realizrá la operación con los parámetros segundo y tercero.

## SUB OGVALUE&TO DELTA / SUB TO OGVALUE DELTA

    Resta dos valores.

    En el caso de dar dos parámetros, se guardará el resultado en la dirección del primer parámetro, en el caso de dar 3, el resultado se guardará en la pila del primer parametro, y se realizrá la operación con los parámetros segundo y tercero.

## MUL OGVALUE&TO MULTIPLE / MUL TO OGVALUE MULTIPLE

    Multiplica dos valores.

    En el caso de dar dos parámetros, se guardará el resultado en la dirección del primer parámetro, en el caso de dar 3, el resultado se guardará en la pila del primer parametro, y se realizrá la operación con los parámetros segundo y tercero.

## DIV OGVALUE&TO DIVISOR / DIV TO OGVALUE DIVISOR

    Divide dos valores.

    En el caso de dar dos parámetros, se guardará el resultado en la dirección del primer parámetro, en el caso de dar 3, el resultado se guardará en la pila del primer parametro, y se realizrá la operación con los parámetros segundo y tercero.

## MOD OGVALUE&TO DIVISOR / MOD TO OGVALUE DIVISOR

    Devuelve el módulo (o resto de la división) de dos valores.

    En el caso de dar dos parámetros, se guardará el resultado en la dirección del primer parámetro, en el caso de dar 3, el resultado se guardará en la pila del primer parametro, y se realizrá la operación con los parámetros segundo y tercero.

## SWAP FROM TO

    Intercambia los valores inmediatos de dos pilas.

    `TO` puede ser un valor original y, de darse el caso, el valor inmediato de la pila de FROM se cambiaría a dicho valor.

## MOVE FROM TO

    Mueve el valor inmediato de la pila FROM a TO. El valor no estará disponible en la pila FROM tras esta operación.

## COPY FROM TO

    Copia el valor inmediato de la pila FROM a TO. El valor seguirá estando disponible en la pila FROM tras esta operación.

## IF VALUE

    Empieza un bloque condicional. El bloque se ejecutará si el valor de VALUE es verdadero, y, si no, se buscará el bloque ELSE correspondiente.

    Esto último puede hacerse contando los ifs entre el if actual y el siguiente (ELSE/ELSEIF/ENDIF). Si no es 0, ese (ELSE/ELSEIF/ENDIF) no corresponde a ese if, y se deberá restar 1 al contador de ifs por cada else encontrado. Este proceso seguirá hasta encontrar el (ELSE/ELSEIF/ENDIF) que corresponda a este if.

    Podemos detectar parejas IF-ELSE al principio de la ejecución para facilitar este proceso, y sacar SYNTAX ERROR, si encontramos un IF sin cerrar, o un ELSE/ELSEIF/ENDIF/ENDELSE sin abrir.

## ELSEIF VALUE(ORDIRECTION)

    Si el IF al que corresponde resulta tener un valor falso, este ELSEIF se ejecutará.

    Aplican las mismas dinámicas y reglas que el IF.

## ENDIF

    Cierra un bloque IF.

## ELSE

    Si el IF al que corresponde resulta tener un valor falso, este ELSE se ejecutará.

    Aplican las mismas dinámicas y reglas que el IF.

## ENDELSE

    Cierra un bloque ELSE.

## FOR DIRECTIONTOSAVECURRENTVALUE ITERATIVEVALUE

    Inicia un búcle, guardando el valor de la iteración en la dirección DIRECTIONTOSAVECURRENTVALUE. El valor de la iteración se actualiza en cada iteración.

## BREAK

    Detiene el búcle.

## ENDFOR

    Indica el final de los comandos dentro del búcle.

## EQUALS SAVEDIR V1 V2

    Guarda en la ruta SAVEDIR si los valores de V1 y V2 son iguales.

## NEQUALS SAVEDIR V1 V2

    Guarda en la ruta SAVEDIR si los valores de V1 y V2 son diferentes.

## NOT SAVEDIR&V1 / NOT SAVEDIR V1

    Guarda en la ruta SAVEDIR el valor de V1 invertido.

## TOBOOL SAVEDIR V1

    Guarda en la ruta SAVEDIR si el valor de V1 es verdadero o falso.

## PRINT VALUE

    Imprime el valor VALUE.
