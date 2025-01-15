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
    const templateContact = templateDoc.querySelector('template#contact').content
    document.getElementById('contact-shared').appendChild(templateContact.cloneNode(true));
    const computedStyle = getComputedStyle(document.documentElement);
    const areaCode = computedStyle.getPropertyValue('--area-code').slice(1, -1);
    const phoneNumber = computedStyle.getPropertyValue('--phone-number').slice(1, -1);
    const fullPhoneNumber = areaCode + phoneNumber;
    const address1 = computedStyle.getPropertyValue('--address-1').slice(1, -1);
    const address2 = computedStyle.getPropertyValue('--address-2').slice(1, -1);
    const webUrl = computedStyle.getPropertyValue('--webUrl').slice(1, -1);
    let i;
    let l;
    const phoneLinks = document.getElementsByClassName('phoneLink');
    l = phoneLinks.length;
    for (i=0; i<l; i++) {phoneLinks[i].href = "tel:" + fullPhoneNumber;}
    const areaCodeSpans = document.getElementsByClassName('areaCode');
    l = areaCodeSpans.length;
    for (i=0; i<l; i++) {areaCodeSpans[i].textContent = areaCode;}
    const phoneNumberSpans = document.getElementsByClassName('phoneNumber');
    l = phoneNumberSpans.length;
    for (i=0; i<l; i++) {phoneNumberSpans[i].textContent = phoneNumber;}
    const address1Spans = document.getElementsByClassName('address-1');
    l = address1Spans.length;
    for (i=0; i<l; i++) {address1Spans[i].textContent = address1;}
    const address2Spans = document.getElementsByClassName('address-2');
    l = address2Spans.length;
    for (i=0; i<l; i++) {address2Spans[i].textContent = address2;}
    const webUrlSpans = document.getElementsByClassName('webUrl');
    l = webUrlSpans.length;
    for (i=0; i<l; i++) {webUrlSpans[i].textContent = webUrl;}
    const webUrlLinks = document.getElementsByClassName('webUrlLink');
    l = webUrlLinks.length;
    for (i=0; i<l; i++) {webUrlLinks[i].href = `https://${webUrl}`;}
  })
  .catch(error => console.error('Error loading template:', error));