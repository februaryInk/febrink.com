var emphasizeSwitches = function (  ) {
    var $switches = $( '.js-cover-letter-switch' );
    
    // assuming all switches are the same size.
    var switchHeight = $switches.outerHeight(  );
    var switchWidth = $switches.outerWidth(  );
    
    animateInSequence( '.js-cover-letter-switch', 
        [ { 
            borderTopLeftRadius: 0.625 * switchHeight,
            borderTopRightRadius: 0.625 * switchHeight,
            borderBottomRightRadius: 0.625 * switchHeight,
            borderBottomLeftRadius: 0.625 * switchHeight,
            height: 1.25 * switchHeight, 
            marginLeft: '-=' + 0.125 * switchWidth,
            marginRight: '-=' + 0.125 * switchWidth,
            marginTop: '-=' + 0.125 * switchHeight,
            width: 1.25 * switchWidth 
        },
        { 
            borderTopLeftRadius: 0.45 * switchHeight,
            borderTopRightRadius: 0.45 * switchHeight,
            borderBottomRightRadius: 0.45 * switchHeight,
            borderBottomLeftRadius: 0.45 * switchHeight,
            height: 0.9 * switchHeight, 
            marginLeft: '+=' + 0.175 * switchWidth,
            marginRight: '+=' + 0.175 * switchWidth,
            marginTop: '+=' + 0.175 * switchHeight,
            width: 0.9 * switchWidth
        },
        { 
            borderTopLeftRadius: 0.5 * switchHeight,
            borderTopRightRadius: 0.5 * switchHeight,
            borderBottomRightRadius: 0.5 * switchHeight,
            borderBottomLeftRadius: 0.5 * switchHeight,
            height: switchHeight, 
            marginLeft: '-=' + 0.05 * switchWidth,
            marginRight: '-=' + 0.05 * switchWidth,
            marginTop: '-=' + 0.05 * switchHeight,
            width: switchWidth
        } ],
        [
            100,
            100,
            100
        ]
    );
}

var instateCoverLetterSwitches = function (  ) {
    
    $( document ).on( 'click', '.js-cover-letter-switch', function(  ) {
        type = $( this ).data( 'tree-type' );
        
        setCoverLetterColor(  );
        prepareCoverLetter(  );
    } );
    
    setTimeout( function(  ) {
        repeatedlyEmphasizeSwitches(  );
    }, 2000 );
}

var instateResizeRefresh = function (  ) {
    
    $( window ).resize( function (  ) {
        
        if ( windowWidth != $( window ).width(  ) ) {
            windowWidth = $( window ).width(  );
            prepareCoverLetter(  );
        }
    } );
}

var instateScrollTo = function (  ) {
    
    $( document ).on( 'click', '.js-scroll-link', function( event ) {
        event.preventDefault(  );
        
        var elementPosition = $( $( this ).attr( 'href' ) ).offset(  ).top - $( '.js-sticky-header' ).height(  );
        $( 'body, html' ).animate( { scrollTop: elementPosition }, 750 );
    } );
}

var instateStickyHeader = function (  ) {
    
    $( window ).scroll( function(  ) {
        if ( $( this ).scrollTop(  ) > $( '.js-sticky-header-wrapper' ).offset(  ).top ) {
            $( '.js-sticky-header' ).addClass( '-sticky' );
        } else {
            $( '.js-sticky-header' ).removeClass( '-sticky' );
        }
    } );
}

var prepareCoverLetter = function (  ) {
    
    setCoverLetterColor(  );
    
    var coverLetterHeight = window.innerHeight - $( '.js-peek-over' ).outerHeight(  );
    
    if ( coverLetterHeight < 0 ) {
        coverLetterHeight = window.innerHeight;
    }
    
    $( '.js-cover-letter' ).height( coverLetterHeight );
    $( '.js-cover-letter-window' ).height( coverLetterHeight );
    
    if ( $( '#tree-canvas' ).length ) {
        
        for ( var i = 0; i < Tree.prototype.instances.length; i++ ) {
            Tree.prototype.instances[ i ].kill(  );
            Tree.prototype.instances.splice( i, 1 );
        }
                        
        $( '#tree-canvas' )[ 0 ].height = $( '#tree-canvas' ).parent(  ).height(  );
        $( '#tree-canvas' )[ 0 ].width = $( '#tree-canvas' ).parent(  ).width(  );
        
        tree = new Tree( 'tree-canvas', type, {  
            leaderHeight: 0.99,
            xOrigin: ( 3 / 4 ) * $( '#tree-canvas' )[ 0 ].width
        } );
        tree.grow(  );
    }
}

var repeatedlyEmphasizeSwitches = function (  ) {
    
    emphasizeSwitches(  );
    setTimeout( function (  ) {
        repeatedlyEmphasizeSwitches(  );
    }, 10000 );
}

var setCoverLetterColor = function (  ) {
    
    $( '.js-cover-letter-switch' ).removeClass( '-open' );
    $( '.js-cover-letter-switch[ data-tree-type="' + type + '" ]' ).addClass( '-open' );
    
    $( '.js-outlined-text' )
        .removeClass( 'outline-birch' )
        .removeClass( 'outline-cherry' )
        .removeClass( 'outline-willow' )
        .addClass( 'outline-' + type );
}
