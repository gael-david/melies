let scrollers = document.querySelectorAll('.scroller')

function scrollRight(scroller,wrapper) {
    let wrapperWidth = wrapper.offsetWidth
    wrapper.scrollLeft += wrapperWidth - (wrapperWidth % 225) - 225;
}

function scrollLeft(scroller,wrapper) {
    let wrapperWidth = wrapper.offsetWidth
    wrapper.scrollLeft -= wrapperWidth - (wrapperWidth % 225) - 225
}

function displayScrollButtons(scroller,wrapper) {
    let leftScroll = scroller.querySelector('.leftScroll')
    let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    let rightScroll = scroller.querySelector('.rightScroll')

    if (wrapper.scrollLeft !== 0) {
        leftScroll.style.visibility = "visible";
    } 
    if (wrapper.scrollLeft !== maxScrollLeft) {
        rightScroll.style.visibility = "visible";
    } 
}

function hideScrollButtons(scroller,wrapper){
    let leftScroll = scroller.querySelector('.leftScroll')
    let rightScroll = scroller.querySelector('.rightScroll')

    leftScroll.style.visibility = "hidden";
    rightScroll.style.visibility = "hidden";
}

scrollers.forEach(scroller => {
    let wrapper = scroller.querySelector(".wrapper");
    let wrapperWidth = wrapper.offsetWidth;
    let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    let leftScroll = scroller.querySelector('.leftScroll');
    let rightScroll = scroller.querySelector('.rightScroll');

    console.log(wrapper.scrollWidth, wrapper.clientWidth)
    if (wrapper.scrollWidth !== wrapper.clientWidth) {
        rightScroll.style.opacity = "100%";
        rightScroll.style.visibility = "visible";
    }

    leftScroll.addEventListener("click", function () {
        wrapper.scrollLeft -= wrapperWidth - (wrapperWidth % 225);
        setTimeout(() => {
            if (100 > wrapper.scrollLeft > 0) {
                leftScroll.style.opacity = "0%";
                leftScroll.style.visibility = "hidden";
            }
            if (wrapper.scrollLeft !== maxScrollLeft) {
                rightScroll.style.opacity = "100%";
                rightScroll.style.visibility = "visible";
            }
        }, 250);
    })
    
    rightScroll.addEventListener("click", function () {
        wrapper.scrollLeft += wrapperWidth - (wrapperWidth % 225) ;
        setTimeout(() => {
            if (wrapper.scrollLeft !== 0) {
                leftScroll.style.opacity = "100%";
                leftScroll.style.visibility = "visible";

            }
            if (wrapper.scrollLeft > (maxScrollLeft-100)) {
                rightScroll.style.opacity = "0%";
                rightScroll.style.visibility = "hidden";
            }
        }, 250);
    })

    wrapper.addEventListener("scroll", function () {
    
            if (100 > wrapper.scrollLeft > 0) {
                leftScroll.style.opacity = "0%";
                leftScroll.style.visibility = "hidden";
            }
            if (wrapper.scrollLeft !== maxScrollLeft) {
                rightScroll.style.opacity = "100%";
                rightScroll.style.visibility = "visible";
            }
            if (wrapper.scrollLeft !== 0) {
                leftScroll.style.opacity = "100%";
                leftScroll.style.visibility = "visible";

            }
            if (wrapper.scrollLeft > (maxScrollLeft-50)) {
                rightScroll.style.opacity = "0%";
                rightScroll.style.visibility = "hidden";
            }
        
    })
});

