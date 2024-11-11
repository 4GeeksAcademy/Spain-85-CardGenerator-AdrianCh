// On load effects in order: Creates 2 card for dealer and player
window.onload = function() {
    createDealerCards(2);
    createPlayerCards(2);
    updateText("animated-turn-player");
    updateText("animated-turn-dealer")
}

// Modal activation on lost game
const closeButtonLoose = document.querySelector("[data-close-modal-loose-button]");
const modalLoose = document.querySelector("[data-modal-loose]");

closeButtonLoose.addEventListener("click", () => {
    modalLoose.close();
    location.reload()
});

// Modal activation on won game
const closeButtonWin = document.querySelector("[data-close-modal-win-button]");
const modalWin = document.querySelector("[data-modal-win]");

closeButtonWin.addEventListener("click", () => {
    modalWin.close();
    location.reload()
});

// Modal activation on tied game
const closeButtonTie = document.querySelector("[data-close-modal-tie-button]");
const modalTie = document.querySelector("[data-modal-tie]");

closeButtonTie.addEventListener("click", () => {
    modalTie.close();
    location.reload()
});

// Random suit selection for card
function randomSuit() {
    let suitArray = [ "♦","♥","♠","♣"];
    generatedSuit = suitArray [Math.floor(Math.random()*4)];

    return generatedSuit;
}

// Random rank selection for card
function randomRank() {
    let rankArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    generatedRank = rankArray [Math.floor(Math.random()*13)];

    return generatedRank;
}

// Dealer variables for tracking
let dealerHand = document.querySelector("#dealer-hand")
let dealerCardScore = document.querySelector("#dealer-card-score");
let dealerTotalCardValue = 0
let thereIsAnAceDealer = false;
let secondDealerCard
let firstCardHiddenCounter = 0;
let firstCard

// Creation of dealers cards
function createDealerCards(num) {
    for (let i = 0; i < num; i++){
        // Card attributes
        let newCard = document.createElement("div");
        let newRank = randomRank();
        let newSuit = randomSuit();
        
        // Card value adder for K, J and Q. Ace card checker
        let cardValue;
        if (newRank === "K" || newRank === "Q" || newRank === "J") {
            cardValue = 10;
        } else if (newRank === "A") {
            thereIsAnAceDealer = true
            cardValue = 11;
        } else {
            cardValue = newRank
        }
        secondDealerCard = cardValue;
        dealerTotalCardValue += parseInt(cardValue)

        // Card colour change
        let colourModifier = "";
        if(newSuit === "♦" || newSuit === "♥") {
            colourModifier = "class = red";
        }

        if (firstCardHiddenCounter === 0) {
            firstCard = "behind-card-dealer";
        } else {
            firstCard = ""
        }

        // Card creation HTML
        newCard.innerHTML = 
        `
            <div class=" dealer-card d-flex flex-column bg-light rounded-2 ${colourModifier} ${firstCard}" id="${firstCard}">
                <div class="d-flex flex-column justify-content-start ms-1">
                    <span>${newRank}</span>
                    <span>${newSuit}</span>
                </div>
            
                <div class="d-flex justify-content-center align-items-center h-100">
                    <span class="dealer-card-center-icon">${newSuit}</span>
                </div>

                <div class="suit2 d-flex flex-column justify-content-end me-1">
                    <span>${newRank}</span>
                    <span>${newSuit}</span>
                </div>
            </div>
        `;
        dealerHand.appendChild(newCard);
        firstCardHiddenCounter++
    }
    // Debugging console text
    console.log("Is there an Ace in dealer?: "+ thereIsAnAceDealer);
    console.log("Total score dealer: " + dealerTotalCardValue)
    // Initial score with value of second card only
    dealerCardScore.innerHTML = `Total Card Score: ${secondDealerCard}`;
}

// Dealer chooses new cards logic
const dealer = document.querySelector("#stand")
dealer.addEventListener("click", function() {
    document.querySelector("#behind-card-dealer").classList.remove("behind-card-dealer")
    document.querySelector("#animated-turn-dealer").classList.remove("visually-hidden")
    document.querySelector("#animated-turn-player").classList.add("visually-hidden")
    const hitMeButton = document.querySelector("#hit-me")
    hitMeButton.disabled = true
    dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
    function dealerTurn() {

        function drawCardAndCheckAce() {
            createDealerCards(1);
            dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
            if (thereIsAnAceDealer && dealerTotalCardValue > 21) {
                dealerTotalCardValue -= 10;
                thereIsAnAceDealer = false;
                dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
            }
        }

        if (dealerTotalCardValue >= 17) {
            if (thereIsAnAceDealer && dealerTotalCardValue > 21) {
                dealerTotalCardValue -= 10;
                thereIsAnAceDealer = false;
                dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
            }
            determineWinner();
            return;
        }

        if (thereIsAnAceDealer && dealerTotalCardValue > 21) {
            dealerTotalCardValue -= 10;
            thereIsAnAceDealer = false;
            dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
        }

        if (dealerTotalCardValue < 13) {
            drawCardAndCheckAce()
            console.log(dealerTotalCardValue)
            dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
            setTimeout(dealerTurn, 500);
        } else if(dealerTotalCardValue >=13 &&  dealerTotalCardValue < 17) {
            let risk;
            if (dealerTotalCardValue === 13) risk = 1;
            if (dealerTotalCardValue === 14) risk = 0.8;
            if (dealerTotalCardValue === 15) risk = 0.7;
            if (dealerTotalCardValue === 16) risk = 0.6;

            let randomAction = Math.random();
            if(risk > randomAction || dealerTotalCardValue < playerTotalCardValue) {
                drawCardAndCheckAce()
                dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
                setTimeout(dealerTurn, 500);
                console.log("I gambled")
            } else {
            console.log("I decided not to gamble")
            determineWinner()
            }

        }
        console.log(dealerTotalCardValue);

        // Who wins decision
    function determineWinner() {
        dealerCardScore.innerHTML = `Total Card Score: ${dealerTotalCardValue}`;
        if (dealerTotalCardValue < playerTotalCardValue || dealerTotalCardValue > 21) {
            modalWin.showModal()
        } else if (dealerTotalCardValue > playerTotalCardValue && dealerTotalCardValue <= 21) {
            modalLoose.showModal()
        } else {
            modalTie.showModal()
        }
    }
    }
    setTimeout(dealerTurn, 500);
})


// Player cards info
let playerHand = document.querySelector("#player-hand")
let playerTotalCardValue = 0
let thereIsAnAcePlayer = false;

// Player initial card creation and Hit-me
function createPlayerCards(num) {
    for (let i = 0; i < num; i++){
        // Card attributes
        let newCard = document.createElement("div");
        let newRank = randomRank();
        let newSuit = randomSuit();
        
        // Card value adder for K, J and Q. Ace card checker
        let cardValue;
        if (newRank === "K" || newRank === "Q" || newRank === "J") {
            cardValue = 10;
        } else if (newRank === "A") {
            thereIsAnAcePlayer = true
            cardValue = 11;
        } else {
            cardValue = newRank
        }
        playerTotalCardValue += parseInt(cardValue)

        // Card colour
        let colourModifier = "";
        if(newSuit === "♦" || newSuit === "♥") {
            colourModifier = "class = red";
        }

        // Card creation HTML
        newCard.innerHTML = 
        `
            <div class="player-card d-flex flex-column bg-light rounded-2 ${colourModifier}">
                <div class="d-flex flex-column justify-content-start ms-1">
                    <span>${newRank}</span>
                    <span>${newSuit}</span>
                </div>
            
                <div class="d-flex justify-content-center align-items-center h-100">
                    <span class="player-card-center-icon">${newSuit}</span>
                </div>

                <div class="suit2 d-flex flex-column justify-content-end me-1">
                    <span>${newRank}</span>
                    <span>${newSuit}</span>
                </div>

            </div>
        `;
        playerHand.appendChild(newCard);
        
    }
    // Debug logs
    console.log("Is there an Ace in player?: " + thereIsAnAcePlayer);
    console.log("Total score player: " + playerTotalCardValue);

    let playerCardScore = document.querySelector("#player-card-score");
    if (thereIsAnAcePlayer && playerTotalCardValue > 21) {
        playerTotalCardValue-=10;
        thereIsAnAcePlayer = false;
    }
    playerCardScore.innerHTML = `Total Card Score: ${playerTotalCardValue}`;
}

// Add new Card and loose modal
const hitMe = document.querySelector("#hit-me")
hitMe.addEventListener("click", function(){
    createPlayerCards(1)
    if (playerTotalCardValue > 21) {
        modalLoose.showModal()
    }
})


// Popover for betting
document.addEventListener("DOMContentLoaded", function() {
    const popoverTrigger = document.getElementById("bet-wrapper");
    const popover = new bootstrap.Popover(popoverTrigger);
})

// Animation Turn-text (https://codepen.io/zachkrall/pen/MWWGMPx)

function updateText(textId) {
    let delay = 200;
    let targetText = document.getElementById(textId);
    let textValue = targetText.innerText;
    targetText.innerHTML = textValue
        .split("")
        .map(letter => `<span>${letter}</span>`)
        .join("");

    Array.from(targetText.children).forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("wavy");
        }, index * 60 + delay);
    });
}
