document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("main"),t=document.querySelectorAll(".product-section"),n=t.length;let a,c=0;function o(e){1!==t.length?t.forEach(((t,a)=>{t.classList.remove("active","prev"),a===e?t.classList.add("active"):a===(e-1+n)%n&&t.classList.add("prev")})):t[0].classList.add("active")}function i(){let e=performance.now();a=requestAnimationFrame((function t(i){i-e>=3e3&&(e=i,c=(c+1)%n,o(c)),a=requestAnimationFrame(t)}))}t.length>1&&(e.addEventListener("mouseenter",(function(){cancelAnimationFrame(a)})),e.addEventListener("mouseleave",i)),o(c),i()}));