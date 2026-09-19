emailjs.init("eOnK3qvUFiw89dhdV");
const SERVICE_ID="service_147bn6m"; const TEMPLATE_ID="template_kndbrqg";
const ADMIN="markobinna120@gmail.com";
const APPS=[{id:"Facebook",logo:"https://cdn.simpleicons.org/facebook/1877F2"},{id:"Instagram",logo:"https://cdn.simpleicons.org/instagram/E4405F"},{id:"TikTok",logo:"https://cdn.simpleicons.org/tiktok/000000"},{id:"YouTube",logo:"https://cdn.simpleicons.org/youtube/FF0000"},{id:"Twitter/X",logo:"https://cdn.simpleicons.org/x/000000"},{id:"WhatsApp",logo:"https://cdn.simpleicons.org/whatsapp/25D366"},{id:"Telegram",logo:"https://cdn.simpleicons.org/telegram/26A5E4"},{id:"Website",logo:"https://cdn.simpleicons.org/googlechrome/4285F4"}];
const PRICES={"Like a post":{adv:12,earn:4},"Like a video":{adv:12,earn:4},"Watch a video":{adv:12,earn:4},"View a video":{adv:11,earn:3},"Comment on a video":{adv:12,earn:5},"Custom comment":{adv:35,earn:8},"Share a post":{adv:12,earn:4},"Join a group":{adv:30,earn:7},"Follow/subscribe to a channel":{adv:30,earn:7},"Follow a page":{adv:12,earn:5},"Subscribe to a channel":{adv:30,earn:7},"Start a telegram bot":{adv:35,earn:10},"Website Signup":{adv:35,earn:10},"Website Vote":{adv:10,earn:3},"Website Visit":{adv:10,earn:3}};
let curUser=null,curTask=null,currentPage=1,perPage=10,selectedApp="Facebook"; let authMode='signin';
function genRefCode(email){return email.split('@')[0].replace(/[^a-z0-9]/gi,'').toLowerCase()+Math.floor(100+Math.random()*900);}
function init(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
if(!users.find(u=>u.email===ADMIN)){users.push({email:ADMIN,username:'Admin Mark',password:'Admin123',status:'active',av:0,pd:0,dep:0,totalSpent:0,refCode:'admin120',referredBy:null,refEarn:0,hasWithdrawn:false});}
users.forEach(u=>{if(!u.refCode)u.refCode=genRefCode(u.email); if(u.refEarn===undefined)u.refEarn=0; if(u.hasWithdrawn===undefined)u.hasWithdrawn=false; if(u.totalSpent===undefined)u.totalSpent=0; if(u.av===undefined)u.av=0; if(u.pd===undefined)u.pd=0; if(u.dep===undefined)u.dep=0;});
localStorage.setItem('mt_users',JSON.stringify(users));
let grid=document.getElementById('appGrid');
if(grid){grid.innerHTML='';APPS.forEach(a=>{let d=document.createElement('div');d.style.cssText='background:#fff;border:2px solid #eee;border-radius:14px;padding:12px;text-align:center;cursor:pointer';d.innerHTML=`<img src="${a.logo}" style="width:45px;height:45px;border-radius:50%"><br><small style="font-weight:bold;font-size:11px">${a.id}</small>`;d.onclick=()=>selectApp(a.id);d.id='app_'+a.id;grid.appendChild(d);});selectApp('Facebook');}
let urlParams=new URLSearchParams(window.location.search);let ref=urlParams.get('ref');if(ref){let refInput=document.getElementById('aRef'); if(refInput){refInput.value=ref; setAuthMode('signup');}}
setAuthMode('signin');checkLogin();
}
function setAuthMode(mode){authMode=mode;let tabIn=document.getElementById('tabSignIn'); let tabUp=document.getElementById('tabSignUp');let userInput=document.getElementById('aUser'); let authBtn=document.getElementById('authBtn');let switchBtn=document.getElementById('switchBtn'); let codeInput=document.getElementById('aCode'); let refInput=document.getElementById('aRef');if(!tabIn)return;if(mode==='signin'){tabIn.className='active'; tabUp.className='inactive';userInput.classList.add('hidden'); codeInput.classList.add('hidden'); refInput.classList.add('hidden');authBtn.textContent='Sign In'; switchBtn.textContent="Don't have account? Sign Up";}else{tabIn.className='inactive'; tabUp.className='active';userInput.classList.remove('hidden'); refInput.classList.remove('hidden');authBtn.textContent='Sign Up - Send Code'; switchBtn.textContent="Already have account? Sign In";}document.getElementById('emailStatus').textContent='';}
function toggleAuthMode(){setAuthMode(authMode==='signin'?'signup':'signin');}
function selectApp(id){selectedApp=id;let all=document.querySelectorAll('#appGrid div');all.forEach(x=>x.style.borderColor='#eee');let el=document.getElementById('app_'+id);if(el)el.style.borderColor='#0a7e07';let txt=document.getElementById('selectedAppText');if(txt)txt.textContent='Selected: '+id+' ✓';loadTypes();}
function loadTypes(){let sel=document.getElementById('pType');if(!sel)return;sel.innerHTML='';let opts=[];
if(selectedApp==='YouTube'){opts=["Subscribe to a channel","Like a post","Watch a video","Comment on a video","Custom comment","Share a post"];}
else if(selectedApp==='Facebook'){opts=["Follow a page","Like a video","View a video","Comment on a video","Custom comment","Share a post","Join a group"];}
else if(selectedApp==='Instagram'){opts=["Follow a page","Like a video","View a video","Comment on a video","Custom comment","Share a post"];}
‎else if(selectedApp==='Tiktok'){opts=["Follow a page","Like a video","View a video","Comment on a video","Custom comment","Share a post"];}
else if(selectedApp==='Twitter/X'){opts=["Follow a page","Like a video","View a video","Comment on a video","Custom comment","Share a post"];}
‎else if(selectedApp==='WhatsApp'){opts=["join a group","follow a channel"];}     
‎else if(selectedApp==='telegram'){opts=["join a group","follow/subscribe to a channel","start a telegram bot"];} 
‎else if(selectedApp==='website'){opts=["website sign up","website visit","website vote"];}                      
opts.forEach(o=>{let e=document.createElement('option');e.value=o;let p=PRICES[o]?PRICES[o].adv:30;e.textContent=o+' - ₦'+p;sel.appendChild(e);});sel.onchange=updatePrice;let q=document.getElementById('pQty');if(q)q.oninput=updatePrice;updatePrice();}
function updatePrice(){let t=document.getElementById('pType');if(!t)return;let q=document.getElementById('pQty');let qty=parseInt(q?q.value:1)||0;if(!PRICES[t.value])return;let info=document.getElementById('priceInfo');if(info)info.innerHTML=`You will pay: <b>₦${PRICES[t.value].adv*qty}</b> for ${qty} units`;}
function checkLogin(){let email=localStorage.getItem('mt_cur');if(!email){showAuth();return;}let users=JSON.parse(localStorage.getItem('mt_users')||'[]');curUser=users.find(u=>u.email===email);if(!curUser){showAuth();return;}if(curUser.status && curUser.status!=='active'){alert('Suspended');localStorage.removeItem('mt_cur');showAuth();return;}let auth=document.getElementById('auth');if(auth)auth.classList.add('hidden');let home=document.getElementById('home');if(home)home.classList.remove('hidden');if(curUser.av===undefined)curUser.av=0; if(curUser.pd===undefined)curUser.pd=0; if(curUser.dep===undefined)curUser.dep=0; if(!curUser.refCode)curUser.refCode=genRefCode(curUser.email); let av=document.getElementById('avBal');if(av)av.textContent='₦'+(curUser.av||0);let pd=document.getElementById('pdBal');if(pd)pd.textContent='₦'+(curUser.pd||0);let pdep=document.getElementById('postDep');if(pdep)pdep.textContent='₦'+(curUser.dep||0);let mdep=document.getElementById('menuDep');if(mdep)mdep.textContent='₦'+(curUser.dep||0);let tsp=document.getElementById('totalSpent');if(tsp)tsp.textContent='₦'+(curUser.totalSpent||0);let adminLink=document.getElementById('adminLink');if(adminLink){if(curUser.email===ADMIN){adminLink.classList.remove('hidden');adminLink.style.display='block';}else{adminLink.classList.add('hidden');adminLink.style.display='none';}}loadHomeTasks();loadAllTasks();loadMyDeposits();loadReferral();loadWithdrawPage();loadMyCreatedTasks();}
function showAuth(){let a=document.getElementById('auth');if(a)a.classList.remove('hidden');let h=document.getElementById('home');if(h)h.classList.add('hidden');}
function toggleMenu(){let m=document.getElementById('sideMenu');if(m)m.classList.toggle('active')}
function showPage(p){['home','tasks','post','deposit','admin','referral','withdraw'].forEach(id=>{let el=document.getElementById(id);if(el)el.classList.add('hidden')});let t=document.getElementById(p);if(t)t.classList.remove('hidden');if(p==='tasks')loadAllTasks();if(p==='deposit')loadMyDeposits();if(p==='post'){let pd=document.getElementById('postDep');if(pd)pd.textContent='₦'+(curUser.dep||0);loadMyCreatedTasks();}if(p==='referral')loadReferral();if(p==='withdraw')loadWithdrawPage();}
let codeSent='',tempData={};
async function handleAuth(){let userEl=document.getElementById('aUser');let emailEl=document.getElementById('aEmail');let passEl=document.getElementById('aPass');let user=userEl?userEl.value.trim():'';let email=emailEl?emailEl.value.trim():'';let pass=passEl?passEl.value.trim():'';let codeInput=document.getElementById('aCode');let refEl=document.getElementById('aRef');let refCodeInput=refEl?refEl.value.trim().toLowerCase():'';let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let exists=users.find(u=>u.email===email);if(authMode==='signin'){if(!email||!pass){alert('Fill email and password');return;}if(!exists){alert('Account not found');setAuthMode('signup');return;}if(exists.password!==pass){alert('Wrong password');return;}if(exists.status!=='active'){alert('Suspended');return;}localStorage.setItem('mt_cur',email);location.reload();return;}if(authMode==='signup'){if(codeInput.classList.contains('hidden')){if(!user||!email||!pass){alert('Fill all');return;}if(exists){alert('Email exists');setAuthMode('signin');return;}let referredByUser=null;if(refCodeInput){referredByUser=users.find(u=>u.refCode.toLowerCase()===refCodeInput);if(!referredByUser){alert('Invalid referral code');return;}}tempData={user,email,pass,referredBy:referredByUser?referredByUser.email:null};codeSent=Math.floor(100000+Math.random()*900000).toString();let es=document.getElementById('emailStatus');if(es)es.textContent='Sending to '+email+'...';try{await emailjs.send(SERVICE_ID,TEMPLATE_ID,{to_email:email,code:codeSent,username:user});if(es)es.textContent='Code sent to '+email;codeInput.classList.remove('hidden');document.getElementById('authBtn').textContent='Verify Code';}catch(e){if(es)es.textContent='Code: '+codeSent;codeInput.classList.remove('hidden');document.getElementById('authBtn').textContent='Verify Code';}}else{if(document.getElementById('aCode').value.trim()!==codeSent){alert('Wrong code');return;}let newRef=genRefCode(tempData.email);users.push({email:tempData.email,username:tempData.user,password:tempData.pass,status:'active',av:0,pd:0,dep:0,totalSpent:0,refCode:newRef,referredBy:tempData.referredBy,refEarn:0,hasWithdrawn:false});localStorage.setItem('mt_users',JSON.stringify(users));localStorage.setItem('mt_cur',tempData.email);alert('Account created!');location.reload();}}}
function logout(){localStorage.removeItem('mt_cur');location.reload();}
function taskHtml(t){let app=APPS.find(a=>a.id===t.app);let img=app?`<img src="${app.logo}">`:'';let earn=t.priceEarn||20;let cp='';if(t.type==='Custom comment' && t.customComments && t.customComments.length){cp=`<div style="background:#fff3cd;padding:4px;margin-top:5px;border-radius:4px;font-size:10px">📋 ${t.customComments.length} comments - 1 per user</div>`;}return `<div class="task-fansup"><div class="task-top"><div class="task-logo">${img}</div><div style="flex:1"><div style="font-size:12px;color:#888">${t.app}</div><div style="font-weight:800;font-size:14px">${t.type}</div><div style="margin-top:6px"><span class="badge-gray">👥 ${t.remaining} left</span></div>${cp}</div></div><div class="task-bottom"><div class="earn-text"><small>Earn</small><br><b>₦${earn}</b></div><button class="start-btn" onclick="openTask('${t.id}')">Start Task</button></div></div>`;}
function getMyDoneIds(){let p=JSON.parse(localStorage.getItem('mt_proofs')||'[]');return p.filter(x=>x.user===curUser.email).map(x=>x.taskId);}
function loadHomeTasks(){let el=document.getElementById('homeTasks');if(!el)return;let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id)).slice(0,6);el.innerHTML=tasks.length?tasks.map(taskHtml).join(''):'<div style="text-align:center;color:#888;padding:20px">No tasks</div>';}
function loadAllTasks(){let el=document.getElementById('allTasks');if(!el)return;let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id));let start=(currentPage-1)*perPage;let pag=tasks.slice(start,start+perPage);el.innerHTML=pag.length?pag.map(taskHtml).join(''):'<div style="text-align:center;color:#888;padding:20px">No tasks</div>';}
function changePage(d){currentPage+=d;if(currentPage<1)currentPage=1;loadAllTasks();}
function loadMyCreatedTasks(){if(!curUser)return;let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.owner===curUser.email);let ac=document.getElementById('activeCount');if(ac)ac.textContent=tasks.length;let list=document.getElementById('myCreatedList');if(!list)return;if(tasks.length){list.innerHTML=tasks.map(t=>`<div style="background:#fff;border:1px solid #eee;padding:12px;border-radius:12px;margin-bottom:8px;display:flex;justify-content:space-between"><div><b>${t.name}</b><br><small>${t.remaining}/${t.qty} left</small></div><button onclick="deleteTask('${t.id}')" style="background:#ffe9e9;color:#e53935;border:none;padding:6px 10px;border-radius:8px">Delete</button></div>`).join('');}}
function getAssignedComment(task){try{if(!task.customComments||task.customComments.length===0) return '';let allProofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.taskId===task.id);let index = allProofs.length % task.customComments.length;return task.customComments[index]||task.customComments[0];}catch(e){return task.customComments[0]||'';}}
function createTask(){
let typeEl=document.getElementById('pType');let linkEl=document.getElementById('pLink');let qtyEl=document.getElementById('pQty');
let type=typeEl?typeEl.value:'Like a post';let link=linkEl?linkEl.value.trim():'';let qty=qtyEl?parseInt(qtyEl.value):0;
if(!link||!qty){alert('Fill link and qty');return;}
let price=PRICES[type];if(!price){alert('Select type');return;}
let total=price.adv*qty;let myBal=curUser.dep||0;
if(myBal<total){let low=document.getElementById('lowBalPopup');if(low)low.style.display='flex';let txt=document.getElementById('lowBalText');if(txt)txt.innerHTML=`Balance ₦${myBal} Need ₦${total}`;return;}
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
let custom=[];
if(type==='Custom comment'){
let c=prompt('Enter comments separated by COMMA. Example: Nice video,Great job,Love it. Each earner gets 1 different comment. Leave empty to skip.');
if(c && c.trim()){custom=c.split(',').map(s=>s.trim()).filter(Boolean);}
}
let task={id:'t_'+Date.now(),name:type+' on '+selectedApp,app:selectedApp,type,link,qty,remaining:qty,priceAdv:price.adv,priceEarn:price.earn,owner:curUser.email,customComments:custom,created:Date.now()};
tasks.push(task);localStorage.setItem('mt_tasks',JSON.stringify(tasks));
curUser.dep-=total;curUser.totalSpent=(curUser.totalSpent||0)+total;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let idx=users.findIndex(u=>u.email===curUser.email);if(idx>=0)users[idx]=curUser;localStorage.setItem('mt_users',JSON.stringify(users));
alert('Task posted!');if(linkEl)linkEl.value='';loadMyCreatedTasks();checkLogin();showPage('post');
}
function goToDepositFromLowBal(){closePopup('lowBalPopup');showPage('deposit');}
function openTask(id){
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');curTask=tasks.find(t=>t.id===id);
if(!curTask){alert('Task not found');return;}
let pt=document.getElementById('popTitle');if(pt)pt.textContent=curTask.name;
let pl=document.getElementById('popLink');if(pl)pl.href=curTask.link;
let cl=document.getElementById('popCustomList');
if(cl){
if(curTask.type==='Custom comment' && curTask.customComments && curTask.customComments.length>0){
let assigned = getAssignedComment(curTask);
cl.innerHTML=`<div style="background:#fff3cd;padding:10px;border-radius:8px;border:1px dashed #0a7e07;margin-top:10px"><b>Your comment (1 of ${curTask.customComments.length}):</b><br><span id="copyTxt" style="font-weight:bold">${assigned}</span><br><button onclick="navigator.clipboard.writeText(document.getElementById('copyTxt').innerText);alert('Copied!')" style="margin-top:8px;background:#ff9800;color:#fff;border:none;padding:10px;border-radius:6px;width:100%;font-weight:bold">📋 Copy</button></div>`;
}else{cl.innerHTML='';}
}
let tp=document.getElementById('taskPopup');if(tp)tp.style.display='flex';
}
function closePopup(id){let el=document.getElementById(id);if(el)el.style.display='none';}
function submitProof(){let hEl=document.getElementById('popHandle');let fEl=document.getElementById('popFile');let handle=hEl?hEl.value.trim():'';let file=fEl&&fEl.files?fEl.files[0]:null;if(!handle||!file){alert('Fill handle and proof');return;}let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');if(proofs.find(p=>p.taskId===curTask.id&&p.user===curUser.email)){alert('Already done');return;}let reader=new FileReader();reader.onload=function(e){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let assignedComment = curTask.customComments? getAssignedComment(curTask):'';proofs.push({id:'p_'+Date.now(),taskId:curTask.id,taskName:curTask.name,owner:curTask.owner,user:curUser.email,handle,proof:e.target.result,status:'pending',assignedComment:assignedComment,type:curTask.type,app:curTask.app,created:Date.now()});localStorage.setItem('mt_proofs',JSON.stringify(proofs));closePopup('taskPopup');let sp=document.getElementById('successPopup');if(sp)sp.style.display='flex';loadHomeTasks();loadAllTasks();};reader.readAsDataURL(file);}
function loadReferral(){if(!curUser) return;let bUrl=window.location.origin+window.location.pathname;let link=bUrl+'?ref='+curUser.refCode;let rc=document.getElementById('myRefCode');if(rc)rc.textContent=curUser.refCode;let rl=document.getElementById('myRefLink');if(rl)rl.textContent=link;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let myRefs=users.filter(u=>u.referredBy===curUser.email);let rcount=document.getElementById('refCount');if(rcount)rcount.textContent=myRefs.length;let re=document.getElementById('refEarn');if(re)re.textContent='₦'+(curUser.refEarn||0);}
function copyRef(){let linkEl=document.getElementById('myRefLink');if(!linkEl)return;let link=linkEl.textContent; navigator.clipboard.writeText(link).then(()=>alert('Copied!'));}
function loadWithdrawPage(){if(!curUser) return;let av=document.getElementById('wAvBal');if(av)av.textContent='₦'+(curUser.av||0);let pd=document.getElementById('wPdBal');if(pd)pd.textContent='₦'+(curUser.pd||0);}
function requestWithdraw(){let aName=document.getElementById('wAccName');let aNum=document.getElementById('wAccNum');let bName=document.getElementById('wBank');let amtEl=document.getElementById('wAmt');let accName=aName?aName.value.trim():'';let accNum=aNum?aNum.value.trim():'';let bank=bName?bName.value.trim():'';let amt=amtEl?parseInt(amtEl.value):0;if(!accName||!accNum||!bank||!amt){alert('Fill all');return;}if(amt<300){alert('Min ₦300');return;}if((curUser.av||0)<amt){alert('Insufficient Available. You have Pending ₦'+(curUser.pd||0));return;}let withdrawals=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');withdrawals.push({id:'w_'+Date.now(),user:curUser.email,accName,accNum,bank,amount:amt,charge:20,net:amt-20,status:'pending',created:Date.now()});localStorage.setItem('mt_withdrawals',JSON.stringify(withdrawals));curUser.av-=amt;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let idx=users.findIndex(u=>u.email===curUser.email);users[idx]=curUser;localStorage.setItem('mt_users',JSON.stringify(users));alert('Requested!');loadWithdrawPage();checkLogin();}
function submitDeposit(){let nEl=document.getElementById('dName');let aEl=document.getElementById('dAmt');let name=nEl?nEl.value.trim():'';let amt=aEl?parseInt(aEl.value):0;if(!name||!amt){alert('Fill');return;}let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');deps.push({id:'d_'+Date.now(),user:curUser.email,accountName:name,amount:amt,status:'pending',created:Date.now()});localStorage.setItem('mt_deposits',JSON.stringify(deps));alert('Deposit sent');loadMyDeposits();}
function loadMyDeposits(){let el=document.getElementById('myDeposits');if(!el)return;let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.user===curUser.email);el.innerHTML=deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0;border-radius:8px">${d.accountName} - ₦${d.amount} - <b>${d.status}</b></div>`).join(''):'No deposits'; let db=document.getElementById('depBalText');if(db)db.textContent='₦'+(curUser.dep||0);}
function showAdmin(tab){
if(!curUser||curUser.email!==ADMIN){alert('Only admin');return;}
let c=document.getElementById('adminContent');if(!c)return;
if(tab==='users'){let users=JSON.parse(localStorage.getItem('mt_users')||'[]');c.innerHTML='<h4>Users</h4>'+users.map(u=>`<div style="padding:10px;border:1px solid #eee;margin:6px 0;border-radius:8px"><b>${u.username}</b> - ${u.email}<br>Av ₦${u.av||0} Pd ₦${u.pd||0} Dep ₦${u.dep||0}</div>`).join('');}
if(tab==='pendingBal'){let users=JSON.parse(localStorage.getItem('mt_users')||'[]').filter(u=> (u.pd||0)>0 );c.innerHTML='<h4>Pending → Available</h4>'+(users.length?users.map(u=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0;border-radius:8px;background:#fff3cd"><b>${u.username}</b> ${u.email}<br>Pending: <b>₦${u.pd}</b><br><button onclick="approvePendingBal('${u.email}')" style="width:100%;padding:12px;background:#0a7e07;color:#fff;border:none;border-radius:8px;margin-top:8px;font-weight:bold">✅ Approve ₦${u.pd} to Earning</button></div>`).join(''):'<p>No pending balance</p>');}
if(tab==='proofs'){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.status==='pending');c.innerHTML='<h4>Proofs - Approve → Pending</h4>'+(proofs.length?proofs.map(p=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0;border-radius:8px"><b>${p.taskName}</b><br>${p.user} - @${p.handle}<br>${p.assignedComment?'<div style="background:#fff3cd;padding:5px;margin:5px 0">Comment: '+p.assignedComment+'</div>':''}<img src="${p.proof}" style="width:100%;max-width:200px"><br><button onclick="approveProof('${p.id}')" style="background:#0a7e07;color:#fff;padding:8px 12px;border:none;border-radius:6px;margin:4px">Approve → Pending</button><button onclick="rejectProof('${p.id}')" style="background:#e53935;color:#fff;padding:8px 12px;border:none;border-radius:6px">Reject</button></div>`).join(''):'<p>No proofs</p>');}
if(tab==='allTasksAdmin'){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');c.innerHTML='<h4>All Tasks</h4>'+tasks.map(t=>`<div style="padding:8px;border-bottom:1px solid #eee">${t.name} - ${t.remaining}/${t.qty} <button onclick="deleteTask('${t.id}')">Delete</button></div>`).join('');}
if(tab==='depositsAdmin'){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.status==='pending');c.innerHTML='<h4>Deposits</h4>'+(deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0;border-radius:8px">${d.user} - ₦${d.amount}<br><button onclick="approveDeposit('${d.id}')" style="background:#0a7e07;color:#fff;padding:8px;border:none;border-radius:6px">Approve</button> <button onclick="rejectDeposit('${d.id}')" style="background:#e53935;color:#fff;padding:8px;border:none;border-radius:6px">Reject</button></div>`).join(''):'No pending');}
if(tab==='withdrawalsAdmin'){let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]').filter(w=>w.status==='pending');c.innerHTML='<h4>Withdrawals</h4>'+(wds.length?wds.map(w=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0;border-radius:8px"><b>${w.user}</b><br>₦${w.amount} Net ₦${w.net}<br><button onclick="approveWithdrawal('${w.id}')" style="background:#0a7e07;color:#fff;padding:8px;border:none;border-radius:6px">Pay</button> <button onclick="rejectWithdrawal('${w.id}')" style="background:#e53935;color:#fff;padding:8px;border:none;border-radius:6px">Reject</button></div>`).join(''):'No pending');}
}
function approvePendingBal(email){
try{
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let u=users.find(x=>x.email===email);
if(!u){alert('User not found');return;}
if((u.pd||0)===0){alert('No pending');return;}
let amount=u.pd;
u.av=(u.av||0)+amount;
u.pd=0;
localStorage.setItem('mt_users',JSON.stringify(users));
alert('Success! ₦'+amount+' moved Pending → Earning!');
showAdmin('pendingBal');
if(curUser.email===email){curUser=u;checkLogin();}
}catch(e){alert('Error: '+e.message);}
}
function approveProof(id){
try{
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
let p=proofs.find(x=>x.id===id);
if(!p){alert('Proof not found');return;}
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
let t=tasks.find(x=>x.id===p.taskId);
if(t){t.remaining=Math.max(0,t.remaining-1);localStorage.setItem('mt_tasks',JSON.stringify(tasks));}
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let u=users.find(x=>x.email===p.user);
if(u){
u.pd=(u.pd||0)+(t?t.priceEarn:20);
localStorage.setItem('mt_users',JSON.stringify(users));
}
p.status='approved';
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
alert('Approved! ₦'+(t?t.priceEarn:20)+' added to Pending Balance. Go to Pending→Available to release.');
showAdmin('proofs');
}catch(e){alert('Error approveProof: '+e.message);}
}
function rejectProof(id){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let p=proofs.find(x=>x.id===id);if(!p)return;p.status='rejected';localStorage.setItem('mt_proofs',JSON.stringify(proofs));showAdmin('proofs');}
function approveDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===d.user);if(u){u.dep=(u.dep||0)+d.amount;localStorage.setItem('mt_users',JSON.stringify(users));}d.status='approved';localStorage.setItem('mt_deposits',JSON.stringify(deps));showAdmin('depositsAdmin');}
function rejectDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;d.status='rejected';localStorage.setItem('mt_deposits',JSON.stringify(deps));showAdmin('depositsAdmin');}
function approveWithdrawal(id){let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');let w=wds.find(x=>x.id===id);if(!w)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===w.user);if(u){if(!u.hasWithdrawn && u.referredBy){let ref=users.find(x=>x.email===u.referredBy);if(ref){let bonus=Math.floor(w.amount*0.10);ref.av=(ref.av||0)+bonus;ref.refEarn=(ref.refEarn||0)+bonus;}}u.hasWithdrawn=true;localStorage.setItem('mt_users',JSON.stringify(users));}w.status='approved';localStorage.setItem('mt_withdrawals',JSON.stringify(wds));showAdmin('withdrawalsAdmin');}
function rejectWithdrawal(id){let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');let w=wds.find(x=>x.id===id);if(!w)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===w.user);if(u){u.av=(u.av||0)+w.amount;localStorage.setItem('mt_users',JSON.stringify(users));}w.status='rejected';localStorage.setItem('mt_withdrawals',JSON.stringify(wds));showAdmin('withdrawalsAdmin');}
function deleteTask(id){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');tasks=tasks.filter(t=>t.id!==id);localStorage.setItem('mt_tasks',JSON.stringify(tasks));let ml=document.getElementById('myCreatedList');if(ml)loadMyCreatedTasks();showAdmin('allTasksAdmin');}
window.onload=init;
