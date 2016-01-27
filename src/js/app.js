//========================== TESTS =====================================================================
ZRouter
// set the root path (default "/")
    .setRoot("/")
    // set the loader template
    .setLoaderTpl("<h2>The template is loading, be patient please!</h2>")
    //add a route
    .add({
      url : "/",
      template:"I am the root template",
      callback : function(options){
        displayhashRoute();
      }
    })
    //add a route
    .add({
      url  : "/home",
      template : '<p>This is an inline template</p>',
      callback : function(options){
        displayhashRoute();
      }
    })
    //add a route
    .add({
      url  : "/home/:truc",
      template : '<p>This is an inline template with a longer route, its parameter is "<% this.params.truc %>"</p>',
      callback : function(options){
        displayhashRoute();
      }
    })
    //add a route
    .add({
      url : "/test2/:page",
      templateUrl : 'partials/test2.html',
      options: {
        page2 : "42"
      },
      callback : function(options) {
        displayhashRoute();
      }
    })
    // listen for hash changes
    .listen();

function displayhashRoute (){
  var url = window.location.hash;
  document.querySelector('.address-bar').innerHTML = url;
}
