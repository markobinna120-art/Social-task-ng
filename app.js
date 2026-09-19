let curUser=null;
let currentPage=1;
let perPage=20;
const ADMIN_EMAIL='markobinna120@gmail.com';
function getMyDoneIds(){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
return proofs.filter(p=>p.user===curUser?.email&&p.status!=='rejected').map(p=>p.taskId);
}
function copyComment(txt){navigator.clipboard.writeText(txt); alert('Comment copied! Paste it under the post');}
function taskHtml(t){
let copyBtn='';
if(t.customComment && t.customComment.trim()!==''){
copyBtn=`<div style="background:#fff3cd;padding:8px;border:1px dashed #0a7e07;margin:8px 0;border-radius:5px"><b>Comment to copy:</b><br><span id="c_${t.id}">${t.customComment}</span><br><button onclick="copyComment(document.getElementById('c_${t.id}').innerText)" style="margin-top:5px;background:#ff9800;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">📋 Copy Comment</button></div>`;
}
let actionType=t.actionType||'Follow';
return `<div class="task-card"><h4>${t.title}</h4><p><b>${t.platform} - ${actionType}</b> | Earn: ₦${t.priceEarn} | Left: ${t.remaining}/${t.total}</p>${copyBtn}<a href="${t.link}" target="_blank" style="color:#0a7e07">Open Link</a><br><br><button onclick="openProofModal('${t.id}')" style="background:#0a7e07;color:white;padding:8px 15px;border:none;border-radius:5px;cursor:pointer">Do Task</button></div>`;
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
function updateActionOptions(){
let platform=document.getElementById('taskPlatform').value;
let actionSelect=document.getElementById('taskAction');
if(!actionSelect) return;
if(platform==='YouTube'){
actionSelect.innerHTML='<option value="Subscribe">Subscribe</option><option value="Like">Like</option><option value="Comment">Comment</option><option value="Custom Comment">Custom Comment</option>';
}else{
actionSelect.innerHTML='<option value="Follow">Follow</option><option value="Like">Like</option><option value="Comment">Comment</option><option value="Custom Comment">Custom Comment</option>';
}
  }
function createTask(){
let title=document.getElementById('taskTitle').value;
let link=document.getElementById('taskLink').value;
let platform=document.getElementById('taskPlatform').value;
let action=document.getElementById('taskAction').value;
let quantity=document.getElementById('taskQuantity').value;
let customComment=document.getElementById('customCommentInput')?document.getElementById('customCommentInput').value:'';
if(!title||!link||!quantity) return alert('Fill all fields');
if(action==='Custom Comment' && !customComment) return alert('Enter the comment you want earners to copy');
let pricePer=10;
let totalCost=quantity*pricePer;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let me=users.find(u=>u.email===curUser.email);
if(me && (me.dep||0)<totalCost) return alert('Insufficient deposit balance. Fund your wallet first!');
if(me) me.dep-=totalCost;
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
tasks.push({id:'t_'+Date.now(),title:title,link:link,platform:platform,actionType:action,customComment:customComment,priceEarn:5,price:pricePer,total:parseInt(quantity),remaining:parseInt(quantity),owner:curUser.email});
localStorage.setItem('mt_users',JSON.stringify(users));
localStorage.setItem('mt_tasks',JSON.stringify(tasks));
alert('Task posted successfully!');
loadHomeTasks(); loadAllTasks();
}
function submitProof(){
let taskId=document.getElementById('proofTaskId').value;
let proofText=document.getElementById('proofInput').value;
if(!proofText) return alert('Enter proof');
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
proofs.push({id:'p_'+Date.now(),taskId:taskId,user:curUser.email,proof:proofText,status:'pending',time:new Date().toLocaleString()});
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
alert('Submitted! Money will go to Pending Balance after admin approves');
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
if(u){u.pd=(u.pd||0)+(t?t.priceEarn:20);}
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
if(!u.pd||u.pd<=0) return alert('No pending');
u.av=(u.av||0)+(u.pd||0);
u.pd=0;
localStorage.setItem('mt_users',JSON.stringify(users));
loadPendingBal(); loadUsers();
alert('Approved! Money moved to Earning Balance');
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
el.innerHTML=proofs.length?proofs.map(p=>`<div style="border:1px solid #ccc;padding:10px;margin:5px"><b>${p.user}</b> - Task: ${p.taskId}<br>Proof: ${p.proof}<br><button onclick="approveProof('${p.id}')" style="background:#0a7e07;color:white;padding:5px 10px;border:none">Approve to Pending</button> <button onclick="rejectProof('${p.id}')" style="background:red;color:white;padding:5px 10px;border:none">Reject</button></div>`).join(''):'No pending proofs';
}
function loadPendingBal(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]').filter(u=>u.pd>0);
let el=document.getElementById('pendingBalList'); if(!el) return;
el.innerHTML=users.length?users.map(u=>`<div style="border:1px solid #ccc;padding:10px;margin:5px"><b>${u.email}</b> - Pending: ₦${u.pd}<br><button onclick="approvePendingBal('${u.email}')" style="background:#0a7e07;color:white;padding:5px 10px;border:none">Approve to Earning Balance</button></div>`).join(''):'No pending balances';
}
function openProofModal(id){document.getElementById('proofTaskId').value=id; document.getElementById('proofModal').style.display='block';}
function closeProofModal(){document.getElementById('proofModal').style.display='none';}
function loadUsers(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let el=document.getElementById('userList'); if(!el) return;
el.innerHTML=users.map(u=>`${u.email} - Earn:₦${u.av||0} Pend:₦${u.pd||0} Dep:₦${u.dep||0}<br>`).join('');
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
