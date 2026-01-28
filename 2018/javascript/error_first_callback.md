**Error first callback**

Konwencja (zastosowana w Node.js) polega na zwróceniu dwóch argumentów do funkcji zwrotnej np. po wywołaniu asynchronicznym.

```javascript
    fs.readFile('/foo.txt', function(err, data) {
      // TODO: Error Handling Still Needed!
      console.log(data);
    });
```

1. Pierwszy argument jest zarezerwowany dla obiektu error.
2. Drugi argument jest dla danych kóre otrzymamy (response data) w wyniku zakończenia działania funkcji sukcesem.

Konwencja polega na tym że w pierwszej kolejności obsługujemy ewentualnie nadesłany **obiekt** error:

```javascript
    fs.readFile('/foo.txt', function(err, data) {
      if(err) {
          if(err.fileNotFound) {
            return this.sendErrorMessage('File Does not Exist');
          }
          // Ignore "No Permission" errors, this controller knows that we don't care
          // Propagate all other errors (Express will catch them)
          if(!err.noPermission) {
            return next(err);
          }
      }

      console.log(data);
    });
```