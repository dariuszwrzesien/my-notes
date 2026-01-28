W Javascript występują następujące typy wbudowane:

* null
* undefined
* boolean
* number
* string
* object
* symbol (od ECMAScript 6)

Do sprawdzenia typu danej wartości używany jest operator **typeof**, zwraca on jeden z typów jako string.

```javascript
typeof undefined === "undefined"; //true
typeof true      === "boolean";   //true
typeof 42        === "number";    //true
typeof "42"      === "string";    //true
typeof {life:42} === "object";    //true
typeof Symbol()  === "symbol";    //true
```

**NULL**

Niestety w języku JavaScript istnieje błąd dotyczący typu **null**.
**Null** w połączeniu z operatorem **typeof** powoduje błędne działanie:

```javascript
typeof null === "object"; //true
```

Aby zatem sprawdzić wartość pod kątem typu **null** należy skorzystać z warunku:

```javascript
var a = null
(!a && typeof a ===  "object"); //true
```

**FUNCTION**

Kolejną nieścisłością jest podtyp **function**, który w pojączeniu z operatorem **typeof**
sugeruje że **function** jest typem wbudowanym najwyższego poziomu.

```javasctipt
typeof function a(){} === "function"; //true
```

Jest jednak inaczej, **function** to *podtyp* typu **object**. Pomimo że **typeof** zwróci nam "function".

**NaN**

Gdy wykonamy dowolną operację matematyczną ale w jej efekcie nie otrzymamy typu "number",
JavaSctipt zwróci **NaN**.
Nieścisłość pojawia się w momencie gdy wartość **NaN** sprawdzimy operatorem **typeof**

```javascript
var nan = "word" * 1;
console.log(nan); //NaN
console.log(typeof nan); //"number" -> Liczba, która nie jest liczbą :)
```

**Array**

Tablice w języku Javascript są (podobnie jak funkcję) *podtypami* typu **object**.

```javascript
var array = [];
typeof array === "object" //true
```

**Typy wartości**

Wbrew temu co może się wydawać operator **typeof** nie zadaje pytania "Jaki jest typ zmiennej",
on zadaje pytanie "Jaki jest typ **wartości** zmiennej". W języku dynamicznym, takim jak JavaScript,
zmienne pozbawione są typów, to **wartości mają typy**. Zmienna może przechowywać każdą wartość, niezależnie od
typu. Natomiast typ wartości może się zmieniać tylko wtedy gdy zastosujemy **konwersję typów**.

***Undefined***

Zmienne do których w danym momencie nie jest przypisana żadna wartość posiadają typ **undefined**.

```javasctipt
var abc;
console.log(typeof abc); //"undefined"
```

Ważne jest aby zrozumieć różnicę pomiędzy niezadeklarowanym "undefined" a niezdefiniowanym ("is not defined").
Traktowanie tych dwóch pojęć jako synonimów w kontekście języka JavaScript jest błędem.

```javascript
var a;
console.log(a); //undefined
console.log(b); //błąd ReferenceError: zmienna b nie została zdefiniowana („ReferenceError: b is not defined”)
```

Jeśli spojrzymy na komunikat błędu przypisywany przez przeglądarki możemy odnieść błędne wrażenie
że zmienna b jest "undefined", co jest nieprawdą ponieważ ta zmienna
nie została *zdefiniowana* (ang. **is not defined**).

Jeszcze więcej niejasności powoduje wprowadzenie operatora **typeof**

```javascript
var a;
typeof a; //"undefined"
typeof b; //"undefined"
```

Operator **typof** zwraca **"undefined"** nawet w przypadku **niezdefiniowanych** zmiennych.
Spowodowane jest to działaniem **typeof**, który w swoim założeniu nie zgłasza błędów, jego wynikiem jest
zawsze jakiś łańcuch znaków odpowiadający typowi. Jest to specjalne zabezpieczenie związane z **typeof**.

Mimo wszystko wspomniane zabezpieczeni jest przydatną możliwością, dzięki której możemy sprawdzić
czy w zakresie globalnym występuję jakaś zmienna;

```javasctipt
//żadna zmienna nie została zadeklarowana

if (a) { //ReferenceError: a is not defined
    console.log(a);
}

//bezpieczny sposób na sprawdzenie istnienia zmiennej
if (typeof a !== "undefined") {
    console.log("a zostało wcześniej zadeklaroeane")
}
```
