var hand = new Hand();

var displayHand = function(){
    var r = '';
    var s = '';
    var t = '';
    for (i=0;i<hand.size;i++){
        if (hand.card[i].suit % 2 == 0)
            r = 'black';
        else
            r = 'red';
        
        switch (hand.card[i].val) {
		    case 0:
			    t = ' A';
			    break;
		    case 10:
			    t = ' J';
			    break;
		    case 11:
			    t = ' Q';
			    break;
		    case 12:
			    t = ' K';
			    break;
			default:
			    t = " " + (hand.card[i].val + 1);
			    break;
	    }
        
        switch (hand.card[i].suit) {
		    case 0:
			    s = "\&spades\;";
			    break;
		    case 1:
			    s = "\&hearts\;";
			    break;
		    case 2:
			    s = "\&clubs\;";
			    break;
		    case 3:
			    s = "\&diams\;";
			    break;
	        }
           
        document.getElementById('card' + i).innerHTML = "<span style='color:" + r + ";'>" + t + "<br>" + s + "</span>";
    }

};

var phase = false;
var credits = 100;
var message = "";
var pok = new Poker();

var deal = function(){
    if (phase == true){
        hand.play();
        credits = credits - 5;
        $("div.card").toggleClass("held", false);
		$("#message").toggleClass("gold", false);
		$("#message").toggleClass("maroon", false);
        displayHand();
        message = "";
        phase = false;
        document.getElementById('message').innerHTML = "";
        document.getElementById('bank').innerHTML = "Score: " + credits;
		document.getElementById('deal').innerHTML = "Draw";
        
    }
    else {
        hand.deal();
        
        if (pok.flush(hand)) {
            if (pok.straight(hand.sort()) && pok.royal(hand.sort())){
				$("#message").toggleClass("gold", true);
				message = "\&#9733\;Winner!\&#9733\;"
				credits += 1000;
			}
			else if (pok.straight(hand.sort())) {
				$("#message").toggleClass("gold", true);
				message = "\&#9733\;Winner!\&#9733\;";
				credits += 250;
			}
			else {
			$("#message").toggleClass("gold", true);
            message = "\&#9733\;Winner!\&#9733\;";
            credits += 25;
			}
        }
        else if (pok.straight(hand.sort())) {
			$("#message").toggleClass("gold", true);
            message = "\&#9733\;Winner!\&#9733\;";
            credits += 20;
        }
        else if (pok.four(hand.sort())) {
			$("#message").toggleClass("gold", true);
            message = "\&#9733\;Winner!\&#9733\;";
            credits += 125;
        }
        else if (pok.fullhouse(hand.sort())) {
			$("#message").toggleClass("gold", true);
            message = "\&#9733\;Winner!\&#9733\;";
            credits += 40;
        }
        else if (pok.three(hand.sort())) {
			$("#message").toggleClass("gold", true);
            message = "\&#9733\;Winner!\&#9733\;";
            credits += 15;
        }
        else {
        
            var wins = pok.pair(hand.sort());

            if (wins[0] && (wins[1] == "2 pairs")) {
				$("#message").toggleClass("gold", true);
                message = "\&#9733\;Winner!\&#9733\;";
                credits += 10;
            }
            else if (wins[0] && (wins[2][0] > 9)){
				$("#message").toggleClass("gold", true);
                message = "\&#9733\;Winner!\&#9733\;";
                credits += 5;
            }
            else if (wins[0] && (wins[2][1] > 9)) {
				$("#message").toggleClass("gold", true);
                message = "\&#9733\;Winner!\&#9733\;";
                credits += 5;
            }
            else if (wins[0] && (wins[2][0] < 1)) {
				$("#message").toggleClass("gold", true);
                message = "\&#9733\;Winner!\&#9733\;";
				credits += 5;
            }
            else if (wins[0] && (wins[2][1] < 1)) {
				$("#message").toggleClass("gold", true);
                message = "\&#9733\;Winner!\&#9733\;";
				credits += 5;
            }
            else {
				$("#message").toggleClass("maroon", true);
                message = "Try Again";
				if (credits < 5)
					credits = 100;
            }
        }
        displayHand();
        phase = true;
        document.getElementById('message').innerHTML = message;
        document.getElementById('bank').innerHTML = "Score: " + credits;
		document.getElementById('deal').innerHTML = "Deal";
        
    }
};
$(document).ready(function(){

    hand.play();
    displayHand();
    document.getElementById('message').innerHTML = "";
    $( ".card" ).click(function() {
        $( this ).toggleClass( "held" );
    });
});