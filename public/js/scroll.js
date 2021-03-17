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
    let wrapper = scroller.querySelector(".wrapper")
    let wrapperWidth = wrapper.offsetWidth
    let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    let leftScroll = scroller.querySelector('.leftScroll')
    let rightScroll = scroller.querySelector('.rightScroll')

    leftScroll.addEventListener("click", function () {
        wrapper.scrollLeft -= wrapperWidth - (wrapperWidth % 225);
        setTimeout(() => {
            if (100 > wrapper.scrollLeft > 0) {
                leftScroll.style.opacity = "0%";
            }
            if (wrapper.scrollLeft !== maxScrollLeft) {
                rightScroll.style.opacity = "100%";
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
            }
        }, 250);
    })

    wrapper.addEventListener("scroll", function () {
    
            if (100 > wrapper.scrollLeft > 0) {
                leftScroll.style.opacity = "0%";
            }
            if (wrapper.scrollLeft !== maxScrollLeft) {
                rightScroll.style.opacity = "100%";
            }
            if (wrapper.scrollLeft !== 0) {
                leftScroll.style.opacity = "100%";
                leftScroll.style.visibility = "visible";

            }
            if (wrapper.scrollLeft > (maxScrollLeft-50)) {
                rightScroll.style.opacity = "0%";
            }
        
    })
});

// scrollers.forEach(scroller => {
//     let wrapper = scroller.querySelector(".wrapper")
//     let wrapperWidth = wrapper.offsetWidth
//     let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
//     let leftScroll = scroller.querySelector('.leftScroll')
//     let rightScroll = scroller.querySelector('.rightScroll')

//     leftScroll.addEventListener("click", function () {
//         scrollLeft(scroller,wrapper)
//     })
    
//     rightScroll.addEventListener("click", function () {
//         scrollRight(scroller,wrapper)  
//     })

//     if (wrapper.scrollLeft !== 0) {
//         leftScroll.classList.toggle("visible");
//     }
//     if (wrapper.scrollLeft == maxScrollLeft) {
//         rightScroll.classList.toggle("visible");
//     }


//     wrapper.addEventListener("mouseover", function () {
//         displayScrollButtons(scroller,wrapper)
//         console.log("Mouseover wrapper")
//     })

//     leftScroll.addEventListener("mouseover", function () {
//         displayScrollButtons(scroller,wrapper)
//         console.log("Mouseover leftbutton")
//     })

//     rightScroll.addEventListener("mouseover", function () {
//         displayScrollButtons(scroller,wrapper)
//         console.log("Mouseover rightbutton")
//     })
        
//     wrapper.addEventListener("mouseleave", function() {
//         hideScrollButtons(scroller,wrapper)
//         console.log("Mouseleave wrapper")
//     })

// });

