import type { LessonContent } from '../../../content/lesson.model';
import { SAMPLES } from './http.samples';

export const HTTP: LessonContent = {
  slug: 'http',
  metaphor:
    'Mỗi request HTTP là một phong bì có chân, đi bộ qua các trạm bưu điện (interceptor). Trạm thì đóng dấu token, trạm thì ghi sổ, trạm thì lo khi thư bị trả về. Tới server xong, phong bì lại đi ngược qua đúng các trạm đó để về nhà!',
  intro:
    'HttpClient gửi request và trả về Observable. Interceptor là hàm đứng giữa: sửa request trước khi đi (thêm header) và xử lý response khi về (log, retry, dịch lỗi). Thứ tự khai báo trong withInterceptors chính là thứ tự các trạm.',
  visualizer: {
    title: 'Bưu điện Interceptor',
    hint: 'Chọn phản hồi của server (200 / 401 / 500) và độ trễ mạng, rồi bấm "Gửi GET /api/me". Xem phong bì được đóng dấu ở mỗi trạm, tới server rồi quay về.',
  },
  code: [
    { name: 'interceptors.ts', lang: 'angular-ts', code: SAMPLES['interceptors.ts'], anchors: { 7: 'auth', 8: 'auth', 9: 'auth', 11: 'log', 12: 'log', 13: 'log', 14: 'log', 15: 'log', 16: 'log', 19: 'error', 20: 'error', 21: 'error', 22: 'error', 23: 'error', 24: 'error', 28: 'server', 29: 'server', 30: 'server', 31: 'server', 32: 'server', 33: 'server', 34: 'server', 35: 'server', 36: 'server' } },
    { name: 'http.providers.ts', lang: 'angular-ts', code: SAMPLES['http.providers.ts'], anchors: { 6: 'chain', 7: 'chain' } },
    { name: 'profile-loader.ts', lang: 'angular-ts', code: SAMPLES['profile-loader.ts'], anchors: { 25: 'client', 33: 'client' } },
    { name: 'mock-server.ts', lang: 'angular-ts', code: SAMPLES['mock-server.ts'], anchors: { 6: 'server', 7: 'server' } },
    { name: 'http-log.ts', lang: 'angular-ts', code: SAMPLES['http-log.ts'] },
  ],
  liveNote: 'HttpClient thật với interceptor thật (provide ở cấp route của bài này). Server là interceptor giả lập nên không có request mạng nào được gửi đi.',
  stackblitzExtra: {
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { ProfileLoader } from './app/profile-loader';
import { HTTP_PROVIDERS } from './app/http.providers';

bootstrapApplication(ProfileLoader, { providers: HTTP_PROVIDERS }).catch((err) => console.error(err));
`,
    'src/index.html': `<!doctype html>\n<html lang="vi">\n<head><meta charset="utf-8"><title>HTTP</title></head>\n<body><app-profile-loader></app-profile-loader></body>\n</html>\n`,
  },
  challenges: [
    { id: 'http-ok', title: 'Gửi một request thành công (200) và xem đủ dấu ở mọi trạm.', hint: 'Chọn server trả 200 rồi bấm Gửi.', praise: 'Phong bì về nhà an toàn, đủ dấu token và sổ ghi chép!' },
    { id: 'http-401', title: 'Giả lập lỗi 401 và xem trạm xử lý lỗi dịch nó thành thông báo dễ hiểu.', hint: 'Chọn server trả 401.', praise: 'Đúng! Một chỗ xử lý lỗi chung cho mọi request — không phải lặp lại ở từng component.' },
    { id: 'http-retry', title: 'Giả lập lỗi 500: xem errorInterceptor tự gửi lại một lần trước khi bỏ cuộc.', hint: 'Chọn server trả 500. Phong bì sẽ đi tới server HAI lần.', praise: 'Tuyệt! retry giúp vượt qua lỗi tạm thời mà component không cần biết.' },
  ],
  pitfalls: [
    {
      title: 'Sửa trực tiếp request trong interceptor',
      explain: 'HttpRequest là bất biến. Muốn thêm header phải clone() rồi chuyển bản mới cho next().',
      wrong: { lang: 'typescript', code: `req.headers.set('Authorization', 'Bearer x'); // không có tác dụng\nreturn next(req);` },
      right: { lang: 'typescript', code: `return next(req.clone({ setHeaders: { Authorization: 'Bearer x' } }));` },
    },
    {
      title: 'Gọi http.get() mà không subscribe',
      explain: 'Observable của HttpClient là "lạnh": không ai subscribe thì không có request nào được gửi.',
      wrong: { lang: 'typescript', code: `this.http.post('/api/save', data); // chẳng gửi gì cả` },
      right: { lang: 'typescript', code: `this.http.post('/api/save', data).subscribe();\n// hoặc dùng toSignal / httpResource` },
    },
    {
      title: 'Quên provideHttpClient()',
      explain: 'Không provide thì inject(HttpClient) báo NullInjectorError. Interceptor cũng phải đăng ký qua withInterceptors.',
      wrong: { lang: 'typescript', code: `bootstrapApplication(App); // inject(HttpClient) lỗi` },
      right: { lang: 'typescript', code: `bootstrapApplication(App, {\n  providers: [provideHttpClient(withInterceptors([authInterceptor]))],\n});` },
    },
  ],
  quiz: [
    { question: 'withInterceptors([auth, logging, error]). Trên đường VỀ, response đi qua theo thứ tự nào?', options: ['auth → logging → error', 'error → logging → auth', 'Ngẫu nhiên', 'Chỉ qua error'], correct: 1, explain: 'Đi thì theo thứ tự khai báo, về thì ngược lại — như đi và về qua cùng một dãy trạm.' },
    { question: 'Muốn mọi request đều có header Authorization, cách gọn nhất là…', options: ['Thêm header ở từng lời gọi http.get', 'Một interceptor clone request và setHeaders', 'Sửa file index.html', 'Dùng localStorage'], correct: 1, explain: 'Interceptor là điểm chung mọi request đều đi qua.' },
    { question: 'this.http.get(url) trả về gì?', options: ['Dữ liệu ngay lập tức', 'Một Promise', 'Một Observable, chỉ gửi request khi được subscribe', 'Một signal'], correct: 2, explain: 'HttpClient trả về Observable lạnh; subscribe (hoặc toSignal) mới thật sự gửi request.' },
  ],
  doneMessage: 'Mọi phong bì đều về đích! Bạn là trưởng bưu cục HTTP.',
};
