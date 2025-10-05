// =======================
// DOM ELEMENTS
// =======================
const newDeck = document.getElementById("new-deck")
const draw = document.getElementById("draw")
const winner = document.getElementById("result")
let remainingText = document.getElementById("remaining-text")
let imageContainer = document.getElementById("image-container")

// =======================
// GAME STATE VARIABLES
// =======================
let deckId          // Stores current deck ID
let myScore = 0     // Player score
let computerScore = 0 // Computer score

// =======================
// EVENT HANDLERS
// =======================

// Handle new deck creation
function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            // Save deck ID for later draws
            localStorage.setItem("deckId", data.deck_id)
            deckId = data.deck_id

            // Reset scores and enable draw button
            myScore = 0
            computerScore = 0
            draw.disabled = false

            // Display remaining cards
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            winner.textContent = "Game of War!" // Reset winner display
            imageContainer.innerHTML = ""       // Clear previous cards
        })
}

// Handle drawing two cards
function handleDoubleClick() {
    let savedDeckId = localStorage.getItem("deckId")
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${savedDeckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            // Disable draw button if deck is empty
            draw.disabled = data.remaining === 0

            // Update remaining cards display
            remainingText.textContent = `Remaining cards: ${data.remaining}`

            // If no cards returned, exit early
            if (!data.success || data.cards.length === 0) return

            // Extract drawn cards
            const card1 = data.cards[0]
            const card2 = data.cards[1]

            // Determine winner of this round and update scores
            const winnerText = determineWinner(card1, card2)

            // Build HTML to display drawn cards and current scores
            let drawHtml = `
                <h4 class="turn">My Score: ${myScore}</h4>
                <div class="card-container">
                    <img class="card" src=${card1.image} alt="First Deck-image"/>
                    <img class="card" src=${card2.image} alt="Second Deck-image"/>
                </div>
                <h4 class="turn">Computer Score: ${computerScore}</h4>
            `
            imageContainer.innerHTML = drawHtml

            // Display round winner
            winner.textContent = winnerText

            // If deck is empty, show final game result
            if (data.remaining === 0) {
                setTimeout(() => {
                    imageContainer.innerHTML = `<h3 class="message">Shuffle Deck to continue...</h3>`

                    if (myScore > computerScore) {
                        winner.textContent = `You Won the Game!`
                    } else if (computerScore > myScore) {
                        winner.textContent = `The Computer Won the Game!`
                    } else {
                        winner.textContent = `It's a Tie Game!`
                    }
                }, 500) // slight delay so last cards are visible
            }
        })
}

// =======================
// GAME LOGIC
// =======================

function determineWinner(card1, card2) {
    const cardValue = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const value1 = cardValue.indexOf(card1.value)
    const value2 = cardValue.indexOf(card2.value)

    if (value1 > value2) {
        myScore++
        return "You win this round!"
    } else if (value2 > value1) {
        computerScore++
        return "Computer wins this round!"
    } else {
        return "War!" // tie
    }
}

// =======================
// EVENT LISTENERS
// =======================
newDeck.addEventListener("click", handleClick)
draw.addEventListener("click", handleDoubleClick)
