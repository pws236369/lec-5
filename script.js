// At the end of script.js, add the event listener for the button
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('getSubscriptionButton');
  button.addEventListener('click', getSubscription);
});

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
