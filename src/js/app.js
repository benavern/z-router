
  var Zrouter = (function() {

    /**
     * Private arguments & methods
     */
    var private = {
      routes : [],
      cache  : [],
      root : '/',
      elId : 'z-router-view',
      fetch : function(name, url, callback) {
        //fetches the template.
        $.get(url, function(data) {
          private.addToCache(name, data);
          callback(data);
        });
      },
      addToCache : function(name, data) {
        private.cache[name] = data;
      },
      current : null,
      interval: null
    };

    /**
     * Private arguments & methods
     */
    var public = {
      // getters
      get : {
        fragment: function() {
            var match = window.location.href.match(/#(.*)$/),
                fragment = match ? match[1] : '';
            return fragment.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        routes : function() {
          return JSON.stringify(private.routes);
        },
        route : function(f) {
          var routeFound = private.routes.map(function(x) { return x.route; }).indexOf(f);
          if (routeFound != -1) return private.routes[routeFound];
          return null;
        }
      },
      //setters
      set : { //return public; (will allow methods chaining)
        root : function(root) {
          private.root = root;
          return public;
        },
        route : function(route) {
          if(!!route.name && !!route.url && !!route.callback && (!!route.template || !!route.templateUrl)) private.routes.push(route);
          else console.log('The route named "'+route.name+'" can\'t be added');
          return public;
        }
      },
      //other functions
      remove: function(routeName) {
        var routeInRoutes = private.routes.map(function(a) { return a.name; }).indexOf(routeName),
            routeInCache = private.cache.map(function(b) { return b.name; }).indexOf(routeName);
        if(routeInRoutes != -1) private.routes.splice(routeInRoutes, 1);
        else console.log('The route named "'+routeName+'" doesn\'t exist');
        if(routeInCache != -1) private.cache.splice(routeInCache, 1);
        return public;
      },
      check: function(f){
        // checks the current fragment and calls render method ifit has changed
      },
      listen: function() {
        // calls every 50ms the check methode and compares the current fragment with the one that has been stored at last route change
        var current = public.get.fragment();
        var fn = function() {
            if(current !== public.get.fragment()) {
                current = public.get.fragment();
                public.check(current);
            }
        };
        clearInterval(private.interval);
        private.interval = setInterval(fn, 50);
        return public;
      },
      render : function(route) {
        // rendrers the template (downloads it before if the route has a tempalte url & is not yet in the cache) + loader
        // should pass in template function only if it has options
        // should only pass in template function when in cache but url has changed
        private.fetch(route.name, route.url);
      },
      navigate : function(path) {
        path = path ? path : '';
        window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        return public;
      },
      template : function (html, options) {
        //pass the html and options in and this will return the html populated with the options data
        // http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
        var re = /<%([^%>]+)?%>/g,
            reExp  = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code   = 'var r=[];\n',
            cursor = 0,
            match;
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };
        while(match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
      }
    };

    /**
     * Expose only the public things
     */
    return public;
  })();
