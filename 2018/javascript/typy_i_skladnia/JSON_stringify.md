**JSON.stringify(...)**

Metoda JSON.stringify(...) serializuje wartości typu string do formatu zgodnego z JSON.

W przypadku większości zwykłych wartości przekształcenie przebiega tak samo jak konwersja wykonywana przez metodę **toString()**

```javascript
    JSON.stringify(42); // "42"
    JSON.stringify("42"); // ""42"" (łańcuch zawierający wartość łańcuchową ujętą w znaki cudzysłowu)
    JSON.stringify(null); // "null
    JSON.stringify(true); // "true"
```

Dowolna wartość **bezpieczna** z punktu widzenia formatu JSON moze zostać przekształcona na łańcuch
za pomocą metody JSON.stringify(...).

Co oznacza zatem **bezpieczna**? Wartościami niebezpiecznymi są: **undefined, function, symbol**,
oraz, **object** z wywołaniem cyklicznym (zapętleniem) jak pokazano poniżej:

```javasctipt
    var obj = {};
    var a = {
        n: 42,
        subObj: obj,
        f: function(){}
    };

    obj.e = a; // utworzenie odwołania cyklicznego, zpętlającego
    JSON.stringify(a) // spowoduje zgłoszenie błedu
```

JSON.stringify(...) automatycznie pominie wartości typu *undefined, function, symbol*.
Jeśli takie wartości zostaną znalezione w tablicy zostaną zastąpione wartością *null*.

```javascript
    JSON.stringify(undefined); //undefined
    JSON.stringify(function(){}); //undefined
    JSON.stringify([1,undefined,function(){}, "test"]); //"[1, null, null,"test"]"
    JSON.stringify({a:42, b:function(){}}); //"{"a":2}"
```

**toJSON()**

Z przekształceniem wartości typu **object** do formatu JSON jest związana specjalna metoda **toJSON()**.
Polego ona na tym że możemy dla objektu zdefiniować metodę **toJSON()** która zostanie wywołana w pierszej kolejności
w celu przygotowania serializacji. Jeśli zatem obiekt posiada wartości nieodpowiednie do przeprowadzenia serializacji
lub nie chemy serializować wszystkich właściwości objektu, należy przygotować metodę **toJSON()**.

```javascript
    var obj = {};
    var a = {
        n: 42,
        subObj: obj,
        f: function(){}
    };

    obj.e = a; // utworzenie odwołania cyklicznego, zpętlającego
    JSON.stringify(a) // spowoduje zgłoszenie błedu

    a.toJSON() = function() {
        //dołączenie tylko wartości *n* na potrzeby serializacji
        return {n: this.n}
    }

    JSON.stringify(a); //"{"n": 42}"
```

*UWAGA*
Należy pamiętać że **toJSON()** powinien zwracać rzeczywistą wartość z serializowanego obiektu, która następnie
zostanie poddana metodzie JSON.stringify(...), a nie jak czasami się wydaje już przygotowany łańcuch.
Inaczej mówiąc, wbrew temu, co błędnie zakłada wielu projektantów, metoda toJSON() powinna być
interpretowana jako „przeznaczona dla wartości bezpiecznej z punktu widzenia formatu JSON, która
jest odpowiednia do przekształcenia w łańcuch”, a nie jako „obsługująca łańcuch w formacie JSON”.

```javascript
    var a = {
        val: [1,2,3],

        //poprawne!
        toJSON: function(){
            return this.val.slice( 1 );
        }
    };

    var b = {
        val: [1,2,3],

        // niepoprawne!
        toJSON: function(){
            return "[" +
                this.val.slice( 1 ).join() +
            "]";
        }
    };
    JSON.stringify(a); // "[2,3]" -> zserializowana tablica
    JSON.stringify(b); // ""[2,3]"" -> chodziło nam raczej o serializację tablicy a nie string z serializowanej tablicy
```

**Argumenty opcjonalne metody JSON.stringify()**

JSON.stringify(value[, replacer[, space]])

Metodzie JSON.stringify może zostać przekazany drugi argument, nazywany argumentem zastępującym.
Może to być **tablica** lub **funkcja**.
Służyo on do dostosowania serializacji poprzez zapewnienie **filtrowania**.

```javascript
    var a = {
        b: 42,
        c: "42",
        d: [1,2,3]
    };

    JSON.stringify( a, ["b","c"] ); // "{"b":42,"c":"42"}"
    JSON.stringify( a, function(k,v){
        if (k !== "c") return v;
    } ); // "{"b":42,"d":[1,2,3]}"
```

Trzeci opcjonalny argument nazywany spacją, służy do robienia wcięć.

```javascript
    var a = {
        b: 42,
        c: "42",
        d: [1,2,3]
    };
    JSON.stringify( a, null, 3 );
    // "{
    //    "b": 42,
    //    "c": "42",
    //    "d": [
    //       1,
    //       2,
    //       3
    //    ]
    // }"
    JSON.stringify( a, null, "-----" );
    // "{
    // -----"b": 42,
    // -----"c": "42",
    // -----"d": [
    // ----------1,
    // ----------2,
    // ----------3
    // -----]
    // }"

```
