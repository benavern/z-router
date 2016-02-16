//========================== TESTS =====================================================================
ZRouter
// set the root path (default "/")
  .setRoot("/")
  // set the loader template
  .setLoaderTpl('<h2>The template is loading, be patient please!</h2>')
  //add a route
  .add({
    url : "/",
    template: '<h2>The root Url</h2>' +
              '<hr>' +
              '<p><span class="inline-code"> url : "<% this.url %>" </span></p>' +
              '<p>What is the root url?</p>' +
              '<ul><li>It will be automatically loaded if no route has been provided on page load</li>' +
              '<li>It will be loaded if no route matches the entered url</li></ul>' +
              '<p>It can be changed : <span class="inline-code">ZRouter.setRoot("/newRootRoute")</span></p>',
    options: {
      url : "/"
    },
    callback : function(options){
      displayhashRoute();
    }
  })

  //add a route
  .add({
    url  : "/user",
    template : '<h2>A Normal route</h2>' +
                '<hr>' +
                '<p><span class="inline-code"> url : "<% this.url %>" </span></p>' +
                '<p>You could probably use this route to display a list of users...</p>',
    options:{
      url: "/user"
    },
    callback : function(options){
      displayhashRoute();
    }
  })

  //add a route
  .add({
    url  : "/user/:id",
    template : '<h2>A route with parameter </h2>' +
                '<hr>' +
                '<p><span class="inline-code"> url : "<% this.url %>" </span></p>' +
                '<p><span class="inline-code"> params : id = <% this.params.id %> </span></p>' +
                '<p>You could probably use this route to display a specific user</p>',
    options: {
      url: "/user/:id"
    },
      callback : function(options){
      displayhashRoute();
    }
  })

  //add a route
  .add({
    url : "/fetched",
    templateUrl : 'partials/fetched.html',
    options: {
      url : "/fetched"
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

document.querySelector('#hashbang').addEventListener('change', function() {
    var useBang = this.checked;
    [].forEach.call(document.querySelectorAll('.link-for-router'), function(link) {
      link.href = (useBang) ? link.href.replace("#", "#!") : link.href.replace("#!", "#");
    });
    ZRouter.hashbang(useBang).navigate('/');
    displayhashRoute();
});
