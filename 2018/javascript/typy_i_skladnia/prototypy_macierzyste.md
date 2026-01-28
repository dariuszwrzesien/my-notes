**Prototypy macierzyste**

Każdy z wbudowanych objektów macierzystych zawiera własny obiekt **.prototype**
(Array.prototype, String.prototype itd.)

Obiekty te mają unikatowe zachowanie w odniesieniu do konkretnego potypu obiektów,
i tak na przykład wartości prymitywne typu **string** dzięki automatycznemu opakowaniu w
obiekt macierzysty **String**, mają dostęp do **String.prototype**.

Konkewncja zawarta w dokumentacji pozwala tez na zapis skrócony:
**String.prototype.XYZ** można zapisać w postaci **string.XYZ**.

```javascript
    var a = 'abc';
    var i = a.indexOf('b');
    var c = a.charAt(0);
    var s = a.substr(2);
    var s2 = a.substr(1);

    console.log(i); //1
    console.log(c); //"a"
    console.log(s); //"c"
    console.log(s2); //"bc"
```

Żadna z powyższych metod nie modyfikuje łańcucha bezpośrednio. Wprowadzenie zmian powoduje powstanie nowej wartości na postawie istniejącej.

Inne prototypy zawierają zachowania odpowienie dla ich typów, np. **Number.prototype.toFixed()** itd.

Natomiast wszystkie funkcje dysponują dostępem do metod: **apply(...), call(...), bind(...)**, ponieważ
są one defniowane przez właściwość **Function.prototype**

