!function(){const t=t=>(e,o)=>{const n=t.querySelector(".control-button.left"),c=t.querySelector(".control-button.right");0===e?n.setAttribute("disabled",!0):n.removeAttribute("disabled"),Math.abs(o-e)<=2?c.setAttribute("disabled",!0):c.removeAttribute("disabled")},e=e=>{const o=e?.detail?.container||document,n=o.querySelector(".products-container"),c=o.querySelectorAll(".control-button");t(o)(0,n.scrollWidth-n.clientWidth),n.addEventListener("scroll",(function(){const e=n.scrollLeft,c=n.scrollWidth-n.clientWidth;t(o)(e,c)})),c.forEach((function(t){t.addEventListener("click",(function(){const e=o.querySelector(".product-card").offsetWidth,c=n.scrollLeft;t.classList.contains("left")?n.scrollTo({left:c-e,behavior:"smooth"}):t.classList.contains("right")&&n.scrollTo({left:c+e,behavior:"smooth"})}))}))};document.addEventListener("DOMContentLoaded",e),document.addEventListener("ShopsenseEmbedInjected",e)}();