Z domknięciem mamy do czynienia, gdy funkcja ma możliwość zachowania i uzyskania dostępu do jej zakresu leksykalnego,
nawet podczas wykonywania danej funkcji na zewnątrz jej zakresu leksykalnego.

```javascript
function foo() {
    var a = 2;
    function bar() {
        console.log( a );
    }
    return bar;
}
var baz = foo();

baz(); // 2 -- O tak, działanie domknięcia jest wreszcie widoczne.

```

Funkcja **bar()** ma dostęp zakresu leksykalnego do wewnętrznego zakresu funkcji **foo()**.
Następnie bierzemy samą funkcję **bar()** i przekazujemy ją jako wartość. W takim przypadku wartością zwrotną jest obiekt
funkcji, do której odwołuje się *bar*.

Po wykonaniu funkcji **foo()** jej wartość zwrotna (wewnętrzna funkcja bar()) zostaje przypisana zmiennej o nazwie baz.
Następnie mamy rzeczywiste wywołanie funkcji baz(), które powoduje wywołanie wewnętrznej funkcji bar().
Nie ulega wątpliwości, że funkcja bar() zostanie wykonana. Jednak w omawianym przykładzie będzie wykonana na zewnątrz
jej zadeklarowanego zakresu leksykalnego.

Mimo że wydaje się że funkcja foo() została już wywołana i nie jest dłużej utrzymywana to jednak funkcja **bar()**
przetrzymywana w **baz** ma nadal odwołanie do zakresu, i właśnie to odwołanie jest określane jako ***domknięcie***.
