**Zakres** to zbiór reguł określających miejsce i sposób wyszukiwania zmiennej, na przykład za pomocą nazwy.

Zakres może być zagnieżdżony w innym zakresie. Jeśli zmienna nie zostanie znaleziona w zakresie bieżącym,
Silnik sprawdza kolejny zakres zewnętrzny i kontynuuje tę operację aż znajdzie zmienną lub dotrze do najbardziej
zewnętrznego (globalnego) zakresu.

Wyżej wspomniane wyszukiwanie może być związane z przypisaniem wartości zmiennej i wówczas mamy odwołanie typu LHS

```javascript
    var a = 42;
```

lub może być związane z pobraniem wartości zmiennej (odwołanie typu RHS).

```javascript
    console.log(a);
```

W jaki sposób silnik javascript odnajduje zmienną ?

Nieważne czy mamy doczynienia z odwołaniem LHS (przypisaniem) czy RHS (pobraniem zmiennej) operacja zaczyna się od
aktualnie wykonywanego kodu i **jeśli nie znajdzie** tutaj szukanego elementu, to przechodzi o poziom wyżej
w zagnieżdżonych zakresach i ponawia wyszukiwanie identyfikatora.
Operacja jest kontynuowana aż do zakresu globalnego.

Od tego momentu RHS i LHS zachowują się inaczej:
* Niespełnione odwołanie *RHS* skutkuje zgłoszeniem błędu *ReferenceError.*
* Niespełnione odwołanie *LHS* skutkuje **automatycznym, niejawnym utowrzeniem zmiennej globalnej o nazwie szukanego identyfikatora**.
Jeśli jednak aktywny jest tryb ścisły zgłaszany je błąd *ReferenceError* podobnie jak ma to miejsce podczas odwołania RHS.


Jak wcześniej wspomniano zakres może składać się z zagnieżdzonych w nim innych zakresów.
Zakresy są umieszczone jeden w drugim, a każde z tych zagnieżdzeń jest zdefiniowane na etapie tworzenia kodu.
Zatem co powoduje utworzenie nowego zakresu *(pojemnika na zmienne)*?

1. FUNKCJA (jako zakres):

```javascript
    function foo(a) {
        var b = 2;
        function bar() {
        }
        var c = 3;
    }
```

Zakres funkcji **foo(...)** zawiera identyfikatory a, b, c, bar.
Nie ma znaczenia w którym miejscu pojawia się deklaracja, ponieważ, niezależnie od tego zmienna lub funkcja należą do zakresu.


Oprócz tego mamy zakres globalny w którym istnieje tylko identyfikator **foo(...)**. Oznacza to że jeśli z zakresu globalnego
będziemy próbować odwołać się do zmiennych w zakresie funkcji foo() otrzymamy ReferenceError.

```javascript
    function foo(a) {
        var b = 2;
        function bar() {
        }
        var c = 3;
    }
    bar(); // ReferenceError
    console.log(a, b, c); //ReferenceError
```

Jednakże wszystkie te identyfikatory są dostępne wewnątrz foo(...) i wewnątrz **bar()**

```javascript
    function foo(a) {
        var b = 2;
        function bar() {
            console.log(a, b, c);
        }
        var c = 3;
    }
```

2. BLOK (jako zakres):

```javascript
    for (var i=0; i<10; i++) {
        console.log( i );
    }

    console.log(i) //10 -> spodziewałbym się nie móc mieć dostępu do "i" w tym miejscu
```

Zmienna ***i*** została zadeklarowana bezpośrednio w poleceniu *for* prawdopodobnie w celu użycia jej jedynie w kontekście tej pętli.
Często jednak igonorowany jest fakt, że zakresem tej zmiennej jest zakres nadrzędny (czyli funkcyjny lub globalny).

Słowo kluczowe ***let***
Słowo kluczowe **let** pozwala nam zadeklarować zmienną jedynie w zakresie bloku (czyli pomiędzy { ... }) zawierajacego
tę zmienną.

```javascript
    for (let i=0; i<10; i++) {
        console.log( i );
    }

    console.log( i ) //ReferenceError
```

Słowo kluczowe ***const***
Oprócz **let** w specyfikacji ES6 pojawiło się także polecenie ***const***, które również tworzy zmienną o zakresie bloku.
Wartość utworzonej stałej ***const*** jest niezmienna, każda próba zmodyfikowania generuje błąd *ReferenceError*.
