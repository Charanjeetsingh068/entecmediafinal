(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5e3,e=>{"use strict";var t=e.i(43476),s=e.i(71645);let a=e=>Math.min(1,Math.max(0,e));e.s(["default",0,function(){let e=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let t=e.current,s=t?.closest("section"),i=t?.getContext("2d");if(!t||!s||!i)return;let o=Array.from({length:21},(e,t)=>`rgba(165, 185, 255, ${(t/20*.4).toFixed(3)})`),n=e=>o[Math.max(0,Math.min(20,Math.round(e/.4*20)))],r=0,l=0,h=!1,d=0,c=0,p=0,u=!0,g=.5,m=.5,f=.5,y=.5,w=!1,b=[],v=()=>{let e=Math.min(1.5,window.devicePixelRatio||1);r=t.clientWidth,l=t.clientHeight,t.width=Math.round(r*e),t.height=Math.round(l*e),i.setTransform(e,0,0,e,0,0),b=Array.from({length:(h=r<1200)?24:46},()=>({x:Math.random()*r,y:Math.random()*l,v:5+10*Math.random(),p:Math.random()*Math.PI*2}))},k=e=>{p+=45e-5*e,f+=(g-f)*.05,y+=(m-y)*.05,i.clearRect(0,0,r,l);let t=h?24:30,s=f*r,a=y*l;for(let e=t/2;e<l;e+=t)for(let o=t/2;o<r;o+=t){let t=.5*Math.sin(.005*o-.004*e-2.2*p)+.5*Math.sin(.009*o+.006*e+1.4*p);i.fillStyle=n(.025+.07*Math.max(0,t)+.06*(w?Math.max(0,1-Math.hypot(o-s,e-a)/240):0));let r=1.1+.4*Math.max(0,t);i.fillRect(o,e,r,r)}let o=h?44:90,d=h?12:18;for(let e=0;e<d;e++){let t=e/(d-1),s=.62*l+t*t*l*.34,a=r*(1.1+.9*t),h=8+34*t,c=1+1.4*t;for(let e=0;e<o;e++){let l=e/(o-1)-.5,d=.6*Math.sin(6*l-2*p+3*t)+.4*Math.sin(2.4*l+1.2*p+5*t),u=(.025+.12*t)*(.5+.5*d);u<.02||(i.fillStyle=n(u),i.fillRect(r/2+l*a,s+d*h,c,c))}}for(let t of b)t.y-=t.v*e*.001,t.y<-4&&(t.y=l+4,t.x=Math.random()*r),i.fillStyle=n(.04+.1*(.5+.5*Math.sin(6*p+t.p))),i.fillRect(t.x,t.y,1.6,1.6)},x=e=>{d=requestAnimationFrame(x);let t=e-c;t<33||(c=e,k(Math.min(t,100)))},M=()=>{d||!u||document.hidden||(d=requestAnimationFrame(x))},A=()=>{cancelAnimationFrame(d),d=0};v(),k(0);let j=new ResizeObserver(()=>{v(),k(0)});j.observe(t);let S=0,L=()=>{S=0,s.style.setProperty("--hp",a(window.scrollY/(s.offsetHeight||1)).toFixed(4))},C=()=>{let e=window.scrollY<s.offsetHeight;e!==u&&((u=e)?M():A()),S||(S=requestAnimationFrame(L))},P=()=>document.hidden?A():M(),N=e=>{let t=s.getBoundingClientRect();g=a((e.clientX-t.left)/t.width),m=a((e.clientY-t.top)/t.height),w=!0};window.addEventListener("scroll",C,{passive:!0}),document.addEventListener("visibilitychange",P),s.addEventListener("pointermove",N),C(),M();let I=document.querySelector(".k-guides"),W=()=>{if(s.style.top="sticky"===getComputedStyle(s).position?`${Math.min(0,window.innerHeight-s.offsetHeight)}px`:"",!I)return;let e=`linear-gradient(to bottom, transparent ${s.offsetHeight}px, #000 ${s.offsetHeight}px)`;I.style.setProperty("-webkit-mask-image",e),I.style.setProperty("mask-image",e)};W();let q=new ResizeObserver(W);return q.observe(s),window.addEventListener("resize",W),()=>{A(),cancelAnimationFrame(S),j.disconnect(),q.disconnect(),window.removeEventListener("resize",W),s.style.top="",I?.style.removeProperty("-webkit-mask-image"),I?.style.removeProperty("mask-image"),window.removeEventListener("scroll",C),document.removeEventListener("visibilitychange",P),s.removeEventListener("pointermove",N)}},[]),(0,t.jsxs)("div",{className:"hb-bg","aria-hidden":"true",children:[(0,t.jsx)("canvas",{className:"hb-canvas",ref:e}),(0,t.jsx)("span",{className:"hb-glow hb-glow-a"}),(0,t.jsx)("span",{className:"hb-glow hb-glow-b"})]})}])},76326,e=>{"use strict";e.s(["imageManifest",0,{"/images/ENTEC.png":{base:"/images/r/ENTEC",width:1682,height:311,widths:[480,768,1080,1440,1682]},"/images/entec-about.webp":{base:"/images/r/entec-about",width:2400,height:448,widths:[480,768,1080,1440,1920,2400]},"/images/aboutimg.webp":{base:"/images/r/aboutimg",width:2400,height:507,widths:[480,768,1080,1440,1920,2400]},"/images/about.webp":{base:"/images/r/about",width:2e3,height:856,widths:[480,768,1080,1440,1920,2e3]},"/images/team1.webp":{base:"/images/r/team1",width:900,height:900,widths:[480,768,900]},"/images/team2.webp":{base:"/images/r/team2",width:900,height:900,widths:[480,768,900]},"/images/team3.webp":{base:"/images/r/team3",width:900,height:900,widths:[480,768,900]},"/images/team4.webp":{base:"/images/r/team4",width:900,height:900,widths:[480,768,900]},"/images/blogs/design-process.webp":{base:"/images/r/blogs-design-process",width:1024,height:1024,widths:[480,768,1024]},"/images/blogs/design-value.webp":{base:"/images/r/blogs-design-value",width:1024,height:1024,widths:[480,768,1024]},"/images/blogs/future-trends.webp":{base:"/images/r/blogs-future-trends",width:1024,height:1024,widths:[480,768,1024]},"/images/blogs/minimalism.webp":{base:"/images/r/blogs-minimalism",width:1024,height:1024,widths:[480,768,1024]}}])},5225,e=>{"use strict";var t=e.i(43476),s=e.i(22016);e.s(["default",0,function({href:e,label:a,variant:i="light",type:o="button",disabled:n,external:r,as:l,className:h="",onClick:d}){let c=`k-btn k-btn-${i} ${h}`.trim(),p=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{className:"k-btn-fill","aria-hidden":"true"}),(0,t.jsx)("span",{className:"k-btn-label",children:a}),(0,t.jsx)("span",{className:"k-btn-orb","aria-hidden":"true",children:(0,t.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("path",{d:"M5 12h14M13 6l6 6-6 6"})})})]});return"span"===l?(0,t.jsx)("span",{className:c,children:p}):e&&r?(0,t.jsx)("a",{href:e,className:c,target:"_blank",rel:"noopener noreferrer",children:p}):e?(0,t.jsx)(s.default,{href:e,className:c,onClick:d,children:p}):(0,t.jsx)("button",{type:o,className:c,disabled:n,onClick:d,children:p})}])},58834,e=>{"use strict";var t=e.i(43476),s=e.i(71645);let a=()=>()=>{};e.s(["default",0,function({title:e,url:i,text:o,label:n="Share on:"}){let r=(0,s.useSyncExternalStore)(a,()=>"function"==typeof navigator.share,()=>!1),[l,h]=(0,s.useState)(!1),d=encodeURIComponent(i),c=encodeURIComponent(e),p=[{name:"Facebook",href:`https://www.facebook.com/sharer/sharer.php?u=${d}`,icon:(0,t.jsx)("path",{d:"M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.2v1.8H8v3.2h2.5V21h3.4v-9.3h2.6l.4-3.2H14z",fill:"currentColor"})},{name:"X",href:`https://twitter.com/intent/tweet?url=${d}&text=${c}`,icon:(0,t.jsx)("path",{d:"M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20z",fill:"currentColor"})},{name:"LinkedIn",href:`https://www.linkedin.com/sharing/share-offsite/?url=${d}`,icon:(0,t.jsx)("path",{d:"M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",fill:"currentColor"})},{name:"WhatsApp",href:`https://wa.me/?text=${encodeURIComponent(`${e} ${i}`)}`,icon:(0,t.jsx)("path",{d:"M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z",fill:"currentColor"})}],u=async()=>{try{await navigator.share({title:e,text:o||e,url:i})}catch{}},g=async()=>{try{await navigator.clipboard.writeText(i),h(!0),setTimeout(()=>h(!1),1800)}catch{}};return(0,t.jsxs)("div",{className:"k-side-block",children:[(0,t.jsx)("span",{className:"k-mono-label",children:n}),(0,t.jsxs)("div",{className:"k-share-row",children:[r&&(0,t.jsx)("button",{type:"button",className:"k-share-btn",onClick:u,"aria-label":"Share this article",children:(0,t.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,t.jsx)("circle",{cx:"18",cy:"5",r:"3"}),(0,t.jsx)("circle",{cx:"6",cy:"12",r:"3"}),(0,t.jsx)("circle",{cx:"18",cy:"19",r:"3"}),(0,t.jsx)("path",{d:"M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"})]})}),p.map(e=>(0,t.jsx)("a",{className:"k-share-btn",href:e.href,target:"_blank",rel:"noopener noreferrer","aria-label":`Share on ${e.name}`,title:`Share on ${e.name}`,onClick:t=>((e,t,s)=>{if("WhatsApp"===s||window.matchMedia("(max-width: 809px)").matches)return;let a=window.open(t,`share-${s}`,`width=620,height=560,left=${(screen.width-620)/2},top=${(screen.height-560)/2}`);a&&(a.opener=null,e.preventDefault())})(t,e.href,e.name),children:(0,t.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24","aria-hidden":"true",children:e.icon})},e.name)),(0,t.jsx)("button",{type:"button",className:"k-share-btn",onClick:g,"aria-label":l?"Link copied":"Copy link",title:l?"Link copied":"Copy link",children:l?(0,t.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M5 12l5 5L20 7"})}):(0,t.jsxs)("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"}),(0,t.jsx)("path",{d:"M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"})]})})]})]})}])},91012,74832,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(74080),i=e.i(76326);function o({src:e,sizes:s,priority:n,alt:r="",...l}){let h=i.imageManifest[e];if(!h)return(0,t.jsx)("img",{src:e,alt:r,loading:n?"eager":"lazy",decoding:"async",...l});let d=h.widths.map(e=>`${h.base}-${e}.webp ${e}w`).join(", "),c=`${h.base}-${h.width}.webp`;return n&&(0,a.preload)(c,{as:"image",imageSrcSet:d,imageSizes:s,fetchPriority:"high"}),(0,t.jsx)("img",{src:c,srcSet:d,sizes:s,width:h.width,height:h.height,alt:r,loading:n?"eager":"lazy",fetchPriority:n?"high":void 0,decoding:n?"sync":"async",...l})}e.s(["default",0,o],74832);var n=e.i(22016),r=e.i(47167);let l=[{id:1,title:"Website Design Trends for Businesses in 2026",category:"Web Design",date:"2026-09-10",description:"From bento-grid layouts to AI-assisted personalisation, here are the website design trends that actually help businesses win more enquiries in 2026.",image:"/images/blogs/future-trends.webp",imgHeight:"350px",slug:"website-design-trends-2026",tags:["Web Design","Trends","Conversion"],content:`<p>Your website is often the first conversation a customer has with your business. In 2026, visitors expect sites that load instantly, feel personal and make it effortless to take the next step. Trends come and go, but the ones below are earning their place because they help real businesses get more enquiries — not just because they look new.</p>
<p>We've grouped them by what they do for your visitors: help them understand you quickly, trust you, and act.</p>
<h2>1. Bento-grid and modular layouts</h2>
<p>Content arranged in clean, card-based grids makes it easy to scan services, results and testimonials at a glance — especially on mobile, where long blocks of text are rarely read. Each card answers one question: what you do, who you've helped, what it costs, how to start.</p>
<p>Modular layouts are also easier to maintain. When every section is a reusable block, your team can add a new service or case study from the CMS without asking a developer to rebuild the page.</p>
<ul>
<li>Use one card per idea — never cram two messages into one block.</li>
<li>Vary card sizes to create a clear reading order (big = most important).</li>
<li>Keep spacing consistent so the grid feels calm, not busy.</li>
</ul>
<h2>2. Bold typography with plenty of white space</h2>
<p>Large, confident headlines and generous spacing communicate premium quality and help key messages stand out. Visitors decide in a few seconds whether to stay, and a clear headline that says exactly what you do wins that moment.</p>
<p>White space is not wasted space. It gives each element room to breathe and guides the eye towards the call to action. Pair a strong display font for headings with a highly readable body font at 16px or larger.</p>
<h2>3. Purposeful micro-interactions</h2>
<p>Subtle hover states, scroll reveals and progress indicators guide users without slowing the site down. A button that responds when you point at it, a form that confirms each field, a menu that opens smoothly — these small details make a site feel trustworthy and alive.</p>
<blockquote>Animation should explain, not decorate. If an effect doesn't help the visitor understand or act, leave it out.</blockquote>
<p>Keep motion calm and quick (200–600 ms), and make sure every interaction still works for keyboard users and people who prefer reduced motion.</p>
<h2>4. Speed as a design feature</h2>
<p>Google's Core Web Vitals directly affect rankings, and slow pages lose visitors before they even see your design. Optimised images, modern frameworks like Next.js and lean code are now part of good design, not an afterthought for developers.</p>
<h3>Quick wins for faster pages</h3>
<ul>
<li>Serve images in WebP or AVIF and size them for each screen.</li>
<li>Load fonts efficiently and limit the number of font weights.</li>
<li>Remove unused plugins, sliders and tracking scripts.</li>
<li>Lazy-load anything below the fold.</li>
</ul>
<h2>5. Personalised, AI-assisted experiences</h2>
<p>Websites can now adapt to the visitor: showing the services most relevant to their industry, remembering what they viewed last time, or answering common questions instantly with a well-trained assistant. Done carefully, personalisation shortens the path to an enquiry.</p>
<p>Start small — for example, showing location-specific testimonials to visitors from Chandigarh or Mohali — and measure whether it improves conversions before going further.</p>
<h2>6. Conversion-first page structure</h2>
<p>Clear calls-to-action, trust signals, WhatsApp buttons and short enquiry forms placed where users need them turn visitors into leads. Every page should answer three questions in order: what is this, why should I trust you, and what do I do next?</p>
<ol>
<li>A headline that states the benefit, with one primary button.</li>
<li>Proof: client logos, reviews, numbers and case studies.</li>
<li>Details: services, process and pricing guidance.</li>
<li>A final, low-friction call to action — call, WhatsApp or a 3-field form.</li>
</ol>
<h2>Bringing it together</h2>
<p>You don't need every trend at once. Pick the ones that solve your visitors' biggest frustrations, test them, and keep what works. A fast, clear, trustworthy site will outperform a flashy one every time.</p>
<p>Planning a new website or redesign? <a href="/contact">Talk to Entec Media</a> about a site that looks great and performs even better.</p>`},{id:2,title:"Google Ads vs Meta Ads: Which Is Right for Your Business?",category:"Digital Marketing",date:"2026-08-22",description:"Both platforms can generate leads — but they work very differently. Here's how to decide where to spend your ad budget first.",image:"https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&auto=format&fit=crop&q=75",imgHeight:"220px",slug:"google-ads-vs-meta-ads",tags:["Google Ads","Meta Ads","Lead Generation"],content:`<p>Google Ads and Meta Ads (Facebook &amp; Instagram) are the two most popular paid advertising platforms for Indian businesses. Both can bring in leads profitably — but they reach people in completely different moments. Choosing the right one first depends on how your customers find you.</p>
<h2>Google Ads captures existing demand</h2>
<p>People searching "website development company near me" already need the service. Google Search ads put you in front of them at the moment of intent, which usually means higher-quality leads and shorter sales cycles.</p>
<h3>Where Google Ads shines</h3>
<ul>
<li>Urgent needs: repairs, clinics, legal help, emergency services.</li>
<li>B2B services that people actively research.</li>
<li>Local businesses that want calls from nearby customers.</li>
<li>Products people compare by name or category.</li>
</ul>
<p>The trade-off is cost: competitive keywords can be expensive, so tight targeting, negative keywords and well-built landing pages matter a lot.</p>
<h2>Meta Ads creates new demand</h2>
<p>On Facebook and Instagram, people aren't searching — they're scrolling. Meta Ads use interests, demographics and behaviour to introduce your offer to the right audience, often at a lower cost per lead than search.</p>
<h3>Where Meta Ads shines</h3>
<ul>
<li>Visual products: fashion, food, real estate, interiors, events.</li>
<li>Offers and launches that need awareness quickly.</li>
<li>Local brands building a community and repeat customers.</li>
<li>Retargeting people who visited your site but didn't enquire.</li>
</ul>
<blockquote>Google answers "I need this now". Meta answers "I didn't know I needed this — until I saw it".</blockquote>
<h2>When to use which</h2>
<ol>
<li><strong>Urgent or high-intent services</strong>: start with Google Search, then add Meta retargeting.</li>
<li><strong>Visual products, offers and local brands</strong>: start with Meta Ads and strong creatives.</li>
<li><strong>Growing businesses</strong>: combine both — Google for demand capture, Meta for demand creation and remarketing.</li>
</ol>
<h2>Budget: how much to start with</h2>
<p>For most small businesses, a test budget of ₹15,000–₹30,000 per month per platform gives enough data in 4–6 weeks to judge results. Spend less and the algorithms don't learn; spend more before you know your cost per lead and you risk waste.</p>
<h3>Measure the right numbers</h3>
<ul>
<li><strong>Cost per lead</strong> — not just clicks or impressions.</li>
<li><strong>Lead-to-customer rate</strong> — are the leads actually buying?</li>
<li><strong>Return on ad spend</strong> — revenue earned for every rupee spent.</li>
</ul>
<h2>Creatives and landing pages decide the winner</h2>
<p>The same budget can produce ten leads or a hundred depending on the ad and the page it opens. On Google, match the landing page headline to the keyword. On Meta, lead with a strong visual and a clear benefit in the first line.</p>
<h2>Tracking is non-negotiable</h2>
<p>Whichever platform you choose, set up GA4, Google Tag Manager, Meta Pixel and Conversions API so every lead is attributed correctly. Without tracking, you're guessing — and the platforms can't optimise for the results you want.</p>
<p>Not sure where to start? Our <a href="/services/google-ads">Google Ads</a> and <a href="/services/meta-ads">Meta Ads</a> teams can audit your account for free.</p>`},{id:3,title:"Local SEO Checklist: Rank Higher on Google Maps",category:"SEO",date:"2026-07-30",description:"A practical checklist to help your business appear in Google's local map pack and get more calls from nearby customers.",image:"https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&auto=format&fit=crop&q=75",imgHeight:"430px",slug:"local-seo-checklist",tags:["Local SEO","Google Maps","Checklist"],content:`<p>When someone searches for a service "near me", Google shows a map with three businesses before any website. Getting into that local pack can transform your enquiries — and unlike ads, you don't pay for every click. This checklist covers what we do for every local SEO client.</p>
<h2>Optimise your Google Business Profile</h2>
<p>Your Google Business Profile is the single biggest factor in local rankings. Treat it like a second homepage.</p>
<ul>
<li>Choose the most accurate primary category and relevant secondary categories.</li>
<li>Add your services, working hours, holiday hours and service areas.</li>
<li>Upload real photos of your team, premises and work every month.</li>
<li>Write a natural, keyword-rich description of what you do and where.</li>
<li>Post updates and offers regularly — at least twice a month.</li>
<li>Answer questions in the Q&amp;A section before customers ask.</li>
</ul>
<h2>Keep your NAP consistent</h2>
<p>Your business Name, Address and Phone number should be identical on your website, Google profile and directories such as Justdial, IndiaMART, Sulekha and Facebook. Even small differences ("Sector 5" vs "Sec-5") can confuse search engines.</p>
<h3>Where to list your business</h3>
<ol>
<li>Google Business Profile and Bing Places.</li>
<li>Apple Business Connect for iPhone users.</li>
<li>Industry directories relevant to your field.</li>
<li>Local chambers of commerce and city directories.</li>
</ol>
<h2>Collect and reply to reviews</h2>
<p>Ask happy customers for reviews and respond to every review — positive or negative. Review quantity, quality and recency all influence rankings, and they strongly influence whether searchers choose you.</p>
<blockquote>A polite, helpful reply to a negative review often wins more trust than ten five-star reviews.</blockquote>
<p>Make it easy: share a short review link by WhatsApp after every completed job, and print a QR code for your reception desk.</p>
<h2>Build local landing pages</h2>
<p>If you serve multiple cities (for example Zirakpur, Mohali and Chandigarh), create useful pages for each location with genuine local content — projects you've done there, local testimonials, directions and area-specific FAQs. Avoid copying the same page and changing only the city name.</p>
<h2>Fix the technical basics on your website</h2>
<ul>
<li>Add LocalBusiness schema markup with your address, hours and phone.</li>
<li>Embed a Google Map on your contact page.</li>
<li>Make sure the site is fast and works perfectly on mobile.</li>
<li>Use your city and service in page titles and headings naturally.</li>
</ul>
<h2>Earn local links and mentions</h2>
<p>Links from local newspapers, event sponsorships, partner businesses and community sites tell Google you're a real, active part of the area. One genuine local link is worth more than dozens of low-quality directory links.</p>
<h2>Track your progress</h2>
<p>Watch calls, direction requests and website clicks in your Business Profile insights, and track rankings for your main "service + city" keywords every month. Local SEO compounds — the work you do now keeps paying off for years.</p>
<p>Need help? Explore our <a href="/services/seo">SEO services</a>.</p>`},{id:4,title:"Flutter or React Native? Choosing a Framework for Your App",category:"App Development",date:"2026-07-05",description:"Cross-platform frameworks let you launch on Android and iOS with one codebase. Here's how Flutter and React Native compare.",image:"https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=75",imgHeight:"200px",slug:"flutter-vs-react-native",tags:["Flutter","React Native","Mobile Apps"],content:`<p>Building separate native apps for Android and iOS doubles cost and time. Cross-platform frameworks solve this by letting one team ship both apps from a single codebase — and Flutter and React Native are the two clear leaders. Both are excellent; the right choice depends on your product, your team and your plans.</p>
<h2>Flutter</h2>
<p>Built by Google, Flutter renders its own UI with a high-performance graphics engine. That means pixel-perfect consistency across devices and excellent animation performance, even on budget Android phones.</p>
<h3>Strengths</h3>
<ul>
<li>Beautiful custom interfaces that look identical on every device.</li>
<li>Smooth 60–120 fps animations out of the box.</li>
<li>One language (Dart) for the whole app, with strong tooling.</li>
<li>Can also target web and desktop from the same code.</li>
</ul>
<h3>Things to consider</h3>
<p>Dart is less widely known than JavaScript, and apps are slightly larger in file size. For most business apps, neither is a real problem.</p>
<h2>React Native</h2>
<p>Backed by Meta, React Native uses real native components and JavaScript/TypeScript. If your team already works with React for the web, code, libraries and skills can be shared between your website and app.</p>
<h3>Strengths</h3>
<ul>
<li>Huge ecosystem of libraries and developers.</li>
<li>Native look and feel on each platform.</li>
<li>Logic can be shared with a React or Next.js website.</li>
<li>Over-the-air updates for quick fixes without store review.</li>
</ul>
<h3>Things to consider</h3>
<p>Complex animations can need extra work, and more features rely on third-party packages that must be kept up to date.</p>
<blockquote>The best framework is the one that fits your product and the team who will maintain it for years — not the one with the most hype.</blockquote>
<h2>Performance in real life</h2>
<p>For typical business apps — booking, e-commerce, delivery tracking, customer portals — users won't notice a difference between the two. Performance problems almost always come from poor architecture, oversized images or slow APIs, not from the framework.</p>
<h2>How we decide</h2>
<ol>
<li><strong>Custom, animation-rich UI or strong branding</strong>: Flutter.</li>
<li><strong>Existing React web product or JavaScript team</strong>: React Native.</li>
<li><strong>Heavy device-specific features</strong> (Bluetooth hardware, AR, background processing): either, with native Kotlin/Swift modules where needed.</li>
<li><strong>Tight budget, fast MVP</strong>: whichever lets you reuse the most existing work.</li>
</ol>
<h2>What it costs</h2>
<p>A cross-platform MVP typically costs 30–40% less than building two native apps, and ongoing maintenance is cheaper too because there's only one codebase to update. Plan for regular updates after launch — app stores, operating systems and devices change every year.</p>
<p>Have an app idea? Our <a href="/services/mobile-app-development">mobile app development</a> team will help you pick the right stack.</p>`},{id:5,title:"Why Good UI/UX Design Pays for Itself",category:"UI/UX Design",date:"2026-06-18",description:"Better user experience means fewer drop-offs, more conversions and lower support costs. Here's the business case for investing in UI/UX.",image:"/images/blogs/design-value.webp",imgHeight:"350px",slug:"why-ui-ux-design-pays-off",tags:["UI/UX","Conversion","Design Process"],content:`<p>Design is not decoration. Every confusing form, hidden button or slow screen costs you customers — usually without you ever knowing. Good UI/UX removes that friction, and the return on that investment shows up in sales, support costs and reputation.</p>
<h2>Higher conversion rates</h2>
<p>Clear navigation and focused calls-to-action help more visitors complete the action you want — whether that's an enquiry, a booking or a purchase. Small improvements compound: raising a checkout's completion rate from 2% to 3% is a 50% increase in sales from the same traffic.</p>
<h3>Common conversion killers</h3>
<ul>
<li>Forms that ask for too much information too early.</li>
<li>Buttons that don't look like buttons.</li>
<li>Prices, delivery times or next steps that are hard to find.</li>
<li>Pages that break or become unreadable on mobile.</li>
</ul>
<h2>Lower development costs</h2>
<p>Testing ideas with wireframes and clickable prototypes is far cheaper than rebuilding features after launch. A one-hour usability test can reveal problems that would otherwise take weeks of development to fix.</p>
<blockquote>Fixing a problem in design costs a fraction of fixing it in code — and a tiny fraction of fixing it after customers have left.</blockquote>
<h2>Fewer support requests</h2>
<p>When an interface explains itself, customers stop calling to ask how to do things. Clear labels, helpful error messages and sensible defaults reduce support tickets and free your team for more valuable work.</p>
<h2>Stronger brand trust</h2>
<p>Consistent, polished interfaces make your business look credible and professional. Visitors judge trustworthiness in seconds, largely by how a site looks and behaves. A clumsy experience makes people wonder how you'll handle their order or project.</p>
<h2>Better accessibility, bigger audience</h2>
<p>Good UX includes everyone: readable text sizes, strong colour contrast, keyboard navigation and screen-reader support. Accessible design reaches more customers and usually improves the experience for all users.</p>
<h2>What a good UI/UX process looks like</h2>
<ol>
<li><strong>Research</strong> — understand users, goals and competitors.</li>
<li><strong>Information architecture</strong> — organise content so it's easy to find.</li>
<li><strong>Wireframes</strong> — plan layouts before visual design.</li>
<li><strong>Visual design</strong> — apply your brand with a consistent design system.</li>
<li><strong>Prototype and test</strong> — watch real people use it and refine.</li>
<li><strong>Handoff and support</strong> — work with developers to build it exactly right.</li>
</ol>
<h2>Measuring the return</h2>
<p>Track conversion rate, task completion time, bounce rate and support volume before and after a redesign. Most businesses see the investment pay back within months — and keep benefiting for years.</p>
<p>See how our <a href="/services/ui-ux-design">UI/UX design</a> process works.</p>`},{id:6,title:"Our Process: From Idea to Launch in 4 Steps",category:"Web Development",date:"2026-05-27",description:"How Entec Media takes a website or app from first call to go-live — with clear milestones, transparent communication and no surprises.",image:"/images/blogs/design-process.webp",imgHeight:"220px",slug:"our-website-development-process",tags:["Process","Next.js","Design Process"],content:`<p>A clear process keeps projects on time and on budget, and it means you always know what's happening and what comes next. Whether it's a business website, an e-commerce store or a custom web app, every Entec Media project follows the same four stages.</p>
<h2>1. Discovery</h2>
<p>We start by learning about your business, audience, competitors and goals. What does success look like in six months? Who are your best customers, and what do they need to see before they contact you?</p>
<h3>What you get from discovery</h3>
<ul>
<li>A clear project scope with every page and feature listed.</li>
<li>A sitemap showing how content will be organised.</li>
<li>A fixed quote and a timeline with milestones.</li>
<li>A list of the content and access we'll need from you.</li>
</ul>
<h2>2. Design</h2>
<p>We create wireframes first to agree on structure, then high-fidelity designs for desktop and mobile. You review real designs — not vague descriptions — and we refine them with your feedback until they're right.</p>
<blockquote>We'd rather spend an extra day getting the design right than an extra week rebuilding it later.</blockquote>
<p>Every design is built on a small design system — colours, type, buttons and components — so the site stays consistent as it grows.</p>
<h2>3. Development</h2>
<p>Our developers build clean, fast, SEO-friendly websites using modern frameworks like Next.js, with a content management system so you can update text, images and blog posts yourself.</p>
<h3>Built in from day one</h3>
<ul>
<li>Mobile-first, fully responsive layouts.</li>
<li>Core Web Vitals and image optimisation.</li>
<li>On-page SEO: titles, meta descriptions, schema and sitemaps.</li>
<li>Security best practices and regular backups.</li>
<li>Analytics and conversion tracking.</li>
</ul>
<p>You get a private staging link to see progress as we build, so there are no surprises at launch.</p>
<h2>4. Launch &amp; growth</h2>
<p>Before going live we test every page on real devices and browsers, check forms and integrations, and set up redirects so you don't lose existing search rankings. Then we launch, monitor and fix anything that comes up.</p>
<h3>After launch</h3>
<ol>
<li>Training so your team can manage content confidently.</li>
<li>30 days of free support for any issues.</li>
<li>Optional maintenance plans for updates and security.</li>
<li>Ongoing SEO and ad campaigns to bring in traffic and leads.</li>
</ol>
<h2>How long does it take?</h2>
<p>A typical business website takes 3–6 weeks from discovery to launch. Larger e-commerce sites and custom web applications take longer, and we'll give you a detailed timeline before work begins.</p>
<p>Ready to start? <a href="/contact">Get a free consultation</a>.</p>`},{id:7,title:"How Fast Should Your Website Load? A Core Web Vitals Guide",category:"Web Development",date:"2026-09-24",description:"Slow pages lose visitors and rankings. Here's what Core Web Vitals measure, the scores to aim for and the fixes that make the biggest difference.",image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=75",imgHeight:"260px",slug:"core-web-vitals-guide",tags:["Performance","Core Web Vitals","Next.js"],author:"Entec Media Team",content:`<p>Around half of mobile visitors leave a page that takes longer than three seconds to load. Google also uses page experience as a ranking signal, so speed affects both your leads and your visibility. The good news: most slow sites can be made dramatically faster with a handful of well-chosen fixes.</p>
<p>This guide explains what Google measures, which scores to aim for, and where to start.</p>
<h2>What Core Web Vitals measure</h2>
<p>Core Web Vitals are three metrics Google uses to judge real-world user experience. They're measured on real visitors' devices, not just in a lab test.</p>
<ul>
<li><strong>LCP (Largest Contentful Paint)</strong> — how quickly the main content appears. Aim for under 2.5 seconds.</li>
<li><strong>INP (Interaction to Next Paint)</strong> — how fast the page reacts to taps and clicks. Aim for under 200 ms.</li>
<li><strong>CLS (Cumulative Layout Shift)</strong> — how much the layout jumps while loading. Aim for under 0.1.</li>
</ul>
<h3>Why mobile matters most</h3>
<p>Most of your visitors are probably on mid-range Android phones over 4G. A site that feels fast on an office laptop can be painfully slow there — always test on mobile first.</p>
<h2>The fixes that matter most</h2>
<h3>Optimise images</h3>
<p>Images are usually the heaviest part of a page. Serve modern formats like WebP or AVIF, size images for the screen they're shown on, compress them properly and lazy-load anything below the fold. The main hero image should load first, with high priority.</p>
<h3>Reduce JavaScript</h3>
<p>Heavy page builders, chat widgets, sliders and unused plugins slow down interaction. Frameworks like Next.js ship only what each page needs and pre-render pages so content appears immediately.</p>
<h3>Reserve space for content</h3>
<p>Set width and height on images, ads and embeds so the layout doesn't jump as they load. Load web fonts with a fallback so text doesn't suddenly change size.</p>
<h3>Use good hosting and caching</h3>
<p>A fast server close to your visitors, a CDN for images and files, and proper browser caching can cut load times in half without changing a line of design.</p>
<blockquote>A fast website is not a technical luxury — it's the first impression of your brand.</blockquote>
<h2>Third-party scripts: the hidden cost</h2>
<p>Every tracking pixel, chat widget and embedded video adds weight. Audit them regularly and remove anything you don't actively use. Load the rest after the main content, not before.</p>
<ol>
<li>List every script running on your site.</li>
<li>Remove duplicates and anything no longer needed.</li>
<li>Load marketing tags through Google Tag Manager with sensible triggers.</li>
<li>Replace heavy embeds with lightweight previews that load on click.</li>
</ol>
<h2>Measure, then improve</h2>
<p>Check your site in PageSpeed Insights and the Core Web Vitals report in Google Search Console. Fix the biggest issues first, re-test after every change, and keep an eye on the numbers each month — new content and plugins can slowly undo good work.</p>
<h2>What results to expect</h2>
<p>For most of our clients, moving from a slow page builder site to an optimised Next.js site brings load times from 6–8 seconds down to under 2, with noticeably lower bounce rates and more enquiries from the same traffic.</p>
<p>Want a faster site? Our <a href="/services/website-development">website development</a> team can audit and speed it up.</p>`},{id:8,title:"Branding Basics: What a Logo Can (and Can't) Do for Your Business",category:"Branding",date:"2026-08-08",description:"A logo is only one part of your brand. Learn what makes a brand identity memorable and how to keep it consistent everywhere customers see you.",image:"https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=75",imgHeight:"300px",slug:"branding-basics-logo-design",tags:["Logo Design","Brand Identity","Graphic Design"],author:"Entec Media Team",content:`<p>Many businesses start with a logo and stop there. But customers remember how a brand makes them feel — and that comes from many touchpoints working together: your website, your social posts, your packaging, the way your team answers the phone. A logo is the signature on all of it, not the whole story.</p>
<h2>What a good logo does</h2>
<p>A strong logo is simple, recognisable at small sizes and works in one colour. It signals professionalism and helps people remember and identify you quickly — on a shop sign, a social profile picture or a tiny browser tab.</p>
<h3>Signs of a well-designed logo</h3>
<ul>
<li>It's readable at 32 pixels and on a billboard.</li>
<li>It works in black, white and your brand colour.</li>
<li>It doesn't rely on trends that will look dated in two years.</li>
<li>It comes in versions for different spaces: horizontal, stacked and icon-only.</li>
</ul>
<h2>What a logo can't do alone</h2>
<p>It can't explain what you offer, build trust or win customers by itself. That's the job of your full brand identity — and of the experience you deliver. A beautiful logo on a confusing website or an inconsistent Instagram feed won't create a strong brand.</p>
<blockquote>Your logo is a promise. Everything else your customers see and experience is whether you keep it.</blockquote>
<h2>The pieces of a brand identity</h2>
<ul>
<li><strong>Colour palette</strong> — a main colour, supporting colours and neutrals, with exact codes.</li>
<li><strong>Typography</strong> — one or two fonts for headings and body text.</li>
<li><strong>Tone of voice</strong> — how you write: friendly, expert, premium, playful.</li>
<li><strong>Key messages</strong> — what you do, for whom and why you're different.</li>
<li><strong>Imagery</strong> — photography and illustration style.</li>
<li><strong>Templates</strong> — social posts, brochures, presentations and ads.</li>
</ul>
<h2>Consistency builds recognition</h2>
<p>Use the same colours, fonts and voice on your website, social profiles, packaging and ads. Recognition comes from repetition: when customers see the same look again and again, they start to remember and trust you.</p>
<h3>Create a simple brand guide</h3>
<ol>
<li>Show your logo versions and the space to leave around them.</li>
<li>List colour codes for print and screen.</li>
<li>Name your fonts and how to use them.</li>
<li>Give examples of on-brand and off-brand designs.</li>
<li>Share it with everyone who creates content for you.</li>
</ol>
<h2>When to refresh your brand</h2>
<p>Consider a refresh if your business has changed direction, your audience has moved upmarket, your logo doesn't work on mobile, or your materials all look different from each other. A refresh can be an evolution — modernising what you have — rather than starting from scratch.</p>
<p>Need a logo or a complete identity? See our <a href="/services/graphic-design">branding and graphic design services</a>.</p>`},{id:9,title:"5 Instagram Content Ideas That Bring in Real Enquiries",category:"Digital Marketing",date:"2026-06-02",description:"Likes are nice, leads are better. These five content formats help local businesses turn Instagram followers into calls, messages and bookings.",image:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&auto=format&fit=crop&q=75",imgHeight:"240px",slug:"instagram-content-ideas-for-leads",tags:["Instagram","Meta Ads","Content Strategy"],author:"Entec Media Team",content:`<p>Posting every day doesn't guarantee results. The businesses that win on Instagram post content that answers questions, proves value and gives people a clear reason to get in touch. Here are five formats that consistently turn followers into enquiries for our clients — and how to make each one work.</p>
<h2>1. Before-and-after posts</h2>
<p>Show the transformation your product or service delivers. It's the fastest way to prove value, and it works for almost any business: salons, clinics, interiors, fitness, renovation, even website redesigns.</p>
<ul>
<li>Use the same angle and lighting for both photos.</li>
<li>Add a short caption explaining the problem and the result.</li>
<li>Carousels work well: before, during, after, then a call to action.</li>
</ul>
<h2>2. Short how-to reels</h2>
<p>Quick tips position you as the expert and get shared and saved — which boosts reach. Keep reels under 30 seconds, put the promise in the first two seconds and add captions, since many people watch without sound.</p>
<h3>Reel ideas to start with</h3>
<ol>
<li>"3 mistakes people make when…"</li>
<li>"How to choose the right…"</li>
<li>"What we check before every…"</li>
<li>Answering a question a customer asked this week.</li>
</ol>
<h2>3. Client stories</h2>
<p>Real reviews and short testimonial videos build trust better than any ad copy. Ask happy clients for a 20-second video about the problem they had and how you helped. Screenshots of genuine WhatsApp messages or Google reviews work too (with permission).</p>
<blockquote>People trust other customers far more than they trust brands. Let your clients do the selling.</blockquote>
<h2>4. Behind the scenes</h2>
<p>Show your team, your process and your workspace. People buy from people they feel they know. Introduce team members, show how an order is packed or a project is planned, and celebrate small wins. Stories are perfect for this everyday content.</p>
<h2>5. Clear offers with a call to action</h2>
<p>End posts with one simple next step — "DM us PRICE" or "Tap the link to book" — and boost the best performers with Meta Ads. Make the offer specific and time-bound so people act now rather than later.</p>
<h3>Make enquiries easy</h3>
<ul>
<li>Put WhatsApp and a booking link in your bio.</li>
<li>Set up quick replies for common questions.</li>
<li>Reply to DMs within an hour during business hours.</li>
<li>Use highlights for services, prices, reviews and FAQs.</li>
</ul>
<h2>Plan, post, measure</h2>
<p>Plan a simple weekly mix — one before-and-after, two reels, one client story and stories every day — and review your insights monthly. Track profile visits, link clicks and DMs, not just likes. Double down on what brings enquiries and drop what doesn't.</p>
<h2>Turn great posts into ads</h2>
<p>Your best organic posts are proven creatives. Promote them to lookalike audiences and people who visited your website, and you'll often get a lower cost per lead than with brand-new ad designs.</p>
<p>Want help planning content and ads? Talk to our <a href="/services/meta-ads">Meta Ads</a> team.</p>`}],h=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),d=Array.from(new Set(l.map(e=>e.category))).map((e,t)=>({id:t+1,name:e,slug:h(e),published_blogs_count:l.filter(t=>t.category===e).length})),c=Array.from(new Set(l.flatMap(e=>e.tags))).map((e,t)=>({id:t+1,name:e,slug:h(e)}));async function p(e={}){try{let t=new URLSearchParams;e.page&&t.set("page",e.page.toString()),e.limit&&t.set("limit",e.limit.toString()),e.category&&t.set("category",e.category),e.tag&&t.set("tag",e.tag),e.search&&t.set("search",e.search);let s=r.default.env.NEXT_PUBLIC_BLOG_API_URL?r.default.env.NEXT_PUBLIC_BLOG_API_URL.replace(/\/+$/,""):window.location.origin,a=`${s}/api/blogs.php?${t.toString()}`,i=await fetch(a,{next:{revalidate:60},signal:AbortSignal.timeout(2500)});if(i.ok){let t=await i.text();if(!t.trim().startsWith("<?php")){let s=JSON.parse(t);if(s.success&&s.data&&Array.isArray(s.data.blogs)&&s.data.blogs.length>0)return{blogs:s.data.blogs,pagination:s.data.pagination||{total_records:s.data.blogs.length,total_pages:1,current_page:e.page||1,limit:e.limit||9,has_next:!1,has_prev:!1}}}}}catch{}let t=[...l].sort((e,t)=>t.date.localeCompare(e.date)).map(e=>{let t=d.find(t=>t.name===e.category);return{id:e.id,category_id:t?.id??null,title:e.title,slug:e.slug,excerpt:e.description,content:e.content,featured_image:null,featured_image_alt:e.title,featured_image_url:e.image,author_name:e.author||"Entec Media Team",status:"published",meta_title:e.title,meta_description:e.description,published_at:e.date,created_at:e.date,category_name:e.category,category_slug:h(e.category),formatted_date:new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),tags:c.filter(t=>e.tags.includes(t.name))}});if(e.category&&(t=t.filter(t=>t.category_slug===e.category)),e.tag&&(t=t.filter(t=>t.tags?.some(t=>t.slug===e.tag))),e.search){let s=e.search.toLowerCase();t=t.filter(e=>e.title.toLowerCase().includes(s)||e.excerpt.toLowerCase().includes(s))}return{blogs:t,pagination:{total_records:t.length,total_pages:1,current_page:1,limit:e.limit||9,has_next:!1,has_prev:!1}}}var u=e.i(5225);let g={label:"+ INSIGHTS",title:{soft:"Ideas",after:" that",strong:"move brands"},desc:"Practical guides on websites, apps, SEO, Google Ads and Meta Ads to help your business grow online.",cta:{label:"Read more insights",href:"/blog"}};e.s(["default",0,function({posts:e,excludeSlug:a,content:i=g}){let[r,l]=(0,s.useState)(e??[]),[h,d]=(0,s.useState)(0),c=(0,s.useRef)(null),m=(0,s.useRef)(null);(0,s.useEffect)(()=>{let e=c.current;if(!e)return;f.current?.setAttribute("data-ready","");let t=new IntersectionObserver(([s])=>{s.isIntersecting&&(e.classList.add("is-in"),t.disconnect())},{rootMargin:"0px 0px -15% 0px"});return t.observe(e),()=>t.disconnect()},[r.length]),(0,s.useEffect)(()=>{let e=c.current,t=m.current;if(!e||!t||!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;let s=0,a=0,i=0,o=0,n=0,r=()=>{s+=(i-s)*.18,a+=(o-a)*.18,t.style.transform=`translate3d(${s.toFixed(1)}px, ${a.toFixed(1)}px, 0)`,n=Math.abs(i-s)+Math.abs(o-a)>.3?requestAnimationFrame(r):0},l=e=>{i=e.clientX,o=e.clientY;let l=e.target.closest(".ins-panel");if(l&&!t.classList.contains("is-on")&&(s=i,a=o),t.classList.toggle("is-on",!!l),l){let e=l.getBoundingClientRect();l.style.setProperty("--mx",((i-e.left)/e.width-.5).toFixed(3)),l.style.setProperty("--my",((o-e.top)/e.height-.5).toFixed(3))}n||(n=requestAnimationFrame(r))},h=()=>t.classList.remove("is-on");return e.addEventListener("pointermove",l),e.addEventListener("pointerleave",h),()=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerleave",h),cancelAnimationFrame(n)}},[r.length]);let f=(0,s.useRef)(null),y=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e=f.current,t=y.current,s=t?.getContext("2d");if(!e||!t||!s)return;let a="42, 39, 216",i="31, 136, 245",o=0,n=0,r=0,l=!1,h=0,d=window.scrollY,c=0,p=0,u=5,g={x:0,y:0,tx:0,ty:0,k:0,on:!1},m=[],w=[],b=[],v=e=>{let s=t.getBoundingClientRect();return{x:e.clientX-s.left,y:e.clientY-s.top}},k=t=>{let s=v(t);g.k<.05&&(g.x=s.x,g.y=s.y),g.tx=s.x,g.ty=s.y,g.on="mouse"===t.pointerType||"pen"===t.pointerType,e.style.setProperty("--ins-sx",`${(s.x/o*100).toFixed(1)}%`),e.style.setProperty("--ins-sy",`${(s.y/n*100).toFixed(1)}%`)},x=()=>g.on=!1,M=e=>{b.length<8&&b.push({...v(e),age:0,life:1.4,max:320,push:!0})};e.addEventListener("pointermove",k),e.addEventListener("pointerleave",x),e.addEventListener("pointerdown",M);let A=()=>{let e,a=Math.min(window.devicePixelRatio||1,2);o=t.clientWidth,n=t.clientHeight,t.width=Math.round(o*a),t.height=Math.round(n*a),s.setTransform(a,0,0,a,0,0),m=Array.from({length:(e=o<768)?34:62},(t,s)=>{let a=s<(e?2:4)?"hub":.18>Math.random()?"ring":"dot",i="hub"===a?10:22;return{x:Math.random()*o,y:Math.random()*n,vx:(Math.random()-.5)*i,vy:(Math.random()-.5)*i,r:"hub"===a?5:"ring"===a?3.2+1.5*Math.random():1.3+1.6*Math.random(),kind:a,ph:Math.random()*Math.PI*2,ping:1+4*Math.random()}}),w=[]},j=(e,t,a,i)=>{s.fillStyle=i,s.beginPath(),s.arc(e,t,a,0,2*Math.PI),s.fill()},S=e=>{let t=h?Math.min(.05,(e-h)/1e3):1/60;h=e,p+=t;let f=window.scrollY;for(let e of(c+=((f-d)*.2-c)*.1,d=f,g.x+=(g.tx-g.x)*.15,g.y+=(g.ty-g.y)*.15,g.k+=(!!g.on-g.k)*.08,(u-=t)<=0&&(b.push({x:o*(.15+.7*Math.random()),y:n*(.2+.6*Math.random()),age:0,life:1.6,max:260,push:!0}),u=7+5*Math.random()),b=b.filter(e=>(e.age+=t)<e.life),m)){if(e.x+=e.vx*t,e.y+=e.vy*t-.3*c,g.k>.01){let s=g.x-e.x,a=g.y-e.y,i=Math.hypot(s,a);if(i<210&&i>40){let o=(1-i/210)*26*g.k*t;e.x+=s/i*o,e.y+=a/i*o}}for(let s of b){if(!s.push)continue;let a=e.x-s.x,i=e.y-s.y,o=Math.hypot(a,i)||1,n=o-(1-Math.pow(1-s.age/s.life,3))*s.max,r=90*Math.exp(-(n*n)/900)*(1-s.age/s.life)*t;e.x+=a/o*r,e.y+=i/o*r}e.x<-20?e.x=o+20:e.x>o+20&&(e.x=-20),e.y<-20?e.y=n+20:e.y>n+20&&(e.y=-20),"hub"===e.kind&&(e.ping-=t)<=0&&(b.push({x:e.x,y:e.y,age:0,life:2.4,max:150,push:!1}),e.ping=3.5+3*Math.random())}s.clearRect(0,0,o,n);let y=[];s.lineWidth=1;for(let e=0;e<m.length;e++)for(let t=e+1;t<m.length;t++){let i=m[e],o=m[t],n=Math.hypot(i.x-o.x,i.y-o.y);n<160&&(y.push([e,t]),s.strokeStyle=`rgba(${a}, ${(.22*(1-n/160)).toFixed(3)})`,s.beginPath(),s.moveTo(i.x,i.y),s.lineTo(o.x,o.y),s.stroke())}if(w.length<(o<768?4:9)&&y.length&&.08>Math.random()){let[e,t]=y[Math.floor(Math.random()*y.length)],s=.5>Math.random();w.push({a:s?t:e,b:s?e:t,p:0,speed:.6+.6*Math.random()})}for(let e of(w=w.filter(e=>{e.p+=e.speed*t;let s=m[e.a],a=m[e.b];if(!s||!a||e.p>=1||Math.hypot(s.x-a.x,s.y-a.y)>176)return!1;let o=s.x+(a.x-s.x)*e.p,n=s.y+(a.y-s.y)*e.p,r=Math.sin(e.p*Math.PI);return j(o,n,5,`rgba(${i}, ${(.18*r).toFixed(3)})`),j(o,n,1.8,`rgba(${i}, ${(.85*r).toFixed(3)})`),!0}),b)){let t=e.age/e.life;s.strokeStyle=`rgba(${e.push?i:a}, ${((e.push?.32:.2)*(1-t)).toFixed(3)})`,s.lineWidth=e.push?1.4:1,s.beginPath(),s.arc(e.x,e.y,6+(1-Math.pow(1-t,3))*e.max,0,2*Math.PI),s.stroke()}if(g.k>.01){for(let e of(s.lineWidth=1.2,m)){let t=Math.hypot(g.x-e.x,g.y-e.y);t<210&&(s.strokeStyle=`rgba(${i}, ${(.42*(1-t/210)*g.k).toFixed(3)})`,s.beginPath(),s.moveTo(g.x,g.y),s.lineTo(e.x,e.y),s.stroke())}for(let[e,t,i]of(s.lineWidth=1,s.setLineDash([3,7]),[[46,1,.3],[92,-1,.18]]))s.lineDashOffset=-(18*p)*t,s.strokeStyle=`rgba(${a}, ${(i*g.k).toFixed(3)})`,s.beginPath(),s.arc(g.x,g.y,e,0,2*Math.PI),s.stroke();s.setLineDash([]),j(g.x,g.y,2.6,`rgba(${a}, ${(.6*g.k).toFixed(3)})`)}for(let e of m){let t=.45+.3*Math.sin(2.4*p+e.ph);if("dot"===e.kind){j(e.x,e.y,e.r,`rgba(${a}, ${t.toFixed(3)})`);continue}s.strokeStyle=`rgba(${a}, ${(t+.1).toFixed(3)})`,s.lineWidth=1.2,j(e.x,e.y,e.r,"#fff"),s.stroke(),j(e.x,e.y,"hub"===e.kind?2:1.1,`rgba(${i}, ${t.toFixed(3)})`),"hub"===e.kind&&(s.setLineDash([2,5]),s.lineDashOffset=10*p,s.strokeStyle=`rgba(${a}, 0.3)`,s.lineWidth=1,s.beginPath(),s.arc(e.x,e.y,13+1.5*Math.sin(1.5*p+e.ph),0,2*Math.PI),s.stroke(),s.setLineDash([]))}(r=l?requestAnimationFrame(S):0)||(h=0)},L=new IntersectionObserver(([e])=>{(l=e.isIntersecting)&&!r&&(d=window.scrollY,r=requestAnimationFrame(S))});A(),L.observe(e);let C=new ResizeObserver(A);return C.observe(t),()=>{e.removeEventListener("pointermove",k),e.removeEventListener("pointerleave",x),e.removeEventListener("pointerdown",M),L.disconnect(),C.disconnect(),cancelAnimationFrame(r)}},[]),(0,s.useEffect)(()=>{e||p({limit:6}).then(({blogs:e})=>{l(e.filter(e=>e.slug!==a).slice(0,5))})},[e,a]),(0,t.jsxs)("section",{id:"blog",ref:f,className:"k-section ins","data-theme":"light",children:[(0,t.jsx)("div",{className:"ins-bg","aria-hidden":"true",children:(0,t.jsxs)("div",{className:"ins-bg-sticky",children:[(0,t.jsx)("div",{className:"ins-spotlight"}),(0,t.jsx)("div",{className:"ins-fluid-blob ins-blob-1"}),(0,t.jsx)("div",{className:"ins-fluid-blob ins-blob-2"}),(0,t.jsx)("canvas",{className:"ins-net",ref:y})]})}),(0,t.jsxs)("div",{className:"container",children:[(0,t.jsxs)("div",{className:"why-top-layout k-section-head",style:{marginBottom:"clamp(36px, 4.5vw, 64px)"},children:[(0,t.jsx)("div",{className:"why-col-left",children:(0,t.jsx)("span",{className:"why-section-label",children:i.label})}),(0,t.jsx)("div",{className:"why-col-center",children:(0,t.jsxs)("h2",{className:"why-main-title",children:[(0,t.jsx)("span",{className:"text-gradient",children:i.title.soft}),i.title.after,(0,t.jsx)("br",{}),i.title.strong]})}),(0,t.jsxs)("div",{className:"why-col-right",children:[(0,t.jsx)("p",{className:"why-header-desc",children:i.desc}),(0,t.jsx)("div",{style:{marginTop:"20px"},children:(0,t.jsx)(u.default,{href:i.cta.href,label:i.cta.label})})]})]}),r.length?(0,t.jsx)("div",{className:"ins-panels",ref:c,children:r.map((e,a)=>{let i=a===h,r=e.content?Math.max(1,Math.round(e.content.replace(/<[^>]+>/g," ").trim().split(/\s+/).length/200)):null;return(0,t.jsxs)(n.default,{href:`/blog/${e.slug}`,className:`ins-panel k-btn-host ${i?"is-open":""}`,style:{"--k":a},onMouseEnter:()=>d(a),onFocus:()=>d(a),onClick:e=>{i||window.matchMedia("(max-width: 991px)").matches||(e.preventDefault(),d(a))},children:[(0,t.jsx)(o,{src:e.featured_image_url||"/images/aboutimg.webp",alt:e.featured_image_alt||e.title,className:"ins-panel-img",style:{position:"absolute",inset:0,width:"100%",height:"100%"},sizes:"(max-width: 991px) 100vw, 60vw"}),(0,t.jsx)("span",{className:"ins-panel-shade","aria-hidden":"true"}),(0,t.jsx)("span",{className:"ins-panel-big","aria-hidden":"true",children:String(a+1).padStart(2,"0")}),(0,t.jsx)("span",{className:"ins-panel-num",children:String(a+1).padStart(2,"0")}),(0,t.jsx)("span",{className:"ins-panel-spine","aria-hidden":"true",children:e.title}),(0,t.jsxs)("span",{className:"ins-panel-body",children:[(0,t.jsxs)("span",{className:"ins-panel-meta",children:[e.category_name&&(0,t.jsx)("b",{children:e.category_name}),(0,t.jsxs)("span",{children:[e.formatted_date,r&&` \xb7 ${r} min read`]})]}),(0,t.jsx)("h3",{className:"ins-panel-title","aria-label":e.title,children:e.title.split(" ").map((e,a)=>(0,t.jsxs)(s.Fragment,{children:[(0,t.jsx)("span",{className:"ins-w","aria-hidden":"true",children:(0,t.jsx)("span",{style:{"--w":a},children:e})})," "]},a))}),(0,t.jsx)("span",{className:"ins-panel-excerpt",children:e.excerpt}),(0,t.jsx)(u.default,{as:"span",label:"Read article",variant:"dark",className:"ins-panel-cta"})]})]},e.slug)})}):(0,t.jsx)("div",{className:"ins-panels","aria-hidden":"true",children:[0,1,2,3,4].map(e=>(0,t.jsx)("div",{className:`ins-skel ins-panel ${0===e?"is-open":""}`},e))})]}),(0,t.jsx)("div",{className:"ins-cursor",ref:m,"aria-hidden":"true",children:(0,t.jsxs)("span",{className:"ins-cursor-inner",children:[(0,t.jsxs)("svg",{className:"ins-cursor-ring",viewBox:"0 0 100 100",children:[(0,t.jsx)("defs",{children:(0,t.jsx)("path",{id:"ins-ring",d:"M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0"})}),(0,t.jsx)("text",{children:(0,t.jsx)("textPath",{href:"#ins-ring",textLength:"224",lengthAdjust:"spacing",children:"READ ARTICLE • READ ARTICLE •"})})]}),(0,t.jsx)("svg",{className:"ins-cursor-arrow",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("path",{d:"M7 17L17 7M9 7h8v8"})})]})})]})}],91012)},53177,e=>{"use strict";var t=e.i(43476),s=e.i(71645);e.s(["default",0,function({children:e,className:a=""}){let i=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e=i.current;if(!e)return;let t=()=>{let t=Math.min(110,window.innerHeight-e.offsetHeight-24);e.style.setProperty("--side-top",`${Math.round(t)}px`)};t();let s=new ResizeObserver(t);return s.observe(e),window.addEventListener("resize",t),()=>{s.disconnect(),window.removeEventListener("resize",t)}},[]),(0,t.jsx)("aside",{ref:i,className:a,style:{"--side-top":"110px"},children:e})}])},26405,e=>{e.v(t=>Promise.all(["static/chunks/0nxfznpj-13q5.js"].map(t=>e.l(t))).then(()=>t(17968)))},75583,e=>{e.v(t=>Promise.all(["static/chunks/0esk8q2puwbeq.js"].map(t=>e.l(t))).then(()=>t(62187)))}]);