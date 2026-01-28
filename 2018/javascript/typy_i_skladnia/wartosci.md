**Zmienna UNDEFINED**

W trybie innym niż **strict** możliwe jest przypisanie wartości **GLOBALNEJ**
identyfikatorowi **undefined**.

```javascrpt
    function foo() {
        undefined = 2; //zły pomysł aby tak robić
    }

    foo();

    function foo() {
        "use strinct";

        undefined = 2; // TypeError! -> to jest próba przypisania do zmiennej globalnej.
    }

    foo();

```

*Uwaga !!!*

Zarówno w trybie **strict**, jak i nie, możemy jednak utworzyć zmienną **LOKALNĄ**
o nazwie **undefined**. Jednak jest to bardzo niedobry pomysł.

```javascript
    function foo() {
        "use strict";
        var undefined = 2; //Utowrzenie zmiennej lokalnej
        console.log(undefined); //2
    }
```

**Operator VOID**

**Void** unieważnia dowolną wartość, jego wynikiem jest zawsze wartość typu **undefined**.
Wyrażenie operatora **void** nie modyfikuje jednak istniejącej wartości, a jedynie zapewnia,
że NIE ZOSTANIE zwrócona żadna wartość.

```javascript
    var a = 42;
    console.log(void a); //undefined
    console.log(a); //42
```

**NaN**

Dowolna operacja matematyczna, w której nie zostanie zwrócona wartość typu *number*,
spowoduje, że otrzymamy wartość ***NaN***.

Nieścisłość pojawia się w momencie gdy wartość **NaN** sprawdzimy operatorem **typeof**

```javascript
var nan = "word" * 1;
console.log(nan); //NaN
console.log(typeof nan); //"number" -> Liczba, która nie jest liczbą :)
```

Nie możemy również sprawdzić bezpośrednio przyrównując zmienną do NaN.
(Możemy tak zrobić w przypadku **null** lub **undefined** ale nie w przypadku **NaN**).
**NaN** jest specjanlną wartością i nigdy nie jest rówba innej wartości **NaN**,
czyli nigdy nie jest równa samej sobie.

```javascript
    var a = 42 * "foobar";
    a == NaN; //false
    a === NaN; //false
```

Aby przeprowadzić sprawdzenie czy wartość jest **NaN**, można użyć wbudowanego narzędzia globalnego
***isNAN()***, jednak i w tym przypadku możemy się niemiło zaskoczyć.

```javascript
    var a = 42 * "foobar";
    window.isNaN(a); //true -> jak narazie wszystko w normie

    var b = "foo";
    window.isNaN(b); //true -> ałć, nie tego się spodziewaliśmy
```

Błąd ten istnieje od początku JavaScriptu, począwszy jednak od wersji ECMAScript 6, został rozwiązany
poprzez wprowadzenie metody **Number.isNaN(...)**.

```javascript
    var a = 42 * "foobar";
    Number.isNaN(a); //true

    var b = "foo";
    Number.isNaN(b); //false
```

**Zera**

W języku JavaScript występuje zarówno zwykłe **zero** (inaczej: zero dodatnie **+0**),
jak i zero ujemne **-0**.

```javasctipt
var a = 0 / -3; //-0
var b = 0 * -3; //-0
```

Dodawanie i odejmowanie nie może się zakończyć zweócenie m zera ujemnego.

Jednakże wiele operacji w JavaScript (przekształcenie na *string*, operacje porównania) ukrywają
wartość **-0**.

```javascript
var a = 0;
var b = 0 / -3;

a == b; // true
-0 == 0; // true

a === b; // true
-0 === 0; // true

0 > -0; // false
a > b; // false
```

Jeśli chcemy odróżnić w kodzie -0 od 0 możemy użyć następującego narzędzia:

```javascript
function isNegZero(n) {
    n = Number(n);
    return (n === 0) && (1/n === - Infinity);
}

isNegZero(-0); //true
isNegZero(0/-3); //true
isNegZero(0); //false
```

Istnieją specjalne zastosowania w których chcemy aby wartość 0 była prezentowana jako -0.
Gdy np. znak minus odnosi się do informacji o kierunku przemieszczania (np. w animacjach).

**Specjalna równość**

Wartość **NaN** i wartość **-0** cechują się specjalnym zachowaniem w przypadku porównania:

* **NaN** nigdy nie jest równa samej sobie.
* **-0** udaje że jest równe zwykłemu zeru (-0 === 0 //true).

Od wersji języka ECMAScript 6, dostępne jest narzędzie, które może służyć do porównania dwóch wartości
pod kątem bezwzględnej równości: **Object.is(...)**.

```javasctipt
var a = 42 * "foobar";
var b = -3 * 0;

Object.is(a, NaN); //true
Object.is(b, -0); //true
Object.is(b, 0); //false
```

Metoda **Object.is(...) nie powinna** być jednak stosowana tam gdzie operator **==** lub **===**
 jest uważany za bezpieczny. Metoda **Object.is(...)** używana jest głównie na potrzeby tych specjalnych równości.


**Wartości z odwołaniem (referencją)**

Wartości proste (nazywane także skalarnymi wartościami prymitywnymi) zawsze są przekazywane przez KOPIĘ wartości.

```javascript
var a = 2;
var b = a //wartość zmiennej b jest tylko kopią wartości zmiennej a

b++;

a; //2
b; //3
```

Wartości złożone: czyli obiekty, tablice, funkcje, zawsze tworzą REFERENCJĘ.

```javascript
var c = [1,2,3];
var d = c; //zmienna d jest referencją do wartości [1,2,3]
d.push(4);
c; //[1,2,3,4]
d; //[1,2,3,4]
```

W JavaScript nie ma możliwości bezpośredniego kontrolowania tego, czy zostanie zastosowana
kopia czy referencja. Jest to całkowicie kontrolowane przez sysytem. (W PHP można było użyć & przed zmienną np. &$variable)

Aby efektywnie przekazać wartość złożoną (np. **array**) za pomocą kopii wartości,
musimy ręcznie utworzyć jej kopię, żeby odwołanie nie wksazywało już jej oryginalnej wartości.
Aby tego dokonać możemy posłużyć się metodą ***slice(...)***
Tworzy ona kopię tablicy jako nową zmienną (nie mylić z pustą tablicą).

```javascript
var a = [1,2,3];

function foo(x){
    console.log(x); //[1,2,3]
    x.push(4);
    console.log(x); //[1,2,3,4] -> jest to nowa tablica nie związana z "a"
    console.log(a); //[1,2,3]
}
foo(a.slice());
```

W celu uzyskania odwrotnego działania, czyli przekazania skalarnej wartości przez referencję, a raczej jej podobieństwo,
musimy opakować wartość skalarną za pomocą wartości złożonej (typu: **object**, **array**, itp.).

```javascript
function foo(objRef) {
    objRef.a = 42;
}

var obj = {
    a: 2
}

obj.a //42
```
