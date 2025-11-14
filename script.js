const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'styles.css';
document.head.appendChild(link);

fetch('./shared.html')
  .then(response => response.text())
  .then(data => {
    const currentPath = window.location.pathname;
    let currentPage = currentPath === '/' || currentPath === '' ? 'index.html' : currentPath.split('/').pop();
    currentPage = currentPage.endsWith('.html') ? currentPage : currentPage + '.html';
    const canHover = window.matchMedia('(hover: hover)').matches;
    const computedStyle = getComputedStyle(document.documentElement);
    appendTemplate(data);
    insertInfo(computedStyle);
    flagActive(currentPage);
    addDropdownListeners(canHover);
    addLinkListeners(currentPage, canHover);
    addWideImgBorders(computedStyle);
    document.documentElement.classList.add('styles-loaded');
    observeNav();
    const incomingSection = getQueryParam(window.location.href, 'section');
    if (incomingSection) setTimeout(() => {scrollToSection(incomingSection);}, 200);
  })
  .catch(error => console.error('Error loading template:', error));
function appendTemplate(data) {
  const templateDoc = new DOMParser().parseFromString(data, 'text/html');
  const templateHead = templateDoc.querySelector('template#head').content
  document.head.appendChild(templateHead.cloneNode(true));
  const templateHeader = templateDoc.querySelector('template#header').content;
  document.getElementById('header-shared').appendChild(templateHeader.cloneNode(true));
  const templateContact = templateDoc.querySelector('template#contact').content
  document.getElementById('contact-shared').appendChild(templateContact.cloneNode(true));
}
function insertInfo(computedStyle) {
  const areaCode = computedStyle.getPropertyValue('--area-code').slice(1, -1);
  const phoneNumber = computedStyle.getPropertyValue('--phone-number').slice(1, -1);
  const fullPhoneNumber = areaCode + phoneNumber;
  const email = computedStyle.getPropertyValue('--email').slice(1, -1);
  const address1 = computedStyle.getPropertyValue('--address-1').slice(1, -1);
  const address2 = computedStyle.getPropertyValue('--address-2').slice(1, -1);
  const address3 = computedStyle.getPropertyValue('--address-3').slice(1, -1);
  const webUrl = computedStyle.getPropertyValue('--webUrl').slice(1, -1);
  const aireStoreUrl = computedStyle.getPropertyValue('--store-aire-url').slice(1, -1);
  const revianStoreUrl = computedStyle.getPropertyValue('--store-revian-url').slice(1, -1);
  let i;
  let l;
  const phoneLinks = document.getElementsByClassName('phoneLink');
  l = phoneLinks.length;
  for (i=0; i<l; i++) {phoneLinks[i].href = 'tel:' + fullPhoneNumber;}
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
  const address3Spans = document.getElementsByClassName('address-3');
  l = address3Spans.length;
  for (i=0; i<l; i++) {address3Spans[i].textContent = address3;}
  const webUrlSpans = document.getElementsByClassName('webUrl');
  l = webUrlSpans.length;
  for (i=0; i<l; i++) {webUrlSpans[i].textContent = webUrl;}
  const webUrlLinks = document.getElementsByClassName('webUrlLink');
  l = webUrlLinks.length;
  for (i=0; i<l; i++) {webUrlLinks[i].href = `https://${webUrl}`;}
  const aireUrlLinks = document.getElementsByClassName('store-aire');
  l = aireUrlLinks.length;
  for (i=0; i<l; i++) {aireUrlLinks[i].href = aireStoreUrl;}
  const revianUrlLinks = document.getElementsByClassName('store-revian');
  l = revianUrlLinks.length;
  for (i=0; i<l; i++) {revianUrlLinks[i].href = revianStoreUrl;}
}
function flagActive(currentPage) {
  const navLinks = document.querySelectorAll('ul.parent-ul > li > a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hrefBase = getHrefBase(href);
    if (hrefBase === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      link.parentElement.classList.add('no-pipe');
    }
  });
}
function getHrefBase(href) {
  return href.split('?')[0];
}
function addDropdownListeners(canHover) {
  const dropdownParents = document.querySelectorAll('.dropdown-parent');
  dropdownParents.forEach(parent => {
    const dropdownContainer = parent.querySelector('.dropdown-container');
    if (dropdownContainer) {
      if (canHover) {
        parent.addEventListener('mouseenter', () => {open(dropdownContainer);});
        parent.addEventListener('mouseleave', () => {close(dropdownContainer);});
      } else parent.addEventListener('click', (evt) => {
        if (evt.target.parentElement === parent && !dropdownContainer.classList.contains('open')) {
          evt.preventDefault();
          dropdownParents.forEach(otherParent => {
            const otherDropdown = otherParent.querySelector('.dropdown-container');
            if (otherDropdown && otherDropdown !== dropdownContainer) close(otherDropdown);
          });
          open(dropdownContainer);
        }
      });
    }
  });
  function open(dropdownContainer) {
    dropdownContainer.classList.add('open');
    if (!dropdownContainer.classList.contains('force-left')) {
      const rect = dropdownContainer.getBoundingClientRect();
      const overflowRight = rect.right - document.documentElement.clientWidth;
      console.log(rect.right + ', ' + document.documentElement.clientWidth + ', ' + overflowRight);
      if (overflowRight > 0) dropdownContainer.classList.add('dropdown-right');
    }
  }
  function close(menu) {menu.classList.remove('open');}
}
function addLinkListeners(currentPage, canHover) {
  document.querySelectorAll('a[href*="?section="]').forEach(link => {
    link.addEventListener('click', (evt) => {
      const href = link.getAttribute('href');
      const section = getQueryParam(href, 'section');
      const hrefBase = getHrefBase(href);
      if (hrefBase === currentPage) {
        evt.preventDefault();
        if (section) scrollToSection(section);
        if (!canHover) link.parentElement.parentElement.parentElement.classList.remove('open');
      }
    });
  });
}
function getQueryParam(url, param) {
  const params = new URLSearchParams(url.split('?')[1] || '');
  return params.get(param);
}
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const header = document.querySelector('#header-shared');
    const offset = header ? header.offsetHeight : 0;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const topToScroll = elementPosition - offset;
    window.scrollTo({
      top: topToScroll,
      behavior: 'smooth'
    });
  }
}
function addWideImgBorders(computedStyle) {
  const firstWideImg = document.querySelector('.wideImg');
  if (firstWideImg) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = viewportWidth / viewportHeight;
    const minThickness = 0;
    const maxThickness = firstWideImg.getBoundingClientRect().left;
    const images = document.querySelectorAll('.wideImg');
    images.forEach(img => {
      let borderWidth;
      if (aspectRatio > 2) borderWidth = maxThickness;
      else if (aspectRatio < 0.5) borderWidth = minThickness;
      else {
          const slope = (maxThickness - minThickness) / (2 - 0.5);
          borderWidth = minThickness + slope * (aspectRatio - 0.5);
      }
      img.style.borderLeftWidth = `${borderWidth}px`;
      img.style.borderRightWidth = `${borderWidth}px`;
      if (img.dataset.color) img.style.setProperty('--wide-img-avg', img.dataset.color);
    });
  }
}
function observeNav() {
  const decoration = document.getElementById('nav-decoration');
  const spacer = document.getElementById('shrinking-spacer');
  const nav1 = document.getElementById('nav-shared1');
  const nav2 = document.getElementById('nav-shared2');
  const ul1 = document.getElementById('ul_nav1');
  const ul2 = document.getElementById('ul_nav2');
  let nav1MinWidth;
  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const target = entry.target;
      const width = entry.contentRect.width;
      if (target === spacer && width === 0) {
        observer.unobserve(spacer);
        nav1MinWidth = nav1.offsetWidth + 1;
        const allLi1 = ul1.querySelectorAll('#ul_nav1 > li');
        const liToMove = Array.from(allLi1).slice(4);
        liToMove.forEach(li => ul2.appendChild(li));
        nav1.className = 'nav1-background-gradient';
        decoration.style.display = 'block';
        nav2.style.display = 'flex';
        document.documentElement.style.setProperty('--nav2-offset', 'var(--nav-height)');
        requestAnimationFrame(() => {observer.observe(nav1);});
      } else if (target === nav1 && width > nav1MinWidth) {
        observer.unobserve(nav1);
        nav1.className = 'nav1-background-solid';
        nav2.style.display = decoration.style.display = 'none';
        document.documentElement.style.setProperty('--nav2-offset', '0px');
        const allLi2 = ul2.querySelectorAll('#ul_nav2 > li');
        allLi2.forEach(li => ul1.appendChild(li));
        requestAnimationFrame(() => {observer.observe(spacer);});
      } else if (target === nav1) {
        const nav1Rect = nav1.getBoundingClientRect();
        const nav2Rect = nav2.getBoundingClientRect();
        Object.assign(decoration.style, {
          top: `${nav2Rect.top}px`,
          left: `${nav2Rect.left}px`
        });
        const decorationRot = Math.atan2((nav1Rect.top - nav2Rect.top), nav2Rect.width);
        decoration.style.transform = `rotate(${decorationRot}rad)`;
        decoration.style.height = `${nav1Rect.height / Math.cos(decorationRot)}px`;
      }
    }
  });
  observer.observe(spacer);
}