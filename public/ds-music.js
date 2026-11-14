/* DREAMSTATE ORIGINAL LOOP — synthesized in-browser, no third-party samples.
   Audio begins only after a visitor gesture. */
(function(){
 const button=document.getElementById('ds-sound-toggle');
 if(!button)return;
 const AudioContext=window.AudioContext||window.webkitAudioContext;
 if(!AudioContext){button.hidden=true;return}
 const BPM=92, beat=60/BPM, bar=beat*4, loopBars=4;
 let ctx,master,delay,feedback,wet,noiseBuffer,playing=false,nextTime=0,step=0,scheduler;
 let volume=0.27;
 const notes=[55,55,46.25,41.2,55,61.74,46.25,41.2];
 function setup(){
  ctx=new AudioContext();master=ctx.createGain();master.gain.value=volume;
  const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-20;compressor.ratio.value=3;
  master.connect(compressor);compressor.connect(ctx.destination);
  delay=ctx.createDelay(1);delay.delayTime.value=beat*.75;
  feedback=ctx.createGain();feedback.gain.value=.24;
  wet=ctx.createGain();wet.gain.value=.16;
  delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(master);
  noiseBuffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.6),ctx.sampleRate);
  const data=noiseBuffer.getChannelData(0);let seed=137;
  for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/2147483648-1)}
 }
 function osc(t,f,d,shape,level,cutoff,send){
  const o=ctx.createOscillator(),g=ctx.createGain(),filter=ctx.createBiquadFilter();
  o.type=shape;o.frequency.setValueAtTime(f,t);
  filter.type='lowpass';filter.frequency.value=cutoff||900;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,level),t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(filter);filter.connect(g);g.connect(master);if(send)g.connect(delay);
  o.start(t);o.stop(t+d+.05);
 }
 function kick(t){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
  o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(44,t+.15);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.7,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.39);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+.41);
 }
 function noise(t,d,level,hp){
  const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
  s.buffer=noiseBuffer;f.type='highpass';f.frequency.value=hp;
  g.gain.setValueAtTime(Math.max(.0001,level),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+.01);
 }
 function snare(t){noise(t,.17,.16,1200);osc(t,185,.11,'triangle',.12,1100,false)}
 function hat(t,open){noise(t,open?.2:.045,open?.065:.042,6500)}
 function schedule(t,n){
  const pos=n%16,measure=Math.floor(n/16)%4;
  if(pos===0||pos===7||pos===10)kick(t);
  if(pos===4||pos===12)snare(t);
  if(pos%2===0)hat(t,pos===14);
  if(pos===3||pos===11)hat(t);
  if(pos===0||pos===6||pos===10||pos===14){
   const f=notes[(measure*2+Math.floor(pos/8))%notes.length];
   osc(t,f,.38,'sine',.23,190,false);
  }
  if(pos===0&&measure%2===0){
   const root=measure===0?220:184.997;
   osc(t,root,bar*1.7,'triangle',.025,620,true);
   osc(t,root*1.498,bar*1.6,'sine',.014,1100,true);
  }
  if(pos===2||pos===13){osc(t,440*(measure%2?0.84:1),beat*.44,'triangle',.025,1000,true)}
 }
 function tick(){if(!ctx||!playing)return;while(nextTime<ctx.currentTime+.12){schedule(nextTime,step);nextTime+=beat/4;step++}}
 function setLabel(){button.textContent=playing?'◖ SOUND ON':'◗ SOUND OFF';button.setAttribute('aria-pressed',String(playing))}
 async function start(){
  if(!ctx)setup();
  try{await ctx.resume()}catch(e){return}
  playing=true;nextTime=ctx.currentTime+.04;
  if(scheduler)clearInterval(scheduler);scheduler=setInterval(tick,25);tick();setLabel();
  try{sessionStorage.setItem('ds-music-enabled','1')}catch(e){}
 }
 function stop(){
  playing=false;if(scheduler)clearInterval(scheduler);scheduler=null;
  if(ctx){ctx.suspend().catch(()=>{})}setLabel();
  try{sessionStorage.setItem('ds-music-enabled','0')}catch(e){}
 }
 button.addEventListener('click',function(e){e.stopPropagation();if(playing)stop();else start()});
 // First click on the website starts the original soundtrack.
 document.addEventListener('pointerdown',function(e){
  if(playing||e.target.closest('#ds-sound-toggle')||e.target.closest('input,textarea,select'))return;
  start();
 },{passive:true});
 // Browser audio policies require a new gesture after full-page navigation.
 // Remember intent, then resume on the next interaction if necessary.
 setLabel();
})();