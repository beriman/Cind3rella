/** @author Beriman Juliano | UI regression tests; no messages are sent. */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const url = process.env.TEST_URL || 'http://127.0.0.1:4186/';
const output = process.env.QA_OUTPUT || path.join(os.tmpdir(), 'cind3rella-visual-qa');
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage({viewport:{width:1440,height:960}});
const checks=[], errors=[], failedLocal=[];
const check=(name,pass,detail='')=>{checks.push({name,pass,detail});console.log(pass?'PASS':'FAIL',name,detail);};
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400 && new URL(r.url()).origin===new URL(url).origin) failedLocal.push({url:r.url(),status:r.status()});});
try {
 await page.goto(url,{waitUntil:'networkidle',timeout:45000});
 await page.evaluate(()=>document.fonts.ready);
 check('identity',(await page.title()).includes('Cind3rella'));
 check('author',await page.locator('meta[name="author"]').getAttribute('content')==='Beriman Juliano');
 check('10 visual assets',await page.locator('.studio-card').count()===10);
 check('5 music tracks',await page.locator('.track-row').count()===5);
 check('no automatic playback',await page.locator('audio').evaluate(a=>a.paused && !a.getAttribute('src')));
 check('no initial YouTube iframe',await page.locator('iframe').count()===0);
 check('no framework error',await page.locator('vite-error-overlay').count()===0);
 for(const width of [1440,768,390,360,320]){
  await page.setViewportSize({width,height:width===1440?960:844});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
  check(`hero source ${width}`,await page.locator('.cinematic-scene img').evaluate((img,w)=>img.currentSrc.endsWith(w<=700?'moonlit-trio.webp':'hero-cinematic.webp'),width));
  if(width===1440||width===390)await page.screenshot({path:path.join(output,`hero-${width}.png`)});
  for(const selector of ['#musik','#cerita','#galeri','.video-section','#panggung','#terhubung','#booking','footer']){
    await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(120);
  }
  await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
  check(`layout ${width}`,layout.scroll<=width && layout.broken.length===0,JSON.stringify(layout));
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
  if(width===1440||width===390)await page.screenshot({path:path.join(output,`full-${width}.png`),fullPage:true});
 }
 await page.setViewportSize({width:1440,height:960});
 await page.locator('[data-filter="studio"]').click();check('studio filter',await page.locator('.studio-card:visible').count()===7);
 await page.locator('[data-filter="artwork"]').click();check('artwork filter',await page.locator('.studio-card:visible').count()===3);
 await page.locator('[data-filter="all"]').click();check('all filter',await page.locator('.studio-card:visible').count()===10);
 await page.locator('#galeri').screenshot({path:path.join(output,'gallery-desktop.png')});
 await page.locator('.studio-card').first().click();check('lightbox opens',await page.locator('#art-dialog').isVisible());
 check('image displayed',await page.locator('#art-image').evaluate(i=>i.src.endsWith('studio-full.webp')));
 await page.keyboard.press('ArrowRight');check('keyboard next',await page.locator('#art-image').evaluate(i=>i.src.endsWith('studio-denim.webp')));
 await page.locator('#art-prev').click();check('previous button',await page.locator('#art-image').evaluate(i=>i.src.endsWith('studio-full.webp')));
 await page.locator('#art-prev').click();check('wrap previous',await page.locator('#art-image').evaluate(i=>i.src.endsWith('studio-editorial.webp')));
 check('creative disclosure',(await page.locator('#art-description').textContent()).includes('busana'));
 await page.screenshot({path:path.join(output,'lightbox-desktop.png')});await page.keyboard.press('Escape');
 check('close and focus',!(await page.locator('#art-dialog').isVisible())&&await page.locator('.studio-card').first().evaluate(e=>e===document.activeElement));
 await page.locator('[data-filter="artwork"]').click();await page.locator('.studio-card:visible').first().click();
 await page.locator('#art-next').click();await page.locator('#art-next').click();await page.locator('#art-next').click();
 check('filtered lightbox wraps',await page.locator('#art-image').evaluate(i=>i.src.endsWith('hero-cinematic.webp')));
 await page.locator('#art-close').click();await page.locator('[data-filter="all"]').click();
 await page.locator('.gallery-photo').first().click();check('live gallery preserved',await page.locator('#media-dialog img').isVisible());await page.keyboard.press('Escape');
 await page.locator('.hero-video').click();check('official video dialog',await page.locator('#media-dialog iframe').getAttribute('src')==='https://www.youtube-nocookie.com/embed/uwSyivDS8qY?autoplay=1&rel=0');
 await page.keyboard.press('Escape');await page.waitForTimeout(100);check('video cleanup',await page.locator('iframe').count()===0);
 await page.locator('#open-booking').click();await page.locator('#booking-form button[type="submit"]').click();check('form required validation',!(await page.locator('#booking-send').isVisible()));
 await page.locator('[name="organizer"]').fill('QA only - not sent');await page.locator('[name="eventType"]').selectOption('Festival / konser');
 const date=new Date();date.setFullYear(date.getFullYear()+1);await page.locator('[name="date"]').fill(date.toISOString().slice(0,10));
 await page.locator('[name="location"]').fill('Bogor');await page.locator('#booking-form button[type="submit"]').click();
 check('draft only',await page.locator('#booking-send').isVisible()&&(await page.locator('#booking-send').getAttribute('href')).startsWith('https://wa.me/6281807282200?text='));await page.keyboard.press('Escape');
 await page.locator('#credits-button').click();check('honest image credits',(await page.locator('#credits-dialog').innerText()).includes('artwork generatif'));await page.keyboard.press('Escape');
 await page.locator('#motion-toggle').click();check('motion toggle',await page.locator('body').evaluate(b=>b.classList.contains('motion-off')));
 await page.reload({waitUntil:'networkidle'});check('motion persists',await page.locator('body').evaluate(b=>b.classList.contains('motion-off')));
 await page.locator('#motion-toggle').click();await page.emulateMedia({reducedMotion:'reduce'});check('system reduced motion',await page.locator('body').evaluate(b=>b.classList.contains('motion-off')));await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.locator('.menu-toggle').click();check('mobile navigation opens',await page.locator('#mobile-menu').isVisible());await page.locator('#mobile-menu a[href="#galeri"]').click();check('gallery navigation closes menu',!(await page.locator('#mobile-menu').isVisible()));
 await page.locator('.studio-card').first().click();check('mobile lightbox fits',await page.locator('#art-dialog').evaluate(d=>d.getBoundingClientRect().width<=innerWidth));await page.keyboard.press('Escape');
 const before=await page.locator('.cinematic-scene picture').evaluate(e=>e.style.getPropertyValue('--parallax-y'));
 await page.evaluate(()=>scrollTo({top:220,behavior:'instant'}));await page.waitForTimeout(200);const after=await page.locator('.cinematic-scene picture').evaluate(e=>e.style.getPropertyValue('--parallax-y'));check('parallax update',before!==after);
 check('no local asset errors',failedLocal.length===0,JSON.stringify(failedLocal));check('no JavaScript runtime errors',errors.length===0,JSON.stringify(errors));
} catch(error){check('test execution',false,error.message);await page.screenshot({path:path.join(output,'failure.png')}).catch(()=>{});}
await fs.writeFile(path.join(output,'results.json'),JSON.stringify({creator:'Beriman Juliano',url,checkedAt:new Date().toISOString(),checks,errors,failedLocal},null,2));
await browser.close();console.log(`RESULT ${checks.filter(c=>c.pass).length}/${checks.length}`,output);if(checks.some(c=>!c.pass))process.exitCode=1;
