import { describe, it, expect, vi } from 'vitest';
import { MathReviewService } from '../src/modules/student/math-review.service';
import { createEmptyCard } from 'ts-fsrs';

describe('Math personal review', () => {
  it('blocks revision while a diagnostic is active', async () => {
    const db:any = { diagnosticAttempt:{findFirst:vi.fn().mockResolvedValue({id:'exam'})} };
    const service = new MathReviewService(db, {} as any);
    await expect(service.summary('student')).rejects.toThrow('tạm dừng');
    await expect(service.reveal('student','card',{answer:'A'})).rejects.toThrow('tạm dừng');
  });
  it('does not expose solutions in the queue', async () => {
    const db:any = {diagnosticAttempt:{findFirst:vi.fn().mockResolvedValue(null)},
      assignmentQuestion:{findMany:vi.fn().mockResolvedValue([])},mathReviewCard:{findMany:vi.fn().mockResolvedValue([{id:'c',questionId:'q'}])},
      question:{findMany:vi.fn().mockResolvedValue([{id:'q',status:'PUBLISHED',questionType:'SINGLE_CHOICE',content:'2x=6',skill:{grade:10,title:'Equations'},explanation:'x=3',options:[{optionKey:'A',content:'3',isCorrect:true}]}])}};
    const queue=await new MathReviewService(db,{} as any).queue('student');
    expect(queue[0]).not.toHaveProperty('explanation');
    expect(queue[0].options[0]).not.toHaveProperty('isCorrect');
    expect(db.mathReviewCard.findMany.mock.calls[0][0].where.studentId).toBe('student');
  });
  it('only enrolls questions in the requesting student’s notebook',async()=>{
    const db:any={diagnosticAttempt:{findFirst:vi.fn().mockResolvedValue(null)},mistakeRecord:{findFirst:vi.fn().mockResolvedValue(null)}};
    await expect(new MathReviewService(db,{} as any).enroll('student','foreign')).rejects.toThrow('sổ lỗi');
    expect(db.mistakeRecord.findFirst.mock.calls[0][0].where.studentId).toBe('student');
  });
  it('forces relearning for a wrong answer and refuses replay',async()=>{
    const log:any={id:'log',cardId:'c',cardVersion:0,createdAt:new Date(),correct:false,completedAt:null,card:{id:'c',version:0,scheduler:createEmptyCard()}};
    const db:any={diagnosticAttempt:{findFirst:vi.fn().mockResolvedValue(null)},$queryRaw:vi.fn(),mathReviewLog:{findFirst:vi.fn().mockResolvedValue(log),update:vi.fn().mockImplementation(({data})=>Object.assign(log,data))},mathReviewCard:{update:vi.fn()}};
    db.$transaction=(fn:any)=>fn(db);
    const service=new MathReviewService(db,{} as any);
    expect((await service.review('student','log',{rating:4})).rating).toBe(1);
    expect(db.mathReviewCard.update.mock.calls[0][0].data.failures).toEqual({increment:1});
    await expect(service.review('student','log',{rating:4})).rejects.toThrow('đã lưu');
  });
});
