**Destrukturyzaja obiketu**

Od wersji ECMAScript 6 para anzaków **{ }** może mieć związek z destrukturyzacją obiketów.

```javascript
function getData() {
    return {
        a: 42,
        b: "foo"
    }
}

var {a, b} = getData(); //destrukturyzacja
console.log(a, b); // 42 "foo"
```

Wyrażenie **var {a, b} = ... ** odpowiada następującemu kodowi:

```javasctipt
var res = getData();
var a = res.a;
var b = res.b;
```
