**Operatory || i &&**

Operatory logiczne znane z innych języków, w JavaScript nie zachowują się do końca jak
znane z PHP operatory logiczne.
W PHP wynikiem zastosowania operatora logicznego jest wartość **true** lub **false**.
W JavaScript jest inaczej. W JavaScript wartość generowana przez operator **||** lub **&&**
jest zawsze wartością jednego z dwóch argumentów (podobnie jak w Python lub Ruby).

```javascript
        var a = 42;
        var b = "abc";
        var c = null;
        var d = 0;

        a || b; //42 -> true
        c || b; //"abc" -> true
        b || a; //"abc" -> true
        b || c; //"abc" -> true

        c || d; //0 -> false
        d || c; //null ->false

        c && b; //null ->false
        b && c; //null ->false
        d && b; //0 ->false
        b && d; //0 ->false

        c && d; //null ->false
        d && c; //0 -> false

```

**||**

W przypadku gdy testowi z operatorem **||** poddamy dwie "prawdziwe" wartości,
wyrażenie wygeneruje wartość **pierwszego** z nich: a||b to 42, b||a to "abc".

W przypadku gdy jedna wartość jest "nieprawdziwa" ale druga jest prawdziwa czyli test kończy się jako **true**
to wyrażenie zwróci wartość **tej zmiennej która jest "prawdziwa"**. Więc c||b to "abc", b||c to "abc".

W przypadku gdy test **||** zakończy się wartością **false** to wyrażenie zwróci wartość drugiego argumentu
c||d to 0, d||c to null

**&&**

I odwrotnie, jeśli operatorem jest **&&** a test zakończy się wartością **true**, wyrażenie wygeneruje
wartość **drugiego** argumentu a && b to "abc", b && a to 42.

Jeśli jedna z wartości jest "nieprawdziwa" cały test zakończy się jako **false** a zwrócona zostanie
wartość **nieprawdziwej** zmiennej c && b to null, b && c to null, d && b to 0, b && d to 0.

Jeśli obie wartości w wyrażeniu są "nieprawdziwe" cały test kończy się jako **false** a zwrócona zostaje
wartość **pierwszego** argumentu c && d to null, d && c to 0.

**Podsumowanie**

Wynikiem wyrażenia z operatorem || lub && zawsze jest bazowa wartość jednego z argumentów,
a nie (prawdopodobnie poddany konwersji typu) wynik testu. W wyrażeniu c && b argument c to
wartość null , a zatem wartość „fałszywa”. Samo jednak wyrażenie z operatorem && zapewnia wartość
null (wartość argumentu c ), a nie poddaną konwersji typu wartość **false** używaną w teście.

W przybliżeniu można to postrzegać w ten sposób:

```javascript
    a || b;
    // w przybliżeniu odpowiada to wyrażeniu:
    a ? a : b;
    a && b;
    // w przybliżeniu odpowiada to wyrażeniu:
    a ? b : a;
```
