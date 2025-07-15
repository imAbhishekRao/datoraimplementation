
document.addEventListener('DOMContentLoaded', () => {
    function hbBetCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const getDiscountCode = hbBetCookie('discount_code');

    if(getDiscountCode) {

        const encodeTag = document.querySelector('[js-hb-badge-list]');

        if(encodeTag) {
          const encodeText = encodeTag.innerHTML;
          const badgeArr = JSON.parse(atob(encodeText).replaceAll('\n', '').replaceAll(' ', ''));

          const valideCode = badgeArr.filter(badge => {
            return badge.code.toLowerCase() === getDiscountCode.toLocaleLowerCase()
          })

          if(valideCode.length) {
              const valideCodeObj = valideCode[0];

              const discountValue = parseInt(valideCodeObj.value)
              const discountCode = valideCodeObj.code.toUpperCase()
              const discountType = valideCodeObj.type

               // All Product Grid
              document.querySelectorAll('.product-item-meta__price-list-container').forEach((priceWrapper) => {
                    let originalPrice = parseFloat(priceWrapper?.querySelector('.price--highlight .transcy-money')?.innerText?.replace('€', '')?.replace(',', '.'))

                    if(!originalPrice ) {
                        originalPrice = parseFloat(priceWrapper?.querySelector('.price .transcy-money')?.innerText?.replace('€', '')?.replace(',', '.'))
                    }

                    const percentage = 100 - discountValue;

                    let currentPrice = ((originalPrice / 100 * percentage)).toFixed(2)
                    let discounted = `-${discountValue}%`
                    let comparePrice = originalPrice
                   

                    if(discountType === 'fixed') {
                      currentPrice = (originalPrice - discountValue).toFixed(2)
                      discounted= `-€${discountValue}`
                      comparePrice = originalPrice
                    }

                    const discountBadgeHtml = `
                    <div class="hb_discount-box">
                        <div class="price-list price-list--centered">
                            <span class="price price--highlight">
                                <span class="transcy-money" translate="no">€${currentPrice.toString().replace('.', ',').replace(',00', '')}</span>
                            </span>
                            <span class="price price--compare">
                                <span class="transcy-money" translate="no">€${comparePrice.toString().replace('.', ',').replace(',00', '')}</span>
                            </span>
                        </div>
                                
                        <div class="hb_discount-badge">
                            <span class="hb_discount-badge__icon">
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5_5540)">
                                    <path d="M2.64625 9.53626C2.55266 9.44257 2.50006 9.31557 2.5 9.18314V3.39001H8.29313C8.42556 3.39008 8.55255 3.44267 8.64625 3.53626L14.8538 9.74376C14.9474 9.83752 15.0001 9.96465 15.0001 10.0972C15.0001 10.2298 14.9474 10.3569 14.8538 10.4506L9.5625 15.7438C9.46874 15.8375 9.34161 15.8901 9.20906 15.8901C9.07651 15.8901 8.94938 15.8375 8.85563 15.7438L2.64625 9.53626Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5.25 6.89001C5.66421 6.89001 6 6.55423 6 6.14001C6 5.7258 5.66421 5.39001 5.25 5.39001C4.83579 5.39001 4.5 5.7258 4.5 6.14001C4.5 6.55423 4.83579 6.89001 5.25 6.89001Z" fill="black"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_5_5540">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.890015)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span class="hb_discount-badge__number hb_discount-badge__text">${discounted}</span>
                            <span class="hb_discount-badge__code hb_discount-badge__text">${discountCode}</span>
                        </div>
                    </div>
                    `
             
                  priceWrapper.insertAdjacentHTML('afterbegin', discountBadgeHtml)
              })


              // PDP and Product Featured Section
              document.querySelectorAll('.product-meta__price-list-container').forEach((priceWrapper) => {
                    let originalPrice = parseFloat(priceWrapper?.querySelector('.price--highlight .transcy-money')?.innerText?.replace('€', '')?.replace(',', '.'))

                    if(!originalPrice ) {
                        originalPrice = parseFloat(priceWrapper?.querySelector('.price .transcy-money')?.innerText?.replace('€', '')?.replace(',', '.'))
                    }

                    const percentage = 100 - discountValue;

                    let currentPrice = ((originalPrice / 100 * percentage)).toFixed(2)
                    let discounted = `-${discountValue}%`
                    let comparePrice = originalPrice
                   

                    if(discountType === 'fixed') {
                      currentPrice = (originalPrice - discountValue).toFixed(2)
                      discounted= `-€${discountValue}`
                      comparePrice = originalPrice
                    }

                    const discountBadgeHtml = `
                    <div class="hb_discount-box">

                        <div class="price-list price-list--centered">
                            <span class="price price--highlight">
                                <span class="transcy-money" translate="no">€${currentPrice.toString().replace('.', ',').replace(',00', '')}</span>
                            </span>
                            <span class="price price--compare">
                                <span class="transcy-money" translate="no">€${comparePrice.toString().replace('.', ',').replace(',00', '')}</span>
                            </span>
                        </div>
                                
                        <div class="hb_discount-badge">
                            <span class="hb_discount-badge__icon">
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_5_5540)">
                                    <path d="M2.64625 9.53626C2.55266 9.44257 2.50006 9.31557 2.5 9.18314V3.39001H8.29313C8.42556 3.39008 8.55255 3.44267 8.64625 3.53626L14.8538 9.74376C14.9474 9.83752 15.0001 9.96465 15.0001 10.0972C15.0001 10.2298 14.9474 10.3569 14.8538 10.4506L9.5625 15.7438C9.46874 15.8375 9.34161 15.8901 9.20906 15.8901C9.07651 15.8901 8.94938 15.8375 8.85563 15.7438L2.64625 9.53626Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5.25 6.89001C5.66421 6.89001 6 6.55423 6 6.14001C6 5.7258 5.66421 5.39001 5.25 5.39001C4.83579 5.39001 4.5 5.7258 4.5 6.14001C4.5 6.55423 4.83579 6.89001 5.25 6.89001Z" fill="black"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_5_5540">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.890015)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span class="hb_discount-badge__number hb_discount-badge__text">Du sparst ${discounted}</span>
                            <span class="hb_discount-badge__code hb_discount-badge__text">mit Code: ${discountCode}</span>
                        </div>
                    </div>
                    `
             
                  priceWrapper.insertAdjacentHTML('afterbegin', discountBadgeHtml)

              })
          }
  
        }
    }
})