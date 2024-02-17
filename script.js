// At the end of script.js, add the event listener for the button
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('getSubscriptionButton');
  button.addEventListener('click', getSubscription);

  // Event listeners for radio buttons
  document
    .getElementById('colorGreen')
    .addEventListener('change', changeTitleColor);
  document
    .getElementById('colorRed')
    .addEventListener('change', changeTitleColor);

  // Set the title color from the cookie when the page loads
  setTitleColorFromCookie();
});

function changeTitleColor(event) {
  const color = event.target.value;
  const pageTitle = document.getElementById('pageTitle');
  pageTitle.style.color = color;
  // Save the selected color in a cookie
  setCookie('titleColor', color, 7); // Expires in 7 days
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setTitleColorFromCookie() {
  const color = getCookie('titleColor');
  if (color) {
    const pageTitle = document.getElementById('pageTitle');
    pageTitle.style.color = color;
    // Check the corresponding radio button based on the cookie
    document.getElementById(
      `color${color.charAt(0).toUpperCase() + color.slice(1)}`
    ).checked = true;
  }
}

async function getSubscription() {
  const id = document.getElementById('subscriptionId').value;
  try {
    const response = await fetch(`/subscription/${id}`);
    const data = await response.json();
    const details = document.getElementById('subscriptionDetails');

    // Clear previous details
    Array.from(details.childNodes).forEach((child) =>
      details.removeChild(child)
    );

    if (data.message) {
      const messageElement = document.createElement('h2');
      messageElement.textContent = data.message;
      details.appendChild(messageElement);
    } else {
      const idElement = document.createElement('p');
      idElement.textContent = `Subscription ID: ${data.id}`;
      const nameElement = document.createElement('p');
      nameElement.textContent = `Customer Name: ${data.customerName}`;
      const cycleElement = document.createElement('p');
      cycleElement.textContent = `Cycle: ${data.cycle}`;

      // Append new elements to the details container
      details.appendChild(idElement);
      details.appendChild(nameElement);
      details.appendChild(cycleElement);
    }
  } catch (error) {
    console.error('Error:', error);
    const details = document.getElementById('subscriptionDetails');
    // Clear previous details
    Array.from(details.childNodes).forEach((child) =>
      details.removeChild(child)
    );
    const errorElement = document.createElement('p');
    errorElement.textContent = 'Error fetching subscription details.';
    details.appendChild(errorElement);
  }
}
