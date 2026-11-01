import asyncio,base64,os
from playwright.async_api import async_playwright
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
open('/tmp/t.png','wb').write(PNG)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto('file:///workspace/aba_constructor/index.html')
    await pg.set_input_files('#fImg',['/tmp/t.png','/tmp/t.png']);await pg.wait_for_timeout(300)
    bad=[]
    for i in range(1,41):
      await pg.select_option('#sTpl',str(i));await pg.wait_for_timeout(50)
      if i in(1,13,30): await pg.click('#bFill')
      r=await pg.evaluate('''async()=>{const n=document.querySelectorAll('#pages .page').length;const c=document.querySelectorAll('#pages .cell,#pages td,#pages svg').length;
        const pdf=await exportPDF();const out=pdf.output('arraybuffer').byteLength;return [n,c,out,pdf.getNumberOfPages()]}''')
      ok=r[0]>0 and r[1]>0 and r[2]>3000
      if not ok: bad.append((i,r))
      print(i,r)
      if i in(1,3,10,14,23,24,25,27,29,35): await pg.screenshot(path=f'/tmp/s{i}.png')
    print('BAD',bad,'ERR',errs[:5]); await b.close()
asyncio.run(main())
