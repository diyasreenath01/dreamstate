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
