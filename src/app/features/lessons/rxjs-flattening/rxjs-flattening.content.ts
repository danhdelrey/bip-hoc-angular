import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './rxjs-flattening.samples';

export const CHEATSHEET = `// Mỗi giá trị nguồn → một Observable con (thường là HTTP)
search$  = term$.pipe(debounceTime(300), switchMap((q) => api.search(q)));   // chỉ cần cái MỚI NHẤT
save$    = draft$.pipe(concatMap((d) => api.save(d)));                       // giữ THỨ TỰ, không bỏ cái nào
order$   = click$.pipe(exhaustMap(() => api.placeOrder(cart)));              // BỎ QUA khi đang bận
upload$  = files$.pipe(mergeMap((f) => api.upload(f), 3));                   // SONG SONG, tối đa 3

// Trong component: kết quả về signal, tự huỷ khi component bị huỷ
results = toSignal(this.search$, { initialValue: [] });`;

export const RXJS_FLATTENING: LessonContent = {
  slug: 'rxjs-flattening',
  metaphor:
    'Bốn bạn shipper nhận đơn theo bốn kiểu. mergeMap chạy hết mọi đơn cùng lúc, ai về trước giao trước. concatMap xếp hàng, xong đơn này mới đi đơn kia. switchMap thấy đơn mới là bỏ ngang đơn cũ. exhaustMap đang bận thì bịt tai, không nhận thêm. Chọn sai shipper là khách nhận nhầm hàng!',
  intro:
    'Khi mỗi giá trị của một stream sinh ra một Observable con (gọi HTTP chẳng hạn), bạn phải chọn cách "làm phẳng": chạy song song (mergeMap), xếp hàng (concatMap), huỷ cái cũ (switchMap) hay bỏ qua cái mới (exhaustMap). Chọn sai sinh ra race condition: kết quả cũ về muộn ghi đè kết quả mới, đơn hàng bị tạo hai lần, bản lưu bị đảo thứ tự.',
  visualizer: {
    title: 'Bốn shipper, ba tình huống',
    hint: 'Chọn tình huống và operator rồi bấm "Chạy". Mỗi thanh ngang là một request: dài bao lâu, bị huỷ (✗), bị bỏ qua (—) hay phải chờ (vạch chấm). Dòng cuối là điều người dùng thực sự nhận được.',
  },
  code: [
    { name: 'race-search.ts', lang: 'angular-ts', code: SAMPLES['race-search.ts'], anchors: { 5: 'ops', 9: 'latency', 10: 'latency', 35: 'switch', 36: 'ops', 37: 'ops', 46: 'start', 48: 'done', 49: 'cancel' } },
    { name: 'chon-operator.ts', lang: 'typescript', code: CHEATSHEET, anchors: { 2: 'switchMap', 3: 'concatMap', 4: 'exhaustMap', 5: 'mergeMap' } },
  ],
  liveNote: 'Ô tìm kiếm thật với API giả: từ khoá ngắn trả lời chậm hơn. Chọn mergeMap rồi gõ nhanh "angular": kết quả cuối cùng có thể là của "a"! Đổi sang switchMap và thử lại.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';\nimport { RaceSearch } from './app/race-search';\n\nbootstrapApplication(RaceSearch).catch((err) => console.error(err));\n`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>RxJS flattening</title></head>\n<body><app-race-search></app-race-search></body>\n</html>\n`,
  },
  challenges: [
    { id: 'rf-search', title: 'Ô tìm kiếm: chỉ hiển thị đúng một kết quả, của từ khoá cuối cùng.', hint: 'Kết quả của "a" về muộn nhất. Cần huỷ những request đã lỗi thời.', praise: 'Hết race condition! switchMap huỷ request cũ khi có từ khoá mới.' },
    { id: 'rf-order', title: 'Nút đặt hàng bị bấm 3 lần: chỉ được tạo đúng 1 đơn.', hint: 'Huỷ phía client chưa chắc server chưa nhận. Tốt nhất là không gửi thêm khi đang bận.', praise: 'Không đơn trùng! exhaustMap bỏ qua cú bấm khi đơn đầu chưa xong.' },
    { id: 'rf-save', title: 'Tự động lưu nháp: server nhận đủ cả 3 bản, đúng thứ tự.', hint: 'Không bỏ bản nào, không cho bản sau vượt bản trước.', praise: 'Chuẩn! concatMap xếp hàng nên bản mới nhất luôn là bản cuối cùng.' },
  ],
  pitfalls: [
    {
      title: 'Lồng subscribe',
      explain: 'Subscribe bên trong subscribe không huỷ được request cũ, khó dọn dẹp và dễ rò bộ nhớ. Dùng một operator làm phẳng.',
      wrong: { lang: 'typescript', code: `term$.subscribe((q) => {\n  api.search(q).subscribe((r) => (this.results = r));\n});` },
      right: { lang: 'typescript', code: `results = toSignal(term$.pipe(switchMap((q) => api.search(q))), { initialValue: [] });` },
    },
    {
      title: 'Dùng switchMap cho thao tác ghi',
      explain: 'switchMap huỷ phía client, nhưng request POST có thể đã tới server. Với đặt hàng, thanh toán: dùng exhaustMap (hoặc concatMap) và vô hiệu hoá nút.',
      wrong: { lang: 'typescript', code: `click$.pipe(switchMap(() => api.pay(cart)))` },
      right: { lang: 'typescript', code: `click$.pipe(exhaustMap(() => api.pay(cart)))` },
    },
    {
      title: 'mergeMap không giới hạn',
      explain: 'Kéo thả 200 file với mergeMap là 200 request cùng lúc. Truyền tham số concurrency.',
      wrong: { lang: 'typescript', code: `files$.pipe(mergeMap((f) => api.upload(f)))` },
      right: { lang: 'typescript', code: `files$.pipe(mergeMap((f) => api.upload(f), 3)) // tối đa 3 cùng lúc` },
    },
  ],
  quiz: [
    { question: 'Ô tự gợi ý khi gõ. Operator nào hợp nhất?', options: ['mergeMap', 'concatMap', 'switchMap', 'exhaustMap'], correct: 2, explain: 'Chỉ cần kết quả của từ khoá mới nhất; huỷ cái cũ.' },
    { question: 'Nút "Đăng nhập" bị bấm liên tục. Operator nào tránh gửi nhiều request?', options: ['exhaustMap', 'mergeMap', 'switchMap', 'concatMap'], correct: 0, explain: 'exhaustMap bỏ qua giá trị mới khi request hiện tại chưa xong.' },
    { question: 'Race condition trong ô tìm kiếm dùng mergeMap xảy ra vì…', options: ['RxJS bị lỗi', 'Request cũ có thể về SAU request mới và ghi đè kết quả', 'Thiếu debounceTime', 'Server trả về lỗi'], correct: 1, explain: 'mergeMap không quan tâm thứ tự hoàn thành; kết quả nào về sau cùng thì thắng.' },
  ],
  doneMessage: 'Bạn đã thuần hoá bốn shipper RxJS — không còn race condition nào lọt lưới!',
};
