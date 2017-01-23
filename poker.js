function Card(deck) {
    /* This is the Card class, which represents a 
    single card IN PLAY (imagine as held by a player, 
    or on the table. 
    It takes an optional deck argument to represent 
    from which deck the card was dealt from.*/
  
    //It has the following properties:
    this.size = (deck.size? deck.size: 52); //max index for card, deterined from deck size if associated (default=52)
    this.val = 0; //face value property, set with flip()
    this.suit = 0; //suit value property, set with flip()
    this.held = false; //indicated a card is 'held', and won't be affected by the next deal, set with hold()
    
    //And two methods to assign values to those properties
    this.flip = function() {
        var i = Math.floor(Math.random() * this.size);//generates a random value from 0 to 51 (or size of the deck)
        this.val = i % 13;//assigns the face value by dividing by 13 and returnung the remainder, 0-12
        this.suit = i % 4;//assigns the suit by dividing by 4 and returning the remainder, 0-3
        return i;//returns the cards assigned value index so the deck will know what was dealt
    };

    this.hold = function() {
        //if held, unhold
        if (this.held == true)
            this.held = false;
        //otherwise, hold
        else
            this.held = true;
    };

} 

function Deck(size) {
    /* This is the Deck object, which mostly is an 
    over-glorified array to tell a program when a card 
    is in play to prevent the same card (not a card of 
    the same value) from being dealt twice in the same hand.
    Takes an optional size argument, which can be used to
    make casino style games using more than one deck possible.
    */
  
    //Properties
    this.size = (size? size : 52);//default standard playing card deck, 52 cards less jokers, unless playing with multiple decks.
    this.dealt = new Array(this.size);//the index of dealt cards. False, card not played yet, True, card played already.
    
    //Methods
    this.shuffle = function() {
        //set all the cards to default "Not Dealt" status 
        for (i=0;i<this.size;i++) {
            this.dealt[i] = false;
        }
    };
  
    this.deal = function(x) {
        //takes the value returned by Card object's flip(), sets that card to true, to indicate it's played
        this.dealt[x] = true;
    };

}

function Hand(hand_size, deck_size) {
    /*The grand overseer of the card and deck objects, you'd call
    all the values and functions from the Hand object.
    The hand controls the size of the hand (defaults to five cards), 
    number of decks used(or more accurately number of cards in the deck), 
    starts the game by dealing unique cards to fill the hand and calling 
    the functions to set the necessary values, and controls the deal phase, 
    iterating over each card, checking if it is held, and dealing a new
    card when it finds any that are not.*/
    
    //Properties
    this.size = (hand_size? hand_size : 5);//sets the hand size, default 5
    this.deck = new Deck(deck_size);//sets the deck size, default normal 52 card deck
    this.card = new Array();//cards for this hand
    
    //Methods
    this.play = function() {
        //start each new hand by shuffling the deck
        this.deck.shuffle();
        
        //for the size of this hand, create new cards and...
        for (j=0;j<this.size;j++) {
            this.card[j] = new Card(this.deck);
        }
        
        //give each card a value
        this.deal();
    };
    
    
    this.deal = function() {
        //for each card...
        for (j=0;j<this.size;j++) {    
            var k;
            if (this.card[j].held == false) { //check if it's held...
                do {
                    k = this.card[j].flip(); // flip it if it isn't (flipping it assigns it a new value and suit)...
                } while (this.deck.dealt[k] == true) //until we find one that hasn't been dealt yet
                this.deck.deal(k);// indicate it's been dealt, so next time we don;t get the same card
            };
        }
    };
    
    this.sort = function() { //sorts cards by face value, useful for shorter checking functions which declare if a hand wins
        var test = new Array();
        for (i=0;i<this.card.length;i++){
            test[i] = this.card[i].val;
        }
        test.sort(function(a, b){return a-b});
		return test;
    };
}
function Poker() {
    // the following functions check if the result of the hand's sort() produces values that indicate a win. 
    this.fullhouse = function(test) {//test for a full house, takes a hand's sort() return value
        if ((test[0]==test[1]&&test[0]==test[2]&&test[3]==test[4])||(test[0]==test[1]&&test[2]==test[3]&&test[2]==test[4]))
            return true;
        else
            return false;
    };

    this.straight = function(test) { //test for a straight from a hand's sort() value
        if (test[0]+1==test[1]&&test[1]+1==test[2]&&test[2]+1==test[3]&&test[3]+1==test[4])
            return true;
        else if (test[0]==0&&test[1]==9&&test[2]==10&&test[3]==11&&test[4]==12)
            return true;
        else
            return false;
    };
	
	this.royal = function(test) {
		if (test[0]==0&&test[1]==9&&test[2]==10&&test[3]==11&&test[4]==12)
            return true;
		else
			return false;
	};
	
    this.flush = function(hand) {// checks for a flush, which doesn't require sorting, so takes the hand object and checks the suits of it's card array
        var test = new Array();
        for (i=0;i<hand.card.length;i++){
            test[i] = hand.card[i].suit;
        }
        if (test[0]==test[1]&&test[1]==test[2]&&test[2]==test[3]&&test[3]==test[4])
            return true;
        else
            return false;
    };

    this.pair = function(test) {//looks for pairs in the hand's sort return, but also counts them
        var x = false;
        var y = 0;
        var w = [];
        for (z = 0;z<test.length-1;z++){
            if (test[z]==test[z+1]) {
                x = true;
                y++;
                w.push(test[z]);
            };
        }
        var win = [x, y + " pairs", w];
        return win;
    };

    this.three = function(test) { //checks for a three of a kind in a hand's sort result
        var x = false;
        var  y = 0;
        for (z = 0;z<test.length-2;z++){
            if (test[z]==test[z+1]&&test[z]==test[z+2])
                x = true;
        }
        return x;
    };

    this.four = function(test) { //looks for a four of a kind in a hand's sort return
        var x = false;
        for (z = 0;z<test.length-3;z++){
            if (test[z]==test[z+1]&&test[z]==test[z+2]&&test[z]==test[z+3])
                x = true;
        }
        return x;
    };
}
/*
//to start, make a new Hand object. You may declare hand and deck sizes, 
//or default to 5 cards hand sizes and a 52 card deck
var hand = new Hand();

//call hand.play() to create the deck, shuffle it and deal the initial cards 
hand.play();

//this displays the values of the important properties
for (z = 0; z < hand.size; z++) {//loop thru the hand
    console.log(hand.card[z].val);//print the face value on each card
    console.log(hand.card[z].suit);//print the suit of each card
    console.log(hand.card[z].held);//print whether it is marked to be held
}

//loops thru and holds every other card in the hand
for (y = 0; y < 5; y += 2) {
    hand.card[y].hold();//this is how you call a card's hold function, y = card to hold
}

//This again, seriously, I should have just wrote a function, but whatever
for (z = 0; z < hand.size; z++) {
    console.log(hand.card[z].val);
    console.log(hand.card[z].suit);
    console.log(hand.card[z].held);
}

//calls the hand object's deal function to take all the unheld cards and reassign their values
hand.deal()

//repetitious code is repetitious
for (z = 0; z < hand.size; z++) {
    console.log(hand.card[z].val);
    console.log(hand.card[z].suit);
    console.log(hand.card[z].held);
}

//and here I'm just printing the results of the validations to find winning card combinations
//you'll notice a three of a kind will indicate two pairs
//comboing a straight and flush will tell you if you have a straight flush, etc.
console.log("straight: " + straight(hand.sort()));
console.log("flush: " + flush(hand));
console.log("pair: " + pair(hand.sort()));
console.log("three of a kind: " + three(hand.sort()));
console.log("four of a kind: " + four(hand.sort()));
console.log("full house: " + fullhouse(hand.sort()));
*/