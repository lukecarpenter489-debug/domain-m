
async function checkApi(){
  const el=document.getElementById('apiStatus');
  if(!el) return;
  try{
    const res=await fetch('/.netlify/functions/api?domain=brad.crypto&health=1');
    const txt=await res.text();
    if(res.status===500 && txt.includes('Missing Netlify')){
      el.innerHTML='<span class="bad">API key missing in Netlify Environment Variables</span>';
    } else if(res.status===404 || txt.includes('Page not found')) {
      el.innerHTML='<span class="bad">Function not deployed. Use Netlify site from Git or Netlify CLI, not plain Drop.</span>';
    } else {
      el.innerHTML='<span class="ok">connected</span>';
    }
  }catch(e){
    el.innerHTML='<span class="bad">not connected</span>';
  }
}
async function searchDomain(){
  const input=document.getElementById('domainSearch');
  const out=document.getElementById('result');
  const d=input.value.trim();
  if(!d){out.textContent='Enter a domain first.';return;}
  out.textContent='Searching...';
  try{
    const res=await fetch('/.netlify/functions/api?domain='+encodeURIComponent(d));
    const text=await res.text();
    if(text.includes('<!DOCTYPE html') && text.includes('Page not found')){
      out.textContent='Netlify did not deploy the function. This happens if the site was uploaded with Netlify Drop only. Upload this ZIP using Netlify with Functions enabled or connect it to GitHub.';
      return;
    }
    out.textContent=text;
  }catch(e){
    out.textContent='Could not search. Check Netlify Environment Variables and redeploy.';
  }
}
checkApi();
