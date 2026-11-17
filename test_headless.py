import asyncio,base64,os
from playwright.async_api import async_playwright
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
open('/tmp/t.png','wb').write(PNG)
HERE=os.path.dirname(os.path.abspath(__file__));SHOTS='/workspace/constructor_shots';os.makedirs(SHOTS,exist_ok=True)
NEW=[11,12,13,19,20,25,26,31,32,34,35,36,47,48,49,50,51,52,53,54,59,62,63]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(channel="chrome");pg=await b.new_page(viewport={'width':1400,'height':1000})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto('file://'+HERE+'/index.html')
    n=await pg.evaluate('T.length');print('templates',n)
    await pg.set_input_files('#fImg',['/tmp/t.png','/tmp/t.png']);await pg.wait_for_timeout(300)
    bad=[]
    for lang in ('ru','kz'):
      await pg.click(f'#langSw [data-lang="{lang}"]')
      for i in range(1,n+1):
        await pg.select_option('#sTpl',str(i));await pg.wait_for_timeout(40)
        pdf = lang=='ru' or i in (2,3,30,38)
        r=await pg.evaluate('''async(pdf)=>{const n=document.querySelectorAll('#pages .page').length;const c=document.querySelectorAll('#pages .cell,#pages td,#pages svg').length;
          let out=-1,np=-1;if(pdf){const d=await exportPDF();out=d.output('arraybuffer').byteLength;np=d.getNumberOfPages()}return [n,c,out,np]}''',pdf)
        ok=r[0]>0 and r[1]>0 and (not pdf or (r[2]>3000 and r[3]==r[0]))
        if not ok: bad.append((lang,i,r))
        if lang=='kz' and i in (2,3,6,38,30): await pg.screenshot(path=f'{SHOTS}/kz_{i:02d}.png')
        if lang=='ru' and (i in NEW or i in (3,29,30,46)): await pg.locator('#preview .pw').first.screenshot(path=f'{SHOTS}/ru_{i:02d}.png')
      print(lang,'done')
    for i in (2,16,30):
      await pg.select_option('#sTpl',str(i))
      z=await pg.evaluate('async()=>(await exportDocx()).length')
      if z<3000: bad.append(('docx',i,z))
    miss=await pg.evaluate('kzMissing().length');print('kz missing strings',miss)
    print('BAD',bad,'ERR',errs[:10]); await b.close()
    assert not bad and not errs
asyncio.run(main())
