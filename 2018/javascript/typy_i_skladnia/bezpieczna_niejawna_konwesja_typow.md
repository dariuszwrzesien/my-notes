Aby skutecznie unikać problemów z porównaniami za pomocą operatora **==** należy:
1. Jeśli po dowolnej stronie operatora może wystąpić wartość **true** lub **false**,
w żadnym razie **NIGDY** nie używaj operatora **==**.

```javascript
    "0" == false; //true
    false == 0; //true
    false == ""; //true
    false == []; //true
    "42" == true; //false, po konwersji będzie 42 == 0
```

2. Jeśli po dowolnej stronie operatora porównania może wystąpić wartość **[], "" lub 0"",
na poważnie rozważ zrezygnownie ze stosowania operatora **==**.

```javascript
    "" == 0; //true
    "" == []; //true
    0 == [];
```

Aby w tych sytuacjach uniknąć niepożądanej konwersji typów, prawie napewno lepsze bedzie
użycie operatora **===** niż **==**.

**typeof**

Metoda **typeof** zawsze zwróci jeden z siedmiu łańcuchów z których żaden nie jest łańcuchem pustym "".
Oznacza to że sprawdzenie typu jakiejś wartości spowodowało konflikt z niejawną konwersją.
Porównanie **typeof x == "function" jest w stu procenatach bezpieczne i pewne jak porównanie **typeof x === "function"**.
W specyfikacji języka napisano nawet dosłownie że w takiej sytuacji algorytm będzie identyczny.

