# hosttool

## install

### for script
```bash
npm install hosttool
```

### for cmd

```bash
npm install hosttool -g
```
## usage 

### for script

```javascript
const HostTool = require('hosttool');
const tool = new HostTool();

tool.list()
    .then(hosts => {
        console.log(hosts)
    }) 
    
tool.add('127.0.0.1 wiliex.com #wiliex')
    .then(()=> {
        console.log('host is added')
    })
    
tool.del('wiliex.com')
    .then(()=> {
        console.log('host is deleted')
    })
    
tool.query('wiliex.com')
    .then(host => {
        console.log(host)
    }) 
```
### for cmd 

- query host by hostname
  
```bash
hosttool query wiliex.com
```
 
- list all the hosts
 
```bash
hosttool list
```

- delete host by hostname
 
```bash
hosttool del wiliex.com
```
- add host
 
```bash
hosttool add '127.0.0.1 wiliex.com #wiliex'
```
 

