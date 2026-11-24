/* DREAMSTATE / optional cinematic ambience and an unlisted archive fragment */
(function(){
  if(!document.querySelector('.ds-landing'))return;
  const atmosphere=document.createElement('div');atmosphere.className='ds-dream-atmosphere';atmosphere.setAttribute('aria-hidden','true');document.querySelector('.ds-landing').append(atmosphere);
  const star=document.createElement('button');star.type='button';star.className='ds-secret-trigger';star.textContent='✦';star.title='A hidden fragment';star.setAttribute('aria-label','Discover a hidden Dreamstate page');
  document.body.append(star);
  star.addEventListener('click',()=>{window.location.assign('/other-side')});
})();
