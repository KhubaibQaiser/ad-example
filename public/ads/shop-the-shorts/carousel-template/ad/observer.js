window.ShopsenseEmbeds=window.ShopsenseEmbeds||{},window.ShopsenseEmbeds.handleIntersection=e=>(n,s)=>{n.forEach((n=>{n.isIntersecting&&(e(n.target),s.unobserve(n.target))}))},window.ShopsenseEmbeds.getObserverInstance=(e,n,s={})=>{new IntersectionObserver(window.ShopsenseEmbeds.handleIntersection(n),{root:null,rootMargin:"0px",threshold:1,...s}).observe(e)};