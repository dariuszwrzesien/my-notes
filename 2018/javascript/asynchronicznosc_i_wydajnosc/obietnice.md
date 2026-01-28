Obietnice (ang. Promises) stanowią nowy paradygmat programowania w JavaScripcie. Jednak jego zrozumienie wymaga czasu i
pewnej uwagi. Generalnie, Obietnica stanowi wynik pewnego zadania, które się powiodło lub nie. Jedyne wymaganie jakie
stawia Obietnica to funkcja then, która określa funkcje zwrotne w przypadku sukcesu lub porażki zadania.

Przykładowo, dla lepszego zrozumienia przedstawimy asynchroniczną operacje zapisu dla naszego obiektu Parse.Object,
która w ujęciu funkcji zwrotnych przedstawia się następująco:

```javascript
    object.save({ key: value }, {
      success: function(object) {
        // obiekt zapisany.
      },
      error: function(object, error) {
        // nieudane zachowanie obiektu.
      }
    });
```

Analogiczne zachowanie przy rozważeniu paradygmatu obietnic, równie prosto:

```javascript
object.save({ key: value }).then(
  function(object) {
    // obiekt zapisany.
  },
  function(error) {
    // nieudane zachowanie obiektu.
  });
```

Bardzo podobnie? Więc o co tyle szumu? Prawdziwa moc obietnic to wielokrotne wywoływanie i wzajemne łączenie.
Wywołanie promise.then(func) zwraca nową obietnicę, która nie spełni się dopóki func nie zakończy się.
Istnieje pewna wyjątkowa kwestia, dotycząca sposobu wywołania funkcji przy udziale obietnic. Jeśli funkcja zwrotna
związana z then zwraca nową obietnicę, wówczas obietnica zwrócona przez then nie spełni się, dopóki nie spełni się
obietnica funkcji zwrotnej.

Brzmi to skomplikowanie więc zajrzyjmy do przykładu.
Wyobraź sobie kod odpowiedzialny za logowanie, szukanie obiektu i wreszcie jego aktualizację.
W przypadku starego paradygmatu funkcji zwrotnych, skończy się to wielkim zagnieżdżonym kodem:

```javascript
Parse.User.logIn("user", "pass", {
  success: function(user) {
    query.find({
      success: function(results) {
        results[0].save({ key: value }, {
          success: function(result) {
            // obiekt zapisany.
          }
        });
      }
    });
  }
});
```

Szybko taki kod staje się przerażający, nawet bez jakiejkolwiek obsługi błędów. Jednak przy podejściu kolejnych
wywołań i zastosowaniu obietnic prezentuje się to bardziej czytelnie:

```javascript
Parse.User.logIn("user", "pass").then(function(user) {
  return query.find();
}).then(function(results) {
  return results[0].save({ key: value });
}).then(function(result) {
  // obiekt zapisany.
});
```

Obsługa błędów

Poniższy kod, prezentuje idealnie wady dotychczasowego podejścia, ponieważ po dodaniu obsługi błędów,
kod staje się trudny w zrozumieniu:

```javascript
Parse.User.logIn("user", "pass", {
  success: function(user) {
    query.find({
      success: function(results) {
        results[0].save({ key: value }, {
          success: function(result) {
            // obiekt zapisany.
          },
          error: function(result, error) {
            // wystąpienie błędu.
          }
        });
      },
      error: function(error) {
        // wystąpienie błędu.
      }
    });
  },
  error: function(user, error) {
    // wystąpienie błędu.
  }
});
```

Obietnice wiedzą, kiedy zostały spełnione lub nie, zatem spokojnie przekazują błędy bez wywoływania funkcji zwrotnych,
dopóki obsługa błędów nie zostanie zakończona. Powyższy kod zapiszemy jeszcze prościej:

```javascript
Parse.User.logIn("user", "pass").then(function(user) {
  return query.find();
}).then(function(results) {
  return results[0].save({ key: value });
}).then(function(result) {
  // obiekt zapisany.
}, function(error) {
  // wystąpienie błędu.
});
```