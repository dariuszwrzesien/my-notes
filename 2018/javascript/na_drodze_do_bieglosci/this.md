W javascript słowo kluczowe this to zupełnie inny mechanizm niż ten znany z wzorców zoreintowanych obiektowo.
Jeżeli funkcja zawiera wewnątrz odwołanie *this*, zwykle prowadzi ono do obiektu. Jednak konkretny obiekt wskazany przez *this* zależy od sposobu w jaki nastąpiło odwołanie.

```javascript
    function foo() {
        console.log( this.bar );
    }

    var bar = "global";

    var object1 = {
        bar: "Object1",
        foo: foo
    }

    var object2 = {
        bar: "Object2"
    }

    foo(); //"global" lub undefined w trybie ścisłym
    object1.foo(); //"Object1"
    foo.call( object2 ); //"Object2"
    new foo() //undefined
```

1. Gdy nie jest użyty tryb *strict*, funkcja *foo()* ustawia *this* z obiektu globalnego *(bar = global)*.
W trybie ścisłym *this* będzie miało wartość *undefined* i pojawi się komunikat
o błędzie przy próbie uzyskania dostepu do *bar*.
2. Wywołanie *object1.foo()* powoduje, że *this* wskazuje obiekt *object1*.
3. Wywołanie *foo.call(obj2)* powoduje, że *this* wskazuje obiekt *object2*.
4. Wywołanie *new foo()* powoduje, że *this* wskazuje na zupełnie nowy, pusty obiekt.
