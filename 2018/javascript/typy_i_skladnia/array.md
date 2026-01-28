**Array**

Deklaracja tablicy:

```javascript
var a = [1, "b", [2,"c"]];
a.length; //3
```

W przypadku użycia operatora delete na ostatnim indexie tablicy,
została przypisana wartość typu **undefined** a nie faktyczne usunięcie elementu.

```javascript
var a = [];
a[0] = 1;
a[1] = "b";
a[2] = [2,"c"];

console.log(a.length); //3

delete a[2];

console.log(a.length); //3 !Uwaga!

console.log(a); //[1, "b", undefined]
```

Mimo iż można do tablic dodawać klucze typu **string** nie zaleca się robienia tego.
Deklaracja kluczy typu string niesie za sobą niemiłe konsekwencje:

1. Tego typu przypisania nie są uwzględniane przez właściwość *length*.

```javascript
var a = [];
a[0] = 1;
a["foo"] = 2;
a["bar"] = 3;
a.length; //1 !Uwaga!
```

2. Jeśli wartość typu **string** podana jako klucz może zostać poddana konwersji na standardową liczbę
to przyjmuje się, że wartość taka ma być **indeksem** typu **number**, co w efekcie da następujący rezultat:

```javasctipt
var a = [];
a["7"] = 42;
console.log(a.length); //8 !Uwaga!
console.log(a); //[undefined, undefined, undefined, undefined, undefined, undefined, undefined, 42]
```

Zamiast takiego rozwiązania należy użyć typu **object** i tam zadeklarować klucze (typu string) i wartości.

```javascript
var a 
    "foo": 2;
    "bar"  3
};
```
