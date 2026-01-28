Formatowanie jsona w gedit - należy dodać w Manage External tool

```
#!/usr/bin/env python3

import json, sys

try:
    text = sys.stdin.read()
    j = json.loads(text)
    print( json.dumps(j, sort_keys=True, indent=2) )
except Exception as e:
    sys.stderr.write('Invalid JSON')

```


![image](https://user-images.githubusercontent.com/2975063/181125553-99d36673-4379-4e11-be46-47dd18c1c060.png)
