**Obiekty opakowujące**

W JavaScript wartości prymitywne (string, number, boolean itd.) nie mają właściwości ani metod.
Aby uzyskać dostęp do właściwości **.lenght** lub metody **.toString()** niezbędne jest opakowanie
wartości za pomocą **OBIEKTU OPAKOWUJĄCEGO**.
Obiektem opakowującym są tzw. **obiekty macierzyste**:
**String(), Number(), Boolean(), Array(), Object(), Function() itd.**

JavaScript na szczęście **AUTOMATYCZNIE OPAKOWUJE** wartości prymitywne.

```javascript
var a = "abc";

a.length; //3
a.toUpperCase(); //"ABC"
```

Nie należy jednak **jawnie** opakowywać wartości obiektami, ponieważ przeglądarki zostały zoptymalizowane
pod kątem typowych przypadków np. **.lenght**. Oznacza to, że program, który **jawnie** opakowuje
wartości prymitywne, działa wolniej.
Inaczej mówiąc, nigdy nie stosuj takich instruukcji, jak:

**new String("abc"), new Number(42), new Boolean(true)**

Zawsze wybieraj wariant użycia dosłownych wartości prymitywnych **"abc"**, **42**, **true**.

**Rozpakowywanie - valueOf()**

Aby rozpakować wartość prymitywną opakowaną obiektem, można skorzystać z metody ***valueOf()***

```javascript
    var a = new String("abc");
    var b = new Number(42);
    var c = new Boolean(true);

    a.valueOf(); // "abc"
    b.valueOf(); // 42
    c.valueOf(); // true
```
