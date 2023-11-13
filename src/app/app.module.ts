import { registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizedComponent } from '@common/components/result/authorized/authorized.component';
import { ResultModule } from '@common/components/result/result.module';
import { UnauthorizeComponent } from '@common/components/result/unauthorize/unauthorize.component';
import { ShareModule } from '@common/share.module';
import { environment } from '@env';
import { provideFilebrowser } from '@weplanx/ng/filebrowser';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { AppComponent } from './app.component';
import { AppGuard } from './app.guard';
import { AppInterceptors } from './app.interceptors';

registerLocaleData(en);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'forget',
    loadChildren: () => import('./forget/forget.module').then(m => m.ForgetModule)
  },
  {
    path: 'unauthorize',
    component: UnauthorizeComponent
  },
  {
    path: 'authorized',
    component: AuthorizedComponent
  },
  {
    path: '',
    canActivate: [AppGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        data: {
          breadcrumb: `Admin`
        }
      },
      {
        path: 'x',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'filebrowser',
        loadChildren: () => import('./filebrowser/filebrowser.module').then(m => m.FilebrowserModule),
        data: {
          breadcrumb: `File Browser`
        }
      },
      {
        path: 'audit',
        loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule),
        data: {
          breadcrumb: `Audit`
        }
      },
      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    NzMessageModule,
    NzMenuModule,
    ShareModule,
    ResultModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptors, multi: true },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: NZ_CONFIG,
      useValue: <NzConfig>{
        notification: { nzPlacement: 'bottomRight' },
        card: { nzBordered: false },
        codeEditor: {
          assetsRoot: `${environment.cdn}/npm/monaco-editor@0.40.0/min`
        }
      }
    },
    provideFilebrowser({
      style: {
        default: {
          thumbnail: 'imageMogr2/thumbnail/400x/quality/90',
          placeholder: 'imageMogr2/thumbnail/400x/quality/50/blur/10x1'
        },
        processed: {
          thumbnail: '/quality/90',
          placeholder: '/quality/50/blur/10x1'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}