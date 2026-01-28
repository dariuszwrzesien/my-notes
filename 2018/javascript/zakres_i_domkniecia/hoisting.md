**Hoisting** (z ang. podnoszenie, wciąganie, windowanie).

Ciekawymi przykładami do rozważenia przed wyjaśnieniem zasady hoistingu są:

1

```javascript
    a = 2;
    var a;
    console.log( a );
```

Zdrowy rozsądek podpowiada że oczekiwana wartość to *undefined*.
Ponieważ oczekujemy ze *var a* zdefinuje nam na nowo zmienną *a*.
Jednakże console.log(a) zwróci ***2***.

Kolejny przykład:

2

```javascript
    console.log( a );
    var a = 2;
```

Bazując na poprzednim przykładzie można by sądzić że skoro wyszukiwanie
nie odbywa się od początku do końca kodu to wynikiem może będzie 2.
Niestety prawda jest inna, wynikiem jest ***undefined***.

Kiedy Kompilator widzi polecenie **var a = 2** traktuje je jako dwa polecenia:

```javascript
 var a;
 a = 2;
 ```

Wracając do przykładów podanych na początku.
Pierwszy przykład kompilator widzi w następujący sposób:

```javascript
    var a; //tworzy zmienną
    a = 2; //przypisuje zmiennej wartość
    console.log( a );
```

Drugi przykład jest widziany przez kompilator w nastepujacy sposób:

```javascript
    var a;
    console.log( a );
    a = 2;
```

Zatem możemy umownie przyjąć że **deklaracje** zmiennych i funkcji
są **"przenoszone"** na początek kodu.
Przeniesienie na początek kodu dotyczy jedynie deklaracji, natomiast wszelka
logika (np. przypisanie) **jest pozostawiona na dotychczasowym miejscu**.

Jak wspomniano wcześniej, hoistingowi podlegają zmienne i funkcję, jednak
funkcję mają pierwszeństwo przed zmiennymi.

```javascript
    foo(); // 1
    var foo;
    function foo() {
        console.log( 1 );
    }
    foo = function() {
        console.log( 2 );
    };
```

Przedstawiony fragment jest interpretowany w następujący sposób:

```javascript
    function foo() {
        console.log( 1 );
    }

    foo(); // 1

    foo = function() {
        console.log( 2 );
    };
```

Kolejny przykład: *każda powielająca się deklaracja funkcji **nadpisuje** poprzednią*.

```javascript
    foo(); // 3
    function foo() {
        console.log( 1 );
    }

    function foo() {
        console.log( 3 );
    }
```

Podsumowując, wszystkie deklaracje w zakresie, niezależnie od miejsca ich występowania,
są przetwarzane przed rozpoczęciem wykonywania kodu. Można powiedzieć że
deklaracje (funkcji i zmiennych) są przenoszone na początek ich zakresów - i to właśnie jest **hoisting**.
Kod odpowiedzialny za przypisanie lub wykonanie pozostaje w dotychczasowym miejscu.
