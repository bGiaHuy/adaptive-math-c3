// Controlled upstream for isolated browser QA only. Never a product fallback.
if (process.env.NODE_ENV !== 'test' || process.env.MATH_TUTOR_QA !== 'true' || !process.env.DATABASE_URL?.includes('math_adaptive_qa')) throw new Error('QA provider requires the isolated test environment.');
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  if (url !== 'https://api.anthropic.com/v1/messages') return originalFetch(url, options);
  const body = JSON.parse(options.body);
  const turn = (body.messages.length + 1) / 2;
  if (turn > 1 && !body.messages.some(message => message.role === 'assistant')) throw new Error('Missing conversation context');
  return new Response(JSON.stringify({content:[{type:'text',text:`Phản hồi kiểm thử lượt ${turn}: Chia cả hai vế cho $2$ để được $x=3$.`}],usage:{input_tokens:200,output_tokens:50},stop_reason:'end_turn'}),{status:200,headers:{'content-type':'application/json'}});
};
