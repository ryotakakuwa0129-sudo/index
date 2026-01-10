async function api(action,data){
  const res = await fetch(GAS_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ action, ...data })
  });
  return await res.json();
}
