Wzorzec modułu pozwala na zdefiniowanie prywatnych szczegółów implementacji (zmienne, funkcje),
ukrytych przed światem zewnętrznym oraz wystawienie publicznego API, które jest dostępne z zewnątrz.

```javascript
function User() {
    var username;
    var password;

    function doLogin(user, pass) {
        username = user;
        password = pass;
    }

    var API = {
        login: doLogin
    }

    return API;
}

//Utworzenie egzemplarza modułu User
var fred = User();

fred.login("fred", "admin1");

```

Funkcja User() przechowuje zmienne username i password oraz funkcję doLogin.
Są to prywatne szczegóły modułu User, niedostępne z zewnątrz.

Wewnętrzna funkcja doLogin() ma **domknięcie** przez username i password,
oznacza to zachowanie dostępu do wymienionych elementów nawet po zakończeniu wykonywania funkcji User() .

Funkcja User() zwraca **obiekt API** posiada on jedną metodę "login", która
jest odwołaniem do wewnętrznej funkcji doLogin().
