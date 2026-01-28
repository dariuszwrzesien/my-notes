Kiedy odwołujemy się do właściwości obiektu ale ta właściwość nie istnieje
to Javascript użyje odwołania do wewnętrznego prototypu obiektu.
Wewnętrzne powiązanie odwowłania prototypu obiektu do innego powstaje w
chwili tworzenia danego obiektu.

```javasctipt
    var object1 = {
        a: 'Hello world'
    }

    var bar = Object.create( object1 );
    bar.b = "Witaj !!!";

    bar.b; // "Witaj !!!"
    bar.a; // "Hello world" // delegacja do object1
```

Metoda **Object.create()** tworzy nowy obiekt na podstawie prototypu i własności.
Ogólna postać metody wygląda następująco

**Object.create(*proto*[, propertiesObject])**


*proto*
- obiekt który jest prototypem dla nowo tworzonego obiektu.

*propertiesObject*
- opcjonalne, właściwości które zostaną dodane do nowo
utowrzonego obiektu.

Wracając do prototypowania,  właściwość **a** tak naprawdę nie istnieje w obiekcie bar,
ale z powodu połączenia prototypu między *bar* i *object1* Javascript automatycznie przechodzi do szukania
właściwości *a* w obiekcie *object1*.