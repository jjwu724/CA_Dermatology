fetch('./shared.html')
  .then(response => response.text())
  .then(data => {
    const templateDoc = new DOMParser().parseFromString(data, 'text/html');
    const templateHead = templateDoc.querySelector('template#head').content
    document.head.appendChild(templateHead.cloneNode(true));
    const templateHeader = templateDoc.querySelector('template#header').content;
    document.getElementById('header-shared').appendChild(templateHeader.cloneNode(true));
    const templateNav = templateDoc.querySelector('template#nav').content;
    document.getElementById('nav-shared').appendChild(templateNav.cloneNode(true));
    const currentPage = window.location.pathname.split('/').pop();// Get current page name
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    const computedStyle = getComputedStyle(document.documentElement);
    const areaCode = computedStyle.getPropertyValue('--area-code');
    const phoneNumber = computedStyle.getPropertyValue('--phone-number');
    const fullPhoneNumber = areaCode + phoneNumber;
    document.getElementById('phoneLink').href = "tel:" + fullPhoneNumber;
    document.getElementById('areaCodeDisplay').textContent = areaCode;
    document.getElementById('phoneNumberDisplay').textContent = phoneNumber;
  })
  .catch(error => console.error('Error loading template:', error));