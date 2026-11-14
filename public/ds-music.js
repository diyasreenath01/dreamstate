/* DREAMSTATE — licensed background track, started by visitor interaction. */
(function(){
 const button=document.getElementById('ds-sound-toggle');
 if(!button)return;
 const audio=document.createElement('audio');
 audio.src='/danyvin-cloud-rap-587259.mp3';
 audio.loop=true;audio.preload='auto';audio.volume=0.7;
 audio.setAttribute('playsinline','');
 document.body.appendChild(audio);
 let enabled=false;
 function label(){
  button.textContent=enabled?'◖ SOUND ON':'◗ SOUND OFF';
  button.setAttribute('aria-pressed',String(enabled));
 }
 async function play(){
  enabled=true;label();
  try{
   await audio.play();
   sessionStorage.setItem('ds-music-enabled','1');
  }catch(err){
   enabled=false;label();
  }
 }
 function pause(){
  enabled=false;audio.pause();label();
  try{sessionStorage.setItem('ds-music-enabled','0')}catch(e){}
 }
 button.addEventListener('click',function(e){
  e.stopPropagation();
  if(enabled)pause();else play();
 });
 // A visitor gesture enables audio under modern browser autoplay policies.
 document.addEventListener('click',function(e){
  if(enabled||e.target.closest('#ds-sound-toggle'))return;
  let intent;try{intent=sessionStorage.getItem('ds-music-enabled')}catch(err){}
  if(intent==='0')return;
  play();
 },{capture:true});
 label();
})();