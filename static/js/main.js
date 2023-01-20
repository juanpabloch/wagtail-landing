const highlightIndicatorsTemplate = (index) => {
  let template = `   <li
    data-target="#carouselExampleIndicators"
    data-slide-to="${index}"
    class="${index === 0 ? "active" : ""}"
  ></li>`;
  return template;
};

const highlightTemplate = (highlight, index) => {
  let { title, body, button, href, imgUrl,id } = highlight;

  let template = `
    <div data-id='${id}' class="carousel-item ${index + 1 === 1 ? "active" : ""}">
                <div class="highlight-carousel-card">
                  <div class="highlight-carousel-card__image">
                  <img src="${imgUrl}" 
                    data-img='${imgUrl}'
                    class="card-img-top"
                    style='object-fit:cover;'
                    alt="Sorry! Image not available at this time" 
                    onError="this.onerror=null;this.src='${base_url}assets/images/default.svg';">
                  </div>
                  <div class="highlight-carousel-card__content">
                    <h2>${title}</h2>
                    <p>
                     ${body}
                    </p>
                    <a href="${href}" target="_blank" onclick="gtag('event', 'click', {event_label: '${title}', event_category:'highlight'})" class="btn btn-zendesk-card">
                      ${button === '' ? 'See' : button}</a>
                  </div>
                </div>
              </div>
    `;

  return template;
};

const sectionTemplate = (section) => {
    let { title, body, button, href, imgUrl, id } = section;
    let template = `<div data-id='${id}' class="card card-zendesk" >
    <a
        href="${href}"
        target="_blank"
        class="img_link"
        onclick="gtag('event', 'click', {event_label: '${title}', event_category:'sections'})"
        >
    <img src="${imgUrl}" 
                    data-img='${imgUrl}'
                    class="card-img-top"
                    style='object-fit:cover;'
                    alt="Sorry! Image not available at this time" 
                    onError="this.onerror=null;this.src='${base_url}assets/images/default.svg';">
                    </a>
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        ${body}
      </p>
      <a
        href="${href}"
        target="_blank"
        class="btn btn-zendesk-card"
        onclick="gtag('event', 'click', {event_label: '${title}', event_category:'sections'})"
        >${button}</a
      >
    </div>
  </div>`

  return template
}
const fetchHighlights = async () => {
  return await fetch(`${base_url}get_highlights`,{ 
    method: 'GET'
  }).then(res => res.json())
  .then(highlights => {
      if( highlights.status == 200 ){
        return highlights.data;
      }else{
        return [];
      }
  })
};

const fetchSections = async () => {
  return await fetch(`${base_url}get_sections`,{ 
    method: 'GET'
  }).then(res => res.json())
  .then(sections => {
      if( sections.status == 200 ){
        return sections.data;
      }else{
        return [];
      }
  })
};

const getHighlights = async () => {
  let highlightsList = document.querySelector(".carousel-inner");
  let highlightListIndicators = document.querySelector(".carousel-indicators");

  fetchHighlights().then(async (highlights) => {
    highlightsList.innerHTML = "";
    await highlights.map((highlight, index) => {
      highlightsList.innerHTML += highlightTemplate(highlight, index);
      highlightListIndicators.innerHTML += highlightIndicatorsTemplate(index);
    });
  }).catch(err =>{
      highlightsList.innerHTML = 'Error al traer los highlights'
  });
};

const getSections = async () => {
    // let gridCards = document.querySelector('.grid-cards_horizontal_carousel')
    let gridCards = document.querySelector('.grid-cards')
    gridCards.innerHTML = ''
    fetchSections().then(async (sections) => {
        await sections.map(section => gridCards.innerHTML += sectionTemplate(section))
    }).catch(err => {
        gridCards.innerHTML = `Error al traer las secciones`
    })

}



const CardsCarousel = async () => {
  let gridCards = await document.querySelector('.grid-cards_horizontal_carousel')
  let controlLeft = document.querySelector('#carousel-control-left')
  let controlRight = document.querySelector('#carousel-control-right')

  
  const scrollToLeft = async () => {
    let gridCards = await document.querySelector('.grid-cards_horizontal_carousel')
    let cardDimesions = await document.querySelector('.card-zendesk') 
    cardDimesions = cardDimesions.offsetWidth + 48
    gridCards.scrollBy({left: -cardDimesions , behavior:'smooth'})
  }

  const scrollToRight = async () => {
    let gridCards = await document.querySelector('.grid-cards_horizontal_carousel')
    let cardDimesions = await document.querySelector('.card-zendesk')  
    cardDimesions = cardDimesions.offsetWidth + 32
    gridCards.scrollBy({left: +cardDimesions, behavior:'smooth'})
  }
  const scrollToLeftEdgeCompatible = async () => {
    let gridCards = await document.querySelector('.grid-cards_horizontal_carousel')
    let cardDimesions = await document.querySelector('.card-zendesk') 
    cardDimesions = cardDimesions.offsetWidth + 48
    gridCards.scrollLeft -= cardDimesions
  }

  const scrollToRightEdgeCompatible = async () => {
    let gridCards = await document.querySelector('.grid-cards_horizontal_carousel')
    let cardDimesions = await document.querySelector('.card-zendesk')  
    cardDimesions = cardDimesions.offsetWidth + 32
    gridCards.scrollLeft += cardDimesions
  }
  // Soporte para edge
  if (/Edge/.test(navigator.userAgent)) {
    controlLeft.addEventListener('click', scrollToLeftEdgeCompatible)
    controlRight.addEventListener('click', scrollToRightEdgeCompatible)
  }else{
    controlLeft.addEventListener('click', scrollToLeft)
    controlRight.addEventListener('click', scrollToRight)
  }

  // Funcionalidad de arrastre para el carousel
  gridCards.addEventListener('mousedown', (e) => {
    isDown = true;
    gridCards.classList.add('active');
    startX = e.pageX - gridCards.offsetLeft;
    scrollLeft = gridCards.scrollLeft;
  });

  gridCards.addEventListener('mouseleave', () => {
    isDown = false;
    gridCards.classList.remove('active');
  });
  
  gridCards.addEventListener('mouseup', () => {
    isDown = false;
    gridCards.classList.remove('active');
  });

  gridCards.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - gridCards.offsetLeft;
    const walk = (x - startX) * 1; //scroll-fast
    gridCards.scrollLeft = scrollLeft - walk;
  });
  

  gridCards.addEventListener('scroll',()=>{
    if(gridCards.scrollLeft + gridCards.offsetWidth >= gridCards.scrollWidth){
      controlRight.style.visibility = 'hidden'
    }else{
      controlRight.style.visibility = 'visible' 
    }
  })
}

const navbar = () =>{
  const navbarBtn = document.querySelector('.navbar-mobile-btn')
  const navbarMenu = document.querySelector('.navbar-links')
  const dropDowns = document.querySelectorAll('.has-dropdown')

  // Toggle navbar en mobile
  navbarBtn.addEventListener('click',(e) =>{
    navbarMenu.classList.toggle('openNav')
  })

  // Toggle dropdowns en mobile
  dropDowns.forEach(drop => {
    let arrow = drop.querySelector('.arrow-btn-mobile-navbar')
    arrow.addEventListener('click',(e)=>{
      let parentDrodDown = e.target.parentNode.parentNode
      parentDrodDown.classList.toggle('openDrop')
    })
  })
}

setTrackingAnalyticsFooter = () => {
  let linksFooter = document.querySelectorAll(".global-footer a")

  linksFooter.forEach(link => link.addEventListener('click',(e)=>{gtag('event', 'click', {event_label: e.target.textContent, event_category:'footer'})}))
}

window.onload = async () => {
  //await getHighlights();
  //await getSections();
  await navbar()
  await setTrackingAnalyticsFooter()
  // await CardsCarousel()
};
