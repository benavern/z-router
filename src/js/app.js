/**
 * @class ZRouter
 * @author Benjamin Caradeuc http://labo.caradeuc.info/z-router
 * @copyright Benjamin Caradeuc 2016
 * @license MIT http://benavern.github.io/MIT#name=benjamin%20caradeuc&link=http://caradeuc.info
 */
var ZRouter = (function(document, window) {

  /**
   * Private arguments & methods
   * @private
   */
  var priv = {
    // the routes array
    routes    : [],
    // the default route url if nothing specified
    root      : '/',
    // the view (css) selector
    el        : '#z-router-view',
    //the loader html template
    loaderTpl : "<p>Loading...</p>",

    /**
     * Get the template (ajax or inline)
     * @param route
     */
    getTemplate: function (route) {
      // fetches the template if needed & compiles it then returns it (to simulate caching, fetched data is inserted in the template of the selected route )
      if (!!route.template) {
        pub.render(pub.tp(route.template, route.options));
        if(typeof route.callback == "function") route.callback(route.options);
      }
      else if (!!route.templateUrl) {
        // display the loader
        pub.render(priv.loaderTpl);
        // fetch the template data
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            route.template = xhttp.responseText;
            pub.render(pub.tp(xhttp.responseText, route.options));
            if(typeof route.callback == "function") route.callback(route.options);
          }
          else if (xhttp.status == 404){
            pub.render("<h1>Error " + xhttp.status + "</h1>");
          }
        };
        xhttp.open("GET", route.templateUrl, true);
        xhttp.send();
      }
    }
  };

  /**
   * Public arguments & methods
   * @public
   */
  var pub = {

    /**
     * Get the hash part of the actual url (prettified)
     * @returns {string}
     */
    getFragment: function() {
      if(window.location.hash === "") window.location.hash = "#" + priv.root; // no infinite loop when no or empty hash provided
      var match = window.location.href.match(/#(.*)$/),
          fragment = match ? match[1] : '';
      return fragment.toString();//.replace(/\/$/, '').replace(/^\//, ''); // don't remove first & last slash or #/ wont work!
    },


    /**
     * Sets the root route url (@default: "/")
     * @param root (string)
     * @returns pub (method chaining)
     */
    setRoot : function(root) {
      priv.root = root;
      return pub;
    },

    /**
     * Changes the default loader template (@tip: put a gif img for example)
     * @param tpl
     * @returns pub (method chaining)
     */
    setLoaderTpl: function(tpl) {
      priv.loaderTpl = tpl;
      return pub;
    },

    /**
     * Add a route in the list of routes
     * if the this is a function, make it the default route !
     * @param route (object)
     * @returns pub (method chaining)
     */
    add : function(route) {
      if(typeof route == "object") {
        if(!!route.url && (!!route.template || !!route.templateUrl)) priv.routes.push(route);
        else console.log("This route has a problem, it cant be added!", route);
      }
      else console.log("This route has a problem, it cant be added!", route);
      return pub;
    },

    /**
     * gets the route based on the fragment and calls the the method that will get the template
     * @param f (fragment)
     * @returns pub (method chaining)
     */
    check: function(f){
      // checks the current fragment and calls render method
      var fragment = f || pub.getFragment(),
          argsVal,
          argsNames,
          params = {};

      for(var x = 0; x < priv.routes.length; x++){
        var currRoute = priv.routes[x];
        var routeMatcher = new RegExp("^" +currRoute.url.replace(/(:\w+)/g, '([\\w-]+)') + "$");
        argsVal = fragment.match(routeMatcher);
        if(argsVal) {
          argsVal.shift(); // to remove the first array element
          argsNames = currRoute.url.match(/(:\w+)/g);
          if(argsNames) {
            for(var y = 0; y < argsNames.length; y++){
              params[argsNames[y].slice(1)] = argsVal[y];
            }
          }
          if(!currRoute.options) currRoute.options = {};
          currRoute.options.params = params;
          priv.getTemplate(currRoute);
          return pub;
        }
      }
      pub.navigate(priv.root);
      return pub;
    },

    /**
     * Listens the url changes and calls the check function when they occure
     * @returns pub (method chaining)
     */
    listen: function() {
      // calls every 50ms the check methode and compares the current fragment with the one that has been stored at last route change
      var currentFragment = null, // to be sure it will be fired onload
          interval;
      var fn = function() {
        if(currentFragment !== pub.getFragment()) {
          currentFragment = pub.getFragment();
          pub.check(currentFragment);
        }
      };
      clearInterval(interval);
      interval = setInterval(fn, 50);
      return pub;
    },

    /**
     * Renders the template on the view
     * @param data
     * @returns pub (method chaining)
     */
    render : function(data) {
      document.querySelector(priv.el).innerHTML = data;
      return pub;
    },

    /**
     * Force the url to change programatically
     * @param path
     * @returns pub (method chaining)
     */
    navigate : function(path) {
      path = path ? path : '';
      window.location.href = window.location.href.replace(/#(.*)$/, '#' + path);
      return pub;
    },

    /**
     * Populates the view with the options properties passed to it (for loops etc...)
     * http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
     * @param html
     * @param options
     * @returns {html}
     */
    tp : function (html, options) {
      //pass the html and options in and this will return the html populated with the options data
      // http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
      var re = /<%([^%>]+)?%>/g,
          reExp  = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
          code   = 'var r=[];\n',
          cursor = 0,
          match;
      var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
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

  // expose the "pub" things and keep "priv" 's ones safe.
  return pub;
})(document, window);
