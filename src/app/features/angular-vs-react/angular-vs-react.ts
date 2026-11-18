import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CodeLang } from '../../content/lesson.model';
import { CodePanel } from '../../shared/ui/code-panel/code-panel';
import { Icon } from '../../shared/ui/icon/icon';
import { MascotSays } from '../../shared/ui/speech-bubble/speech-bubble';

interface Pair {
  title: string;
  note: string;
  lesson: string;
  react: string;
  angular: string;
  ngLang?: CodeLang;
}

/** Nội dung trang đối chiếu — để riêng khỏi template cho dễ sửa. */
const PAIRS: Pair[] = [
  {
    title: 'Component', lesson: 'component',
    note: 'React: một hàm trả về JSX. Angular: một class gắn @Component, template tách khỏi logic.',
    react: `function Hello({ name }) {\n  return <h1>Xin chào {name}</h1>;\n}`,
    angular: `@Component({\n  selector: 'app-hello',\n  template: \`<h1>Xin chào {{ name() }}</h1>\`,\n})\nexport class Hello {\n  name = input('Bíp');\n}`,
  },
  {
    title: 'State', lesson: 'signals',
    note: 'useState trả về [giá trị, hàm set]. signal là một hàm đọc được, có .set() và .update().',
    react: `const [count, setCount] = useState(0);\nsetCount((c) => c + 1);`,
    angular: `count = signal(0);\nthis.count.update((c) => c + 1);`,
    ngLang: 'typescript',
  },
  {
    title: 'Giá trị dẫn xuất', lesson: 'signals',
    note: 'useMemo cần mảng phụ thuộc viết tay. computed tự theo dõi signal nào được đọc.',
    react: `const total = useMemo(() => price * qty, [price, qty]);`,
    angular: `total = computed(() => this.price() * this.qty());`,
    ngLang: 'typescript',
  },
  {
    title: 'Side effect', lesson: 'signals',
    note: 'useEffect chạy sau render theo mảng phụ thuộc. effect chạy lại khi signal nó đọc thay đổi.',
    react: `useEffect(() => {\n  localStorage.setItem('cart', JSON.stringify(cart));\n}, [cart]);`,
    angular: `effect(() => {\n  localStorage.setItem('cart', JSON.stringify(this.cart()));\n});`,
    ngLang: 'typescript',
  },
  {
    title: 'Props & sự kiện', lesson: 'input-output',
    note: 'React truyền callback qua props. Angular tách rõ input() (vào) và output() (ra).',
    react: `<ProductBox qty={qty} onBuy={(n) => order(n)} />`,
    angular: `<app-product-box [qty]="qty()" (buy)="order($event)" />`,
    ngLang: 'angular-html',
  },
  {
    title: 'Hai chiều', lesson: 'data-binding',
    note: 'React dùng controlled input (value + onChange). Angular có [( )] "hộp chuối".',
    react: `<input value={name} onChange={(e) => setName(e.target.value)} />`,
    angular: `<input [(ngModel)]="name" />`,
    ngLang: 'angular-html',
  },
  {
    title: 'Điều kiện & danh sách', lesson: 'control-flow',
    note: 'React dùng biểu thức JS và key. Angular có @if/@for built-in với track.',
    react: `{show && <p>Mẹo</p>}\n{fruits.map((f) => <li key={f.id}>{f.name}</li>)}`,
    angular: `@if (show()) { <p>Mẹo</p> }\n@for (f of fruits(); track f.id) { <li>{{ f.name }}</li> }`,
    ngLang: 'angular-html',
  },
  {
    title: 'Chia sẻ phụ thuộc', lesson: 'dependency-injection',
    note: 'React dùng Context + Provider bọc cây. Angular có hệ thống DI dựng sẵn với inject().',
    react: `const CartContext = createContext(null);\nconst cart = useContext(CartContext);`,
    angular: `@Service()\nexport class CartService { … }\n\ncart = inject(CartService);`,
    ngLang: 'typescript',
  },
  {
    title: 'Routing', lesson: 'routing',
    note: 'React cần thư viện ngoài (React Router…). Angular có @angular/router chính chủ, kèm guard và lazy load.',
    react: `<Route path="/san-pham/:id" element={<Product />} />`,
    angular: `{ path: 'san-pham/:id', component: ProductStop }`,
    ngLang: 'typescript',
  },
  {
    title: 'Gọi API', lesson: 'http',
    note: 'React thường dùng fetch + thư viện (React Query…). Angular có HttpClient với interceptor.',
    react: `const { data } = useQuery({ queryKey: ['me'], queryFn: () => fetch('/api/me').then((r) => r.json()) });`,
    angular: `me = httpResource<User>(() => '/api/me');\n// hoặc: this.http.get<User>('/api/me')`,
    ngLang: 'typescript',
  },
  {
    title: 'Cập nhật giao diện', lesson: 'change-detection',
    note: 'React render lại cả hàm component rồi so Virtual DOM. Angular zoneless + signals cập nhật đúng chỗ đọc signal.',
    react: `// setState → chạy lại toàn bộ hàm Component → diff Virtual DOM`,
    angular: `// signal đổi → chỉ component đọc nó được làm mới`,
    ngLang: 'typescript',
  },
];

@Component({
  selector: 'app-angular-vs-react',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodePanel, Icon, MascotSays, RouterLink],
  template: `
    <header class="head">
      <p class="eyebrow">Trang đối chiếu nhanh</p>
      <h1>Angular vs React</h1>
      <app-mascot-says mood="thinking" [size]="100">
        Đã quen React? Tuyệt! Phần lớn ý tưởng giống nhau, chỉ khác cách gọi tên. Đây là "từ điển song ngữ" của bạn.
      </app-mascot-says>
    </header>
    <div class="pairs">
      @for (p of pairs; track p.title) {
        <article class="pair toon">
          <div class="pair-head">
            <h2>{{ p.title }}</h2>
            <a class="btn btn-sm" [routerLink]="['/bai', p.lesson]">Xem bài học <app-icon name="arrowRight" [size]="14" /></a>
          </div>
          <p class="note">{{ p.note }}</p>
          <div class="cols">
            <div><p class="lang react">React</p><app-code-panel [files]="[{ name: 'react', lang: 'tsx', code: p.react }]" [compact]="true" /></div>
            <div><p class="lang ng">Angular</p><app-code-panel [files]="[{ name: 'angular', lang: p.ngLang ?? 'angular-ts', code: p.angular }]" [compact]="true" /></div>
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    :host { display: block; max-width: var(--content-max); margin: 0 auto; padding: 28px 28px 90px; }
    .head { display: grid; gap: 14px; margin-bottom: 26px; }
    .head h1 { font-size: var(--fs-3xl); margin: 0; }
    .head .eyebrow { margin: 0; }
    .pairs { display: grid; gap: 22px; }
    .pair { padding: 18px 20px; }
    .pair-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
    .pair-head h2 { margin: 0; font-size: var(--fs-xl); }
    .note { margin: 6px 0 12px; }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .cols > div, .pair { min-width: 0; }
    .lang { margin: 0 0 4px; font-family: var(--font-display); font-weight: 800; }
    .lang.react { color: var(--c-brand); color: #0b6e8f; }
    :root[data-theme='dark'] .lang.react { color: var(--pal-sky); }
    .lang.ng { color: var(--c-error-strong); }
    @media (max-width: 760px) { :host { padding: 18px 14px 60px; } .cols { grid-template-columns: 1fr; } }
  `,
})
export class AngularVsReact {
  protected readonly pairs = PAIRS;
}
