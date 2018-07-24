// JavaScript source for the Blackjack game

    // Variables required for the cards
    var cards = [];
    var suits = ["spades", "hearts", "clubs", "diams"];
    var numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var playerCard = [];
    var dealerCard = [];
    // Define initial settings
    var cardCount = 0;
    var mypounds = 100;
    var endplay = false;
    // Store page elements in variables
    var message = document.getElementById('message');
    var output = document.getElementById('output');
    var dealerHolder = document.getElementById('dealerHolder');
    var playerHolder = document.getElementById('playerHolder');
    var pValue = document.getElementById('pValue');
    var dValue = document.getElementById('dValue');
    var poundValue = document.getElementById('pounds');
    // Adjust bet amounts depending on user input
    document.getElementById("mybet").onchange = function() {
        if(this.value > mypounds) {
            this.value= mypounds;
        }
        if(this.value < 0) {
            this.value = 0;
        }
        message.innerHTML = "The bet has been changed to £"+this.value;
    }
    // Create the deck of 52 cards using icon suits and number values
    for (s in suits) {
        var suit = suits[s][0].toUpperCase();
        var bgcolor = (suit == "S" || suit == "C") ? "black" : "red";
        for (n in numb) {
            var cardValue = (n > 9) ? 10 : parseInt(n)+1;
            var card = {
                suit:suit,
                icon:suits[s],
                bgcolor:bgcolor,
                cardnum:numb[n],
                cardvalue:cardValue
            }
            cards.push(card);
        }
    }
    // -- FUNCTIONS -- //
    // Start the game
    function Start() {
        shuffleDeck(cards);
        dealNew();
        document.getElementById("start").style.display = 'none';
        poundValue.innerHTML = mypounds;
    }
    // Deal the cards, adjust display and store bet value
    function dealNew() {
        dValue.innerHTML = "?";
        playerCard = [];
        dealerCard = [];
        dealerHolder.innerHTML = "";
        playerHolder.innerHTML = "";
        var betvalue = document.getElementById("mybet").value;
        mypounds = mypounds-betvalue;
        document.getElementById("pounds").innerHTML = mypounds;
        document.getElementById("myactions").style.display = 'block';
        message.innerHTML = "Get up to 21 and beat the dealer to win<br>Current bet is £"+betvalue+"<br>";
        document.getElementById("mybet").disabled = true;
        document.getElementById("maxbet").disabled = true;
        deal();
        document.getElementById("btndeal").style.display = 'none';
    }
    // Shuffle the deck before dealing if more than 40 cards have been used
    function redeal() {
        cardCount++
        if(cardCount > 40) {
            shuffleDeck(cards);
            cardCount = 0;
            message.innerHTML = "The deck was shuffled. ";
        }
    }
    // Deal 2 cards for each player, hide one of the dealers cards
    function deal() {
        // Card count reshuffle
        for (x = 0; x < 2; x++) {
            dealerCard.push(cards[cardCount]);
            dealerHolder.innerHTML += cardOutput(cardCount, x);
            if (x == 0) {
                dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';
            }
            redeal();
            playerCard.push(cards[cardCount]);
            playerHolder.innerHTML += cardOutput(cardCount, x);
            redeal();
        }
        // Re calculate players card value
        var playervalue = checktotal(playerCard);
        pValue.innerHTML = playervalue;
    }
    // Deal a new card from the deck and position accordingly
    function cardOutput(n, x) {
        var hpos = (x > 0) ? x * 60 + 100 : 100;
        return '<div class="icard '+ cards[n].icon +'" style="left: '+hpos+'px;"><div class="card-top-section suit">'+cards[n].cardnum+'<br></div><div class="card-middle-section suit"></div><div class="card-bottom-section suit">'+cards[n].cardnum+'<br></div></div>';
    }
    // Bet the maximum amount avaliable after maxbet is clicked
    function maxbet() {
        document.getElementById("mybet").value = mypounds;
        message.innerHTML = "Bet changed to £"+ mypounds;
    }
    // Switch function for each of the three possible player actions
    function cardAction(a) {
        switch (a) {
            case 'hit':
                playucard();
                break;
            case 'hold':
                playend(); // playout and calculate
                break;
            case 'double': // double the bet amount and draw a card
                var betvalue = parseInt(document.getElementById("mybet").value);
                if ((mypounds - betvalue) < 0) {
                    betvalue = betvalue + mypounds;
                    mypounds = 0;
                } else {
                    mypounds = mypounds-betvalue;
                    betvalue = betvalue * 2;
                }
                // Update amounts
                document.getElementById("pounds").innerHTML = mypounds;
                document.getElementById("mybet").value = betvalue;
                playucard();
                playend(); // playout and calculate
                break;
            default:
                playend(); // playout and calculate
        }
    }
    // Add a new card to the players hand
    function playucard() {
        playerCard.push(cards[cardCount]);
        playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length - 1));
        redeal();
        var rValue = checktotal(playerCard);
        pValue.innerHTML = rValue;
        if (rValue > 21) {
            playend();
        }
    }
    // End the play, adjust display and calculate who was the winner
    function playend() {
        endplay = true;
        document.getElementById("cover").style.display = 'none';
        document.getElementById("myactions").style.display = 'none';
        document.getElementById("btndeal").style.display = 'block';
        document.getElementById("mybet").disabled = false;
        document.getElementById("maxbet").disabled = false;
        message.innerHTML = "Game Over</br>";
        var payoutJack = 1;
        var dealervalue = checktotal(dealerCard);
        dValue.innerHTML = dealervalue;

        while(dealervalue < 17) {
            dealerCard.push(cards[cardCount]);
            dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length - 1));
            redeal();
            dealervalue = checktotal(dealerCard);
            dValue.innerHTML = dealervalue;
        }

        var playervalue = checktotal(playerCard);

        var betvalue = parseInt(document.getElementById("mybet").value) * payoutJack;
        // Player win conditions
        if ((playervalue < 22 && playervalue > dealervalue) || (dealervalue > 21 && playervalue < 22)) {
            message.innerHTML += '<span style="color: #5cb85c;">Congratulations! You won £' +betvalue+'!</span>';
            mypounds = mypounds + (betvalue *2);
        } // Tie/push condition
        else if (playervalue == dealervalue) {
            message.innerHTML += '<span style="color: #428bca;">PUSH - All bets are returned</span>';
            mypounds = mypounds + betvalue;
        } // Dealer victory otherwise
        else {
            message.innerHTML += '<span style="color: #d9534f;">Dealer wins! You lost £' +betvalue+'</span>';
        }
        // Update amounts
        pValue.innerHTML = playervalue;
        poundValue.innerHTML = mypounds;
        message.innerHTML += '<br>Enter the bet amount then click Deal';
    }
    // Adjust the total for an ace being either 11 or 1
    function checktotal(arr) {
        var rValue = 0;
        var aceAdjust = false;
        for(var i in arr) {
            if(arr[i].cardnum == 'A' && !aceAdjust) {
                aceAdjust = true;
                rValue=rValue + 10;
            }
            rValue=rValue+arr[i].cardvalue;
        }
        if (aceAdjust && rValue > 21) {
            rValue = rValue - 10
        }
        return rValue;
    }
    // Shuffle the cards randomly
    function shuffleDeck(array) {
        for (var i = array.length - 1; i>0; i--) {
            var j = Math.floor(Math.random() * (i+1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    // Update style for new cards dealt
    function outputCard() {
        output.innerHTML += "<span style='color:" + cards[cardCount].bgcolor + "'>"
        + cards[cardCount].cardnum + "&" + cards[cardCount].icon + ";"  + "</span> ";
    }
