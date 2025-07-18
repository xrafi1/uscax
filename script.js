// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

const toggleMenu = () => {
    document.body.classList.toggle('nav-active');
    mainNav.classList.toggle('active');
    if (mainNav.classList.contains('active')) {
        document.body.classList.add('body-no-scroll');
    } else {
        document.body.classList.remove('body-no-scroll');
    }
};

menuToggle.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// --- Utility Functions ---
function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('form-messages');
    messagesDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
    setTimeout(() => {
        messagesDiv.innerHTML = '';
    }, 5000);
}

function setFormLoading(loading) {
    const form = document.getElementById('joinForm');
    const submitBtn = document.getElementById('submit-btn');
    
    if (loading) {
        form.classList.add('loading');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
    } else {
        form.classList.remove('loading');
        submitBtn.textContent = 'Submit Application';
        submitBtn.disabled = false;
    }
}

// --- Form Submission Handler ---
document.getElementById('joinForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        formType: 'join',
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        college: document.getElementById('college').value,
        timestamp: new Date().toISOString()
    };

    setFormLoading(true);

    // For local testing without Google Apps Script
    console.log('Form data to be submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
        setFormLoading(false);
        showMessage('Thank you for your submission! (Demo message - in production this would connect to Google Sheets)', 'success');
        document.getElementById('joinForm').reset();
    }, 1500);
});

// --- Fetch Contact Info ---
function fetchContactInfo() {
    // For local testing without Google Apps Script
    const sampleContacts = [
        {
            name: "John Doe",
            role: "President",
            email: "president@usca.org",
            phone: "+91 9876543210"
        },
        {
            name: "Jane Smith",
            role: "Secretary",
            email: "secretary@usca.org",
            phone: "+91 9876543211"
        }
    ];
    
    const contactDiv = document.getElementById('contact-info');
    contactDiv.innerHTML = '';
    sampleContacts.forEach(contact => {
        contactDiv.innerHTML += `
            <p style="margin-bottom: 1rem;">
                <strong>${contact.name}</strong> (${contact.role})<br>
                Email: <a href="mailto:${contact.email}">${contact.email}</a><br>
                Phone: <a href="tel:${contact.phone}">${contact.phone}</a>
            </p>
        `;
    });
}

// --- Initialize on page load ---
document.addEventListener('DOMContentLoaded', function() {
    fetchContactInfo();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
