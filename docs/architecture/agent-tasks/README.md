# Gói công việc cho agent

| ID    | Người thực hiện | Phụ thuộc                           | Rủi ro | Phạm vi                             |
| ----- | --------------- | ----------------------------------- | ------ | ----------------------------------- |
| C3-01 | Codex           | Nền tảng                            | Cao    | Baseline THPT và isolation snapshot |
| C3-02 | Antigravity     | Nền tảng                            | Thấp   | Helper trình bày báo cáo            |
| C3-03 | Antigravity     | Nền tảng                            | Thấp   | Helper nhóm đề                      |
| C3-04 | Codex           | C3-01                               | Cao    | Projection báo cáo server           |
| C3-05 | Codex           | Nền tảng; cần xác nhận đích hạ tầng | Cao    | Cấu hình deploy riêng C3            |

Chọn đúng một gói. C3-02 và C3-03 có thể chạy song song; các gói khác thực hiện tuần tự. Không sửa policy, package scripts, schema, root AGENTS hay tệp ngoài danh sách để hoàn tất gói. Nếu cần ngoài phạm vi, báo chặn và đề xuất cụ thể cho Codex.
Không đánh dấu test toàn phần đạt khi chỉ chạy test chọn lọc. Dùng báo cáo gồm ID, commit, tệp đã đổi, hành vi trước/sau, lệnh và exit code, lỗi baseline, rủi ro và rollback.
