/* *****************************************************************************
 * 
 * Created April 18, 2016 by Farrah Brink. Influenced by Alejandro U. Alvarez's
 * generator (https://github.com/aurbano/TreeGenerator) and Teri Martin's Blue 
 * Willow Tree (http://fineartamerica.com/featured/blue-willow-tree-teri-martin.html).
 * 
 **************************************************************************** */

$( document ).ready( function(  ) {
    if ( $( '#tree-canvas' ).length ) {
        var tree = new Tree( 'tree-canvas' );
        tree.grow(  );
    }
} );

// use prototypal inheritance from Branch, but still use each type's 
// native constructor.
Leader.prototype = Object.create( Branch.prototype, { constructor: { value: Leader } } );
Limb.prototype = Object.create( Branch.prototype, { constructor: { value: Limb } } );
Twig.prototype = Object.create( Branch.prototype, { constructor: { value: Twig } } );

function Tree ( canvasId, config ) {
    
    this.branches = [  ];
    this.leader = null;
    
    this.canvas = {
        $element: $( '#' + canvasId ),
        context2d: $( '#' + canvasId )[ 0 ].getContext( '2d' ),
        height: $( '#' + canvasId ).height(  ),
        width: $( '#' + canvasId ).width(  )
    }
    // avgNumLeaderBranches: statistically typical number of branches off the 
    // leader.
    // baseGrowthRate: base delay between each growth iteration (actual rates 
    // vary between branch types, but depend on this). highernumbers result in 
    // slower overall growth.
    // branchColor: branch color.
    // branchWidth: width of a branch in proportion to its parent.
    // initialWidth: starting width of the leader.
    // leaderHeight: height of the leader in proportion to the canvas height.
    // leafColors: possible leaf colors.
    // leaves: should this tree grow leaves?
    // maxSproutTime: maximum time that can pass between the initial generation 
    // of limbs and twigs and their growth.
    // wiggle: roughly, the scalar for the amount each growth iteration can 
    // deviate from its previous path.
    
    this.config = $.extend( {
        avgNumLeaderBranches: 15, 
        baseGrowthRate: 3, 
        branchColor: '#444444',
        branchWidth: 0.80,
        initialWidth: 30, 
        leaderHeight: 0.90, 
        leafColors: [ '#ffffff', '#3366cc', '#6600cc', '#6699ff' ], 
        leaves: true,
        maxSproutTime: 10,
        wiggle: 0.5
    }, config );
}

Tree.prototype.grow = function(  ) {
    
    this.leader = new Leader( 0, this, null, this.config.initialWidth, this.canvas.width / 2, this.canvas.height );
}

function Branch ( level, generator, parent, width, x, y ) {
    
    this.leaves = [  ];
    this.limbs = [  ];
    this.twigs = [  ];
    
    // level: ancestry distance from the leader.
    // lifetime: number of growth iterations this branch has gone through.
    // generator: pointer for the origin tree generator.
    // parent: branch that split to form this one.
    // width: width tracker.
    // x: x-position tracker.
    // xOrigin: the starting x-position.
    // y: y-position tracker.
    // yOrigin: the starting y-position.
    
    this.level = level;
    this.lifetime = 0;
    this.generator = generator;
    this.parent = parent;
    this.width = width;
    this.x = x;
    this.xOrigin = x;
    this.y = y;
    this.yOrigin = y;
    
    // DEFAULTS: these values should overwritten by subclasses if ever used.
    // but because these are used in Branch prototype functions, defaults are
    // given.
    
    // dx: change in x-position for the next growth iteration.
    // dy: change in y-position for the next growth iteration.
    // growthRate: delay between each growth iteration for this branch.
    // loss: width taken off per growth iteration.
    // postLimb: width after generating a limb in proportion to this branch's 
    // previous width.
    
    this.dx = 0;
    this.dy = 0;
    this.growthRate = this.generator.config.growthRate;
    this.loss = 0.03;
    this.postLimbWidth = 1.00;
}

Branch.prototype.canLeaf = function (  ) {
    
    return( false );
}

Branch.prototype.canSplit = function (  ) {
    
    return( false );
}

Branch.prototype.continueGrowth = function (  ) {
    
    // if the width is still distinguishable, continue this branch.
    if ( this.width >= 1 ) {
        
        var self = this;
        
        this.guide(  );
        
        setTimeout( function (  ) {
			      self.grow(  );
		    }, this.growthRate );
    }
}

Branch.prototype.generateLeaf = function (  ) {
    
    if ( this.generator.config.leaves ) {
        var flex = this.width * 3;
        var x = this.x + ( Math.random(  ) * ( flex - ( -1 * flex ) ) + ( -1 * flex ) );
        
        childLeaf = new Leaf( this.generator, this, this.width * 2, x, this.y );
        
        this.leaves.push( childLeaf );
    }
}

Branch.prototype.generateLimb = function (  ) {
    
    var width = ( this.width ) * this.generator.config.branchWidth;
    var x = this.x;
    var y = this.y;
    
    var childLimb = new Limb( this.level + 1, this.generator, this, width, x, y );
        
    this.limbs.push( childLimb );
    this.width = this.width * this.postLimbWidth;
}

Branch.prototype.generateTwig = function(  ) {
    
    var width = ( this.width ) * this.generator.config.branchWidth;
    var x = this.x;
    var y = this.y;
    
    var childTwig = new Twig( this.level + 1, this.generator, this, width, x, y );
        
    this.twigs.push( childTwig );
}

Branch.prototype.grow = function(  ) {
    
    this.generator.canvas.context2d.lineWidth = this.width;
    this.generator.canvas.context2d.beginPath(  );
    this.generator.canvas.context2d.moveTo( this.x, this.y );
    
    this.lifetime = this.lifetime + 1;
    this.width = this.width - this.loss;
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
    
    this.generator.canvas.context2d.strokeStyle = this.generator.config.branchColor;
    this.generator.canvas.context2d.lineTo( this.x, this.y );
    this.generator.canvas.context2d.stroke(  );
    
    if ( this.canSplit(  ) ) {
        this.split(  );
    }
    
    if ( this.canLeaf(  ) ) {
        this.generateLeaf(  );
    }
    
    this.continueGrowth(  );
}

Branch.prototype.guide = function (  ) {
    
    this.dx = 0;
    this.dy = 0;
}

Branch.prototype.split = function(  ) {
    
    if ( this.limbs.length < this.maxLimbs ) {
        if ( Math.random(  ) < this.twigThresh(  ) ) {
            this.generateTwig(  );
        } else {
            this.generateLimb(  );
        }
    } else {
        this.generateTwig(  );
    }
}

// the branch from which all other branches ultimately grow.
function Leader ( level, generator, parent, width, x, y ) {
    
    // constructor stealing.
    Branch.call( this, level, generator, parent, width, x, y );
    
    // dx: see Branch.
    // dy: see Branch.
    // growthRate: see Branch.
    // expectedLifetime: expected number of total iterations before this branch 
    // ends.
    // loss: see Branch.
    // maxLimbs: maximum number of limbs.
    // postLimbWidth: see Branch.
    // splitThresh: chance the branch will split into a new branch. calculated 
    // here with this.splitThresh * ( 3 / 4 ) * this.expectedLifetime = this.generator.config.avgNumLeaderBranches
    
    this.dx = 0;
    this.dy = 3;
    this.growthRate = this.generator.config.baseGrowthRate;
    this.expectedLifetime = ( ( this.generator.config.leaderHeight * this.generator.canvas.height ) / this.dy );
    this.loss = ( this.generator.config.initialWidth - 1 ) / this.expectedLifetime;
    this.maxLimbs = 15;
    this.postLimbWidth = 1.00;
    this.splitThresh = ( 4 / 3 ) * ( this.generator.config.avgNumLeaderBranches / this.expectedLifetime );
    
    this.grow(  );
}

Leader.prototype.canSplit = function (  ) {
    
    var splittable = ( this.lifetime / this.expectedLifetime ) > ( 1 / 4 ) &&
      Math.random(  ) < this.splitThresh;
    
    return( splittable );
}

Leader.prototype.guide = function(  ) {
    
    this.dx = this.dx + Math.sin( Math.random(  ) + this.lifetime ) * ( ( 1 / 2 ) * this.generator.config.wiggle );
    this.dy = -3;
}

Leader.prototype.twigThresh = function (  ) {
    
    return( ( this.lifetime / this.expectedLifetime ) - ( 3 / 4 ) * this.expectedLifetime );
}

// non-inheriting prototype used to generate leaves on twigs.
function Leaf ( generator, parent, radius, x, y ) {
    
    this.generator = generator;
    this.parent = parent;
    this.radius = radius;
    this.x = x;
    this.y = y;
    
    var self = this;
    
    setTimeout( function(  ) {
      self.grow(  );
    }, 500 );
}

Leaf.prototype.grow = function (  ) {
    
    this.generator.canvas.context2d.beginPath(  );
    this.generator.canvas.context2d.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, false );
    this.generator.canvas.context2d.fillStyle = this.generator.config.leafColors[ Math.floor( Math.random(  ) * this.generator.config.leafColors.length ) ];
    this.generator.canvas.context2d.fill(  );
}

// sub-branches that can split into twigs or, sometimes, a few other limbs.
function Limb ( level, generator, parent, width, x, y ) {
    
    // constructor stealing.
    Branch.call( this, level, generator, parent, width, x, y );
    
    // calculate an angle that is within 4 * Math.PI / 9 radians (80 degrees) in
    // either direction of the parent branch's angle, and start the limb in that
    // direction.
    
    var limitingAngle = 4.0 * Math.PI / 9.0;
    var parentDx = this.parent.dx;
    var parentDy = this.parent.dy;
    var parentAngle = Math.atan2( parentDy, parentDx );
    var angle = Math.random(  ) * ( ( parentAngle + limitingAngle ) - ( parentAngle - limitingAngle ) ) + ( parentAngle - limitingAngle );
    
    // dx: see Branch.
    // dy: see Branch.
    // growthRate: see Branch.
    // loss: see Branch.
    // maxLimbs: maximum number of limbs.
    // postLimbWidth: see Branch.
    // splitThresh: chance the branch will split into a new branch. calculated 
    // here with this.splitThresh * ( 3 / 4 ) * this.expectedLifetime = this.generator.config.avgNumLeaderBranches
    
    this.dx = 3 * Math.cos( angle );
    this.dy = 3 * Math.sin( angle );
    this.growthRate = this.generator.config.baseGrowthRate;
    // TODO: Inversely relate this to wiggle, since wiggle affects limb length.
    this.loss = ( level <= 1 ? this.parent.loss * this.generator.config.branchWidth : this.parent.parent.loss / this.generator.config.branchWidth );
    this.maxLimbs = ( level <= 1 ? 2 : 0 );
    this.postLimbWidth = 0.80;
    this.splitThresh = this.parent.splitThresh * ( 5 / 4 );
    
    var self = this;
    
    setTimeout( function(  ) {
        self.grow(  );
    }, Math.random(  ) * this.generator.config.maxSproutTime );
}

Limb.prototype.canSplit = function (  ) {
    
    return( this.lifetime > 10 && Math.random(  ) < this.splitThresh );
}

Limb.prototype.continueGrowth = function (  ) {
    if ( this.width >= 2 ) {
        
        var self = this;
        
        this.guide(  );
        
        setTimeout( function (  ) {
			      self.grow(  );
		    }, this.growthRate );
    // terminate in a small twig.
    } else {
        var childTwig = new Twig( this.level + 1, this.generator, this, this.width, this.x, this.y );
        
        this.twigs.push( childTwig );
    }
}

Limb.prototype.guide = function(  ) {
    
    this.dx = this.dx + Math.sin( Math.random(  ) + this.lifetime ) * this.generator.config.wiggle;
    this.dy = this.dy + Math.cos( Math.random(  ) + this.lifetime ) * this.generator.config.wiggle;
}

Limb.prototype.twigThresh = function (  ) {
    
    return( 0.50 );
}

// bottom-level branches that can't split, but can leaf.
function Twig ( level, generator, parent, width, x, y ) {
    
    // constructor stealing.
    Branch.call( this, level, generator, parent, width, x, y );
    
    // ensure the direction of growth is correct.
    var direction = ( this.xOrigin - this.parent.xOrigin ) / Math.abs( this.xOrigin - this.parent.xOrigin );
    
    // dx: see Branch.
    // dy: see Branch.
    // growthRate: see Branch.
    // leafThresh: chance a new leaf will grow when conditions are appropriate.
    // loss: see Branch.
    
    this.dy = 3;
    this.dx = 3 * direction * ( this.dy / Math.abs( this.dy ) ) * Math.pow( Math.abs( this.dy ), 1 / 3 );
    this.growthRate = this.generator.config.baseGrowthRate * 2;
    this.leafThresh = 0.80;
    this.loss = this.parent.loss / 2;
    
    // never let a twig be so wide that it will extend beyond the canvas.
    // make sure it will stop within the last 20%, if not before.
    // maxWidth - ( maxLifetime * this.loss ) = 1
    
    var maxLifetime = ( ( this.generator.canvas.height - ( this.generator.canvas.height * ( 0.20 * Math.random(  ) ) ) ) - this.y ) / this.dy;
    var maxWidth = 1 + ( maxLifetime * this.loss )
    
    if ( this.width > maxWidth ) {
        this.width = maxWidth;
    }
    
    var self = this;
    
    setTimeout( function(  ) {
        self.grow(  );
    }, Math.random(  ) * this.generator.config.maxSproutTime );
}

Twig.prototype.canLeaf = function (  ) {
    
    if ( this.leaves.length ) {
        var lastLeaf = this.leaves[ this.leaves.length - 1 ];
    
        return( Math.abs( this.y - lastLeaf.y ) > lastLeaf.radius * 2 && Math.random(  ) < this.leafThresh );
    } else {
        return( this.lifetime > 3 && Math.random(  ) < this.leafThresh );
    }
}

Twig.prototype.guide = function(  ) {
    
    var direction = ( this.xOrigin - this.parent.xOrigin ) / Math.abs( this.xOrigin - this.parent.xOrigin );
    
    // x = ( y - yOrigin )^( 1 / 3 ) + xOrigin
    this.dy = 3;
    this.dx = 3 * direction * ( ( ( this.y + this.dy ) - this.yOrigin ) / Math.abs( ( this.y + this.dy ) - this.yOrigin ) ) * ( Math.pow( Math.abs( ( this.y + this.dy ) - this.yOrigin ), 1 / 3 ) - ( ( this.y - this.yOrigin ) / Math.abs( this.y - this.yOrigin ) ) * Math.pow( Math.abs( this.y - this.yOrigin ), 1 / 3 ) );
}
