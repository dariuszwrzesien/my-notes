**Callback** - wywołania zwrotne.

Callback jest funkcją przekazywaną jako parametr inne funkcji w celu późniejszego jej wywołania.

```javascript
    function doItWhenReady() {
        alert('Callback!');
    }

    function process(callbackFunction) {
        if (typeof callbackFunction !== 'function') {
            callbackFunction = false;
        }

        if (callbackFunction) {
            callbackFunction();
        }
    }

    process(doItWhenReady);

```

W pierwszych trzech liniach powyższego przykładu, widzimy zwykłą funkcję wyświetlającą jakiś tekst na ekranie.
Ciekawsza jest druga z funkcji – „process”. Jak widać, przyjmuje ona jako parametr wejściowy zmienną „callbackFunction”.
Jako, że nie wiemy czym tak naprawdę jest ta zmienna, dokonujemy sprawdzenia typu tej zmiennej i w przypadku gdy nie jest
to funkcja, ustawiamy jej wartość na „false” – jest to dobra praktyka w przypadku tworzenia wywołań zwrotnych,
ponieważ nie powinniśmy z góry zakładać, że ktoś przekaże nam jako parametr funkcję, a nie obiekt czy typ prosty.
Dalej, będąc już pewnym, że zmienna „callbackFunction” jest funkcją, możemy ją wywołać tak jak wywołuje się każdą inną funkcję.
W ostatniej linii przykładu widzimy wywołanie funkcji „process” – jako parametr przekazujemy jej nazwę funkcji,
która ma zostać wywołana w jej wnętrzu ale bez nawiasów – jeśli byśmy je dodali, funkcja „doItWhenReady” wywołałaby się
natychmiast, w momencie wywołania funkcji „process”, a my chcemy wywołać ją przecież później.

**Callback** jako ***funkcja anonimowa***:

```javascript

    function process(callbackFunction) {
        if (typeof callbackFunction !== 'function') {
            callbackFunction = false;
        }

        if (callbackFunction) {
            callbackFunction();
        }
    }

    process(function () {
        alert('Callback!');
    });
```

Przekazanie ***metody obiektu*** jako **callback**

Opisane powyżej rozwiązanie sprawdza się w większości przypadków, jednak czasami zachodzi potrzeba przekazania jako callback
funkcji będącej jednocześnie metodą jakiegoś obiektu. Dopóki metoda taka, nie odnosi się do składowych swojego obiektu
jest wszystko OK, jednak jeśli znajdzie się w niej odwołanie z użyciem „this”, sprawa nie wygląda już tak prosto.

```javascript
    var someObject = {
        text: 'Hello from callback',
        doItWhenReady: function () {
            alert(this.text);
        }
    }

    function process(callback) {
        if (typeof callback !== 'function') {
             callback = false;
        }

        if (callback) {
             callback();
        }
    }

    process(someObject.doItWhenReady);
```

Powyższy kod nie zadziała jak by się mogło początkowo wydawać. Wszystko oczywiście przez odwołanie "this.text"
w metodzie *doItWhenReady*. W momencie wywołania zwrotnego, metoda wywoływna jest w zakresie funkcji *process* a nie w zakresie obiektu.
Stąd też rozwiązaniem jest przekazanie do funkcji obiektu, w kontekście którego ma być wywoływana funkcja callback.

```javascript
    var someObject = {
        text: 'Hello from callback',
        doItWhenReady: function () {
            alert(this.text);
        }
    }

    function process(callback, obj) {
        if (typeof callback !== 'function') {
             callback = false;
        }

        if (callback) {
             callback.call(obj, null);
        }
    }

    process(someObject.doItWhenReady, someObject);
```

Deklaracja funkcji „process” została rozszerzona o nowy parametr „obj” – posłuży nam on do przekazania do funkcji referencji obiektu,
w kontekście którego będziemy wywoływać funkcję callback. Zamiast zwykłego wywołania funkcji „callback” dokonujemy
aplikacji funkcji za pomocą metody „Function.prototype.call” który jest tak naprawdę innym, bardziej zaawansowanym i
dającym większe możliwości sposobem wywoływania funkcji w języku JavaScript.

W ostatniej linii widzimy zmienione wywołanie funkcji „process” – jako drugi parametr przekazujemy po prostu obiekt
„someObject”.