(function(){
  function getArtistLink( artist ) {
    return artistLinks[ artist.toLowerCase( ) ];
  }

  function randomInt( min, max ) {
    return Math.floor( Math.random( ) * max ) + min;
  };
  function randomSrc( template, min, max ) {
    var num = randomInt( min, max );
    return template.replace( '{num}', num );
  }
  function RandomLogo( $node ) {
    var self = {};
    function init( ) {
      self.$node = $node;
      self.$node.attr( 'src', randomSrc( 'logos/franzlogo{num}.png', 1, 4 ) );
      return self;
    }
    return init( );
  }
  function Nav( $node ) {
    var self = {};
    function init( ) {
      self.$node = $node;
      self.$entries = $node.find( 'li' );
      return self;
    }
    self.onHash = function( hash ) {
      var dst = hash.split( '/' )[ 0 ];
      self.$entries.removeClass( 'active' );
      self.$node.find( '[data-dst=' + dst + ']' ).addClass( 'active' );
    };
    return init( );
  }
  function Page( dst, $node ) {
    var self = {};
    function init( ) {
      self.$node = $node;
      self.$node.addClass( dst );
      self.initialized = false;
      return self;
    }
    self.show = function( ) {
      if( !self.initialized ) {
        self.initialized = true;
        self.loadImages( );
        if( self.onInit ) {
          self.onInit( );
        }
      }
      self.$node.removeClass( 'hidden' );
      if( self.onShow ) {
        self.onShow( );
      }
    };
    self.hide = function( ) {
      self.$node.addClass( 'hidden' );
    };
    self.loadImages = function( ) {
      self.$node.find( 'img' ).each( function( _, img ) {
        var $img = $( img );
        $img.attr( 'src', $img.data( 'src' ) );
      } );
    };
    return init( );
  }
  function Mission( dst, $node) {
    var self = Page( dst, $node );
    function init( ) {
      self.$img = $( 'img.random' );
      return self;
    }
    self.onShow = function( ) {
      var num = randomInt( 1, 6 );
      self.$img.attr( 'src', 'vinz/01_Mission/FRANZ_Startbilder/mission{num}.png'.replace( '{num}', num ) );
      self.$node.find( '.copyright' ).addClass( 'hidden' );
      self.$node.find( '.cp' + num ).removeClass( 'hidden' );
    };
    return init( );
  }
  function Magazine( dst, $node ) {
    var self = Page( dst, $node );
    function init( ) {
      self.$template = self.$node.find( '.Issue' );
      self.$list = self.$node.find( '.IssueList' );
      self.$detail = self.$node.find( '.IssueDetail' );
      return self;
    }
    self.onInit = function( ) {
      // defined in the html
      _.forEach( magazineIssues, function( issue, i ) {
        var $issue = self.$template.clone( )
        .removeClass( 'hidden' )
        .prependTo( self.$list );
        $issue.find( 'a' ).attr( 'href', '#Magazine/' + i );
        $issue.find( '.title' ).text( issue.title );
        $issue.find( '.year' ).text( issue.year );
        $issue.find( '.cover' ).attr( 'src', 'vinz/02_Magazine/franz' + i + '.png' );
        $issue.find( '.number' ).attr( 'src', 'vinz/02_Magazine/franzMAGAZINE' + i + '.png' );
      } );
    };
    self.onShow = function( ) {
      window.scrollTo( 0, 0 );
      var urlParts = location.hash.split( '/' );
      var isDetailView = urlParts.length > 1;
      if( isDetailView ) {
        self.$list.addClass( 'hidden' );
        self.$detail.removeClass( 'hidden' );
        self.renderDetail( urlParts[ 1 ] );
      } else {
        self.$list.removeClass( 'hidden' );
        self.$detail.addClass( 'hidden' );
      }
    };
    self.renderDetail = function( num ) {
      var config = magazineIssues[ num ];
      function showImage( index ) {
        self.$detail.find( '.content' ).attr( 'src', '' );
        setTimeout( function( ) {
          self.$detail.find( '.content' ).attr( 'src', 'vinz/02_Magazine/l' + num + '/' + index + '.png' );
        }, 1 );
      }
      self.$detail.find( '.number' ).attr( 'src', 'vinz/02_Magazine/franzMAGAZINE' + num + '.png' );
      self.$detail.find( '.description' ).text( config.description );
      if( config.soldOut ) {
        self.$detail.find( '.soldOut' ).removeClass( 'hidden' );
        self.$detail.find( '.buy' ).addClass( 'hidden' );
      } else {
        self.$detail.find( '.soldOut' ).addClass( 'hidden' );
        self.$detail.find( '.buy' ).removeClass( 'hidden' );
      }

      self.$detail.find( '.artists' ).html( '' );
      var artists = _.map( config.artists.split( ',' ), $.trim );
      _.forEach( artists, function( artist, i ) {
        var url = getArtistLink( artist );
        if( url ) {
          $( '<a>' ).text( artist ).attr( 'href', url ).appendTo( self.$detail.find( '.artists' ) );
        } else {
          $( '<span>' ).text( artist ).appendTo( self.$detail.find( '.artists' ) );
        }
        if( i < artists.length - 2 ) {
          $( '<span>, </span>' ).appendTo( self.$detail.find( '.artists' ) );
        }
        if( i == ( artists.length - 2 ) ) {
          $( '<span> and </span>' ).appendTo( self.$detail.find( '.artists' ) );
        }
      } );

      showImage( 0 );
      var current = 0;
      self.$detail.find( '.content' ).on( 'click', function showNext( ) {
        if( current == ( config.numberOfImages - 1 ) ) {
          current = -1;
        }
        showImage( ++current );
      } );
    };
    return init( );
  }
  function Crew( dst, $node ) {
    var self = Page( dst, $node );
    function init( ) {
      self.$list = self.$node.find( '.List' );
      self.$detail = self.$node.find( '.Detail' );
      return self;
    }
    self.onInit = function( ) {
      _.forEach( _.range( 0, 8 ), function( num ) {
        var $link = $( '<a>' ).attr( 'href', '#Crew/' + num ).appendTo( self.$list );
        $( '<img>' ).attr( 'src', 'vinz/03_Crew/crew{num}.png'.replace( '{num}', num ) ).appendTo( $link );
      } );
    };
    self.onShow = function( ) {
      var urlParts = location.hash.split( '/' );
      var isDetailView = urlParts.length > 1;
      if( isDetailView ) {
        self.$list.addClass( 'hidden' );
        self.$detail.removeClass( 'hidden' );
        self.renderDetail( urlParts[ 1 ] );
      } else {
        self.$list.removeClass( 'hidden' );
        self.$detail.addClass( 'hidden' );
      }
    };
    self.renderDetail = function( num ) {
      var config = crew[ num ];
      if( config.link ) {
        self.$detail.find( '.link' ).removeClass( 'hidden' );
        self.$detail.find( '.link' ).html( '<a href="' + config.link + '">' + config.link + '</a>' );
      } else {
        self.$detail.find( '.link' ).addClass( 'hidden' );
      }
      self.$detail.find( '.name' ).text( config.name );
      self.$detail.find( '.description' ).text( config.description );
      function showImage( index ) {
        self.$detail.find( '.content' ).attr( 'src', '' );
        setTimeout( function( ) {
          self.$detail.find( '.content' ).attr( 'src', 'vinz/03_Crew/C' + num + '/' + index + '.png' );
        }, 1 );
      }
      showImage( 0 );
      var current = 0;
      self.$detail.find( '.content' ).on( 'click', function showNext( ) {
        if( current == config.numberOfImages - 1 ) {
          current = -1;
        }
        showImage( ++current );
      } );
    };
    return init( );
  }
  function Release( dst, $node ) {
    var self = Page( dst, $node );
    function init( ) {
      self.$template = self.$node.find( '.Entry' );
      self.$list = self.$node.find( '.List' );
      self.$detail = self.$node.find( '.Detail' );
      return self;
    }
    self.onInit = function( ) {
      _.forEach( releases, function( entry, i ) {
        var $entry = self.$template.clone( )
        .removeClass( 'hidden' )
        .prependTo( self.$list );
        $entry.find( '.cover' ).attr( 'src', 'vinz/04_Release/R' + i + '.png' );
        $entry.find( 'a' ).attr( 'href', '#Release/' + i );
        $entry.find( '.title' ).text( entry.title );
        $entry.find( '.date' ).text( entry.date );
        if( entry.flyer ) {
          $entry.find( '.flyer' ).text( entry.flyer );
          $entry.find( '.flyercontainer' ).removeClass( 'hidden' );
        }
        $entry.find( '.location' ).text( entry.location );
        if( entry.location2 ) {
          $entry.find( '.location2' ).text( entry.location2 ).removeClass( 'hidden' );
        }
      } );
    };
    self.onShow = function( ) {
      var urlParts = location.hash.split( '/' );
      var isDetailView = urlParts.length > 1;
      if( isDetailView ) {
        self.$list.addClass( 'hidden' );
        self.$detail.removeClass( 'hidden' );
        self.renderDetail( urlParts[ 1 ] );
      } else {
        self.$list.removeClass( 'hidden' );
        self.$detail.addClass( 'hidden' );
      }
    };
    self.renderDetail = function( num ) {
      function mkLink( name ) {
        name = $.trim( name );
        var url = getArtistLink( name );
        if( url ) {
          return '<a href="' + getArtistLink( name ) + '">' + name + '</a>';
        } else {
          return name;
        }
      }
      var config = releases[ num ];
      function showImage( index ) {
        self.$detail.find( '.content' ).attr( 'src', '' );
        setTimeout( function( ) {
          self.$detail.find( '.content' ).attr( 'src', 'vinz/04_Release/R' + num + '/' + index + '.png' );
        }, 1 );
      }
      showImage( 0 );
      var current = 0;
      self.$detail.on( 'click', function showNext( ) {
        if( current == ( config.numberOfImages - 1 ) ) {
          current = -1;
        }
        showImage( ++current );
      } );
      self.$detail.find( '.detailTitle' ).text( config.detailTitle );
      self.$detail.find( '.description' ).text( config.description );
      self.$detail.find( '.installations' ).html(
        'Installations: ' + _.map( config.installations.split( ',' ), mkLink ).join( ' / ' )
      );
      self.$detail.find( '.photos' ).html(
        'Photos: ' + _.map( config.photos.split( ',' ), mkLink ).join( ' / ' )
      );
      if( config.bands ) {
        self.$detail.find( '.bands' ).removeClass( 'hidden' );
        self.$detail.find( '.bands' ).html(
          'Bands: ' + _.map( config.bands.split( ',' ), mkLink ).join( ' / ' )
        );
      } else {
        self.$detail.find( '.bands' ).addClass( 'hidden' );
      }
      if( config.video ) {
        self.$detail.find( '.videoCredit' ).html( 'Video: ' + mkLink( config.videoCredit ) );
        self.$detail.find( '.video' ).html( config.video );
      } else {
        self.$detail.find( '.videoCredit' ).html( '' );
        self.$detail.find( '.video' ).html( '' );
      }
    };
    return init( );
  }
  function Pages( ) {
    var pageConstructors = {
      Mission: Mission,
      Magazine: Magazine,
      Crew: Crew,
      Release: Release,
      News: Page,
      Contact: Page,
      Impressum: Page
    };
    var self = {};
    function init( ) {
      self.pages = {};
      $( '.Page' ).each( function( _, page ) {
        var $page = $( page );
        var dst = $page.data( 'dst' );
        self.pages[ dst ] = pageConstructors[ dst ]( dst, $page );
      } );
      return self;
    }
    self.onHash = function( hash ) {
      var hashDst = hash.split( '/' )[ 0 ];
      for( var dst in self.pages ) {
        self.pages[ dst ].hide( );
      }
      self.pages[ hashDst ].show( );
    };
    return init( );
  }
  function init( ) {
    RandomLogo( $( '.logo' ) );
    var nav = Nav( $( '.Nav' ) );
    var pages = Pages( );
    function publishHash( ) {
      var hash = location.hash.replace( '#', '' );
      if( hash === '' ) {
        location.hash = 'Mission';
      } else {
        nav.onHash( hash );
        pages.onHash( hash );
      }
    }
    $( window ).hashchange( publishHash );
    publishHash( );
  }
  init( );
})();
