import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MathReviewService } from '../src/modules/student/math-review.service';

describe('Math tutor conversation', () => {
  let db:any, budget:any, service:MathReviewService;
  const requestId='request-1234567890';
  beforeEach(()=>{
    vi.stubEnv('AI_ENABLED','true'); vi.stubEnv('ANTHROPIC_API_KEY','test-only-credential');
    vi.stubEnv('AI_PROVIDER','anthropic');
    db={diagnosticAttempt:{findFirst:vi.fn().mockResolvedValue(null)},
      mathReviewLog:{findFirst:vi.fn().mockResolvedValue({answer:'B',correct:false,card:{questionId:'q'}})},
      question:{findFirst:vi.fn().mockResolvedValue({content:'2x=6',explanation:'x=3',skill:{title:'Phương trình'}})},
      aiRequest:{findFirst:vi.fn().mockResolvedValue(null),findMany:vi.fn().mockResolvedValue([]),count:vi.fn().mockResolvedValue(0),updateMany:vi.fn().mockResolvedValue({count:1})}};
    db.$queryRaw=vi.fn();db.$transaction=(fn:any)=>fn(db);
    budget={reserve:vi.fn().mockResolvedValue({id:'reservation'}),settle:vi.fn().mockResolvedValue(.001),fail:vi.fn()};
    service=new MathReviewService(db,budget);vi.spyOn(service,'summary').mockResolvedValue({recommendations:[]} as any);
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({content:[{type:'text',text:'Chia hai vế cho 2.'}],usage:{input_tokens:100,output_tokens:30},stop_reason:'end_turn'})}));
  });
  afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();vi.restoreAllMocks();});
  it('allows the floating tutor without a review and scopes history to the learner',async()=>{
    const conversation='12345678-1234-4234-8234-123456789abc';
    await service.feedback('alice',{reviewId:conversation,reason:'Giải thích phương trình bậc nhất',requestId},'ip',true,true);
    expect(db.mathReviewLog.findFirst).not.toHaveBeenCalled();expect(db.question.findFirst).not.toHaveBeenCalled();
    expect(db.aiRequest.findMany.mock.calls[0][0].where).toMatchObject({userId:'alice',task:'MATH_TUTOR',conversationId:conversation});
    expect(budget.reserve.mock.calls[0][0]).toMatchObject({task:'MATH_TUTOR',conversationId:conversation});
  });
  it('rejects malformed standalone conversations before provider calls',async()=>{
    await expect(service.feedback('alice',{reviewId:'bad',reason:'Hi',requestId},'ip',true,true)).rejects.toThrow('hội thoại');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('blocks the floating tutor during diagnostics',async()=>{
    db.diagnosticAttempt.findFirst.mockResolvedValue({id:'exam'});
    await expect(service.chatHistory('alice','12345678-1234-4234-8234-123456789abc',true)).rejects.toThrow('tạm dừng');
    expect(db.aiRequest.findMany).not.toHaveBeenCalled();
  });
  it('sends server-owned earlier turns with the current question and stores a request identity',async()=>{
    db.aiRequest.findMany.mockResolvedValue([{lessonId:'older-request',message:'Vì sao chia?',result:{text:'Để tìm x.'}}]);
    const result=await service.feedback('alice',{reviewId:'review',reason:'Chia thế nào?',requestId},'127.0.0.1',true);
    expect(result.text).toContain('Chia hai');
    const sent=JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(sent.messages.slice(0,2)).toEqual([{role:'user',content:'Vì sao chia?'},{role:'assistant',content:'Để tìm x.'}]);
    expect(sent.messages[2].content).toContain('2x=6');
    expect(budget.reserve.mock.calls[0][0]).toMatchObject({task:'MATH_CHAT',userId:'alice',conversationId:'review',lessonId:requestId});
    expect(budget.reserve.mock.calls[0][0].id).toMatch(/^[a-f0-9]{64}$/);
    expect(db.aiRequest.findMany.mock.calls[0][0].where).toMatchObject({userId:'alice',conversationId:'review'});
  });
  it('replays a completed request without calling or charging the provider',async()=>{
    db.aiRequest.findFirst.mockResolvedValue({message:'Vì sao?',status:'COMPLETED',result:{text:'Vì hai vế bằng nhau.'}});
    expect(await service.feedback('alice',{reviewId:'review',reason:'Vì sao?',requestId},'ip',true)).toMatchObject({replayed:true});
    expect(fetch).not.toHaveBeenCalled();expect(budget.reserve).not.toHaveBeenCalled();
  });
  it('refuses a request identity reused with different text',async()=>{
    db.aiRequest.findFirst.mockResolvedValue({message:'Earlier',status:'COMPLETED',result:{text:'Answer'}});
    await expect(service.feedback('alice',{reviewId:'review',reason:'Changed',requestId},'ip',true)).rejects.toThrow('câu hỏi khác');
  });
  it('replays redacted input consistently without storing or resending credentials',async()=>{
    db.aiRequest.findFirst.mockResolvedValue({message:'Khóa [đã ẩn]',status:'COMPLETED',result:{text:'Không cần khóa để giải bài.'}});
    const result=await service.feedback('alice',{reviewId:'review',reason:'Khóa test-only-credential',requestId},'ip',true);
    expect(result).toMatchObject({replayed:true});expect(fetch).not.toHaveBeenCalled();
  });
  it('refuses another student’s review before reading history or calling AI',async()=>{
    db.mathReviewLog.findFirst.mockResolvedValue(null);
    await expect(service.chatHistory('bob','review')).rejects.toThrow('của bạn');
    await expect(service.feedback('bob',{reviewId:'review',reason:'Hi',requestId},'ip',true)).rejects.toThrow('của bạn');
    expect(db.mathReviewLog.findFirst.mock.calls[0][0].where.card.studentId).toBe('bob');
    expect(db.aiRequest.findMany).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
  });
  it('blocks history and chat while an exam is active',async()=>{
    db.diagnosticAttempt.findFirst.mockResolvedValue({id:'exam'});
    await expect(service.chatHistory('alice','review')).rejects.toThrow('tạm dừng');
    await expect(service.feedback('alice',{reviewId:'review',reason:'Hi',requestId},'ip',true)).rejects.toThrow('tạm dừng');
  });
  it('keeps study independent of disabled AI and never calls a provider',async()=>{
    vi.stubEnv('AI_ENABLED','false');
    await expect(service.feedback('alice',{reviewId:'review',reason:'Hi',requestId},'ip',true)).rejects.toThrow('chưa được bật');
    expect((await service.chatHistory('alice','review')).messages).toEqual([]);expect(fetch).not.toHaveBeenCalled();
  });
  it('retains an uncertain reservation on a network failure',async()=>{
    (fetch as any).mockRejectedValue(new Error('network'));
    await expect(service.feedback('alice',{reviewId:'review',reason:'Hi',requestId},'ip',true)).rejects.toThrow('tạm thời');
    expect(budget.fail).toHaveBeenCalledWith('reservation',false);expect(budget.settle).not.toHaveBeenCalled();
  });
  it('stops before contacting the provider when the budget rejects a request',async()=>{
    budget.reserve.mockRejectedValue(new Error('budget exhausted'));
    await expect(service.feedback('alice',{reviewId:'review',reason:'Hi',requestId},'ip',true)).rejects.toThrow('budget exhausted');expect(fetch).not.toHaveBeenCalled();
  });
  it('withholds the reply if an exam starts during the provider request but still accounts for its cost',async()=>{
    db.diagnosticAttempt.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValue({id:'started-exam'});
    await expect(service.feedback('alice',{reviewId:'review',reason:'Explain',requestId},'ip',true)).rejects.toThrow('Bài kiểm tra đã bắt đầu');
    expect(budget.settle).toHaveBeenCalledWith('reservation',100,30,{withheld:true});
  });
  it('records a rejected non-billed request without releasing uncertain network requests',async()=>{
    (fetch as any).mockResolvedValue({ok:false,status:401});
    await expect(service.feedback('alice',{reviewId:'review',reason:'Explain',requestId},'ip',true)).rejects.toThrow('tạm thời');
    expect(budget.fail).toHaveBeenCalledWith('reservation',true);expect(budget.settle).not.toHaveBeenCalled();
  });
  it('clears conversation content without deleting usage accounting',async()=>{
    await service.clearChat('alice','review');
    expect(db.aiRequest.updateMany.mock.lastCall[0]).toMatchObject({where:{userId:'alice',conversationId:'review'},data:{message:null,result:{deleted:true},conversationId:null}});
    expect(db.aiRequest.updateMany.mock.lastCall[0].data).not.toHaveProperty('costUsd');
  });
  it('does not clear an in-flight request',async()=>{
    db.aiRequest.count.mockResolvedValue(1);
    await expect(service.clearChat('alice','review')).rejects.toThrow('Chờ');expect(db.aiRequest.updateMany.mock.calls.every(([query]:any)=>query.data.result.expired)).toBe(true);
  });
});
