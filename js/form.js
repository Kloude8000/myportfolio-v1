/* ============================
   FORM.JS - Contact Form Handling
   ============================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  // Get form elements
  const formElements = contactForm.elements;
  const nameInput = formElements['name'];
  const emailInput = formElements['email'];
  const messageInput = formElements['message'];
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const statusMessage = contactForm.querySelector('.form-status');

  // Reset previous errors
  clearErrors();

  // Validate form
  const isValid = validateForm(nameInput, emailInput, messageInput);

  if (!isValid) {
    return;
  }

  // Disable submit button and show loading state
  submitButton.disabled = true;
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Sending...';

  // Get form data
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };

  try {
    // Using Formspree (free email service)
    const response = await fetch('https://formspree.io/f/mpqeagln', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // Show success message
    showSuccessMessage(statusMessage);

    // Reset form
    contactForm.reset();

    // Scroll to status message
    statusMessage.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(statusMessage, 'Failed to send message. Please try again later.');
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

function validateForm(nameInput, emailInput, messageInput) {
  let isValid = true;

  // Validate name
  if (!nameInput.value.trim()) {
    showFieldError(nameInput, 'Name is required');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    showFieldError(nameInput, 'Name must be at least 2 characters');
    isValid = false;
  }

  // Validate email
  if (!emailInput.value.trim()) {
    showFieldError(emailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showFieldError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }

  // Validate message
  if (!messageInput.value.trim()) {
    showFieldError(messageInput, 'Message is required');
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    showFieldError(messageInput, 'Message must be at least 10 characters');
    isValid = false;
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(input, errorMessage) {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.error-message');

  formGroup.classList.add('error');
  errorElement.textContent = errorMessage;
}

function clearErrors() {
  contactForm.querySelectorAll('.form-group.error').forEach(group => {
    group.classList.remove('error');
    const errorElement = group.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

function showSuccessMessage(statusElement) {
  statusElement.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
  statusElement.className = 'form-status success';
}

function showErrorMessage(statusElement, message) {
  statusElement.textContent = '✗ ' + message;
  statusElement.className = 'form-status error';
}

function simulateFormSubmission() {
  // Simulates an async operation (like an API call)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

