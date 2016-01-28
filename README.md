# z-router

*A simple JS router (hash styled & for front-end use) with ajax*

---

## How it works

Z-Router watches the hash part of the current url of the browser and displays the corresponding template based on the hash part of the route.

You can pass parameters inside the hash path and use it in the template. It is also possible to add options on the routes, they will also be available in the template.

You can provide to Z-router an inline template or a url for an external template, there is also a template engine that will transform the template before rendering it if needed.

(template engine inspiration : [http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line](http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line))

---

## Documentation

[http://labo.caradeuc.info/z-router](http://labo.caradeuc.info/z-router)

---

## Contribute

### Make it work on your desktop

| Command | Description |
|---------|-------------|
| `git clone https://github.com/benabern/z-router` | Clone the repo on your desktop (don't forget to cd the desired folder before cloning, after cloning open the newly created folder : `cd z-router`) |
| `npm i` | Will install all the dependencies that are needed |
| `gulp build` | Builds the `dist` directory |
| `gulp` (default) | Watches the changes and browser-sync |

### Conditions

Don't hesitate to fork and pull request. I am very curious to know how to improve it!

---

## License
[MIT](http://benavern.github.io/MIT#name=Benjamin%20Caradeuc&link=http://labo.caradeuc.info/)
