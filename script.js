fetch('./shared.html')
  .then(response => response.text())
  .then(data => {
    const templateDoc = new DOMParser().parseFromString(data, 'text/html');
    const templateHead = templateDoc.querySelector('template#head').content
    document.head.appendChild(templateHead.cloneNode(true));
    const templateHeader = templateDoc.querySelector('template#header').content;
    document.getElementById('header-shared').appendChild(templateHeader.cloneNode(true));
    const templateNav = templateDoc.querySelector('template#nav').content;
    document.getElementById('nav-container-shared').appendChild(templateNav.cloneNode(true));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            link.parentElement.classList.add('no-pip');
        }
    });
    const templateContact = templateDoc.querySelector('template#contact').content
    document.getElementById('contact-shared').appendChild(templateContact.cloneNode(true));
    const computedStyle = getComputedStyle(document.documentElement);
    const areaCode = computedStyle.getPropertyValue('--area-code').slice(1, -1);
    const phoneNumber = computedStyle.getPropertyValue('--phone-number').slice(1, -1);
    const fullPhoneNumber = areaCode + phoneNumber;
    const email = computedStyle.getPropertyValue('--email').slice(1, -1);
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
    const emailSpans = document.getElementsByClassName('email');
    l = emailSpans.length;
    for (i=0; i<l; i++) {emailSpans[i].textContent = email;}
    const emailLinks = document.getElementsByClassName('emailLink');
    l = emailLinks.length;
    for (i=0; i<l; i++) {emailLinks[i].href = `mailto:${email}`;}
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
    observeNav();
  })
  .catch(error => console.error('Error loading template:', error));

function observeNav() {
  const decoration = document.getElementById("nav-decoration");
  const spacer = document.getElementById("shrinking-spacer");
  const nav1 = document.getElementById("nav-shared1");
  const nav2 = document.getElementById("nav-shared2");
  const ul1 = document.getElementById('ul1');
  const ul2 = document.getElementById('ul2');
  let nav1MinWidth;
  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const target = entry.target;
      const width = entry.contentRect.width;
      if (target === spacer && width === 0) {
        observer.unobserve(spacer);
        nav1MinWidth = nav1.offsetWidth + 1;
        const allLi1 = ul1.querySelectorAll('li');
        const liToMove = Array.from(allLi1).slice(4);
        liToMove.forEach(li => ul2.appendChild(li));
        nav1.className = 'nav1-background-gradient';
        decoration.style.display = 'block';
        nav2.style.display = 'flex';
        requestAnimationFrame(() => {observer.observe(nav1);});
      } else if (target === nav1 && width > nav1MinWidth) {
        observer.unobserve(nav1);
        nav1.className = 'nav1-background-solid';
        nav2.style.display = decoration.style.display = 'none';
        const allLi2 = ul2.querySelectorAll('li');
        allLi2.forEach(li => ul1.appendChild(li));
        requestAnimationFrame(() => {observer.observe(spacer);});
      } else if (target === nav1) {
        const nav1Rect = nav1.getBoundingClientRect();
        const nav2Rect = nav2.getBoundingClientRect();
        Object.assign(decoration.style, {
          top: `${nav2Rect.top + window.scrollY}px`,
          left: `${nav2Rect.left + window.scrollX}px`
        });
        const decorationRot = Math.atan2((nav1Rect.top - nav2Rect.top), nav2Rect.width);
        decoration.style.transform = `rotate(${decorationRot}rad)`;
        decoration.style.height = `${nav1Rect.height / Math.cos(decorationRot)}px`;
      }
    }
  });
  observer.observe(spacer);
}