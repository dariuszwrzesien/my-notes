**Moduły**

```javascript
    function CoolModule() {
        var something = "Świetnie";
        var another = [1, 2, 3];
        function doSomething() {
            console.log( something );
        }
        function doAnother() {
            console.log( another.join( " ! " ) );
        }
        return {
            doSomething: doSomething,
            doAnother: doAnother
        };
    }
    var foo = CoolModule();
    foo.doSomething(); // Świetnie
    foo.doAnother(); // 1 ! 2 ! 3
```

**CoolModule** to poprostu funkcja, ale musi być wywołana, aby utworzył się egzemplarz modułu.
Wartością zwrotną funkcji CoolModule() jest obiekt zapisany składnią *{ klucz: wartosc, ...}*.
Zwrócony obiekt ma odwołania do naszych funkcji wewnętrznych, ale nie do wewnętrznych zmiennych, kóre pozostają
ukryte i prywatne.
Wspomniana wartość zwrotna obiektu będzie przypisana do zmiennej **foo**, dzięki czemu zyskamy dostęp do metod (API) modułu.

Zatem aby powstał wzorzec MODUŁU muszą być spęłnione następujące wymagania:
1. Konieczne jest istnienie zewnętrznej funkcji, która musi być wywołana przynajmniej raz (za każdym razem tworzony jest nowy egzemplarz modułu).
2. Wartością zwrotną funkcji zewnętrznej musi być przynajmniej jedna funkcja wewnętrzna, aby ta funkcja wewnętrzna miała domknięcie poprzez zakres
prywatny.


