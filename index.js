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
        // Ensure that the URL and method are correct
        const response = await fetch("https://script.google.com/macros/s/AKfycbwer05kcjwx3AxbghSg_eNJD6pcihLC5T9s80iWzbwgQkGAXfPBVn6-ypmTJXx63d-m/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data).toString(), // Ensures the data is in the right format
        });

        const result = await response.text();
        console.log(result);  // You should see the result message from the Apps Script
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
