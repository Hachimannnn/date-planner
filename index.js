// Step navigation
function nextStep(step) {
    console.log('nextStep called for step:', step);
    if (step === 1) {
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (!date || !startTime || !endTime) {
            showModal("Please fill the date and time!");
            return;
        }
    }

    if (step === 2) {
        const selectedSpot = document.querySelector('.option.selected');
        if (!selectedSpot) {
            showModal("Please choose a photobooth spot!");
            return;
        }
    }

    if (step === 3) {
        const yesButton = document.getElementById('yesBtn');
        const noButton = document.getElementById('noBtn');
        if (!yesButton.classList.contains('selected') && !noButton.classList.contains('selected')) {
            showModal("Please choose an option!");
            return;
        }

        if (yesButton.classList.contains('selected')) {
            const activityTextarea = document.getElementById('activity-textarea').value.trim();
            if (!activityTextarea) {
                showModal("You have to write something!");
                return;
            }
        }
        populateFinalStep();
    }

    const currentStep = document.querySelector('.step.active');
    if (!currentStep) {
        console.error("No active step found.");
        return;
    }

    currentStep.classList.remove('active'); 
    const nextStep = document.getElementById(`step${step + 1}`);
    
    if (!nextStep) {
        console.log("No further steps available.");
        return;
    }

    nextStep.classList.add('active'); 
}

// Photobooth spot selection
function selectSpot(element) {
    document.querySelectorAll('.option').forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
}

// "Yes" or "No" selection 
function selectButton(choice) {
    const yesButton = document.getElementById('yesBtn');
    const noButton = document.getElementById('noBtn');
    const activityInput = document.getElementById('activity-input');

    yesButton.classList.remove('selected');
    noButton.classList.remove('selected');

    if (choice === 'yes') {
        yesButton.classList.add('selected');
        activityInput.classList.add('open'); 
    } else {
        noButton.classList.add('selected');
        activityInput.classList.remove('open'); 
    }
}

// Time format
function formatTimeTo12Hour(time) {
    const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
    const isAM = hour < 12;
    const formattedHour = hour % 12 || 12; 
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const period = isAM ? 'AM' : 'PM';
    return `${formattedHour}:${formattedMinute} ${period}`;
}

// Populate final step 
function populateFinalStep() {
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const selectedSpot = document.querySelector('.option.selected button')?.textContent || "No spot selected";
    const additionalActivity = document.getElementById('yesBtn').classList.contains('selected')
        ? document.getElementById('activity-textarea').value.trim() || "No activity specified"
        : "No additional activity";

    const formattedStartTime = formatTimeTo12Hour(startTime);
    const formattedEndTime = formatTimeTo12Hour(endTime);

    const summaryHTML = `
        <h3>Your Date Details:</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
        <p><strong>Photobooth Spot:</strong> ${selectedSpot}</p>
        <p><strong>Additional Activity:</strong> ${additionalActivity}</p>
    `;

    document.getElementById('date-info').innerHTML = summaryHTML;
}

// Modal handling
function showModal(message) {
    const popupMessage = document.getElementById('popup-message');
    const modal = document.getElementById('popup-modal');
    popupMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('popup-modal').style.display = 'none';
}

// Reset form and send data to Google Sheets
async function resetForm() {
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const selectedSpot = document.querySelector('.option.selected button')?.textContent || "No spot selected";
    const additionalActivity = document.getElementById('yesBtn').classList.contains('selected')
        ? document.getElementById('activity-textarea').value.trim() || "No activity specified"
        : "No additional activity";

    const data = {
        date: date,
        startTime: startTime,
        endTime: endTime,
        spot: selectedSpot,
        activity: additionalActivity
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwa75os0rUTpaSYsdr49SX1i1gayFOoEvtSV-mlldX0au-L4VLVuvx6jcNMbrTNvRiD/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data).toString(), 
        });

        const result = await response.text();
        console.log(result);  
        
        // Handle thank you modal and reset
        const thankYouModal = document.getElementById('thank-you-modal');
        thankYouModal.style.display = 'flex';

        setTimeout(() => {
            thankYouModal.style.display = 'none';
            document.getElementById('date-form').reset();
            
            const steps = document.querySelectorAll('.step');
            steps.forEach(step => step.classList.remove('active'));
            
            document.getElementById('step1').classList.add('active');
            document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
            document.getElementById('yesBtn').classList.remove('selected');
            document.getElementById('noBtn').classList.remove('selected');
            document.getElementById('activity-input').style.display = 'none';
            document.getElementById('popup-modal').style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error("Error:", error);
        alert("There was an error submitting your response.");
    }
}

// Close Thank You modal
function closeThankYouModal() {
    document.getElementById('thank-you-modal').style.display = 'none';
}
