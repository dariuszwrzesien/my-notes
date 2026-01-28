Funkcja natychmiastowa określana jako IIFE (ang immediateky invoke function expression) ma postać:

```javascript
    (function run(){
        console.log("Hello world!");
    })(); //Hello world!
```

Zewnętrzny nawias ( .. ) otaczający wyrażenie funkcji (function IIFE(){ .. })
jest elementem gramatyki JavaScript niezbędnym do tego, aby ta deklaracja
funkcji nie została potraktowana jako zwykła funkcja.

Ostatni nawias () na końcu wyrażenia — czyli w wierszu })(); — to miejsce
rzeczywistego wykonania wyrażenia funkcji zdefiniowanego tuż przed tym
nawiasem.

Funkcje natychmiastowe są często stosowane do zadeklarowania zmiennych, które nie bedą miały wpływu na kod znajdujący się
poza tą funkcją

```javascript
    var a = 'Hello';

    (function IIFE(){
        var a = 'Hi';
        console.log( a );
    })();

    console.log( a );
    // Hi
    // Hello
```


Funkcja IIFE może zwracać wartość:
```javascript
    var x = (function IIFE(){
        return 42;
    })();

    console.log( x );

    // 42
````

Wartość 42 zwrócona (polecenie **return**) przez funkcję IIFE w trakcie jej wy-
konywania zostaje przypisana zmiennej x.