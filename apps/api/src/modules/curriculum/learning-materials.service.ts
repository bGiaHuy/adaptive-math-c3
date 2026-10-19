import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const { PDFParse } = require('pdf-parse');

@Injectable()
export class LearningMaterialsService {
  private readonly root = path.resolve(process.env.MATH_PROJECT_ROOT || path.resolve(__dirname, '../../../../..'));
  private readonly catalogPath = path.join(this.root, 'content/thpt-materials/catalog.json');
  private readonly cache = path.join(this.root, '.cache/materials-pages');
  private renderQueue: Promise<any> = Promise.resolve();
  private inFlight = new Map<string, Promise<string>>();

  catalog() {
    try { return JSON.parse(fs.readFileSync(this.catalogPath, 'utf8')); }
    catch { throw new ServiceUnavailableException('Chưa tải được danh mục học liệu. Vui lòng thử lại.'); }
  }

  questions() {
    try { return JSON.parse(fs.readFileSync(path.join(this.root, 'content/thpt-materials/questions.json'), 'utf8')); }
    catch { throw new ServiceUnavailableException('Chưa tải được các câu trích từ đề gốc.'); }
  }

  questionImage(id: string, segment: number) {
    const question = this.questions().items.find((q: any) => q.id === id);
    if (!question || !Number.isInteger(segment) || segment < 1 || segment > question.images.length) throw new NotFoundException('Không tìm thấy ảnh câu hỏi.');
    const name = question.images[segment - 1];
    if (!/^[A-Za-z0-9_-]+\.png$/.test(name)) throw new NotFoundException('Không tìm thấy ảnh câu hỏi.');
    const file = path.join(this.root, 'content/thpt-materials/question-images', name);
    if (!fs.existsSync(file)) throw new NotFoundException('Không tìm thấy ảnh câu hỏi.');
    return file;
  }

  paper(id: string) {
    if (!/^THPT-(10|11|12)-[A-Z0-9_-]+$/.test(id)) throw new NotFoundException('Không tìm thấy đề.');
    const paper = this.catalog().items.find((p: any) => p.id === id);
    if (!paper) throw new NotFoundException('Không tìm thấy đề.');
    return paper;
  }

  file(id: string) {
    this.paper(id);
    const file = path.join(this.root, 'outputs/thpt-300-papers/sources', `${id}.pdf`);
    if (!fs.existsSync(file)) throw new NotFoundException('Tệp đề hiện không có sẵn.');
    return file;
  }

  async page(id: string, pageNumber: number) {
    const paper = this.paper(id);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > paper.pageCount) throw new NotFoundException('Trang không tồn tại.');
    const folder = path.join(this.cache, paper.sha256);
    const output = path.join(folder, `${pageNumber}.png`);
    if (fs.existsSync(output)) return output;
    if (this.inFlight.has(output)) return this.inFlight.get(output);
    const task = this.renderQueue.catch(() => {}).then(async () => {
      let parser;
      try {
        parser = new PDFParse({ data: fs.readFileSync(this.file(id)), verbosity: 0 });
        const result = await parser.getScreenshot({ partial: [pageNumber], desiredWidth: 1440, imageDataUrl: false });
        if (!result.pages[0]?.data) throw new Error('No page image');
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(output, result.pages[0].data);
        return output;
      } catch { throw new ServiceUnavailableException('Chưa hiển thị được trang này. Bạn có thể mở tệp PDF gốc.'); }
      finally { await parser?.destroy(); this.inFlight.delete(output); }
    });
    this.inFlight.set(output, task);
    this.renderQueue = task;
    return task;
  }
}
