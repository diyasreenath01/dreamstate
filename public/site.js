const $=s=>document.querySelector(s);
let bag=[];try{const stored=JSON.parse(localStorage.getItem('dreamstate-bag')||'[]');if(Array.isArray(stored))bag=stored.filter(x=>['XS','S','M','L','XL'].includes(x.size)).slice(0,100)}catch{}
const save=()=>{localStorage.setItem('dreamstate-bag',JSON.stringify(bag));renderBag()};
function renderBag(){const count=$('#cart-count');if(count)count.textContent='('+bag.length+')';const items=$('#bag-items');if(items){items.replaceChildren();if(!bag.length){const p=document.createElement('p');p.textContent='YOUR BAG IS EMPTY.';items.append(p)}bag.forEach((item,i)=>{const row=document.createElement('div');row.className='bag-item';const label=document.createElement('span');label.textContent='DS-001 / '+item.size;const btn=document.createElement('button');btn.textContent='REMOVE';btn.addEventListener('click',()=>{bag.splice(i,1);save()});row.append(label,btn);items.append(row)})}}
renderBag();
$('#cart-trigger')?.addEventListener('click',()=>$('#bag-dialog')?.showModal());
$('#bag-close')?.addEventListener('click',()=>$('#bag-dialog')?.close());
$('#bag-signup')?.addEventListener('click',()=>$('#bag-dialog')?.close());
$('#menu-toggle')?.addEventListener('click',()=>$('#nav-links')?.classList.toggle('open'));
let selectedSize='M';document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{selectedSize=b.dataset.size;document.querySelectorAll('[data-size]').forEach(x=>x.classList.toggle('active',x===b))}));
$('#add-bag')?.addEventListener('click',()=>{const quantity=Math.max(1,Math.min(10,Number.parseInt($('#quantity')?.value||'1',10)||1));for(let i=0;i<quantity;i++)bag.push({size:selectedSize});bag=bag.slice(-100);save();$('#bag-dialog')?.showModal()});
$('#signup-form')?.addEventListener('submit',e=>{e.preventDefault();const msg=$('#signup-message');if(msg)msg.textContent='Email registration is not connected yet. No email has been submitted.'});
const information={
size:['SIZE GUIDE','Planned sizes: XS, S, M, L, XL. Final garment measurements are pending sample approval.'],
description:['DESCRIPTION','DS-001: unisex relaxed bootcut denim. Product specifications and final images will be confirmed before launch.'],
delivery:['DELIVERY','Delivery locations, shipping fees and delivery times will be published before orders open.'],
payment:['PAYMENT','Checkout is not yet available. No payment can be taken on this preview website.'],
help:['HELP','Customer support details will be available on the Contact page before launch.']
};
document.querySelectorAll('[data-info]').forEach(btn=>btn.addEventListener('click',()=>{const entry=information[btn.dataset.info];if(!entry)return;$('#product-info-title').textContent=entry[0];$('#product-info-content').textContent=entry[1];$('#product-info-dialog')?.showModal()}));
$('#product-info-close')?.addEventListener('click',()=>$('#product-info-dialog')?.close());
$('#store-language')?.addEventListener('change',e=>{e.target.value='en'});
$('#store-currency')?.addEventListener('change',e=>{document.querySelectorAll('.store-currency-note').forEach(x=>x.remove());const note=document.createElement('div');note.className='store-currency-note';note.textContent='Currency display is a preview. Live exchange rates and prices are not configured.';note.setAttribute('role','status');document.querySelector('.store-actions')?.append(note)});
const heroVideo=document.querySelector('.ds-hero-video');if(heroVideo&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)heroVideo.pause();

/* Small product catalogue search */
const searchInput=$('#store-search-input');const searchQuery=new URLSearchParams(location.search).get('q')||'';
if(searchInput&&searchQuery)searchInput.value=searchQuery;
if(location.pathname.replace(/\/$/,'')==='/shop'&&searchQuery.trim()){
 const matches=/ds[\s-]*0*1|jean|denim|bootcut|relaxed|pant|trouser|dreamstate/i.test(searchQuery.trim());
 document.querySelectorAll('.store-product-card').forEach(card=>card.hidden=!matches);
 const heading=document.querySelector('.store-section-heading h1');if(heading)heading.textContent='SEARCH RESULTS';
 const note=document.createElement('p');note.className='store-search-result';note.textContent=matches?'RESULTS FOR “'+searchQuery+'”':'NO PRODUCTS FOUND FOR “'+searchQuery+'”';
 document.querySelector('.store-product-grid')?.after(note);
}


/* DREAMSTATE RADIO — selection changes visual label and streaming search, not audio playback */
const radioTracks=[['RETARD ANGEL 18','FAKEMINK'],['NIGHT, BLOOMING JASMINE','FAKEMINK'],['MUSIC AND ME','FAKEMINK'],['ANGELWITHNOWINGS','BLONDE SUPREMACY'],['FEVER','FAKEMINK'],['MILK & HONEY','FAKEMINK']];
document.querySelectorAll('.ds-track').forEach(button=>button.addEventListener('click',()=>{
 const idx=Number(button.dataset.track);const track=radioTracks[idx];if(!track)return;
 document.querySelectorAll('.ds-track').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 const title=document.querySelector('#ds-radio-current');const artist=document.querySelector('#ds-radio-artist');const link=document.querySelector('#ds-radio-listen');
 if(title)title.textContent=track[0];if(artist)artist.textContent=track[1];
 if(link)link.href=dsSoundCloudUrls[idx]||'https://soundcloud.com/search/sounds?q='+encodeURIComponent(track[1]+' '+track[0]);
 const disc=document.querySelector('#ds-record');if(disc){disc.classList.remove('ds-record-changed');void disc.offsetWidth;disc.classList.add('ds-record-changed')}
}));

/* Official SoundCloud playback. Only use artist-approved, verified track URLs. */
const dsSoundCloudUrls=['https://soundcloud.com/fakemink/retard-angel-18',null,null,null,null,null];
function dsLoadSoundCloudTrack(index){
 const panel=document.querySelector('#ds-sc-player');if(!panel)return;
 panel.replaceChildren();
 const url=dsSoundCloudUrls[index];
 if(!url){const p=document.createElement('p');p.textContent='Official SoundCloud upload not linked yet. Use “Find on SoundCloud” to look for this track.';panel.append(p);return}
 const frame=document.createElement('iframe');
 frame.title='SoundCloud official track player';frame.loading='lazy';frame.allow='autoplay';
 frame.referrerPolicy='strict-origin-when-cross-origin';
 frame.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(url)+'&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false';
 panel.append(frame);
}
document.querySelectorAll('.ds-track').forEach(b=>b.addEventListener('click',()=>dsLoadSoundCloudTrack(Number(b.dataset.track))));
dsLoadSoundCloudTrack(0);
