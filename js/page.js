function randomInt( min, max ) {
  return Math.floor( Math.random( ) * max ) + min;
}

function trim( entry ) {
  return entry.replace( /^\s+|\s+$/g, '' );
}

function S( template, values ) {
  var result = template;
  for( var key in values ) {
    result = result.replace( new RegExp( '{{' + key + '}}', 'g' ), values[ key ] );
  }
  return result;
}

var franz = angular.module( 'franz', [ ] ).config( [ '$routeProvider', function( $routeProvider ) {
  $routeProvider
  .when( '/Mission', {
    templateUrl: 'views/mission.html',
    controller: 'MissionCtrl'
  } )
  .when( '/Magazine', {
    templateUrl: 'views/magazine.html',
    controller: 'MagazineCtrl'
  } )
  .when( '/Crew', {
    templateUrl: 'views/crew.html',
    controller: 'CrewCtrl'
  } )
  .when( '/Release', {
    templateUrl: 'views/release.html',
    controller: 'ReleaseCtrl'
  } )
  .when( '/News', {
    templateUrl: 'views/news.html',
    controller: 'PageCtrl'
  } )
  .when( '/Contact', {
    templateUrl: 'views/contact.html',
    controller: 'PageCtrl'
  } )
  .when( '/Impressum', {
    templateUrl: 'views/impressum.html',
    controller: 'PageCtrl'
  } )
  .otherwise( {
    redirectTo: '/Mission'
  } );
} ] );

function reverseWithIndex( list ) {
  return _.map( list, function( item, i ) {
    item._i = i;
    return item;
  } ).reverse( );
}

franz.service( 'persons', function( $http ) {
  var self = {
    urls: {}
  };

  $http.get( 'data/personlinks.json' )
  .then( function( result ) {
    self.urls = result.data;
  } );

  self.getUrl = function( name ) {
    return self.urls[ name.toLowerCase( ) ];
  };

  return self;
} );

franz.directive( 'personLink', function( persons ) {
  return {
    restrict: 'A',
    scope: {
      personLink: '='
    },
    link: function( scope, element, attrs ) {
      var name = scope.personLink;
      var url = persons.getUrl( name );
      if( url ) {
        element.html( '<a href=' + url + '>' + name + '</a>' );
      } else {
        element.text( name );
      }
    }
  }
} );

franz.controller( 'AppCtrl', function( $scope, $location ) {
  $scope.randomLogo = '';

  $scope.menu = _.map(
    [ 'Mission', 'Magazine', 'Crew', 'Release', 'News', 'Contact' ],
    function( name, i ) {
      return {
        route: '#' + name,
        name: name,
        activeImg: S( 'vinz/navi/n{{i}}_.png', { i: i+1 } ),
        inActiveImg: S( 'vinz/navi/n{{i}}.png', { i: i+1 } )
      }
    }
  );

  function updateMenu( ) {
    var name = $location.$$path.split( '/' )[ 1 ];
    if( !name ) {
      name = 'Mission';
    }
    _.forEach( $scope.menu, function( item ) {
      var isActive = item.name == name;
      if( isActive ) {
        item.img = item.activeImg;
      } else {
        item.img = item.inActiveImg;
      }
    } );
  }

  function loadRandomLogo( ) {
    $scope.randomLogo = S( 'vinz/navi/franzlogo{{num}}.png', { num: randomInt( 1, 4 ) } );
  }

  $scope.$on( '$locationChangeSuccess', function( ) {
    updateMenu( );
    loadRandomLogo( );
  } );

} );

franz.controller( 'PageCtrl', function( ) {
} );

franz.controller( 'MissionCtrl', function( $scope, $http ) {
  $scope.current = {};

  $http.get( 'data/missioncopyrights.json' )
  .then( function( result ) {
    var copyrights = result.data;
    var index = randomInt( 0, copyrights.length );
    $scope.current = {
      copyright: copyrights[ index ],
      img: S( 'vinz/01_Mission/FRANZ_Startbilder/mission{{num}}.png', { num: index + 1 } )
    };
  } );

} );

franz.controller( 'MagazineCtrl', function( $scope, $http, $location ) {
  var selectedIssueIndex = parseInt( $location.$$search.issue );
  $scope.issues = [];
  $scope.selectedIssue = null;
  $scope.currentImageIndex = 0;
  $scope.nextImage = function( ) {
    $scope.currentImageIndex++;
    if( $scope.currentImageIndex == $scope.selectedIssue.numberOfImages ) {
      $scope.currentImageIndex = 0;
    }
  }
  $http.get( 'data/magazineissues.json' )
  .then( function( result ) {
    if( selectedIssueIndex != undefined ) {
      $scope.selectedIssue = result.data[ selectedIssueIndex ];
    }
    $scope.issues = _.map( reverseWithIndex( result.data ), function( issue ) {
      issue.artists = _.map( issue.artists.split( ',' ), trim );
      return issue;
    } );
  } );
} );

franz.controller( 'CrewCtrl', function( $scope, $http, $location ) {
  var selectedIndex = parseInt( $location.$$search.person );
  $scope.list = [];
  $scope.selected = null;
  $scope.currentImageIndex = 0;
  $scope.nextImage = function( ) {
    $scope.currentImageIndex++;
    if( $scope.currentImageIndex == $scope.selected.numberOfImages ) {
      $scope.currentImageIndex = 0;
    }
  }
  $http.get( 'data/crew.json' )
  .then( function( result ) {
    var crew = _.map( result.data, function( item, i ) {
      item._i = i;
      return item;
    } );
    $scope.list = _.map( _.range( 0, crew.length ), function( i ) {
      return {
        url: '#/Crew?person=' + i,
        img: S( 'vinz/03_Crew/crew{{num}}.png', { num: i } )
      }
    } );
    if( selectedIndex != undefined ) {
      $scope.selected = result.data[ selectedIndex ];
    }
  } );
} );

franz.controller( 'ReleaseCtrl', function( $scope, $http, $location ) {
  var selectedIndex;
  if( $location.$$search.release ) {
    selectedIndex = parseInt( $location.$$search.release );
  }
  $scope.selected = null;
  $scope.list = [];
  $scope.currentImageIndex = 0;
  $scope.nextImage = function( ) {
    $scope.currentImageIndex++;
    if( $scope.currentImageIndex == $scope.selected.numberOfImages ) {
      $scope.currentImageIndex = 0;
    }
  }
  $http.get( 'data/releases.json' )
  .then( function( result ) {
    if( selectedIndex != undefined ) {
      $scope.selected = result.data[ selectedIndex ]
      $scope.selected.installations = _.map( $scope.selected.installations.split( ',' ), trim );
      if( $scope.selected.bands ) {
        $scope.selected.bands = _.map( $scope.selected.bands.split( ',' ), trim );
      }
      $scope.selected.photos = _.map( $scope.selected.photos.split( ',' ), trim );
    }
    $scope.list = reverseWithIndex( result.data );
  } );
} );
