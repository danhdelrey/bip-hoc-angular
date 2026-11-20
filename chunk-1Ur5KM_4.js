import{t as D$1}from"./chunk-B68-oud0.js";import{t as ie$1}from"./chunk-cF89asWY.js";import"./chunk-CXFIc6_8.js";import{n as U$1,t as L}from"./chunk-WB0xaJ6p.js";import{n as C,t as B}from"./chunk-Bl-9tcWI.js";import{C as de,E as j$1,M as P,O as x,S as ce,_ as Pt,g as Bo,v as Sr,x as X$1,y as W}from"./main-PLPDKBOT.js";import"./chunk-CvKtqHTk.js";import"./chunk-D8MbWEO_.js";import{r as f,t as M}from"./chunk-BD58HAr3.js";import"./chunk-D-ZVesmq.js";import{p as Rn}from"./chunk-B02ANHUY.js";import"./chunk-CjKuaJoU.js";import{$ as Ib,$t as Qp,Ba as zp,Gn as Zw,I as Fs,Ia as yu,In as Yw,La as yw,Li as qc,Mr as fh,Mt as Mp,R as Fw,Rt as Np,Sn as Wc,St as LD,U as HD,V as Gc,Vn as Zc,Wn as Zt,Yr as ih,Zr as jD,_ as C$1,c as AE,fa as ur,ft as K2,gn as VD,k as Eb,mr as db,mt as KD,ni as jp,oi as kb,qr as iT,qt as PD,r as $e$1,tr as bT,u as Ai,wt as Lb,xa as wI,xi as mt,ya as vu}from"./chunk-tn7znALI.js";import{n as s,t as r}from"./chunk-DxqKAYlM.js";var De=[{id:1,name:`Áo mưa Bíp`,price:199e3,reviews:[`Nhẹ, gấp gọn`,`Màu đẹp`]},{id:2,name:`Ô gấp`,price:89e3,reviews:[`Chắc chắn`]},{id:3,name:`Ủng đi mưa`,price:259e3,reviews:[]}];var S=class t{list(){return De}get(n){return iT(De.find(e=>e.id===n)).pipe(bT(500))}static ɵfac=function(e){return new(e||t)};static ɵprov=ur({token:t,factory:t.ɵfac})};var Fe=()=>({sort:`ten`});var Be=()=>({sort:`gia`});var Ie=t=>[`sp`,t];var Ge=(t,n)=>n.id;function Ve(t,n){if(t&1&&(Ai(0,`li`)(1,`a`,1),Fw(2),Wc(),Fw(3),kb(4,`number`),Wc()),t&2){let e=n.$implicit;wI(),Np(`routerLink`,Eb(5,Ie,e.id)),wI(),Qp(e.name),wI(),Zc(` — `,Lb(4,3,e.price),`đ`)}}var q=class t{sort=K2();api=C$1(S);products=Zt(()=>{let n=[...this.api.list()];return this.sort()===`gia`?n.sort((e,o)=>e.price-o.price):n.sort((e,o)=>e.name.localeCompare(o.name))});static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-catalog-list`]],inputs:{sort:[1,`sort`]},decls:10,vars:4,consts:[[`routerLink`,`.`,3,`queryParams`],[3,`routerLink`]],template:function(e,o){e&1&&(Ai(0,`p`),Fw(1,`Sắp xếp: `),Ai(2,`a`,0),Fw(3,`tên`),Wc(),Fw(4,` · `),Ai(5,`a`,0),Fw(6,`giá`),Wc()(),Ai(7,`ul`),VD(8,Ve,5,7,`li`,null,Ge),Wc()),e&2&&(wI(2),Np(`queryParams`,Ib(2,Fe)),wI(3),Np(`queryParams`,Ib(3,Be)),wI(3),HD(o.products()))},dependencies:[Pt,Rn],encapsulation:2})};function qe(t,n){if(t&1&&(qc(0,`li`),Fw(1),Gc()),t&2){let e=n.$implicit;wI(),Qp(e)}}function Ue(t,n){t&1&&(qc(0,`li`),Fw(1,`Chưa có đánh giá`),Gc())}var U=class t{id=K2.required();product=K2.required();static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-product-detail`]],inputs:{id:[1,`id`],product:[1,`product`]},decls:17,vars:3,consts:[[`routerLink`,`mo-ta`,`routerLinkActive`,`on`],[`routerLink`,`danh-gia`,`routerLinkActive`,`on`],[`routerLink`,`sua`],[`routerLink`,`../..`]],template:function(e,o){e&1&&(Ai(0,`h3`),Fw(1),Ai(2,`small`),Fw(3),Wc()(),Ai(4,`nav`)(5,`a`,0),Fw(6,`Mô tả`),Wc(),Fw(7,` · `),Ai(8,`a`,1),Fw(9),Wc(),Fw(10,` · `),Ai(11,`a`,2),Fw(12,`Sửa`),Wc(),Fw(13,` · `),Ai(14,`a`,3),Fw(15,`← Danh sách`),Wc()(),Mp(16,`router-outlet`)),e&2&&(wI(),Zc(``,o.product().name,` `),wI(2),Zc(`(id = `,o.id(),`)`),wI(6),Zc(`Đánh giá (`,o.product().reviews.length,`)`))},dependencies:[Pt,Bo,Sr],encapsulation:2})};var j=class t{product=C$1(W).parent.snapshot.data.product;static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-product-info`]],decls:2,vars:1,template:function(e,o){e&1&&(qc(0,`p`),Fw(1),Gc()),e&2&&(wI(),Zc(`Giá: `,o.product.price,`đ. Hàng chính hãng Bíp.`))},encapsulation:2})};var $=class t{product=C$1(W).parent.snapshot.data.product;static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-product-reviews`]],decls:4,vars:1,template:function(e,o){e&1&&(qc(0,`ul`),VD(1,qe,2,1,`li`,null,jD,!1,Ue,2,0,`li`),Gc()),e&2&&(wI(),HD(o.product.reviews))},encapsulation:2})};function je(t,n){t&1&&(Ai(0,`small`),Fw(1,`● chưa lưu`),Wc())}function $e(t,n){if(t&1){let e=KD();Ai(0,`p`,3),Fw(1,`Có thay đổi chưa lưu. Rời trang? `),Ai(2,`button`,1),jp(`click`,function(){yu(e);let l=yw();return vu(l.answer(!0))}),Fw(3,`Rời đi`),Wc(),Ai(4,`button`,1),jp(`click`,function(){yu(e);let l=yw();return vu(l.answer(!1))}),Fw(5,`Ở lại`),Wc()()}}var H=class t{product=K2.required();name=fh(()=>this.product().name);saved=mt(!1);dirty=Zt(()=>!this.saved()&&this.name()!==this.product().name);asking=mt(!1);resolveAsk;router=C$1(de);route=C$1(W);save(){this.product().name=this.name(),this.saved.set(!0),this.router.navigate([`..`],{relativeTo:this.route})}canLeave(){return this.dirty()?(this.asking.set(!0),new Promise(n=>this.resolveAsk=n)):!0}answer(n){this.asking.set(!1),this.resolveAsk?.(n)}static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-product-edit`]],inputs:{product:[1,`product`]},decls:9,vars:3,consts:[[3,`input`,`value`],[`type`,`button`,3,`click`],[`routerLink`,`..`],[1,`ask`]],template:function(e,o){e&1&&(Ai(0,`label`),Fw(1,`Tên: `),Ai(2,`input`,0),jp(`input`,function(s){return o.name.set(s.target.value)}),Wc()(),Ai(3,`button`,1),jp(`click`,function(){return o.save()}),Fw(4,`Lưu`),Wc(),Ai(5,`a`,2),Fw(6,`Huỷ`),Wc(),LD(7,je,2,0,`small`),LD(8,$e,6,0,`p`,3)),e&2&&(wI(2),Np(`value`,o.name()),wI(5),PD(o.dirty()?7:-1),wI(),PD(o.asking()?8:-1))},dependencies:[Pt],encapsulation:2})};var ae=t=>C$1(S).get(Number(t.paramMap.get(`id`)));var Me=t=>t.canLeave();var Ne=[{path:``,component:q},{path:`sp/:id/sua`,component:H,resolve:{product:ae},canDeactivate:[Me]},{path:`sp/:id`,component:U,resolve:{product:ae},children:[{path:``,redirectTo:`mo-ta`,pathMatch:`full`},{path:`mo-ta`,component:j},{path:`danh-gia`,component:$}]}];var K=class t{router=C$1(de);loading=P(this.router.events.pipe(Fs(n=>n instanceof X$1||n instanceof x||n instanceof j$1||n instanceof ce),$e$1(n=>n instanceof X$1)),{initialValue:!1});url=P(this.router.events.pipe(Fs(n=>n instanceof x),$e$1(()=>this.router.url)),{initialValue:this.router.url});static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-catalog-shell`]],decls:3,vars:1,consts:[[1,`bar`]],template:function(e,o){e&1&&(Ai(0,`p`,0),Fw(1),Wc(),Mp(2,`router-outlet`)),e&2&&(wI(),Qp(o.loading()?`⏳ Đang chạy resolver…`:`✓ `+o.url()))},dependencies:[Sr],encapsulation:2})};var D={"catalog.routes.ts":`import type { Routes } from '@angular/router';
import { CatalogList } from './catalog-list';
import { ProductDetail, ProductInfo, ProductReviews } from './product-detail';
import { ProductEdit } from './product-edit';
import { productResolver, unsavedChangesGuard } from './route-fns';

export const CATALOG_ROUTES: Routes = [
  { path: '', component: CatalogList },
  {
    path: 'sp/:id/sua',
    component: ProductEdit,
    resolve: { product: productResolver },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'sp/:id',
    component: ProductDetail,
    resolve: { product: productResolver }, // \u2192 input product
    children: [
      { path: '', redirectTo: 'mo-ta', pathMatch: 'full' },
      { path: 'mo-ta', component: ProductInfo },
      { path: 'danh-gia', component: ProductReviews },
    ],
  },
];`,"route-fns.ts":`import { inject } from '@angular/core';
import type { CanDeactivateFn, ResolveFn } from '@angular/router';
import { type Product, ProductApi } from './product-api';

// Resolver: t\u1EA3i d\u1EEF li\u1EC7u XONG r\u1ED3i m\u1EDBi k\xEDch ho\u1EA1t route
export const productResolver: ResolveFn<Product> = (route) =>
  inject(ProductApi).get(Number(route.paramMap.get('id')));

// Guard r\u1EDDi trang: component t\u1EF1 quy\u1EBFt (c\xF3 th\u1EC3 h\u1ECFi ng\u01B0\u1EDDi d\xF9ng, tr\u1EA3 Promise)
export interface CanLeave {
  canLeave(): boolean | Promise<boolean>;
}
export const unsavedChangesGuard: CanDeactivateFn<CanLeave> = (component) => component.canLeave();`,"product-detail.ts":`import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import type { Product } from './product-api';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: \`
    <h3>{{ product().name }} <small>(id = {{ id() }})</small></h3>
    <nav>
      <a routerLink="mo-ta" routerLinkActive="on">M\xF4 t\u1EA3</a> \xB7
      <a routerLink="danh-gia" routerLinkActive="on">\u0110\xE1nh gi\xE1 ({{ product().reviews.length }})</a> \xB7
      <a routerLink="sua">S\u1EEDa</a> \xB7 <a routerLink="../..">\u2190 Danh s\xE1ch</a>
    </nav>
    <router-outlet /> <!-- outlet con: mo-ta ho\u1EB7c danh-gia -->
  \`,
})
export class ProductDetail {
  readonly id = input.required<string>(); // :id trong URL
  readonly product = input.required<Product>(); // t\u1EEB resolver
}

@Component({ selector: 'app-product-info', template: \`<p>Gi\xE1: {{ product.price }}\u0111. H\xE0ng ch\xEDnh h\xE3ng B\xEDp.</p>\` })
export class ProductInfo {
  // Route con \u0111\u1ECDc d\u1EEF li\u1EC7u \u0111\xE3 resolve c\u1EE7a route cha
  readonly product: Product = inject(ActivatedRoute).parent!.snapshot.data['product'];
}

@Component({
  selector: 'app-product-reviews',
  template: \`<ul>@for (r of product.reviews; track r) { <li>{{ r }}</li> } @empty { <li>Ch\u01B0a c\xF3 \u0111\xE1nh gi\xE1</li> }</ul>\`,
})
export class ProductReviews {
  readonly product: Product = inject(ActivatedRoute).parent!.snapshot.data['product'];
}`,"product-edit.ts":`import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Product } from './product-api';
import type { CanLeave } from './route-fns';

@Component({
  selector: 'app-product-edit',
  imports: [RouterLink],
  template: \`
    <label>T\xEAn: <input [value]="name()" (input)="name.set($any($event.target).value)" /></label>
    <button type="button" (click)="save()">L\u01B0u</button> <a routerLink="..">Hu\u1EF7</a>
    @if (dirty()) { <small>\u25CF ch\u01B0a l\u01B0u</small> }
    @if (asking()) {
      <p class="ask">C\xF3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u. R\u1EDDi trang?
        <button type="button" (click)="answer(true)">R\u1EDDi \u0111i</button>
        <button type="button" (click)="answer(false)">\u1EDE l\u1EA1i</button>
      </p>
    }
  \`,
})
export class ProductEdit implements CanLeave {
  readonly product = input.required<Product>();
  readonly name = linkedSignal(() => this.product().name);
  readonly saved = signal(false);
  readonly dirty = computed(() => !this.saved() && this.name() !== this.product().name);
  readonly asking = signal(false);
  private resolveAsk?: (ok: boolean) => void;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  save() {
    this.product().name = this.name(); // demo: "l\u01B0u" v\xE0o d\u1EEF li\u1EC7u gi\u1EA3
    this.saved.set(true);
    this.router.navigate(['..'], { relativeTo: this.route }); // \u0111i\u1EC1u h\u01B0\u1EDBng b\u1EB1ng code: /sp/:id/sua \u2192 /sp/:id
  }

  canLeave(): boolean | Promise<boolean> {
    if (!this.dirty()) return true;
    this.asking.set(true);
    return new Promise((resolve) => (this.resolveAsk = resolve));
  }

  answer(ok: boolean) {
    this.asking.set(false);
    this.resolveAsk?.(ok);
  }
}`,"catalog-list.ts":`import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductApi } from './product-api';

@Component({
  selector: 'app-catalog-list',
  imports: [RouterLink, DecimalPipe],
  template: \`
    <p>S\u1EAFp x\u1EBFp:
      <a routerLink="." [queryParams]="{ sort: 'ten' }">t\xEAn</a> \xB7
      <a routerLink="." [queryParams]="{ sort: 'gia' }">gi\xE1</a>
    </p>
    <ul>
      @for (p of products(); track p.id) {
        <li><a [routerLink]="['sp', p.id]">{{ p.name }}</a> \u2014 {{ p.price | number }}\u0111</li>
      }
    </ul>
  \`,
})
export class CatalogList {
  readonly sort = input<'ten' | 'gia'>(); // ?sort=... \u2192 input (withComponentInputBinding)
  private readonly api = inject(ProductApi);
  readonly products = computed(() => {
    const list = [...this.api.list()];
    return this.sort() === 'gia' ? list.sort((a, b) => a.price - b.price) : list.sort((a, b) => a.name.localeCompare(b.name));
  });
}`,"product-api.ts":`import { Service } from '@angular/core';
import { delay, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  reviews: string[];
}

const DATA: Product[] = [
  { id: 1, name: '\xC1o m\u01B0a B\xEDp', price: 199000, reviews: ['Nh\u1EB9, g\u1EA5p g\u1ECDn', 'M\xE0u \u0111\u1EB9p'] },
  { id: 2, name: '\xD4 g\u1EA5p', price: 89000, reviews: ['Ch\u1EAFc ch\u1EAFn'] },
  { id: 3, name: '\u1EE6ng \u0111i m\u01B0a', price: 259000, reviews: [] },
];

@Service()
export class ProductApi {
  list() {
    return DATA;
  }
  get(id: number) {
    return of(DATA.find((p) => p.id === id)!).pipe(delay(500)); // gi\u1EA3 l\u1EADp m\u1EA1ng ch\u1EADm
  }
}`};var Le={slug:`routing-advanced`,definition:`Routing nâng cao gồm các kỹ thuật điều khiển một lần điều hướng: đọc tham số từ URL, điều hướng bằng code, route lồng nhau, tải dữ liệu trước khi hiện trang (resolver) và chặn rời trang (canDeactivate).`,analogy:{text:`Ví dụ vẽ mỗi lần điều hướng như một chuyến tàu đi qua dãy trạm kiểm soát trước khi vào ga.`,map:[[`Đọc vé, tìm đường ray`,`Recognize: so URL với Routes, tách :id và ?query`],[`Trạm soát vé`,`Guard: canDeactivate (trang cũ), canActivate (trang mới)`],[`Trạm bốc hàng`,`Resolver: tải dữ liệu xong mới cho tàu chạy tiếp`],[`Vào ga`,`Activate: render component vào <router-outlet>`],[`Ga trong ga`,`route con + outlet lồng nhau`],[`Tàu quay đầu`,`NavigationCancel`]]},intro:`Mỗi lần điều hướng, Router chạy theo thứ tự: NavigationStart → khớp URL với cấu hình và tách params → chạy guard (canDeactivate của trang đang rời, canActivate của trang tới) → chạy resolver → kích hoạt component vào các outlet → NavigationEnd. Guard trả false (hoặc Promise false) thì điều hướng bị huỷ. Với withComponentInputBinding, :id, ?query và dữ liệu resolve được gán thẳng vào input() của component. Route có children cần một <router-outlet> riêng trong component cha để hiện route con.`,visualizer:{title:`Dãy trạm của một lần điều hướng`,hint:`Chọn một tình huống và bật/tắt resolver, canDeactivate. Step-player đi qua từng giai đoạn: URL được tách thành params, guard quyết định cho qua hay huỷ, resolver tải dữ liệu, rồi component hiện ra trong các outlet lồng nhau.`},code:[{name:`catalog.routes.ts`,lang:`typescript`,code:D[`catalog.routes.ts`],anchors:{10:`recognize`,12:`resolve`,13:`guard`,16:`recognize`,18:`resolve`,19:`nested`,20:`nested`,21:`nested`,22:`nested`}},{name:`route-fns.ts`,lang:`typescript`,code:D[`route-fns.ts`],anchors:{6:`resolve`,7:`resolve`,11:`guard`,13:`guard`}},{name:`product-detail.ts`,lang:`angular-ts`,code:D[`product-detail.ts`],anchors:{11:`nested`,12:`nested`,15:`activate`,19:`params`,20:`resolve`,26:`nested`,34:`nested`}},{name:`product-edit.ts`,lang:`angular-ts`,code:D[`product-edit.ts`],anchors:{34:`navigate`,37:`guard`,38:`guard`,39:`guard`,40:`guard`,45:`guard`}},{name:`catalog-list.ts`,lang:`angular-ts`,code:D[`catalog-list.ts`],anchors:{11:`params`,12:`params`,16:`params`,22:`params`}},{name:`router-api.ts`,lang:`typescript`,code:`// app.config.ts \u2014 b\u1EADt \u0111\u1EC3 params, query params v\xE0 d\u1EEF li\u1EC7u resolve \u0111\u1ED5 th\u1EB3ng v\xE0o input()
provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules));

// \u0110\u1ECDc params b\u1EB1ng ActivatedRoute (khi kh\xF4ng d\xF9ng input binding)
const id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('id'))));

// \u0110i\u1EC1u h\u01B0\u1EDBng b\u1EB1ng code
router.navigate(['/sp', 3], { queryParams: { tab: 'danh-gia' } }); // tuy\u1EC7t \u0111\u1ED1i
router.navigate(['..'], { relativeTo: route });                    // t\u01B0\u01A1ng \u0111\u1ED1i v\u1EDBi route hi\u1EC7n t\u1EA1i
router.navigateByUrl('/dang-nhap?quay-lai=/gio-hang');

// Theo d\xF5i v\xF2ng \u0111\u1EDDi \u0111i\u1EC1u h\u01B0\u1EDBng
router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => track());`,anchors:{2:`params`,5:`params`,8:`navigate`,9:`navigate`,10:`navigate`,13:`activate`}}],liveNote:`Router thật với route con: URL trên thanh địa chỉ đổi theo. Mở một sản phẩm (resolver chờ 0,5 giây), chuyển tab Mô tả / Đánh giá (outlet lồng nhau), vào Sửa, gõ vài chữ rồi bấm "Huỷ" để gặp canDeactivate.`,challenges:[{id:`ra-param`,title:`Điều hướng tới sản phẩm 3 kèm ?tab=danh-gia và xem tham số được tách ra.`,hint:`Chọn tình huống mở sản phẩm từ danh sách.`,praise:`Đúng! :id và ?tab đều được đổ thẳng vào input() của component.`},{id:`ra-guard`,title:`Chặn được việc rời trang Sửa khi còn thay đổi chưa lưu.`,hint:`Bật canDeactivate rồi chọn tình huống rời trang Sửa.`,praise:`Chuẩn! Guard trả false nên điều hướng bị huỷ (NavigationCancel), dữ liệu không mất.`},{id:`ra-resolve`,title:`Mở trang chi tiết mà không có khoảnh khắc "trang trống chờ dữ liệu".`,hint:`Cho dữ liệu được tải trước khi component được tạo.`,praise:`Hay! Resolver chạy trước Activate nên component nhận dữ liệu ngay từ đầu.`}],pitfalls:[{title:`Đọc params một lần trong constructor`,explain:`Đi từ /sp/1 sang /sp/2 Router tái sử dụng cùng component, constructor không chạy lại. Dùng input() (withComponentInputBinding) hoặc paramMap dạng Observable.`,wrong:{lang:`typescript`,code:`id = inject(ActivatedRoute).snapshot.paramMap.get('id'); // kẹt ở id cũ`},right:{lang:`typescript`,code:`id = input.required<string>(); // tự cập nhật khi URL đổi`}},{title:`Quên <router-outlet> cho route con`,explain:`Route có children chỉ hiện route con khi component cha có một <router-outlet> của riêng nó.`,wrong:{lang:`angular-html`,code:`<h3>{{ product().name }}</h3>
<a routerLink="danh-gia">\u0110\xE1nh gi\xE1</a>
<!-- kh\xF4ng c\xF3 outlet \u2192 b\u1EA5m link kh\xF4ng th\u1EA5y g\xEC -->`},right:{lang:`angular-html`,code:`<h3>{{ product().name }}</h3>
<a routerLink="danh-gia">\u0110\xE1nh gi\xE1</a>
<router-outlet />`}},{title:`Resolver chậm mà không có phản hồi`,explain:`Trong lúc resolver chạy, trang cũ vẫn hiện và người dùng tưởng bấm không ăn. Hiện chỉ báo tải khi có NavigationStart, hoặc với dữ liệu không bắt buộc thì tải trong component kèm skeleton.`,wrong:{lang:`typescript`,code:`resolve: { report: slowReportResolver } // 3 giây im lặng`},right:{lang:`typescript`,code:`loading = toSignal(router.events.pipe(
  filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd),
  map((e) => e instanceof NavigationStart),
));`}}],quiz:[{question:`Thứ tự đúng của một lần điều hướng?`,options:[`Resolve → Guard → Recognize → Activate`,`Recognize → Guard → Resolve → Activate`,`Activate → Resolve → Guard`,`Guard → Activate → Resolve`],correct:1,explain:`Khớp URL trước, rồi guard, resolver, cuối cùng mới tạo component.`},{question:`canDeactivate trả về false thì sao?`,options:[`Trang mới vẫn hiện nhưng có cảnh báo`,`Điều hướng bị huỷ, người dùng ở lại trang hiện tại`,`Router tải lại trang`,`Lỗi NullInjectorError`],correct:1,explain:`Router phát NavigationCancel và giữ nguyên URL, component hiện tại.`},{question:`Từ component trang Sửa (route sp/:id/sua) muốn quay về chi tiết sản phẩm bằng code?`,options:[`location.href = …`,`router.navigate(['..'], { relativeTo: route })`,`window.history.back() là cách duy nhất`,`Không làm được`],correct:1,explain:`navigate nhận mảng lệnh, có thể tương đối với ActivatedRoute hiện tại.`}],doneMessage:`Bạn đã điều khiển được từng trạm của Router: params, guard, resolver, route lồng nhau!`};var Te=(t,n)=>n.id;var Ke=(t,n)=>n[0];function Xe(t,n){if(t&1){let e=KD();Ai(0,`button`,22),jp(`click`,function(){let l=yu(e).$implicit,s=yw();return s.scenario.set(l.id),vu(s.run())}),Fw(1),Wc()}if(t&2){let e=n.$implicit,o=yw();zp(`chip-event`,o.scenario()===e.id)(`chip-plain`,o.scenario()!==e.id),wI(),Qp(e.label)}}function Qe(t,n){if(t&1&&(Ai(0,`li`,23),Fw(1),Wc()),t&2){let e=n.$implicit,o=yw(),l=Yw(0);zp(`cur`,l.stage===e.id)(`past`,o.passed(l.stage,e.id))(`cancel`,l.stage===`cancel`&&e.id===`guard`),Np(`appAnchor`,e.anchor),wI(),Qp(e.label)}}function Je(t,n){if(t&1&&(Ai(0,`tr`)(1,`th`),Fw(2),Wc(),Ai(3,`td`)(4,`code`),Fw(5),Wc()()()),t&2){let e=n.$implicit;wI(2),Qp(e[0]),wI(3),Qp(e[1])}}function We(t,n){if(t&1&&(Ai(0,`table`,15),VD(1,Je,6,2,`tr`,null,Ke),Wc()),t&2){yw();let e=Yw(0);wI(),HD(e.params)}}function Ye(t,n){t&1&&(Ai(0,`p`,16),Mp(1,`app-icon`,24),Fw(2,` NavigationCancel — URL và trang giữ nguyên`),Wc()),t&2&&(wI(),Np(`size`,16))}function Ze(t,n){t&1&&(Ai(0,`p`,20),Fw(1,`CatalogList: Áo mưa · Ô gấp · Ủng`),Wc())}function et(t,n){t&1&&(Ai(0,`span`,25),Fw(1,`● chưa lưu`),Wc())}function tt(t,n){t&1&&(Ai(0,`p`,26),Fw(1,`Có thay đổi chưa lưu. Rời trang? [Rời đi] [`),Ai(2,`b`),Fw(3,`Ở lại`),Wc(),Fw(4,`]`),Wc())}function nt(t,n){if(t&1&&(Ai(0,`p`,20),Fw(1,`ProductEdit — Tên: "Ủng đi mưa`),Ai(2,`b`),Fw(3,`!!!`),Wc(),Fw(4,`" `),LD(5,et,2,0,`span`,25),Wc(),LD(6,tt,5,0,`p`,26)),t&2){yw();let e=Yw(0);wI(5),PD(e.screen.dirty?5:-1),wI(),PD(e.prompt?6:-1)}}function at(t,n){t&1&&(Ai(0,`p`,20),Fw(1,`ProductDetail: `),Ai(2,`b`),Fw(3,`Ủng đi mưa`),Wc(),Fw(4,` · 259.000đ`),Wc())}function it(t,n){t&1&&(Ai(0,`p`,27),Fw(1,`ProductDetail: đang tải… (trang trống)`),Wc())}function rt(t,n){t&1&&(Ai(0,`p`,20),Fw(1,`ProductDetail`),Wc())}function ot(t,n){t&1&&(Ai(0,`p`,20),Fw(1,`ProductReviews: Chưa có đánh giá`),Wc())}function ct(t,n){t&1&&(Ai(0,`p`,20),Fw(1,`ProductInfo: Giá 259.000đ`),Wc())}function lt(t,n){if(t&1&&(LD(0,at,5,0,`p`,20)(1,it,2,0,`p`,27)(2,rt,2,0,`p`,20),Ai(3,`div`,28)(4,`span`,19),Fw(5,`<router-outlet> con`),Wc(),LD(6,ot,2,0,`p`,20),LD(7,ct,2,0,`p`,20),Wc()),t&2){yw();let e=Yw(0);PD(e.screen.data===`ready`?0:e.screen.data===`loading`?1:2),wI(6),PD(e.screen.child===`danh-gia`?6:-1),wI(),PD(e.screen.child===`mo-ta`?7:-1)}}var ie=[{id:`start`,label:`NavigationStart`,anchor:`navigate`},{id:`recognize`,label:`Recognize`,anchor:`recognize`},{id:`guard`,label:`Guards`,anchor:`guard`},{id:`resolve`,label:`Resolve`,anchor:`resolve`},{id:`activate`,label:`Activate`,anchor:`activate`},{id:`end`,label:`NavigationEnd`,anchor:`activate`}];var ut=[{id:`open`,label:`Mở sản phẩm 3 (tab đánh giá) từ danh sách`},{id:`tab`,label:`Đổi tab sang Mô tả (route con)`},{id:`leave`,label:`Rời trang Sửa khi chưa lưu`}];var X=class t{ctx=C$1(C);scenarios=ut;stages=ie;scenario=mt(`open`);useResolver=mt(!1);useGuard=mt(!1);tl=U$1({stage:null,url:`/`,params:[],screen:{page:`list`,child:null,data:`none`,dirty:!1},prompt:!1},{onEnter:n=>{this.ctx.stepAnchor.set(n.anchor??null);for(let e of(n.tag??``).split(` `).filter(Boolean))this.ctx.completeChallenge(e)}});passed(n,e){if(!n)return!1;let o=ie.map(l=>l.id);return n===`cancel`?o.indexOf(e)<o.indexOf(`guard`):o.indexOf(e)<o.indexOf(n)}run(){let n=[],e=this.scenario(),o=this.useResolver(),l=this.useGuard(),s$1,u=(re,Oe,we={})=>{s$1=s(r(r({},s$1),re),{screen:r(r({},s$1.screen),re.screen??{})}),n.push(r({frame:s$1,caption:Oe,anchor:ie.find(ze=>ze.id===s$1.stage)?.anchor,duration:1200},we))};e===`open`?(s$1={stage:null,url:`/`,params:[],screen:{page:`list`,child:null,data:`none`,dirty:!1},prompt:!1},u({stage:`start`,url:`/sp/3/danh-gia?tab=danh-gia`},`Bấm link: Router phát NavigationStart với URL mới.`),u({stage:`recognize`,params:[[`:id`,`3`],[`?tab`,`danh-gia`],[`route`,`sp/:id → danh-gia`]]},`Recognize: khớp "sp/:id" rồi route con "danh-gia"; tách id = 3 và query tab = danh-gia.`,{tag:`ra-param`}),u({stage:`guard`},`Guards: trang danh sách không có canDeactivate, route mới không có canActivate → cho qua.`),o?(u({stage:`resolve`},`Resolve: productResolver tải sản phẩm 3 (0,5 giây). Trang cũ vẫn hiện trong lúc chờ.`,{duration:1500}),u({stage:`activate`,screen:{page:`detail`,child:`danh-gia`,data:`ready`}},`Activate: ProductDetail được tạo với input product ĐÃ có dữ liệu; outlet con hiện ProductReviews.`,{sound:`pop`,tag:`ra-resolve`})):(u({stage:`activate`,screen:{page:`detail`,child:`danh-gia`,data:`loading`}},`Không có resolver: component hiện ngay nhưng chưa có dữ liệu → trang trống, phải tự tải trong component.`,{sound:`boop`}),u({screen:{data:`ready`}},`0,5 giây sau dữ liệu mới về và trang "nhảy" nội dung.`)),u({stage:`end`},`NavigationEnd: URL đã cập nhật, :id và ?tab được gán vào input() nhờ withComponentInputBinding.`,{sound:`ting`})):e===`tab`?(s$1={stage:null,url:`/sp/3/danh-gia`,params:[[`:id`,`3`]],screen:{page:`detail`,child:`danh-gia`,data:`ready`,dirty:!1},prompt:!1},u({stage:`start`,url:`/sp/3/mo-ta`},`Bấm tab "Mô tả": NavigationStart tới /sp/3/mo-ta.`),u({stage:`recognize`,params:[[`:id`,`3`],[`route`,`sp/:id → mo-ta`]]},`Recognize: route cha sp/:id KHÔNG đổi (cùng id), chỉ route con đổi từ danh-gia sang mo-ta.`),u({stage:`guard`},`Guards: không có guard nào chặn.`),o&&u({stage:`resolve`},`Resolve: params của route cha không đổi nên resolver mặc định KHÔNG chạy lại.`),u({stage:`activate`,screen:{child:`mo-ta`}},`Activate: ProductDetail được giữ nguyên; chỉ outlet con thay ProductReviews bằng ProductInfo.`,{sound:`pop`}),u({stage:`end`},`NavigationEnd: route lồng nhau giúp chỉ một phần màn hình thay đổi.`,{sound:`ting`})):(s$1={stage:null,url:`/sp/3/sua`,params:[[`:id`,`3`]],screen:{page:`edit`,child:null,data:`ready`,dirty:!0},prompt:!1},u({stage:`start`,url:`/`},`Đang sửa dở (chưa lưu) thì bấm "← Danh sách": NavigationStart tới /.`),u({stage:`recognize`,params:[[`route`,`(trang danh sách)`]]},`Recognize: khớp route danh sách.`),l?(u({stage:`guard`,prompt:!0},`Guards: unsavedChangesGuard gọi component.canLeave(). Có thay đổi chưa lưu → hiện câu hỏi, Router chờ Promise.`,{duration:1600}),u({stage:`cancel`,prompt:!1,url:`/sp/3/sua`},`Người dùng chọn "Ở lại" → Promise trả false → NavigationCancel. Thay đổi vẫn còn nguyên.`,{sound:`ting`,tag:`ra-guard`,anchor:`guard`})):(u({stage:`guard`},`Guards: route Sửa không có canDeactivate → cho qua ngay.`),u({stage:`activate`,screen:{page:`list`,dirty:!1}},`Activate: ProductEdit bị huỷ, dòng "!!!" vừa gõ biến mất mà không hỏi một câu.`,{sound:`boop`}),u({stage:`end`},`NavigationEnd: người dùng mất thay đổi chưa lưu.`,{sound:`boop`}))),this.tl.load(n)}static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-routing-advanced-visualizer`]],decls:34,vars:10,consts:[[1,`top`],[`role`,`group`,`aria-label`,`Tình huống`,1,`group`],[`type`,`button`,1,`chip`,3,`chip-event`,`chip-plain`],[1,`group`,`opts`],[`appAnchor`,`resolve`],[`type`,`checkbox`,3,`change`,`checked`],[`appAnchor`,`guard`],[`type`,`button`,1,`btn`,`btn-sm`,`btn-primary`,3,`click`],[`name`,`play`,3,`size`],[`aria-label`,`Các giai đoạn điều hướng`,1,`pipe`],[3,`cur`,`past`,`cancel`,`appAnchor`],[1,`stage`],[1,`left`],[`appAnchor`,`params`,1,`urlbar`],[`name`,`link`,3,`size`],[`aria-label`,`Tham số đã tách`,1,`params`],[1,`cancel-msg`],[`aria-label`,`Màn hình ứng dụng`,1,`screen`],[`appAnchor`,`activate`,1,`outlet`,`o1`],[1,`tag`],[1,`pg`],[3,`timeline`],[`type`,`button`,1,`chip`,3,`click`],[3,`appAnchor`],[`name`,`error`,3,`size`],[1,`dirty`],[1,`ask`],[1,`pg`,`loading`],[`appAnchor`,`nested`,1,`outlet`,`o2`]],template:function(e,o){if(e&1&&(ih(0),Ai(1,`div`,0)(2,`div`,1),VD(3,Xe,2,5,`button`,2,Te),Wc(),Ai(5,`div`,3)(6,`label`,4)(7,`input`,5),jp(`change`,function(){return o.useResolver.set(!o.useResolver())}),Wc(),Fw(8,` resolve: productResolver`),Wc(),Ai(9,`label`,6)(10,`input`,5),jp(`change`,function(){return o.useGuard.set(!o.useGuard())}),Wc(),Fw(11,` canDeactivate: unsavedChangesGuard`),Wc(),Ai(12,`button`,7),jp(`click`,function(){return o.run()}),Mp(13,`app-icon`,8),Fw(14,` Điều hướng`),Wc()()(),Ai(15,`ol`,9),VD(16,Qe,2,8,`li`,10,Te),Wc(),Ai(18,`div`,11)(19,`div`,12)(20,`div`,13),Mp(21,`app-icon`,14),Ai(22,`code`),Fw(23),Wc()(),LD(24,We,3,0,`table`,15),LD(25,Ye,3,1,`p`,16),Wc(),Ai(26,`div`,17)(27,`div`,18)(28,`span`,19),Fw(29,`<router-outlet>`),Wc(),LD(30,Ze,2,0,`p`,20)(31,nt,7,2)(32,lt,8,3),Wc()()(),Mp(33,`app-step-player`,21)),e&2){let l,s=Zw(o.tl.frame());wI(3),HD(o.scenarios),wI(4),Np(`checked`,o.useResolver()),wI(3),Np(`checked`,o.useGuard()),wI(3),Np(`size`,14),wI(3),HD(o.stages),wI(5),Np(`size`,14),wI(2),Qp(s.url),wI(),PD(s.params.length?24:-1),wI(),PD(s.stage===`cancel`?25:-1),wI(5),PD((l=s.screen.page)===`list`?30:l===`edit`?31:l===`detail`?32:-1),wI(3),Np(`timeline`,o.tl)}},dependencies:[L,M,B],styles:[`[_nghost-%COMP%]{display:block}.top[_ngcontent-%COMP%]{display:grid;gap:10px;padding:16px 22px 6px}.group[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.group[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]{cursor:pointer}.opts[_ngcontent-%COMP%]{gap:8px 16px;font-size:var(--%NS%fs-sm);font-weight:500}.opts[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:flex;gap:6px;align-items:center;cursor:pointer;padding:2px 6px;border-radius:6px;font-family:var(--%NS%font-mono);font-size:12.5px}.opts[_ngcontent-%COMP%]   label.is-hl[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%c-signal) 30%,transparent)}.pipe[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:0;margin:8px 22px;padding:0;list-style:none}.pipe[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{position:relative;flex:1 1 110px;padding:7px 10px 7px 18px;font-size:12px;font-weight:600;text-align:center;color:var(--%NS%text-muted);background:var(--%NS%surface-sunken);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%,10px 50%);transition:background-color var(--%NS%dur)}.pipe[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:first-child{clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%);padding-left:10px}.pipe[_ngcontent-%COMP%]   li.past[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%c-data) 30%,var(--%NS%surface));color:var(--%NS%text)}.pipe[_ngcontent-%COMP%]   li.cur[_ngcontent-%COMP%]{background:var(--%NS%c-primary);color:var(--%NS%on-primary)}.pipe[_ngcontent-%COMP%]   li.cancel[_ngcontent-%COMP%]{background:var(--%NS%c-error);color:var(--%NS%on-accent)}.pipe[_ngcontent-%COMP%]   li.is-hl[_ngcontent-%COMP%]{outline:2px solid var(--%NS%c-signal-strong);outline-offset:-2px}.stage[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:16px;padding:6px 22px 12px}.left[_ngcontent-%COMP%]{display:grid;gap:10px;align-content:start}.urlbar[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;padding:6px 10px;border:var(--%NS%border);border-radius:var(--%NS%radius-pill);background:var(--%NS%surface);overflow-wrap:anywhere}.urlbar[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{border:0;background:none;padding:0}.urlbar.is-hl[_ngcontent-%COMP%]{outline:2px solid var(--%NS%c-signal-strong)}.params[_ngcontent-%COMP%]{border-collapse:collapse;font-size:var(--%NS%fs-sm)}.params[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .params[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:4px 10px;border:1px solid var(--%NS%line);text-align:left}.params[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{font-weight:600;background:var(--%NS%surface-sunken)}.cancel-msg[_ngcontent-%COMP%]{display:flex;gap:6px;align-items:center;margin:0;padding:8px 10px;border-radius:var(--%NS%radius-sm);background:color-mix(in srgb,var(--%NS%c-error) 15%,var(--%NS%surface));color:var(--%NS%c-error-strong);font-weight:600;font-size:var(--%NS%fs-sm)}.screen[_ngcontent-%COMP%]{padding:10px;border:var(--%NS%border);border-radius:var(--%NS%radius);background:#fff;color:#111}.outlet[_ngcontent-%COMP%]{position:relative;padding:18px 10px 8px;border:1.5px dashed #94a3b8;border-radius:8px}.outlet.o2[_ngcontent-%COMP%]{margin-top:6px;border-color:#a78bfa}.outlet.is-hl[_ngcontent-%COMP%]{border-color:#eab308;background:#fefce8}.tag[_ngcontent-%COMP%]{position:absolute;top:2px;left:8px;font-family:ui-monospace,monospace;font-size:11px;color:#64748b}.pg[_ngcontent-%COMP%]{margin:2px 0;font-size:13px}.loading[_ngcontent-%COMP%]{color:#94a3b8;font-style:italic}.dirty[_ngcontent-%COMP%]{color:#b45309;font-size:12px}.ask[_ngcontent-%COMP%]{margin:6px 0 0;padding:4px 8px;background:#fef3c7;border-radius:6px;font-size:13px}@media(max-width:820px){.stage[_ngcontent-%COMP%]{grid-template-columns:minmax(0,1fr)}}`]})};var un=[{path:``,component:class t{meta=f(`routing-advanced`);content=Le;static ɵfac=function(e){return new(e||t)};static ɵcmp=AE({type:t,selectors:[[`app-routing-advanced-page`]],features:[db([C])],decls:5,vars:2,consts:[[`liveUrl`,`localhost:4200/cua-hang`,3,`meta`,`content`],[`slot`,`visualizer`],[`slot`,`live`,1,`live-plain`],[`slot`,`practice`,`slug`,`routing-advanced`]],template:function(e,o){e&1&&(Ai(0,`app-lesson-layout`,0),Mp(1,`app-routing-advanced-visualizer`,1),Ai(2,`div`,2),Mp(3,`app-catalog-shell`),Wc(),Mp(4,`app-practice-cta`,3),Wc()),e&2&&Np(`meta`,o.meta)(`content`,o.content)},dependencies:[ie$1,X,K,D$1],styles:[`.live-plain[_ngcontent-%COMP%]{font-family:system-ui,sans-serif}.live-plain[_ngcontent-%COMP%]     .bar{margin:0 0 8px;padding:4px 8px;background:#f1f5f9;border-radius:6px;font-family:ui-monospace,monospace;font-size:12px}.live-plain[_ngcontent-%COMP%]     a{color:#1d4ed8}.live-plain[_ngcontent-%COMP%]     a.on{font-weight:700;text-decoration:none}.live-plain[_ngcontent-%COMP%]     h3{margin:4px 0;font-size:1.05rem}.live-plain[_ngcontent-%COMP%]     input{padding:4px 8px;font:inherit;border:1px solid #888;border-radius:6px;background:#fff;color:#111}.live-plain[_ngcontent-%COMP%]     button{margin-left:4px;padding:3px 10px;font:inherit;border:1px solid #888;border-radius:6px;background:#f3f3f3;color:#111;cursor:pointer}.live-plain[_ngcontent-%COMP%]     .ask{padding:6px 8px;background:#fef3c7;border-radius:6px}`]})},children:Ne}];export{un as ROUTING_ADVANCED_ROUTES};