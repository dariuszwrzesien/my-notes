Domknięcie można potraktować jako sposób „zapamiętania” i kontynuacji
dostępu do zakresu funkcji (jej zmiennych) nawet po zakończeniu wykonywania
danej funkcji.

```javascript
    function prefixer(prefix) {

        function join(string) {
            return prefix + string;
        }

        return join;
    }

    var prefixAAA = prefixer('AAA_');
    var prefixZZZ = prefixer('ZZZ_');



    console.log(prefixAAA('przykladowy_string'));
    console.log(prefixAAA('kolejny_przykladowy_string'));
    console.log(prefixZZZ('tym_razem_inny_prefix_niz_poprzednio'));
```

Sposób działania powyższego kodu:
1. podczas wywołania prefixer('AAA_') i przypisania do zmiennej prefixAAA, otrzymujemy odwołanie do funkcji wewnetrznej
join(...), która pamięta że wartością zmiennej prefix jest AAA_.
2. podczas wywołania prefixer('ZZZ_') otrzymujemy także odwołanie do funkcji wewnętrznej join(...),
która pamięta przekazaną wartość prefix = 'ZZZ_';
3. w trakcie wywołania prefixAAA('przykladowy_string') następuje defacto wywołanie funkcji join(...)
z parametrem ('przykladowy_string') wartosc zmiennej prefix została natomiast zamknieta tam już wcześniej
podczas przypisania prefixAAA = prefixer('AAA_'), stąd też w rezultacie otrzymujemy:
**AAA_przykladowy_string**
4. Podobnie sytuacja ma się w kolenych wywołaniach funkcji:
prefixAAA('kolejny_przykladowy_string');
prefixZZZ('tym_razem_inny_prefix_niz_poprzednio');

W rezultacie wywołania skryptu otrzymujemy:

AAA_przykladowy_string

AAA_kolejny_przykladowy_string 

ZZZ_tym_razem_inny_prefix_niz_poprzednio