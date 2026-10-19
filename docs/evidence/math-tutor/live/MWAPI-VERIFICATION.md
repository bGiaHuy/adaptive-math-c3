# MWAPI real provider verification

Date: 2026-10-14T15:18:25.776Z

- Two authenticated browser chat turns through Math Vercel → isolated Render → MWAPI. No provider mock used.
- Model: claude-haiku-4-5-20251001. Pricing accepted by user: input $5 / output $25 per million tokens.
- Both persisted requests COMPLETED; reservation released; token-based cost verified.
- Total recorded cost: $0.058265.
- Desktop + 390px mobile; no horizontal overflow.
- Controlled QA question in grade 99, outside the real curriculum. Fixture and chat content removed after the test; usage accounting retained against a suspended test account.
- Does not certify any real question bank as reviewed or published.

First response:

Vì khi bạn chia cả hai vế cho cùng một số (khác 0), phương trình vẫn giữ nguyên tính chất bằng nhau.

Ở đây, từ $2x = 6$, nếu chỉ chia vế trái cho 2 mà không chia vế phải, bạn sẽ được $x = 6$, điều này sai. Chia cả hai vế đảm bảo dấu "=" vẫn đúng: $\frac{2x}{2} = \frac{6}{2}$, rút gọn thành $x = 3$.

Đó là quy tắc cơ bản: **để giữ phương trình tương đương, các phép biến đổi phải tác động như nhau lên cả hai vế**.

Follow-up response:

Không, nếu chỉ chia vế trái thì phương trình không còn tương đương.

Cụ thể: từ $2x = 6$, nếu chỉ chia vế trái cho 2, bạn được $x = 6$. Nhưng điều này sai vì:
- Vế trái: $\frac{2x}{2} = x$
- Vế phải: vẫn là $6$ (không chia)

Khi đó $x = 6$ không phải nghiệm của phương trình gốc. Kiểm tra: $2 \times 6 = 12 \neq 6$.

**Lý do**: phương trình biểu thị một cân bằng. Nếu bạn "làm gì" với một vế mà không làm với vế kia, cân bằng bị phá vỡ. Chỉ khi thực hiện **cùng một phép biến đổi** trên cả hai vế, phương trình mới giữ nguyên các nghiệm — tức là vẫn tương đương.
