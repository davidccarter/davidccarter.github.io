document.addEventListener("DOMContentLoaded", function() {
  // Get the current date
  var currentDate = new Date().toLocaleDateString();
  var currentDateElement = document.getElementById("currentDate");
  currentDateElement.textContent = currentDate;

  var slotsContainer = document.getElementById("slots");
  var slots = slotsContainer.querySelectorAll(".slot");

  var startingNumber = 0;
  var currentNumber = 0;

  var startTime; // Variable to store the start time
  var endTime; // Variable to store the end time
  var timerInterval; // Variable to store the timer interval

  function updateCurrentNumber() {
    currentNumber = startingNumber;
    var manipulationCount = 0; // Track the number of manipulations made
  
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var image = slot.querySelector(".slot-image");
  
      if (image) {
        manipulationCount++; // Increment the manipulation count
  
        var symbol = image.textContent;
        if (symbol === "+") {
          currentNumber += startingNumber;
        } else if (symbol === "-") {
          currentNumber -= startingNumber;
        } else if (symbol === "x") {
          currentNumber *= startingNumber;
        } else if (symbol === "/") {
          currentNumber /= startingNumber;
        }
      }
    }
  
    var currentNumberElement = document.getElementById("currentNumber");
    currentNumberElement.textContent = "current number: " + currentNumber;
  
    // Check if the current number is equal to the ending number and all 5 slots are filled
    var endingNumberElement = document.getElementById("endingNumber");
    var endingNumber = parseFloat(endingNumberElement.textContent.split(": ")[1]);
  
    if (currentNumber === endingNumber && manipulationCount === 5) {
      // Stop the timer
      clearInterval(timerInterval);
  
      // Calculate the time difference in seconds
      var timeDiff = Math.floor((endTime - startTime) / 1000);
  
      // Display the completion message
      currentNumberElement.textContent = "Congrats! You finished today's challenge in: " + timeDiff + " seconds";
  
      // Update the leaderboard
      updateLeaderboard(timeDiff);
  
      // Show the leaderboard
      var leaderboard = document.getElementById("leaderboard");
      leaderboard.classList.remove("hidden");
    }
  }
  
  var operators = document.querySelectorAll(".operator");

  // Function to handle operator button click
  function handleOperatorClick() {
    var symbol = this.getAttribute("data-symbol");

    // Find the first empty slot
    var emptySlot = null;
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (!slot.querySelector(".slot-image")) {
        emptySlot = slot;
        break;
      }
    }

    if (emptySlot) {
      var image = document.createElement("div");
      image.textContent = symbol;
      image.className = "slot-image";
      image.style.fontSize = "40px";
      emptySlot.appendChild(image);

      // Set the background color based on the symbol
      if (symbol === "x") {
        emptySlot.style.backgroundColor = "rgb(232, 232, 90)";
      } else if (symbol === "+") {
        emptySlot.style.backgroundColor = "rgb(130, 255, 130)";
      } else if (symbol === "-") {
        emptySlot.style.backgroundColor = "rgb(255, 120, 120)";
      } else if (symbol === "/") {
        emptySlot.style.backgroundColor = "rgb(58, 58, 58)";
      }

      updateCurrentNumber();
    }
  }

  // Attach event listener to each operator button
  operators.forEach(function(operator) {
    operator.addEventListener("click", handleOperatorClick);
  });
  
  function startGame() {
    var startButton = document.getElementById("startButton");
    var header = document.querySelector(".header");
    var content = document.getElementById("content");
    var startingNumberElement = document.getElementById("startingNumber");
    var endingNumberElement = document.getElementById("endingNumber");
  
    // Hide the header
    header.style.display = "none";
  
    // Hide the start button
    startButton.style.display = "none";
  
    // Show the content
    content.classList.remove("hidden");
  
    // Show the game instructions
    var gameInstructions = document.getElementById("gameInstructions");
    gameInstructions.classList.remove("hidden");
  
    // Generate a random starting number (between 2 and 6)
    startingNumber = Math.floor(Math.random() * 5) + 2;
    startingNumberElement.textContent = "starting number: " + startingNumber;
  
    // Set the ending number based on the starting number
    var endingNumbers;
    if (startingNumber === 2) {
      endingNumbers = [0, 1, 2, 3, 4, 5];
    } else if (startingNumber === 3) {
      endingNumbers = [0, 1.0, 1.3333333333333333, 3.0];
    } else if (startingNumber === 4) {
      endingNumbers = [0.0, 1.0, 0.5, 3.0, 1.75];
    } else if (startingNumber === 5) {
      endingNumbers = [0.8, 0, 1.0, 3];
    } else if (startingNumber === 6) {
      endingNumbers = [0, 1.0, 1.5, 3.0, -0.5, 5.0, 6.5, 6];
    } else if (startingNumber === 7) {
      endingNumbers = [0, 1.0, 2.0];
    } else if (startingNumber === 8) {
      endingNumbers = [0, 1.0, 4096, 2.0];
    } else if (startingNumber === 9) {
      endingNumbers = [0, 1.0, 2.0];
    }
  
    // Generate a random index to select an ending number from the array
    var randomIndex = Math.floor(Math.random() * endingNumbers.length);
    var endingNumber = endingNumbers[randomIndex];
    endingNumberElement.textContent = "desired number: " + endingNumber;
  
    updateCurrentNumber();
  
    // Start the timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  
    // Get the current date
    var currentDate = new Date().toLocaleDateString();
    var storedDate = localStorage.getItem("leaderboardDate");
  
    if (currentDate !== storedDate) {
      // Clear the leaderboard if it's a new day
      var leaderboardList = document.getElementById("leaderboardList");
      leaderboardList.innerHTML = "";
  
      // Store the current date in local storage
      localStorage.setItem("leaderboardDate", currentDate);
    }
  }

  function updateTimer() {
    endTime = Date.now();
    var timeDiff = (endTime - startTime) / 1000;
    var timerElement = document.getElementById("timer");
    timerElement.textContent = "Time elapsed: " + timeDiff.toFixed(2) + " seconds";
  }

  function updateLeaderboard(time) {
    var leaderboardList = document.getElementById("leaderboardList");
    var listItem = document.createElement("li");

    // Generate a random user name
    var userName = "User" + Math.floor(Math.random() * 100000);

    // Set the leaderboard entry text
    listItem.textContent = userName + ": " + time.toFixed(2) + " seconds";
    leaderboardList.appendChild(listItem);
  }

  // Attach the startGame event listener to the start button
  document.getElementById("startButton").addEventListener("click", startGame);

  // Listen for keydown events on the document
  document.addEventListener("keydown", function(event) {
    // Check if the key pressed is "+", "-", "x", or "/"
    var symbol = "";
    if (event.key === "=") {
      symbol = "+";
    } else if (event.key === "-") {
      symbol = "-";
    } else if (event.key === "x") {
      symbol = "x";
    } else if (event.key === "/") {
      symbol = "/";
    }

    if (symbol) {
      for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        if (!slot.querySelector(".slot-image")) {
          var image = document.createElement("div");
          image.textContent = symbol;
          image.className = "slot-image";
          image.style.fontSize = "40px";
          slot.appendChild(image);
  
          // Set the background color based on the symbol
          if (symbol === "x") {
            slot.style.backgroundColor = "rgb(232, 232, 90)";
          } else if (symbol === "+") {
            slot.style.backgroundColor = "rgb(130, 255, 130)";
          } else if (symbol === "-") {
            slot.style.backgroundColor = "rgb(255, 120, 120)";
          } else if (symbol === "/") {
            slot.style.backgroundColor = "rgb(58, 58, 58)";
          }
  
          break;
        }
      }
      updateCurrentNumber();
    }

    // Check if the key pressed is "Delete" or "Backspace"
    if (event.key === "Delete" || event.key === "Backspace") {
      for (var i = slots.length - 1; i >= 0; i--) {
        var slot = slots[i];
        var image = slot.querySelector(".slot-image");
        if (image) {
          slot.removeChild(image);
          slot.style.backgroundColor = ""; // Clear the background color
          break;
        }
      }
      updateCurrentNumber();
    }
  });
});
