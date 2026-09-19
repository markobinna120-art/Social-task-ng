let curUser=null;
let currentPage=1;
let perPage=20;
const ADMIN_EMAIL='markobinna120@gmail.com';

function getMyDoneIds(){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
return proofs.filter(p=>p.user===curUser?.email&&p.status!=='rejected').map(p=>p.taskId);
}

function taskHtml(t){
return `<div class="task-card"><h4>${t.title}</h4><p>Price: ₦${t.priceEarn} | Left: ${t.remaining}/${t.total}</p><a href="${t.link}" target="_blank" style="color:#0a7e07">Open Link</a><br><br><button onclick="openProofModal('${t.id}')" style="background:#0a7e07;color:white;padding:8px 15px;border:none;border-radius:5px;cursor:pointer">Do Task</button></div>`;
}

function loadHomeTasks(){
let done=getMyDoneIds();
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id)).slice(0,6);
let el=document.getElementById('homeTasks'); if(!el) return;
el.innerHTML=tasks.length?tasks.map(taskHtml).join(''):'<div style="text-align:center;color:#888;padding:20px">There are no available tasks</div>';
}

function loadAllTasks(){
let done=getMyDoneIds();
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id));
let start=(currentPage-1)*perPage;
let pag=tasks.slice(start,start+perPage);
let el=document.getElementById('allTasks'); if(!el) return;
el.innerHTML=pag.length?pag.map(taskHtml).join(''):'<div style="text-align:center;color:#888;padding:20px">No available tasks</div>';
let pages=Math.ceil(tasks.length/perPage)||1;
let pg=document.getElementById('pagination'); if(pg){pg.innerHTML=''; for(let i=1;i<=pages;i++){pg.innerHTML+=`<button onclick="goPage(${i})" style="margin:2px;padding:5px 10px;background:${i===currentPage?'#0a7e07':'#ccc'};color:white;border:none;border-radius:3px">${i}</button>`}}
}

function goPage(p){currentPage=p; loadAllTasks();}
// ====== MONEY FLOW ======
function submitProof(){
let taskId=document.getElementById('proofTaskId').value;
let proofText=document.getElementById('proofInput').value;
if(!proofText) return alert('Enter proof');
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
proofs.push({id:'p_'+Date.now(),taskId:taskId,user:curUser.email,proof:proofText,status:'pending',time:new Date().toLocaleString()});
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
alert('Proof submitted! Wait for admin approval - money will go to Pending after approval');
closeProofModal();
}

function approveProof(id){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
let p=proofs.find(x=>x.id===id); if(!p) return;
let t=tasks.find(x=>x.id===p.taskId);
p.status='approved';
let u=users.find(x=>x.email===p.user);
if(u){
u.pd=(u.pd||0)+(t?t.priceEarn:20);
}
if(t&&t.remaining>0) t.remaining--;
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
localStorage.setItem('mt_users',JSON.stringify(users));
localStorage.setItem('mt_tasks',JSON.stringify(tasks));
loadProofs(); loadPendingBal(); alert('Approved! Money sent to Pending Balance');
}
function approvePendingBal(email){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let u=users.find(x=>x.email===email);
if(!u) return;
if(!u.pd||u.pd<=0) return alert('No pending balance');
u.av=(u.av||0)+(u.pd||0);
u.pd=0;
localStorage.setItem('mt_users',JSON.stringify(users));
loadPendingBal(); loadUsers();
alert('Pending moved to Available - User can now withdraw!');
}

function rejectProof(id){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
let p=proofs.find(x=>x.id===id); if(p) p.status='rejected';
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
loadProofs();
}

function loadProofs(){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.status==='pending');
let el=document.getElementById('adminProofs'); if(!el) return;
el.innerHTML=proofs.length?proofs.map(p=>`<div style="border:1px solid #ccc;padding:10px;margin:5px"><b>${p.user}</b> - Task: ${p.taskId}<br>Proof: ${p.proof}<br><button onclick="approveProof('${p.id}')" style="background:#0a7e07;color:white;padding:5px 10px;border:none">Approve (to Pending)</button> <button onclick="rejectProof('${p.id}')" style="background:red;color:white;padding:5px 10px;border:none">Reject</button></div>`).join(''):'No pending proofs';
  }
  function loadPendingBal(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]').filter(u=>u.pd>0);
let el=document.getElementById('pendingBalList'); if(!el) return;
el.innerHTML=users.length?users.map(u=>`<div style="border:1px solid #ccc;padding:10px;margin:5px"><b>${u.email}</b> - Pending: ₦${u.pd}<br><button onclick="approvePendingBal('${u.email}')" style="background:#0a7e07;color:white;padding:5px 10px;border:none">Approve to Available</button></div>`).join(''):'No pending balances';
}

function openProofModal(id){document.getElementById('proofTaskId').value=id; document.getElementById('proofModal').style.display='block';}
function closeProofModal(){document.getElementById('proofModal').style.display='none';}
function loadUsers(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let el=document.getElementById('userList'); if(!el) return;
el.innerHTML=users.map(u=>`${u.email} - Av:₦${u.av||0} Pd:₦${u.pd||0} Dep:₦${u.dep||0}<br>`).join('');
}
function loadDeposits(){
let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.status==='pending');
let el=document.getElementById('depositList'); if(!el) return;
el.innerHTML=deps.length?deps.map(d=>`<div>${d.user} - ₦${d.amount} <button onclick="approveDeposit('${d.id}')">Approve</button></div>`).join(''):'No pending deposits';
}
function approveDeposit(id){
let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let d=deps.find(x=>x.id===id); if(!d) return; d.status='approved';
let u=users.find(x=>x.email===d.user); if(u) u.dep=(u.dep||0)+d.amount;
localStorage.setItem('mt_deposits',JSON.stringify(deps));
localStorage.setItem('mt_users',JSON.stringify(users));
loadDeposits();
  }
