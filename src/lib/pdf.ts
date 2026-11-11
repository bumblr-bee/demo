import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
export async function exportPDF(root:HTMLElement):Promise<Blob>{
  await document.fonts.ready;
  const deadline=Date.now()+15000;while(root.dataset.ready!=='true'){if(root.dataset.layoutError)throw new Error(root.dataset.layoutError);if(Date.now()>deadline)throw new Error('The preview is still loading. Please try again.');await new Promise(r=>setTimeout(r,50));}
  await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));
  const pages=Array.from(root.querySelectorAll<HTMLElement>('[data-page]'));
  if(!pages.length)throw new Error('No invoice pages are ready.');
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
  for(let i=0;i<pages.length;i++){
    const page=pages[i];await Promise.all(Array.from(page.querySelectorAll('img')).map(img=>img.decode()));
    const png=await toPng(page,{pixelRatio:3.125,width:794,height:1123,backgroundColor:'#fff',style:{transform:'none'},cacheBust:false});
    if(i)doc.addPage('a4','portrait');doc.addImage(png,'PNG',0,0,210,297,undefined,'FAST');
  }
  doc.setProperties({title:'Katha Chitra invoice',creator:'Katha Chitra Bill Studio v0.1'});return doc.output('blob');
}
export function downloadPDF(blob:Blob,number:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=number.replace(/[^a-zA-Z0-9_-]/g,'_')+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
