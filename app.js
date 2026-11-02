var LOGO=`<svg viewBox='0 0 1024 1024' aria-hidden='true'><rect width='1024' height='1024' rx='200' fill='#0f7a45'/><rect x='210' y='450' width='604' height='310' fill='#fff'/><rect x='430' y='540' width='164' height='220' fill='#0f7a45'/><rect x='250' y='520' width='140' height='120' fill='#cdeedb'/><rect x='634' y='520' width='140' height='120' fill='#cdeedb'/><rect x='170' y='300' width='114' height='150' fill='#fff'/><circle cx='227' cy='450' r='57' fill='#fff'/><rect x='284' y='300' width='114' height='150' fill='#cdeedb'/><circle cx='341' cy='450' r='57' fill='#cdeedb'/><rect x='398' y='300' width='114' height='150' fill='#fff'/><circle cx='455' cy='450' r='57' fill='#fff'/><rect x='512' y='300' width='114' height='150' fill='#cdeedb'/><circle cx='569' cy='450' r='57' fill='#cdeedb'/><rect x='626' y='300' width='114' height='150' fill='#fff'/><circle cx='683' cy='450' r='57' fill='#fff'/><rect x='740' y='300' width='114' height='150' fill='#cdeedb'/><circle cx='797' cy='450' r='57' fill='#cdeedb'/><rect x='150' y='270' width='724' height='40' rx='20' fill='#fff'/></svg>`;
var SHOP={phone:"",items:[]};try{SHOP=JSON.parse(document.getElementById("shopdata").textContent)}catch(e){}
var mode=location.hash==="#shop"?"shop":"",step="browse",sc={},ci={},lastOrder="";
window.addEventListener("hashchange",function(){mode=location.hash==="#shop"?"shop":"";step="browse";render()});
var S={pin:"",items:[],sales:[],utang:[]},cart={},tab="sell",authed=false,payMode=false,err="",pend="";
function thumb(i,c){return i.img?'<img class="'+c+'" src="'+i.img+'" alt="">':'<span class="'+c+' ph0">'+esc(i.name.charAt(0).toUpperCase())+'</span>'}
try{var r=localStorage.getItem("sari1");if(r)S=JSON.parse(r)}catch(e){}
function save(){try{localStorage.setItem("sari1",JSON.stringify(S))}catch(e){}}
var peso=function(n){return "₱"+Number(n).toLocaleString("en-PH",{maximumFractionDigits:2})};
var uid=function(){return Math.random().toString(36).slice(2,9)};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var $=function(id){return document.getElementById(id)};
function toast(m){var t=$("toast");t.textContent=m;t.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(function(){t.style.display="none"},1800)}
function item(id){return S.items.find(function(i){return i.id===id})}
function cartTotal(){var t=0,n=0;for(var id in cart){var i=item(id);if(i){t+=i.price*cart[id];n+=cart[id]}}return{t:t,n:n}}

function sline(){return Object.keys(sc).map(function(id){var i=SHOP.items.find(function(x){return x.id===id});return i?{i:i,q:sc[id]}:null}).filter(Boolean)}
function stotal(){var t=0,n=0;sline().forEach(function(l){t+=l.i.price*l.q;n+=l.q});return{t:t,n:n}}
function grabCi(){var g=function(id){var e=document.getElementById(id);return e?e.value:""};if(!document.getElementById("sn"))return;ci={n:g("sn"),p:g("sp"),m:g("sm"),a:g("sa"),x:g("sx")}}
function shopView(){
 var ba=step==="done"?"sback3":(step==="checkout"?"sback2":(location.hash!=="#shop"?"sowner":""));
 var h='<header><div style="display:flex;align-items:center;gap:10px">'+(ba?'<button data-a="'+ba+'" aria-label="Back" style="font-size:20px;line-height:1;padding:4px 12px">←</button>':'')+'<h1><span class="lg">'+LOGO+'</span>Sari-sari Store</h1></div></header>';
 if(step==="done")return h+'<main><h2> Order ready to send</h2><p class="sm">Send this message to the store to place your order. The store will confirm by message. Pay cash on pickup or delivery, or as the store arranges.</p><pre class="msg">'+esc(lastOrder)+'</pre><div class="form">'+(SHOP.phone?'<button class="b" data-a="stext"> Text the store</button>':'')+'<button class="b ghost" data-a="scopy">'+(navigator.share?"Share order":"Copy order")+'</button><button class="b ghost" data-a="sback">← Back to shop</button></div></main>';
 var L=sline(),T=stotal();
 if(step==="checkout"&&T.n){
  return h+'<main><h2> Your order</h2>'+L.map(function(l){return '<div class="row"><div class="nm"><b>'+esc(l.i.name)+'</b><div class="sm">'+l.q+' × '+peso(l.i.price)+'</div></div><b>'+peso(l.i.price*l.q)+'</b></div>'}).join("")+'<div class="row"><b>Total</b><b class="price">'+peso(T.t)+'</b></div><h2> Your details</h2><div class="form"><input id="sn" value="'+esc(ci.n||"")+'" placeholder="Your name" aria-label="Your name"><input id="sp" type="tel" value="'+esc(ci.p||"")+'" placeholder="Mobile number" aria-label="Mobile number"><select id="sm" aria-label="Pickup or delivery"><option value="Pickup"'+(ci.m==="Delivery"?"":" selected")+'>Pickup at the store</option><option value="Delivery"'+(ci.m==="Delivery"?" selected":"")+'>Delivery</option></select><input id="sa" value="'+esc(ci.a||"")+'" placeholder="Delivery address (if delivery)" aria-label="Address"><input id="sx" value="'+esc(ci.x||"")+'" placeholder="Note (optional)" aria-label="Note"></div><div class="form"><button class="b" data-a="sorder"> Place order</button><button class="b ghost" data-a="sback2">← Back</button></div></main>';
 }
 step="browse";
 var grid=SHOP.items.length?'<div class="grid">'+SHOP.items.map(function(i){var left=i.qty-(sc[i.id]||0);return '<button class="item'+(left<=0?" out":"")+'" data-a="sadd" data-v="'+i.id+'">'+thumb(i,"pic")+'<b>'+esc(i.name)+'</b><span><span class="price">'+peso(i.price)+'</span><br><span class="stk">'+(left<=0?"Out of stock":"Tap to add")+'</span></span></button>'}).join("")+'</div>':'<p class="empty">The shop is being set up. Please check back soon.</p>';
 var bar=T.n?'<div id="cart" style="bottom:0;padding-bottom:calc(10px + env(safe-area-inset-bottom,0px))"><div class="in"><div class="top"><b>'+T.n+' item'+(T.n>1?"s":"")+'</b><b class="price" style="font-size:22px">'+peso(T.t)+'</b><button class="b" data-a="scheckout"> Checkout</button></div><div class="lines">'+L.map(function(l){return '<div class="ln"><span>'+esc(l.i.name)+'</span><span class="q"><button class="b ghost" data-a="sdec" data-v="'+l.i.id+'" aria-label="Remove one">−</button> <b>'+l.q+'</b> <button class="b ghost" data-a="sadd" data-v="'+l.i.id+'" aria-label="Add one">+</button></span></div>'}).join("")+'</div></div></div>':'';
 return h+'<main><h2> Order online</h2><p class="sm">Tap a product to add it to your cart.</p>'+grid+'<p class="sm" style="margin-top:18px"><button class="lnk" data-a="sowner">Owner login</button></p></main>'+bar;
}
async function pubShop(){
 var ph=(($("sph")||{}).value||"").replace(/[^0-9+]/g,"");S.shopPhone=ph;save();
 var art=null;try{art=window.claude?await claude.use("artifact"):null}catch(e){}
 if(!art){toast("Publishing isn’t available here");return}
 var data={phone:ph,items:S.items.map(function(i){return{id:i.id,name:i.name,price:i.price,qty:i.qty,img:i.img||""}})};
 var c=document.documentElement.cloneNode(true);
 c.querySelector("#app").innerHTML="";var t=c.querySelector("#toast");t.removeAttribute("style");t.textContent="";
 Array.prototype.slice.call(c.querySelectorAll("script")).forEach(function(s){if(s.id!=="main"&&s.id!=="shopdata")s.parentNode.removeChild(s)});
 if(!c.querySelector("#main")||!c.querySelector("#shopdata")){toast("Couldn’t prepare the shop page");return}
 c.querySelector("#shopdata").textContent=JSON.stringify(data).replace(/</g,"\\u003c");
 toast("Publishing your shop…");
 try{await art.publish("<!DOCTYPE html>\n"+c.outerHTML)}
 catch(e){toast(e&&(e.code==="not_writer"||e.code==="not_granted")?"Only the page owner can publish the shop":"Couldn’t publish. Try again.")}
}
function fx(){var k=(mode==="shop"?"shop"+step:(authed?tab:"login"))+lmode;if(fx.k!==k){fx.k=k;var e=document.querySelector("main,.login");if(e)e.classList.add("fade")}}
function render(){
 var a=$("app");
 if(mode==="shop"){a.innerHTML=shopView();fx();return}
 if(!authed){
  a.innerHTML=loginView();fx();
  return;
 }
 var body="";
 if(tab==="sell")body=sellView();
 if(tab==="stock")body=stockView();
 if(tab==="utang")body=utangView();
 if(tab==="today")body=todayView();
 var tabs=[["sell","Sell"],["stock","Inventory"],["utang","Credit"],["today","Today"]];
 a.innerHTML='<header><h1><span class="lg">'+LOGO+'</span>Sari-sari Store</h1><button data-a="lock"> Lock</button></header><main>'+body+'</main>'+(tab==="sell"?cartView():"")+'<nav>'+tabs.map(function(t){return '<button data-a="tab" data-v="'+t[0]+'" class="'+(tab===t[0]?"on":"")+'">'+t[1]+'</button>'}).join("")+'</nav>';fx();
}

function sellView(){
 return '<h2> Tap to sell</h2><div class="grid">'+S.items.map(function(i){
  var left=i.qty-(cart[i.id]||0);
  return '<button class="item'+(left<=0?" out":"")+'" data-a="add" data-v="'+i.id+'">'+thumb(i,"pic")+'<b>'+esc(i.name)+'</b><span><span class="price">'+peso(i.price)+'</span><br><span class="stk">'+(left<=0?"Out of stock":left+" left")+'</span></span></button>'}).join("")+samples()+'</div>';
}
function samples(){
 var n=Math.max(0,4-S.items.length),h="";
 for(var k=0;k<n;k++)h+='<button class="item sample" data-a="tab" data-v="stock" aria-label="Add a product"><span class="pic ph0">Photo</span><b>Sample product</b><span><span class="price">₱0.00</span><br><span class="stk">Tap to add yours</span></span></button>';
 return h+(S.items.length?"":'<p class="empty" style="grid-column:1/-1">These are sample frames. Open Inventory to add your real products, photos and prices.</p>');
}
function cartView(){
 var c=cartTotal();
 if(!c.n)return "";
 var lines=Object.keys(cart).map(function(id){var i=item(id);if(!i)return"";return '<div class="ln"><span>'+esc(i.name)+' <span class="sm">'+peso(i.price)+'</span></span><span class="q"><button class="b ghost" data-a="dec" data-v="'+id+'">−</button> <b>'+cart[id]+'</b> <button class="b ghost" data-a="add" data-v="'+id+'">+</button></span></div>'}).join("");
 var pay=payMode?'<div class="form" style="margin:8px 0 0"><select id="cust" aria-label="Customer">'+(S.utang.length?S.utang.map(function(u){return '<option value="'+u.id+'">'+esc(u.name)+'</option>'}).join(""):'<option value="">No customers yet. Add one in Credit.</option>')+'</select><button class="b red" data-a="sell" data-v="utang"> Add to credit</button></div>':'<div class="form" style="margin:8px 0 0"><button class="b alt" style="flex:1" data-a="sell" data-v="cash"> Paid in cash</button><button class="b ghost" data-a="paymode"> On credit</button></div>';
 return '<div id="cart"><div class="in"><div class="top"><b>'+c.n+' item'+(c.n>1?"s":"")+'</b><b class="price" style="font-size:24px">'+peso(c.t)+'</b><button class="b ghost" data-a="clear">Clear</button></div><div class="lines">'+lines+'</div>'+pay+'</div></div>';
}
var invQ="";
function stockView(){
 var q=invQ.trim().toLowerCase(),units=0,val=0,low=0;
 S.items.forEach(function(i){units+=i.qty;val+=i.qty*i.price;if(i.qty<=3)low++});
 var st='<h2> Inventory</h2><div class="stat"><div class="big"><span> Stock value</span><b>'+peso(val)+'</b></div><div><span class="sm">Products</span><b>'+S.items.length+'</b></div><div><span class="sm">Total units</span><b>'+units+'</b></div><div style="grid-column:1/-1"><span class="sm">Low or out of stock</span><b style="color:'+(low?"var(--red)":"inherit")+'">'+low+'</b></div></div>';
 var f='<h2> Add a product</h2><div class="form"><input id="n" placeholder="Name (e.g. Lucky Me)" aria-label="Name"><input id="p" type="number" inputmode="decimal" min="0" placeholder="Price ₱" aria-label="Price"><input id="q" type="number" inputmode="numeric" min="0" placeholder="Stock" aria-label="Stock"><label class="ph">'+(pend?'<img src="'+pend+'" alt="Photo preview">':' Photo')+'<input id="ph" type="file" accept="image/*" hidden></label><button class="b" data-a="additem">Add</button></div>';
 var list=S.items.filter(function(i){return !q||i.name.toLowerCase().indexOf(q)>-1});
 var l=list.map(function(i){
  var tag=i.qty<=0?'<span class="tag out"> Out</span>':(i.qty<=3?'<span class="tag low"> Low</span>':'');
  return '<div class="row">'+thumb(i,"th")+'<div class="nm"><b>'+esc(i.name)+'</b>'+tag+'<div class="sm">'+peso(i.price)+' each · '+i.qty+' in stock · worth '+peso(i.price*i.qty)+'</div></div>'+
  '<div class="inv"><button class="b ghost" data-a="restock" data-v="'+i.id+'" data-n="-1" aria-label="Remove one">−1</button><button class="b ghost" data-a="restock" data-v="'+i.id+'" data-n="1">+1</button><button class="b ghost" data-a="restock" data-v="'+i.id+'" data-n="10">+10</button><button class="b ghost" data-a="shareitem" data-v="'+i.id+'" aria-label="Share"> Share</button><button class="b ghost" data-a="del" data-v="'+i.id+'" aria-label="Delete">✕</button></div>'+
  '<div class="setq"><input id="set-'+i.id+'" type="number" inputmode="numeric" min="0" placeholder="Set count" style="width:110px" aria-label="Set stock count"><button class="b" data-a="setqty" data-v="'+i.id+'">Update</button></div></div>'}).join("");
 if(!S.items.length)l='<p class="empty">Your shelf is empty. Add your first product above.</p>';
 else if(!list.length)l='<p class="empty">No products match your search.</p>';
 var sr=S.items.length?'<input id="srch" type="search" value="'+esc(invQ)+'" placeholder="Search inventory" aria-label="Search inventory">':'';
 var shopBox='<h2> Online shop</h2><div class="row"><div class="nm"><b>Let customers order</b><div class="sm">'+SHOP.items.length+' product'+(SHOP.items.length===1?"":"s")+' live. Customers add to cart and send you the order by text. Your shop link is this page’s link with #shop at the end.</div></div></div><div class="form"><input id="sph" type="tel" value="'+esc(S.shopPhone||SHOP.phone||"")+'" placeholder="Mobile number for orders" aria-label="Mobile number for orders"><button class="b" data-a="pubshop"> Publish to online shop</button><button class="b ghost" data-a="prevshop"> Preview shop</button></div>';
 return st+shopBox+f+'<h2> Products</h2>'+sr+l;
}
function utangView(){
 var f='<h2> Add a person with debt</h2><div class="form"><input id="cn" placeholder="Name (e.g. Aling Rosa)" aria-label="Customer name"><input id="cph" type="tel" placeholder="Mobile (optional)" aria-label="Mobile"><input id="cd" type="number" inputmode="decimal" min="0" placeholder="Debt ₱ (optional)" aria-label="Starting debt"><button class="b" data-a="addcust">Add</button></div>';
 var tot=S.utang.reduce(function(s,u){return s+u.bal},0);
 var list=S.utang.slice().sort(function(a,b){return b.bal-a.bal});
 var l=list.length?list.map(function(u){
  var lg=(u.log||[]).slice(-1)[0];
  return '<div class="row"><div class="nm"><b>'+esc(u.name)+'</b>'+(u.ph?' <a href="tel:'+esc(u.ph)+'" aria-label="Call"></a>':'')+'<div class="sm">'+(u.bal>0?"Owes "+peso(u.bal):"Fully paid")+(lg?' · last '+(lg.k==="pay"?"paid ":"added ")+peso(lg.a)+' on '+new Date(lg.t).toLocaleDateString()+(lg.n?' ('+esc(lg.n)+')':''):'')+'</div></div>'+
  '<div class="inv"><input id="pay-'+u.id+'" type="number" inputmode="decimal" min="0" placeholder="₱ amount" style="width:110px" aria-label="Amount"><input id="nt-'+u.id+'" placeholder="Note (optional)" style="width:140px" aria-label="Note"></div>'+
  '<div class="inv"><button class="b red" data-a="adddebt" data-v="'+u.id+'"> Add debt</button><button class="b alt" data-a="bayad" data-v="'+u.id+'"> Paid</button><button class="b ghost" data-a="delcust" data-v="'+u.id+'" aria-label="Remove person">✕</button></div></div>'}).join(""):'<p class="empty">No one has a debt yet. Add a person above, or pick “On credit” when selling.</p>';
 return f+'<h2> Credit list'+(tot>0?' · '+peso(tot)+' to collect':'')+'</h2>'+l;
}
function todayView(){
 var d=new Date();d.setHours(0,0,0,0);
 var s=S.sales.filter(function(x){return x.t>=d.getTime()});
 var cash=0,ut=0,cnt={};
 s.forEach(function(x){if(x.cust)ut+=x.total;else cash+=x.total;x.lines.forEach(function(l){cnt[l.name]=(cnt[l.name]||0)+l.q})});
 var top=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]}).slice(0,3);
 var low=S.items.filter(function(i){return i.qty<=3});
 return '<h2> Today</h2><div class="stat"><div class="big"><span> Total sales</span><b>'+peso(cash+ut)+'</b></div><div><span class="sm"> Cash in hand</span><b>'+peso(cash)+'</b></div><div><span class="sm"> On credit</span><b>'+peso(ut)+'</b></div></div>'+
 '<div class="row"><div class="nm"><b> Best sellers</b><div class="sm">'+(top.length?top.map(function(n){return esc(n)+" ("+cnt[n]+")"}).join(", "):"No sales yet today")+'</div></div></div>'+
 '<div class="row"><div class="nm"><b> Running low</b><div class="sm">'+(low.length?low.map(function(i){return esc(i.name)+" ("+i.qty+")"}).join(", "):"Everything is stocked")+'</div></div></div>'+
 '<div class="form" style="margin-top:14px"><button class="b" data-a="mail"> Email report</button><button class="b ghost" data-a="share"> Share report</button></div><h2> Account</h2><div class="form"><input id="em" type="email" value="'+esc(S.email||"")+'" placeholder="Your email" aria-label="Email"><input id="rec" type="text" placeholder="'+(S.rec?"New recovery word (optional)":"Recovery word")+'" aria-label="Recovery word"><button class="b" data-a="acct">Save</button></div><p class="sm">Data stays on this phone.</p>';
}

var SOC=[
["Google","https://accounts.google.com/",`<svg viewBox='0 0 24 24'><path fill='#4285F4' d='M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z'/><path fill='#34A853' d='M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z'/><path fill='#FBBC05' d='M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z'/><path fill='#EA4335' d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.86 8.87 4.75 12 4.75z'/></svg>`],
["Instagram","https://www.instagram.com/accounts/login/",`<svg viewBox='0 0 24 24'><defs><linearGradient id='ig' x1='0' y1='1' x2='1' y2='0'><stop offset='0' stop-color='#feda75'/><stop offset='.35' stop-color='#fa7e1e'/><stop offset='.6' stop-color='#d62976'/><stop offset='1' stop-color='#4f5bd5'/></linearGradient></defs><rect x='2' y='2' width='20' height='20' rx='6' fill='url(#ig)'/><circle cx='12' cy='12' r='4.6' fill='none' stroke='#fff' stroke-width='2'/><circle cx='17.4' cy='6.6' r='1.3' fill='#fff'/></svg>`],
["Facebook","https://www.facebook.com/login",`<svg viewBox='0 0 24 24'><path fill='#1877F2' d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>`],
["TikTok","https://www.tiktok.com/login",`<svg viewBox='0 0 24 24'><path fill='#111' d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'/></svg>`],
["X (Twitter)","https://x.com/i/flow/login",`<svg viewBox='0 0 24 24'><path fill='#111' d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'/></svg>`]
];
function socials(){return '<button class="b ghost" style="width:100%;margin-top:14px" data-a="shopmode"> Customer? Order online</button><p class="sm" style="margin:22px 0 0"> Or connect with</p><div class="soc">'+SOC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener noreferrer" aria-label="'+s[0]+'">'+s[2]+'</a>'}).join("")+'</div><p class="sm">Opens each app in a new tab.</p>'}
var lmode="";
function loginView(){
 var h='<div class="login"><div class="lgbig">'+LOGO+'</div><h1>Sari-sari Store</h1>',pi='<input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN" placeholder="PIN">',er='<div class="err">'+esc(err)+'</div>';
 if(lmode==="forgot")return h+'<p class="sm">Type your recovery word, then choose a new PIN.</p><input id="rec" class="txt" placeholder="Recovery word" autocomplete="off" aria-label="Recovery word">'+pi+er+'<button class="b" data-a="reset">Reset PIN</button><button class="lnk" data-a="back">← Back</button></div>';
 if(!S.pin)return h+'<p class="sm">First time here. Choose a 4-digit PIN and a recovery word you will remember. Email is optional.</p>'+pi+'<input id="rec" class="txt" placeholder="Recovery word (e.g. pet’s name)" autocomplete="off" aria-label="Recovery word"><input id="em" class="txt" type="email" placeholder="Email (optional)" aria-label="Email">'+er+'<button class="b" data-a="login"> Save and open store</button>'+socials()+'</div>';
 return h+'<p class="sm">Enter your PIN to open the store.</p>'+pi+er+'<button class="b" data-a="login"> Open store</button><button class="lnk" data-a="forgot">Forgot PIN?</button>'+socials()+'</div>';
}
function report(){var d=new Date();d.setHours(0,0,0,0);var c=0,u=0;S.sales.forEach(function(x){if(x.t>=d.getTime()){if(x.cust)u+=x.total;else c+=x.total}});return "Sari-sari Store, "+new Date().toLocaleDateString()+"\nTotal sales: "+peso(c+u)+"\nCash: "+peso(c)+"\nCredit: "+peso(u)}
function shareText(t){
 if(navigator.share){navigator.share({title:"Sari-sari Store",text:t}).catch(function(){});return}
 try{navigator.clipboard.writeText(t);toast("Copied. Paste it in Facebook, Instagram or TikTok.")}catch(e){toast("Sharing isn’t available here")}
}
document.addEventListener("click",function(e){
 var el=e.target.closest("[data-a]");if(!el)return;
 var a=el.dataset.a,v=el.dataset.v;
 if(a==="prevshop"){mode="shop";step="browse";return render()}
 if(a==="pubshop"){pubShop();return}
 if(a==="shopmode"){mode="shop";step="browse";return render()}
 if(mode==="shop"){
  var si2=SHOP.items.find(function(x){return x.id===v});
  if(a==="sowner"){mode="";if(location.hash==="#shop")location.hash="";return render()}
  if(a==="sadd"){if(si2&&(sc[v]||0)<si2.qty)sc[v]=(sc[v]||0)+1;else toast("No more stock");return render()}
  if(a==="sdec"){sc[v]--;if(sc[v]<=0)delete sc[v];return render()}
  if(a==="scheckout"){step="checkout";return render()}
  if(a==="sback2"){grabCi();step="browse";return render()}
  if(a==="sback3"){step="checkout";return render()}
  if(a==="sorder"){
   grabCi();
   if(!ci.n.trim()||!/\d{7,}/.test(ci.p.replace(/\D/g,""))){toast("Enter your name and mobile number");return}
   if(ci.m==="Delivery"&&!ci.a.trim()){toast("Enter your delivery address");return}
   var T2=stotal();
   lastOrder="New order – Sari-sari Store\n"+sline().map(function(l){return l.q+" × "+l.i.name+" – "+peso(l.i.price*l.q)}).join("\n")+"\nTotal: "+peso(T2.t)+"\nName: "+ci.n.trim()+"\nPhone: "+ci.p.trim()+"\n"+ci.m+(ci.m==="Delivery"?": "+ci.a.trim():"")+(ci.x.trim()?"\nNote: "+ci.x.trim():"");
   step="done";return render();
  }
  if(a==="stext"){location.href="sms:"+SHOP.phone+"?&body="+encodeURIComponent(lastOrder);return}
  if(a==="scopy"){shareText(lastOrder);return}
  if(a==="sback"){sc={};step="browse";return render()}
 }
 if(a==="login"){
  var p=$("pin").value;
  if(!/^\d{4}$/.test(p)){err="Use exactly 4 digits.";return render()}
  if(!S.pin){S.pin=p;S.rec=($("rec").value||"").trim().toLowerCase();S.email=($("em").value||"").trim();save()}
  else if(S.pin!==p){err="Wrong PIN. Try again.";return render()}
  err="";authed=true;return render();
 }
 if(a==="forgot"){lmode="forgot";err="";return render()}
 if(a==="back"){lmode="";err="";return render()}
 if(a==="reset"){
  var w=($("rec").value||"").trim().toLowerCase(),np=$("pin").value;
  if(!S.rec){err="No recovery word was saved on this phone.";return render()}
  if(w!==S.rec){err="That isn’t your recovery word.";return render()}
  if(!/^\d{4}$/.test(np)){err="New PIN needs 4 digits.";return render()}
  S.pin=np;save();lmode="";err="";authed=true;return render();
 }
 if(a==="acct"){S.email=$("em").value.trim();var rw=$("rec").value.trim().toLowerCase();if(rw)S.rec=rw;save();toast("Saved");return}
 if(a==="mail"){location.href="mailto:"+(S.email||"")+"?subject="+encodeURIComponent("Sales report")+"&body="+encodeURIComponent(report());return}
 if(a==="share"){shareText(report());return}
 if(a==="shareitem"){var si=item(v);if(si)shareText(si.name+" for "+peso(si.price)+" at Sari-sari Store");return}
 if(a==="lock"){authed=false;cart={};payMode=false;return render()}
 if(a==="tab"){tab=v;return render()}
 if(a==="add"){var i=item(v);if(i&&(cart[v]||0)<i.qty){cart[v]=(cart[v]||0)+1}else toast("No more stock");return render()}
 if(a==="dec"){cart[v]--;if(cart[v]<=0)delete cart[v];if(!Object.keys(cart).length)payMode=false;return render()}
 if(a==="clear"){cart={};payMode=false;return render()}
 if(a==="paymode"){payMode=true;return render()}
 if(a==="sell"){
  var c=cartTotal(),cu=null;
  if(!c.n)return;
  if(v==="utang"){var sel=$("cust").value;cu=S.utang.find(function(u){return u.id===sel});if(!cu){toast("Add a customer in Credit first");return}}
  var lines=[];
  for(var id in cart){var it=item(id);if(it){it.qty-=cart[id];lines.push({name:it.name,price:it.price,q:cart[id]})}}
  S.sales.push({t:Date.now(),total:c.t,lines:lines,cust:cu?cu.name:null});
  if(cu){cu.bal+=c.t;(cu.log=cu.log||[]).push({t:Date.now(),a:c.t,k:"debt",n:"sale"})}
  save();toast(cu?"Added "+peso(c.t)+" to "+cu.name+"’s credit":"Sold for "+peso(c.t));
  cart={};payMode=false;return render();
 }
 if(a==="additem"){
  var n=$("n").value.trim(),p2=parseFloat($("p").value),q=parseInt($("q").value||"0",10);
  if(!n||isNaN(p2)||p2<0){toast("Enter a name and price");return}
  S.items.push({id:uid(),name:n,price:p2,qty:isNaN(q)?0:q,img:pend});pend="";save();toast(n+" added");return render();
 }
 if(a==="restock"){var it2=item(v);it2.qty=Math.max(0,it2.qty+parseInt(el.dataset.n,10));save();return render()}
 if(a==="setqty"){var sv=parseInt($("set-"+v).value,10);if(isNaN(sv)||sv<0){toast("Enter a stock count");return}item(v).qty=sv;save();toast("Stock updated");return render()}
 if(a==="del"){
  if(el.dataset.s==="1"){S.items=S.items.filter(function(i){return i.id!==v});delete cart[v];save();return render()}
  el.dataset.s="1";el.textContent="Sure?";el.classList.add("red");return;
 }
 if(a==="addcust"){
  var cn=$("cn").value.trim();if(!cn){toast("Enter a name");return}
  var d0=parseFloat($("cd").value),nu={id:uid(),name:cn,ph:($("cph").value||"").replace(/[^0-9+]/g,""),bal:0,log:[]};
  if(d0>0){nu.bal=d0;nu.log.push({t:Date.now(),a:d0,k:"debt"})}
  S.utang.push(nu);save();toast(cn+" added");return render();
 }
 if(a==="adddebt"){
  var da=parseFloat($("pay-"+v).value),du=S.utang.find(function(x){return x.id===v});
  if(!du||isNaN(da)||da<=0){toast("Enter the debt amount");return}
  du.bal+=da;(du.log=du.log||[]).push({t:Date.now(),a:da,k:"debt",n:($("nt-"+v).value||"").trim()});save();toast(peso(da)+" added to "+du.name);return render();
 }
 if(a==="delcust"){
  if(el.dataset.s==="1"){S.utang=S.utang.filter(function(x){return x.id!==v});save();return render()}
  el.dataset.s="1";el.textContent="Sure?";el.classList.add("red");return;
 }
 if(a==="bayad"){
  var amt=parseFloat($("pay-"+v).value),u=S.utang.find(function(x){return x.id===v});
  if(isNaN(amt)||amt<=0){toast("Enter the amount paid");return}
  u.bal=Math.max(0,u.bal-amt);(u.log=u.log||[]).push({t:Date.now(),a:amt,k:"pay",n:($("nt-"+v).value||"").trim()});save();toast(u.name+" paid "+peso(amt));return render();
 }
});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&$("pin")){var b=document.querySelector('[data-a="login"]');if(b)b.click()}});
document.addEventListener("input",function(e){if(e.target.id!=="srch")return;invQ=e.target.value;var pos=e.target.selectionStart;render();var n=$("srch");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}});
document.addEventListener("change",function(e){
 if(e.target.id!=="ph"||!e.target.files[0])return;
 var rd=new FileReader();
 rd.onload=function(){var im=new Image();im.onload=function(){var r=Math.min(1,160/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);c.getContext("2d").drawImage(im,0,0,c.width,c.height);pend=c.toDataURL("image/jpeg",0.7);var f=[$("n").value,$("p").value,$("q").value];render();$("n").value=f[0];$("p").value=f[1];$("q").value=f[2]};im.src=rd.result};
 rd.readAsDataURL(e.target.files[0]);
});
render();
