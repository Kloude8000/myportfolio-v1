/* ============================
   FORM.JS - Contact Form Handling
   ============================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formElements = contactForm.elements;
  const nameInput = formElements['name'];
  const emailInput = formElements['email'];
  const subjectInput = formElements['subject'];
  const messageInput = formElements['message'];
  const honeypotInput = formElements['_gotcha'];
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const statusMessage = contactForm.querySelector('.form-status');

  clearErrors();
  statusMessage.className = 'form-status';
  statusMessage.textContent = '';

  if (honeypotInput && honeypotInput.value.trim()) {
    return;
  }

  const isValid = validateForm(nameInput, emailInput, subjectInput, messageInput);

  if (!isValid) {
    return;
  }

  submitButton.disabled = true;
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Sending...';

  const subject = subjectInput.value.trim();
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subject,
    message: messageInput.value.trim(),
    _subject: `Portfolio: ${subject}`,
    _gotcha: ''
  };

  try {
    const response = await fetch('https://formspree.io/f/mpqeagln', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorDetail = data.error || 'Failed to send message. Please try again later.';
      showErrorMessage(statusMessage, errorDetail);
      return;
    }

    showSuccessMessage(statusMessage);
    contactForm.reset();
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(statusMessage, 'Failed to send message. Please try again later.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

function validateForm(nameInput, emailInput, subjectInput, messageInput) {
  let isValid = true;

  if (!nameInput.value.trim()) {
    showFieldError(nameInput, 'Name is required');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    showFieldError(nameInput, 'Name must be at least 2 characters');
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    showFieldError(emailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showFieldError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }

  if (!subjectInput.value.trim()) {
    showFieldError(subjectInput, 'Please select a subject');
    isValid = false;
  }

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
