const scheduleDiv = document.getElementById('schedule');
    const semesterButton = document.getElementById('semesterButton');
    const dayButton = document.getElementById('dayButton');
    const dayMenu = document.getElementById('dayMenu');
    const semesterModal = document.getElementById('semesterModal');
    const closeModalButton = document.querySelector('.modal-content button');
    
    let selectedDay = 'Today'; // Default value is 'Today'

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUmh3soFvFzIKWw8EKZIHECxQDSXbCiV1OMK7Nc3T8VpBbVnfRLm5hE-y9TK9idgObyMHPvTYZVInR/pub?output=tsv';

    // Update date and time
    function updateDateTime() {
      const now = new Date();
      const time = now.toLocaleTimeString();
      const date = now.toLocaleDateString();
      const dateTimeString = `${date} - ${time}`;
      document.getElementById('date-time').innerText = dateTimeString;
      document.getElementById('last-synced').innerText = `Last Synced: ${time}`;
    }

    // Fetch schedule for selected day
    function fetchSchedule(day = selectedDay) {
      fetch(sheetUrl)
        .then(response => {
          if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
          return response.text();
        })
        .then(data => {
          const rows = data.split('\n');
          scheduleDiv.innerHTML = ''; // Clear previous schedule
          let isDark = true;
          rows.forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const cols = row.split('\t');
            if (cols.length < 7) return;
            if (cols[6].trim() === day || (day === 'Today' && cols[6].trim() === new Date().toLocaleString('en-US', { weekday: 'long' }))) {
              const scheduleContainer = document.createElement('div');
              scheduleContainer.classList.add('schedule-container', isDark ? 'dark' : 'yellow');
              scheduleContainer.innerHTML = `
                <h3>Time: ${cols[0]}</h3>
                <p>Course: ${cols[1]}</p>
                <p>Teacher: ${cols[2]}</p>
                <p>Room: ${cols[3]}</p>
                ${cols[4].trim() ? `<p>Special Note: ${cols[4]}</p>` : ''}
                ${cols[5].trim() ? `<p><strong>Important Link:</strong> <a href="${cols[5].trim()}" target="_blank" class="important-link">${cols[5].trim().slice(0, 30)}...</a></p>` : ''}
              `;
              scheduleDiv.appendChild(scheduleContainer);
              isDark = !isDark; // Alternate between dark and yellow backgrounds
            }
          });
        })
        .catch(error => console.error('Error fetching or processing data:', error));
    }

    // Select day and update the button text
    function selectDay(day) {
      selectedDay = day;
      dayButton.innerText = `Select Day: ${day}`;
      dayMenu.style.display = 'none'; // Hide the menu after selection
      fetchSchedule(day);
    }

    // Open semester modal
    semesterButton.addEventListener('click', () => {
      semesterModal.style.display = 'flex';
    });
// Close the day menu
function closeDayMenu() {
  dayMenu.style.display = 'none';
}

    // Close the modal
    function closeModal() {
      semesterModal.style.display = 'none';
    }

    // Event listener to open day menu
    dayButton.addEventListener('click', () => {
      if (dayMenu.style.display === 'none' || dayMenu.style.display === '') {
        dayMenu.style.display = 'block'; // Show the menu on first click
      } else {
        dayMenu.style.display = 'none'; // Hide the menu if it's already visible
      }
    });

    // Initialize schedule and update date-time
    updateDateTime();
    fetchSchedule();
    setInterval(updateDateTime, 60000); // Update every minute