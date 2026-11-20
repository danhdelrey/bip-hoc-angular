import{a as s,r as i}from"./chunk-CU34vlzr.js";import"./chunk-01dJepQV.js";import"./chunk-BCFjnNuI.js";import"./main-PLPDKBOT.js";import"./chunk-D-ZVesmq.js";import"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import"./chunk-tn7znALI.js";var e=(n,t)=>n?getComputedStyle(n).getPropertyValue(t).trim():``;var p={title:`Tailwind CSS`,subtitle:`bài luyện utility class trên CSS thật (biên dịch Tailwind v4 ngay trong trình duyệt): dựng thẻ, flex + gap, biến thể disabled:, không ghép tên class, class xung đột.`,exercises:[{id:`san-choi`,group:`Bắt đầu`,title:`Sân chơi tự do`,level:`Tự do`,lv:0,noCheck:!0,desc:`<p>Vi\u1EBFt class Tailwind trong template, b\u1EA5m Ch\u1EA1y \u0111\u1EC3 xem k\u1EBFt qu\u1EA3. Lab bi\xEAn d\u1ECBch Tailwind v4 ngay trong tr\xECnh duy\u1EC7t cho \u0111\xFAng nh\u1EEFng class c\xF3 trong code c\u1EE7a b\u1EA1n, v\xE0 CSS ch\u1EC9 \xE1p trong khung preview.</p>
<div class="tip">Kh\xF4ng c\xF3 preflight (CSS reset) \u0111\u1EC3 kh\xF4ng \u0111\u1EE5ng giao di\u1EC7n trang h\u1ECDc. Bi\u1EBFn th\u1EC3 <code>dark:</code> \u0111i theo ch\u1EBF \u0111\u1ED9 s\xE1ng/t\u1ED1i c\u1EE7a trang.</div>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <div class="max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">B\xEDp H\u1ECDc Angular</h3>
      <p class="mt-2 text-sm text-slate-500">Th\u1EED \u0111\u1ED5i class r\u1ED3i b\u1EA5m Ch\u1EA1y.</p>
      <button class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">B\u1EAFt \u0111\u1EA7u</button>
    </div>
  \`,
})
class App {}

mount(App);
`},{id:`the-card`,group:`Utility cơ bản`,title:`Dựng thẻ bằng utility class`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>Tailwind thay CSS vi\u1EBFt tay b\u1EB1ng c\xE1c class nh\u1ECF, m\u1ED7i class m\u1ED9t vi\u1EC7c: <code>p-4</code> (padding 1rem), <code>rounded-lg</code> (bo g\xF3c 0,5rem), <code>shadow-md</code> (\u0111\u1ED5 b\xF3ng), <code>bg-white</code> (n\u1EC1n tr\u1EAFng).</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\u1EBB <code>.card</code> c\xF3 padding <b>16px</b> m\u1ECDi ph\xEDa, bo g\xF3c <b>8px</b>, c\xF3 \u0111\u1ED5 b\xF3ng v\xE0 n\u1EC1n tr\u1EAFng.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <!-- TODO: th\xEAm class Tailwind cho th\u1EBB -->
    <div class="card">
      <h3>Kho\xE1 h\u1ECDc Angular</h3>
      <p>27 b\xE0i \xB7 c\xF3 b\xE0i luy\u1EC7n t\u1EADp</p>
    </div>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <div class="card p-4 rounded-lg shadow-md bg-white">
      <h3>Kho\xE1 h\u1ECDc Angular</h3>
      <p>27 b\xE0i \xB7 c\xF3 b\xE0i luy\u1EC7n t\u1EADp</p>
    </div>
  \`,
})
class App {}

mount(App);
`,hint:`Thêm vào class của thẻ: p-4 rounded-lg shadow-md bg-white.`,explain:`Thang khoảng cách của Tailwind: mỗi đơn vị là 0,25rem (4px), nên p-4 = 16px, p-6 = 24px. Giữ class "card" chỉ để dễ đọc và để bài kiểm tra tìm thẻ.`,check(n){let t=n.query(`.card`)[0];if(!t)return s(`Không thấy phần tử .card.`);let o=[`padding-top`,`padding-right`,`padding-bottom`,`padding-left`].map(a=>e(t,a));return o.some(a=>a!==`16px`)?s(`Padding đang là `+o.join(` `)+`, cần 16px mọi phía (p-4).`):e(t,`border-top-left-radius`)!==`8px`?s(`Bo góc đang là `+e(t,`border-top-left-radius`)+`, cần 8px (rounded-lg).`):e(t,`box-shadow`)===`none`?s(`Thẻ chưa có đổ bóng (shadow-md).`):e(t,`background-color`)!==`rgb(255, 255, 255)`?s(`Nền đang là `+e(t,`background-color`)+`, cần trắng (bg-white).`):i()}},{id:`flex-gap`,group:`Bố cục`,title:`Xếp hàng ngang: flex + gap`,level:`Dễ`,lv:1,waitMs:500,desc:`<p>B\u1ED1 c\u1EE5c h\xE0ng ngang l\xE0 vi\u1EC7c l\xE0m h\u1EB1ng ng\xE0y: <code>flex</code> x\u1EBFp c\xE1c con theo h\xE0ng, <code>items-center</code> c\u0103n gi\u1EEFa theo chi\u1EC1u d\u1ECDc, <code>gap-2</code> t\u1EA1o kho\u1EA3ng c\xE1ch 8px gi\u1EEFa c\xE1c con (kh\xF4ng c\u1EA7n margin cho t\u1EEBng ph\u1EA7n t\u1EED), <code>justify-between</code> \u0111\u1EA9y hai \u0111\u1EA7u ra xa.</p>
<p><b>Y\xEAu c\u1EA7u:</b> thanh <code>.toolbar</code> l\xE0 flex, c\u0103n gi\u1EEFa theo chi\u1EC1u d\u1ECDc, kho\u1EA3ng c\xE1ch gi\u1EEFa c\xE1c n\xFAt l\xE0 <b>8px</b>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <!-- TODO: c\xE1c n\xFAt \u0111ang x\u1EBFp ch\u1ED3ng l\xEAn nhau theo chi\u1EC1u d\u1ECDc -->
    <div class="toolbar">
      <button class="block">L\u01B0u</button>
      <button class="block">Hu\u1EF7</button>
      <button class="block">Xo\xE1</button>
    </div>
  \`,
})
class App {}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <div class="toolbar flex items-center gap-2">
      <button>L\u01B0u</button>
      <button>Hu\u1EF7</button>
      <button>Xo\xE1</button>
    </div>
  \`,
})
class App {}

mount(App);
`,hint:`Gắn flex items-center gap-2 cho .toolbar (và bỏ class block ở các nút, không bắt buộc).`,explain:`Muốn tự xuống dòng khi hẹp thì thêm flex-wrap; xếp theo cột thì flex-col; nhiều cột đều nhau thì grid grid-cols-3 gap-4.`,check(n){let t=n.query(`.toolbar`)[0];return t?e(t,`display`)!==`flex`?s(`.toolbar đang có display: `+e(t,`display`)+`, cần flex.`):e(t,`align-items`)!==`center`?s(`Chưa căn giữa theo chiều dọc (items-center).`):e(t,`column-gap`)!==`8px`?s(`Khoảng cách giữa các nút đang là `+e(t,`column-gap`)+`, cần 8px (gap-2).`):i():s(`Không thấy .toolbar.`)}},{id:`disabled-variant`,group:`Biến thể`,title:`Trạng thái nút: disabled:`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Ti\u1EC1n t\u1ED1 bi\u1EBFn th\u1EC3 \xE1p class theo tr\u1EA1ng th\xE1i: <code>hover:</code>, <code>focus-visible:</code>, <code>disabled:</code>, <code>dark:</code>, <code>md:</code>\u2026 V\xED d\u1EE5 <code>disabled:opacity-50</code> ch\u1EC9 c\xF3 t\xE1c d\u1EE5ng khi n\xFAt c\xF3 thu\u1ED9c t\xEDnh <code>disabled</code>, n\xEAn kh\xF4ng c\u1EA7n t\u1EF1 \u0111\u1ED5i class b\u1EB1ng code.</p>
<p><b>Y\xEAu c\u1EA7u:</b> khi \xF4 t\xEAn tr\u1ED1ng, n\xFAt <b>G\u1EEDi</b> b\u1ECB <code>disabled</code> v\xE0 m\u1EDD \u0111i (opacity <b>0.5</b>), con tr\u1ECF l\xE0 <code>not-allowed</code>; khi \u0111\xE3 nh\u1EADp t\xEAn, n\xFAt r\xF5 l\u1EA1i (opacity 1).</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="T\xEAn" [value]="name()" (input)="name.set($any($event.target).value)" />
    <!-- TODO: n\xFAt tr\xF4ng v\u1EABn nh\u01B0 b\xECnh th\u01B0\u1EDDng khi b\u1ECB disabled -->
    <button class="send rounded bg-indigo-600 px-4 py-2 text-white" [disabled]="!name()">G\u1EEDi</button>
  \`,
})
class App {
  name = signal('');
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <input placeholder="T\xEAn" [value]="name()" (input)="name.set($any($event.target).value)" />
    <button
      class="send rounded bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      [disabled]="!name()">
      G\u1EEDi
    </button>
  \`,
})
class App {
  name = signal('');
}

mount(App);
`,hint:`Thêm disabled:opacity-50 disabled:cursor-not-allowed vào class của nút.`,explain:`Làm bằng biến thể thì giao diện luôn khớp với thuộc tính disabled thật. Nếu tự đổi class bằng [class.opacity-50]="!name()" thì rất dễ quên đồng bộ với [disabled].`,simulate(n){n.at(200,()=>n.dom(t=>{let o=t.querySelector(`.send`);t.setAttribute(`data-op`,e(o??void 0,`opacity`)),t.setAttribute(`data-cur`,e(o??void 0,`cursor`))})),n.at(250,()=>n.type(0,`Bíp`))},check(n){let t=n.root();if(t?.getAttribute(`data-op`)!==`0.5`)return s(`Khi ô tên trống, opacity của nút đang là `+t?.getAttribute(`data-op`)+`, cần 0.5.`);if(t?.getAttribute(`data-cur`)!==`not-allowed`)return s(`Khi bị disabled, con trỏ cần là not-allowed (disabled:cursor-not-allowed).`);let o=e(n.query(`.send`)[0],`opacity`);return o===`1`?i():s(`Đã nhập tên mà opacity vẫn là `+o+`: chỉ được mờ khi bị disabled.`)}},{id:`class-dong`,group:`Class động`,title:`Không ghép tên class bằng chuỗi`,level:`Trung bình`,lv:2,waitMs:700,desc:`<p>Tailwind ch\u1EC9 sinh CSS cho nh\u1EEFng t\xEAn class <b>xu\u1EA5t hi\u1EC7n \u0111\u1EA7y \u0111\u1EE7</b> trong code (n\xF3 qu\xE9t file nh\u01B0 qu\xE9t v\u0103n b\u1EA3n, kh\xF4ng ch\u1EA1y code). Gh\xE9p chu\u1ED7i ki\u1EC3u <code>'text-' + color + '-600'</code> th\xEC trong code kh\xF4ng c\xF3 ch\u1EEF <code>text-green-600</code> n\xE0o, n\xEAn class \u0111\u01B0\u1EE3c g\u1EAFn v\xE0o DOM m\xE0 kh\xF4ng c\xF3 CSS.</p>
<p><b>Y\xEAu c\u1EA7u:</b> tr\u1EA1ng th\xE1i <code>.status</code> c\xF3 m\xE0u xanh l\xE1 (<code>text-green-600</code>) khi online, m\xE0u \u0111\u1ECF (<code>text-red-600</code>) khi offline. Khi ki\u1EC3m tra, trang b\u1EA5m <b>\u0110\u1ED5i tr\u1EA1ng th\xE1i</b>.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <p class="status" [class]="'status text-' + color() + '-600'">{{ online() ? 'Online' : 'Offline' }}</p>
    <button (click)="online.set(!online())">\u0110\u1ED5i tr\u1EA1ng th\xE1i</button>
  \`,
})
class App {
  online = signal(true);
  // \u2757 Tailwind kh\xF4ng th\u1EA5y t\xEAn class \u0111\u1EA7y \u0111\u1EE7 n\xE0o trong code
  color = computed(() => (this.online() ? 'green' : 'red'));
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <p class="status" [class]="statusClass()">{{ online() ? 'Online' : 'Offline' }}</p>
    <button (click)="online.set(!online())">\u0110\u1ED5i tr\u1EA1ng th\xE1i</button>
  \`,
})
class App {
  online = signal(true);
  statusClass = computed(() => (this.online() ? 'text-green-600' : 'text-red-600'));
}

mount(App);
`,hint:`Vi\u1EBFt \u0111\u1EE7 t\xEAn class: statusClass = computed(() => this.online() ? 'text-green-600' : 'text-red-600'), ho\u1EB7c [class.text-green-600]="online()" [class.text-red-600]="!online()".`,explain:`Quy tắc chung: ánh xạ giá trị sang tên class đầy đủ (object, switch, computed), không bao giờ ghép mảnh. Trong dự án thật, class nằm trong file .ts cũng được quét, miễn là viết đủ tên.`,simulate(n){n.at(200,()=>n.dom(t=>t.setAttribute(`data-c1`,e(t.querySelector(`.status`)??void 0,`color`)))),n.at(250,()=>n.click(`Đổi trạng thái`))},check(n){let t=n.query(`.status`)[0];if(!t)return s(`Không thấy .status (giữ class status trên thẻ p).`);let o=e(t.parentElement??void 0,`color`),a=n.root()?.getAttribute(`data-c1`)??``,d=e(t,`color`);return a===o?s(`Khi online, chữ vẫn mang màu mặc định: class màu được gắn nhưng Tailwind không sinh CSS cho nó.`):d===o||d===a?s(`Sau khi đổi sang offline, màu chữ chưa đổi sang đỏ.`):i()}},{id:`class-xung-dot`,group:`Class động`,title:`Hai class cùng thuộc tính: thứ tự không quyết định`,level:`Khó`,lv:3,waitMs:700,desc:`<p>Khi hai class c\xF9ng \u0111\u1EB7t m\u1ED9t thu\u1ED9c t\xEDnh, class n\xE0o th\u1EAFng ph\u1EE5 thu\u1ED9c v\xE0o <b>th\u1EE9 t\u1EF1 trong file CSS</b> Tailwind sinh ra, kh\xF4ng ph\u1EA3i th\u1EE9 t\u1EF1 trong thu\u1ED9c t\xEDnh <code>class</code>. Tailwind x\u1EBFp <code>px-6</code>/<code>py-4</code> (m\u1ED9t tr\u1EE5c) sau <code>p-2</code> (c\u1EA3 b\u1ED1n ph\xEDa), n\xEAn th\xEAm <code>p-2</code> l\xEAn m\u1ED9t ph\u1EA7n t\u1EED \u0111ang c\xF3 <code>px-6 py-4</code> s\u1EBD kh\xF4ng c\xF3 t\xE1c d\u1EE5ng.</p>
<p><b>Y\xEAu c\u1EA7u:</b> th\u1EBB <code>.item</code> th\u01B0\u1EDDng c\xF3 padding <b>16px 24px</b>; khi b\u1EADt <b>Thu g\u1ECDn</b>, padding ph\u1EA3i l\xE0 <b>8px</b> m\u1ECDi ph\xEDa. M\u1ED7i tr\u1EA1ng th\xE1i ch\u1EC9 g\u1EAFn m\u1ED9t b\u1ED9 class padding.</p>`,starter:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="compact.set(!compact())">Thu g\u1ECDn</button>
    <div class="item rounded border px-6 py-4" [class.p-2]="compact()">M\u1EE5c danh s\xE1ch</div>
  \`,
})
class App {
  compact = signal(false);
}

mount(App);
`,solution:`@Component({
  selector: 'app-root',
  template: \`
    <button (click)="compact.set(!compact())">Thu g\u1ECDn</button>
    <div class="item rounded border" [class]="compact() ? 'p-2' : 'px-6 py-4'">M\u1EE5c danh s\xE1ch</div>
  \`,
})
class App {
  compact = signal(false);
}

mount(App);
`,hint:`Kh\xF4ng ch\u1ED3ng p-2 l\xEAn px-6 py-4. Ch\u1ECDn m\u1ED9t trong hai b\u1ED9: [class]="compact() ? 'p-2' : 'px-6 py-4'" (class t\u0129nh item rounded border v\u1EABn \u0111\u01B0\u1EE3c gi\u1EEF).`,explain:`Trong component dùng chung (nút, thẻ), hãy để mỗi biến thể có trọn bộ class riêng thay vì "class gốc + class ghi đè". Thư viện như tailwind-merge giải quyết việc này tự động nếu bắt buộc phải ghép.`,simulate(n){n.at(200,()=>n.dom(t=>{let o=t.querySelector(`.item`)??void 0;t.setAttribute(`data-p1`,e(o,`padding-top`)+` `+e(o,`padding-left`))})),n.at(250,()=>n.click(`Thu gọn`))},check(n){let t=n.query(`.item`)[0];if(!t)return s(`Không thấy .item.`);let o=n.root()?.getAttribute(`data-p1`);if(o!==`16px 24px`)return s(`Trạng thái thường cần padding 16px 24px (đang là `+o+`).`);let a=e(t,`padding-top`)+` `+e(t,`padding-left`);return a===`8px 8px`?i():s(`Khi thu gọn, padding đang là `+a+`, cần 8px 8px: px-6/py-4 vẫn thắng p-2.`)}}],extras:()=>import(`./chunk-DY5_PMC6.js`).then(n=>n.tailwindExtras()),cheatsheet:[[`Khoảng cách`,`<code>p-4</code> = 16px, <code>px-6</code>, <code>mt-2</code> (1 đơn vị = 4px)`],[`Thẻ`,`<code>rounded-lg shadow-md bg-white</code>`],[`Hàng ngang`,`<code>flex items-center gap-2</code>`],[`Theo trạng thái`,`<code>hover:</code> <code>disabled:</code> <code>focus-visible:</code> <code>dark:</code> <code>md:</code>`],[`Class động`,`viết <b>đủ tên</b>: <code>ok() ? 'text-green-600' : 'text-red-600'</code>`],[`Biến thể`,`mỗi trạng thái một bộ class, không chồng class cùng thuộc tính`]]};export{p as LAB};