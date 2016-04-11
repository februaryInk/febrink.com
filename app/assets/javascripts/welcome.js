var pages = [ '#welcome', '#about', '#projects' ];
var page = 0;

linkWel = new GoLink( '#welcome-go', 0 );
linkAbo = new GoLink( '#about-go', 1 );
linkPro = new GoLink( '#projects-go', 2 );

leaf1 = new Leaf( '#leaf-1', '-=10em', 0 );
leaf2 = new Leaf( '#leaf-2', '+=10em', 0 );
leaf3 = new Leaf( '#leaf-3', '-=10em', 0 );
leaf4 = new Leaf( '#leaf-4', '+=10em', 0 );

$( document ).ready( function(  ) {
    
    // in case of a browser with scroll memory, update navigation elements straight
    // off. this sometimes doesn't work in Chrome, which apparently triggers a 
    // .scroll(  ) event a short time after window load.
    page = checkPage(  );
    updateArrows( 0 );
    updateNavigation( 0 );
        
    $( '.arrow-left' ).click( function( evt ) { back(  ); } );
    $( '.arrow-right' ).click( function( evt ) { forward(  ); } );
    
    $( linkWel.identifier ).click( function( evt ) { linkWel.goTo( evt ); } );
    $( linkAbo.identifier ).click( function( evt ) { linkAbo.goTo( evt ); } );
    $( linkPro.identifier ).click( function( evt ) { linkPro.goTo( evt ); } );
    
    $( leaf1.identifier ).mouseover( function( evt ) { leaf1.move(  ); } );
    $( leaf2.identifier ).mouseover( function( evt ) { leaf2.move(  ); } );
    $( leaf3.identifier ).mouseover( function( evt ) { leaf3.move(  ); } );
    $( leaf4.identifier ).mouseover( function( evt ) { leaf4.move(  ); } );

} );

function GoLink( identifier, page ) {
    this.identifier = identifier
    this.page = page
}

GoLink.prototype.goTo = function( evt ) {
    evt.preventDefault(  );
    page = this.page;
    scrollTo( pages[ page ] );
}

function Leaf( identifier, move_by, move_count ) {
    this.identifier = identifier;
    this.move_by = move_by;
    this.move_count = move_count;
}

Leaf.prototype.move = function(  ) {
    if ( this.move_count < 2 ) {
        $( this.identifier ).animate( { left: this.move_by }, 750 );
        this.move_count += 1;
    }
    else {
        $( this.identifier ).animate( { left: this.move_by, opacity: 0 }, 1000 );
    }
}

function back(  ) {
    if ( page > 0 ) {
        page -= 1;
    }
    scrollTo( pages[ page ] );
}

function forward(  ) {
    if ( page < pages.length - 1 ) {
        page += 1;
    }
    scrollTo( pages[ page ] );
}

function scrollTo( cell ) {
    $( 'body, html' ).animate( { scrollLeft: $( cell ).offset(  ).left }, 750 );
    updateNavigation( 750 );
    updateArrows( 750 );
}

function checkPage(  ) {
    var page = 0;
    for ( var i = 0; i < pages.length; i++ ) {
        if ( $( pages[ i ] ).offset(  ).left === $( document ).scrollLeft(  ) ) {
            page = i;
        }
    }
    return( page );
}

function updateArrows( duration ) {
    switch( page ) {
        case 0:
            $( '.arrow-left' ).hide( duration );
            $( '.arrow-right' ).show( duration );
            break;
        case 1:
            $( '.arrow-left, .arrow-right' ).show( duration );
            break;
        case 2:
            $( '.arrow-left' ).show( duration );
            $( '.arrow-right' ).hide( duration );
            break;
        default:
            $( '.arrow-left, .arrow-right' ).show( duration );
            break;
    }
}

function updateNavigation( duration ) {
    $( '#nav-table-scrolling' ).animate( { 'margin-left': $( pages[ page ] + '-go' ).position(  ).left * -1 }, duration );
}